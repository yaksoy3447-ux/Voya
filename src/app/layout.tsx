import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rovago — AI Powered Travel Planner",
    template: "%s | Rovago",
  },
  description: "Craft your personalized journey in seconds with Rovago's AI travel assistant. Day-by-day itineraries, hotel picks, and insider tips — all powered by Claude AI.",
  keywords: ["AI travel planner", "travel itinerary", "personalized travel", "AI trip planner", "travel assistant"],
  authors: [{ name: "Rovago" }],
  creator: "Rovago",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Rovago — AI Powered Travel Planner",
    description: "Craft your personalized journey in seconds with Rovago's AI travel assistant.",
    siteName: "Rovago",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rovago — AI Powered Travel Planner",
    description: "Craft your personalized journey in seconds with Rovago's AI travel assistant.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pt-20">
        <Header />
        {children}
      </body>
    </html>
  );
}
