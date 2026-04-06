import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/create'

  // If provider returned an error, forward it to the login page
  const providerError = searchParams.get('error')
  const providerErrorDesc = searchParams.get('error_description')
  if (providerError) {
    const desc = providerErrorDesc ? encodeURIComponent(providerErrorDesc) : ''
    return NextResponse.redirect(`${origin}/login?error=auth_failed&desc=${desc}`)
  }

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Ensure profile exists - upsert as a fallback in case the DB trigger failed
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          tier: 'Free',
          plan_count: 0,
        }, { onConflict: 'id', ignoreDuplicates: true })
      }

      // Successful - redirect to intended page
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl.toString())
    }

    console.error('Auth callback exchange error:', error.message)
    return NextResponse.redirect(
      `${origin}/login?error=auth_failed&desc=${encodeURIComponent(error.message)}`
    )
  }

  // No code present - redirect back to login
  return NextResponse.redirect(`${origin}/login`)
}
