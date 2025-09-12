import { PondData, SensorKey, sensorUnits } from '@/types/pondData';
import { fadefastTransition, fadeInYEnd, fadeInYInitial, fadeOutYInitial } from '@/util/constant';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function DashboardDetailsNewestDataCard({
    data,
    dataKey
}: {
    data: PondData[];
    dataKey: SensorKey;
}){
    const { t } = useTranslation();

    const {
        latestTimestamp,
        latestValue,
        previousTimestamp,
        previousValue,
        difference,
        percentChange,
        unit
    } = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                latestTimestamp: '',
                latestValue: null as number | null,
                previousTimestamp: '',
                previousValue: null as number | null,
                difference: null as number | null,
                percentChange: null as number | null,
                unit: ''
            };
        }

        // Data is expected to be sorted desc by timestamp from API
        const sorted = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const latest = sorted[0];
        const prev = sorted.find((d, idx) => idx > 0 && typeof d[dataKey] === 'number');

        const lv = (latest[dataKey] as number | undefined) ?? null;
        const pv = (prev?.[dataKey] as number | undefined) ?? null;
        const diff = lv !== null && pv !== null ? lv - pv : null;
        const percent = lv !== null && pv !== null && pv !== 0 ? ((lv - pv) / pv) * 100 : null;

        return {
            latestTimestamp: latest?.timestamp ?? '',
            latestValue: lv,
            previousTimestamp: prev?.timestamp ?? '',
            previousValue: pv,
            difference: diff,
            percentChange: percent,
            unit: sensorUnits[dataKey] || ''
        };
    }, [data, dataKey]);

    function formatDateTime(ts: string): string {
        if (!ts) return '-';
        const d = new Date(ts);
        if (isNaN(d.getTime())) return ts;
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
                <h2 className="text-h4SM md:text-h4MD mb-4">{t(`dashboard_detail.newest_delta`)}</h2>

                <div className="flex justify-between mb-8">
                    <div className="flex flex-col">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_detail.current')}</div>
                        <div className="text-h5SM md:text-h4MD">{formatDateTime(latestTimestamp)}</div>
                        <div className="text-h5SM md:text-h4MD lg:text-h4LG font-semibold">{formattedValue(latestValue)}</div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_detail.previous')}</div>
                        <div className="text-h5SM md:text-h4MD text-black/40 dark:text-slate-400">{formatDateTime(previousTimestamp)}</div>
                        <div className="text-h5SM md:text-h4MD lg:text-h4LG text-black/40 dark:text-slate-400">{formattedValue(previousValue)}</div>
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


