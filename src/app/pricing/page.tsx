"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Compass, Star, Zap, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    const supabase = createClient()
    
    // 1. Önce Client-side (tarayıcıda) hızlıca oturuma bakalım
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // Oturum yoksa saniyesinde login ekranına ışınlıyoruz
      window.location.href = `/login?next=/pricing`
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        // Sunucu tarafında da oturum düşmüşse login'e gönder
        window.location.href = "/login?next=/pricing";
      } else {
        alert("Server Error: " + (data.error || JSON.stringify(data)));
      }
    } catch (err: any) {
      alert("Network/App Error: " + err.message);
      console.error(err);
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <Compass size={24} />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      desc: 'Try Rovago with limited access',
      cta: 'Get Started',
      ctaStyle: 'border border-glass-border bg-white/5 hover:bg-white/10 text-foreground',
      highlight: false,
      features: [
        { text: '3 travel plans total', included: true },
        { text: 'Basic itinerary (Day 1 only)', included: true },
        { text: 'Flight & hotel links', included: true },
        { text: 'Weather & currency info', included: true },
        { text: 'Full day-by-day itinerary', included: false },
        { text: 'Restaurant & dining secrets', included: false },
        { text: 'Insider tips', included: false },
        { text: 'Event discovery', included: false },
        { text: 'PDF export', included: false },
      ]
    },
    {
      id: 'explorer',
      name: 'Explorer',
      icon: <Star size={24} />,
      monthlyPrice: 15,
      yearlyPrice: 15 * 9,
      desc: 'Full access for regular travelers',
      cta: 'Choose Explorer',
      ctaStyle: 'border border-glass-border bg-white/5 hover:bg-white/10 text-foreground',
      highlight: false,
      features: [
        { text: '20 plans total', included: true },
        { text: 'Full day-by-day itinerary', included: true },
        { text: 'Restaurant & dining secrets', included: true },
        { text: 'Insider tips & local knowledge', included: true },
        { text: 'Event discovery & ticket links', included: true },
        { text: 'Day tours & local experiences', included: true },
        { text: 'SIM card & eSIM suggestions', included: true },
        { text: 'Travel insurance recommendations', included: true },
        { text: 'PDF export', included: true },
      ]
    },
    {
      id: 'nomad',
      name: 'Nomad',
      icon: <Crown size={24} className="fill-terracotta" />,
      monthlyPrice: 29,
      yearlyPrice: 29 * 9,
      desc: 'Everything, unlimited, forever',
      cta: 'Choose Nomad',
      ctaStyle: 'bg-terracotta text-white hover:bg-terracotta/90 shadow-xl shadow-terracotta/20',
      highlight: true,
      features: [
        { text: 'Unlimited plans', included: true },
        { text: 'Everything in Explorer', included: true },
        { text: 'Multi-city itineraries', included: true },
        { text: 'Plan history & saved plans', included: true },
        { text: 'Shareable plan links', included: true },
        { text: 'Group travel planning', included: true },
        { text: 'In-trip budget tracker', included: true },
        { text: 'Personal notes on plans', included: true },
        { text: 'Priority support', included: true },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-terracotta/8 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-sand/8 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial="hidden" animate="visible" className="text-center mb-12">
          <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Pricing</motion.span>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-5xl font-serif mt-3 mb-4">Choose Your Adventure Tier</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-foreground/60 max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready for the complete Rovago experience.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div custom={3} variants={fadeUp} className="inline-flex items-center gap-1 mt-8 p-1 rounded-full border border-glass-border bg-white/5 backdrop-blur-md">
            <button onClick={() => setBilling('monthly')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-terracotta text-white' : 'text-foreground/60 hover:text-foreground'}`}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-terracotta text-white' : 'text-foreground/60 hover:text-foreground'}`}>
              Yearly <span className="text-xs opacity-70">3 Months Gift</span>
            </button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}
              className={`glass-card p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all ${plan.highlight ? 'border-2 border-terracotta/50 bg-terracotta/5 shadow-[0_0_60px_-15px_rgba(215,92,61,0.15)]' : 'border border-glass-border'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-terracotta text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl tracking-wider uppercase">Most Popular</div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-xl ${plan.highlight ? 'bg-terracotta/20 text-terracotta' : 'bg-white/5 text-foreground/60'}`}>{plan.icon}</div>
                <h2 className="text-xl font-serif font-medium">{plan.name}</h2>
              </div>
              <p className="text-sm text-foreground/50 mb-5">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-4xl font-medium">${billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</span>
                <span className="text-foreground/50 text-sm">
                  {plan.monthlyPrice === 0 ? ' forever' : billing === 'monthly' ? ' /mo' : ' /yr'}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className={`flex items-start gap-2.5 text-sm ${f.included ? 'text-foreground/80' : 'text-foreground/30'}`}>
                    {f.included
                      ? <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                      : <X size={16} className="shrink-0 mt-0.5" />
                    }
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.id !== 'free' && handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full h-12 font-medium rounded-full transition-all ${plan.ctaStyle}`}
              >
                {loading === plan.id ? 'Loading...' : plan.id === 'free' ? 'Current Plan' : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
