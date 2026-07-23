"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export type OnboardingPayload = {
  age: string
  city: string
  practice: string
  community: string
  marriageVision: string
  familyProject: string
  communicationStyle: string
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

export async function saveOnboardingAction(payload: OnboardingPayload) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté pour enregistrer votre profil." }
  }

  const birthDate = approximateBirthDate(payload.age)
  const attendance =
    PRACTICE_TO_ATTENDANCE[payload.practice] ?? ("occasionally" as const)

  const matchingIndicators = {
    spiritual_practice: payload.practice,
    marriage_vision: payload.marriageVision,
    family_project: payload.familyProject,
    communication_style: payload.communicationStyle,
    age_declared: Number.parseInt(payload.age, 10) || null,
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      city: payload.city,
      denomination: payload.community,
      attendance_frequency: attendance,
      birth_date: birthDate,
      matching_indicators: matchingIndicators,
      onboarding_status: "step3_tests",
      completion_percentage: 78,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}
