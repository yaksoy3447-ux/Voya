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

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
  };
}

const vibeOptions = [
  { id: "beach", label: "Beach Escape", icon: <Bed className="text-terracotta" size={18} /> },
  { id: "city", label: "Urban Jungle", icon: <Globe className="text-terracotta" size={18} /> },
  { id: "nature", label: "Nature Retreat", icon: <MapPin className="text-terracotta" size={18} /> },
  { id: "culture", label: "Heritage Tour", icon: <Sparkles className="text-terracotta" size={18} /> }
];

export function HeroForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const TOTAL_STEPS = 4;
  const router = useRouter();
  const { setItinerary } = usePlanStore();

  // --- Step 1: Where from, Where to? ---
  
  // Departure State
  const [depCountryQuery, setDepCountryQuery] = useState("");
  const [showDepCountryDropdown, setShowDepCountryDropdown] = useState(false);
  const [selectedDepCountryObj, setSelectedDepCountryObj] = useState<CountryObj | null>(null);

  const [depCityQuery, setDepCityQuery] = useState("");
  const [showDepCityDropdown, setShowDepCityDropdown] = useState(false);
  const [selectedDepCityObj, setSelectedDepCityObj] = useState<{ name: string } | null>(null);

  // Destination State
  const [destCountryQuery, setDestCountryQuery] = useState("");
  const [showDestCountryDropdown, setShowDestCountryDropdown] = useState(false);
  const [selectedDestCountryObj, setSelectedDestCountryObj] = useState<CountryObj | null>(null);

  const [destCityQuery, setDestCityQuery] = useState("");
  const [showDestCityDropdown, setShowDestCityDropdown] = useState(false);
  const [selectedDestCityObj, setSelectedDestCityObj] = useState<{ name: string } | null>(null);

  // --- Step 2: Dates & Companions ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // --- Step 3: Budget & Accommodation ---
  const [budget, setBudget] = useState("");
  const [accommodation, setAccommodation] = useState("");

  // --- Step 4: Interests & Pace ---
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState("balanced")
  const [loadingMessage, setLoadingMessage] = useState("Creating Your Itinerary")
  const [vibe, setVibe] = useState("");
  const [isFlexible, setIsFlexible] = useState(false);

  useEffect(() => {
    let interval: any;
    if (step === 5) {
      const messages = [
        "Adventure begins, processing your data...",
        "Scanning for the most comfortable hotels and flights...",
        isFlexible 
          ? "Finding the perfect hidden gem for you..." 
          : `Mapping out the best routes for ${selectedDestCityObj?.name}...`,
        "This may take a moment due to location density, crafting a wonderful route...",
        "Adding insider tips and local recommendations...",
        "Almost there, adding the final touches..."
      ];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [step, isFlexible, selectedDestCityObj]);

  // Keyboard Navigation State
  const [depCountryIndex, setDepCountryIndex] = useState(-1);
  const [depCityIndex, setDepCityIndex] = useState(-1);
  const [destCountryIndex, setDestCountryIndex] = useState(-1);
  const [destCityIndex, setDestCityIndex] = useState(-1);

  // Memoized Global Data
  const COUNTRIES = useMemo(() => Country.getAllCountries(), []);
  
  // Departure Filters
  const filteredDepCountries = useMemo(() => {
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(depCountryQuery.toLowerCase())).slice(0, 30);
  }, [depCountryQuery, COUNTRIES]);

  const [depCityPredictions, setDepCityPredictions] = useState<any[]>([]);
  
  useEffect(() => {
    if (!depCityQuery || depCityQuery.length < 2 || selectedDepCityObj) {
      if (!selectedDepCityObj) setDepCityPredictions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const countryCode = selectedDepCountryObj?.isoCode || '';
        const res = await fetch(`/api/places?q=${encodeURIComponent(depCityQuery)}&country=${countryCode}`);
        const data = await res.json();
        // Google v1 API can return predictions or suggestions
        const results = data.predictions || data.suggestions || [];
        setDepCityPredictions(results);
        if (results.length > 0) setShowDepCityDropdown(true);
      } catch (e) { console.error('Places API error:', e); }
    }, 300);
    return () => clearInterval(timer);
  }, [depCityQuery, selectedDepCountryObj, selectedDepCityObj]);

  // Destination Filters
  const filteredDestCountries = useMemo(() => {
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(destCountryQuery.toLowerCase())).slice(0, 30);
  }, [destCountryQuery, COUNTRIES]);

  const [destCityPredictions, setDestCityPredictions] = useState<any[]>([]);
  
  useEffect(() => {
    if (!destCityQuery || destCityQuery.length < 2 || selectedDestCityObj) {
      if (!selectedDestCityObj) setDestCityPredictions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const countryCode = selectedDestCountryObj?.isoCode || '';
        const res = await fetch(`/api/places?q=${encodeURIComponent(destCityQuery)}&country=${countryCode}`);
        const data = await res.json();
        const results = data.predictions || data.suggestions || [];
        setDestCityPredictions(results);
        if (results.length > 0) setShowDestCityDropdown(true);
      } catch (e) { console.error('Places API error:', e); }
    }, 300);
    return () => clearInterval(timer);
  }, [destCityQuery, selectedDestCountryObj, selectedDestCityObj]);

  const getStepValidation = () => {
    if (step === 1) {
      const depValid = selectedDepCountryObj && selectedDepCityObj;
      const destValid = isFlexible || (selectedDestCountryObj && selectedDestCityObj);
      return depValid && destValid;
    }
    if (step === 2) return startDate && endDate && (adults > 0);
    if (step === 3) return budget && accommodation;
    if (step === 4) return interests.length > 0 && pace && (!isFlexible || vibe);
    return false;
  }

  const handleNext = async () => {
    if (getStepValidation()) {
      if (step === TOTAL_STEPS) {
        // Trigger Generation
        setDirection(1);
        setStep(5); // Show loading UI
        
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              depCountry: selectedDepCountryObj?.name,
              depCity: selectedDepCityObj?.name,
              destCountry: isFlexible ? "Flexible" : selectedDestCountryObj?.name,
              destCity: isFlexible ? "Flexible" : selectedDestCityObj?.name,
              isFlexible,
              vibe,
              startDate,
              endDate,
              adults,
              children,
              budget,
              accommodation,
              interests,
              pace
            })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            if (errData.error === "LIMIT_REACHED") {
              alert("You've reached your free plan limit. Please upgrade to continue.");
              setStep(TOTAL_STEPS);
              return;
            }
            throw new Error(errData.error || "Failed to generate plan");
          }

          // Stream okuma
          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let fullText = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
          }

          const cleaned = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
          const repaired = repairJson(cleaned);
          const planData = JSON.parse(repaired);
          
          setItinerary(planData);
          router.push('/plan');

        } catch (error: any) {
          console.error("Generation error:", error);
          const message = error instanceof Error ? error.message : "We hit a bump in the road planning your trip. Please try again.";
          alert(message);
          setStep(TOTAL_STEPS);
        }
      } else {
        setDirection(1);
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      if (interests.length < 3) setInterests([...interests, interest]);
    }
  };

  const variants = {
    initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
  };

  return (
    <div className="glass-card max-w-4xl w-full p-6 md:p-10 rounded-3xl border border-glass-border relative overflow-hidden mt-8 mx-auto shadow-2xl text-left min-h-[440px] flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-sand/30 to-transparent" />
      
      <div className="w-full relative flex-1">
        <AnimatePresence mode="popLayout" custom={direction}>
          
          {/* STEP 1: DEPARTURE & DESTINATION */}
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-foreground/90 flex items-center gap-2 mb-6">
                <PlaneTakeoff className="text-terracotta" /> From & To
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* DEPARTURE COLUMN */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground/80 border-b border-glass-border pb-2">Departure</h3>
                  
                  {/* Dep Country */}
                  <div>
                    <label className="block text-sm text-foreground/60 mb-2 ml-1">Country</label>
                    <div className="relative">
                      <Input icon={<Globe size={18} />} placeholder="Where are you from?" autoFocus
                        value={depCountryQuery}
                        onChange={(e) => { 
                          setDepCountryQuery(e.target.value); 
                          setShowDepCountryDropdown(true); 
                          setSelectedDepCountryObj(null); 
                          setSelectedDepCityObj(null); 
                          setDepCityQuery(""); 
                          setDepCountryIndex(-1);
                        }}
                        onFocus={() => { setShowDepCountryDropdown(true); setDepCountryIndex(-1); }}
                        onBlur={() => setTimeout(() => { setShowDepCountryDropdown(false); setDepCountryIndex(-1); }, 200)}
                        onKeyDown={(e) => {
                          if (showDepCountryDropdown && filteredDepCountries.length > 0) {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setDepCountryIndex(prev => Math.min(prev + 1, filteredDepCountries.length - 1));
                            } else if (e.key === "ArrowUp") {
                              e.preventDefault();
                              setDepCountryIndex(prev => Math.max(prev - 1, 0));
                            } else if (e.key === "Enter" && depCountryIndex >= 0) {
                              e.preventDefault();
                              const country = filteredDepCountries[depCountryIndex];
                              setSelectedDepCountryObj({ name: country.name, isoCode: country.isoCode, flag: country.flag });
                              setDepCountryQuery(country.name);
                              setShowDepCountryDropdown(false);
                            }
                          }
                        }}
                      />
                      <AnimatePresence>
                        {showDepCountryDropdown && filteredDepCountries.length > 0 && !selectedDepCountryObj && depCountryQuery && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="absolute z-50 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-glass-border shadow-2xl max-h-48 overflow-y-auto">
                            {filteredDepCountries.map((country, idx) => (
                              <button key={country.isoCode} 
                                onClick={() => { setSelectedDepCountryObj({ name: country.name, isoCode: country.isoCode, flag: country.flag }); setDepCountryQuery(country.name); setShowDepCountryDropdown(false); }}
                                className={`w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground transition-colors border-b border-glass-border/30 last:border-0 ${depCountryIndex === idx ? 'bg-terracotta/20 text-foreground' : 'hover:bg-terracotta/10'}`}>
                                <span className="mr-2">{country.flag}</span>{country.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Dep City */}
                  <div>
                    <label className="block text-sm text-foreground/60 mb-2 ml-1">City</label>
                    <div className="relative">
                      <Input icon={<PlaneTakeoff size={18} />} placeholder="Select City" disabled={!selectedDepCountryObj}
                        value={depCityQuery}
                        onChange={(e) => { setDepCityQuery(e.target.value); setShowDepCityDropdown(true); setSelectedDepCityObj(null); setDepCityIndex(-1); }}
                        onFocus={() => { if (selectedDepCountryObj) { setShowDepCityDropdown(true); setDepCityIndex(-1); } }}
                        onBlur={() => setTimeout(() => { setShowDepCityDropdown(false); setDepCityIndex(-1); }, 200)}
                        onKeyDown={(e) => {
                          if (showDepCityDropdown && depCityPredictions.length > 0) {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setDepCityIndex(prev => Math.min(prev + 1, depCityPredictions.length - 1));
                            } else if (e.key === "ArrowUp") {
                              e.preventDefault();
                              setDepCityIndex(prev => Math.max(prev - 1, 0));
                            } else if (e.key === "Enter" && depCityIndex >= 0) {
                              e.preventDefault();
                              const city = depCityPredictions[depCityIndex];
                              setSelectedDepCityObj({ name: city.structured_formatting.main_text });
                              setDepCityQuery(city.structured_formatting.main_text);
                              setShowDepCityDropdown(false);
                            }
                          }
                        }}
                        className={!selectedDepCountryObj ? "opacity-50 cursor-not-allowed" : ""}
                      />
                      <AnimatePresence>
                        {showDepCityDropdown && depCityPredictions.length > 0 && !selectedDepCityObj && selectedDepCountryObj && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="absolute z-50 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-glass-border shadow-2xl max-h-48 overflow-y-auto">
                            {depCityPredictions.map((city, idx) => (
                              <button key={city.place_id} 
                                onClick={() => { setSelectedDepCityObj({ name: city.structured_formatting.main_text }); setDepCityQuery(city.structured_formatting.main_text); setShowDepCityDropdown(false); }}
                                className={`w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground transition-colors border-b border-glass-border/30 last:border-0 truncate ${depCityIndex === idx ? 'bg-terracotta/20 text-foreground' : 'hover:bg-terracotta/10'}`}>
                                {city.description}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* DESTINATION COLUMN */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between border-b border-glass-border pb-2">
                     <h3 className="text-lg font-medium text-foreground/80">Destination</h3>
                     <button 
                        onClick={() => { 
                          setIsFlexible(!isFlexible); 
                          if (!isFlexible) {
                            setSelectedDestCountryObj(null);
                            setSelectedDestCityObj(null);
                            setDestCountryQuery("");
                            setDestCityQuery("");
                          }
                        }}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${isFlexible ? 'bg-terracotta border-terracotta text-white' : 'border-glass-border text-foreground/40 hover:text-foreground/60'}`}
                     >
                       {isFlexible ? 'Flexible Mode Active' : "I don't know where to go"}
                     </button>
                   </div>
                   
                   {!isFlexible ? (
                     <>
                       {/* Dest Country */}
                       <div>
                        <label className="block text-sm text-foreground/60 mb-2 ml-1">Country</label>
                        <div className="relative">
                          <Input icon={<Globe size={18} />} placeholder="Where to?" 
                            value={destCountryQuery}
                            onChange={(e) => { 
                              setDestCountryQuery(e.target.value); 
                              setShowDestCountryDropdown(true); 
                              setSelectedDestCountryObj(null); 
                              setSelectedDestCityObj(null); 
                              setDestCityQuery(""); 
                              setDestCountryIndex(-1);
                            }}
                            onFocus={() => { setShowDestCountryDropdown(true); setDestCountryIndex(-1); }}
                            onBlur={() => setTimeout(() => { setShowDestCountryDropdown(false); setDestCountryIndex(-1); }, 200)}
                            onKeyDown={(e) => {
                              if (showDestCountryDropdown && filteredDestCountries.length > 0) {
                                if (e.key === "ArrowDown") {
                                  e.preventDefault();
                                  setDestCountryIndex(prev => Math.min(prev + 1, filteredDestCountries.length - 1));
                                } else if (e.key === "ArrowUp") {
                                  e.preventDefault();
                                  setDestCountryIndex(prev => Math.max(prev - 1, 0));
                                } else if (e.key === "Enter" && destCountryIndex >= 0) {
                                  e.preventDefault();
                                  const country = filteredDestCountries[destCountryIndex];
                                  setSelectedDestCountryObj({ name: country.name, isoCode: country.isoCode, flag: country.flag });
                                  setDestCountryQuery(country.name);
                                  setShowDestCountryDropdown(false);
                                }
                              }
                            }}
                          />
                          <AnimatePresence>
                            {showDestCountryDropdown && filteredDestCountries.length > 0 && !selectedDestCountryObj && destCountryQuery && (
                              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="absolute z-50 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-glass-border shadow-2xl max-h-48 overflow-y-auto">
                                {filteredDestCountries.map((country, idx) => (
                                  <button key={country.isoCode} 
                                    onClick={() => { setSelectedDestCountryObj({ name: country.name, isoCode: country.isoCode, flag: country.flag }); setDestCountryQuery(country.name); setShowDestCountryDropdown(false); }}
                                    className={`w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground transition-colors border-b border-glass-border/30 last:border-0 ${destCountryIndex === idx ? 'bg-terracotta/20 text-foreground' : 'hover:bg-terracotta/10'}`}>
                                    <span className="mr-2">{country.flag}</span>{country.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                       {/* Dest City */}
                       <div>
                        <label className="block text-sm text-foreground/60 mb-2 ml-1">City</label>
                        <div className="relative">
                          <Input icon={<MapPin size={18} />} placeholder="Select City" disabled={!selectedDestCountryObj}
                            value={destCityQuery}
                            onChange={(e) => { setDestCityQuery(e.target.value); setShowDestCityDropdown(true); setSelectedDestCityObj(null); setDestCityIndex(-1); }}
                            onFocus={() => { if (selectedDestCountryObj) { setShowDestCityDropdown(true); setDestCityIndex(-1); } }}
                            onBlur={() => setTimeout(() => { setShowDestCityDropdown(false); setDestCityIndex(-1); }, 200)}
                            onKeyDown={(e) => {
                              if (showDestCityDropdown && destCityPredictions.length > 0) {
                                if (e.key === "ArrowDown") {
                                  e.preventDefault();
                                  setDestCityIndex(prev => Math.min(prev + 1, destCityPredictions.length - 1));
                                } else if (e.key === "ArrowUp") {
                                  e.preventDefault();
                                  setDestCityIndex(prev => Math.max(prev - 1, 0));
                                } else if (e.key === "Enter" && destCityIndex >= 0) {
                                  e.preventDefault();
                                  const city = destCityPredictions[destCityIndex];
                                  setSelectedDestCityObj({ name: city.structured_formatting.main_text });
                                  setDestCityQuery(city.structured_formatting.main_text);
                                  setShowDestCityDropdown(false);
                                }
                              }
                            }}
                            className={!selectedDestCountryObj ? "opacity-50 cursor-not-allowed" : ""}
                          />
                          <AnimatePresence>
                            {showDestCityDropdown && destCityPredictions.length > 0 && !selectedDestCityObj && selectedDestCountryObj && (
                              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="absolute z-50 w-full mt-2 glass-card rounded-2xl overflow-hidden border border-glass-border shadow-2xl max-h-48 overflow-y-auto">
                                {destCityPredictions.map((city, idx) => (
                                  <button key={city.place_id} 
                                    onClick={() => { setSelectedDestCityObj({ name: city.structured_formatting.main_text }); setDestCityQuery(city.structured_formatting.main_text); setShowDestCityDropdown(false); }}
                                    className={`w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground transition-colors border-b border-glass-border/30 last:border-0 truncate ${destCityIndex === idx ? 'bg-terracotta/20 text-foreground' : 'hover:bg-terracotta/10'}`}>
                                    {city.description}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                     </>
                   ) : (
                     <div className="h-40 glass-card rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-terracotta/5 border-terracotta/20">
                        <Sparkles className="text-terracotta mb-3" size={32} />
                        <p className="text-sm font-serif italic text-foreground/80 leading-relaxed">
                          &quot;Tell us your vibe in the final step, and Rovago will find the perfect hidden gems for you.&quot;
                        </p>
                     </div>
                   )}
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 2: DATES & COMPANIONS */}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-foreground/90 flex items-center gap-2 mb-6">
                <Calendar className="text-terracotta" /> Dates & People
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dates */}
                <div className="space-y-4">
                  <label className="block text-sm text-foreground/60">When are you going?</label>
                  <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                        const target = e.target as HTMLInputElement & { showPicker?: () => void };
                        if (target.showPicker) target.showPicker();
                      }}
                      className="flex-1 h-14 rounded-2xl border border-glass-border bg-glass-bg/40 px-4 text-sm text-foreground focus:outline-none focus:border-terracotta/50 color-scheme-dark cursor-pointer font-medium"
                    />
                    <span className="text-foreground/40">-</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                      min={startDate || new Date().toISOString().split('T')[0]}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                        const target = e.target as HTMLInputElement & { showPicker?: () => void };
                        if (target.showPicker) target.showPicker();
                      }}
                      className="flex-1 h-14 rounded-2xl border border-glass-border bg-glass-bg/40 px-4 text-sm text-foreground focus:outline-none focus:border-terracotta/50 color-scheme-dark cursor-pointer font-medium"
                    />
                  </div>
                </div>

                {/* Companions */}
                <div className="space-y-4">
                   <label className="block text-sm text-foreground/60">Travel Companions</label>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center glass-card p-3 rounded-2xl">
                       <span className="text-sm font-medium">Adults</span>
                       <div className="flex items-center gap-4">
                         <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-white/5 transition-colors">-</button>
                         <span className="w-4 text-center">{adults}</span>
                         <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-white/5 transition-colors">+</button>
                       </div>
                     </div>
                     <div className="flex justify-between items-center glass-card p-3 rounded-2xl">
                       <span className="text-sm font-medium">Children</span>
                       <div className="flex items-center gap-4">
                         <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-white/5 transition-colors">-</button>
                         <span className="w-4 text-center">{children}</span>
                         <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-white/5 transition-colors">+</button>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: BUDGET & ACCOMMODATION */}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-foreground/90 flex items-center gap-2 mb-6">
                <Wallet className="text-terracotta" /> Budget & Stay
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-foreground/60 mb-3">Daily Budget per Person</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "budget", label: "Economy", desc: "$100 - $150 / day" },
                        { id: "mid", label: "Standard", desc: "$150 - $300 / day" },
                        { id: "luxury", label: "Luxury", desc: "$300+ / day" }
                      ].map((lvl) => (
                        <button key={lvl.id} type="button" onClick={() => setBudget(lvl.id)}
                          className={`glass-card py-4 flex flex-col items-center justify-center gap-1 rounded-xl transition-all relative border-2 ${budget === lvl.id ? 'border-terracotta bg-terracotta/20 ring-2 ring-terracotta/20' : 'border-glass-border hover:border-terracotta/40'}`}>
                          {budget === lvl.id && <div className="absolute top-2 right-2 text-terracotta transition-all"><Check size={14} strokeWidth={3} /></div>}
                          <span className="text-sm font-semibold">{lvl.label}</span>
                          <span className="text-xs opacity-60 font-medium">{lvl.desc}</span>
                        </button>
                      ))}
                    </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground/60 mb-3">Where would you like to stay?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "hotel", label: "Hotels & Resorts", icon: <Bed size={18}/> },
                      { id: "hostel", label: "Hostels & Rentals", icon: <Users size={18}/> }
                    ].map((acc) => (
                      <button key={acc.id} type="button" onClick={() => setAccommodation(acc.id)}
                        className={`glass-card p-4 flex items-center gap-3 rounded-xl transition-all relative border-2 ${accommodation === acc.id ? 'border-terracotta bg-terracotta/20 ring-2 ring-terracotta/20' : 'border-glass-border hover:border-terracotta/40'}`}>
                        {accommodation === acc.id && <div className="absolute top-2 right-2 text-terracotta transition-all"><Check size={14} strokeWidth={3} /></div>}
                        <div className={`p-2.5 rounded-full ${accommodation === acc.id ? 'bg-terracotta/30 text-white' : 'bg-white/5 opacity-60'}`}>{acc.icon}</div>
                        <span className="text-sm font-semibold">{acc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INTERESTS & PACE */}
          {step === 4 && (
            <motion.div key="step4" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-foreground/90 flex items-center gap-2 mb-6">
                <HeartPulse className="text-terracotta" /> Style & Pace
              </h2>
              
              <div className="space-y-6">
                {isFlexible && (
                  <div>
                    <label className="block text-sm text-foreground/60 mb-4 ml-1 italic">Because you&apos;re in Discover Mode, please select your preferred Vibe:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {vibeOptions.map((v) => (
                        <button key={v.id} type="button" onClick={() => setVibe(v.id)}
                          className={`glass-card p-4 flex flex-col items-center justify-center gap-2 rounded-xl transition-all relative border-2 ${vibe === v.id ? 'border-terracotta bg-terracotta/20 ring-2 ring-terracotta/20' : 'border-glass-border hover:border-terracotta/40'}`}>
                          {vibe === v.id && <div className="absolute top-2 right-2 text-terracotta transition-all"><Check size={14} strokeWidth={3} /></div>}
                          <div className={`p-2 rounded-full transition-colors ${vibe === v.id ? 'bg-terracotta/20 text-terracotta' : 'text-foreground/50'}`}>
                            {v.icon}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-center">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm text-foreground/60 mb-3 ml-1">Select up to 3 Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "interests_history", label: "History & Culture" },
                      { id: "interests_food", label: "Food & Gastronomy" },
                      { id: "interests_nature", label: "Nature & Outdoors" },
                      { id: "interests_nightlife", label: "Nightlife & Party" },
                      { id: "interests_art", label: "Art & Architecture" },
                      { id: "interests_shopping", label: "Shopping & Local Markets" },
                      { id: "interests_relax", label: "Relaxation & Spa" },
                    ].map((interestObj) => {
                      const isSelected = interests.includes(interestObj.label);
                      return (
                        <button key={interestObj.id} type="button" onClick={() => toggleInterest(interestObj.label)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected ? 'border-terracotta bg-terracotta/20 text-white' : 'glass-card border-glass-border hover:border-glass-border/80 text-foreground/70'}`}>
                          {interestObj.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground/60 mb-3 ml-1">What&apos;s your preferred pace?</label>
                  <div className="space-y-2">
                    {[
                      { id: "fast", label: "Intense Explorer", desc: "I want to see as much as possible in one day." },
                      { id: "balanced", label: "Balanced Journey", desc: "See the must-haves, but leave room to breathe." },
                      { id: "relaxed", label: "Smooth Voyager", desc: "Slow mornings, long coffee breaks, no rush." }
                    ].map((p) => (
                      <button key={p.id} type="button" onClick={() => setPace(p.id)}
                        className={`w-full text-left p-4 rounded-xl flex flex-col gap-1 transition-all relative border-2 ${pace === p.id ? 'border-terracotta bg-terracotta/20 ring-2 ring-terracotta/20' : 'glass-card border-glass-border hover:border-terracotta/20'}`}>
                        {pace === p.id && <div className="absolute top-4 right-4 text-terracotta transition-all"><Check size={16} strokeWidth={3} /></div>}
                        <span className="font-semibold text-sm">{p.label}</span>
                        <span className="text-xs text-foreground/50 font-medium">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FINAL LOADING STEP */}
          {step === 5 && (
            <motion.div key="step5" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-6 text-center py-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-terracotta/10 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-terracotta animate-spin" />
                <Sparkles className="w-8 h-8 text-terracotta animate-pulse" />
              </div>
              <h2 className="text-3xl font-serif text-foreground">{loadingMessage}</h2>
              <p className="text-foreground/60 max-w-sm mx-auto animate-pulse">
                Please wait while our AI engine builds your personalized journey.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER: Validation & Buttons */}
      {step < 5 && (
        <div className="pt-8 flex items-center justify-between border-t border-glass-border/40 mt-6">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step > i ? "bg-terracotta w-6" : "bg-glass-border w-2"}`} />
            ))}
          </div>
          
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!getStepValidation()}>
              {step === TOTAL_STEPS ? 'Generate Plan' : 'Next Step'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
