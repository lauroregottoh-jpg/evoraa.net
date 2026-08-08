"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import {
  parseAgeRange,
  parseDesireChildren,
  parseDenominationOpen,
  parseFaithPractice,
  parseMarriageTimeline,
  parseRelocate,
  type DesireChildrenPref,
  type DenominationOpenPref,
  type FaithPracticePref,
  type MarriageTimeline,
  type RelocatePref,
  type SettingsData,
} from "@/lib/settings"

export type { SettingsData } from "@/lib/settings"

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
    .select("age_min, age_max, max_distance, vision_of_marriage, desire_children")
    .eq("user_id", profile.id)
    .maybeSingle()

  return {
    data: {
      retreatMode: Boolean(privacy.retreat_mode),
      sameSexFriendship: Boolean(privacy.same_sex_friendship),
      maxDistance: prefs?.max_distance ?? 100,
      ageMin: prefs?.age_min ?? 26,
      ageMax: prefs?.age_max ?? 36,
      marriageTimeline: parseMarriageTimeline(prefs?.vision_of_marriage),
      desireChildren: parseDesireChildren(prefs?.desire_children),
      faithPractice: parseFaithPractice(
        typeof privacy.faith_practice === "string" ? privacy.faith_practice : null
      ),
      relocate: parseRelocate(
        typeof privacy.relocate === "string" ? privacy.relocate : null
      ),
      denominationOpen: parseDenominationOpen(
        typeof privacy.denomination_open === "string"
          ? privacy.denomination_open
          : null
      ),
    },
  }
}

export async function saveSettingsAction(payload: {
  retreatMode: boolean
  sameSexFriendship: boolean
  maxDistance: string
  ageRange: string
  marriageTimeline: MarriageTimeline
  desireChildren: DesireChildrenPref
  faithPractice: FaithPracticePref
  relocate: RelocatePref
  denominationOpen: DenominationOpenPref
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
        same_sex_friendship: payload.sameSexFriendship,
        faith_practice: payload.faithPractice,
        relocate: payload.relocate,
        denomination_open: payload.denominationOpen,
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
      vision_of_marriage: payload.marriageTimeline,
      desire_children: payload.desireChildren,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
      created_by: user.id,
    },
    { onConflict: "user_id" }
  )

  if (prefsError) return { error: prefsError.message }

  revalidatePath("/settings")
  revalidatePath("/compatibility")
  revalidatePath("/communaute")
  return { success: true }
}
