import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Rovago to access your personalized travel itineraries.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
