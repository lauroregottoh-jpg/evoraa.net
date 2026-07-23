"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export type SettingsData = {
  retreatMode: boolean
  maxDistance: number
  ageMin: number
  ageMax: number
}

function parseAgeRange(range: string): { ageMin: number; ageMax: number } {
  const [min, max] = range.split("-").map((n) => Number.parseInt(n, 10))
  return {
    ageMin: Number.isFinite(min) ? min : 22,
    ageMax: Number.isFinite(max) ? max : 36,
  }
}

export function ageRangeLabel(ageMin: number, ageMax: number): string {
  const candidates = ["22-30", "26-36", "30-42", "38-55"]
  const exact = `${ageMin}-${ageMax}`
  if (candidates.includes(exact)) return exact
  if (ageMin <= 22 && ageMax <= 30) return "22-30"
  if (ageMin <= 26 && ageMax <= 36) return "26-36"
  if (ageMin <= 30 && ageMax <= 42) return "30-42"
  return "38-55"
}

export async function getMySettings(): Promise<{
  data?: SettingsData
  error?: string
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, privacy_settings")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const privacy =
    profile.privacy_settings && typeof profile.privacy_settings === "object"
      ? (profile.privacy_settings as Record<string, unknown>)
      : {}

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("age_min, age_max, max_distance")
    .eq("user_id", profile.id)
    .maybeSingle()

  return {
    data: {
      retreatMode: Boolean(privacy.retreat_mode),
      maxDistance: prefs?.max_distance ?? 100,
      ageMin: prefs?.age_min ?? 26,
      ageMax: prefs?.age_max ?? 36,
    },
  }
}

export async function saveSettingsAction(payload: {
  retreatMode: boolean
  maxDistance: string
  ageRange: string
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, privacy_settings")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const prevPrivacy =
    profile.privacy_settings && typeof profile.privacy_settings === "object"
      ? (profile.privacy_settings as Record<string, unknown>)
      : {}

  const maxDistance = Number.parseInt(payload.maxDistance, 10)
  const { ageMin, ageMax } = parseAgeRange(payload.ageRange)

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      privacy_settings: {
        ...prevPrivacy,
        retreat_mode: payload.retreatMode,
      },
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id)

  if (profileError) return { error: profileError.message }

  const { error: prefsError } = await supabase.from("user_preferences").upsert(
    {
      user_id: profile.id,
      age_min: ageMin,
      age_max: ageMax,
      max_distance: Number.isFinite(maxDistance) ? maxDistance : 100,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
      created_by: user.id,
    },
    { onConflict: "user_id" }
  )

  if (prefsError) return { error: prefsError.message }

  revalidatePath("/settings")
  revalidatePath("/compatibility")
  return { success: true }
}
