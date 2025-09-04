// alertService.ts
import { loadFullPondData, PondData, SensorKey, parseTimestamp } from './pondData';

export interface Alert {
  id: string;
  timestamp: Date;
  deviceId: string;
  parameter: SensorKey;
  value: number;
  thresholdType: 'below' | 'above';
  threshold: number;
  message: string;
}

export interface AlertSummary {
  totalAlerts: number;
  byParameter: Record<SensorKey, number>;
  byMonth: Record<string, number>;
}

function isOutsideThreshold(value: number, config: { min: number; max: number }): { 
  isOutside: boolean; 
  type: 'below' | 'above' | null;
  threshold: number;
} {
  if (value < config.min) {
    return { isOutside: true, type: 'below', threshold: config.min };
  }
  if (value > config.max) {
    return { isOutside: true, type: 'above', threshold: config.max };
  }
  return { isOutside: false, type: null, threshold: 0 };
}

function generateAlertMessage(parameter: SensorKey, value: number, type: 'below' | 'above', threshold: number): string {
  const parameterName = parameter.charAt(0).toUpperCase() + parameter.slice(1);
  return `${parameterName}|${value}|${type}|${threshold}`;
}

export async function getAllAlerts(): Promise<Alert[]> {
  const pondData = await loadFullPondData();
  const alerts: Alert[] = [];
  
  // Fetch thresholds per device (with fallback to defaults)
  const deviceIds = Array.from(new Set(pondData.map(d => d.device_id)));
  const thresholdByDevice: Record<string, Record<SensorKey, { min: number; max: number }>> = {};

  await Promise.all(deviceIds.map(async (id) => {
    thresholdByDevice[id] = await fetchDeviceThresholds(id);
  }));

  const parameters: SensorKey[] = [
    'temp', 'ph', 'ammonia', 'turbidity'
  ];

  pondData.forEach(data => {
    parameters.forEach(param => {
      const value = data[param] as number;
      
      if (value === undefined || value === null) {
        return;
      }

      const thresholdConfig = thresholdByDevice[data.device_id]?.[param] ?? DEFAULT_THRESHOLDS[param];
      const { isOutside, type, threshold } = isOutsideThreshold(value, thresholdConfig);

      if (isOutside && type) {
        alerts.push({
          id: `${data.device_id}-${param}-${data.timestamp}`,
          timestamp: (parseTimestamp(data.timestamp) as Date),
          deviceId: data.device_id,
          parameter: param,
          value: value,
          thresholdType: type,
          threshold: threshold,
          message: generateAlertMessage(param, value, type, threshold)
        });
      }
    });
  });

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getLatestDayAlerts(): Promise<Alert[]> {
  const allAlerts = await getAllAlerts();
  
  if (allAlerts.length === 0) {
    return [];
  }
  
  const mostRecentDate = allAlerts[0].timestamp;
  
  return allAlerts.filter(alert => {
    return (
      alert.timestamp.getFullYear() === mostRecentDate.getFullYear() &&
      alert.timestamp.getMonth() === mostRecentDate.getMonth() &&
      alert.timestamp.getDate() === mostRecentDate.getDate()
    );
  });
}

export async function getAlertSummary(): Promise<AlertSummary> {
  const allAlerts = await getAllAlerts();
  
  const summary: AlertSummary = {
    totalAlerts: allAlerts.length,
    byParameter: {
      temp: 0,
      ph: 0,
      ammonia: 0,
      turbidity: 0
    },
    byMonth: {}
  };
  
  allAlerts.forEach(alert => {
    summary.byParameter[alert.parameter]++;
    
    const monthKey = `${alert.timestamp.getMonth() + 1}/${alert.timestamp.getFullYear()}`;
    summary.byMonth[monthKey] = (summary.byMonth[monthKey] || 0) + 1;
  });
  
  return summary;
}

export async function getMonthlyAlertStats(): Promise<{ 
  currentMonth: string; 
  currentValue: number; 
  previousMonth: string; 
  previousValue: number; 
  difference: number 
}> {
  const allAlerts = await getAllAlerts();
  
  if (allAlerts.length === 0) {
    return {
      currentMonth: 'N/A',
      currentValue: 0,
      previousMonth: 'N/A',
      previousValue: 0,
      difference: 0
    };
  }
  
  const latestDate = allAlerts[0].timestamp;
  const latestMonth = latestDate.getMonth();
  const latestYear = latestDate.getFullYear();
  
  const currentMonth = new Date(latestYear, latestMonth).toLocaleString('default', { month: 'short' }) + ' ' + latestYear;
  const previousMonth = new Date(latestYear, latestMonth - 1).toLocaleString('default', { month: 'short' }) + ' ' + (latestMonth === 0 ? latestYear - 1 : latestYear);
  
  const currentMonthAlerts = allAlerts.filter(alert => {
    return alert.timestamp.getMonth() === latestMonth && 
           alert.timestamp.getFullYear() === latestYear;
  });
  
  const previousMonthAlerts = allAlerts.filter(alert => {
    const prevMonth = latestMonth === 0 ? 11 : latestMonth - 1;
    const prevYear = latestMonth === 0 ? latestYear - 1 : latestYear;
    return alert.timestamp.getMonth() === prevMonth && 
           alert.timestamp.getFullYear() === prevYear;
  });
  
  const currentValue = currentMonthAlerts.length;
  const previousValue = previousMonthAlerts.length;
  
  const difference = (currentValue - previousValue);

  return {
    currentMonth,
    currentValue,
    previousMonth,
    previousValue,
    difference
  };
}

export async function getAlertProportion(): Promise<{ 
  percentage: number; 
  message: number 
}> {
  const pondData = await loadFullPondData();
  const allAlerts = await getAllAlerts();
  
  let totalReadings = 0;
  pondData.forEach(data => {
    ['temp', 'ph', 'ammonia', 'turbidity'].forEach(param => {
      if (data[param as keyof PondData] !== null && data[param as keyof PondData] !== undefined) {
        totalReadings++;
      }
    });
  });
  
  const messageCount = allAlerts.length;
  const percentage = totalReadings > 0 ? (messageCount / totalReadings) * 100 : 0;
  
  return {
    percentage: Math.round(percentage * 10) / 10,
    message: messageCount
  };
}

export async function getAlertsByCategory(): Promise<{ category: string; value: number }[]> {
  const summary = await getAlertSummary();
  
  return Object.entries(summary.byParameter).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    value
  })).filter(item => item.value > 0);
}

// ------- helpers: thresholds from API with defaults -------

const DEFAULT_THRESHOLDS: Record<SensorKey, { min: number; max: number }> = {
  temp: { min: 15, max: 30 },
  ph: { min: 5, max: 9 },
  ammonia: { min: 0, max: 0.25 },
  turbidity: { min: 25, max: 60 },
};

async function fetchDeviceThresholds(deviceId: string): Promise<Record<SensorKey, { min: number; max: number }>> {
  try {
    // auto_seed=1 will create defaults for a device with no rows
    const resp = await fetch(`/api/thresholds?device_id=${encodeURIComponent(deviceId)}&auto_seed=1`, { cache: 'no-store' });
    if (!resp.ok) throw new Error('threshold fetch failed');
    const json = await resp.json();
    const rawItems = (json?.items || []) as Array<{ parameter: string; min: number; max: number }>;
    const filtered = rawItems.filter((it) => ['temp','ph','ammonia','turbidity'].includes(it.parameter));
    const out: Record<SensorKey, { min: number; max: number }> = { ...DEFAULT_THRESHOLDS };
    filtered.forEach((it) => {
      const key = it.parameter as SensorKey;
      out[key] = { min: Number(it.min), max: Number(it.max) };
    });
    return out;
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}