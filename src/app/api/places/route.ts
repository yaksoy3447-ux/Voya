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
    
    // Use the NEW Places API (v1) — Autocomplete endpoint
    const requestBody: any = {
      input: query,
      // Broaden types to include both localities and administrative areas
      includedPrimaryTypes: ["locality", "administrative_area_level_1", "administrative_area_level_2"], 
      languageCode: "en",
    };

    // Restrict to specific country if provided
    if (countryCode && countryCode.length === 2) {
      requestBody.includedRegionCodes = [countryCode.toUpperCase()];
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    // Transform the new API response to match our frontend's expected format
    const predictions = (data.suggestions || []).map((s: any) => ({
      place_id: s.placePrediction?.placeId || "",
      description: s.placePrediction?.text?.text || "",
      structured_formatting: {
        main_text: s.placePrediction?.structuredFormat?.mainText?.text || "",
        secondary_text: s.placePrediction?.structuredFormat?.secondaryText?.text || "",
      },
    }));

    return NextResponse.json({ predictions });
  } catch (error: any) {
    console.error("Google Places Error:", error);
    return NextResponse.json({ predictions: [], error: error.message }, { status: 500 });
  }
}
