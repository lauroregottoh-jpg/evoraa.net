import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from '@/lib/config/supabase'
import {
  canAccessOpsConsole,
  OPS_CONSOLE_PATH,
  resolveAuthEmail,
} from '@/lib/admin/consolePath'

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/onboarding',
  '/compatibility',
  '/messages',
  OPS_CONSOLE_PATH,
  '/moderation',
  '/checkout',
  '/assessments',
  '/academie-mariage',
  '/notifications',
  '/billing',
  '/help',
  '/feedback',
  '/inspiration',
  '/premium',
]

const ADMIN_PREFIXES = [OPS_CONSOLE_PATH, '/moderation']

/** API surface fermée : seules ces routes existent côté public réseau. */
const ALLOWED_API_PREFIXES = [
  '/api/payments/bictorys/notify',
  '/api/payments/cinetpay/notify',
  '/api/cron/subscription-reminders',
  '/api/cron/email-outbox',
  '/api/health/config',
]

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const { pathname, search } = request.nextUrl

  // Deny unknown /api/* early (nouveaux endpoints oubliés = 404 par défaut).
  if (pathname.startsWith('/api/')) {
    if (!matchesPrefix(pathname, ALLOWED_API_PREFIXES)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  }

  const supabase = createServerClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
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

  const email = resolveAuthEmail(user)

  // Showcase /design-system : pas public en production.
  if (
    process.env.NODE_ENV === 'production' &&
    (pathname === '/design-system' || pathname.startsWith('/design-system/'))
  ) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const isResetPassword =
    pathname === '/reset-password' || pathname.startsWith('/reset-password/')

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isProtected = matchesPrefix(pathname, PROTECTED_PREFIXES)
  const isOpsConsole =
    pathname === OPS_CONSOLE_PATH || pathname.startsWith(`${OPS_CONSOLE_PATH}/`)
  const isAdminRoute = matchesPrefix(pathname, ADMIN_PREFIXES)

  const redirectWithCookies = (path: string, keepNext = false) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    if (path === '/login') {
      url.search = `?next=${encodeURIComponent(pathname + search)}`
    } else if (!keepNext) {
      url.search = ''
    }
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  if (!user && isProtected) {
    return redirectWithCookies('/login')
  }

  // Console ops : staff only (sinon 404 pour ne pas révéler le chemin).
  if (user && isOpsConsole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!canAccessOpsConsole({ role: profile?.role, email })) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.search = ''
      const denied = NextResponse.rewrite(url)
      supabaseResponse.cookies.getAll().forEach((c) => {
        denied.cookies.set(c.name, c.value)
      })
      return denied
    }
    return supabaseResponse
  }

  if (user && isAuthRoute && !isResetPassword) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('completion_percentage, onboarding_status, role')
      .eq('user_id', user.id)
      .maybeSingle()

    const nextParam = request.nextUrl.searchParams.get('next') || ''
    if (
      nextParam.startsWith(OPS_CONSOLE_PATH) ||
      canAccessOpsConsole({ role: profile?.role, email })
    ) {
      // Admin principal / staff déjà loggé sur /login → console ops
      if (
        canAccessOpsConsole({ role: profile?.role, email }) &&
        (nextParam.startsWith(OPS_CONSOLE_PATH) || !nextParam)
      ) {
        return redirectWithCookies(OPS_CONSOLE_PATH)
      }
      if (nextParam.startsWith(OPS_CONSOLE_PATH)) {
        return redirectWithCookies(OPS_CONSOLE_PATH)
      }
    }

    const completion = profile?.completion_percentage ?? 0
    const status = profile?.onboarding_status
    const needsOnboarding =
      completion < 70 ||
      !status ||
      status === 'step1_account' ||
      status === 'step2_profile'

    return redirectWithCookies(needsOnboarding ? '/onboarding' : '/dashboard')
  }

  if (
    user &&
    isProtected &&
    pathname !== '/onboarding' &&
    !pathname.startsWith('/onboarding/') &&
    pathname !== '/settings' &&
    !pathname.startsWith('/settings/')
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('completion_percentage, onboarding_status, role')
      .eq('user_id', user.id)
      .maybeSingle()

    const completion = profile?.completion_percentage ?? 0
    const status = profile?.onboarding_status
    const needsOnboarding =
      completion < 70 ||
      !status ||
      status === 'step1_account' ||
      status === 'step2_profile'

    if (needsOnboarding && !isAdminRoute) {
      return redirectWithCookies('/onboarding')
    }
  }

  // /moderation uniquement : staff required
  if (
    user &&
    (pathname === '/moderation' || pathname.startsWith('/moderation/'))
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!canAccessOpsConsole({ role: profile?.role, email })) {
      return redirectWithCookies('/dashboard')
    }
  }

  return supabaseResponse
}
