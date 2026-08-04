import { createAdminClient } from "@/utils/supabase/admin"

/**
 * Resolve auth.users id by email without brittle listUsers pagination.
 * Fail soft: never throw — callers keep trying sign-in.
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

    if (!error && typeof data === "string" && data.length > 0) {
      return { id: data }
    }

    // Fallback : pagination Auth (jusqu’à ~10k) si RPC absente / KO
    for (let page = 1; page <= 50; page += 1) {
      const { data: listed, error: listError } = await admin.auth.admin.listUsers({
        page,
        perPage: 200,
      })
      if (listError) {
        return { id: null, error: listError.message }
      }
      const match = listed.users.find(
        (u) => u.email?.toLowerCase() === normalized
      )
      if (match?.id) return { id: match.id }
      if (listed.users.length < 200) break
    }
    return { id: null }
  } catch (e) {
    return {
      id: null,
      error: e instanceof Error ? e.message : "Lookup email impossible.",
    }
  }
}
