import { getLatestDayData, loadFullPondData, PondData, SensorKey } from "@/types/pondData";
import { fadeInYEnd, fadeInYInitial, fadeTransition } from "@/util/constant";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AIInsightsPanel from "./AIInsightsPanel";
import DashboardDetailsDailyTrendCard from "./DashboardDetailsDailyTrendCard";
import DashboardDetailsDatePicker from "./DashboardDetailsDatePicker";
import DashboardDetailsHeader from "./DashboardDetailsHeader";
import DashboardDetailsNewestDeltaCard from "./DashboardDetailsNewestDataCard";
import DashboardDetailsSensor from "./DashboardDetailsSensor";
import DashboardDetailsTable from "./DashboardDetailsTable";
import DashboardDetailsTrendsCard from "./DashboardDetailsTrendsCard";

const DashboardDetailsChart = dynamic(() => import("./DashboardDetailsChart"), {
    ssr: false,
});

export default function DashboardDetail({ deviceId }: { deviceId?: string }) {
    const [dataKey, setDataKey] = useState<SensorKey>("temp");
    const [originalPondData, setOriginalPondData] = useState<PondData[]>([]);
    const [dateRange, setDateRange] = useState<{
        startDate?: Date;
        endDate?: Date;
    }>({});
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const filteredPondData = useMemo(() => {
        const deviceFiltered = deviceId
            ? originalPondData.filter(item => String(item.device_id) === String(deviceId))
            : originalPondData;

        if (!dateRange.startDate || !dateRange.endDate) {
            return deviceFiltered;
        }

        return deviceFiltered.filter(item => {
            const itemDate = new Date(item.timestamp);

            const adjustedEndDate = new Date(dateRange.endDate!);
            adjustedEndDate.setHours(23, 59, 59, 999);

            return itemDate >= dateRange.startDate! && itemDate <= adjustedEndDate;
        });
    }, [originalPondData, dateRange, deviceId]);

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const result = await loadFullPondData();
                setOriginalPondData(result);

                const baseData = deviceId ? result.filter(r => String(r.device_id) === String(deviceId)) : result;
                const latestDayData = getLatestDayData(baseData);

                if (latestDayData.length > 0) {
                    const sortedLatestDay = [...latestDayData].sort((a, b) => 
                        (new Date(a.timestamp).getTime() || 0) - (new Date(b.timestamp).getTime() || 0)
                    );

                    setDateRange({
                        startDate: new Date(sortedLatestDay[0].timestamp) || undefined,
                        endDate: new Date(sortedLatestDay[sortedLatestDay.length - 1].timestamp) || undefined
                    });
                }
            } catch (error) {
                console.error("Failed to fetch sensor data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchInitialData();
    }, [deviceId]);

    const handleDateRangeChange = useCallback((startDate?: Date, endDate?: Date) => {
        setDateRange({ startDate, endDate });
    }, []);

    return (
        <div className="bg-white dark:bg-dark_blue min-h-screen duration-300">
            <motion.div 
                className="container mx-auto px-4 md:px-32 flex flex-col gap-4"
                initial={fadeInYInitial}
                whileInView={fadeInYEnd}
                transition={fadeTransition}
                viewport={{once: true}}
            >
                <DashboardDetailsHeader title={`Device ${deviceId ?? ""}`} />
                <div className="flex flex-col gap-4 w-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            {t("dashboard_detail.loading")}
                        </div>
                    ) : (
                        <>
                            <AIInsightsPanel deviceId={deviceId || ''} />
                            <DashboardDetailsSensor 
                                setSelectedSensor={setDataKey as (key: string) => void} 
                                selectedSensor={dataKey} 
                            />
                            <div className="w-full flex flex-col xl:flex-row">
                                <DashboardDetailsTrendsCard
                                    data={deviceId ? originalPondData.filter(d => String(d.device_id) === String(deviceId)) : originalPondData}
                                    dataKey={dataKey}
                                />
                                <DashboardDetailsDailyTrendCard
                                    data={deviceId ? originalPondData.filter(d => String(d.device_id) === String(deviceId)) : originalPondData}
                                    dataKey={dataKey}
                                />
                                <DashboardDetailsNewestDeltaCard
                                    data={deviceId ? originalPondData.filter(d => String(d.device_id) === String(deviceId)) : originalPondData}
                                    dataKey={dataKey}
                                />
                            </div>
                            <DashboardDetailsDatePicker 
                                data={deviceId ? originalPondData.filter(d => String(d.device_id) === String(deviceId)) : originalPondData}
                                onDateRangeChange={handleDateRangeChange}
                                initialStartDate={dateRange.startDate}
                                initialEndDate={dateRange.endDate}
                            />
                            <DashboardDetailsChart dataKey={dataKey} data={filteredPondData} />
                            <DashboardDetailsTable dataKey={dataKey} data={deviceId ? originalPondData.filter(d => String(d.device_id) === String(deviceId)) : originalPondData} />
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}