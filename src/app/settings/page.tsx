"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Lock, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Password state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully.' })
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const handleRequestDeletion = async () => {
    if (!confirm("Are you sure you want to schedule your account for deletion? This will follow the grace period rules.")) return

    setLoading(true)
    try {
      const res = await fetch('/api/profile/request-deletion', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Account deletion has been scheduled.' })
        fetchProfile()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to schedule deletion.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'A network error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif">Account Settings</h1>
            <p className="text-foreground/50 text-sm">Manage your security and account status.</p>
          </div>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className={`p-4 rounded-2xl mb-8 flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Change Password */}
          <section className="glass-card p-8 rounded-3xl border border-glass-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-terracotta/10 text-terracotta">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-serif">Change Password</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground/40 uppercase tracking-wider mb-2 ml-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                  className="w-full h-12 bg-white/5 border border-glass-border rounded-xl px-4 outline-none focus:border-terracotta/50 transition-all font-medium"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/40 uppercase tracking-wider mb-2 ml-1">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                  className="w-full h-12 bg-white/5 border border-glass-border rounded-xl px-4 outline-none focus:border-terracotta/50 transition-all font-medium"
                />
              </div>
              <button disabled={loading} className="w-full h-12 bg-terracotta text-white font-medium rounded-xl hover:bg-terracotta/90 transition-all disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>

          {/* Account Status / Deletion */}
          <section className="glass-card p-8 rounded-3xl border border-glass-border bg-rose-500/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <Trash2 size={20} />
              </div>
              <h2 className="text-xl font-serif text-rose-500">Account Status</h2>
            </div>
            
            {profile?.scheduled_deletion_date ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
                <p className="text-sm text-rose-400 font-medium">
                  {new Date(profile.scheduled_deletion_date).toLocaleDateString('tr-TR')} tarihinde hesabınız silinecektir.
                </p>
                <p className="text-xs text-rose-400/60 mt-1">
                  We will retain your data until this date. You can continue using your account.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-foreground/50 leading-relaxed">
                  Deleting your account is permanent. If you are a Pro user, your account will remain active until your current subscription ends. Free users have a 15-day grace period.
                </p>
                <button onClick={handleRequestDeletion} disabled={loading} className="px-6 h-12 border border-rose-500/30 text-rose-500 font-medium rounded-xl hover:bg-rose-500/10 transition-all disabled:opacity-50">
                  Delete Account
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
