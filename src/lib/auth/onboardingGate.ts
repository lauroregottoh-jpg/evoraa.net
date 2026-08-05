/**
 * Règle unique : tant que les infos essentielles manquent,
 * le membre reste en onboarding (pas d’espace membre).
 */
export type OnboardingGateProfile = {
  completion_percentage?: number | null
  onboarding_status?: string | null
  first_name?: string | null
  last_name?: string | null
  gender?: string | null
  birth_date?: string | null
  city?: string | null
  church_attended?: string | null
}

export function profileNeedsOnboarding(
  profile: OnboardingGateProfile | null | undefined
): boolean {
  if (!profile) return true

  const missingEssentials =
    !profile.first_name?.trim() ||
    !profile.gender ||
    !profile.birth_date ||
    !profile.city?.trim()

  if (missingEssentials) return true

  const completion = profile.completion_percentage ?? 0
  const status = profile.onboarding_status

  if (
    !status ||
    status === "step1_account" ||
    status === "step2_profile" ||
    status === "registered"
  ) {
    return true
  }

  // Charte / bases / foi à valider encore
  if (status === "step3_tests" && completion < 40) {
    return true
  }

  if (completion < 40 && status !== "active" && status !== "pending_review") {
    return true
  }

  return false
}

/** Champs profil à sélectionner pour la gate onboarding. */
export const ONBOARDING_GATE_SELECT =
  "completion_percentage, onboarding_status, first_name, last_name, gender, birth_date, city, church_attended"
