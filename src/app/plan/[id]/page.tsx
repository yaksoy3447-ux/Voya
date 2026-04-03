"use client"

export const dynamic = 'force-dynamic';

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Calendar, MapPin, Plane, Hotel, DollarSign, Compass, Star, Check, Sparkles, Lock, Download, Share2, Copy, Check as CheckIcon, Globe, Shield, Car } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

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

export default function PlanHistoryViewer() {
  const params = useParams()
  const router = useRouter()
  const [itinerary, setItinerary] = useState<any>(null)
  const [activeDay, setActiveDay] = useState(1)
  const [isPro, setIsPro] = useState(false)
  const [isNomad, setIsNomad] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)
  const [realPrices, setRealPrices] = useState<Record<number, { price: number | null, airline: string | null, loading: boolean }>>({})

  useEffect(() => {
    if (!supabase) return; // Build safety
    
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch Tier
        const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
        if (profile && profile.tier !== 'Free') setIsPro(true)
        if (profile && profile.tier === 'Nomad') setIsNomad(true)

        // Fetch Plan
        const { data: plan, error: planError } = await supabase
          .from('plans')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (planError || !plan) {
          setError("Plan not found or you don't have access.")
        } else {
          setItinerary(plan.itinerary)
          setIsPublic(plan.is_public || false)
        }
      } catch (err: any) {
        console.error(err)
        setError("An error occurred while loading the plan.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id, router])

  // Fetch real flight prices from Travelpayouts when itinerary loads
  useEffect(() => {
    if (!itinerary?.flights?.length) return;
    itinerary.flights.forEach((flight: any, idx: number) => {
      if (!flight.departure || !flight.arrival || !flight.date) return;
      setRealPrices(prev => ({ ...prev, [idx]: { price: null, airline: null, loading: true } }));
      fetch(`/api/flights?origin=${flight.departure}&destination=${flight.arrival}&date=${flight.date}`)
        .then(r => r.json())
        .then(data => setRealPrices(prev => ({ ...prev, [idx]: { price: data.price, airline: data.airline, loading: false } })))
        .catch(() => setRealPrices(prev => ({ ...prev, [idx]: { price: null, airline: null, loading: false } })));
    });
  }, [itinerary])

  const handleTogglePublic = async () => {
    if (!supabase) return;
    const newVal = !isPublic
    setIsPublic(newVal)
    await supabase.from('plans').update({ is_public: newVal }).eq('id', params.id)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-terracotta rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-full bg-white/5 mb-6 text-terracotta/40">
           <Compass size={64} />
        </div>
        <h1 className="text-2xl font-serif mb-2">{error || "Adventure Not Found"}</h1>
        <p className="text-foreground/50 mb-8 max-w-sm">We couldn&apos;t find this trip. It might have been deleted or moved.</p>
        <button onClick={() => router.push('/profile')} className="px-8 py-3 bg-terracotta text-white rounded-full font-medium">Back to Profile</button>
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
                <span className="text-sm font-medium text-foreground/80">
                  {itinerary.estimatedBudget?.total || itinerary.budget || 0} {itinerary.estimatedBudget?.currency || 'USD'} Budget
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-white/5 backdrop-blur-md">
                <Calendar size={16} className="text-terracotta" />
                <span className="text-sm font-medium text-foreground/80">{itinerary.days?.length || 0} Days</span>
              </div>
              <button
                onClick={() => window.print()}
                className="no-print flex items-center gap-2 px-4 py-2 rounded-full border border-terracotta/30 bg-terracotta/10 text-terracotta hover:bg-terracotta/20 transition-all text-sm font-medium"
              >
                <Download size={15} /> Download PDF
              </button>
              {isNomad && (
                <div className="no-print flex items-center gap-2">
                  <button
                    onClick={handleTogglePublic}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${isPublic ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'border-glass-border bg-white/5 text-foreground/60 hover:bg-white/10'}`}
                  >
                    <Share2 size={15} /> {isPublic ? 'Public' : 'Share'}
                  </button>
                  {isPublic && (
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-white/5 text-foreground/60 hover:bg-white/10 text-sm font-medium transition-all"
                    >
                      {copied ? <><CheckIcon size={15} className="text-green-400" /> Copied!</> : <><Copy size={15} /> Copy Link</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex absolute top-10 right-10 w-48 h-48 bg-glass-bg border border-glass-border/50 rounded-full items-center justify-center p-8 backdrop-blur-lg shadow-2xl">
            <div className="text-center">
               <Compass size={48} className="text-terracotta mx-auto mb-2 drop-shadow-[0_0_15px_rgba(215,92,61,0.5)]" />
               <span className="text-xs font-semibold uppercase tracking-widest text-foreground/60">Saved Voya AI Plan</span>
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
              {(itinerary.days || []).map((d: Day) => {
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
              {(itinerary.days || []).filter((d: Day) => d.day === activeDay).map((day: Day) => {
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
                      {(day.activities || []).map((act: Activity, index: number) => {
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

                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 ${isFoodLocked ? 'blur-sm' : ''}`}>
                              <h4 className="font-medium text-foreground">{act.title}</h4>
                              <div className="flex gap-3 text-xs font-medium text-foreground/60">
                                <span className="flex items-center gap-1"><ClockIcon size={14}/> {act.time}</span>
                                {act.estimatedCost > 0 && <span className="flex items-center gap-1 text-green-400/80 text-[11px]">~${act.estimatedCost}</span>}
                              </div>
                            </div>
                            <p className={`text-sm text-foreground/70 mb-4 ${isFoodLocked ? 'blur-sm' : ''}`}>{act.description}</p>
                            
                            <div className={`flex flex-wrap items-center justify-between gap-3 ${isFoodLocked ? 'blur-sm' : ''}`}>
                                <span className="inline-flex items-center gap-1 text-xs text-foreground/50 border border-glass-border/40 rounded-full px-2 py-1 bg-white/5">
                                    <MapPin size={12}/> {act.location}
                                </span>
                                {act.type !== 'food' && (
                                  act.bookable ? (
                                    <a
                                      href={`https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(act.title + ' ' + act.location)}&marker=715711`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-terracotta text-white px-3 py-1.5 rounded-full hover:bg-terracotta/90 transition-all"
                                    >
                                      <Compass size={11} /> Book on Klook
                                    </a>
                                  ) : (
                                    <a
                                      href={`https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(act.title + ' ' + act.location)}&marker=715711`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] font-bold text-terracotta hover:text-terracotta/80 flex items-center gap-1 transition-all"
                                    >
                                      <Compass size={12} /> Find Tickets & Tours
                                    </a>
                                  )
                                )}
                            </div>
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

            {/* SIM CARD TIP */}
            {itinerary.simCard?.tip && (
              <div className="glass-card p-5 rounded-3xl border border-glass-border bg-blue-500/5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Globe className="text-blue-400" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">SIM Card Tip</p>
                    <p className="text-xs text-foreground/70 leading-relaxed">{itinerary.simCard.tip}</p>
                    <a
                      href="https://www.airalo.com/?marker=715711"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-all uppercase tracking-widest"
                    >
                      Or get an eSIM via Airalo →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* MAP */}
            <div className="glass-card rounded-3xl border border-glass-border overflow-hidden">
              <div className="px-5 pt-5 pb-3 flex items-center gap-2">
                <Globe className="text-terracotta" size={18} />
                <h3 className="font-serif text-lg text-foreground">Destination Map</h3>
              </div>
              <iframe
                title="Destination Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent((itinerary.selectedCity || '') + ' ' + (itinerary.selectedCountry || ''))}&z=13&output=embed`}
                className="w-full h-52 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="px-5 py-3">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent((itinerary.selectedCity || '') + ' ' + (itinerary.selectedCountry || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-foreground/40 hover:text-terracotta transition-all uppercase tracking-widest"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

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
                      href={`https://www.klook.com/en-US/hotels/search/result/?search_text=${encodeURIComponent(hotel.name + ' ' + hotel.location)}&marker=715711`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white/5 border border-glass-border rounded-2xl hover:border-terracotta/40 hover:bg-white/10 transition-all cursor-pointer group"
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
                        Book on Klook →
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
                    const rp = realPrices[idx];
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
                      className="block p-3 border border-glass-border/40 rounded-xl bg-white/5 hover:border-terracotta/40 hover:bg-white/10 transition-all cursor-pointer group space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2 group-hover:text-terracotta transition-colors">
                            {flight.departure} <Plane size={14} className="text-foreground/40 rotate-90"/> {flight.arrival}
                          </div>
                          <div className="text-xs text-foreground/50 font-medium mt-0.5">
                            {rp?.airline || flight.airline} • {flight.date}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          {rp?.loading ? (
                            <span className="text-xs text-foreground/30 animate-pulse">Loading...</span>
                          ) : rp?.price ? (
                            <div>
                              <span className="text-[9px] text-green-400/70 uppercase tracking-widest block">Live Price</span>
                              <span className="font-bold text-sm text-green-400">${rp.price}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-foreground/40">—</span>
                          )}
                        </div>
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
                {itinerary.flights && itinerary.flights.length > 0 && (
                   <div className="pt-2">
                     <a 
                       href={`https://www.aviasales.com?marker=715711`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-[10px] text-foreground/40 hover:text-terracotta transition-all block text-center underline"
                     >
                       Looking for more options? Check all flights
                     </a>
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
            {/* TRAVEL ESSENTIALS & MONETIZATION */}
            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-3xl font-serif text-foreground">Travel Essentials</h2>
                    <p className="text-xs font-bold text-terracotta uppercase tracking-[0.4em]">Integrated Partners</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Airalo eSIM */}
                    <div className="glass-card p-8 lg:p-10 rounded-[40px] border border-glass-border relative overflow-hidden group h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <Globe className="text-terracotta" size={24} />
                                </div>
                                <h3 className="text-xl font-medium uppercase tracking-widest text-foreground/80 font-serif leading-tight">Global eSIM</h3>
                            </div>
                            <p className="text-foreground/50 leading-relaxed text-sm italic flex-1">
                                &quot;Skip the physical SIM and avoid roaming fees. Stay connected from minute one.&quot;
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-glass-border/30">
                                <div>
                                    <span className="text-[10px] font-bold text-foreground/40 block mb-1 uppercase tracking-widest leading-none">Recommended</span>
                                    <span className="text-[11px] font-bold text-foreground">Airalo</span>
                                </div>
                                <a 
                                    href={`https://www.airalo.com/?marker=715711`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto h-11 px-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-terracotta hover:text-white transition-all flex items-center justify-center uppercase tracking-widest"
                                >
                                    Get eSIM
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Private Transfer */}
                    <div className="glass-card p-8 lg:p-10 rounded-[40px] border border-glass-border relative overflow-hidden group h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <Car className="text-yellow-500" size={24} />
                                </div>
                                <h3 className="text-xl font-medium uppercase tracking-widest text-foreground/80 font-serif leading-tight">Airport Transfer</h3>
                            </div>
                            <p className="text-foreground/50 leading-relaxed text-sm italic flex-1">
                                &quot;Travel in comfort. Book a reliable private transfer from the airport to your hotel.&quot;
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-glass-border/30">
                                <div>
                                    <span className="text-[10px] font-bold text-foreground/40 block mb-1 uppercase tracking-widest leading-none">Best Rated</span>
                                    <span className="text-[11px] font-bold text-foreground">Klook Transfer</span>
                                </div>
                                <a 
                                    href={`https://www.klook.com/en-US/transport/airport-transfers/?marker=715711`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto h-11 px-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-yellow-600 hover:text-white transition-all flex items-center justify-center uppercase tracking-widest"
                                >
                                    Book Car
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Travel Insurance */}
                    <div className="glass-card p-8 lg:p-10 rounded-[40px] border border-glass-border relative overflow-hidden group h-full flex flex-col">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                         <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <Shield className="text-blue-400" size={24} />
                                </div>
                                <h3 className="text-xl font-medium uppercase tracking-widest text-foreground/80 font-serif leading-tight">Safe Journey</h3>
                            </div>
                            <p className="text-foreground/50 leading-relaxed text-sm italic flex-1">
                                &quot;Global coverage for your journey. Medical and trip protection for explorers.&quot;
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-glass-border/30">
                                <div>
                                    <span className="text-[10px] font-bold text-foreground/40 block mb-1 uppercase tracking-widest leading-none">Global Coverage</span>
                                    <span className="text-[11px] font-bold text-foreground">Verification Support</span>
                                </div>
                                <a 
                                    href={`https://www.visitorscoverage.com/?marker=715711`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto h-11 px-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center uppercase tracking-widest"
                                >
                                    Get Covered
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>
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
