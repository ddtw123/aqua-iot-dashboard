import { PondData, SensorKey, sensorUnits } from '@/data/pondData';
import { fadefastTransition, fadeInYEnd, fadeInYInitial, fadeOutYInitial } from '@/util/constant';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function DashboardDetailsDailyTrendCard({
    data,
    dataKey
}: {
    data: PondData[];
    dataKey: SensorKey;
}){
    const { t } = useTranslation();

    const {
        currentDay,
        currentAvg,
        previousDay,
        previousAvg,
        difference,
        percentChange,
        unit
    } = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                currentDay: '',
                currentAvg: null as number | null,
                previousDay: '',
                previousAvg: null as number | null,
                difference: null as number | null,
                percentChange: null as number | null,
                unit: ''
            };
        }

        const byDay = data.reduce<Record<string, PondData[]>>((acc, item) => {
            const d = new Date(item.timestamp);
            if (!isNaN(d.getTime())) {
                const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
            }
            return acc;
        }, {});

        const sortedDays = Object.keys(byDay).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        if (sortedDays.length === 0) {
            return {
                currentDay: '',
                currentAvg: null,
                previousDay: '',
                previousAvg: null,
                difference: null,
                percentChange: null,
                unit: sensorUnits[dataKey] || ''
            };
        }

        const curr = sortedDays[0];
        const prev = sortedDays.find((d, idx) => idx > 0);

        const currAvg = average(byDay[curr] || [], dataKey);
        const prevAvg = prev ? average(byDay[prev] || [], dataKey) : null;
        const diff = prevAvg !== null ? currAvg - prevAvg : null;
        const pct = prevAvg !== null && prevAvg !== 0 ? ((currAvg - prevAvg) / prevAvg) * 100 : null;

        return {
            currentDay: curr,
            currentAvg: currAvg,
            previousDay: prev || '',
            previousAvg: prevAvg,
            difference: diff,
            percentChange: pct,
            unit: sensorUnits[dataKey] || ''
        };
    }, [data, dataKey]);

    function average(items: PondData[], key: SensorKey): number {
        if (items.length === 0) return 0;
        const sum = items.reduce((acc, it) => {
            const val = it[key] as number;
            return acc + (isNaN(val) ? 0 : val);
        }, 0);
        return parseFloat((sum / items.length).toFixed(2));
    }

    function formatDay(day: string): string {
        if (!day) return '-';
        const d = new Date(day);
        if (isNaN(d.getTime())) return day;
        return d.toLocaleDateString();
    }

    const formattedValue = (value: number | null) => {
        if (value === null || Number.isNaN(value)) return `-`;
        return `${value.toFixed(2)}${unit}`;
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                className="flex flex-col w-full border border-slate-200 dark:border-border_blue p-4 rounded-md shadow-sm mb-4"
                key={dataKey}
                initial={fadeInYInitial}
                whileInView={fadeInYEnd}
                transition={fadefastTransition}
                viewport={{once: true}}
                exit={fadeOutYInitial}
            >
                <h2 className="text-h4SM md:text-h4MD mb-4">{t(`dashboard_detail.daily_trend`)}</h2>

                <div className="flex justify-between mb-8">
                    <div className="flex flex-col">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_detail.current')}</div>
                        <div className="text-h5SM md:text-h4MD">{formatDay(currentDay)}</div>
                        <div className="text-h5SM md:text-h4MD lg:text-h4LG font-semibold">{formattedValue(currentAvg)}</div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_detail.previous')}</div>
                        <div className="text-h5SM md:text-h4MD text-black/40 dark:text-slate-400">{formatDay(previousDay)}</div>
                        <div className="text-h5SM md:text-h4MD lg:text-h4LG text-black/40 dark:text-slate-400">{formattedValue(previousAvg)}</div>
                    </div>
                </div>

                <div className="flex items-center justify-center flex-grow mb-5 md:mb-12">
                    {difference === null ? (
                        <span className="text-h4SM md:text-h4MD lg:text-h3LG">-</span>
                    ) : (
                        <>
                            <span className="text-h4SM md:text-h4MD lg:text-h3LG">{Math.abs(difference).toFixed(2)}{unit}</span>
                            {difference > 0 && <ChevronUp size={32} className="ml-2 text-green-600" />}
                            {difference > 0 && <span className="ml-2 text-h5SM md:text-h4MD lg:text-h3LG text-green-600">({(percentChange ?? 0).toFixed(1)}%)</span>}
                            {difference === 0 && <span className="ml-2 text-h5SM md:text-h4MD lg:text-h3LG">({(percentChange ?? 0).toFixed(1)}%)</span>}
                            {difference < 0 && <ChevronDown size={32} className="ml-2 text-rose-600" />}
                            {difference < 0 && <span className="ml-2 text-h5SM md:text-h4MD lg:text-h3LG text-rose-600">({(percentChange ?? 0).toFixed(1)}%)</span>}
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};


