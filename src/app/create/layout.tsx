import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Your Plan",
  description: "Tell Voya where you want to go. Our AI will craft a personalized day-by-day travel itinerary just for you.",
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
