"use client";
import DashboardDetails from "@/components/dashboard-detail/DashboardDetails";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";

export default function DashboardDetail(){
    return(
        <ThemeProvider>
            <SideBar hidden={false} />
            <DashboardDetails />
        </ThemeProvider>
    );
};