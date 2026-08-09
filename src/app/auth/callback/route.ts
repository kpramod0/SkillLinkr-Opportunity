import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { resolveOmsIdentity } from '@/lib/role-resolver'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const supabase = await createClient()
  let sessionData = null;

  if (code) {
    // Exchange auth code for session
    const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
    if (!authError) sessionData = data.session
  } else {
    // Check if session already exists (e.g., from signInWithPassword)
    const { data } = await supabase.auth.getSession()
    sessionData = data?.session
  }

  if (!sessionData?.user?.email) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
  }

  const email = sessionData.user.email

  try {
    // Determine the user's role and state using the Single Source of Truth
    const identity = await resolveOmsIdentity(email)

    switch (identity.role) {
      case 'super_admin':
      case 'admin':
        if (!identity.onboardingCompleted) {
          return NextResponse.redirect(new URL('/admin/onboarding', request.url))
        }
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))

      case 'ambassador':
        if (!identity.onboardingCompleted) {
          // Pass the invitationId in the query string or session, we'll fetch it on the page
          return NextResponse.redirect(new URL('/ambassador/onboarding', request.url))
        }
        return NextResponse.redirect(new URL('/ambassador/dashboard', request.url))

      case 'society':
      case 'society_candidate':
        if (!identity.onboardingCompleted) {
          return NextResponse.redirect(new URL('/society/onboarding', request.url))
        }
        return NextResponse.redirect(new URL('/society/dashboard', request.url))

      case 'denied':
      default:
        // Clear session and redirect to signup with error
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/signup?error=denied', request.url))
    }
  } catch (error) {
    console.error('Error in auth callback:', error)
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}
