import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) return NextResponse.json({ predictions: [] });

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn("Missing Google Places API Key");
      return NextResponse.json({ predictions: [] });
    }

    const countryCode = searchParams.get('country');
    
    // Use the STABLE Legacy Places API (v0) — Autocomplete endpoint
    // This is 100% more reliable for most Google Cloud setups
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.append('input', query);
    url.searchParams.append('types', '(cities)');
    url.searchParams.append('language', 'en');
    url.searchParams.append('key', apiKey);

    // Restrict to specific country if provided
    if (countryCode && countryCode.length === 2) {
      url.searchParams.append('components', `country:${countryCode.toLowerCase()}`);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places API Error:', errorData);
      return NextResponse.json({ predictions: [] });
    }

    const data = await response.json();
    
    // Return the predictions directly (Legacy API returns { predictions: [...] })
    return NextResponse.json({ 
      predictions: data.predictions || [] 
    });
  } catch (error: any) {
    console.error("Google Places Error:", error);
    return NextResponse.json({ predictions: [], error: error.message }, { status: 500 });
  }
}
