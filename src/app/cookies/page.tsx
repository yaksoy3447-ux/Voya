"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Eye, ToggleLeft, Info } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.div custom={0} variants={fadeUp} className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto mb-6">
            <ToggleLeft size={32} />
          </motion.div>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-5xl font-serif mt-3 mb-6">Cookie Policy</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-foreground/60 leading-relaxed">
            We use cookies to improve your travel planning experience. Learn how we use them and how you can manage your preferences.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-terracotta mb-2">
              <Info size={20} />
              <h2 className="text-xl font-serif font-medium">What are Cookies?</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed">
              Cookies are small text files stored on your device that help us remember your preferences, keep you logged in, and analyze how you interact with Voya. They help us provide a smoother, more personalized service.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-terracotta mb-2">
              <ShieldCheck size={20} />
              <h2 className="text-xl font-serif font-medium">Types of Cookies We Use</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Essential Cookies", desc: "Necessary for the website to function. They handle authentication, security, and basic navigation." },
                { title: "Preference Cookies", desc: "Remember settings like your preferred language or currency for future visits." },
                { title: "Analytics Cookies", desc: "Help us understand how travelers use Voya so we can optimize the interface and engine." }
              ].map((c, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl border border-glass-border">
                  <h3 className="font-medium mb-1 font-serif text-lg">{c.title}</h3>
                  <p className="text-sm text-foreground/50">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-terracotta mb-2">
              <Eye size={20} />
              <h2 className="text-xl font-serif font-medium">Managing Your Choices</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed">
              You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies, though this may impact your ability to use certain features on Voya.
            </p>
          </section>

          <div className="pt-12 text-center text-xs text-foreground/30 border-t border-glass-border">
            Voya AI Travel Planner ✦ Built for explorers
          </div>
        </motion.div>
      </div>
    </div>
  )
}
