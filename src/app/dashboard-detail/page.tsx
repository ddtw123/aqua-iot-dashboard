"use client";
import DashboardDetails from "@/components/dashboard-detail/DashboardDetails";
import { ReactLenis } from "lenis/react";
import "@/translations/i18n";

export default function DashboardDetail(){
    return(
        <ReactLenis root>
            <DashboardDetails />
        </ReactLenis>
    );
};