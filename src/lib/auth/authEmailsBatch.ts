/**
 * Batch resolve auth emails (service_role RPC). Fail-soft → empty map.
 */

import type { SupabaseClient } from "@supabase/supabase-js"

export type AuthEmailRow = {
  userId: string
  email: string
  firstName: string
}

export async function getAuthEmailsBatch(
  admin: Pick<SupabaseClient, "rpc">,
  userIds: string[]
): Promise<Map<string, AuthEmailRow>> {
  const out = new Map<string, AuthEmailRow>()
  const ids = [...new Set(userIds.filter(Boolean))]
  if (ids.length === 0) return out

  try {
    const { data, error } = await admin.rpc(
      "get_auth_users_email_batch" as never,
      { p_ids: ids } as never
    )
    if (error || !data) return out
    const rows = Array.isArray(data) ? data : []
    for (const r of rows) {
      const userId = String((r as { user_id?: string }).user_id || "")
      const email = String((r as { email?: string }).email || "")
      if (!userId || !email) continue
      out.set(userId, {
        userId,
        email,
        firstName: String(
          (r as { raw_first_name?: string }).raw_first_name || ""
        ),
      })
    }
  } catch {
    /* RPC absent — caller may fallback */
  }
  return out
}
