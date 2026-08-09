import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  // Public routes (including landing page)
  if (
    pathname === '/' ||
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/forgot-password') || 
    pathname.startsWith('/reset-password') || 
    pathname.startsWith('/auth/callback') || 
    pathname.startsWith('/api/v1/public') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/docs') ||
    pathname.startsWith('/api/seed-users') ||
    pathname.startsWith('/api/delete-corrupted')
  ) {
    return supabaseResponse
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Get user role from opp_users
  const { data: profile } = await supabase
    .from('opp_users')
    .select('role, status, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // If not in opp_users but logged in, they might be in the middle of onboarding.
    // Allow them to go to onboarding pages based on their email resolution, but usually
    // callback handles this. If they try to access protected routes, deny.
    if (pathname.startsWith('/admin/onboarding') || pathname.startsWith('/ambassador/onboarding') || pathname.startsWith('/society/onboarding')) {
      return supabaseResponse
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = profile.role
  const status = profile.status
  const onboardingCompleted = profile.onboarding_completed

  // Global onboarding check
  if (!onboardingCompleted) {
    // They are not onboarded. Ensure they are on their specific onboarding page.
    if (role === 'admin' || role === 'super_admin') {
      if (!pathname.startsWith('/admin/onboarding')) {
        return NextResponse.redirect(new URL('/admin/onboarding', request.url))
      }
    } else if (role === 'ambassador') {
      if (!pathname.startsWith('/ambassador/onboarding')) {
        return NextResponse.redirect(new URL('/ambassador/onboarding', request.url))
      }
    } else if (role === 'society') {
      if (!pathname.startsWith('/society/onboarding')) {
        return NextResponse.redirect(new URL('/society/onboarding', request.url))
      }
    }
    return supabaseResponse // Allow them on the onboarding page
  }

  // Role-based route protection
  if (pathname.startsWith('/admin')) {
    if (role !== 'super_admin' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (pathname.startsWith('/ambassador')) {
    if (role !== 'ambassador') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (status !== 'active') {
      return NextResponse.redirect(new URL('/pending-approval', request.url))
    }
  }

  if (pathname.startsWith('/society')) {
    if (role !== 'society') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (status !== 'active') {
      return NextResponse.redirect(new URL('/pending-approval', request.url))
    }
  }

  // API Route protection
  if (pathname.startsWith('/api/v1/admin')) {
    if (role !== 'super_admin' && role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  if (pathname.startsWith('/api/v1/ambassador')) {
    if (role !== 'ambassador' || status !== 'active') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  if (pathname.startsWith('/api/v1/society')) {
    if (role !== 'society' || status !== 'active') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return supabaseResponse
}
