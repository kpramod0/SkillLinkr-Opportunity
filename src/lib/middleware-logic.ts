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
  
  // Public routes
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/api/v1/public') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/docs')
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
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // Should not happen if trigger works, but safe fallback
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = profile.role
  const status = profile.status

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
