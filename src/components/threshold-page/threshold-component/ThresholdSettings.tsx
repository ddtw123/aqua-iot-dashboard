'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { sensorUnits, type SensorKey } from '@/data/pondData';
import { fadeInYEnd, fadeInYInitial, fadeTransition } from '@/util/constant';
import { motion } from 'framer-motion';
import { Save, Settings, Undo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
export interface ThresholdConfig {
    min: number;
    max: number;
}

export interface ThresholdSettings {
    temp: ThresholdConfig;
    ph: ThresholdConfig;
    do: ThresholdConfig;
    ammonia: ThresholdConfig;
    nitrate: ThresholdConfig;
    manganese: ThresholdConfig;
    turbidity: ThresholdConfig;
}

const defaultThresholds: ThresholdSettings = {
    temp: { min: 15, max: 30 },
    ph: { min: 5, max: 9.0 },
    do: { min: 5, max: 10 },
    ammonia: { min: 0, max: 0.25 },
    nitrate: { min: 20, max: 80 },
    manganese: { min: 0, max: 0.05 },
    turbidity: { min: 25, max: 60 }
};

const sensorRanges = {
    temp: { min: 0, max: 40 },
    ph: { min: 0, max: 14 },
    do: { min: 0, max: 20 },
    ammonia: { min: 0, max: 2 },
    nitrate: { min: 0, max: 100 },
    manganese: { min: 0, max: 1 },
    turbidity: { min: 0, max: 100 }
};

// Load saved settings from localStorage or use defaults
export function loadThresholdSettings(): ThresholdSettings {
    if (typeof window === 'undefined') {
        return defaultThresholds;
    }
  
    const savedSettings = localStorage.getItem('thresholdSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultThresholds;
}

export function saveThresholdSettings(settings: ThresholdSettings): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('thresholdSettings', JSON.stringify(settings));
    }
}

export default function ThresholdSettingsPage() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<ThresholdSettings>(defaultThresholds);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setSettings(loadThresholdSettings());
        setIsLoading(false);
    }, []);

    const handleSave = () => {
        saveThresholdSettings(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleReset = () => {
        setSettings(defaultThresholds);
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

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
                    return (
                        <div key={sensor} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-4">
                                {t(`dashboard_detail.${sensor}`) || sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                            </h3>
                            
                            <div className="flex flex-col space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-h5SM md:text-h5MD text-slate-600 dark:text-slate-300">
                                            {t('threshold.minimumThreshold')}   
                                        </label>
                                        <span className="text-h5SM md:text-h5MD font-medium">
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
                            <AlertDialogTitle>
                                {t('threshold.resetConfirmation')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('threshold.resetDescription')}
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
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
                            className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 transition-
                            olors"
                        >
                            <Save size={18} />
                            {isSaved ? (t('threshold.saved')) : (t('threshold.save'))}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogTitle>
                                {t('threshold.saveConfirmation')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('threshold.saveDescription')}
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    {t('threshold.cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleSave}
                                >
                                    {t('threshold.save')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                </div>
            </div>
        </motion.div>
    );
}