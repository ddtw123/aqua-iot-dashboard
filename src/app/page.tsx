"use client";
import HomePage from "@/components/home-page/HomePage";
import SideBar from "@/components/ui/sidebar/SideBar";
import "@/translations/i18n";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-dark_blue">
      <SideBar hidden={false} />
      <HomePage />
    </main>
  );
}
