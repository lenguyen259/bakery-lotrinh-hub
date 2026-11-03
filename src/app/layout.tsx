import type { Metadata } from "next";
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { AiModeBanner } from "@/components/AiModeBanner";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lộ trình — Portfolio hub",
  description:
    "Portfolio demo: backlog, roadmap, and leadership brief for a fictional bakery programme.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${beVietnam.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <AiModeBanner />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <DisclaimerFooter />
      </body>
    </html>
  );
}
