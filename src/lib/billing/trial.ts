import type { PlanLimits } from "@/lib/billing/plans"

/** Boost Découverte pendant les 30 premiers jours (option A du plan pricing). */
export const TRIAL_BOOST_LIMITS: Partial<PlanLimits> = {
  dailySuggestions: 5,
  conversationsPerMonth: 8,
  messagesPerConversation: 8,
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
  return { ...limits, ...TRIAL_BOOST_LIMITS }
}

export function trialDaysRemaining(trialEndsAt: string | null | undefined): number | null {
  if (!trialEndsAt || !isTrialActive(trialEndsAt)) return null
  const ms = new Date(trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}
