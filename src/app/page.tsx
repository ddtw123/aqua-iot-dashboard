"use client";
import HomePage from "@/components/home-page/HomePage";
import ReactLenis from "lenis/react";
import "../translations/i18n";

export default function Home() {
  return (
    <ReactLenis root>
      <HomePage />
    </ReactLenis>
  );
}
