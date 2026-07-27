import { createClient } from "@supabase/supabase-js"
import { resolveSupabaseUrl } from "@/lib/config/supabase"

/** Service-role client — server/cron only. Never import in client components. */
export function createAdminClient() {
  const url = resolveSupabaseUrl()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant")
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
