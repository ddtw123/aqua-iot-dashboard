import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Dashboard (){
    return(
        <div>
            <DashboardHeader />
            <DashboardContent />
        </div>
    );
};

const DashboardHeader = () => {
    const { t } = useTranslation();
    return (
        <motion.div className="font-poppins font-medium text-h2SM md:text-h2MD lg:text-h2LG">
            {t("homepage.dashboard")}
        </motion.div>
    );
};

const DashboardContent = () => {
    return(
        <motion.div className="w-full flex flex-row overflow-hidden">
            <div className="w-2/3">

            </div>
            <div className="w-1/3 flex flex-col gap-4">
            </div>
        </motion.div>
    );
};