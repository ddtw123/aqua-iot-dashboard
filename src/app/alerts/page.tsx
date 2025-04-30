"use client";
import AlertsPage from "@/components/alerts-page/AlertsPage";
import SideBar from "@/components/ui/sidebar/SideBar";
import "@/translations/i18n";

export default function Alerts(){
    return(
        <>
            <SideBar hidden={false} />
            <AlertsPage />
        </>
    );
};