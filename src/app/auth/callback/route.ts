import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Auth callback error:", exchangeError.message)
      return NextResponse.redirect(`${origin}/login?error=auth_failed&desc=${encodeURIComponent(exchangeError.message)}`)
    }
  }

  // If no code and no error, it might be implicit flow (hash fragment).
  // Redirect to login safely so the client-side can parse the hash in peace and redirect them.
  return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent(next)}`)
}
