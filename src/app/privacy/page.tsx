"use client"

import { motion } from "framer-motion"
import { Lock, Eye, ShieldCheck, Database, Globe } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 md:px-8">
      {/* Background flare */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.div custom={0} variants={fadeUp} className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto mb-6">
            <ShieldCheck size={32} />
          </motion.div>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-5xl font-serif mt-3 mb-6">Privacy Commitment</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            Your journey is personal. At Voya, we believe your data should be handled with the same care and precision as your travel plans.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-glass-border">
              <Database className="text-terracotta mb-4" size={24} />
              <h3 className="text-xl font-serif mb-2">Data Collection</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                We collect only the information necessary to craft your unique itineraries—such as destination preferences, companion details, and basic contact info. We never sell your personal data to third parties.
              </p>
            </div>
            <div className="glass-card p-8 rounded-3xl border border-glass-border">
              <Lock className="text-terracotta mb-4" size={24} />
              <h3 className="text-xl font-serif mb-2">Advanced Security</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                Our infrastructure uses industry-standard encryption protocols (AES-256) to ensure that your private plans and profile data remain yours and yours alone.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif flex items-center gap-3">
              <Eye size={22} className="text-terracotta" /> How We Use Your Data
            </h2>
            <div className="space-y-4">
              {[
                { title: "Personalization", desc: "Using AI to analyze your past preferences to deliver more accurate and inspiring future plans." },
                { title: "Communication", desc: "Updating you about your subscription, new features, and important security alerts." },
                { title: "Service Improvement", desc: "Analyzing aggregated usage patterns to optimize our travel engine for all explorers." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start border-l-2 border-glass-border pl-6 py-1">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-foreground/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif flex items-center gap-3">
              <Globe size={22} className="text-terracotta" /> Global Standards
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              We comply with global privacy standards, including GDPR and CCPA. You have the right to access, export, or permanently delete your data at any time through our profile settings. Transparency is at the core of our technical philosophy.
            </p>
          </section>

          <div className="pt-12 text-center text-xs text-foreground/30 border-t border-glass-border">
            Voya Privacy Policy ✦ For a safer exploration
          </div>
        </motion.div>
      </div>
    </div>
  )
}
