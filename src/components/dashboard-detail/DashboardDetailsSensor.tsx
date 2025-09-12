import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SensorKey, sensorKeyMap } from "@/types/pondData";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

export default function DashboardDetailsSensor({
  selectedSensor,
  setSelectedSensor
}: {
  selectedSensor: string;
  setSelectedSensor: (value: string) => void;
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="py-4">
        {isMobile ? (
            <>
                <p className="text-h4SM md:text-h4MD text-black dark:text-white mb-6 duration-300">{t("homepage.title")}</p>
                <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                    <SelectTrigger className="w-full border-slate-400">
                        <SelectValue placeholder={t(sensorKeyMap[selectedSensor as SensorKey])} />
                    </SelectTrigger>
                    <SelectContent>
                        {(Object.entries(sensorKeyMap) as [SensorKey, string][]).map(([key, label]) => (
                            <SelectItem 
                                key={key} 
                                value={key}
                            >
                                {t(label)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </>
        ) : (
            <div className="flex flex-wrap flex-row items-center gap-3">
                {(Object.entries(sensorKeyMap) as [SensorKey, string][]).map(([key, label]) => {
                    const isActive = selectedSensor === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setSelectedSensor(key)}
                            className={`${
                            isActive ? "bg-black dark:bg-white text-white dark:text-black" : "text-black dark:text-white hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black"
                            } rounded-md px-3 py-2 font-inter text-sm md:text-base transition-colors duration-300`}
                        >
                            {t(label)}
                        </button>
                    );
                })}
            </div>
        )}
    </div>
  );
}