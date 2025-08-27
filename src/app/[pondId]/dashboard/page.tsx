"use client";
import Dashboard from "@/components/dashboard-page/Dashboard";
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
      <Dashboard pondId={pondId} />
    </ThemeProvider>
  );
}


