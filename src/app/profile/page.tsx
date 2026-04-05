"use client"

import { useEffect, useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User as UserIcon, Mail, Shield, CreditCard, ChevronRight, Settings as SettingsIcon, LogOut, Compass, MapPin, Trash2, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

interface ProfileData {
  tier: string;
  id: string;
  plan_count?: number;
  subscription_end_date?: string;
  scheduled_deletion_date?: string;
}

interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  created_at: string;
  itinerary: any;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [plans, setPosts] = useState<TravelPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showAllPlans, setShowAllPlans] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const [profileRes, plansRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('plans').select('id, title, destination, created_at, itinerary').eq('user_id', user.id).order('created_at', { ascending: false })
        ])
        
        if (profileRes.data) setProfile(profileRes.data)
        if (plansRes.data) setPosts(plansRes.data)
      } else {
        router.push("/login")
      }
      setLoading(false)
    }
    fetchUser()
  }, [router])

  const handleDeletePlan = async (e: React.MouseEvent, planId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm("Delete this plan? This cannot be undone.")) return
    setDeletingId(planId)
    await supabase.from('plans').delete().eq('id', planId)
    setPosts(prev => prev.filter(p => p.id !== planId))
    setDeletingId(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  }

  const handleSyncPlan = async (requestedTier: string = 'Explorer') => {
    setSyncing(true);
    try {
      const res = await fetch('/api/dev/sync-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: requestedTier }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(prev => prev ? { ...prev, tier: data.tier } : null);
        router.refresh();
      } else {
        alert("Sync failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-terracotta rounded-full animate-spin" />
    </div>
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Deletion Notice */}
          {profile?.scheduled_deletion_date && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400"
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Account Scheduled for Deletion</span>
              </div>
              <div className="text-sm font-medium">
                {new Date(profile.scheduled_deletion_date).toLocaleDateString('tr-TR')} tarihinde Hesabınız silinecektir.
              </div>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 rounded-2xl border border-terracotta/40 bg-terracotta/10 text-center text-sm font-medium text-terracotta shadow-xl shadow-terracotta/10">
              🎉 Payment successful! If your status doesn&apos;t update automatically, please click &quot;Sync Subscription&quot; below.
            </motion.div>
          )}

          {/* Profile Header */}
          <div className="glass-card p-8 rounded-[32px] border border-glass-border flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-terracotta to-sand p-1 shadow-xl relative">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden relative">
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                ) : (
                  <UserIcon size={48} className="text-terracotta/40" />
                )}
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-serif text-foreground mb-1">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h1>
              <div className="text-foreground/50 mb-4 flex items-center justify-center md:justify-start gap-2 text-sm">
                <Mail size={16} /> {user.email}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm font-semibold flex items-center gap-2">
                  <Shield size={14} /> {profile?.tier || 'Free'} Member
                </div>
                <Link href="/create" className="px-4 py-1.5 rounded-full bg-terracotta text-white hover:bg-terracotta/90 text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-terracotta/20">
                  <Compass size={14} /> Start New Trip
                </Link>
                {profile?.tier === 'Free' && (
                   <Link href="/pricing" className="px-4 py-1.5 rounded-full bg-white/5 border border-glass-border hover:border-terracotta/40 text-foreground/80 text-sm font-medium transition-all">
                     Upgrade
                   </Link>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription Card */}
            <div className="glass-card p-6 rounded-3xl border border-glass-border group hover:border-terracotta/30 transition-all">
              <div className="p-3 w-fit rounded-2xl bg-terracotta/10 text-terracotta mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-medium mb-1">Subscription</h3>
              <p className="text-sm text-foreground/50 mb-6">Your current plan details.</p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-glass-border/40">
                  <span className="text-foreground/40">Current Plan</span>
                  <span className="font-medium text-terracotta">{profile?.tier || 'Free'}</span>
                </div>

                {/* Plan Usage */}
                {(() => {
                  const used = profile?.plan_count ?? 0;
                  const tier = profile?.tier || 'Free';
                  const limit = tier === 'Free' ? 3 : tier === 'Explorer' ? 20 : null;
                  const isUnlimited = tier === 'Nomad';
                  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
                  return (
                    <div className="py-2 border-b border-glass-border/40 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/40">Plans Used</span>
                        <span className="font-medium">
                          {isUnlimited ? (
                            <span className="text-terracotta">∞ Unlimited</span>
                          ) : (
                            <span className={used >= (limit ?? 0) ? 'text-red-400' : 'text-foreground'}>
                              {used} <span className="text-foreground/30">/ {limit}</span>
                            </span>
                          )}
                        </span>
                      </div>
                      {!isUnlimited && limit && (
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${used >= limit ? 'bg-red-400' : 'bg-terracotta'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {profile?.tier === 'Free' ? (
                  <button onClick={() => handleSyncPlan('Explorer')} disabled={syncing} className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-terracotta/20 text-terracotta text-xs font-bold uppercase tracking-wider hover:bg-terracotta/30 transition-all">
                    <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                    {syncing ? 'Syncing...' : 'Sync Subscription'}
                  </button>
                ) : (
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-foreground/40">Renews on</span>
                    <span className="font-medium">
                      {profile?.subscription_end_date
                        ? new Date(profile.subscription_end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Next Month'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Stats Card */}
            <div className="glass-card p-6 rounded-3xl border border-glass-border group hover:border-terracotta/30 transition-all">
              <div className="p-3 w-fit rounded-2xl bg-sand/10 text-sand mb-4">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-medium mb-1">Travel Stats</h3>
              <p className="text-sm text-foreground/50 mb-6">Your history with Rovago AI.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-glass-border">
                  <div className="text-2xl font-serif text-terracotta">{plans.length}</div>
                  <div className="text-[10px] uppercase tracking-wider text-foreground/40">Plans Made</div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/5 border border-glass-border">
                   <div className="text-2xl font-serif text-terracotta">
                     {new Set(plans.map(p => {
                       if (p.itinerary?.selectedCountry) return p.itinerary.selectedCountry;
                       const title = p.title.toLowerCase();
                       if (title.includes('antalya') || title.includes('istanbul') || title.includes('turkey')) return 'Turkey';
                       if (title.includes('tokyo') || title.includes('japan')) return 'Japan';
                       if (title.includes('bali') || title.includes('indonesia')) return 'Indonesia';
                       if (title.includes('meksika') || title.includes('mexico')) return 'Mexico';
                       if (title.includes('london') || title.includes('uk') || title.includes('kraliyet')) return 'United Kingdom';
                       if (title.includes('paris') || title.includes('france') || title.includes('fransa')) return 'France';
                       if (title.includes('bangkok') || title.includes('thailand') || title.includes('tayland')) return 'Thailand';
                       if (title.includes('mykonos') || title.includes('greece')) return 'Greece';
                       if (title.includes('amalfi') || title.includes('italy')) return 'Italy';
                       if (title.includes('dubai') || title.includes('uae')) return 'UAE';
                       if (p.destination === 'Flexible') return null;
                       return p.destination;
                     }).filter(Boolean)).size}
                   </div>
                   <div className="text-[10px] uppercase tracking-wider text-foreground/40">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Adventures */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-serif font-medium">My Recent Adventures</h2>
              {plans.length > 6 && (
                <button onClick={() => setShowAllPlans(!showAllPlans)} className="text-xs text-terracotta hover:underline">
                  {showAllPlans ? 'Show Less' : `View All (${plans.length})`}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.length > 0 ? (showAllPlans ? plans : plans.slice(0, 6)).map((plan) => (
                <Link key={plan.id} href={`/plan/${plan.id}`} className="glass-card p-5 rounded-2xl border border-glass-border hover:border-terracotta/40 group transition-all relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-terracotta/10 text-terracotta">
                      <Compass size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-foreground/30 font-mono">
                        {new Date(plan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <button onClick={(e) => handleDeletePlan(e, plan.id)} disabled={deletingId === plan.id} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-foreground/30 hover:text-red-400 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-medium text-foreground/90 group-hover:text-terracotta transition-colors line-clamp-1 mb-1">{plan.title}</h4>
                  <div className="text-xs text-foreground/50 flex items-center gap-1">
                    <MapPin size={10} /> {plan.destination}
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-12 glass-card rounded-[32px] border border-glass-border border-dashed flex flex-col items-center justify-center text-center">
                  <div className="p-4 rounded-full bg-white/5 mb-4 text-foreground/20">
                    <Compass size={40} />
                  </div>
                  <h4 className="text-foreground/80 font-medium">No adventures yet</h4>
                  <Link href="/create" className="text-sm font-bold text-terracotta uppercase tracking-widest mt-6 hover:tracking-[0.2em] transition-all">
                    Create Now &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Account Links */}
          <div className="glass-card rounded-3xl border border-glass-border overflow-hidden">
            <button onClick={() => router.push('/settings')} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left border-b border-glass-border/40 group">
              <div className="flex items-center gap-4">
                <SettingsIcon size={20} className="text-foreground/40 group-hover:text-terracotta transition-colors" />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronRight size={18} className="text-foreground/20 group-hover:text-foreground transition-all" />
            </button>
            <button onClick={handleLogout} className="w-full flex items-center justify-between p-6 hover:bg-rose-500/5 transition-all text-left group">
              <div className="flex items-center gap-4">
                <LogOut size={20} className="text-rose-400/60" />
                <span className="font-medium text-rose-400">Logout</span>
              </div>
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-terracotta rounded-full animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
