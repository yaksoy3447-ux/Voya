"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function BlogPage() {
  const posts = [
    {
      title: "How AI Travel Planning Actually Works — And Why It Changes Everything",
      slug: "ai-travel-planning-guide",
      excerpt: "From hyper-personalized itineraries to real-time pricing, here's how AI is turning hours of research into a single click.",
      date: "April 12, 2026",
      author: "Rovago Team",
      readTime: "6 min read",
      category: "Travel Tech",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "2026's Best Cities for Digital Nomads",
      slug: "digital-nomads-2026",
      excerpt: "From high-speed internet in Bali to the vibrant co-working culture of Lisbon, find out where to take your office next.",
      date: "April 10, 2026",
      author: "Rovago Team",
      readTime: "7 min read",
      category: "Digital Nomad",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Exploring the Soul of Istanbul: A Local's Perspective",
      slug: "istanbul-local-tips",
      excerpt: "Navigate the busy streets of Istanbul with insider tips on transport, hidden cafes, and the best time to visit historic sites.",
      date: "April 5, 2026",
      author: "Rovago Team",
      readTime: "6 min read",
      category: "City Guide",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Chasing Sunsets in Mykonos: An AI-Planned Adventure",
      slug: "mykonos-experience",
      excerpt: "How I used Rovago to skip the tourist traps and discover the most authentic corners of the Aegean islands.",
      date: "April 2, 2026",
      readTime: "5 min read",
      category: "Experience",
      image: "https://images.unsplash.com/photo-1548574505-12ca0a174b6d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Thailand Travel Guide 2026: Bangkok, Beaches & Beyond",
      slug: "thailand-travel-guide-2026",
      excerpt: "Everything you need to plan the perfect Thailand trip — from Bangkok street food to Koh Lanta sunsets — in one complete guide.",
      date: "March 30, 2026",
      author: "Rovago Team",
      readTime: "9 min read",
      category: "Destinations",
      image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Bali Complete Guide: Best Areas, Budget & Hidden Temples",
      slug: "bali-complete-guide",
      excerpt: "Skip the crowds at Kuta and discover the real Bali — from Ubud's rice terraces to Amed's volcanic black-sand beaches.",
      date: "March 27, 2026",
      author: "Rovago Team",
      readTime: "8 min read",
      category: "Destinations",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Morocco in 7 Days: From Marrakech Medina to Sahara Dunes",
      slug: "morocco-7-day-itinerary",
      excerpt: "A day-by-day itinerary covering the best of Morocco — vibrant souks, ancient kasbahs, and star-lit desert camps.",
      date: "March 24, 2026",
      author: "Rovago Team",
      readTime: "10 min read",
      category: "Itinerary",
      image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Backpacking Europe in 2026: The Complete Budget Guide",
      slug: "budget-travel-europe-2026",
      excerpt: "How to see 10 European cities in 30 days for under $2,000 — including flights, hostels, and unforgettable food experiences.",
      date: "March 20, 2026",
      author: "Rovago Team",
      readTime: "11 min read",
      category: "Budget Travel",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "10 Hidden Gems in Japan You've Never Heard Of",
      slug: "hidden-gems-japan",
      excerpt: "Beyond Tokyo and Kyoto, Japan offers serene landscapes and ancient traditions waiting to be discovered.",
      date: "March 28, 2026",
      readTime: "8 min read",
      category: "Destinations",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Solo Female Travel: Safest Destinations & Practical Tips for 2026",
      slug: "solo-female-travel-tips",
      excerpt: "Empowering, research-backed advice and the world's most welcoming solo destinations for women travelling alone.",
      date: "March 17, 2026",
      author: "Rovago Team",
      readTime: "8 min read",
      category: "Solo Travel",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Southeast Asia on a Budget: Vietnam, Thailand & Cambodia",
      slug: "southeast-asia-budget-guide",
      excerpt: "The ultimate backpacker's handbook to Southeast Asia — how to eat, sleep, and explore three countries without breaking the bank.",
      date: "March 14, 2026",
      author: "Rovago Team",
      readTime: "9 min read",
      category: "Budget Travel",
      image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Dubai Travel Guide: Skyscrapers, Souks & Desert Safaris",
      slug: "dubai-travel-guide",
      excerpt: "From the world's tallest building to a traditional abra crossing the Creek — Dubai is far more layered than its Instagram image.",
      date: "March 10, 2026",
      author: "Rovago Team",
      readTime: "7 min read",
      category: "City Guide",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Greece Island Hopping Guide: Santorini, Crete & the Hidden Aegean",
      slug: "greece-island-hopping",
      excerpt: "The perfect two-week route through the Greek islands — where to stay, which ferries to take, and which crowds to skip entirely.",
      date: "March 7, 2026",
      author: "Rovago Team",
      readTime: "10 min read",
      category: "Destinations",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop"
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen bg-background pb-20 px-4 md:px-8">
      <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-terracotta/8 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.span custom={0} variants={fadeUp} className="text-sm font-medium text-terracotta uppercase tracking-widest">Travel Insights</motion.span>
          <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-6xl font-serif mt-3 mb-6">The Explorer Journal</motion.h1>
          <motion.p custom={2} variants={fadeUp} className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Travel stories, destination guides, and AI-powered trip inspiration from the Rovago team.
          </motion.p>
        </motion.div>

        {/* Featured Post */}
        <Link href={`/blog/${featured.slug}`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp}
            className="glass-card mb-16 rounded-[40px] border border-glass-border overflow-hidden group cursor-pointer hover:border-terracotta/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-full min-h-[320px] overflow-hidden">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
                <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-terracotta text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} /> Latest Entry
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-terracotta/60">{featured.category}</span>
                <div className="flex items-center gap-6 text-xs text-foreground/40 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {featured.readTime}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif leading-tight">{featured.title}</h2>
                <p className="text-foreground/60 leading-relaxed text-lg italic">{featured.excerpt}</p>
                <div className="pt-4">
                  <button className="flex items-center gap-2 text-terracotta font-medium group/btn">
                    Read Full Article <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {rest.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 4} variants={fadeUp}
                className="glass-card rounded-[32px] border border-glass-border overflow-hidden group hover:border-terracotta/30 transition-all h-full">
                <div className="relative h-60 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">{post.category}</div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-foreground/30 uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-serif group-hover:text-terracotta transition-colors">{post.title}</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="pt-2">
                    <span className="inline-flex h-10 px-6 items-center justify-center rounded-full border border-glass-border text-xs font-semibold group-hover:bg-terracotta group-hover:text-white transition-all">Continue Reading</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
