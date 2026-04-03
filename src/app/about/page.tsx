"use client"

import { motion } from "framer-motion"
import { Globe, Heart, Shield, Sparkles, Compass } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 md:px-8">
      {/* Background ambient glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-terracotta/8 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-sand/8 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Our Story</motion.span>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-6xl font-serif mt-3 mb-6">Redefining the Art of Exploration</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            Voya was born from a simple realization: travel planning should be as inspiring as the journey itself. 
            We combine human curiosity with cutting-edge AI to craft itineraries that feel personal, authentic, and effortless.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp}
            className="glass-card p-10 rounded-3xl border border-glass-border">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta mb-6">
              <Compass size={24} />
            </div>
            <h2 className="text-2xl font-serif mb-4">Our Mission</h2>
            <p className="text-foreground/60 leading-relaxed">
              To empower every traveler to explore the world with confidence and curiosity. We believe that by removing the friction of research, we open the door to deeper experiences and more meaningful connections with the world.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4} variants={fadeUp}
            className="glass-card p-10 rounded-3xl border border-glass-border">
            <div className="w-12 h-12 rounded-2xl bg-sand/10 flex items-center justify-center text-sand mb-6">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-serif mb-4">Our Vision</h2>
            <p className="text-foreground/60 leading-relaxed">
              Become the world&apos;s most intuitive travel companion. We&apos;re building a future where your next adventure is just a thought away, perfectly tailored to your unique preferences and values.
            </p>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5} variants={fadeUp}
          className="text-center space-y-12 mb-20">
          <h2 className="text-3xl font-serif leading-tight">Guided by Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={20} />, title: "Authenticity", desc: "Discovering real places, not just tourist traps." },
              { icon: <Globe size={20} />, title: "Inspiration", desc: "Igniting the desire to see what&apos;s beyond the horizon." },
              { icon: <Shield size={20} />, title: "Integrity", desc: "Reliable, transparent, and always focused on you." }
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center text-foreground/40">{v.icon}</div>
                <h3 className="font-medium">{v.title}</h3>
                <p className="text-sm text-foreground/50">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6} variants={fadeUp}
          className="glass-card p-12 rounded-[40px] border border-terracotta/20 bg-terracotta/5 text-center relative overflow-hidden">
          <h2 className="text-3xl font-serif mb-4">Join the Journey</h2>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">We&apos;re just getting started. Be part of the community that&apos;s changing how we explore our planet.</p>
          <a href="/create" className="inline-flex h-12 px-8 items-center justify-center bg-terracotta text-white rounded-full font-medium shadow-lg shadow-terracotta/20 hover:scale-105 transition-all">Start Your Story</a>
        </motion.div>
      </div>
    </div>
  )
}
