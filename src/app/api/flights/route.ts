import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date'); // YYYY-MM-DD

  if (!origin || !destination || !date) {
    return NextResponse.json({ price: null, error: 'Missing params' }, { status: 400 });
  }

  const token = process.env.TRAVELPAYOUTS_API_TOKEN;
  if (!token) return NextResponse.json({ price: null, error: 'No API token' }, { status: 500 });

  const yearMonth = date.substring(0, 7); // YYYY-MM

  try {
    const url = `https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=${destination}&depart_date=${yearMonth}&token=${token}&currency=usd`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!data.success || !data.data) {
      return NextResponse.json({ price: null });
    }

    const destData = data.data[destination];
    if (!destData) return NextResponse.json({ price: null });

    // Find cheapest
    let cheapest: any = null;
    for (const key of Object.keys(destData)) {
      const flight = destData[key];
      if (!cheapest || flight.price < cheapest.price) {
        cheapest = { ...flight, transfers: Number(key) };
      }
    }

    return NextResponse.json({
      price: cheapest?.price ?? null,
      airline: cheapest?.airline ?? null,
      departure_at: cheapest?.departure_at ?? null,
      transfers: cheapest?.transfers ?? null,
    });
  } catch (err: any) {
    return NextResponse.json({ price: null, error: err.message }, { status: 500 });
  }
}
