"use client"

import Link from "next/link"
import Image from "next/image"
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
            Craft your personalized journey in seconds with Rovago&apos;s AI travel assistant. Experience travel like never before.
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

      {/* ═══════════════ SEARCH & SAVE WIDGET ═══════════════ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card p-1 items-center justify-center rounded-[40px] border border-glass-border overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta/20 via-terracotta to-terracotta/20 animate-pulse" />
            
            <div className="p-8 md:p-12 text-center">
              <span className="text-xs font-bold text-terracotta uppercase tracking-[0.3em] mb-4 block">Search & Save</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-4">Find the Best Deals</h2>
              <p className="text-foreground/50 max-w-xl mx-auto mb-10">Search across hundreds of airlines and hotels to find the perfect stay at the best price.</p>
              
              {/* Travelpayouts Search Form Widget */}
              <div className="w-full min-h-[150px] relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm p-2 md:p-4 border border-white/10">
                <iframe 
                  src={`https://tp.media/content?currency=usd&promo_id=2088&shmarker=715711&campaign_id=100&trs=257697&target_host=search.aviasales.com&locale=en&type=compact&powered_by=true`}
                  width="100%" 
                  height="120" 
                  frameBorder="0" 
                  scrolling="no"
                  className="rounded-xl"
                />
              </div>
              
              <div className="mt-8 flex justify-center items-center gap-8 text-[10px] uppercase tracking-widest font-bold text-foreground/30">
                <span className="flex items-center gap-2 italic"><Sparkles size={12} className="text-terracotta"/> Best Price Guarantee</span>
                <span className="flex items-center gap-2 italic"><Star size={12} className="text-yellow-500"/> Verified Partners</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PARTNER BRANDS ═══════════════ */}
      <section className="py-12 border-y border-glass-border bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] font-bold text-foreground/30 mb-10">Our Affiliate Partners & Integrated Networks</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-serif text-xl"><span className="text-terracotta">Booking</span>.com</div>
             <div className="flex items-center gap-2 font-serif text-xl">aviasales</div>
             <div className="flex items-center gap-2 font-serif text-xl">KLOOK</div>
             <div className="flex items-center gap-2 font-serif text-xl">airalo</div>
             <div className="flex items-center gap-2 font-serif text-xl">GYG</div>
          </div>
        </div>
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
            <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Why Rovago?</motion.span>
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
              { name: "Sarah M.", location: "New York, USA", text: "Rovago planned my 10-day Italy trip in under a minute. Every restaurant suggestion was a hit. I didn't have to Google a single thing during the entire trip.", stars: 5, avatar: "SM" },
              { name: "Thomas K.", location: "Berlin, Germany", text: "As a digital nomad, I've tried dozens of travel planners. Rovago is the only one that actually understands budget constraints and gives realistic insider tips.", stars: 5, avatar: "TK" },
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

      {/* ═══════════════ CURATED EXPERIENCES (KLOOK) ═══════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-terracotta/20 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
            <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-[0.3em]">World Class Adventures</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-5xl font-serif mt-3 text-white">Curated Experiences</motion.h2>
            <motion.p custom={2} variants={fadeUp} className="text-foreground/50 max-w-xl mx-auto mt-4 text-sm tracking-tight italic">
              From historic landmarks to hidden local spots. Discover things to do worldwide, powered by Klook.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, title: "Skip-the-Line: Eiffel Tower", location: "Paris, France", image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=600&auto=format&fit=crop", link: "https://www.klook.com/en-US/activity/3308-eiffel-tower-paris/" },
              { id: 2, title: "Umeda Sky Building Observatory", location: "Osaka, Japan", image: "https://images.unsplash.com/photo-1512441932396-121034d0a5c0?q=80&w=600&auto=format&fit=crop", link: "https://www.klook.com/en-US/activity/2424-umeda-sky-building-floating-garden-observatory-osaka/" },
              { id: 3, title: "Warner Bros. Studio Tour London", location: "London, UK", image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=600&auto=format&fit=crop", link: "https://www.klook.com/en-US/activity/3307-warner-bros-studio-tour-london-the-making-of-harry-potter/" },
              { id: 4, title: "Desert Safari: Camel Ridings", location: "Dubai, UAE", image: "https://images.unsplash.com/photo-1454431939696-243f1c1eeedc?q=80&w=600&auto=format&fit=crop", link: "https://www.klook.com/en-US/activity/218-desert-safari-dubai/" },
              { id: 5, title: "Santorini Sunset Sailing Cruise", location: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop", link: "https://www.klook.com/en-US/activity/5520-santorini-sunset-catamaran-cruise/" },
              { id: 6, title: "Tokyo City Highlights Tour", location: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop", link: "https://www.klook.com/en-US/activity/13271-tokyo-day-tour-bus/" },
            ].map((tour, i) => (
              <motion.div key={tour.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="glass-card group rounded-[32px] border border-glass-border overflow-hidden relative h-[420px] flex flex-col hover:border-terracotta/30 transition-all shadow-xl">
                <div className="absolute inset-0 z-0">
                  <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/90" />
                </div>
                
                <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-terracotta mb-2 bg-white/5 px-2 py-1 rounded w-fit backdrop-blur-md border border-white/5 tracking-widest">
                    <MapPin size={10} /> {tour.location}
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-2 leading-tight group-hover:text-terracotta transition-colors">{tour.title}</h3>
                  <p className="text-xs text-white/50 mb-6 italic font-medium leading-relaxed uppercase tracking-wider">Top Experience Found by AI Explorer</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-4">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Verified Partner</span>
                    <a 
                      href={`https://tp.media/r?marker=715711&trs=257697&u=${encodeURIComponent(tour.link)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold hover:bg-terracotta hover:border-terracotta transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      View on Klook <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
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
            <h3 className="font-serif text-2xl mb-3">Rovago.</h3>
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
          <p className="text-xs text-foreground/40">© 2026 Rovago. All rights reserved.</p>
          <p className="text-xs text-foreground/40">Built with AI ✦ Designed for explorers</p>
        </div>
      </footer>

    </div>
  )
}
