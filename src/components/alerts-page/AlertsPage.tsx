'use client';
import {
    Alert,
    getAlertProportion,
    // getAlertsByCategory,
    getAllAlerts,
    getMonthlyAlertStats
} from '@/data/alertService';
import { useIsMobile } from '@/hooks/useIsMobile';
import { fadeInYEnd, fadeInYInitial, fadeTransition } from '@/util/constant';
import { motion } from 'framer-motion';
import { MailWarning } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertList from './alerts-component/AlertList';
import AlertMessageByCategory from './alerts-component/AlertMessageByCategory';
import AlertMessageProportion from './alerts-component/AlertMessageProportion';
import MonthlyAlertTracker from './alerts-component/AlertMonthlyTracker';

export default function AlertsPage({ pondId }: { pondId?: string }) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryData, setCategoryData] = useState<{category: string; value: number}[]>([]);
    const [proportion, setProportion] = useState({percentage: 0, message: 0});
    const [monthlyStats, setMonthlyStats] = useState({
        currentMonth: '',
        currentValue: 0,
        previousMonth: '',
        previousValue: 0,
        difference: 0
    });

    useEffect(() => {
        async function loadData() {
            try {
                const alertsData = await getAllAlerts();
                const filtered = pondId ? alertsData.filter(a => String(a.pondId) === String(pondId)) : alertsData;
                setAlerts(filtered);

                // Category breakdown
                const byParam: Record<string, number> = {};
                filtered.forEach(a => { byParam[a.parameter] = (byParam[a.parameter] || 0) + 1; });
                const catData = Object.entries(byParam).map(([k,v]) => ({ category: k.charAt(0).toUpperCase() + k.slice(1), value: v }));
                setCategoryData(catData);

                // Proportion: messages vs total readings approximated by alerts count when pond filtered
                if (pondId) {
                    setProportion({ percentage: filtered.length, message: filtered.length });
                } else {
                    const proportionData = await getAlertProportion();
                    setProportion(proportionData);
                }

                // Monthly stats computed from filtered alerts
                const latest = filtered[0]?.timestamp;
                if (latest) {
                    const latestMonth = latest.getMonth();
                    const latestYear = latest.getFullYear();
                    const currentMonthAlerts = filtered.filter(a => a.timestamp.getMonth() === latestMonth && a.timestamp.getFullYear() === latestYear);
                    const prevMonth = latestMonth === 0 ? 11 : latestMonth - 1;
                    const prevYear = latestMonth === 0 ? latestYear - 1 : latestYear;
                    const previousMonthAlerts = filtered.filter(a => a.timestamp.getMonth() === prevMonth && a.timestamp.getFullYear() === prevYear);
                    setMonthlyStats({
                        currentMonth: new Date(latestYear, latestMonth).toLocaleString('default', { month: 'short' }) + ' ' + latestYear,
                        currentValue: currentMonthAlerts.length,
                        previousMonth: new Date(prevYear, prevMonth).toLocaleString('default', { month: 'short' }) + ' ' + prevYear,
                        previousValue: previousMonthAlerts.length,
                        difference: currentMonthAlerts.length - previousMonthAlerts.length
                    });
                } else {
                    const monthlyData = await getMonthlyAlertStats();
                    setMonthlyStats(monthlyData);
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading alert data:', error);
                setIsLoading(false);
            }
        }
        
        loadData();
    }, [pondId]);

    return (
        <div className="bg-white dark:bg-dark_blue min-h-screen duration-300">
            <motion.div 
                className='container mx-auto pt-4 lg:py-4 flex flex-col text-black dark:text-white'
                initial={fadeInYInitial}
                whileInView={fadeInYEnd}
                transition={fadeTransition}
                viewport={{once: true}}
            >
                <div className="p-4 border-b border-slate-200 dark:border-border_blue">
                    <div className="flex items-center gap-2">
                        <MailWarning className="text-black dark:text-white" size={isMobile ? 20 : 32} />
                        <h1 className="font-roboto text-left text-h3SM md:text-h2MD lg:text-h3LG">{t('alerts.aquaticAlertTrendAnalysis')}</h1>
                    </div>
                    <p className="text-h5SM md:text-h4MD text-black/40 dark:text-slate-400 mt-2">{t('alerts.insightsForTracking')}</p>
                </div>
 
                <div className="flex flex-col w-full">
                    <div className='flex flex-col md:flex-row justify-between'>
                        <div className="w-full">
                            <AlertMessageProportion 
                                title={t('alerts.alertMessageProportion')}
                                percentage={proportion.percentage}
                                message={proportion.message}
                                aquaApiId={1}
                            />
                        </div>
                        <div className="w-full">
                            <MonthlyAlertTracker 
                                title={t('alerts.monthlyAlertTracker')}
                                currentMonth={monthlyStats.currentMonth}
                                currentValue={monthlyStats.currentValue}
                                previousMonth={monthlyStats.previousMonth}
                                previousValue={monthlyStats.previousValue}
                                difference={monthlyStats.difference}
                            />
                        </div>
                    </div>

                    <AlertMessageByCategory 
                        title={t('alerts.alertMessageByCategory')}
                        data={categoryData}
                    />
                    
                    <div className="border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium">{t('alerts.recentAlerts')}</h2>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">Loading alerts...</div>
                        ) : alerts.length > 0 ? (
                            <AlertList alerts={alerts} />
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                {t('alerts.noAlertsFound')}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}