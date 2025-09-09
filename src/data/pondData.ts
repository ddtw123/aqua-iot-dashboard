export interface PondData {
  timestamp: string;
  device_id: string;
  temp?: number;
  ph?: number;
  ammonia?: number;
  turbidity?: number;
  nitrate?: number;
  manganese?: number;
  do?: number;
  salinity?: number;
}

export interface PondSummary {
  pond_id: string;
  name: string;
  location: string;
  latestData: PondData;
  status: 'healthy' | 'warning' | 'critical';
  dataCount: number;
  averages: {
    temp: number;
    ph: number;
    do: number;
    ammonia: number;
    nitrate: number;
    manganese: number;
    turbidity: number;
    salinity: number;
  };
  trends: {
    temp: 'up' | 'down' | 'stable';
    ph: 'up' | 'down' | 'stable';
    do: 'up' | 'down' | 'stable';
    ammonia: 'up' | 'down' | 'stable';
  };
}


export const sensorKeyMap = {
  temp: "dashboard_detail.temp",
  ph: "dashboard_detail.ph",
  // do: "dashboard_detail.do",
  ammonia: "dashboard_detail.ammonia",
  // nitrate: "dashboard_detail.nitrate",
  // manganese: "dashboard_detail.manganese",
  turbidity: "dashboard_detail.turbidity",
  salinity: "dashboard_detail.salinity"
};

export const sensorUnits = {
  temp: "°C",
  ph: "",
  do: "mg/L",
  ammonia: "mg/L",
  manganese: "mg/L",
  nitrate: "ppm",
  turbidity: "NTU",
  salinity: "ppt"
};

export type SensorKey = keyof typeof sensorKeyMap;

let cachedFullData: PondData[] | null = null;

export function parseTimestamp(dateString: string): Date | null {
  // Expected: yyyy-mm-dd h:m:s
  // Allow single-digit hours/mins/seconds as well
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (match) {
    const [, year, month, day, hours, minutes, seconds] = match.map(Number);
    return new Date(year, (month as number) - 1, day, hours, minutes, seconds);
  }
  // Fallback try Date constructor
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
}

export async function loadFullPondData(params?: { deviceId?: string; limit?: number; start_ts?: string; end_ts?: string; force?: boolean; }): Promise<PondData[]> {
  if (cachedFullData && !params?.force) {
    return cachedFullData;
  }
  try {
    const query = new URLSearchParams();
    if (params?.deviceId) query.set('device_id', params.deviceId);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.start_ts) query.set('start_ts', params.start_ts);
    if (params?.end_ts) query.set('end_ts', params.end_ts);
    const url = `/api/sensor-data${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    const json = await response.json();
    const rows = Array.isArray(json?.data) ? (json.data as Array<Record<string, unknown>>) : [];

    const processedData: PondData[] = rows
      .map((row) => {
        const mapped: PondData = {
          timestamp: String(row.timestamp),
          device_id: String(row.device_id ?? ''),
          temp: toNumberOrUndefined(row.temperature),
          ph: toNumberOrUndefined(row.ph_value),
          ammonia: toNumberOrUndefined(row.ammonia),
          turbidity: toNumberOrUndefined(row.turbidity),
          nitrate: toNumberOrUndefined(row.nitrate),
          manganese: toNumberOrUndefined(row.manganese),
          do: toNumberOrUndefined(row.do),
          salinity: toNumberOrUndefined(row.salinity),
        };
        return mapped;
      })
      .filter((row) => parseTimestamp(row.timestamp) !== null)
      .sort((a, b) => {
        const ad = parseTimestamp(a.timestamp) as Date;
        const bd = parseTimestamp(b.timestamp) as Date;
        return bd.getTime() - ad.getTime();
      });

    cachedFullData = processedData;
    return processedData;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return [];
  }
}

// New function to get all data for the most recent date
export function getLatestDayData(data: PondData[]): PondData[] {
  if (data.length === 0) {
    return [];
  }

  // Get the most recent date
  const mostRecentDate = parseTimestamp(data[0].timestamp) as Date;
  
  // Filter data to include all entries from the most recent date
  return data.filter(item => {
    const itemDate = parseTimestamp(item.timestamp) as Date;
    return (
      itemDate.getFullYear() === mostRecentDate.getFullYear() &&
      itemDate.getMonth() === mostRecentDate.getMonth() &&
      itemDate.getDate() === mostRecentDate.getDate()
    );
  });
}

// Function to get the date range of the most recent data
export function getLatestDateRange(data: PondData[]): { startDate: Date; endDate: Date } {
  if (data.length === 0) {
    throw new Error('No data available');
  }

  const latestDayData = getLatestDayData(data);
  const sortedLatestDayData = [...latestDayData].sort((a, b) => 
    ((parseTimestamp(a.timestamp)?.getTime() || 0) - (parseTimestamp(b.timestamp)?.getTime() || 0))
  );

  return {
    startDate: parseTimestamp(sortedLatestDayData[0].timestamp) as Date,
    endDate: parseTimestamp(sortedLatestDayData[sortedLatestDayData.length - 1].timestamp) as Date
  };
}

function toNumberOrUndefined(val: unknown): number | undefined {
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
}