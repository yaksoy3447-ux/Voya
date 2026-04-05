import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const startDate = searchParams.get('start'); // YYYY-MM-DD
  const endDate = searchParams.get('end');     // YYYY-MM-DD

  if (!city) return NextResponse.json({ events: [] });

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return NextResponse.json({ events: [] });

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      city,
      size: '8',
      sort: 'date,asc',
    });

    if (startDate) params.set('startDateTime', `${startDate}T00:00:00Z`);
    if (endDate) params.set('endDateTime', `${endDate}T23:59:59Z`);

    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return NextResponse.json({ events: [] });

    const data = await res.json();
    const raw: any[] = data._embedded?.events || [];

    const events = raw.map((e: any) => ({
      id: e.id,
      name: e.name,
      url: e.url,
      date: e.dates?.start?.localDate || null,
      time: e.dates?.start?.localTime || null,
      venue: e._embedded?.venues?.[0]?.name || '',
      category: e.classifications?.[0]?.segment?.name || 'Event',
      genre: e.classifications?.[0]?.genre?.name || '',
      minPrice: e.priceRanges?.[0]?.min ?? null,
      image:
        e.images?.find((img: any) => img.ratio === '16_9' && img.width >= 300)?.url ||
        e.images?.[0]?.url ||
        null,
    }));

    return NextResponse.json({ events });
  } catch (err) {
    console.error('Ticketmaster API error:', err);
    return NextResponse.json({ events: [] });
  }
}
