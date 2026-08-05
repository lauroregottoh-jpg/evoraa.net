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

function pickLastName(user: User): string | null {
  const m = user.user_metadata || {}
  if (typeof m.family_name === "string" && m.family_name.trim()) {
    return m.family_name.trim().slice(0, 80)
  }
  if (typeof m.last_name === "string" && m.last_name.trim()) {
    return m.last_name.trim().slice(0, 80)
  }
  const full =
    (typeof m.full_name === "string" && m.full_name) ||
    (typeof m.name === "string" && m.name) ||
    ""
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return parts.slice(1).join(" ").slice(0, 80)
  return null
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
  const lastName = pickLastName(user)
  const referralCode = user.id.replace(/-/g, "").slice(0, 8)

  try {
    if (charterAccepted || firstName || lastName) {
      const metaPatch: Record<string, unknown> = {}
      if (charterAccepted) {
        metaPatch.charter_accepted = true
        metaPatch.charter_accepted_at = new Date().toISOString()
      }
      if (firstName && !user.user_metadata?.first_name) {
        metaPatch.first_name = firstName
      }
      if (lastName && !user.user_metadata?.last_name) {
        metaPatch.last_name = lastName
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
      .select("first_name, last_name, completion_percentage, onboarding_status")
      .eq("user_id", user.id)
      .maybeSingle()

    const patch: Record<string, unknown> = {
      email_verified: true,
      updated_at: new Date().toISOString(),
      referral_code: referralCode,
    }

    if (firstName && !profile?.first_name) {
      patch.first_name = firstName
    }
    if (lastName && !profile?.last_name) {
      patch.last_name = lastName
    }
    if (!profile?.onboarding_status) {
      patch.onboarding_status = "step1_account"
    }
    if (profile?.completion_percentage == null) {
      patch.completion_percentage = 5
    }

    const { error } = await admin
      .from("profiles")
      .update(patch)
      .eq("user_id", user.id)

    // Profil absent (pas encore de trigger) → insert minimal
    if (error || !profile) {
      await admin.from("profiles").upsert(
        {
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          email_verified: true,
          onboarding_status: "step1_account",
          completion_percentage: 5,
          referral_code: referralCode,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
    }
  } catch (e) {
    console.error("[oauth] ensure profile", e)
  }
}

/** Extrait prénom/nom depuis user_metadata Auth (pour sync ops). */
export function namesFromAuthMetadata(meta: Record<string, unknown> | null | undefined): {
  firstName: string | null
  lastName: string | null
} {
  if (!meta) return { firstName: null, lastName: null }
  const fakeUser = { user_metadata: meta } as User
  return {
    firstName: pickFirstName(fakeUser),
    lastName: pickLastName(fakeUser),
  }
}
