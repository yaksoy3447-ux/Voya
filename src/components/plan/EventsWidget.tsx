"use client"

import { useEffect, useState } from 'react'
import { Ticket } from 'lucide-react'

interface TmEvent {
  id: string
  name: string
  url: string
  date: string | null
  time: string | null
  venue: string
  category: string
  genre: string
  minPrice: number | null
  image: string | null
}

function categoryEmoji(cat: string): string {
  switch (cat.toLowerCase()) {
    case 'music': return '🎵'
    case 'sports': return '⚽'
    case 'arts & theatre': return '🎭'
    case 'film': return '🎬'
    case 'family': return '🎠'
    default: return '🎪'
  }
}

interface Props {
  city: string
  startDate?: string
  endDate?: string
}

export default function EventsWidget({ city, startDate, endDate }: Props) {
  const [events, setEvents] = useState<TmEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!city) { setLoading(false); return }

    const params = new URLSearchParams({ city })
    if (startDate) params.set('start', startDate)
    if (endDate) params.set('end', endDate)

    fetch(`/api/events?${params}`)
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [city, startDate, endDate])

  if (!loading && events.length === 0) return null

  return (
    <div className="glass-card p-6 rounded-3xl border border-glass-border print:hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Ticket size={16} className="text-terracotta" />
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em]">
            Events in {city}
          </p>
        </div>
        <a
          href={`https://www.ticketmaster.com/search?q=${encodeURIComponent(city)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-foreground/30 hover:text-terracotta uppercase tracking-widest transition-all"
        >
          All Events →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {events.slice(0, 6).map(e => {
            const dateStr = e.date
              ? new Date(e.date + 'T12:00:00Z').toLocaleDateString('en', {
                  weekday: 'short', month: 'short', day: 'numeric',
                })
              : ''
            return (
              <a
                key={e.id}
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 bg-white/5 border border-glass-border rounded-2xl hover:border-terracotta/30 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl shrink-0 leading-none mt-0.5">
                  {categoryEmoji(e.category)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-snug line-clamp-1 group-hover:text-terracotta transition-colors">
                    {e.name}
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5 line-clamp-1">
                    {dateStr}{e.venue ? ` · ${e.venue}` : ''}
                  </p>
                  {e.minPrice != null && (
                    <p className="text-xs font-bold text-green-400 mt-1">from ${e.minPrice}</p>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
      <p className="text-[10px] text-foreground/20 mt-4 text-center">Powered by Ticketmaster</p>
    </div>
  )
}
