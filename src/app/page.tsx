"use client";
import HomePage from "@/components/home-page/HomePage";
import SideBar from "@/components/ui/sidebar/SideBar";
import "@/translations/i18n";
import ReactLenis from "lenis/react";

export default function Home() {
  return (
    <ReactLenis root>
      <SideBar hidden={false} />
      <HomePage />
    </ReactLenis>
  );
}
