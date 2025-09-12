export interface AIInsight {
  device_id: string;
  timestamp: string;
  insight_type: 'anomaly' | 'forecast' | 'summary' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  ai_summary: string;
  confidence_score: number;
  affected_metrics: string[];
  recommendations?: string[];
  created_at: string;
  expires_at?: string;
  translations?: {
    [language: string]: {
      title?: string;
      description?: string;
      ai_summary?: string;
      recommendations?: string[];
    };
  };
}

export interface AIInsightsResponse {
  data: AIInsight[];
  total: number;
  last_updated: string;
}

export interface DeviceAnalytics {
  device_id: string;
  recent_data: {
    timestamp: string;
    ammonia: number;
    ph_value: number;
    salinity: number;
    temperature: number;
    turbidity: number;
  }[];
  insights: AIInsight[];
  health_score: number;
  last_anomaly?: AIInsight;
  next_maintenance?: string;
}

export interface SensorData {
  device_id: string;
  timestamp: string;
  temperature: number | null;
  ph_value: number | null;
  ammonia: number | null;
  turbidity: number | null;
  salinity: number | null;
}

export interface Threshold {
  device_id: string;
  parameter: string;
  min: number;
  max: number;
}

export interface Anomaly {
  metric: string;
  value: number;
  threshold_range: [number, number];
  deviation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}