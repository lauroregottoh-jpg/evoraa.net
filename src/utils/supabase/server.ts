import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from '@/lib/config/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
