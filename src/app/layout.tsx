import type { Metadata } from "next";
import { Roboto, Inter, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700", "900"],
})


export const metadata: Metadata = {
  title: "IoT Dashboard",
  description: "UTAR FYP IoT Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
