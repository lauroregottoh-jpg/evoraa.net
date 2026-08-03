/**
 * Progression profil alignée produit :
 * - Inscription : 10 %
 * - Onboarding (formulaires d’entrée) : 15 %
 * - Chaque questionnaire (×5) : +17 % → 100 %
 * La photo est un rappel UX, elle n’ajoute pas de % hors questionnaires.
 */
export function computeProfileCompletion(input: {
  onboardingDone: boolean
  assessmentsDone: number
}): number {
  if (!input.onboardingDone) return 10
  const tests = Math.max(0, Math.min(5, input.assessmentsDone))
  return Math.min(100, 15 + tests * 17)
}

export function isOnboardingProfileDone(status: string | null | undefined): boolean {
  if (!status) return false
  return (
    status !== "step1_account" &&
    status !== "step2_profile" &&
    status !== "registered"
  )
}
