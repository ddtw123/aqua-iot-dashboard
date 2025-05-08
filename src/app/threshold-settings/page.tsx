"use client";
import ThresholdPage from "@/components/threshold-page/ThresholdPage";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";

export default function ThresholdSettingsPage(){
    return(
        <ThemeProvider>
            <SideBar hidden={false} />
            <ThresholdPage />
        </ThemeProvider>
    );
};