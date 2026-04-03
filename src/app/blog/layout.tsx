import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Explorer Journal",
  description: "Travel stories, destination guides, and AI-powered trip inspiration from the Voya team.",
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
