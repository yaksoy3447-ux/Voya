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
      author: "Rovago Team",
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
      author: "Rovago Team",
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
    "digital-nomads-2026": {
      title: "2026's Best Cities for Digital Nomads",
      date: "April 10, 2026",
      readTime: "7 min read",
      author: "Rovago Team",
      category: "Digital Nomad",
      heroImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "The digital nomad movement has gone mainstream — and with it, the competition for affordable, connected, inspiring cities has never been fiercer. In 2026, the frontrunners are no longer just Bali and Chiang Mai. Tbilisi, Georgia has emerged as the dark horse: Georgian visas are free for most nationalities for up to a year, co-working spaces line Rustaveli Avenue, and a flat-white costs less than a dollar. The city blends Soviet architecture with craft-coffee culture in a way that is genuinely difficult to explain until you've walked its cobblestone streets at dusk.",
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Lisbon remains the gold standard for European nomads — and for good reason. The Portugal Digital Nomad Visa (D8) gives remote workers the legal right to stay for up to two years, with a relatively low income threshold. The city's 300 days of sunshine, Atlantic surf scene, and the best custard tarts on the planet are simply a bonus. The key is to avoid the Alfama tourist bubble and head straight to Mouraria or Campo de Ourique, where cafés double as offices and locals still outnumber Instagram photographers.",
          image: "https://images.unsplash.com/photo-1513735492246-483525079686?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "For Asia-Pacific nomads, Chiang Mai's digital infrastructure is now world-class. The CAMP café at the Maya Mall offers unlimited coffee and stable fibre internet — practically a rite of passage. But the real gem in 2026 is Hội An, Vietnam. The ancient town's internet speeds rival Singapore, monthly co-working memberships cost under $80, and you can rent a bicycle and be cycling through rice fields in seven minutes. The only challenge is convincing yourself to close the laptop.",
          image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Wherever you set up your laptop, the golden rule of nomad life is still the same: plan your move before the masses catch on. Medellín's 'El Poblado' neighbourhood went from hidden gem to overpriced tourist hub in under three years. The cities winning in 2026 are those with solid visa frameworks, a real local tech scene, and at least one great taco-equivalent within walking distance of your desk. Rovago's AI can help you find them before the next wave of listicles does.",
          image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "thailand-travel-guide-2026": {
      title: "Thailand Travel Guide 2026: Bangkok, Beaches & Beyond",
      date: "March 30, 2026",
      readTime: "9 min read",
      author: "Rovago Team",
      category: "Destinations",
      heroImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Bangkok is the greatest city on earth for eating on a budget. Start your mornings at Khlong Toei Market — the city's biggest wet market — where grilled pork skewers and jok (rice porridge) cost less than a dollar. Then take the BTS Skytrain to Silom for lunch, and end up at the Chinatown street stalls on Yaowarat Road after dark, where the charcoal-grilled seafood and neon signs make for an unbeatable sensory experience. Rule one of Bangkok: never eat at a restaurant without a queue of locals outside it.",
          image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The temple circuit in Bangkok can be done in a single focused day if you plan the route by geography. Start at Wat Pho (the Reclining Buddha) at 8 AM before the tour groups arrive, walk to the Grand Palace next door, then cross the Chao Phraya river by ferry to Wat Arun. Crucially, wear long trousers and cover your shoulders — you will be turned away otherwise. The dress code isn't a tourist trap; it's genuine respect for places that millions of Thais still pray at every single day.",
          image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "For the islands: Koh Lanta is the answer to the question 'where do I go instead of Koh Samui?' Long Beach offers calm water, cheap bungalows, and a sunset that hits different when you've spent three hours on a slow ferry to get there. Koh Tao is still the best place in the world to get a PADI Open Water certification — roughly $250 for three days, including accommodation. And if you want empty beaches, take the night bus to Trang and hop a longtail to Koh Kradan.",
          image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The most underrated destination in Thailand is Chiang Rai, not Chiang Mai. The White Temple (Wat Rong Khun) is genuinely unlike anything else on earth — a dazzling white and mirrored Buddhist temple still being built by a single artist. The surrounding Golden Triangle area, where Thailand, Laos, and Myanmar converge at the Mekong River, offers boat trips and hilltribe village treks that feel completely removed from the backpacker trail. Fly into Chiang Rai directly from Bangkok for under $30 if you book two weeks ahead.",
          image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "bali-complete-guide": {
      title: "Bali Complete Guide: Best Areas, Budget & Hidden Temples",
      date: "March 27, 2026",
      readTime: "8 min read",
      author: "Rovago Team",
      category: "Destinations",
      heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Ubud is Bali's creative heart, and no trip is complete without at least two nights here. But skip the famous Monkey Forest if the idea of having sunglasses snatched off your face doesn't appeal, and head instead to the Campuhan Ridge Walk at sunrise — a 45-minute trail through green jungle, completely free, with almost no one on it before 7 AM. Ubud's morning market on Jalan Raya Ubud is the real deal until about 9 AM, when the tourist stalls take over; show up early for nasi campur and fresh papaya.",
          image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The temple you've actually come to Bali to see is Pura Luhur Uluwatu, perched 70 metres above the Indian Ocean on a clifftop in the Bukit Peninsula. The Kecak fire dance at sunset here is one of the most extraordinary performances in Southeast Asia — book tickets in advance (about $15) and arrive 30 minutes early for the cliff-edge seats. Tanah Lot, while photogenic, is primarily a tourist infrastructure exercise. Uluwatu, despite the mischievous temple monkeys, still carries genuine spiritual weight.",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "For surf: Canggu is now crowded but the waves at Echo Beach are still reliable for intermediate surfers. The real find is Balian Beach on the west coast — a black-sand river mouth break with almost no tourists, great warung food, and guesthouses for $20 a night. Amed on the northeast coast is for snorkellers and free-divers: the USAT Liberty shipwreck at Tulamben is a 30-minute walk from shore and descends to just 28 metres, making it one of the most accessible wreck dives in the world.",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Budget reality check for Bali in 2026: you can live very well on $60 a day (decent guesthouse, three meals, a scooter rental) or spend $300 a day in a Seminyak villa without trying hard. The sweet spot for most travellers is a base in Ubud or Canggu, a rented scooter (around $7/day — get an international licence first), and a strict rule about never eating anywhere with laminated picture menus. The Tegallalang rice terraces are beautiful, but the ones around Jatiluwih to the west are a UNESCO site, far larger, and blissfully quiet.",
          image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "morocco-7-day-itinerary": {
      title: "Morocco in 7 Days: From Marrakech Medina to Sahara Dunes",
      date: "March 24, 2026",
      readTime: "10 min read",
      author: "Rovago Team",
      category: "Itinerary",
      heroImage: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Days 1–2: Marrakech. Land at Menara Airport, take a petit taxi to your riad in the medina (insist on the meter or agree a price before you get in — 80 MAD is fair from the airport). Spend your first morning getting genuinely lost in the souks north of Djemaa el-Fna: the spice market on Rue Rahba Kedima, the leather tanneries of Chouara (viewed from the surrounding terrace shops), and the dyers' souk off Souk Semmarine. In the evening, join the theatre of Djemaa el-Fna itself — snake charmers, storytellers, and the legendary food stalls that appear after dark.",
          image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Days 3–4: The Atlas Mountains & Aït Benhaddou. Hire a shared grand taxi from Bab Doukkala to Imlil village (2.5 hours, roughly $15 each). From Imlil you can hire a local guide for a half-day walk to the Berber village of Aroumd, with views of Jebel Toubkal — North Africa's highest peak at 4,167m. Then drive the dramatic Tizi n'Tichka pass (2,260m) to reach Aït Benhaddou, a UNESCO-listed fortified ksar that has served as a film set for everything from Game of Thrones to Gladiator. Stay in the village at a family-run kasbah.",
          image: "https://images.unsplash.com/photo-1553603227-2358aabe8e15?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "Days 5–6: Sahara Desert, Merzouga. The drive to Merzouga via Ouarzazate takes around 5 hours through the Draa Valley — one of the most spectacular roads in Africa, lined with date palms, crumbling kasbahs, and the occasional dromedary. Arrive in time to ride camels into the Erg Chebbi dunes for sunset. Spend the night in a desert camp: a proper one will have individual Berber-style tents, a tajine dinner, and Gnawa musicians around a fire. Wake at 4:30 AM and climb the nearest dune alone to watch the Sahara at dawn — nothing prepares you for that silence.",
          image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Day 7: Fès (or fly home from Marrakech). If time allows, take the CTM bus north to Fès — Morocco's oldest imperial city and arguably its most overwhelming. The medina (Fes el-Bali) is a UNESCO World Heritage Site and the world's largest car-free urban zone. Hire a local guide from the official Bureau des Guides near Bab Bou Jeloud (about 250 MAD for 3 hours): the medina's 9,000 alleys are genuinely navigable only with a local. Finish at the Al-Qarawiyyin Library — founded in 859 AD, it's the world's oldest continuously operating university.",
          image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "budget-travel-europe-2026": {
      title: "Backpacking Europe in 2026: The Complete Budget Guide",
      date: "March 20, 2026",
      readTime: "11 min read",
      author: "Rovago Team",
      category: "Budget Travel",
      heroImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "The golden rule of budget Europe: move east. While a night in Paris or Amsterdam will reliably cost $100+ for a hostel dorm and a basic meal, cities like Kraków, Ljubljana, Sofia, and Porto offer equivalent experiences for a third of the price. In Kraków's Kazimierz district, you can eat pierogi and drink craft beer for under $15. The architecture is just as beautiful, the culture is just as deep, and the Instagram shots are arguably better. The Interrail Global Pass remains the single best investment for multi-country European travel.",
          image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Accommodation strategy: the best hostel booking sites (Hostelworld, Booking.com) will show you dorms for $15–25 a night in most of Eastern Europe. But the real hack is Couchsurfing — not just for free accommodation, but because it connects you with locals who will genuinely show you their city. If you prefer privacy, look for aparthotels rather than hotels: studios in Lisbon or Budapest that cost less than a hostel dorm. Always read reviews dated within the last 60 days; hostels can change dramatically between ownership changes.",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "The cheapest way to move between cities is almost always FlixBus or BlaBlaCar. A FlixBus from Prague to Vienna takes 4.5 hours and can cost under $10 if booked 3+ weeks ahead. Ryanair and Wizz Air dominate budget aviation in Europe — set a price alert for your dates and book the moment prices drop below €30. The Eurail pass is worth it if you're doing 8+ long-distance trains; for shorter routes, point-to-point tickets are usually cheaper. Night trains are experiencing a renaissance and save you a night's accommodation cost.",
          image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The cities worth spending an extra day in that most 10-day itineraries skip: Ghent (Belgium's answer to Bruges without the tourist prices), Kotor (a medieval walled city on a fjord in Montenegro), Split (Croatia without the Dubrovnik price tag), and Plovdiv (Bulgaria's bohemian second city, where the Old Town is entirely free to explore). Europe rewards the traveller who ignores the top-10 lists. The continent's best experiences are almost always in its second cities — and they're usually 40% cheaper.",
          image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "solo-female-travel-tips": {
      title: "Solo Female Travel: Safest Destinations & Practical Tips for 2026",
      date: "March 17, 2026",
      readTime: "8 min read",
      author: "Rovago Team",
      category: "Solo Travel",
      heroImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "The consistently highest-ranked destinations for solo female travellers in 2026 are Iceland, Japan, New Zealand, Portugal, and Taiwan. What they share: reliable public transport, low violent crime rates, a culture of leaving others alone in public, and strong infrastructure for solo dining and travel. Japan in particular is extraordinary for solo women: there are women-only train carriages in major cities, a deep culture of personal space, and the practical ability to walk anywhere at 2 AM without a second thought. It's also one of the world's great solo-dining cultures — counter seating at ramen bars is designed for exactly this.",
          image: "https://images.unsplash.com/photo-1493225255440-4a2a86392d13?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Practical safety toolkit: share your daily itinerary with a trusted contact before leaving your accommodation. Use Google Maps offline mode — download the map of your city before you arrive, so navigation works without data. The Noonlight app (US-focused) and bSafe (global) have a discreet emergency button that alerts contacts with your GPS location. Trust your instincts completely: if a situation feels wrong, leave it immediately without apology. The solo travel community on Reddit (r/solotravel) is also an exceptional real-time resource for current conditions in specific destinations.",
          image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "The accommodation choices that consistently get the best reviews from solo female travellers are female-only hostel dorms (widely available in Southeast Asia and Europe), boutique guesthouses in the centre of town rather than the airport area, and any property with 24-hour reception. Read the 'solo traveller' tag on Tripadvisor reviews specifically — other women will flag issues that mixed-gender reviews miss. Airbnb with Superhosts and 50+ reviews in the previous year is generally safe; always check the cancellation policy before booking.",
          image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The most important thing no one tells you about solo female travel: the loneliness is real for the first 48 hours, and then something shifts. Free walking tours (tip-based, available in virtually every city) are the single best way to meet other travellers on day one. Doing a cooking class, a language exchange, or a day hike from a hostel also creates instant connections. Solo travel is the fastest way to understand what you're actually capable of — and the vast majority of women who try it once spend the rest of their lives planning the next trip.",
          image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "southeast-asia-budget-guide": {
      title: "Southeast Asia on a Budget: Vietnam, Thailand & Cambodia",
      date: "March 14, 2026",
      readTime: "9 min read",
      author: "Rovago Team",
      category: "Budget Travel",
      heroImage: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Vietnam is the most underrated value-for-money destination on the planet right now. A bowl of pho in Hanoi's Old Quarter costs 30,000 VND (about $1.20). A comfortable air-conditioned sleeper bus from Hanoi to Hội An costs under $25. A beach bungalow in Phú Quốc with air conditioning and a sea view runs $25–40 a night. The country is long and thin, so the classic north-to-south route (or reverse) gives you mountains in Sapa, colonial architecture in Hội An, and white-sand beaches in the south — all distinctly different, all extraordinary.",
          image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Cambodia is one of the few places on earth where the headline attraction — Angkor Wat — genuinely exceeds expectations. The temple complex covers 400 square kilometres; most tourists spend four hours on a tuk-tuk tour and leave. The correct move is to hire a bicycle ($3/day), buy a three-day pass ($62), and spend the mornings at the quieter outer temples — Banteay Srei, Preah Khan, Ta Som — before the tour buses arrive. Stay in Siem Reap's Old Market area for easy access, and eat at the night market rather than the tourist restaurants on Pub Street.",
          image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "The Thailand section of your Southeast Asia trip should include at least one experience outside Bangkok and the southern islands. Pai, a small mountain town in Mae Hong Son Province, is a 3-hour minibus journey from Chiang Mai through 762 mountain curves — bring motion sickness tablets. The reward is a small, genuinely chilled town with hot springs, rice fields, a waterfall you can swim in, and a night market where a full meal costs $3. Rent a scooter and spend two days exploring the hills. The tourist infrastructure is there but hasn't overwhelmed the atmosphere.",
          image: "https://images.unsplash.com/photo-1512553688687-30504d46f9fc?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Logistics across the three countries: the overland crossing between Vietnam and Cambodia via Moc Bai is straightforward (bus from Ho Chi Minh City to Phnom Penh, about $12). The Cambodia–Thailand crossing via Poipet/Aranyaprathet is busier and involves a tuk-tuk or taxi to the Thai border. Get e-visas in advance for Vietnam and Cambodia to avoid the land border queues. The most important item in your bag: a physical power bank and universal adapter. Southeast Asia's street-food culture means you will be constantly on the move, and a dead phone is a real inconvenience.",
          image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "dubai-travel-guide": {
      title: "Dubai Travel Guide: Skyscrapers, Souks & Desert Safaris",
      date: "March 10, 2026",
      readTime: "7 min read",
      author: "Rovago Team",
      category: "City Guide",
      heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "The Burj Khalifa observation deck on Level 124 is, objectively, a remarkable engineering achievement — but the queue at sunset costs $50 and takes 90 minutes. The better move is to book a table at At.mosphere (Level 122) for coffee in the afternoon: it counts as a venue visit, the views are identical, and you'll be seated with a drink rather than standing in a crowd. At the ground level, the Dubai Fountain — the world's largest choreographed fountain — runs free shows every 30 minutes after 6 PM. Stand on the Souk Al Bahar bridge for the best angle.",
          image: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Old Dubai — the Deira and Bur Dubai side of the Creek — is the city most visitors miss entirely. The Gold Souk and Spice Souk in Deira are operating traditional markets where serious business is conducted; don't be afraid to engage with vendors, but know the market rate before you bargain. Cross the Creek by abra (traditional wooden boat) for 1 AED — arguably the best value tourist experience in the Gulf. The Dubai Museum in Al Fahidi fort covers the city's transformation from a pearl-diving fishing village to a global megalopolis in under 60 years.",
          image: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "A desert safari is the non-negotiable Dubai experience for anyone who isn't returning for a second visit. The standard 4-hour evening safari (dune-bashing in a 4WD, camel riding, sandboarding, BBQ dinner in a Bedouin camp) runs around $70 per person from most operators. Book through Klook or Viator rather than your hotel's concierge — the same operators, a fraction of the markup. For a premium experience, a sunrise hot-air balloon over the desert with a Champagne breakfast costs around $300 and is worth every cent if you have the budget.",
          image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Practical Dubai: the metro is air-conditioned, cheap (under $3 for most journeys), and connects almost every tourist site. Taxis are metered and honest. Alcohol is only served in licensed hotel bars and restaurants — it's available, but plan accordingly if drinking is part of your trip. Dress modestly outside of beach areas and hotels; this isn't just a rule, it's genuine local etiquette. Ramadan changes the city significantly — restaurants close during daylight, the atmosphere shifts — plan around it or lean into it. The best time to visit temperature-wise is November to March.",
          image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "greece-island-hopping": {
      title: "Greece Island Hopping Guide: Santorini, Crete & the Hidden Aegean",
      date: "March 7, 2026",
      readTime: "10 min read",
      author: "Rovago Team",
      category: "Destinations",
      heroImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "The Santorini sunset debate is settled: Oia is beautiful but it's also standing-room-only after 6 PM in high season. The actual best sunset in Santorini is from the rim of the caldera above Imerovigli — fewer crowds, the same volcanic cliffs and darkening Aegean, and you're 15 minutes from a taverna that will serve you grilled octopus without the Oia markup. Stay in Fira or Firostefani rather than Oia to save 40% on accommodation costs. The cable car from the old port costs €6; the donkeys cost more and are controversial — take the cable car.",
          image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Crete is the most underrated of the major Greek islands. It's large enough to require a rental car (€25–35/day), and that car will take you to Balos Lagoon (one of Europe's most stunning beaches, reachable by boat or a 2km hike), the Samaria Gorge (a 16km hike through Europe's longest gorge, finishing at the Libyan Sea), and the Minoan palace of Knossos (3,500 years old, genuinely prehistoric in scale). The south coast — Plakias, Paleochora — receives almost no package tourism and has the warmest swimming of any Greek coast.",
          image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "The islands most travellers should add instead of removing: Milos (volcanic rock formations, electric-blue caves, and the original Venus de Milo was found here), Naxos (the largest Cycladic island — cheapest accommodation, best beaches, marble mountains, and ancient marble doorways called portaras), and Symi (a tiny Dodecanese island near Rhodes where the harbour is lined with pastel-painted neoclassical mansions and there is no beach club in sight). All three are easily connected by ferry from Athens' Piraeus port.",
          image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "Ferry logistics are the key to unlocking Greece's island network. The Hellenic Seaways and Blue Star Ferries run year-round connections from Piraeus to the major islands; in summer, add Seajets and Fast Ferries for high-speed catamarans. Book at least 2 weeks ahead for high season (July–August) or for overnight ferries with cabin accommodation. The ferry booking site Ferryhopper aggregates all operators and is the cleanest interface for multi-island routing. One non-negotiable rule: always check the ferry timetable before committing to an itinerary — island connections can be surprisingly infrequent in shoulder season.",
          image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "ai-travel-planning-guide": {
      title: "How AI Travel Planning Actually Works — And Why It Changes Everything",
      date: "April 12, 2026",
      readTime: "6 min read",
      author: "Rovago Team",
      category: "Travel Tech",
      heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Until very recently, planning a two-week trip to Japan meant either paying a travel agent $500 to produce a generic itinerary, or spending 40 hours on TripAdvisor tabs, blog posts, and forum threads, trying to reconcile conflicting advice and manually plot the most efficient route between 60 places you'd like to see. AI travel planning replaces that second option not by cutting corners, but by processing an effectively unlimited amount of destination-specific knowledge and synthesising it into a personalised, logistically coherent plan in under 60 seconds.",
          image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The key difference between a good AI travel itinerary and a bad one is specificity. Generic AI will tell you to 'visit a temple' or 'try local food'. A well-trained travel AI — like Rovago — names the specific temple, tells you it closes during Friday prayers, gives you the address, tells you the cheapest way to get there, and suggests the street food vendor three alleys away that has been open since 1987. That level of specificity comes from training data that includes not just travel blogs, but booking data, transport schedules, and granular local knowledge.",
          image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        },
        {
          text: "The geographic routing problem is where AI genuinely outperforms human planners. A human itinerary-maker might group activities by category — all the museums on day three, all the beaches on day four — without realising that two of the museums are on opposite sides of the city and three of the beaches are in the same bay. An AI trained on mapping data will always route activities by proximity within each day: everything you do on Tuesday will be within walking distance of each other, in the order that minimises total travel time.",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=900&auto=format&fit=crop",
          layout: "text-left"
        },
        {
          text: "The future of AI travel planning is live data integration: real-time flight prices, hotel availability, local event calendars, and even weather patterns feeding directly into the itinerary generation. Rovago is already connected to live flight pricing via Travelpayouts and hotel search via Expedia, meaning the plan you generate today is priced against today's actual market. The question isn't whether AI will replace human travel expertise — it's whether human travel expertise, in its current form, offers enough value to survive the next five years.",
          image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=900&auto=format&fit=crop",
          layout: "image-left"
        }
      ]
    },
    "mykonos-experience": {
      title: "Chasing Sunsets in Mykonos: An AI-Planned Adventure",
      date: "April 2, 2026",
      readTime: "5 min read",
      author: "Rovago Team",
      category: "Experience",
      heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
      sections: [
        {
          text: "Stepping onto the white-washed streets of Mykonos town, I felt that familiar mix of excitement and overwhelm. The town is a literal labyrinth. Luckily, our Rovago-planned route had our boutique hotel sorted right at the quiet edge of the old town. Pro-tip: Don't bother with a rental car if you're staying in Chora; the winding alleys are strictly for walking, and the local buses are surprisingly reliable for reaching the southern beaches.",
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
    author: "Rovago Team",
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
             <h2 className="text-4xl md:text-6xl font-serif italic text-foreground/20">Curating New Stories...</h2>
             <p className="text-foreground/40 text-lg max-w-lg mx-auto">Our AI explorers are currently on the ground, gathering insights and capturing moments to bring you the best travel tips.</p>
             <Link href="/blog" className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-terracotta text-white font-medium hover:scale-105 transition-transform">Return to Blog</Link>
          </div>
        )}
      </article>

      {/* Social interaction section */}
      <footer className="max-w-4xl mx-auto px-6 border-t border-glass-border pt-20 text-center">
        <p className="text-xs text-foreground/30 mb-10 font-bold uppercase tracking-[0.4em]">Fin • Exploring with Rovago</p>
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
