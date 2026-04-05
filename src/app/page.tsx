"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, MapPin, Calendar, Compass, Star, ArrowRight, Shield, Zap, Globe, Users, ChevronRight, Clock, DollarSign, Utensils, Brain, ChevronDown, Plus, Minus } from "lucide-react"

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } })
}

const FROM_CITIES = [
  { name: 'Istanbul', code: 'IST' }, { name: 'London', code: 'LHR' },
  { name: 'Paris', code: 'CDG' }, { name: 'Dubai', code: 'DXB' },
  { name: 'Tokyo', code: 'NRT' }, { name: 'New York', code: 'JFK' },
  { name: 'Singapore', code: 'SIN' }, { name: 'Barcelona', code: 'BCN' },
]
const TO_CITIES = [
  { name: 'Bali', code: 'DPS' }, { name: 'Maldives', code: 'MLE' },
  { name: 'Rome', code: 'FCO' }, { name: 'Santorini', code: 'JTR' },
  { name: 'Bangkok', code: 'BKK' }, { name: 'Sydney', code: 'SYD' },
  { name: 'Miami', code: 'MIA' }, { name: 'Cape Town', code: 'CPT' },
]

export default function LandingPage() {
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 500], [0, 150])
  const videoScale = useTransform(scrollY, [0, 500], [1, 1.1])

  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [showPassengers, setShowPassengers] = useState(false)
  const [fromIdx, setFromIdx] = useState(0)
  const [toIdx, setToIdx] = useState(3)
  const [searchError, setSearchError] = useState('')
  const passengersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setFromIdx(i => (i + 1) % FROM_CITIES.length)
      setToIdx(i => (i + 1) % TO_CITIES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (passengersRef.current && !passengersRef.current.contains(e.target as Node)) {
        setShowPassengers(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const getCode = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null
    if (!el) return ''
    if (el.dataset.code) return el.dataset.code
    const match = el.value.match(/\(([A-Z]{3})\)/)
    return match ? match[1] : ''
  }

  const handleSearch = () => {
    const fromCode = getCode('search-from-v2')
    const toCode = getCode('search-to-v2')
    if (!fromCode) { setSearchError('Please select a departure city.'); return }
    if (!toCode) { setSearchError('Please select a destination.'); return }
    setSearchError('')
    const depVal = (document.getElementById('search-dep-date') as HTMLInputElement)?.value
    const retVal = (document.getElementById('search-ret-date') as HTMLInputElement)?.value
    const dep = depVal ? new Date(depVal) : new Date()
    const depDD = String(dep.getUTCDate()).padStart(2, '0')
    const depMM = String(dep.getUTCMonth() + 1).padStart(2, '0')
    const pax = adults + children
    let url = `https://www.aviasales.com/search/${fromCode}${depDD}${depMM}${toCode}${pax}?marker=715711`
    if (tripType === 'roundtrip' && retVal) {
      const ret = new Date(retVal)
      const retDD = String(ret.getUTCDate()).padStart(2, '0')
      const retMM = String(ret.getUTCMonth() + 1).padStart(2, '0')
      url = `https://www.aviasales.com/search/${fromCode}${depDD}${depMM}${toCode}${pax}${retDD}${retMM}?marker=715711`
    }
    window.open(url, '_blank')
  }

  const allExperiences = [
    { id: 1, type: 'klook', title: "Private Seine Cruise", loc: "Paris", tag: "Most Booked", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", link: "https://www.klook.com/en-US/search/result/?query=Seine+River+Cruise+Paris&marker=715711" },
    { id: 2, type: 'klook', title: "Shibuya Sky Views", loc: "Tokyo", tag: "Trending", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop", link: "https://www.klook.com/en-US/search/result/?query=Shibuya+Sky+Observation+Deck+Tokyo&marker=715711" },
    { id: 3, type: 'klook', title: "Warner Bros. Studios", loc: "London", tag: "Family Favorite", img: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=800&auto=format&fit=crop", link: "https://www.klook.com/en-US/search/result/?query=Warner+Bros+Studio+Tour+London+Harry+Potter&marker=715711" },
    { id: 4, type: 'viator', title: "Grand Canyon Helicopter", loc: "Las Vegas", tag: "Bucket List", img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=800&auto=format&fit=crop", link: "https://www.viator.com/search/Grand+Canyon+Helicopter+Las+Vegas/?pid=P00121703&mcid=42383&medium=link" },
    { id: 5, type: 'viator', title: "Amalfi Coast Sailing", loc: "Positano", tag: "Romantic", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop", link: "https://www.viator.com/search/Amalfi+Coast+Boat+Tour/?pid=P00121703&mcid=42383&medium=link" },
    { id: 6, type: 'viator', title: "Colosseum Underground", loc: "Rome", tag: "History", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop", link: "https://www.viator.com/search/Colosseum+Underground+Rome/?pid=P00121703&mcid=42383&medium=link" },
    { id: 7, type: 'klook', title: "Burj Khalifa Level 124", loc: "Dubai", tag: "Skyline", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop", link: "https://www.klook.com/en-US/search/result/?query=Burj+Khalifa+Level+124+Dubai&marker=715711" },
    { id: 8, type: 'viator', title: "Gondola Serenade", loc: "Venice", tag: "Classic", img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop", link: "https://www.viator.com/search/Gondola+Serenade+Venice/?pid=P00121703&mcid=42383&medium=link" },
    { id: 9, type: 'klook', title: "Eiffel Tower Summit", loc: "Paris", tag: "Iconic", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop", link: "https://www.klook.com/en-US/search/result/?query=Eiffel+Tower+Summit+Paris&marker=715711" },
    { id: 10, type: 'viator', title: "Alcatraz Island Tour", loc: "San Francisco", tag: "Must See", img: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=800&auto=format&fit=crop", link: "https://www.viator.com/search/Alcatraz+Island+Tour+San+Francisco/?pid=P00121703&mcid=42383&medium=link" },
  ]

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
      </section>

      {/* ═══════════════ SEARCH & DEALS SECTION ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 md:p-12 rounded-[48px] border border-glass-border/40 text-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-terracotta uppercase tracking-[0.4em] mb-4 block italic">Direct Booking Integration</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Find the Best Deals</h2>

              {/* TRIP TYPE + PASSENGERS */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                  <button onClick={() => setTripType('oneway')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${tripType === 'oneway' ? 'bg-terracotta text-white' : 'text-foreground/40 hover:text-foreground/70'}`}>One Way</button>
                  <button onClick={() => setTripType('roundtrip')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${tripType === 'roundtrip' ? 'bg-terracotta text-white' : 'text-foreground/40 hover:text-foreground/70'}`}>Round Trip</button>
                </div>

                <div className="relative" ref={passengersRef}>
                  <button onClick={() => setShowPassengers(v => !v)} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-foreground/60 hover:border-terracotta/30 transition-all">
                    <Users size={12} className="text-terracotta" /> {adults + children} Passengers
                  </button>
                  {showPassengers && (
                    <div className="absolute right-0 top-full mt-2 bg-background border border-white/10 rounded-2xl p-4 min-w-[220px] shadow-2xl z-50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold">Adults</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setAdults(v => Math.max(1, v - 1))} className="w-8 h-8 rounded-full bg-white/5">-</button>
                          <span>{adults}</span>
                          <button onClick={() => setAdults(v => v + 1)} className="w-8 h-8 rounded-full bg-white/5">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Children</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setChildren(v => Math.max(0, v - 1))} className="w-8 h-8 rounded-full bg-white/5">-</button>
                          <span>{children}</span>
                          <button onClick={() => setChildren(v => v + 1)} className="w-8 h-8 rounded-full bg-white/5">+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEARCH FORM */}
              <div className="bg-white/5 backdrop-blur-xl p-3 rounded-[32px] border border-white/10 flex flex-col lg:flex-row gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="bg-white/5 rounded-2xl p-4 text-left">
                    <span className="text-[9px] font-bold text-terracotta uppercase">From</span>
                    <input id="search-from-v2" placeholder="Istanbul (IST)" className="bg-transparent border-none text-white text-sm w-full focus:ring-0 p-0" />
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-left">
                    <span className="text-[9px] font-bold text-terracotta uppercase">To</span>
                    <input id="search-to-v2" placeholder="Bali (DPS)" className="bg-transparent border-none text-white text-sm w-full focus:ring-0 p-0" />
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-left">
                    <span className="text-[9px] font-bold text-terracotta uppercase">Date</span>
                    <input id="search-dep-date" type="date" className="bg-transparent border-none text-white text-sm w-full focus:ring-0 p-0" />
                  </div>
                  {tripType === 'roundtrip' && (
                    <div className="bg-white/5 rounded-2xl p-4 text-left">
                      <span className="text-[9px] font-bold text-terracotta uppercase">Return</span>
                      <input id="search-ret-date" type="date" className="bg-transparent border-none text-white text-sm w-full focus:ring-0 p-0" />
                    </div>
                  )}
                </div>
                <button onClick={handleSearch} className="h-16 px-10 bg-terracotta text-white rounded-2xl text-xs font-bold hover:scale-[1.02] transition-all">
                  Search Deals
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CURATED EXPERIENCES ═══════════════ */}
      <section className="py-32 px-6 relative bg-linear-to-b from-background to-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-6">
            <div className="max-w-2xl">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-xs font-bold text-terracotta uppercase tracking-[0.5em] mb-4 block">Handpicked for you</motion.span>
              <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.1]">Signature <span className="italic text-foreground/40">Experiences</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-6">
            {allExperiences.map((tour, i) => (
              <motion.div key={tour.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.05 }} className="group relative h-[450px] rounded-[32px] overflow-hidden border border-white/5">
                <a href={tour.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-linear-to-b from-transparent to-black/90">
                  <div className="relative z-30 space-y-3">
                    <span className={`text-[8px] font-bold text-white px-2.5 py-0.5 rounded-full uppercase ${tour.type === 'viator' ? 'bg-orange-600' : 'bg-terracotta'}`}>{tour.tag}</span>
                    <h3 className="text-xl font-serif text-white">{tour.title}</h3>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                       <span className="text-[8px] text-white/50 uppercase">via {tour.type}</span>
                       <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center"><ArrowRight size={16} /></div>
                    </div>
                  </div>
                </a>
                <div style={{ backgroundImage: `url(${tour.img})` }} className="absolute inset-0 z-10 bg-cover bg-center group-hover:scale-105 transition-transform duration-[2000ms]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-glass-border py-20 px-6 text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-left mb-16">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-2xl mb-4">Rovago.</h3>
            <p className="text-sm text-foreground/40 leading-relaxed">Artfully crafted seyahatler, powered by AI.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 translate-y-[-2px]">Product</h4>
            <ul className="space-y-3 text-sm text-foreground/40">
              <li><Link href="/create">Create Plan</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 translate-y-[-2px]">Company</h4>
            <ul className="space-y-3 text-sm text-foreground/40">
               <li><Link href="/about">About</Link></li>
               <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 translate-y-[-2px]">Legal</h4>
            <ul className="space-y-3 text-sm text-foreground/40">
               <li><Link href="/privacy">Privacy</Link></li>
               <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="text-[10px] text-foreground/20 uppercase tracking-[0.4em]">© 2026 Rovago - All Rights Reserved</p>
      </footer>

    </div>
  )
}
