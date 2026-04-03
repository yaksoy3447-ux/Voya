import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose your Rovago plan. Free, Explorer, or Nomad — unlock AI-powered travel itineraries, insider tips, and more.",
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
