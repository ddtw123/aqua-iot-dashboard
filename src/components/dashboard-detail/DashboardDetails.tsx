import { useState, useEffect } from "react";
import DashboardDetailsChart from "./DashboardDetailsChart";
import DashboardDetailsHeader from "./DashboardDetailsHeader";
import DashboardDetailsSensor from "./DashboardDetailsSensor";
import { getPaginatedPondData, PondData, SensorKey } from "@/data/pondData";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function DashboardDetail() {
    const [dataKey, setDataKey] = useState<SensorKey>("temp");
    const [pondData, setPondData] = useState<PondData[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 100;
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            const result = await getPaginatedPondData(1, pageSize);
            setPondData(result.data);
            setHasMore(result.hasMore);
            setTotalCount(result.totalCount);
            setLoading(false);
        }
        
        fetchInitialData();
    }, []);

    const loadMoreData = async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const nextPage = page + 1;
        const result = await getPaginatedPondData(nextPage, pageSize);
        
        setPondData(prevData => [...prevData, ...result.data]);
        setPage(nextPage);
        setHasMore(result.hasMore);
        setLoadingMore(false);
    };

    return (
        <div className="container mx-auto px-4 md:px-32 flex flex-col gap-4">
            <DashboardDetailsHeader title={`Pond A`} />
            <div className="flex flex-col gap-4 w-full">
                <DashboardDetailsSensor 
                    setSelectedSensor={setDataKey as (key: string) => void} 
                    selectedSensor={dataKey} 
                />
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        {t("dashboard_detail.loading")}
                    </div>
                ) : (
                    <>
                        <div className="text-sm text-gray-500 flex justify-between items-center">
                            <span>
                                {t("dashboard_detail.showing")}
                                {pondData.length}
                                {t("dashboard_detail.of")}
                                {totalCount}
                                {t("dashboard_detail.records")}
                            </span>
                        </div>
                        <DashboardDetailsChart dataKey={dataKey} data={pondData} />
                        {hasMore && (
                            <div className="flex justify-center mt-4 mb-8">
                                <Button 
                                    onClick={loadMoreData} 
                                    disabled={loadingMore}
                                    variant="outline"
                                >
                                    {loadingMore ? "Loading..." : "Load More Data"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}