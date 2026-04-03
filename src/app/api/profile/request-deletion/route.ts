import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tier, subscription_end_date')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    let scheduledDate: Date
    const now = new Date()

    if (profile.tier === 'Free') {
      // Free users: 15 days from now
      scheduledDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
    } else {
      // Paid users: until end of subscription (if end date exists, else 30 days)
      scheduledDate = profile.subscription_end_date 
        ? new Date(profile.subscription_end_date) 
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        scheduled_deletion_date: scheduledDate.toISOString(),
        deletion_requested_at: now.toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true, 
      scheduled_deletion_date: scheduledDate.toISOString() 
    })
  } catch (error: any) {
    console.error("Deletion Request Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
