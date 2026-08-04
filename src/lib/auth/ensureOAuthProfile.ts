import type { User, SupabaseClient } from "@supabase/supabase-js"
import { createAdminClient } from "@/utils/supabase/admin"

function pickFirstName(user: User): string | null {
  const m = user.user_metadata || {}
  const raw =
    m.given_name ||
    m.first_name ||
    (typeof m.full_name === "string" ? m.full_name.split(/\s+/)[0] : null) ||
    (typeof m.name === "string" ? m.name.split(/\s+/)[0] : null) ||
    null
  if (!raw || typeof raw !== "string") return null
  const t = raw.trim()
  return t.length > 0 ? t.slice(0, 80) : null
}

/**
 * Best-effort profile seed after Google (or other OAuth) login.
 * Never throws — auth must stay unblocked.
 */
export async function ensureOAuthProfile(input: {
  user: User
  charterAccepted?: boolean
  supabase?: SupabaseClient
}): Promise<void> {
  const { user, charterAccepted } = input
  const firstName = pickFirstName(user)
  const referralCode = user.id.replace(/-/g, "").slice(0, 8)

  try {
    if (charterAccepted || firstName) {
      const metaPatch: Record<string, unknown> = {}
      if (charterAccepted) {
        metaPatch.charter_accepted = true
        metaPatch.charter_accepted_at = new Date().toISOString()
      }
      if (firstName && !user.user_metadata?.first_name) {
        metaPatch.first_name = firstName
      }
      if (Object.keys(metaPatch).length > 0 && input.supabase) {
        await input.supabase.auth.updateUser({ data: metaPatch })
      }
    }
  } catch (e) {
    console.error("[oauth] updateUser meta", e)
  }

  try {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, completion_percentage, onboarding_status")
      .eq("user_id", user.id)
      .maybeSingle()

    const patch: Record<string, unknown> = {
      email_verified: true,
      updated_at: new Date().toISOString(),
    }

    if (firstName && !profile?.first_name) {
      patch.first_name = firstName
    }
    if (!profile?.onboarding_status) {
      patch.onboarding_status = "step1_account"
    }
    if (profile?.completion_percentage == null) {
      patch.completion_percentage = 5
    }
    if (!profile?.first_name && !(patch.first_name as string | undefined)) {
      /* keep empty — essentials step will ask */
    }
    patch.referral_code = referralCode

    await admin.from("profiles").update(patch).eq("user_id", user.id)
  } catch (e) {
    console.error("[oauth] ensure profile", e)
  }
}
