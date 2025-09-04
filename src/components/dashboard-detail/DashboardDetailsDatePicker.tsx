import React, { useState, useEffect } from 'react';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from 'react-i18next';
import { PondData } from '@/data/pondData';

export default function DashboardDetailsDatePicker({ 
    data,
    onDateRangeChange,
    initialStartDate,
    initialEndDate
}: {
    data: PondData[];
    onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
    initialStartDate?: Date;
    initialEndDate?: Date;
}) {
    const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
    const [availableDateRange, setAvailableDateRange] = useState<{
        minDate: Date;
        maxDate: Date;
    }>({ 
        minDate: new Date(), 
        maxDate: new Date() 
    });
    const { t } = useTranslation();

    useEffect(() => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
    }, [initialStartDate, initialEndDate]);

    // Calculate available date range
    useEffect(() => {
        if (data.length > 0) {
            // Parse timestamps from string to Date objects
            const parsedDates = data.map(item => new Date(item.timestamp));

            // Find the latest and earliest dates
            const latestDate = new Date(Math.max(...parsedDates.map(date => date.getTime())));
            const earliestDate = new Date(Math.min(...parsedDates.map(date => date.getTime())));

            // Update available date range
            setAvailableDateRange({
                minDate: earliestDate,
                maxDate: latestDate
            });
        }
    }, [data]);

    // Trigger date range change when dates are updated
    useEffect(() => {
        onDateRangeChange(startDate, endDate);
    }, [startDate, endDate, onDateRangeChange]);

    const handleStartDateChange = (date: Date | undefined) => {
        if (date) {
            setStartDate(date);
            setEndDate(endDate);
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        if (date) {
            setEndDate(date);
        }
    };

    return (
        <div className="flex flex-row items-start md:item-center gap-4 overflow-hidden">
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black dark:text-white duration-300">
                    {t('dashboard_detail.start_date')}
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full md:w-[240px] justify-start text-left font-normal p-2 md:p-5 bg-white hover:bg-white/90 text-black hover:text-black",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>{t('dashboard_detail.pick_start_date')}</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={handleStartDateChange}
                            fromDate={availableDateRange.minDate}
                            toDate={availableDateRange.maxDate}
                            disabled={{
                                before: availableDateRange.minDate,
                                after: endDate,
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">
                    {t('dashboard_detail.end_date')}
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full md:w-[240px] justify-start text-left font-normal p-2 md:p-5 bg-white hover:bg-white/90 text-black hover:text-blac",
                                !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>{t('dashboard_detail.pick_end_date')}</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={handleEndDateChange}
                            fromDate={availableDateRange.minDate}
                            toDate={availableDateRange.maxDate}
                            disabled={{
                                before: startDate,
                                after: availableDateRange.maxDate,
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
    }