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
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  if (match) {
    const [, day, month, year, hours, minutes] = match.map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }
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
      .filter(row => row.timestampDate !== null) // Remove invalid dates
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

// Get paginated data
export async function getPaginatedPondData(page: number = 1, pageSize: number = 100): Promise<{
  data: PondData[],
  totalCount: number,
  hasMore: boolean
}> {
  const allData = await loadFullPondData();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = allData.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    totalCount: allData.length,
    hasMore: endIndex < allData.length
  };
}
