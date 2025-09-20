'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { sensorUnits, type SensorKey } from '@/types/pondData';
import { ThresholdConfig, ThresholdSettings, defaultThresholds, fetchDeviceThresholds, saveDeviceThresholds, sensorRanges } from '@/types/thresholdSettings';
import { fadeInYEnd, fadeInYInitial, fadeTransition } from '@/util/constant';
import { motion } from 'framer-motion';
import { Save, Settings, Undo, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export default function ThresholdSettingsPage({ deviceId: initialDeviceId }: { deviceId?: string }) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [settings, setSettings] = useState<ThresholdSettings>(defaultThresholds);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [deviceId] = useState<string>(initialDeviceId || 'default');

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const data = await fetchDeviceThresholds(deviceId);
            setSettings(data);
            setIsLoading(false);
        })();
    }, [deviceId]);

    const validateThresholds = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];
        
        Object.entries(settings).forEach(([sensor, config]: [string, ThresholdConfig]) => {
            if (config.min > config.max) {
                const sensorName = t(`dashboard_detail.${sensor}`) || sensor.charAt(0).toUpperCase() + sensor.slice(1);
                errors.push(sensorName);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleSave = async () => {
        try {
            await saveDeviceThresholds(deviceId, settings);
            setIsSaved(true);
            toast({
                title: t('threshold.saveSuccessTitle'),
                description: t('threshold.saved')
            });
            setTimeout(() => setIsSaved(false), 2000);
        } catch (e) {
            console.error('Failed to save thresholds', e);
            toast({
                title: t('threshold.saveErrorTitle'),
                description: t('threshold.saveError'),
                variant: "destructive",
            });
        }
    };

    const handleReset = () => {
        setSettings(defaultThresholds);
        toast({
            title: t('threshold.resetSuccessTitle'),
            description: t('threshold.resetSuccess'),
        });
    };

    const handleChange = (sensor: SensorKey, type: 'min' | 'max', value: number) => {
        setSettings(prev => ({
            ...prev,
            [sensor]: {
                ...prev[sensor],
                [type]: value
            }
        }));
    };

    const getSensorValidationError = (sensor: SensorKey): boolean => {
        return settings[sensor].min > settings[sensor].max;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    const validation = validateThresholds();

    return (
        <motion.div 
            className="container mx-auto pt-4 lg:py-4 flex flex-col text-black dark:text-white"
            initial={fadeInYInitial}
            whileInView={fadeInYEnd}
            transition={fadeTransition}
            viewport={{once: true}}
        >
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <Settings className="text-black dark:text-white" size={32} />
                    <h1 className="font-roboto text-left text-h3SM md:text-h2MD lg:text-h3LG">
                    {t('threshold.title')}
                    </h1>
                </div>
                <p className="text-h5SM md:text-h4MD text-black/40 dark:text-slate-400 mt-2">
                    {t('threshold.description')}
                </p>
            </div>
            <div className="p-4 flex flex-col space-y-8">
                {Object.entries(settings).map(([sensor, config]: [string, ThresholdConfig]) => {
                    const sensorKey = sensor as SensorKey;
                    const range = sensorRanges[sensorKey];
                    const unit = sensorUnits[sensorKey];
                    const hasValidationError = getSensorValidationError(sensorKey);
                    
                    return (
                        <div 
                            key={sensor} 
                            className={`w-full border rounded-lg p-4 ${
                                hasValidationError 
                                    ? 'bg-red' 
                                    : 'border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">
                                    {t(`dashboard_detail.${sensor}`) || sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                                </h3>
                                {hasValidationError && (
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                        <AlertTriangle size={16} />
                                        <span className="text-white">
                                            {t('threshold.invalidRange')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-h5SM md:text-h5MD text-slate-600 dark:text-slate-300">
                                            {t('threshold.minimumThreshold')}   
                                        </label>
                                        <span className={`text-h5SM md:text-h5MD font-medium ${
                                            hasValidationError ? 'text-white' : ''
                                        }`}>
                                            {config.min} {unit}
                                        </span>
                                    </div>
                                    <Slider
                                        min={range.min}
                                        max={range.max}
                                        step={(range.max - range.min) / 100}
                                        value={[config.min]}
                                        onValueChange={(value) => handleChange(sensorKey, 'min', value[0])}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-h5SM md:text-h5MD text-slate-600 dark:text-slate-300">
                                            {t('threshold.maximumThreshold')}
                                        </label>
                                        <span className="text-h5SM md:text-h5MD font-medium">
                                            {config.max} {unit}
                                        </span>
                                    </div>
                                    <Slider
                                        min={range.min}
                                        max={range.max}
                                        step={(range.max - range.min) / 100}
                                        value={[config.max]}
                                        onValueChange={(value) => handleChange(sensorKey, 'max', value[0])}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            
                <div className="flex justify-end space-x-4 pt-4">
                    <AlertDialog>
                        <AlertDialogTrigger
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
                        >
                            <Undo size={18} />
                            {t('threshold.reset')}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogTitle className='text-h4SM md:text-h4MD'>
                                {t('threshold.resetConfirmation')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('threshold.resetDescription')}
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='bg-red hover:bg-red/75 duration-300'>
                                    {t('threshold.cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleReset}
                                >
                                    {t('threshold.reset')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                validation.isValid 
                                    ? 'bg-green-700 text-white hover:bg-green-700/75 duration-300' 
                                    : 'bg-red text-white hover:bg-red-700'
                            }`}
                        >
                            <Save size={18} />
                            {isSaved ? (t('threshold.saved')) : (t('threshold.save'))}
                        </AlertDialogTrigger>
                        {validation.isValid ? (
                            <AlertDialogContent>
                                <AlertDialogTitle className='text-h4SM md:text-h4MD'>
                                    {t('threshold.saveConfirmation')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('threshold.saveDescription')}
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className='bg-red hover:bg-red/75 duration-300'>
                                        {t('threshold.cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleSave}
                                    >
                                        {t('threshold.save')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        ) : (
                            <AlertDialogContent>
                                <AlertDialogTitle className='text-h4SM md:text-h4MD'>
                                    {t('threshold.validationErrorTitle')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('threshold.validationErrorDescription')}
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className='bg-red hover:bg-red/75 duration-300'>
                                        {t('threshold.okay')}
                                    </AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        )}
                    </AlertDialog>
                    
                </div>
            </div>
        </motion.div>
    );
}