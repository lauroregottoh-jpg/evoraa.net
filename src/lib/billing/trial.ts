import type { PlanLimits } from "@/lib/billing/plans"

/**
 * Boost Découverte : léger (suggestions / likes), sans dépasser
 * les plafonds messages & conversations du plan FREE.
 */
export const TRIAL_BOOST_LIMITS: Partial<PlanLimits> = {
  dailySuggestions: 5,
  dailyLikes: 5,
}

export function isTrialActive(trialEndsAt: string | null | undefined): boolean {
  if (!trialEndsAt) return false
  return new Date(trialEndsAt).getTime() > Date.now()
}

export function applyTrialBoost(
  limits: PlanLimits,
  planId: string,
  trialEndsAt: string | null | undefined
): PlanLimits {
  if (planId !== "free" || !isTrialActive(trialEndsAt)) return limits
  return {
    ...limits,
    ...TRIAL_BOOST_LIMITS,
    // Toujours aligner dailyLikes sur dailySuggestions après boost
    dailyLikes: TRIAL_BOOST_LIMITS.dailyLikes ?? limits.dailyLikes,
  }
}

export function trialDaysRemaining(trialEndsAt: string | null | undefined): number | null {
  if (!trialEndsAt || !isTrialActive(trialEndsAt)) return null
  const ms = new Date(trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}
