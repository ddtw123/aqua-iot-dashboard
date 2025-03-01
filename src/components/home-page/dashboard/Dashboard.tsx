import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Dashboard (){
    return(
        <div>
            <DashboardHeader />
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
}