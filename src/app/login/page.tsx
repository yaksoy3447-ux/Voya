"use client"

import { useState, useEffect, Suspense } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Mail, Lock, Eye, EyeOff, Compass } from "lucide-react"
import { useSearchParams } from "next/navigation"

function LoginContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError === 'auth_failed') setError("Authentication failed. Please try again.")
    if (urlError === 'invalid_callback') setError("Invalid login attempt. Please try again.")
  }, [searchParams])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert("Check your email for a confirmation link!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = "/create"
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/create` }
    })
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-terracotta/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-sand/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Compass size={32} className="text-terracotta" />
            <span className="font-serif text-2xl font-medium">Voya.</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-foreground/50">
            {isSignUp ? "Start planning your next adventure." : "Sign in to access your itineraries."}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-glass-border">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-2 h-12 rounded-xl border border-glass-border bg-white/5 hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-sm font-medium text-foreground/70">Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-glass-border" />
            <span className="text-xs text-foreground/40 uppercase tracking-wider">or continue with email</span>
            <div className="flex-1 h-px bg-glass-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-glass-border bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-glass-border bg-white/5 text-foreground placeholder:text-foreground/30 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-terracotta text-white font-medium rounded-xl hover:bg-terracotta/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-terracotta/20">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <p className="text-center text-sm text-foreground/50 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsSignUp(!isSignUp); setError("") }} className="text-terracotta hover:underline ml-1 font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-foreground/30 mt-6">
          By continuing, you agree to our <Link href="/terms" className="underline hover:text-foreground/50">Terms</Link> and <Link href="/privacy" className="underline hover:text-foreground/50">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
