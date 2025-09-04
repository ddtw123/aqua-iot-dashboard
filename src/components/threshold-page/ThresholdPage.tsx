import ThresholdSettingsPage from "./threshold-component/ThresholdSettings";

export default function ThresholdPage({ deviceId }: { deviceId?: string }){
    return(
        <div className="flex flex-col min-h-screen bg-white dark:bg-dark_blue duration-300">
            <ThresholdSettingsPage deviceId={deviceId} />
        </div>
    );
};