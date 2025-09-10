import { useTranslation } from 'react-i18next';

export default function AlertMessageProportion({
    title,
    percentage,
    message,
    aquaApiId
}: {
    title: string;
    percentage: number;
    message: number;
    aquaApiId: number;
}){
    const { t } = useTranslation();

    return (
        <div className="flex flex-col w-full h-full border border-slate-200 dark:border-border_blue p-4">
            <h2 className="text-h4SM md:text-h4MD mb-4">{title}</h2>
            
            <div className="flex flex-col justify-between mb-8">
                <div className="flex flex-row justify-between text-h5SM md:text-h4MD text-black/40 dark:text-slate-400 mb-1 duration-300">
                    <div>{t('alerts.message')}</div>
                    <div>aqua_id</div>
                </div>
                
                <div className="flex flex-row justify-between text-h5SM md:text-h4MD">
                    <div>{message}</div>
                    <div>{aquaApiId}</div>
                </div>
            </div>
            
            <div className="flex items-center justify-center flex-grow mb-5 md:mb-20">
                <div className="text-h4SM md:text-h3MD font-medium">{percentage}%</div>
            </div>
        </div>
    );
};