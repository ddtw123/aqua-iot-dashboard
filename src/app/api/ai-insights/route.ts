import { dynamoClient, bedrockClient } from "@/lib/aws-config";
import { QueryCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextRequest } from "next/server";
import { AIInsight, AIInsightsResponse } from "@/types/aiInsights";

const AI_INSIGHTS_TABLE = process.env.AI_INSIGHTS_TABLE_NAME;
const SENSOR_TABLE = process.env.DYNAMO_TABLE_NAME;
const THRESHOLDS_TABLE = process.env.THRESHOLDS_TABLE_NAME;

// Type definitions for the function parameters and return values
interface SensorData {
  device_id: string;
  timestamp: string;
  temperature: number | null;
  ph_value: number | null;
  ammonia: number | null;
  turbidity: number | null;
  salinity: number | null;
}

interface Threshold {
  device_id: string;
  parameter: string;
  min: number;
  max: number;
}

interface Anomaly {
  metric: string;
  value: number;
  threshold_range: [number, number];
  deviation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

function detectAnomalies(sensorData: SensorData[], thresholds: Threshold[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const latestData = sensorData[0];

  const metricMapping = {
    'temperature': 'temp',
    'ph_value': 'ph', 
    'ammonia': 'ammonia',
    'turbidity': 'turbidity'
  } as const;
  
  Object.entries(metricMapping).forEach(([sensorField, thresholdParam]) => {
    const value = latestData[sensorField as keyof typeof metricMapping];
    if (value === null || value === undefined) return;
    
    // Convert to number and validate
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    // Find threshold for this parameter
    const threshold = thresholds.find(t => t.parameter === thresholdParam);
    if (!threshold) return;
    
    const { min, max } = threshold;
    
    if (numValue < min || numValue > max) {
      const severity: 'low' | 'medium' | 'high' | 'critical' = 
        numValue < min * 0.5 || numValue > max * 1.5 ? 'critical' : 
        numValue < min * 0.8 || numValue > max * 1.2 ? 'high' : 'medium';
      
      anomalies.push({
        metric: sensorField,
        value: numValue,
        threshold_range: [min, max],
        deviation: numValue < min ? 
          `${((min - numValue) / min * 100).toFixed(1)}% below minimum` :
          `${((numValue - max) / max * 100).toFixed(1)}% above maximum`,
        severity: severity
      });
    }
  });
  
  return anomalies;
}

// Generate AI summary using Bedrock
async function generateAISummary(deviceId: string, sensorData: SensorData[], anomalies: Anomaly[], thresholds: Threshold[]): Promise<string> {
  try {
    const latestData = sensorData[0];
    const metrics: (keyof SensorData)[] = ['ammonia', 'ph_value', 'salinity', 'temperature', 'turbidity'];
    
    const dataSummary = metrics.map(metric => {
      const value = latestData[metric];
      const numValue = value !== null && value !== undefined ? Number(value) : null;
      return `${metric}: ${numValue && !isNaN(numValue) ? numValue.toFixed(2) : 'N/A'}`;
    }).join(', ');
    
    const thresholdSummary = thresholds.map(t => 
      `${t.parameter}: ${t.min}-${t.max}`
    ).join(', ');
    
    const anomalySummary = anomalies.length > 0 
      ? `Threshold violations: ${anomalies.map(a => `${a.metric} = ${Number(a.value).toFixed(2)} (${a.deviation})`).join(', ')}`
      : 'All parameters within threshold ranges';
    
    const prompt = `Analyze this IoT sensor data for aquaculture device ${deviceId}:

Current readings: ${dataSummary}
Threshold ranges: ${thresholdSummary}
${anomalySummary}

Provide a brief 1-2 sentence summary of the device's current health status and any concerns. Focus on actionable insights for fish farming based on threshold violations.`;

    const command = new InvokeModelCommand({
      modelId: 'apac.amazon.nova-micro-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: 150,
          temperature: 0.1,
          topP: 0.9
        }
      })
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Handle different response formats for different models
    let aiSummaryText: string;
    if (responseBody.output && responseBody.output.message && responseBody.output.message.content) {
      // Amazon Nova format
      aiSummaryText = responseBody.output.message.content[0].text;
    } else if (responseBody.content && responseBody.content[0]) {
      // Anthropic Claude format
      aiSummaryText = responseBody.content[0].text;
    } else if (responseBody.completions && responseBody.completions[0]) {
      // Other model formats
      aiSummaryText = responseBody.completions[0].data.text;
    } else {
      // Fallback
      aiSummaryText = `Device ${deviceId} shows ${anomalies.length > 0 ? 'threshold violations' : 'normal readings'}. Monitor closely for any changes.`;
    }
    
    return aiSummaryText.trim();
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return `Device ${deviceId} shows ${anomalies.length > 0 ? 'threshold violations' : 'normal readings'}. Monitor closely for any changes.`;
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Validate environment variables first
    if (!AI_INSIGHTS_TABLE || !SENSOR_TABLE || !THRESHOLDS_TABLE) {
      return new Response(JSON.stringify({ 
        error: "Server configuration error: Missing required table names",
        details: {
          AI_INSIGHTS_TABLE: !!AI_INSIGHTS_TABLE,
          SENSOR_TABLE: !!SENSOR_TABLE,
          THRESHOLDS_TABLE: !!THRESHOLDS_TABLE
        }
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("device_id");
    const forceRefresh = searchParams.get("refresh") === "true";
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "device_id is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingCommand = new QueryCommand({
      TableName: AI_INSIGHTS_TABLE,
      KeyConditionExpression: "device_id = :deviceId",
      ExpressionAttributeValues: { ":deviceId": deviceId },
      Limit: limit,
      ScanIndexForward: false,
    });

    const existingResponse = await dynamoClient.send(existingCommand);
    const existingInsights = (existingResponse.Items || []) as AIInsight[];

    // Check if we need to generate new insights (once per day + manual refresh)
    const shouldGenerateNew = existingInsights.length === 0 || forceRefresh || 
      (existingInsights.length > 0 && 
       new Date().getTime() - new Date(existingInsights[0].created_at).getTime() > 24 * 60 * 60 * 1000); // 24 hours

    if (shouldGenerateNew) {
      try {
        // Fetch thresholds for this device
        const thresholdsCommand = new QueryCommand({
          TableName: THRESHOLDS_TABLE,
          KeyConditionExpression: "device_id = :deviceId",
          ExpressionAttributeValues: { ":deviceId": deviceId },
        });

        const thresholdsResponse = await dynamoClient.send(thresholdsCommand);
        const thresholds = (thresholdsResponse.Items || []) as Threshold[];

        const sensorCommand = new ScanCommand({
          TableName: SENSOR_TABLE,
          FilterExpression: "device_id = :deviceId",
          ExpressionAttributeValues: { ":deviceId": deviceId },
          Limit: 50,
        });

        const sensorResponse = await dynamoClient.send(sensorCommand);
        let sensorData = (sensorResponse.Items || []) as SensorData[];

        sensorData = sensorData.sort((a, b) => {
          const timestampA = new Date(a.timestamp || 0).getTime();
          const timestampB = new Date(b.timestamp || 0).getTime();
          return timestampB - timestampA; // Most recent first
        });

        if (sensorData.length > 0) {
          // Detect anomalies using thresholds
          const anomalies = detectAnomalies(sensorData, thresholds);
          
          const aiSummary = await generateAISummary(deviceId, sensorData, anomalies, thresholds);
          
          // Create new insight
          const timestamp = new Date().toISOString();
          const newInsight: AIInsight = {
            device_id: deviceId,
            timestamp: timestamp,
            insight_type: anomalies.length > 0 ? 'anomaly' : 'summary',
            severity: anomalies.length > 0 ? 
              (anomalies.some(a => a.severity === 'critical') ? 'critical' :
               anomalies.some(a => a.severity === 'high') ? 'high' : 'medium') : 'low',
            title: anomalies.length > 0 ? 
              `Threshold Alert: ${anomalies.map(a => a.metric).join(', ')}` : 
              'All Parameters Normal',
            description: anomalies.length > 0 
              ? `Threshold violations: ${anomalies.map(a => 
                  `${a.metric} = ${Number(a.value).toFixed(2)} (range: ${a.threshold_range[0]}-${a.threshold_range[1]}, ${a.deviation})`
                ).join(', ')}`
              : 'All sensor readings are within configured threshold ranges',
            ai_summary: aiSummary,
            confidence_score: anomalies.length > 0 ? 0.9 : 0.95,
            affected_metrics: anomalies.map(a => a.metric),
            recommendations: anomalies.length > 0 
              ? ['Check sensor calibration', 'Review threshold settings', 'Monitor water quality parameters', 'Consider adjusting feeding schedule']
              : ['Continue regular monitoring', 'Maintain current operational parameters'],
            created_at: timestamp,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };

          // Save new insight (this will overwrite any existing insight for this device)
          const putCommand = new PutCommand({
            TableName: AI_INSIGHTS_TABLE,
            Item: newInsight,
          });

          await dynamoClient.send(putCommand);

          const result: AIInsightsResponse = {
            data: [newInsight],
            total: 1,
            last_updated: new Date().toISOString(),
          };

          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (aiError) {
        console.error("Error generating AI insights:", aiError);
      }
    }

    const result: AIInsightsResponse = {
      data: existingInsights,
      total: existingInsights.length,
      last_updated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch AI insights" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { device_id, insight_type, severity, title, description, ai_summary, confidence_score, affected_metrics, recommendations } = body;

    if (!device_id || !insight_type || !title || !description) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const timestamp = new Date().toISOString();
    const insight: AIInsight = {
      device_id,
      timestamp,
      insight_type,
      severity: severity || 'medium',
      title,
      description,
      ai_summary: ai_summary || description,
      confidence_score: confidence_score || 0.8,
      affected_metrics: affected_metrics || [],
      recommendations: recommendations || [],
      created_at: timestamp,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    const command = new PutCommand({
      TableName: AI_INSIGHTS_TABLE,
      Item: insight,
    });

    await dynamoClient.send(command);

    return new Response(JSON.stringify({ success: true, insight }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating AI insight:", error);
    return new Response(JSON.stringify({ error: "Failed to create AI insight" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}