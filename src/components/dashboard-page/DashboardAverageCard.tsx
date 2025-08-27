import { Card, CardContent } from "@/components/ui/card";
import { RadialGaugeChart } from "@/components/ui/RadialGaugeChart";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function DashboardAverageCard({ 
  title, 
  value, 
  unit,
  minValue = 1,
  maxValue = 14
}: {
  title: string;
  value: number;
  unit: string;
  minValue?: number;
  maxValue?: number;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const isRadialCard = title.toLowerCase().includes('ph');

  return (
    <Card 
      className="border border-slate-200 dark:border-border_blue bg-white dark:bg-dark_blue rounded-none md:min-h-[200px] cursor-pointer group duration-300"
    >
      <CardContent className="p-4 flex flex-col items-center">
        <h3 className="w-full min-h-[80px] text-left font-poppins text-h5SM md:text-h4MD group-hover:scale-105 duration-300 text-black dark:text-white">
          {t("homepage.average")} 
          {t(title)} 
          {unit ? ` (${t(unit)})` : null}
        </h3>
        
        {isRadialCard ? (
          <div className="w-full md:h-[350px] justify-center items-center">
            <RadialGaugeChart 
              value={value}
              minValue={minValue}
              maxValue={maxValue}
              fillColor="#FF8C00"
            />
          </div>
        ) : (
          <div className="font-medium text-h4SM md:text-h3MD lg:text-h3LG text-black dark:text-white group-hover:scale-110 duration-300">
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}