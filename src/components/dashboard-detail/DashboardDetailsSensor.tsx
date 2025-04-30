import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SensorKey, sensorKeyMap } from "@/data/pondData";
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
                <p className="text-h4SM md:text-h4MD text-white mb-6">{t("homepage.title")}</p>
                <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                    <SelectTrigger className="w-full bg-dark_blue text-white border-slate-400">
                        <SelectValue placeholder={t(sensorKeyMap[selectedSensor as SensorKey])} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-700">
                        {(Object.entries(sensorKeyMap) as [SensorKey, string][]).map(([key, label]) => (
                            <SelectItem 
                                key={key} 
                                value={key}
                                className="text-white"
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
                            isActive ? "bg-white text-black" : "text-white hover:bg-slate-900/90 hover:text-slate-50"
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