"use client";
import AlertsPage from "@/components/alerts-page/AlertsPage";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";
import { useParams } from "next/navigation";

export default function PondAlertsPage() {
  const params = useParams<{ pondId: string }>();
  const pondId = params?.pondId ?? "";

  return (
    <ThemeProvider>
      <SideBar hidden={false} />
      <AlertsPage deviceId={pondId} />
    </ThemeProvider>
  );
}


