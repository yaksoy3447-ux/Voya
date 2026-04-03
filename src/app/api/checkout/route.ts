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

    let priceId = "";
    
    if (planId === 'explorer') {
      priceId = isYearly ? process.env.STRIPE_EXPLORER_YEARLY_PRICE_ID as string : process.env.STRIPE_EXPLORER_MONTHLY_PRICE_ID as string;
    } else if (planId === 'nomad') {
      priceId = isYearly ? process.env.STRIPE_NOMAD_YEARLY_PRICE_ID as string : process.env.STRIPE_NOMAD_MONTHLY_PRICE_ID as string;
    }

    if (!priceId) {
       console.error("Missing Price ID for plan:", planId, billing);
       return NextResponse.json({ error: `Price configuration for ${planId} plan is missing.` }, { status: 400 });
    }

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
          price: priceId,
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
