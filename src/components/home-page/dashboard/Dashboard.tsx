import { PondData, SensorKey, getLatestDayData, loadFullPondData, sensorKeyMap, sensorUnits } from "@/data/pondData";
import { useIsMobile } from "@/hooks/useIsMobile";
import { fadeInYEnd, fadeInYInitial, fadeTransition } from "@/util/constant";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardAverageCard from "./DashboardAverageCard";

const DashboardChart = dynamic(() => import("./DashboardChart"), {
  ssr: false,
});

export default function Dashboard (){
    return(
        <div className="bg-dark_blue flex flex-col gap-5 p-5">
          <DashboardHeader />
          <DashboardContent />
        </div>
    );
};

const DashboardHeader = () => {
    const { t } = useTranslation();
    return (
      <motion.div
        initial={fadeInYInitial}
        whileInView={fadeInYEnd}
        transition={fadeTransition}
        viewport={{once: true}}
        className="pr-10 md:py-10 font-roboto text-left text-h3SM md:text-h2MD text-white"
      >
        {t("homepage.dashboard")}
      </motion.div>
    );
};

const DashboardContent = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [latestData, setLatestData] = useState<PondData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataPointCount = isMobile? 5 : 13;
  
  const parameters: SensorKey[] = ['temp', 'ph', 'do', 'ammonia', 'nitrate', 'turbidity', 'manganese'];
  const parameters1: SensorKey[] = ['temp', 'do', 'ammonia', 'nitrate', 'turbidity', 'manganese'];
  const parameters2: SensorKey[] = ['ph'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await loadFullPondData();
        
        const latestDayData = getLatestDayData(data);
        setLatestData(latestDayData);
      } catch (error) {
        console.error("Error loading pond data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const calculateAverage = (parameter: SensorKey): number => {
    if (latestData.length === 0) return 0;
    
    const sum = latestData.reduce((acc, item) => {
      return acc + (item[parameter] as number || 0);
    }, 0);
    
    return parseFloat((sum / latestData.length).toFixed(2));
  };
  
  const getLatestDataPoints = (count: number): PondData[] => {
    return latestData.slice(0, count);
  };
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading data...</div>;
  }
  
  return (
    <motion.div 
      initial={fadeInYInitial}
      whileInView={fadeInYEnd}
      transition={fadeTransition}
      viewport={{once: true}}
      className="w-full h-full flex flex-col gap-4"
    >
      <div className="w-full">
        <h2 className="font-roboto text-left text-h5SM md:text-h3MD lg:text-h3LG mb-4 text-white">{t("homepage.title")}</h2>
        {/* <p className="font-roboto text-left text-h4SM md:text-h4MD mb-4 text-light_grey">{t("homepage.desc")}</p> */}
        <div className="w-full h-full flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-3">
            {parameters1.map((param) => (
              <DashboardAverageCard
                key={param}
                title={sensorKeyMap[param]}
                value={calculateAverage(param)}
                unit={sensorUnits[param]}
              />
            ))}
          </div>
          <div className="w-full md:w-1/4 h-full">
            {parameters2.map((param) => (
              <DashboardAverageCard
                key={param}
                title={t(sensorKeyMap[param])}
                value={calculateAverage(param)}
                unit={sensorUnits[param]}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-full">
        <div className="font-roboto text-left text-h4SM md:text-h3MD lg:text-h3LG mb-2 text-white">
          {t("homepage.latestReadings")}
        </div>
        <div className="w-full h-[300px] md:h-[600px]">
          <DashboardChart 
            data={getLatestDataPoints(dataPointCount)} 
            parameters={parameters}
          />
        </div>
      </div>
    </motion.div>
  );
};