import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HeroForm } from "@/components/travel/HeroForm"

export default async function CreatePlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-terracotta/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sand/20 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full z-10 pt-24 pb-12">
        <HeroForm />
      </div>
    </main>
  )
}
