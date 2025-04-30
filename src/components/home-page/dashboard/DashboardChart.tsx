"use client";
import { PondData, SensorKey, sensorKeyMap, sensorUnits } from '@/data/pondData';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  BarController,
  LineController
} from 'chart.js';
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { TooltipItem } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export default function DashboardChart ({ 
  data, 
  parameters 
}: {
  data: PondData[];
  parameters: SensorKey[];
}){
  const { t } = useTranslation();
  
  const barParams: SensorKey[] = ['ammonia', 'ph', 'do', 'manganese'];
  // const lineParams: SensorKey[] = ['temp', 'turbidity', 'nitrate'];
  
  const colorMap = {
    temp: 'rgb(113,202,183,255)',
    ph: 'rgb(10,135,175,255)', 
    do: 'rgb(153,101,178)',
    ammonia: 'rgb(241,127,16)',
    nitrate: 'rgb(153, 102, 255)',
    turbidity: 'rgb(194,84,120,255)',
    manganese: 'rgb(201, 255, 255)'
  };
  
  const labels = data.map(item => {
    if (item.timestampDate) {
      const date = new Date(item.timestampDate);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return item.timestamp;
  });
  
  const datasets = parameters.map(param => {
    const isBar = barParams.includes(param);
    
    return {
      type: isBar ? 'bar' as const : 'line' as const,
      label: t(sensorKeyMap[param]),
      data: data.map(item => item[param]),
      borderColor: colorMap[param],
      backgroundColor: colorMap[param],
      borderWidth: isBar ? 1 : 2,
      pointRadius: isBar ? 0 : 3,
      pointHoverRadius: 5,
      yAxisID: isBar ? 'y' : 'y1',
      order: isBar ? 1 : 0,
      fill: false,
    };
  });
  
  const chartData = {
    labels,
    datasets
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          color: 'white',
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: TooltipItem<'bar' | 'line'>) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            const paramKey = parameters.find(
              param => t(sensorKeyMap[param]) === datasetLabel
            );
            const unit = paramKey ? sensorUnits[paramKey] : '';
            return `${datasetLabel}: ${value} ${unit}`;
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          drag: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          wheel: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          maxTicksLimit: 15
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: false,
        },
        min: 0,
        max: 12,
        ticks: {
          color: 'rgba(255, 255, 255)',
          font: {
            size: 16
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 350,
        ticks: {
          color: 'rgba(255, 255, 255)',
          font: {
            size: 16
          }
        },
        grid: {
          drawOnChartArea: false
        }
      },
    },
    animation: {
      duration: 1000,
    }
  };
  
  return (
    <div className="h-full w-full bg-dark_blue">
      <Chart 
        type="bar" 
        data={chartData} 
        options={options} 
      />
    </div>
  );
};