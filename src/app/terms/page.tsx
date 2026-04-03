"use client"

import { motion } from "framer-motion"
import { Shield, FileText, Scale, HelpCircle } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.div custom={0} variants={fadeUp} className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto mb-6">
            <Scale size={32} />
          </motion.div>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-5xl font-serif mt-3 mb-6">Terms of Service</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            Welcome to Voya. By using our platform, you agree to these legal terms designed to ensure a safe and professional experience for all travelers.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-12">
          {/* Main Content */}
          <div className="prose prose-invert max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-serif flex items-center gap-3 text-terracotta">
                <FileText size={22} /> 1. Nature of Our Services
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Voya is a premium, AI-powered travel dashboard. Unlike traditional fragmented tools, Voya serves as a unified intelligence hub. Our platform eliminates the need for separate research across flight engines, hotel booking sites, and car rental services. By integrating sophisticated algorithms, we provide a single, professional interface to discover and organize your entire journey—from transport and accommodation to local secrets and transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-serif flex items-center gap-3 text-terracotta">
                <Shield size={22} /> 2. User Responsibilities
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                As a traveler on Voya, you agree to provide accurate information when generating plans. You are responsible for maintaining the security of your account and for all activities that occur under your credentials. We provide the tools for discovery, but the final booking and travel arrangements remain your professional responsibility.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-serif flex items-center gap-3 text-terracotta">
                <Scale size={22} /> 3. Intellectual Property
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                The itineraries, designs, and AI algorithms generated on Voya are protected by international copyright laws. These materials are provided for your personal use and may not be redistributed, sold, or used for commercial purposes without explicit authorization.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-serif flex items-center gap-3 text-terracotta">
                <HelpCircle size={22} /> 4. Limitation of Liability
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                While our AI strives for perfection, travel conditions change. Voya provides recommendations in good faith but does not guarantee the availability, pricing, or quality of third-party services. We are an intelligence layer designed to enhance your decision-making, not a direct provider of travel services.
              </p>
            </section>
          </div>

          <div className="pt-12 text-center text-xs text-foreground/30 border-t border-glass-border">
            Voya AI Travel Planner © 2026 ✦ Professional Exploration Standard
          </div>
        </motion.div>
      </div>
    </div>
  )
}
