"use client"

import { Music, Ticket, Tv2, CalendarDays } from 'lucide-react'

interface Props {
  city: string
  country?: string
}

export default function EventsSection({ city, country }: Props) {
  if (!city) return null

  const q = encodeURIComponent(city)
  const citySlug = city.toLowerCase().replace(/\s+/g, '-')
  const countrySlug = (country || 'worldwide').toLowerCase().replace(/\s+/g, '-')

  const events = [
    {
      icon: <Music size={20} className="text-pink-400" />,
      title: 'Concerts & Music',
      desc: 'Live shows, bands, DJ nights near you',
      platform: 'Songkick',
      href: `https://www.songkick.com/metro-areas/search?query=${q}`,
      cardClass: 'bg-pink-500/5 border-pink-500/20 hover:bg-pink-500/10 hover:border-pink-500/40',
      linkClass: 'text-pink-400',
    },
    {
      icon: <Ticket size={20} className="text-yellow-400" />,
      title: 'Sports & Games',
      desc: 'Matches, tournaments, races',
      platform: 'Ticketmaster',
      href: `https://www.ticketmaster.com/search?q=${q}`,
      cardClass: 'bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10 hover:border-yellow-500/40',
      linkClass: 'text-yellow-400',
    },
    {
      icon: <Tv2 size={20} className="text-purple-400" />,
      title: 'Shows & Nightlife',
      desc: 'Theater, cabaret, dinner shows',
      platform: 'Klook',
      href: `https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(city + ' show theater cabaret')}&marker=715711`,
      cardClass: 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40',
      linkClass: 'text-purple-400',
    },
    {
      icon: <CalendarDays size={20} className="text-green-400" />,
      title: 'Local Festivals',
      desc: 'Events, fairs, cultural happenings',
      platform: 'Eventbrite',
      href: `https://www.eventbrite.com/d/${countrySlug}/${citySlug}--events/`,
      cardClass: 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40',
      linkClass: 'text-green-400',
    },
  ]

  return (
    <div className="glass-card p-6 rounded-3xl border border-glass-border print:hidden">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold text-foreground/30 uppercase tracking-[0.3em]">
          Events &amp; Shows in {city}
        </p>
        <a
          href={`https://www.viator.com/search/${city.replace(/ /g, '+')}+events+shows/?pid=P00121703&mcid=42383&medium=link`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-all"
        >
          Browse Viator →
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {events.map(e => (
          <a
            key={e.title}
            href={e.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group p-4 border rounded-2xl transition-all ${e.cardClass}`}
          >
            <div className="mb-3">{e.icon}</div>
            <p className="text-sm font-bold text-foreground leading-tight mb-1">{e.title}</p>
            <p className="text-xs text-foreground/50 leading-snug mb-3">{e.desc}</p>
            <span className={`text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-block ${e.linkClass}`}>
              {e.platform} →
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
