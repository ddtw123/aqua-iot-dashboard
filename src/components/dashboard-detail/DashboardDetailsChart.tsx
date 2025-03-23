"use client";
import { Card, CardContent } from "@/components/ui/card";
import { PondData, SensorKey, sensorKeyMap, sensorUnits } from "@/data/pondData";
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
            //   tooltip: {
            //     callbacks: {
            //       label: (context) => {
            //         const value = context.parsed.y;
            //         return `${t(sensorKeyMap[dataKey])} : ${value} ${sensorUnits[dataKey] || ''}`;
            //       },
            //     },
            //   },
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
                    maxTicksLimit: 10,
                },
                grid: {
                    display: false,
                },
                    offset: true
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: `${t(sensorKeyMap[dataKey])} ${sensorUnits[dataKey] ? `(${sensorUnits[dataKey]})` : ''}`,
                },
                grid: {
                    display: true,
                },
            },
        },
        animation: {
            duration: 1000,
        },
    };

    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: `${t(sensorKeyMap[dataKey])}`,
                data: data.map(item => item[dataKey]),
                // borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#171717",
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 3,
            },
        ],
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <Line
                    options={options}
                    data={chartData}
                />
            </CardContent>
        </Card>
    );
}