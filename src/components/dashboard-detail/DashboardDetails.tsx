import { loadFullPondData, PondData, SensorKey, getLatestDayData } from "@/data/pondData";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardDetailsDatePicker from "./DashboardDetailsDatePicker";
import DashboardDetailsHeader from "./DashboardDetailsHeader";
import DashboardDetailsSensor from "./DashboardDetailsSensor";
import DashboardDetailsTable from "./DashboardDetailsTable";

const DashboardDetailsChart = dynamic(() => import("./DashboardDetailsChart"), {
    ssr: false,
});

export default function DashboardDetail() {
    const [dataKey, setDataKey] = useState<SensorKey>("temp");
    const [originalPondData, setOriginalPondData] = useState<PondData[]>([]);
    const [dateRange, setDateRange] = useState<{
        startDate?: Date;
        endDate?: Date;
    }>({});
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const filteredPondData = useMemo(() => {
        if (!dateRange.startDate || !dateRange.endDate) {
            return originalPondData;
        }

        return originalPondData.filter(item => {
            const itemDate = item.timestampDate instanceof Date 
                ? item.timestampDate 
                : new Date(item.timestamp);

            const adjustedEndDate = new Date(dateRange.endDate!);
            adjustedEndDate.setHours(23, 59, 59, 999);

            return itemDate >= dateRange.startDate! && itemDate <= adjustedEndDate;
        });
    }, [originalPondData, dateRange]);

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const result = await loadFullPondData();
                const latestDayData = getLatestDayData(result);
                
                setOriginalPondData(result);
                
                if (latestDayData.length > 0) {
                    const sortedLatestDay = [...latestDayData].sort((a, b) => 
                        (a.timestampDate?.getTime() || 0) - (b.timestampDate?.getTime() || 0)
                    );

                    setDateRange({
                        startDate: sortedLatestDay[0].timestampDate || undefined,
                        endDate: sortedLatestDay[sortedLatestDay.length - 1].timestampDate || undefined
                    });
                }
            } catch (error) {
                console.error("Failed to fetch pond data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchInitialData();
    }, []);

    const handleDateRangeChange = useCallback((startDate?: Date, endDate?: Date) => {
        setDateRange({ startDate, endDate });
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-32 flex flex-col gap-4">
            <DashboardDetailsHeader title={`Pond A`} />
            <div className="flex flex-col gap-4 w-full">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        {t("dashboard_detail.loading")}
                    </div>
                ) : (
                    <>
                        <DashboardDetailsSensor 
                            setSelectedSensor={setDataKey as (key: string) => void} 
                            selectedSensor={dataKey} 
                        />
                        <DashboardDetailsDatePicker 
                            data={originalPondData}
                            onDateRangeChange={handleDateRangeChange}
                            initialStartDate={dateRange.startDate}
                            initialEndDate={dateRange.endDate}
                        />
                        <DashboardDetailsChart dataKey={dataKey} data={filteredPondData} />
                        <DashboardDetailsTable dataKey={dataKey} data={originalPondData} />
                    </>
                )}
            </div>
        </div>
    );
}