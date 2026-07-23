import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use the Publishable Key (Anon Key) here.
  // It is safe to use in the browser client as long as Row Level Security (RLS) is enabled in Supabase.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
