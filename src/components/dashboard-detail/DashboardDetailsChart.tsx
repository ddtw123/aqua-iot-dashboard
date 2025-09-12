"use client";
import { PondData, SensorKey, sensorKeyMap, sensorUnits } from "@/types/pondData";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/hooks/useTheme";
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

export default function DashboardDetailsChart({
    dataKey,
    data,
}: {
    dataKey: SensorKey;
    data: PondData[];
}) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isMobile = useIsMobile();
    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            //   title: {
            //     display: true,
            //     text: `${t(sensorKeyMap[dataKey])}`,
            //   },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => {
                        const value = context.parsed.y;
                        return `${t(sensorKeyMap[dataKey])} : ${value} ${sensorUnits[dataKey] || ''}`;
                    },
                },
              },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x",
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
                    mode: "x",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: theme === 'dark' ? 'white' : 'black',
                    maxTicksLimit: isMobile ? 3 : 10,
                    font: {
                        size: isMobile ? 10 : 16
                      }
                },
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                },
                offset: true
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: `${t(sensorKeyMap[dataKey])} ${sensorUnits[dataKey] ? `(${sensorUnits[dataKey]})` : ''}`,
                    color: theme === 'dark' ? 'white' : 'black',
                },
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: theme === 'dark' ? 'white' : 'black',
                    font: {
                      size: isMobile ? 10 : 16
                    }
                }
            },
        },
        animation: {
            duration: 1000,
        },
    };

    const chartData = {
        labels: data.map(item => item.timestamp),
        datasets: [
            {
                label: `${t(sensorKeyMap[dataKey])}`,
                data: data.map(item => item[dataKey]),
                // borderColor: "rgb(255, 99, 132)",
                borderColor: theme === 'dark' ? "rgb(194,84,120,255)" : "rgb(0, 0, 0, 0.5)",
                backgroundColor: theme === 'dark' ? "rgb(194,84,120,255)" : "rgb(0, 0, 0, 0.5)",
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 3,
            },
        ],
    };

    return (
        <div className="border-none pt-6 bg-white dark:bg-dark_blue duration-300">
            <Line
                options={options}
                data={chartData}
            />
        </div>
    );
}