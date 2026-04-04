import { Metadata } from 'next'

const postMeta: Record<string, { title: string; description: string; image: string }> = {
  'ai-travel-planning-guide': {
    title: 'How AI Travel Planning Actually Works — And Why It Changes Everything',
    description: 'Discover how AI travel planning replaces 40 hours of research with a personalised, logistically coherent itinerary in under 60 seconds.',
    image: 'https://images.unsplash.com/photo-1488645953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
  },
  'digital-nomads-2026': {
    title: 'Best Cities for Digital Nomads in 2026: Where to Work & Live',
    description: 'The definitive guide to the best digital nomad cities in 2026 — from Tbilisi to Chiang Mai, ranked by visa, cost, internet, and community.',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=1200&auto=format&fit=crop',
  },
  'istanbul-local-tips': {
    title: "Exploring the Soul of Istanbul: A Local's Perspective",
    description: "Discover Istanbul's hidden neighbourhoods, best local food spots, and insider tips for navigating the Bosphorus city like a true local.",
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop',
  },
  'mykonos-experience': {
    title: 'Chasing Sunsets in Mykonos: An AI-Planned Adventure',
    description: 'From the windmills of Chora to hidden beaches — how AI planned the perfect Mykonos itinerary for a 5-day summer escape.',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
  },
  'thailand-travel-guide-2026': {
    title: 'Thailand Travel Guide 2026: Bangkok, Chiang Mai & the Islands',
    description: 'Everything you need to plan the perfect Thailand trip in 2026 — visas, transport, the best islands, and what to avoid.',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop',
  },
  'bali-complete-guide': {
    title: 'Bali Complete Guide 2026: Beyond the Tourist Trail',
    description: "The complete Bali travel guide — from Ubud's rice terraces to Seminyak's beach clubs and the hidden temples of the east.",
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop',
  },
  'morocco-7-day-itinerary': {
    title: 'Morocco in 7 Days: Marrakech, the Sahara & the Atlas Mountains',
    description: 'The perfect 7-day Morocco itinerary — Marrakech medina, Fes, Merzouga desert, and the mountain villages of the High Atlas.',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop',
  },
  'budget-travel-europe-2026': {
    title: 'Budget Travel Europe 2026: How to See the Continent for Less',
    description: 'How to travel Europe in 2026 on a tight budget — the best cheap cities, transport hacks, and accommodation strategies.',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
  },
  'hidden-gems-japan': {
    title: 'Hidden Gems of Japan: Beyond Tokyo and Kyoto',
    description: 'Discover the Japan that most tourists miss — from the backstreets of Kanazawa to the mountain villages of Shirakawa-go.',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1200&auto=format&fit=crop',
  },
  'solo-female-travel-tips': {
    title: 'Solo Female Travel: Safest Destinations & Practical Tips for 2026',
    description: 'The safest destinations for solo female travellers in 2026, plus a practical safety toolkit and accommodation guide.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
  },
  'southeast-asia-budget-guide': {
    title: 'Southeast Asia on a Budget: Vietnam, Thailand & Cambodia',
    description: 'How to travel Vietnam, Thailand and Cambodia on a budget — real costs, transport tips, and the experiences worth every cent.',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop',
  },
  'dubai-travel-guide': {
    title: 'Dubai Travel Guide: Skyscrapers, Souks & Desert Safaris',
    description: 'The complete Dubai travel guide — Burj Khalifa, old Dubai souks, desert safaris, and practical tips for first-time visitors.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
  },
  'greece-island-hopping': {
    title: 'Greece Island Hopping Guide: Santorini, Crete & the Hidden Aegean',
    description: 'The complete Greece island hopping guide — ferry logistics, the best islands beyond Santorini, and how to avoid the crowds.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = postMeta[slug]

  if (!post) {
    return { title: 'Travel Blog | Rovago' }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | Rovago`,
      description: post.description,
      type: 'article',
      url: `https://rovago.app/blog/${slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `https://rovago.app/blog/${slug}`,
    },
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
