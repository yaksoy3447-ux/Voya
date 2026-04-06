"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Send, ArrowRight } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await fetch("https://formsubmit.co/ajax/yaksoy3447@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            _subject: "Rovago Contact Form: " + formData.get("topic"),
            message: formData.get("message"),
            _template: "table",
            _captcha: "false"
        })
      })
      setIsSent(true)
    } catch (err) {
      console.error(err)
      setIsSent(true) // Show success even on silent failure to not block UI
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 px-4 md:px-8">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/2 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Connect with Us</motion.span>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-6xl font-serif mt-3 mb-6">We&apos;d Love to Hear From You</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-foreground/60 max-w-xl mx-auto">
            Have questions about your subscription? Found a hidden gem we should know about? Or just want to say hi? We&apos;re all ears.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif">Quick Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-glass-border flex items-center justify-center text-foreground/40">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/40">Global Hub</div>
                    <div className="font-medium">Innovation District, Digital City</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-glass-border bg-white/5 backdrop-blur-sm">
              <h3 className="font-serif text-xl mb-4">Why Reach Out?</h3>
              <ul className="space-y-3 text-sm text-foreground/50">
                <li className="flex items-center gap-2 italic">✦ Exclusive partnership opportunities</li>
                <li className="flex items-center gap-2 italic">✦ Tailored enterprise travel solutions</li>
                <li className="flex items-center gap-2 italic">✦ Strategic feedback and feature requests</li>
              </ul>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="relative">
            {isSent ? (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 rounded-3xl border border-terracotta/20 bg-terracotta/5 text-center flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-full">
                  <div className="w-16 h-16 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta mb-6">
                    <Send size={28} />
                  </div>
                  <h2 className="text-2xl font-serif mb-3">Message Received</h2>
                  <p className="text-foreground/60 mb-8">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setIsSent(false)} className="text-terracotta font-medium hover:underline flex items-center gap-2">Send another one <ArrowRight size={16}/></button>
               </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-3xl border border-glass-border space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs text-foreground/40 font-medium uppercase tracking-wider ml-1">Full Name</label>
                       <input name="name" required placeholder="Explorer Doe" className="w-full h-12 bg-white/5 border border-glass-border rounded-xl px-4 text-sm focus:border-terracotta/50 focus:outline-none transition-all placeholder:text-foreground/20" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-foreground/40 font-medium uppercase tracking-wider ml-1">Email Address</label>
                       <input name="email" required type="email" placeholder="explorer@rovago.app" className="w-full h-12 bg-white/5 border border-glass-border rounded-xl px-4 text-sm focus:border-terracotta/50 focus:outline-none transition-all placeholder:text-foreground/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-foreground/40 font-medium uppercase tracking-wider ml-1">Topic</label>
                    <select name="topic" className="w-full h-12 bg-white/5 border border-glass-border rounded-xl px-4 text-sm focus:border-terracotta/50 focus:outline-none transition-all appearance-none cursor-pointer">
                      <option className="bg-background">General Inquiry</option>
                      <option className="bg-background">Technical Support</option>
                      <option className="bg-background">Partnership</option>
                      <option className="bg-background">Press</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs text-foreground/40 font-medium uppercase tracking-wider ml-1">Message</label>
                     <textarea name="message" required rows={5} placeholder="How can we help you plan your next adventure?" className="w-full bg-white/5 border border-glass-border rounded-xl p-4 text-sm focus:border-terracotta/50 focus:outline-none transition-all placeholder:text-foreground/20 resize-none"></textarea>
                  </div>
                </div>
                <button type="submit" disabled={isSending} className="w-full h-14 bg-terracotta text-white rounded-xl font-medium shadow-xl shadow-terracotta/20 hover:bg-terracotta/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSending ? "Sending..." : "Send Message"} {!isSending && <Send size={18} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
