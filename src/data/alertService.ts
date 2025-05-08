// alertService.ts
import { loadFullPondData, PondData, SensorKey } from './pondData';
import { loadThresholdSettings } from '@/components/threshold-page/threshold-component/ThresholdSettings';

export interface Alert {
  id: string;
  timestamp: Date;
  pondId: string;
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
  
  if (type === 'below') {
    return `${parameterName} is too low: ${value} (threshold: ${threshold})`;
  } else {
    return `${parameterName} is too high: ${value} (threshold: ${threshold})`;
  }
}

export async function getAllAlerts(): Promise<Alert[]> {
  const pondData = await loadFullPondData();
  const thresholdSettings = loadThresholdSettings();
  const alerts: Alert[] = [];

  const parameters: SensorKey[] = [
    'temp', 'ph', 'do', 'ammonia', 'nitrate', 'manganese', 'turbidity'
  ];

  // Check each data point against thresholds
  pondData.forEach(data => {
    parameters.forEach(param => {
      const value = data[param] as number;
      
      if (value === undefined || value === null) {
        return; // Skip if parameter is missing
      }

      const thresholdConfig = thresholdSettings[param];
      const { isOutside, type, threshold } = isOutsideThreshold(value, thresholdConfig);

      if (isOutside && type) {
        alerts.push({
          id: `${data.pond_id}-${param}-${data.timestamp}`,
          timestamp: data.timestampDate as Date,
          pondId: data.pond_id,
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
      do: 0,
      ammonia: 0,
      nitrate: 0,
      manganese: 0,
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
    ['temp', 'ph', 'do', 'ammonia', 'nitrate', 'manganese', 'turbidity'].forEach(param => {
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