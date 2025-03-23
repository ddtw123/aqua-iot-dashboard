"use client";
import DashboardDetails from "@/components/dashboard-detail/DashboardDetails";
import SideBar from "@/components/ui/sidebar/SideBar";
import "@/translations/i18n";

export default function DashboardDetail(){
    return(
        <>
            <SideBar hidden={false} />
            <DashboardDetails />
        </>
    );
};