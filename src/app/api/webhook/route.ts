import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planId } = session.metadata || {};

    if (userId && planId) {
      const supabase = await createClient();

      let subscriptionEndDate: string | null = null;
      if (session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
        } catch (err) {
          console.error("Failed to retrieve subscription:", err);
        }
      }

      const updatePayload: Record<string, string> = { tier: planId };
      if (subscriptionEndDate) updatePayload.subscription_end_date = subscriptionEndDate;

      // Update user tier and renewal date
      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

      if (error) {
        console.error("Supabase Update Error:", error);
        return NextResponse.json({ error: "Failed to update user tier" }, { status: 500 });
      }

      console.log(`User ${userId} upgraded to ${planId}`);
    }
  }

  return NextResponse.json({ received: true });
}
