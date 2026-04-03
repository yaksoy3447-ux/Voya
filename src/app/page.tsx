"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, MapPin, Calendar, Compass, Star, ArrowRight, Shield, Zap, Globe, Users, ChevronRight, Clock, DollarSign, Utensils, Brain } from "lucide-react"

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } })
}

export default function LandingPage() {
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 500], [0, 150])
  const videoScale = useTransform(scrollY, [0, 500], [1, 1.1])

  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        
        {/* Cinematic Video Background */}
        <motion.div 
          style={{ y: videoY, scale: videoScale }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            className="w-full h-full object-cover opacity-30 brightness-[0.6] contrast-[1.1]"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-island-resort-and-luxury-pool-14068-large.mp4" type="video/mp4" />
          </video>
          {/* Overlay Gradient Mask */}
          <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/40 to-background" />
        </motion.div>

        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-terracotta/5 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/3 pointer-events-none z-1" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sand/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/3 pointer-events-none z-1" />
        
        <motion.div initial="hidden" animate="visible" className="relative z-10 max-w-3xl mx-auto space-y-8">
          <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-white/5 backdrop-blur-md text-sm text-foreground/70">
            <Sparkles size={14} className="text-terracotta" /> AI-Powered Travel Planning
          </motion.div>
          
          <motion.h1 custom={1} variants={fadeUp} className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
            Design Your Dream Journey,<br />
            <span className="text-terracotta">Powered by Intelligence</span>
          </motion.h1>
          
          <motion.p custom={2} variants={fadeUp} className="text-lg md:text-xl text-foreground/60 max-w-xl mx-auto leading-relaxed">
            Craft your personalized journey in seconds with Voya&apos;s AI travel assistant. Experience travel like never before.
          </motion.p>
          
          <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/create" className="group inline-flex items-center justify-center gap-2 h-14 px-8 bg-terracotta text-white font-medium rounded-full shadow-xl shadow-terracotta/20 hover:shadow-terracotta/40 hover:scale-105 transition-all duration-300">
              Create My Plan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 h-14 px-8 border border-glass-border bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-all duration-300">
              View Pricing
            </Link>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} className="flex items-center justify-center gap-6 pt-6 text-sm text-foreground/50">
            <span className="flex items-center gap-1"><Shield size={14} className="text-green-400" /> No credit card required</span>
            <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> Plans in under 30 seconds</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-2 bg-terracotta rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">The Process</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-5xl font-serif mt-3">From Idea to Itinerary in 3 Steps</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="text-terracotta" />, step: "01", title: "Share Your Vision", desc: "Just tell us where you want to go and what you love. We handle the rest." },
              { icon: <Brain className="text-terracotta" />, step: "02", title: "AI Intelligence", desc: "Our engine analyzes thousands of spots to find your perfect matches." },
              { icon: <Compass className="text-terracotta" />, step: "03", title: "Instant Magic", desc: "Receive a day-by-day itinerary tailored precisely to your preferences." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="glass-card p-8 rounded-3xl border border-glass-border hover:border-terracotta/20 transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-serif text-foreground/5 font-bold">{item.step}</div>
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-terracotta/10 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES BENTO GRID ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-terracotta/3 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Why Voya?</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-5xl font-serif mt-3">Smart Features for Smart Travelers</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Globe size={22} />, title: "Hyper-Local Content", desc: "Access hidden gems and local favorites that standard guides miss." },
              { icon: <Utensils size={22} />, title: "Dining Optimization", desc: "Personalized food recommendations based on your unique dietary needs." },
              { icon: <Star size={22} />, title: "Premium Access", desc: "Unlock exclusive spots and insider tips with Nomad and Explorer tiers." },
              { icon: <Clock size={22} />, title: "Time Optimization", desc: "Our AI groups nearby locations to minimize travel time between spots." },
              { icon: <DollarSign size={22} />, title: "Budget Planning", desc: "Real-time cost estimates for every activity in your personalized plan." },
              { icon: <Users size={22} />, title: "Group Sync", desc: "Collaborate on travel plans with friends and family in real-time." },
            ].map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="glass-card p-6 rounded-2xl border border-glass-border hover:border-terracotta/20 transition-all">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-terracotta/10 text-terracotta mb-4">{f.icon}</div>
                <h3 className="text-lg font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Global Feedback</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-5xl font-serif mt-3">Trusted by Travelers Worldwide</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", location: "New York, USA", text: "Voya planned my 10-day Italy trip in under a minute. Every restaurant suggestion was a hit. I didn't have to Google a single thing during the entire trip.", stars: 5, avatar: "SM" },
              { name: "Thomas K.", location: "Berlin, Germany", text: "As a digital nomad, I've tried dozens of travel planners. Voya is the only one that actually understands budget constraints and gives realistic insider tips.", stars: 5, avatar: "TK" },
              { name: "Yuki T.", location: "Tokyo, Japan", text: "The route optimization is incredible. It saved us hours of walking by grouping nearby attractions together. The dining secrets were absolutely worth the upgrade.", stars: 5, avatar: "YT" },
            ].map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="glass-card p-8 rounded-3xl border border-glass-border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 border-t border-glass-border pt-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center text-sm font-bold">{t.avatar}</div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-foreground/50">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="glass-card p-12 md:p-16 rounded-[32px] border border-terracotta/20 bg-terracotta/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-terracotta/10 rounded-full blur-[120px] pointer-events-none" />
            <motion.div custom={0} variants={fadeUp} className="relative z-10">
              <Compass size={48} className="text-terracotta mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-serif mb-4">Ready for Your Next Adventure?</h2>
              <p className="text-foreground/60 max-w-lg mx-auto mb-8 text-lg">Stop researching and start exploring. Create your perfect travel plan today with AI.</p>
              <Link href="/create" className="group inline-flex items-center gap-2 h-14 px-10 bg-terracotta text-white font-medium rounded-full shadow-xl shadow-terracotta/20 hover:shadow-terracotta/40 hover:scale-105 transition-all duration-300 text-lg">
                Start Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-glass-border py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-2xl mb-3">Voya.</h3>
            <p className="text-sm text-foreground/50 leading-relaxed">Where AI meets the art of travel.</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-foreground/70 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="/create" className="hover:text-terracotta transition-colors">Create Plan</Link></li>
              <li><Link href="/pricing" className="hover:text-terracotta transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-terracotta transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm text-foreground/70 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="/about" className="hover:text-terracotta transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-terracotta transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-terracotta transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm text-foreground/70 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="/terms" className="hover:text-terracotta transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-terracotta transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-terracotta transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-glass-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/40">© 2026 Voya. All rights reserved.</p>
          <p className="text-xs text-foreground/40">Built with AI ✦ Designed for explorers</p>
        </div>
      </footer>

    </div>
  )
}
