"use client";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-dark_blue duration-300">
      <ThemeProvider>
        <SideBar hidden={false} minimal={false} />
        {children}
      </ThemeProvider>
    </main>
  );
}
