"use client";
import HomePage from "@/components/home-page/HomePage";
import SideBar from "@/components/ui/sidebar/SideBar";
import { ThemeProvider } from "@/hooks/useTheme";
import "@/translations/i18n";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-dark_blue duration-300">
      <ThemeProvider>
        <SideBar hidden={false} minimal={false} />
        <HomePage />
      </ThemeProvider>
    </main>
  );
}
