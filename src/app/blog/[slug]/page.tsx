"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, Variants } from "framer-motion"
import { ArrowLeft, Calendar, Clock, ThumbsUp, ThumbsDown } from "lucide-react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } })
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function BlogPostDetail() {
  const params = useParams()
  const slug = params?.slug as string

  interface BlogSection {
    text: string;
    image: string;
    layout: 'text-left' | 'image-left';
  }

  interface BlogPost {
    title: string;
    date: string;
    readTime: string;
    author: string;
    category: string;
    heroImage: string;
    sections: BlogSection[];
  }

  const posts: Record<string, BlogPost> = {
    "istanbul-local-tips": {
      title: "Exploring the Soul of Istanbul: A Local's Perspective",
      date: "April 5, 2026",
      readTime: "6 min read",
      author: "Voya Team",
      category: "City Guide",
      heroImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Arriving in Istanbul always feels like a homecoming, even if it's your first time. The salty breeze from the Bosphorus greets you as you step out of the airport. To get to the heart of the city, Taksim Square, skip the expensive taxis and head straight for the modern M11 metro. It's fast, clean, and incredibly efficient. From the last stop, transfer to the M2 line, and just 3 stops later, you'll find yourself in the middle of Istiklal Street. The energy is infectious, with the nostalgic red tram clinking its bell as it weaves through the crowds.",
          image: "/blog/istanbul_metro.png",
          layout: "text-left"
        },
        {
          text: "No visit to Istanbul is complete without seeing the Blue Mosque (Sultanahmet Camii). But here's a pro-tip from a seasoned explorer: Pay close attention to the clock, especially on Fridays. The mosque closes its doors to visitors during prayer times, which usually starts around 12:30 PM. I learned this the hard way, waiting in a long line under the midday sun only to be turned away. Instead, use that time to walk across the square to Hagia Sophia or grab a roasted corn from a street vendor and watch the pigeons.",
          image: "/blog/blue_mosque.png",
          layout: "image-left"
        },
        {
          text: "Last night, I treated myself to dinner at a high-end rooftop restaurant overlooking the Golden Horn. The view was, quite literally, breathtaking—all the city lights shimmering on the water. While the atmosphere was ultra-luxurious and the service impeccable, I have to admit that the 'avant-garde' menu didn't quite hit the mark for me. I still prefer the bold, simple flavors of a local Balık Ekmek (fish sandwich) down by the Karaköy docks. Sometimes, the most authentic experiences don't need a white tablecloth.",
          image: "/blog/istanbul_dinner.png",
          layout: "text-left"
        },
        {
          text: "To escape the tourist crowds, I spent my final afternoon wandering through the steep, colorful alleys of Balat. It's a photographer's dream. I stumbled upon a tiny, unnamed tea house where locals were playing backgammon. I sat there for an hour, sipping my 'tavşan kanı' (rabbit blood) tea and listening to the call to prayer echoing between the narrow buildings. It's in these quiet, unscripted moments, away from the grand monuments, where you truly find the soul of Istanbul.",
          image: "/blog/balat_tea.png",
          layout: "image-left"
        }
      ]
    },
    "hidden-gems-japan": {
      title: "10 Hidden Gems in Japan You've Never Heard Of",
      date: "March 28, 2026",
      readTime: "8 min read",
      author: "Voya Team",
      category: "Destinations",
      heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Leaving the neon lights of Tokyo behind, I hopped on a local line heading towards the Japan Alps. There's something hypnotic about the rhythmic clacking of the tracks as you pass endless emerald rice fields. Unlike the Shinkansen, these local trains allow you to truly see the heart of the countryside. I recommend getting the JR Pass only if you plan on long distances; for these scenic routes, a simple IC card is enough. Just remember to tap in and out at the small, often unstaffed stations.",
          image: "/blog/japan_train.png",
          layout: "text-left"
        },
        {
          text: "I stumbled upon a moss-covered shrine deep in the forests of Nagano. There wasn't another soul in sight, just the sound of a distant waterfall and the rustle of ancient cedar trees. This is the Japan I came for—quiet, ancient, and deeply spiritual. To find spots like this, skip the top-10 lists and simply follow the 'Torii' gate icons on your map while wandering. Most of these mountain shrines are never 'closed', but it's best to leave before sunset as the mountain trails can get tricky.",
          image: "/blog/japan_shrine.png",
          layout: "image-left"
        },
        {
          text: "Dinner was at a tiny, smoke-filled izakaya tucked away in an alley near Matsumoto Castle. The menu was entirely in handwritten kanji, so I just pointed at what the person next to me was eating. Best decision ever. The yakitori was charred to perfection, and the local craft beer was crisp. Don't be intimidated by the 'locals only' vibe; a polite 'Sumimasen' and a smile usually open every door. Just be aware that some smaller places still have a 'table charge' (otoshi) which includes a small unplanned starter.",
          image: "/blog/japan_izakaya.png",
          layout: "text-left"
        },
        {
          text: "My final night was spent in a traditional ryokan. Sliding open the shoji screens to reveal a private Zen garden felt like stepping back in time. Sleeping on a futon on tatami mats is surprisingly comfortable once you get used to it. Pro tip: Always wear the provided yukata to the communal bath (onsen), and remember to wash thoroughly before entering the hot water. It's a ritual of purification as much as it is relaxation.",
          image: "/blog/japan_ryokan.png",
          layout: "image-left"
        }
      ]
    },
    "mykonos-experience": {
      title: "Chasing Sunsets in Mykonos: An AI-Planned Adventure",
      date: "April 2, 2026",
      readTime: "5 min read",
      author: "Voya Team",
      category: "Experience",
      heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Stepping onto the white-washed streets of Mykonos town, I felt that familiar mix of excitement and overwhelm. The town is a literal labyrinth. Luckily, our Voya-planned route had our boutique hotel sorted right at the quiet edge of the old town. Pro-tip: Don't bother with a rental car if you're staying in Chora; the winding alleys are strictly for walking, and the local buses are surprisingly reliable for reaching the southern beaches.",
          image: "/blog/mykonos_streets.png",
          layout: "text-left"
        },
        {
          text: "Everyone flocks to the iconic windmills for sunset, but the AI suggested we head slightly north to a hidden cliffside near the Armenistis Lighthouse. The view of the golden sun sinking into the Aegean was far more peaceful without the crowds of Little Venice. We sat there for two hours with a bottle of local Assyrtiko, watching the distant ferries cross the deep blue water. It's those quiet, unscripted moments that truly stick with you.",
          image: "/blog/mykonos_sunset.png",
          layout: "image-left"
        },
        {
          text: "For dinner, the app steered us away from the flashy harbor front and into a vine-covered backyard taverna where the menu was only in Greek. We had the most incredible grilled octopus, kissed by the sea and charcoal. My advice? Look for the places where the chairs don't match and the music is just the hum of local conversation. If you find a spot that feels like a family home rather than a tourist destination, you've found the real Mykonos.",
          image: "/blog/mykonos_food.png",
          layout: "text-left"
        },
        {
          text: "Waking up to the sound of distant church bells, I took an early walk along the silent harbor before the cruise ships arrived. The morning light in Greece is ethereal—it makes the white buildings glow like ivory. We used our AI-itinerary to catch the first ferry to the sacred island of Delos, beating both the midday heat and the tour groups. It’s not just about where you go; it’s about timing, and having a plan that knows when to beat the rush is a total game-changer.",
          image: "/blog/mykonos_harbor.png",
          layout: "image-left"
        }
      ]
    }
  }

  const post = posts[slug] || {
    title: "Content Coming Soon",
    date: "2026",
    readTime: "...",
    author: "Voya Team",
    category: "Travel",
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
    sections: []
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dynamic Header / Hero */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <Image src={post.heroImage} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-20 pb-12 md:pb-24 max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" className="space-y-6">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-terracotta/20">
              {post.category}
            </motion.div>
            <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-7xl font-serif text-white leading-tight max-w-5xl italic tracking-tight">
              {post.title}
            </motion.h1>
            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap items-center gap-8 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-terracotta" /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-terracotta" /> {post.readTime}</span>
              <span className="flex items-center gap-2 font-serif italic text-lg text-white">By {post.author}</span>
            </motion.div>
          </motion.div>
        </div>
        
        <Link href="/blog" className="absolute top-8 left-8 md:top-12 md:left-20 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors group pointer-events-auto">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
            <ArrowLeft size={22} />
          </div>
          <span className="font-semibold text-sm tracking-wide">Back to Journal</span>
        </Link>
      </section>

      {/* Main Content Sections (Alternating) */}
      <article className="max-w-7xl mx-auto px-6 md:px-20 py-24 space-y-32">
        {post.sections.length > 0 ? (
          post.sections.map((section: BlogSection, i: number) => (
            <motion.div 
              key={i} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${section.layout === 'text-left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-28 items-center`}
            >
              <div className="flex-1 space-y-8">
                <motion.div variants={fadeUp} custom={0}>
                  <div className="w-16 h-1 bg-terracotta/40 mb-10 rounded-full" />
                  <p className="text-2xl md:text-3xl text-foreground/80 leading-relaxed font-light italic">
                    &quot;{section.text}&quot;
                  </p>
                </motion.div>
              </div>
              
              <div className="flex-1 w-full">
                <motion.div variants={scaleIn} className="relative aspect-4/3 rounded-4xl overflow-hidden shadow-2xl shadow-black/30 group border border-glass-border">
                  <Image src={section.image} alt={`Visual diary ${i+1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 right-6 text-[10px] text-white/50 font-mono tracking-widest uppercase bg-black/20 backdrop-blur-sm px-2 py-1 rounded">Captured on Smartphone • 2026</div>
                </motion.div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-32 space-y-8">
             <h2 className="text-4xl md:text-6xl font-serif italic text-foreground/20 italic">Curating New Stories...</h2>
             <p className="text-foreground/40 text-lg max-w-lg mx-auto">Our AI explorers are currently on the ground, gathering insights and capturing moments to bring you the best travel tips.</p>
             <Link href="/blog" className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-terracotta text-white font-medium hover:scale-105 transition-transform">Return to Blog</Link>
          </div>
        )}
      </article>

      {/* Social interaction section */}
      <footer className="max-w-4xl mx-auto px-6 border-t border-glass-border pt-20 text-center">
        <p className="text-xs text-foreground/30 mb-10 font-bold uppercase tracking-[0.4em]">Fin • Exploring with Voya</p>
        <div className="flex justify-center gap-16 md:gap-24">
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full border border-glass-border flex items-center justify-center group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <ThumbsUp size={24} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Like</span>
                <span className="text-xs font-serif italic text-foreground/60 mt-1">1.2k</span>
              </div>
            </button>
            <button className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full border border-glass-border flex items-center justify-center group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <ThumbsDown size={24} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Dislike</span>
                <span className="text-xs font-serif italic text-foreground/60 mt-1">124</span>
              </div>
            </button>
        </div>
      </footer>
    </div>
  )
}
