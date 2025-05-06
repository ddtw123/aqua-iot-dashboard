'use client';
import { MailWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AlertMessageByCategory from './alerts-component/AlertMessageByCategory';
import AlertMessageProportion from './alerts-component/AlertMessageProportion';
import MonthlyAlertTracker from './alerts-component/AlertMonthlyTracker';
import { motion } from 'framer-motion';
import { fadeInYInitial, fadeInYEnd, fadeTransition } from '@/util/constant';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function AlertsPage() {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    return (
        <div className="bg-white dark:bg-dark_blue min-h-screen duration-300">
            <motion.div 
                className='container mx-auto pt-4 lg:py-4 flex flex-col text-black dark:text-white'
                initial={fadeInYInitial}
                whileInView={fadeInYEnd}
                transition={fadeTransition}
                viewport={{once: true}}
            >
                <div className="p-4 border-b border-slate-800">
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
                            { category: 'Temperature', value: 10 },
                        ]}
                    />
                </div>
            </motion.div>
        </div>
    );
}