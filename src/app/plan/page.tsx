"use client"

export const dynamic = 'force-dynamic';

import { usePlanStore } from '@/store/usePlanStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Calendar, MapPin, Plane, Hotel, DollarSign, Compass, Star, Check, Sparkles, Lock, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'

interface Activity {
  title: string;
  type: string;
  time: string;
  estimatedCost: number;
  description: string;
  location: string;
}

interface Day {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

interface HotelInfo {
  name: string;
  rating: number;
  description: string;
  location: string;
  pricePerNight: number;
}

interface FlightInfo {
  departure: string;
  arrival: string;
  airline: string;
  date: string;
  price: number;
}

export default function PlanDashboard() {
  const { itinerary } = usePlanStore()
  const router = useRouter()
  const [activeDay, setActiveDay] = useState(1)
  const [isPro, setIsPro] = useState(false)
  const [loadingTier, setLoadingTier] = useState(true)

  useEffect(() => {
    if (!itinerary) {
      router.replace('/create')
      return;
    }

    if (!supabase) return; // Build-time safety

    const checkTier = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
          if (profile && profile.tier !== 'Free') {
            setIsPro(true)
          }
        }
      } catch (err) {
        console.error("Tier check failed:", err)
      } finally {
        setLoadingTier(false)
      }
    }
    checkTier()
  }, [itinerary, router])

  if (!itinerary) return null

  if (loadingTier) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-terracotta rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      {/* Ambient Lights */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-sand/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header Hero */}
        <div className="glass-card p-8 md:p-12 rounded-[32px] border border-glass-border relative overflow-hidden">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4 leading-tight">{itinerary.title}</h1>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl">{itinerary.summary}</p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-white/5 backdrop-blur-md">
                <DollarSign size={16} className="text-terracotta" />
                <span className="text-sm font-medium text-foreground/80">{itinerary.estimatedBudget.total} {itinerary.estimatedBudget.currency} Budget</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-white/5 backdrop-blur-md">
                <Calendar size={16} className="text-terracotta" />
                <span className="text-sm font-medium text-foreground/80">{itinerary.days.length} Days</span>
              </div>
              <button
                onClick={() => window.print()}
                className="no-print flex items-center gap-2 px-4 py-2 rounded-full border border-terracotta/30 bg-terracotta/10 text-terracotta hover:bg-terracotta/20 transition-all text-sm font-medium"
              >
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex absolute top-10 right-10 w-48 h-48 bg-glass-bg border border-glass-border/50 rounded-full items-center justify-center p-8 backdrop-blur-lg shadow-2xl">
            <div className="text-center">
               <Compass size={48} className="text-terracotta mx-auto mb-2 drop-shadow-[0_0_15px_rgba(215,92,61,0.5)]" />
               <span className="text-xs font-semibold uppercase tracking-widest text-foreground/60">Rovago AI Plan</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Itinerary Days) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-2">
              <MapPin className="text-terracotta"/> Your Itinerary
            </h2>

            {/* Day Selector */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
              {itinerary.days.map((d: Day) => {
                const isLocked = !isPro && d.day > 1;
                return (
                  <button 
                    key={d.day}
                    onClick={() => setActiveDay(d.day)}
                    className={`shrink-0 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeDay === d.day ? 'bg-terracotta text-white shadow-xl shadow-terracotta/20' : 'glass-card border border-glass-border text-foreground/70 hover:border-foreground/20'}`}
                  >
                    Day {d.day} {isLocked && <Lock size={14} className="inline ml-1 opacity-50" />}
                  </button>
                )
              })}
            </div>

            {/* Active Day Activities */}
            <AnimatePresence mode="wait">
              {itinerary.days.filter((d: Day) => d.day === activeDay).map((day: Day) => {
                const isDayLocked = !isPro && day.day > 1;
                return (
                <motion.div key={day.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 relative">
                   
                   {/* Paywall Overlay for Day 2+ */}
                   {isDayLocked && (
                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md rounded-3xl border border-glass-border p-6 text-center">
                       <Lock className="w-12 h-12 text-terracotta mb-4" />
                       <h3 className="text-2xl font-serif mb-2">Unlock Day {day.day}</h3>
                       <p className="text-sm text-foreground/60 mb-6 max-w-xs">Upgrade to Explorer or Nomad to unlock full day-by-day itineraries and hidden travel gems.</p>
                       <button onClick={() => router.push('/pricing')} className="h-10 px-6 bg-terracotta text-white font-medium rounded-full shadow-lg hover:bg-terracotta/90 transition-all">Upgrade Now</button>
                     </div>
                   )}

                   <div className={`px-2 py-4 border-b border-glass-border/40 flex justify-between items-end mb-4 ${isDayLocked ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                     <div>
                       <span className="text-xs font-medium text-terracotta uppercase tracking-wider">{day.date}</span>
                       <h3 className="text-xl font-medium text-foreground">{day.title}</h3>
                     </div>
                   </div>

                   <div className={`relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-glass-border before:to-transparent ${isDayLocked ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                      {day.activities.map((act: Activity, index: number) => {
                        const isFoodLocked = !isPro && act.type === "food" && !isDayLocked;
                        return (
                        <div key={index} className="relative flex items-start gap-6 group">
                          <div className="absolute -left-6 w-3 h-3 bg-terracotta rounded-full border-4 border-background shadow-[0_0_0_4px_rgba(215,92,61,0.1)] group-hover:scale-125 transition-transform" />
                          <div className={`glass-card flex-1 p-5 rounded-2xl border border-glass-border transition-colors relative overflow-hidden ${isFoodLocked ? 'opacity-80' : 'hover:border-terracotta/30'}`}>
                            
                            {isFoodLocked && (
                               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md">
                                 <Lock className="w-6 h-6 text-terracotta mb-2" />
                                 <span className="text-xs font-semibold uppercase tracking-wider mb-2">Dining Secret Locked</span>
                                 <button onClick={() => router.push('/pricing')} className="text-[10px] px-3 py-1 bg-terracotta text-white rounded-full">Unlock</button>
                               </div>
                            )}

                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 ${isFoodLocked ? 'blur-sm' : ''}`}>
                              <h4 className="font-medium text-foreground">{act.title}</h4>
                              <div className="flex gap-3 text-xs font-medium text-foreground/60">
                                <span className="flex items-center gap-1"><ClockIcon size={14}/> {act.time}</span>
                                {act.estimatedCost > 0 && <span className="flex items-center gap-1 text-green-400/80 text-[11px]">~${act.estimatedCost}</span>}
                              </div>
                            </div>
                            <p className={`text-sm text-foreground/70 mb-3 ${isFoodLocked ? 'blur-sm' : ''}`}>{act.description}</p>
                            <span className={`inline-flex items-center gap-1 text-xs text-foreground/50 border border-glass-border/40 rounded-full px-2 py-1 bg-white/5 ${isFoodLocked ? 'blur-sm' : ''}`}>
                              <MapPin size={12}/> {act.location}
                            </span>
                          </div>
                        </div>
                        )
                      })}
                   </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </div>

          {/* Sidebar (Flights, Hotels, Tips) */}
          <div className="space-y-6 lg:mt-14">
            
            {/* Hotels */}
            <div className="glass-card p-6 rounded-3xl border border-glass-border">
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2 mb-4">
                <Hotel className="text-terracotta" /> Perfect Stays
              </h3>
              <div className="space-y-4">
                {itinerary.hotels && itinerary.hotels.length > 0 ? (
                  itinerary.hotels.map((hotel: HotelInfo, idx: number) => (
                    <a
                      key={idx}
                      href={`https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.location)}&aid=2311236`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white/5 border border-glass-border rounded-2xl hover:border-terracotta/40 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm group-hover:text-terracotta transition-colors">{hotel.name}</h4>
                        <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full shrink-0 ml-2"><Star size={12} className="fill-yellow-500" /> {hotel.rating}</span>
                      </div>
                      <p className="text-xs text-foreground/60 mb-3 line-clamp-2">{hotel.description}</p>
                      <div className="flex items-center justify-between text-xs font-medium mb-3">
                        <span className="text-foreground/50"><MapPin size={12} className="inline mr-1"/>{hotel.location}</span>
                        <span className="text-terracotta font-bold">${hotel.pricePerNight} / night</span>
                      </div>
                      <div className="w-full py-2 bg-terracotta/10 border border-terracotta/30 rounded-xl text-center text-xs font-bold text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all">
                        Book on Booking.com →
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="p-4 border border-glass-border/20 rounded-2xl text-center text-xs text-foreground/40 font-medium">
                    Finding the best stays for you...
                  </div>
                )}
              </div>
            </div>

            {/* Flights */}
            <div className="glass-card p-6 rounded-3xl border border-glass-border">
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2 mb-4">
                <Plane className="text-terracotta" /> Flight Options
              </h3>
              <div className="space-y-3">
                {itinerary.flights && itinerary.flights.length > 0 ? (
                  itinerary.flights.map((flight: FlightInfo, idx: number) => {
                    const depDate = flight.date ? new Date(flight.date) : null;
                    const dd = depDate ? String(depDate.getUTCDate()).padStart(2,'0') : '01';
                    const mm = depDate ? String(depDate.getUTCMonth()+1).padStart(2,'0') : '06';
                    const bookingUrl = `https://www.aviasales.com/search/${flight.departure}${dd}${mm}${flight.arrival}1?marker=715711`;
                    return (
                    <a
                      key={idx}
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-glass-border/40 rounded-xl bg-white/5 hover:border-terracotta/40 hover:bg-white/10 transition-all group space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2 group-hover:text-terracotta transition-colors">
                            {flight.departure} <Plane size={14} className="text-foreground/40 rotate-90"/> {flight.arrival}
                          </div>
                          <div className="text-xs text-foreground/50 font-medium mt-0.5">{flight.airline} • {flight.date}</div>
                        </div>
                        <span className="text-sm font-bold text-terracotta">${flight.price}</span>
                      </div>
                      <div className="w-full py-2 bg-terracotta/10 border border-terracotta/30 rounded-lg text-center text-xs font-bold text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all">
                        Book this Flight on Aviasales →
                      </div>
                    </a>
                    )
                  })
                ) : (
                  <div className="p-3 border border-glass-border/20 rounded-xl text-center text-xs text-foreground/40 font-medium">
                    Optimizing flight routes...
                  </div>
                )}
              </div>
            </div>

            {/* Insider Tips */}
            <div className="glass-card p-6 rounded-3xl border border-glass-border bg-terracotta/5 relative overflow-hidden">
               
               {!isPro && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md">
                   <Lock className="w-8 h-8 text-terracotta mb-2" />
                   <span className="text-sm font-medium mb-3">Insider Tips Locked</span>
                   <button onClick={() => router.push('/pricing')} className="text-xs px-4 py-2 bg-terracotta text-white rounded-full">Unlock Everything</button>
                 </div>
               )}

              <h3 className={`font-serif text-lg text-terracotta flex items-center gap-2 mb-4 ${!isPro ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                <Sparkles size={18} /> Insider Tips
              </h3>
              <ul className={`space-y-3 ${!isPro ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                {(itinerary.insiderTips || []).map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={16} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="leading-snug">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )
}
