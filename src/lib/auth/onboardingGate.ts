/**
 * Règle unique : infos essentielles manquantes → onboarding.
 * Dès que prénom + sexe + naissance + ville sont là, le membre
 * accède à l’espace (tests, matchs) même si la validation admin est encore pending.
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

export function profileMissingEssentials(
  profile: OnboardingGateProfile | null | undefined
): boolean {
  if (!profile) return true
  return (
    !profile.first_name?.trim() ||
    !profile.gender ||
    !profile.birth_date ||
    !profile.city?.trim()
  )
}

export function profileNeedsOnboarding(
  profile: OnboardingGateProfile | null | undefined
): boolean {
  return profileMissingEssentials(profile)
}

/** Champs profil à sélectionner pour la gate onboarding. */
export const ONBOARDING_GATE_SELECT =
  "completion_percentage, onboarding_status, first_name, last_name, gender, birth_date, city, church_attended"
