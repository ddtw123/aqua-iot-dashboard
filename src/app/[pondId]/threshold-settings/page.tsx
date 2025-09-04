"use client";
import ThresholdPage from "@/components/threshold-page/ThresholdPage";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";
import { useParams } from "next/navigation";

export default function PondThresholdSettingsPage() {
  // Using pondId for future pond-specific settings if needed
  const params = useParams<{ pondId: string }>();
  const pondId = params?.pondId ?? "";
  return (
    <ThemeProvider>
      <SideBar hidden={false} />
      <ThresholdPage deviceId={pondId} />
    </ThemeProvider>
  );
}


