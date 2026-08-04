"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export type OnboardingPayload = {
  age: string
  gender: string
  city: string
  country: string
  practice: string
  community: string
  churchName: string
  pastorName: string
  pastorContact: string
  marriageVision: string
  familyProject: string
  communicationStyle: string
  marriageTimeline: string
  partnerChildren: string
  firstName?: string
  birthDate?: string
}

export type BasicsPayload = {
  firstName: string
  lastName?: string
  gender: string
  birthDate: string
  city: string
  country: string
}

const PRACTICE_TO_ATTENDANCE: Record<
  string,
  "weekly" | "monthly" | "occasionally" | "rarely"
> = {
  regulier: "weekly",
  engagement_fort: "weekly",
  cheminement: "monthly",
  occasionnel: "occasionally",
}

function approximateBirthDate(age: string): string | null {
  const years = Number.parseInt(age, 10)
  if (!Number.isFinite(years) || years < 18 || years > 99) return null
  const year = new Date().getFullYear() - years
  return `${year}-01-01`
}

function isAdultBirthDate(iso: string): boolean {
  const birth = new Date(iso)
  if (Number.isNaN(birth.getTime())) return false
  const limit = new Date()
  limit.setFullYear(limit.getFullYear() - 18)
  return birth <= limit
}

export async function saveOnboardingBasicsAction(payload: BasicsPayload) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté pour enregistrer votre profil." }
  }

  const firstName = payload.firstName.trim()
  const lastName = (payload.lastName || "").trim()
  if (!firstName) return { error: "Le prénom est requis." }
  if (!lastName) return { error: "Le nom est requis." }
  if (!payload.gender || (payload.gender !== "M" && payload.gender !== "F")) {
    return { error: "Indiquez votre sexe." }
  }
  if (!payload.birthDate || !isAdultBirthDate(payload.birthDate)) {
    return { error: "Vous devez avoir au moins 18 ans." }
  }
  if (!payload.country.trim()) {
    return { error: "Le pays est requis." }
  }

  const city = (payload.city.trim() || payload.country.trim()).slice(0, 120)

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName.slice(0, 80),
      last_name: lastName.slice(0, 80),
      gender: payload.gender === "M" ? "M" : "F",
      birth_date: payload.birthDate,
      city,
      country: payload.country.trim().slice(0, 120),
      onboarding_status: "step2_profile",
      completion_percentage: 12,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  try {
    await supabase.auth.updateUser({
      data: {
        first_name: firstName.slice(0, 80),
        last_name: lastName.slice(0, 80),
      },
    })
  } catch {
    /* non-blocking */
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function saveOnboardingAction(payload: OnboardingPayload) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté pour enregistrer votre profil." }
  }

  const birthDate =
    (payload.birthDate && isAdultBirthDate(payload.birthDate)
      ? payload.birthDate
      : null) || approximateBirthDate(payload.age)
  const attendance =
    PRACTICE_TO_ATTENDANCE[payload.practice] ?? ("occasionally" as const)

  const matchingIndicators = {
    spiritual_practice: payload.practice,
    marriage_vision: payload.marriageVision,
    family_project: payload.familyProject,
    communication_style: payload.communicationStyle,
    marriage_timeline: payload.marriageTimeline,
    partner_children: payload.partnerChildren,
    age_declared: Number.parseInt(payload.age, 10) || null,
  }

  const patch: Record<string, unknown> = {
    gender: payload.gender === "M" ? "M" : "F",
    city: payload.city,
    country: payload.country || null,
    denomination: payload.community,
    church_attended: payload.churchName || null,
    pastor_name: payload.pastorName || null,
    pastor_contact: payload.pastorContact || null,
    attendance_frequency: attendance,
    birth_date: birthDate,
    matching_indicators: matchingIndicators,
    onboarding_status: "step3_tests",
    completion_percentage: 35,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }
  if (payload.firstName?.trim()) {
    patch.first_name = payload.firstName.trim().slice(0, 80)
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle()

  if (error) {
    return { error: error.message }
  }

  if (profile?.id) {
    await supabase.from("user_preferences").upsert(
      {
        user_id: profile.id,
        vision_of_marriage: payload.marriageTimeline || "open",
        desire_children: payload.partnerChildren || "open",
        updated_by: user.id,
        updated_at: new Date().toISOString(),
        created_by: user.id,
      },
      { onConflict: "user_id" }
    )
  }

  revalidatePath("/", "layout")
  return { success: true }
}
