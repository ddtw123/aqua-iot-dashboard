import ThresholdSettingsPage from "./threshold-component/ThresholdSettings";

export default function ThresholdPage(){
    return(
        <div className="flex flex-col min-h-screen bg-white dark:bg-dark_blue duration-300">
            <ThresholdSettingsPage />
        </div>
    );
};