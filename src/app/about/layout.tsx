import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Rovago — the AI-powered travel planner built to craft personalized, day-by-day itineraries for every kind of explorer.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
