import { Alert } from '@/data/alertService';
import { sensorUnits } from '@/data/pondData';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AlertListProps {
  alerts: Alert[];
}

export default function AlertList({ alerts }: AlertListProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
    const itemsPerPage = isMobile ? 5 : 10;
    
    const totalPages = Math.ceil(alerts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedAlerts = alerts.slice(indexOfFirstItem, indexOfLastItem);
    
    // Pagination handlers
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };
    
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    
    // Toggle expanded state
    const toggleExpand = (alertId: string) => {
        if (expandedAlert === alertId) {
            setExpandedAlert(null);
        } else {
            setExpandedAlert(alertId);
        }
    };
    
    const getAlertColor = (parameter: string): string => {
        const colorMap: Record<string, string> = {
            temp: 'text-light_green',
            ph: 'text-light_blue',
            do: 'text-purple',
            ammonia: 'text-orange',
            nitrate: 'text-light_purple',
            turbidity: 'text-red',
            manganese: 'text-pink'
        };
        
        return colorMap[parameter] || 'text-gray-500';
    };

    const formatAlertMessage = (alert: Alert): string => {
        const parameterName = alert.parameter.charAt(0).toUpperCase() + alert.parameter.slice(1);
        
        if (alert.thresholdType === 'below') {
            return `${parameterName} ${t('alerts.tooLow')} ${alert.value} (${t('alerts.threshold')} ${alert.threshold})`;
        } else {
            return `${parameterName} ${t('alerts.tooHigh')} ${alert.value} (${t('alerts.threshold')} ${alert.threshold})`;
        }
    };
    
    return (
        <div className="flex flex-col">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedAlerts.map((alert, index) => (
                    <div key={index} className="py-3">
                        <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleExpand(alert.id)}
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                <span className={`font-medium ${getAlertColor(alert.parameter)}`}>
                                    {alert.parameter.charAt(0).toUpperCase() + alert.parameter.slice(1)}
                                </span>
                                <span className="text-sm text-slate-500">
                                    {alert.pondId}
                                </span>
                                </div>
                                <p className="text-sm mt-1">{formatAlertMessage(alert)}</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-500">{formatDate(alert.timestamp)}</span>
                                {expandedAlert === alert.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        </div>
                        
                        {expandedAlert === alert.id && (
                            <div className="mt-3 pl-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-slate-500">{t("alerts.parameter")}</p>
                                        <p className="font-medium">{alert.parameter}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">{t("alerts.value")}</p>
                                        <p className="font-medium">{alert.value} {sensorUnits[alert.parameter]}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">{t("alerts.threshold")}</p>
                                        <p className="font-medium">
                                        {alert.thresholdType === 'below' ? 'Min: ' : 'Max: '}
                                        {alert.threshold} {sensorUnits[alert.parameter]}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">{t("alerts.pondId")}</p>
                                        <p className="font-medium">{alert.pondId}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-slate-500">{t("alerts.timestamp")}</p>
                                        <p className="font-medium">{formatDate(alert.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        
        {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button 
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                    <ChevronsLeft className="h-5 w-5" />
                </button>
                <button 
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <span className="text-sm text-slate-700 dark:text-slate-300">
                    Page {currentPage} of {totalPages}
                </span>

                <button 
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
                <button 
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                    <ChevronsRight className="h-5 w-5" />
                </button>
            </div>
        )}
        </div>
    );
}