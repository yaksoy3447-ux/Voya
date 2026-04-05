import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: [{ icon: string; description: string }];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.message || 'City not found' }, { status: res.status });
    }

    const data = await res.json();

    // Group readings by date, prefer noon reading for icon
    const dayMap: Record<string, { temps: number[]; icon: string; description: string }> = {};

    for (const item of data.list as ForecastItem[]) {
      const date = item.dt_txt.split(' ')[0];
      if (!dayMap[date]) {
        dayMap[date] = { temps: [], icon: item.weather[0].icon, description: item.weather[0].description };
      }
      dayMap[date].temps.push(item.main.temp);
      if (item.dt_txt.includes('12:00:00')) {
        dayMap[date].icon = item.weather[0].icon;
        dayMap[date].description = item.weather[0].description;
      }
    }

    const forecast = Object.entries(dayMap).slice(0, 7).map(([date, d]) => ({
      date,
      min: Math.round(Math.min(...d.temps)),
      max: Math.round(Math.max(...d.temps)),
      icon: d.icon,
      description: d.description,
    }));

    return NextResponse.json({ city: data.city.name, forecast });
  } catch (err) {
    console.error('Weather API error:', err);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
