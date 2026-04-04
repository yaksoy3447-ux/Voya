import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    // Viator API Key provided by user
    const apiKey = '32209672-87d5-40d2-90a6-ea2a3d3ce00f';

    // Step 1: Search for products in the location
    // Using Viator API v2 search/freetext for simplicity or search/products
    const response = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'exp-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filtering: {
            searchText: query
        },
        pagination: {
            start: 1,
            count: 6
        },
        currency: 'USD'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Viator API Error:', errorText);
      return NextResponse.json({ products: [] });
    }

    const data = await response.json();
    
    // Map Viator products to a simplified format for our frontend
    const products = (data.products || []).map((p: any) => ({
      id: p.productCode,
      title: p.title,
      description: p.description,
      image: p.images?.[0]?.variants?.find((v: any) => v.width > 400)?.url || p.images?.[0]?.variants?.[0]?.url,
      price: p.pricing?.summary?.fromPrice,
      rating: p.reviews?.combinedAverageRating,
      reviewCount: p.reviews?.totalReviews,
      url: p.productUrl, // This usually contains the affiliate track if configured in Viator dashboard
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Viator Proxy Error:', error);
    return NextResponse.json({ products: [], error: error.message }, { status: 500 });
  }
}
