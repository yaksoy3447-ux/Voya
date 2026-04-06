"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Users, Wallet, ArrowRight, Sparkles, Globe, PlaneTakeoff, Bed, HeartPulse, Check } from "lucide-react"
import { repairJson } from '@/lib/utils/jsonRepair'
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Country }  from 'country-state-city'
import { useRouter } from 'next/navigation'
import { usePlanStore } from '@/store/usePlanStore'

interface CountryObj {
  name: string;
  isoCode: string;
  flag: string;
}

const vibeOptions = [
  { id: "beach", label: "Beach Escape", icon: <Bed className="text-terracotta" size={18} /> },
  { id: "city", label: "Urban Jungle", icon: <Globe className="text-terracotta" size={18} /> },
  { id: "nature", label: "Nature Retreat", icon: <MapPin className="text-terracotta" size={18} /> },
  { id: "culture", label: "Heritage Tour", icon: <Sparkles className="text-terracotta" size={18} /> }
];

export function HeroForm() {
  const [activeTab, setActiveTab] = useState<'planner' | 'hotels'>('planner');
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const TOTAL_STEPS = 4;
  const router = useRouter();
  const { setItinerary } = usePlanStore();

  // --- Step 1 States ---
  const [depCountryQuery, setDepCountryQuery] = useState("");
  const [showDepCountryDropdown, setShowDepCountryDropdown] = useState(false);
  const [selectedDepCountryObj, setSelectedDepCountryObj] = useState<CountryObj | null>(null);
  const [depCityQuery, setDepCityQuery] = useState("");
  const [showDepCityDropdown, setShowDepCityDropdown] = useState(false);
  const [selectedDepCityObj, setSelectedDepCityObj] = useState<{ name: string } | null>(null);
  const [destCountryQuery, setDestCountryQuery] = useState("");
  const [showDestCountryDropdown, setShowDestCountryDropdown] = useState(false);
  const [selectedDestCountryObj, setSelectedDestCountryObj] = useState<CountryObj | null>(null);
  const [destCityQuery, setDestCityQuery] = useState("");
  const [showDestCityDropdown, setShowDestCityDropdown] = useState(false);
  const [selectedDestCityObj, setSelectedDestCityObj] = useState<{ name: string } | null>(null);
  const [isFlexible, setIsFlexible] = useState(false);

  // --- Step 2-4 States ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState("balanced");
  const [vibe, setVibe] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Creating Your Itinerary");

  // --- Hotels Tab States ---
  const [hotelCityQuery, setHotelCityQuery] = useState("");
  const [showHotelCityDropdown, setShowHotelCityDropdown] = useState(false);
  const [selectedHotelCity, setSelectedHotelCity] = useState<{ name: string } | null>(null);
  const [hotelCityPredictions, setHotelCityPredictions] = useState<any[]>([]);

  const COUNTRIES = useMemo(() => Country.getAllCountries(), []);
  const filteredDepCountries = useMemo(() => COUNTRIES.filter(c => c.name.toLowerCase().includes(depCountryQuery.toLowerCase())).slice(0, 20), [depCountryQuery, COUNTRIES]);
  const filteredDestCountries = useMemo(() => COUNTRIES.filter(c => c.name.toLowerCase().includes(destCountryQuery.toLowerCase())).slice(0, 20), [destCountryQuery, COUNTRIES]);

  const [depCityPredictions, setDepCityPredictions] = useState<any[]>([]);
  const [destCityPredictions, setDestCityPredictions] = useState<any[]>([]);
  const [depCityHighlight, setDepCityHighlight] = useState(-1);
  const [destCityHighlight, setDestCityHighlight] = useState(-1);

  // Effects for Autocomplete
  useEffect(() => {
    if (!depCityQuery || depCityQuery.length < 2 || selectedDepCityObj) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/places?q=${encodeURIComponent(depCityQuery)}&country=${selectedDepCountryObj?.isoCode || ''}`);
      const data = await res.json();
      setDepCityPredictions(data.predictions || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [depCityQuery, selectedDepCountryObj, selectedDepCityObj]);

  useEffect(() => {
    if (!destCityQuery || destCityQuery.length < 2 || selectedDestCityObj) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/places?q=${encodeURIComponent(destCityQuery)}&country=${selectedDestCountryObj?.isoCode || ''}`);
      const data = await res.json();
      setDestCityPredictions(data.predictions || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [destCityQuery, selectedDestCountryObj, selectedDestCityObj]);

  useEffect(() => {
    if (!hotelCityQuery || hotelCityQuery.length < 2 || selectedHotelCity) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/places?q=${encodeURIComponent(hotelCityQuery)}`);
      const data = await res.json();
      setHotelCityPredictions(data.predictions || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [hotelCityQuery, selectedHotelCity]);

  const handleHotelSearch = () => {
    if (selectedHotelCity) {
      const url = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(selectedHotelCity.name)}&affcid=ZOorfcw`;
      window.open(url, '_blank');
    }
  };

  const getStepValidation = () => {
    if (step === 1) return selectedDepCityObj && (isFlexible || selectedDestCityObj);
    if (step === 2) return startDate && endDate;
    if (step === 3) return !!budget;
    if (step === 4) return interests.length > 0 && (!isFlexible || vibe);
    return false;
  };

  const handleNext = async () => {
    if (step === TOTAL_STEPS) {
      setStep(5); // Loading
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            depCity: selectedDepCityObj?.name,
            destCity: isFlexible ? "Flexible" : selectedDestCityObj?.name,
            isFlexible, vibe, startDate, endDate, adults, children, budget, accommodation, interests, pace
          })
        });
        if (res.status === 403) {
          router.push('/pricing?reason=limit');
          return;
        }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
          }
        } else {
          fullText = await res.text();
        }
        const cleaned = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
        const planData = JSON.parse(repairJson(cleaned));
        setItinerary(planData);
        router.push('/plan');
      } catch (e: any) { alert("Error: " + (e?.message || String(e))); setStep(TOTAL_STEPS); }
    } else {
      setStep(step + 1);
    }
  };

  const variants = {
    initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex p-1.5 glass-card rounded-full border border-glass-border/40">
        {[
          { id: 'planner', label: 'AI Itinerary', icon: <Sparkles size={16} /> },
          { id: 'hotels', label: 'Search Hotels', icon: <Bed size={16} /> },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-terracotta text-white shadow-lg' : 'text-foreground/40 hover:text-foreground/60'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card w-full p-6 md:p-10 rounded-3xl border border-glass-border relative overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === 'planner' ? (
            <motion.div key="planner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col">
              {step < 5 ? (
                <>
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif text-foreground/90 flex items-center gap-2">
                        <PlaneTakeoff className="text-terracotta" /> Where are you going?
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <Input icon={<Globe size={18}/>} placeholder="Departure City" value={depCityQuery}
                             onChange={(e) => {setDepCityQuery(e.target.value); setSelectedDepCityObj(null); setShowDepCityDropdown(true); setDepCityHighlight(-1)}}
                             onKeyDown={(e) => {
                               if (!showDepCityDropdown || depCityPredictions.length === 0) return;
                               if (e.key === 'ArrowDown') { e.preventDefault(); setDepCityHighlight(i => Math.min(i + 1, depCityPredictions.length - 1)); }
                               else if (e.key === 'ArrowUp') { e.preventDefault(); setDepCityHighlight(i => Math.max(i - 1, 0)); }
                               else if (e.key === 'Enter' && depCityHighlight >= 0) { e.preventDefault(); const p = depCityPredictions[depCityHighlight]; setSelectedDepCityObj({name: p.structured_formatting.main_text}); setDepCityQuery(p.structured_formatting.main_text); setShowDepCityDropdown(false); }
                               else if (e.key === 'Escape') setShowDepCityDropdown(false);
                             }}
                           />
                           {showDepCityDropdown && depCityPredictions.length > 0 && !selectedDepCityObj && (
                             <div className="glass-card absolute z-50 w-full md:w-[45%] mt-1 max-h-40 overflow-y-auto rounded-xl border border-glass-border">
                               {depCityPredictions.map((p, idx) => (
                                 <button key={p.place_id} onClick={() => {setSelectedDepCityObj({name: p.structured_formatting.main_text}); setDepCityQuery(p.structured_formatting.main_text); setShowDepCityDropdown(false)}} className={`w-full text-left p-3 border-b border-white/5 last:border-0 text-sm transition-colors ${depCityHighlight === idx ? 'bg-terracotta/20' : 'hover:bg-white/5'}`}>
                                   {p.description}
                                 </button>
                               ))}
                             </div>
                           )}
                        </div>
                        <div className="space-y-4">
                           <Input icon={<MapPin size={18}/>} placeholder="Destination City" value={destCityQuery}
                             onChange={(e) => {setDestCityQuery(e.target.value); setSelectedDestCityObj(null); setShowDestCityDropdown(true); setDestCityHighlight(-1)}}
                             onKeyDown={(e) => {
                               if (!showDestCityDropdown || destCityPredictions.length === 0) return;
                               if (e.key === 'ArrowDown') { e.preventDefault(); setDestCityHighlight(i => Math.min(i + 1, destCityPredictions.length - 1)); }
                               else if (e.key === 'ArrowUp') { e.preventDefault(); setDestCityHighlight(i => Math.max(i - 1, 0)); }
                               else if (e.key === 'Enter' && destCityHighlight >= 0) { e.preventDefault(); const p = destCityPredictions[destCityHighlight]; setSelectedDestCityObj({name: p.structured_formatting.main_text}); setDestCityQuery(p.structured_formatting.main_text); setShowDestCityDropdown(false); }
                               else if (e.key === 'Escape') setShowDestCityDropdown(false);
                             }}
                             disabled={isFlexible} className={isFlexible ? 'opacity-30' : ''}
                           />
                           {showDestCityDropdown && destCityPredictions.length > 0 && !selectedDestCityObj && (
                             <div className="glass-card absolute z-50 right-0 w-full md:w-[45%] mt-1 max-h-40 overflow-y-auto rounded-xl border border-glass-border">
                               {destCityPredictions.map((p, idx) => (
                                 <button key={p.place_id} onClick={() => {setSelectedDestCityObj({name: p.structured_formatting.main_text}); setDestCityQuery(p.structured_formatting.main_text); setShowDestCityDropdown(false)}} className={`w-full text-left p-3 border-b border-white/5 last:border-0 text-sm transition-colors ${destCityHighlight === idx ? 'bg-terracotta/20' : 'hover:bg-white/5'}`}>
                                   {p.description}
                                 </button>
                               ))}
                             </div>
                           )}
                           <button onClick={() => setIsFlexible(!isFlexible)} className={`text-[10px] font-bold uppercase p-2 rounded-lg border ${isFlexible ? 'bg-terracotta border-terracotta' : 'border-glass-border text-foreground/40'}`}>
                             {isFlexible ? 'Flexible Mode Active' : 'I am Flexible'}
                           </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-serif text-foreground/90 flex items-center gap-2"><Calendar className="text-terracotta"/> Dates</h2>
                       <div className="flex gap-4">
                          <input type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate(''); }} className="flex-1 bg-glass-bg/40 border border-glass-border rounded-xl p-4 text-sm outline-none focus:border-terracotta/50" />
                          <input type="date" value={endDate} min={startDate || new Date().toISOString().split('T')[0]} onChange={(e) => setEndDate(e.target.value)} className="flex-1 bg-glass-bg/40 border border-glass-border rounded-xl p-4 text-sm outline-none focus:border-terracotta/50" />
                       </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-serif text-foreground/90 flex items-center gap-2"><Wallet className="text-terracotta"/> Daily Budget</h2>
                       <div className="grid grid-cols-3 gap-3">
                         {[
                           { value: 'budget', label: 'Budget', range: 'Under $75/day', desc: 'Budget hotels & hostels, street food, public transport' },
                           { value: 'mid', label: 'Mid', range: '$75–200/day', desc: '3–4★ hotels, restaurants, some tours' },
                           { value: 'luxury', label: 'Luxury', range: '$200+/day', desc: '5★ hotels, fine dining, private tours' },
                         ].map(b => (
                           <button key={b.value} onClick={() => setBudget(b.value)} className={`p-4 rounded-xl border-2 transition-all text-left ${budget === b.value ? 'border-terracotta bg-terracotta/10' : 'border-glass-border hover:border-terracotta/30'}`}>
                             <span className="block text-base font-bold mb-1">{b.label}</span>
                             <span className="block text-sm text-terracotta font-semibold mb-1">{b.range}</span>
                             <span className="block text-xs text-foreground/50 leading-tight">{b.desc}</span>
                           </button>
                         ))}
                       </div>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-6 text-left">
                       <h2 className="text-2xl font-serif text-foreground/90 flex items-center gap-2"><HeartPulse className="text-terracotta"/> Interests</h2>
                       <div className="flex flex-wrap gap-2">
                         {["History", "Food", "Nature", "Art", "Shopping", "Swimming", "Nightlife", "Adventure", "Wellness"].map(i => (
                           <button key={i} onClick={() => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])} className={`px-4 py-2 rounded-full border text-sm transition-all ${interests.includes(i) ? 'bg-terracotta border-terracotta text-white' : 'border-glass-border hover:bg-white/5'}`}>
                             {i}
                           </button>
                         ))}
                       </div>

                       {isFlexible && (
                         <div className="pt-4">
                           <h2 className="text-2xl font-serif text-foreground/90 flex items-center gap-2 mb-4"><Sparkles className="text-terracotta"/> Trip Vibe</h2>
                           <div className="grid grid-cols-2 gap-3">
                             {vibeOptions.map(v => (
                               <button key={v.id} onClick={() => setVibe(v.id)} className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${vibe === v.id ? 'border-terracotta bg-terracotta/10' : 'border-glass-border hover:border-terracotta/30'}`}>
                                 <div className="p-2 rounded-full bg-white/5 flex shrink-0 items-center justify-center">
                                   {v.icon}
                                 </div>
                                 <span className="font-medium text-sm">{v.label}</span>
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
                    </div>
                  )}
                  <div className="pt-8 flex items-center justify-between border-t border-glass-border/40 mt-auto">
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? 'bg-terracotta w-6' : 'bg-glass-border w-2'}`} />)}
                    </div>
                    <div className="flex gap-2">
                      {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
                      <Button onClick={handleNext} disabled={!getStepValidation()}>{step === 4 ? 'Launch Journey' : 'Next'} <ArrowRight className="ml-2 w-4 h-4"/></Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                   <div className="w-16 h-16 border-t-2 border-terracotta rounded-full animate-spin" />
                   <h2 className="text-2xl font-serif">{loadingMessage}</h2>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="hotels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif text-foreground/90">Find Your Perfect Stay</h2>
                <p className="text-foreground/50 text-sm">Search hotels worldwide via Expedia</p>
              </div>
              
              <div className="relative group">
                <Input icon={<Bed className="text-terracotta" size={20} />} placeholder="Where would you like to stay?" value={hotelCityQuery} onChange={(e) => {setHotelCityQuery(e.target.value); setSelectedHotelCity(null); setShowHotelCityDropdown(true)}} className="h-16 text-lg bg-white/5 border-glass-border focus:border-terracotta/50 transition-all"/>
                {showHotelCityDropdown && hotelCityPredictions.length > 0 && !selectedHotelCity && (
                  <div className="absolute z-60 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-glass-border shadow-2xl max-h-60 overflow-y-auto">
                    {hotelCityPredictions.map(p => (
                      <button key={p.place_id} onClick={() => {setSelectedHotelCity({name: p.structured_formatting.main_text}); setHotelCityQuery(p.structured_formatting.main_text); setShowHotelCityDropdown(false)}} className="w-full text-left px-5 py-4 hover:bg-terracotta/10 border-b border-glass-border/30 last:border-0 transition-colors">
                        <div className="font-medium">{p.structured_formatting.main_text}</div>
                        <div className="text-xs text-foreground/40">{p.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                 {[
                   { label: "Best Price Guarantee", icon: <Check className="text-emerald-400" size={14}/> },
                   { label: "Free Cancellation", icon: <Check className="text-emerald-400" size={14}/> },
                   { label: "24/7 Support", icon: <Check className="text-emerald-400" size={14}/> }
                 ].map((feat, idx) => (
                   <div key={idx} className="flex items-center gap-2 text-xs text-foreground/60 font-medium">
                     <span className="p-1 rounded-full bg-emerald-400/10">{feat.icon}</span>
                     {feat.label}
                   </div>
                 ))}
              </div>

              <div className="mt-auto pt-8">
                <Button onClick={handleHotelSearch} disabled={!selectedHotelCity} className="w-full h-14 text-lg font-bold shadow-xl shadow-terracotta/20 hover:scale-[1.02] active:scale-[0.98]">
                  Search Deals on Expedia <ArrowRight className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
