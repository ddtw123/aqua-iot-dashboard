'use client';
import { MailWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AlertMessageByCategory from './alerts-component/AlertMessageByCategory';
import AlertMessageProportion from './alerts-component/AlertMessageProportion';
import MonthlyAlertTracker from './alerts-component/AlertMonthlyTracker';

export default function AlertsPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-dark_blue text-white flex flex-col w-full min-h-screen">
            <div className='container mx-auto py-4'>
                <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <MailWarning className="text-white" size={32} />
                        <h1 className="font-roboto text-left text-h2SM md:text-h2MD lg:text-h3LG">{t('alerts.aquaticAlertTrendAnalysis')}</h1>
                    </div>
                    <p className="text-h4SM md:text-h4MD text-slate-400 mt-2">{t('alerts.insightsForTracking')}</p>
                </div>
 
                <div className="flex flex-col w-full">
                    <div className='flex flex-row justify-between'>
                        <div className="w-full">
                            <AlertMessageProportion 
                                title={t('alerts.alertMessageProportion')}
                                percentage={0}
                                message={0}
                                aquaApiId={1}
                            />
                        </div>
                        <div className="w-full">
                            <MonthlyAlertTracker 
                                title={t('alerts.monthlyAlertTracker')}
                                currentMonth="Apr 2022"
                                currentValue={0}
                                previousMonth="Mar 2022"
                                previousValue={0}
                                difference={0}
                            />
                        </div>
                    </div>

                    <AlertMessageByCategory 
                        title={t('alerts.alertMessageByCategory')}
                        data={[
                            { category: 'IoT Core', value: 0 },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}