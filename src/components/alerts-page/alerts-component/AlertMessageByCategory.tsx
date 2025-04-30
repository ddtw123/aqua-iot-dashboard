import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

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
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map(item => item.category),
                        datasets: [{
                            data: data.map(item => item.value),
                            backgroundColor: '#f97316',
                            borderWidth: 0,
                            borderRadius: 2,
                            barThickness: 40,
                        }]
                    },
                    options: {
                        indexAxis: 'y',
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
                                    color: 'rgba(255, 255, 255, 0.1)',
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
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
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    font: {
                                        size: 14
                                    }
                                },
                                border: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return (
        <div className="flex flex-col h-full border border-border_blue p-4">
            <h2 className="text-h4SM md:text-h4MD mb-4">{title}</h2>
            
            <div className="flex flex-col items-center justify-center h-full mb-20">
                <canvas ref={chartRef} height="300"></canvas>
            </div>
        </div>
    );
};