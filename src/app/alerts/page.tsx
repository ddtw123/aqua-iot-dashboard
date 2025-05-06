"use client";
import AlertsPage from "@/components/alerts-page/AlertsPage";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";

export default function Alerts(){
    return(
        <ThemeProvider>
            <SideBar hidden={false} />
            <AlertsPage />
        </ThemeProvider>
    );
};