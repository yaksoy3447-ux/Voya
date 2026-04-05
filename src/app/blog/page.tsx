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
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop"
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
    { title: "Paris Travel Guide: Eiffel Tower, Hidden Bistros & Seine Sunsets", slug: "paris-travel-guide", excerpt: "Beyond the postcard shots — how to eat, wander, and fall in love with Paris the way locals do.", date: "April 14, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
    { title: "Tokyo Travel Guide: Neon Nights, Ramen & Cherry Blossom Streets", slug: "tokyo-travel-guide", excerpt: "From Shibuya's crossing to a quiet temple in Yanaka — the Tokyo that will genuinely surprise you.", date: "April 13, 2026", author: "Rovago Team", readTime: "9 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop" },
    { title: "New York City Guide: Bagels, Boroughs & the Best Views in the World", slug: "new-york-travel-guide", excerpt: "How to do NYC without burning your budget — and which neighbourhoods to actually spend your time in.", date: "April 11, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop" },
    { title: "Rome in 4 Days: Colosseum, Cacio e Pepe & the Art of Doing Nothing", slug: "rome-travel-guide", excerpt: "A first-timer's guide to the Eternal City — where to eat, what to skip, and how to find peace in the chaos.", date: "April 9, 2026", author: "Rovago Team", readTime: "7 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop" },
    { title: "Barcelona Travel Guide: Gaudí, Tapas & the Perfect Seaside City", slug: "barcelona-travel-guide", excerpt: "How to balance the tourist icons with the local barrios — and why Barcelona rewards slow travellers most.", date: "April 8, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop" },
    { title: "London Travel Guide: Pubs, Parks & the World's Best Free Museums", slug: "london-travel-guide", excerpt: "London can be done on any budget — if you know where to look. Here's the city through a traveller's honest eyes.", date: "April 7, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=800&auto=format&fit=crop" },
    { title: "Bangkok Travel Guide: Street Food, Temples & the City That Never Sleeps", slug: "bangkok-travel-guide", excerpt: "The chaos, the colour, the food — Bangkok is overwhelming in the best possible way. Here's how to embrace it.", date: "April 4, 2026", author: "Rovago Team", readTime: "9 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=800&auto=format&fit=crop" },
    { title: "Amsterdam Travel Guide: Canals, Bikes & the Cosy Dutch Life", slug: "amsterdam-travel-guide", excerpt: "Amsterdam is one of the world's most walkable cities — and one of the easiest to fall completely in love with.", date: "April 3, 2026", author: "Rovago Team", readTime: "7 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800&auto=format&fit=crop" },
    { title: "Prague Travel Guide: Gothic Towers, Pilsner & Fairy-Tale Streets", slug: "prague-travel-guide", excerpt: "Central Europe's most photogenic capital is still surprisingly affordable — and endlessly easy to explore on foot.", date: "April 1, 2026", author: "Rovago Team", readTime: "7 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=800&auto=format&fit=crop" },
    { title: "Lisbon Travel Guide: Fado, Pastéis de Nata & Atlantic Light", slug: "lisbon-travel-guide", excerpt: "Portugal's capital is sun-soaked, affordable and achingly beautiful — the kind of city that makes you miss it before you've even left.", date: "March 31, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=800&auto=format&fit=crop" },
    { title: "Santorini Travel Guide: Blue Domes, Volcanic Beaches & Aegean Sunsets", slug: "santorini-travel-guide", excerpt: "Yes, it's popular — but Santorini's magic is real. Here's how to experience it beyond the crowds.", date: "March 29, 2026", author: "Rovago Team", readTime: "7 min read", category: "Destinations", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop" },
    { title: "Maldives Travel Guide: Overwater Bungalows, Reefs & Total Disconnection", slug: "maldives-travel-guide", excerpt: "The Maldives is more accessible than you think — and more breathtaking than any photo prepares you for.", date: "March 28, 2026", author: "Rovago Team", readTime: "8 min read", category: "Destinations", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop" },
    { title: "Singapore Travel Guide: Hawker Centres, Gardens & Hyper-Modern Asia", slug: "singapore-travel-guide", excerpt: "The cleanest, greenest, most delicious city in Asia — Singapore defies every expectation and rewards every visit.", date: "March 26, 2026", author: "Rovago Team", readTime: "7 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?q=80&w=800&auto=format&fit=crop" },
    { title: "Marrakech Travel Guide: Souks, Riads & the Sahara on Your Doorstep", slug: "marrakech-travel-guide", excerpt: "Marrakech is a full sensory assault — in the most wonderful way. Here's how to navigate the magic.", date: "March 25, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop" },
    { title: "Kyoto Travel Guide: Bamboo Groves, Geisha Districts & Temple Silence", slug: "kyoto-travel-guide", excerpt: "Japan's ancient capital moves at a different pace — one that reminds you why slow travel is always the right choice.", date: "March 23, 2026", author: "Rovago Team", readTime: "8 min read", category: "Destinations", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" },
    { title: "New Orleans Travel Guide: Jazz, Gumbo & the Most Spirited City in America", slug: "new-orleans-travel-guide", excerpt: "New Orleans doesn't just have culture — it IS culture. Music, food, architecture and pure unapologetic joy.", date: "March 22, 2026", author: "Rovago Team", readTime: "7 min read", category: "Experience", image: "https://images.unsplash.com/photo-1571893544028-06b07af6dade?q=80&w=800&auto=format&fit=crop" },
    { title: "Budapest Travel Guide: Thermal Baths, Ruin Bars & the Danube at Dusk", slug: "budapest-travel-guide", excerpt: "Budapest might be Europe's most underrated capital — grand, dramatic, affordable and impossibly romantic.", date: "March 21, 2026", author: "Rovago Team", readTime: "7 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1549895005-44b53fdbfe6f?q=80&w=800&auto=format&fit=crop" },
    { title: "Cappadocia Travel Guide: Hot Air Balloons, Cave Hotels & Martian Landscapes", slug: "cappadocia-travel-guide", excerpt: "Nowhere on earth looks quite like Cappadocia — and floating over it at sunrise is genuinely life-changing.", date: "March 19, 2026", author: "Rovago Team", readTime: "7 min read", category: "Experience", image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?q=80&w=800&auto=format&fit=crop" },
    { title: "Amalfi Coast Travel Guide: Clifftop Villages, Limoncello & Turquoise Water", slug: "amalfi-coast-travel-guide", excerpt: "The Amalfi Coast is one of the most beautiful places on earth — here's how to see it without the chaos.", date: "March 18, 2026", author: "Rovago Team", readTime: "8 min read", category: "Destinations", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop" },
    { title: "Rio de Janeiro Travel Guide: Carnival Spirit, Christ the Redeemer & Beach Life", slug: "rio-de-janeiro-travel-guide", excerpt: "Rio is loud, colourful, breathtaking and impossible to forget. Here's how to experience it safely and fully.", date: "March 16, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop" },
    { title: "Cape Town Travel Guide: Table Mountain, Wine Valleys & the Edge of Africa", slug: "cape-town-travel-guide", excerpt: "Cape Town is the kind of city that makes you question why you'd ever live anywhere else. Here's the full picture.", date: "March 15, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop" },
    { title: "Seoul Travel Guide: K-Culture, Street Food Alleys & Hyper-Modern Tradition", slug: "seoul-travel-guide", excerpt: "Seoul moves faster than almost any city on earth — and rewards those who keep up with some of the best food and culture in Asia.", date: "March 13, 2026", author: "Rovago Team", readTime: "8 min read", category: "City Guide", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop" },
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
