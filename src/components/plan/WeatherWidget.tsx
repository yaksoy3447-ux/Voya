"use client"

import { useEffect, useState } from 'react'

interface ForecastDay {
  date: string
  min: number
  max: number
  description: string
  icon: string
}

function weatherEmoji(icon: string): string {
  const code = icon.slice(0, 2)
  switch (code) {
    case '01': return '☀️'
    case '02': return '⛅'
    case '03': return '☁️'
    case '04': return '☁️'
    case '09': return '🌧️'
    case '10': return '🌦️'
    case '11': return '⛈️'
    case '13': return '❄️'
    case '50': return '🌫️'
    default: return '🌤️'
  }
}

export default function WeatherWidget({ city }: { city: string }) {
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!city) return
    setLoading(true)
    setError(false)
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(r => r.json())
      .then(data => {
        if (data.forecast?.length) setForecast(data.forecast)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [city])

  if (!city || error) return null

  return (
    <div className="glass-card p-5 rounded-3xl border border-glass-border bg-sky-500/5">
      <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-4">
        Weather · {city}
      </p>
      {loading ? (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {forecast.map((day, i) => {
            const d = new Date(day.date + 'T12:00:00Z')
            const label = i === 0 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' })
            return (
              <div key={day.date} className="flex-none text-center px-3 py-2.5 bg-white/5 rounded-xl min-w-[56px]">
                <div className="text-[10px] text-foreground/50 font-medium mb-1">{label}</div>
                <div className="text-xl mb-1">{weatherEmoji(day.icon)}</div>
                <div className="text-xs font-bold text-foreground">{day.max}°</div>
                <div className="text-[10px] text-foreground/40">{day.min}°</div>
              </div>
            )
          })}
        </div>
      )}
      <p className="text-[10px] text-foreground/25 mt-3 leading-none">5-day forecast · OpenWeatherMap</p>
    </div>
  )
}
