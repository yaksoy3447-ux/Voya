import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const countryCode = searchParams.get('country'); // ISO 2-letter code e.g. "TR"

    if (!query || query.length < 2) return NextResponse.json({ predictions: [] });

    const url = `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(query)}&locale=en&types[]=city`;
    const response = await fetch(url);

    if (!response.ok) return NextResponse.json({ predictions: [] });

    const raw: any[] = await response.json();

    // Optional: filter by country if provided
    const filtered = countryCode
      ? raw.filter(item => item.country_code?.toUpperCase() === countryCode.toUpperCase())
      : raw;

    // Shape to match what HeroForm expects (same as Google Places format)
    const predictions = filtered.slice(0, 8).map(item => ({
      place_id: item.code,
      description: `${item.name}${item.country_name ? ', ' + item.country_name : ''}`,
      structured_formatting: {
        main_text: item.name,
      },
    }));

    return NextResponse.json({ predictions });
  } catch (error: any) {
    console.error("Places API error:", error);
    return NextResponse.json({ predictions: [], error: error.message }, { status: 500 });
  }
}
