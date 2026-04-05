import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Move SDK initialization inside to avoid build-time errors
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia' as any,
  });

  try {
    const { planId, billing } = await req.json();
    const isYearly = billing === 'yearly';

    let monthlyAmount = 0;
    let name = "";
    
    if (planId === 'explorer') {
      monthlyAmount = 15;
      name = "Explorer Plan";
    } else if (planId === 'nomad') {
      monthlyAmount = 29;
      name = "Nomad Plan";
    }

    // Yıllık fiyat = Aylık fiyat * 9
    const unitAmount = isYearly ? (monthlyAmount * 9 * 100) : (monthlyAmount * 100);
    const displayName = `${name} (${isYearly ? 'Yearly' : 'Monthly'})`;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: displayName,
              description: `Rovago AI ${displayName} Subscription`,
            },
            unit_amount: unitAmount,
            recurring: { interval: isYearly ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        userId: user.id,
        planId: planId.charAt(0).toUpperCase() + planId.slice(1),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rovago.app'}/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rovago.app'}/pricing?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
