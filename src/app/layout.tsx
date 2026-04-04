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
  metadataBase: new URL("https://rovago.app"),
  title: {
    default: "Rovago — AI-Powered Smart Travel Planner",
    template: "%s | Rovago",
  },
  description: "Plan your dream journey in minutes with Rovago's AI seyahat asistanı. Day-by-day itineraries, premium hotel picks, and local insider tips — all powered by advanced intelligence.",
  keywords: ["AI travel planner", "travel itinerary", "personalized travel", "AI trip planner", "travel assistant", "luxury travel AI"],
  authors: [{ name: "Rovago" }],
  creator: "Rovago",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rovago.app",
    title: "Rovago — AI-Powered Smart Travel Planner",
    description: "Plan your dream journey in minutes with Rovago's AI travel assistant. Experience travel like never before.",
    siteName: "Rovago",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Rovago AI Travel Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rovago — AI-Powered Smart Travel Planner",
    description: "Plan your dream journey in minutes with Rovago's AI travel assistant.",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rovago.app",
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
