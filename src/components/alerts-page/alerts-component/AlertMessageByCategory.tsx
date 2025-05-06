"use client";
import { useTheme } from '@/hooks/useTheme';
import {
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
    Title,
    Tooltip,
    Legend
);

interface CategoryData {
    category: string;
    value: number;
}

interface AlertMessageByCategoryProps {
    title: string;
    data: CategoryData[];
}

export default function AlertMessageByCategory({
    title,
    data,
}: AlertMessageByCategoryProps) {
    const { theme } = useTheme();
    
    const chartData = {
        labels: data.map(item => item.category),
            datasets: [{
            data: data.map(item => item.value),
            backgroundColor: '#f97316',
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
        <div className="flex flex-col h-full border border-border_blue p-4">
            <h2 className="text-h4SM md:text-h4MD mb-4">{title}</h2>
            <div className="flex flex-col items-center justify-center h-full my-20">
                <Chart 
                    type="bar" 
                    data={chartData} 
                    options={options} 
                />
            </div>
        </div>
    );
};