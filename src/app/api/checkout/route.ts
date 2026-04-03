import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { planId, billing } = await req.json();
    const isYearly = billing === 'yearly';

    // Map plan IDs to dynamic Stripe Recurring Price Objects for Testing
    // (In production, you'd use pre-created Stripe Price IDs instead)
    let amount = 0;
    let name = "";
    
    if (planId === 'explorer') {
      amount = isYearly ? 7900 : 1200;
      name = `Explorer Plan (${isYearly ? 'Yearly' : 'Monthly'})`;
    } else if (planId === 'nomad') {
      amount = isYearly ? 11900 : 1800;
      name = `Nomad Plan (${isYearly ? 'Yearly' : 'Monthly'})`;
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name,
              description: `Voya AI ${name} Subscription`
            },
            unit_amount: amount,
            recurring: { interval: isYearly ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        userId: user.id,
        planId: planId.charAt(0).toUpperCase() + planId.slice(1), // Capitalize (Explorer/Nomad)
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
