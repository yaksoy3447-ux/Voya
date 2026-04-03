import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { planId } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This is a DEV-ONLY utility to help the user test plans without Stripe CLI
    // In a real production app, this endpoint should not exist or be heavily protected.
    const { error } = await supabase
      .from('profiles')
      .update({ tier: planId })
      .eq('id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, tier: planId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
