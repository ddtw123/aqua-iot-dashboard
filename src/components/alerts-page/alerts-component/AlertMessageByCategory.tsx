"use client";
import { useTheme } from '@/hooks/useTheme';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
);

export default function AlertMessageByCategory({
    title,
    data,
}: {
    title: string;
    data: {
        category: string; 
        value: number
    }[];
}) {
    const { theme } = useTheme();
    
    const chartData = {
        labels: data.map(item => item.category),
        datasets: [{
            data: data.map(item => item.value),
            backgroundColor: data.map(item => {
                const colorMap = {
                    temp: 'rgb(113,202,183,255)',
                    ph: 'rgb(10,135,175,255)', 
                    // do: 'rgb(153,101,178)',
                    ammonia: 'rgb(241,127,16)',
                    // nitrate: 'rgb(153, 102, 255)',
                    turbidity: 'rgb(194,84,120,255)',
                    manganese: 'rgb(255, 192, 203)',
                    salinity: 'rgb(255, 192, 203)'
                };
                return colorMap[item.category.toLowerCase() as keyof typeof colorMap] || '#f97316';
            }),
            borderWidth: 0,
            borderRadius: 2,
            barThickness: 40,
        }]
    };
  
    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: theme === 'dark' ? 'white' : 'black',
                    font: {
                        size: 14
                    }
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: theme === 'dark' ? 'white' : 'black',
                    font: {
                        size: 14
                    }
                },
                border: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="flex flex-col h-full border border-slate-200 dark:border-border_blue p-4">
            <h2 className="text-h4SM md:text-h4MD mb-4">{title}</h2>
            <div className="flex flex-col items-center justify-center h-[400px]">
                <Chart 
                    type="bar" 
                    data={chartData} 
                    options={options} 
                />
            </div>
        </div>
    );
};