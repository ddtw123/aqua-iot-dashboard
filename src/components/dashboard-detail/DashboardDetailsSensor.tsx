import { sensorKeyMap, SensorKey } from "@/data/pondData";
import { useTranslation } from "react-i18next";

export default function DashboardDetailsSensor({
    selectedSensor,
    setSelectedSensor
}: {
    selectedSensor: string;
    setSelectedSensor: (value: string) => void;
}) {
    const { t } = useTranslation();
  return (
    <div className="flex flex-wrap flex-row items-center gap-3 py-4">
        {(Object.entries(sensorKeyMap) as [SensorKey, string][]).map(([key, label]) => {
            const isActive = selectedSensor === key;
            return (
                <button
                    key={key}
                    onClick={() => setSelectedSensor(key)}
                    className={`${
                      isActive
                        ? "bg-white text-black"
                        : "text-white hover:bg-slate-900/90 hover:text-slate-50"
                    } rounded-md px-3 py-2 font-inter text-sm md:text-base transition-colors duration-300`}
                >
                    {t(label)}
                </button>
            );
        })}
    </div>
  );
}