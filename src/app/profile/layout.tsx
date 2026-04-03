import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Rovago account, subscription, and travel history.",
  robots: { index: false, follow: false },
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
