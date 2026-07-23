import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AUTH_ROUTES = ['/login', '/register']

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/onboarding',
  '/compatibility',
  '/messages',
  '/admin',
  '/moderation',
  '/checkout',
]

const ADMIN_PREFIXES = ['/admin', '/moderation']

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

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

  // IMPORTANT: keep getUser() immediately after createServerClient
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isProtected = matchesPrefix(pathname, PROTECTED_PREFIXES)
  const isAdminRoute = matchesPrefix(pathname, ADMIN_PREFIXES)

  const redirectWithCookies = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = path === '/login' ? `?next=${encodeURIComponent(pathname + search)}` : ''
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  if (!user && isProtected) {
    return redirectWithCookies('/login')
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('completion_percentage, onboarding_status')
      .eq('user_id', user.id)
      .maybeSingle()

    const completion = profile?.completion_percentage ?? 0
    const status = profile?.onboarding_status
    const needsOnboarding =
      completion < 70 ||
      !status ||
      status === 'step1_account' ||
      status === 'step2_profile'

    return redirectWithCookies(needsOnboarding ? '/onboarding' : '/dashboard')
  }

  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    const role = profile?.role
    if (role !== 'admin' && role !== 'moderator') {
      return redirectWithCookies('/dashboard')
    }
  }

  return supabaseResponse
}
