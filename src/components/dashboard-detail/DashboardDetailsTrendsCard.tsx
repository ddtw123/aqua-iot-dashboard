import React, { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PondData, SensorKey, sensorUnits } from '@/data/pondData';
import { useTranslation } from 'react-i18next';

export default function DashboardDetailsTrendsCard({
    data,
    dataKey
}: {
    data: PondData[];
    dataKey: SensorKey;
}){
    const { t } = useTranslation();

    const {
        currentMonth,
        currentValue,
        previousMonth,
        previousValue,
        difference,
        percentChange,
        unit
    } = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                currentMonth: '',
                currentValue: 0,
                previousMonth: '',
                previousValue: 0,
                difference: 0,
                percentChange: 0,
                unit: ''
            };
        }

        const dataByMonth = data.reduce<Record<string, PondData[]>>((acc, item) => {
            if (item.timestampDate) {
                const monthYear = `${item.timestampDate.getMonth() + 1}/${item.timestampDate.getFullYear()}`;
                if (!acc[monthYear]) {
                    acc[monthYear] = [];
                }
                acc[monthYear].push(item);
            }
            return acc;
        }, {});

        const sortedMonths = Object.keys(dataByMonth).sort((a, b) => {
            const [monthA, yearA] = a.split('/').map(Number);
            const [monthB, yearB] = b.split('/').map(Number);
            
            if (yearA !== yearB) return yearB - yearA;
            return monthB - monthA;
        });

        if (sortedMonths.length < 2) {
            return {
                currentMonth: sortedMonths.length > 0 ? sortedMonths[0] : '',
                currentValue: sortedMonths.length > 0 ? calculateAverage(dataByMonth[sortedMonths[0]], dataKey) : 0,
                previousMonth: '',
                previousValue: 0,
                difference: 0,
                percentChange: 0,
                unit: sensorUnits[dataKey] || ''
            };
        }

        const currentMonthData = dataByMonth[sortedMonths[0]];
        const previousMonthData = dataByMonth[sortedMonths[1]];

        const currentAvg = calculateAverage(currentMonthData, dataKey);
        const previousAvg = calculateAverage(previousMonthData, dataKey);
        const diff = currentAvg - previousAvg;
        const percent = previousAvg !== 0 ? (diff / previousAvg) * 100 : 0;

        return {
            currentMonth: sortedMonths[0],
            currentValue: currentAvg,
            previousMonth: sortedMonths[1],
            previousValue: previousAvg,
            difference: diff,
            percentChange: percent,
            unit: sensorUnits[dataKey] || ''
        };
    }, [data, dataKey]);

    function calculateAverage(data: PondData[], key: SensorKey): number {
        if (data.length === 0) return 0;
        
        const sum = data.reduce((acc, item) => {
            const value = item[key] as number;
            return acc + (isNaN(value) ? 0 : value);
        }, 0);
        
        return parseFloat((sum / data.length).toFixed(2));
    }
    
    function formatMonthYear(monthYearStr: string): string {
        const [month, year] = monthYearStr.split('/').map(Number);
        
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return `${monthNames[month - 1]} ${year}`;
    }

    const formattedValue = (value: number) => {
        return `${value.toFixed(2)}${unit}`;
    };

    return (
        <div className="flex flex-col w-full border border-slate-200 dark:border-border_blue p-4 rounded-md shadow-sm mb-4">
            <h2 className="text-h4SM md:text-h4MD mb-4">{t(`dashboard_detail.monthly_trend`)}</h2>
            
            <div className="flex justify-between mb-8">
                <div className="flex flex-col">
                    <div className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_detail.current')}</div>
                    <div className="text-h5SM md:text-h4MD">{formatMonthYear(currentMonth)}</div>
                    <div className="text-h5SM md:text-h4MD lg:text-h4LG font-semibold">{formattedValue(currentValue)}</div>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_detail.previous')}</div>
                    <div className="text-h5SM md:text-h4MD text-black/40 dark:text-slate-400">{formatMonthYear(previousMonth)}</div>
                    <div className="text-h5SM md:text-h4MD lg:text-h4LG text-black/40 dark:text-slate-400">{formattedValue(previousValue)}</div>
                </div>
            </div>
            
            <div className="flex items-center justify-center flex-grow mb-5 md:mb-12">
                <span className="text-h5SM md:text-h4MD lg:text-h3LG">{Math.abs(difference).toFixed(2)}{unit}</span>
                {difference > 0 && <ChevronUp size={32} className="ml-2 text-green-600" />}
                {difference > 0 && <span className="ml-2 text-h5SM md:text-h4MD lg:text-h3LG text-green-600">({percentChange.toFixed(1)}%)</span>}
                {difference === 0 && <span className="ml-2 text-h5SM md:text-h4MD lg:text-h3LG">({percentChange.toFixed(1)}%)</span>}
                {difference < 0 && <ChevronDown size={32} className="ml-2 text-rose-600" />}
                {difference < 0 && <span className="ml-2 text-h5SM md:text-h4MD lg:text-h3LG text-rose-600">({percentChange.toFixed(1)}%)</span>}
            </div>
        </div>
    );
};