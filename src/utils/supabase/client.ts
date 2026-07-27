import { createBrowserClient } from '@supabase/ssr'
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from '@/lib/config/supabase'

export function createClient() {
  return createBrowserClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey()
  )
}
