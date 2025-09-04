"use client";
import DashboardDetails from "@/components/dashboard-detail/DashboardDetails";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";
import { useParams } from "next/navigation";

export default function PondDashboardPage() {
  const params = useParams<{ pondId: string }>();
  const pondId = params?.pondId ?? "";

  return (
    <ThemeProvider>
      <SideBar hidden={false} />
      <DashboardDetails deviceId={pondId} />
    </ThemeProvider>
  );
}


