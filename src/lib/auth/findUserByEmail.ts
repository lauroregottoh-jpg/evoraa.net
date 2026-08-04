import { createAdminClient } from "@/utils/supabase/admin"

/**
 * Resolve auth.users id by email without listUsers pagination
 * (soft-launch previously capped at ~4k users).
 */
export async function findAuthUserIdByEmail(
  email: string
): Promise<{ id: string | null; error?: string }> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return { id: null, error: "Email manquant." }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc("get_auth_user_id_by_email" as never, {
      p_email: normalized,
    } as never)

    if (error) {
      console.error("[auth-lookup]", error.message)
      return { id: null, error: error.message }
    }

    if (typeof data === "string" && data.length > 0) {
      return { id: data }
    }
    return { id: null }
  } catch (e) {
    return {
      id: null,
      error: e instanceof Error ? e.message : "Lookup email impossible.",
    }
  }
}
