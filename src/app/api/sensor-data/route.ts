import { dynamoClient } from "@/lib/aws-config";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest } from "next/server";

const TABLE_NAME = process.env.DYNAMO_TABLE_NAME;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("device_id") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 100, 1000) : 500;
    const startTs = searchParams.get("start_ts") || undefined; // yyyy-mm-dd h:m:s
    const endTs = searchParams.get("end_ts") || undefined;

    let items: Record<string, unknown>[] = [];

    if (deviceId) {
      const keyConditionParts = ["device_id = :deviceId"] as string[];
      const exprValues: Record<string, string> = { ":deviceId": deviceId };

      if (startTs && endTs) {
        keyConditionParts.push("#ts BETWEEN :start AND :end");
        exprValues[":start"] = startTs;
        exprValues[":end"] = endTs;
      } else if (startTs) {
        keyConditionParts.push("#ts >= :start");
        exprValues[":start"] = startTs;
      } else if (endTs) {
        keyConditionParts.push("#ts <= :end");
        exprValues[":end"] = endTs;
      }

      const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: keyConditionParts.join(" AND "),
        ExpressionAttributeNames: { "#ts": "timestamp" },
        ExpressionAttributeValues: exprValues,
        Limit: limit,
        ScanIndexForward: false, 
      });

      const resp = await dynamoClient.send(command);
      items = (resp.Items ?? []) as Record<string, unknown>[];
    } else {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: limit,
      });
      const resp = await dynamoClient.send(command);
      items = (resp.Items ?? []) as Record<string, unknown>[];
    }

    const normalized = items.map((it) => ({
      timestamp: String(it.timestamp || ''),
      device_id: String(it.device_id || ''),
      ammonia: safeNumber(it.ammonia),
      ph_value: safeNumber(it.ph_value),
      salinity: safeNumber(it.salinity),
      temperature: safeNumber(it.temperature),
      turbidity: safeNumber(it.turbidity),
      // DO and others may be added in the future
    }));

    return new Response(JSON.stringify({ data: normalized }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/sensor-data error", err);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }
}

function safeNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}


