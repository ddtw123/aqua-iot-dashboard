import Papa from 'papaparse';

export interface PondData {
  timestamp: string; 
  ammonia: number;
  do: number;
  manganese: number;
  nitrate: number;
  ph: number;
  pond_id: string;
  temp: number;
  turbidity: number;
  date?: string;
  timestampDate?: Date | null;
}

export const sensorKeyMap = {
  temp: "dashboard_detail.temp",
  ph: "dashboard_detail.ph",
  do: "dashboard_detail.do",
  ammonia: "dashboard_detail.ammonia",
  nitrate: "dashboard_detail.nitrate",
  manganese: "dashboard_detail.manganese",
  turbidity: "dashboard_detail.turbidity"
};

export const sensorUnits = {
  temp: "°C",
  ph: "",
  do: "mg/L",
  ammonia: "mg/L",
  manganese: "mg/L",
  nitrate: "ppm",
  turbidity: "NTU"
};

export type SensorKey = keyof typeof sensorKeyMap;

let cachedFullData: PondData[] | null = null;

function parseCustomDate(dateString: string): Date | null {
  // Original regex
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  
  if (match) {
    const [, day, month, year, hours, minutes] = match.map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  // Alternative parsing if the first method fails
  const altMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2}):(\d{2})?$/);
  
  if (altMatch) {
    const [, day, month, year, hours, minutes = '00'] = altMatch;
    return new Date(
      parseInt(year), 
      parseInt(month) - 1, 
      parseInt(day), 
      parseInt(hours), 
      parseInt(minutes)
    );
  }

  console.error('Failed to parse timestamp:', dateString);
  return null;
}

export async function loadFullPondData(): Promise<PondData[]> {
  if (cachedFullData) {
    return cachedFullData;
  }
  
  try {
    const response = await fetch('/Ponds01.csv');
    const csvText = await response.text();
    
    const results = Papa.parse<PondData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });
    
    const processedData = results.data
      .map(row => {
        const date = parseCustomDate(row.timestamp);
        return {
          ...row,
          date: date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : "Invalid Date",
          timestampDate: date
        };
      })
      .filter(row => {
        return row.timestampDate !== null;
      })
      // Sort by timestamp, newest first
      .sort((a, b) => (b.timestampDate as Date).getTime() - (a.timestampDate as Date).getTime());
    
    // Cache the sorted data
    cachedFullData = processedData;
    return processedData;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return [];
  }
}

// New function to get all data for the most recent date
export function getLatestDayData(data: PondData[]): PondData[] {
  if (data.length === 0) {
    return [];
  }

  // Get the most recent date
  const mostRecentDate = data[0].timestampDate as Date;
  
  // Filter data to include all entries from the most recent date
  return data.filter(item => {
    const itemDate = item.timestampDate as Date;
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
    (a.timestampDate?.getTime() || 0) - (b.timestampDate?.getTime() || 0)
  );

  return {
    startDate: sortedLatestDayData[0].timestampDate as Date,
    endDate: sortedLatestDayData[sortedLatestDayData.length - 1].timestampDate as Date
  };
}