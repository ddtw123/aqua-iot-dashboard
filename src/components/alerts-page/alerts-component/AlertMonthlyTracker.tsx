import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AlertMonthlyTrackerProps {
    title: string;
    currentMonth: string;
    currentValue: number;
    previousMonth: string;
    previousValue: number;
    difference: number;
}

const MonthlyAlertTracker: React.FC<AlertMonthlyTrackerProps> = ({
    title,
    currentMonth,
    currentValue,
    previousMonth,
    previousValue,
    difference
}) => {
    return (
        <div className="flex flex-col w-full h-full border border-slate-200 dark:border-border_blue p-4">
            <h2 className="text-h4SM md:text-h4MD mb-4">{title}</h2>
            
            <div className="flex justify-between mb-8">
                <div className="flex flex-col">
                    <div className="text-h5SM md:text-h4MD">{currentMonth}</div>
                    <div className="text-h5SM md:text-h4MD lg:text-h4LG">{currentValue}</div>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className="text-h5SM md:text-h4MD text-black/40 dark:text-slate-400">{previousMonth}</div>
                    <div className="text-h5SM md:text-h4MD lg:text-h4LG text-black/40 dark:text-slate-400">{previousValue}</div>
                </div>
            </div>
            
            <div className="flex items-center justify-center flex-grow mb-5 md:mb-20">
                <div className="flex items-center text-h4SM md:text-h3MD lg:text-h3LG">
                    <span>{difference}</span>
                    {difference > 0 && <ChevronUp size={48} className="text-red-800" />}
                    {difference < 0 && <ChevronDown size={48} className="text-green-800" />}
                </div>
            </div>
        </div>
    );
};

export default MonthlyAlertTracker;