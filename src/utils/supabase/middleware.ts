import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from '@/lib/config/supabase'
import {
  canAccessOpsConsole,
  OPS_CONSOLE_PATH,
  resolveAuthEmail,
  sanitizeNextPath,
} from '@/lib/admin/consolePath'
import {
  ONBOARDING_GATE_SELECT,
  profileNeedsOnboarding,
} from '@/lib/auth/onboardingGate'

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
  '/coffre-premium',
  '/rapport',
  '/alliance',
  '/couple/espace',
  '/couple/onboarding',
  '/couple/inviter',
  '/couple/questionnaire',
  '/couple/attente',
  '/couple/resultats',
  '/couple/rapport',
  '/couple/exercices',
  '/couple/plan',
  '/couple/telecharger',
  '/couple/confirmation',
  '/couple/checkout',
]

/** Aperçus démo Couple — accessibles sans compte. */
const PUBLIC_EXCEPTIONS = ['/couple/rapport/demo']

const ADMIN_PREFIXES = [OPS_CONSOLE_PATH, '/moderation']

/** API surface fermée : seules ces routes existent côté public réseau. */
const ALLOWED_API_PREFIXES = [
  '/api/payments/bictorys/notify',
  '/api/payments/moneroo/notify',
  '/api/cron/subscription-reminders',
  '/api/cron/abandoned-payments',
  '/api/cron/email-outbox',
  '/api/cron/profile-reminders',
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

  // Canonique www : sinon le code_verifier PKCE est perdu entre apex et www
  const incomingHost = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    ''
  ).split(':')[0]
  if (incomingHost === 'keliaa.org') {
    return NextResponse.redirect(
      `https://www.keliaa.org${pathname}${search}`,
      308
    )
  }

  // Ne pas toucher aux cookies PKCE pendant l’échange OAuth
  if (
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/auth/finish') ||
    pathname.startsWith('/auth/logout')
  ) {
    return supabaseResponse
  }

  const hostBare = incomingHost
  const authCookieDomain =
    hostBare === 'keliaa.org' || hostBare.endsWith('.keliaa.org')
      ? '.keliaa.org'
      : undefined

  const supabase = createServerClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
    {
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure:
          process.env.VERCEL_ENV === 'production' ||
          process.env.NODE_ENV === 'production',
        ...(authCookieDomain ? { domain: authCookieDomain } : {}),
      },
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
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure:
                process.env.VERCEL_ENV === 'production' ||
                process.env.NODE_ENV === 'production',
              ...(authCookieDomain ? { domain: authCookieDomain } : {}),
            })
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
  const isProtected =
    matchesPrefix(pathname, PROTECTED_PREFIXES) &&
    !matchesPrefix(pathname, PUBLIC_EXCEPTIONS)
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

  // Console ops : staff only. Accès refusé → page « Accès réservé » (pas de 404).
  if (user && isOpsConsole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!canAccessOpsConsole({ role: profile?.role, email })) {
      return redirectWithCookies('/admin')
    }
    return supabaseResponse
  }

  // Déjà connecté sur /login|/register : rediriger vers ops SEULEMENT si staff.
  if (user && isAuthRoute && !isResetPassword) {
    const { data: profile } = await supabase
      .from('profiles')
      .select(`${ONBOARDING_GATE_SELECT}, role`)
      .eq('user_id', user.id)
      .maybeSingle()

    const nextParam = sanitizeNextPath(
      request.nextUrl.searchParams.get('next')
    )
    const wantsOps =
      !!nextParam &&
      (nextParam === OPS_CONSOLE_PATH ||
        nextParam.startsWith(`${OPS_CONSOLE_PATH}/`))
    const isStaff = canAccessOpsConsole({
      role: profile?.role,
      email,
    })

    if (isStaff && (wantsOps || !nextParam)) {
      return redirectWithCookies(OPS_CONSOLE_PATH)
    }

    // Membre déjà loggé qui demande la console → page claire, pas de boucle 404
    if (wantsOps && !isStaff) {
      return redirectWithCookies('/admin')
    }

    // Essentiels manquants → toujours onboarding (ignore next=/dashboard)
    if (profileNeedsOnboarding(profile)) {
      return redirectWithCookies('/onboarding')
    }

    if (nextParam && !wantsOps) {
      return redirectWithCookies(nextParam)
    }

    return redirectWithCookies('/dashboard')
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
      .select(`${ONBOARDING_GATE_SELECT}, role`)
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileNeedsOnboarding(profile) && !isAdminRoute) {
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
