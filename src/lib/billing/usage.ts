import { createClient } from "@/utils/supabase/server"
import { getUserEntitlements } from "@/lib/billing/entitlements"
import { isTrialActive, trialDaysRemaining } from "@/lib/billing/trial"

function startOfLocalMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export type UsageSnapshot = {
  planId: string
  planName: string
  conversationsUsed: number
  conversationsLimit: number
  conversationsRemaining: number
  suggestionsLimit: number
  evaQuestionsLimit: number
  messagesPerConversation: number
  endsAt: string | null
  daysRemaining: number | null
  renewSoon: boolean
  isPaid: boolean
  trialEndsAt: string | null
  trialDaysRemaining: number | null
  isTrialBoost: boolean
}

/** Quotas visibles dashboard — aligné sur l'enforcement messaging. */
export async function getUsageSnapshot(userId?: string): Promise<UsageSnapshot | null> {
  const entitlements = await getUserEntitlements(userId)
  const supabase = await createClient()
  let uid = userId
  if (!uid) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    uid = user?.id
  }
  if (!uid) return null

  const monthStart = startOfLocalMonth().toISOString()

  const { data: userMatches } = await supabase
    .from("matches")
    .select("id")
    .or(`user_one.eq.${uid},user_two.eq.${uid}`)

  const matchIds = (userMatches ?? []).map((m) => m.id)
  let used = 0
  if (matchIds.length > 0) {
    const { count } = await supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .in("match_id", matchIds)
      .gte("created_at", monthStart)
    used = count ?? 0
  }

  const limit = entitlements.limits.conversationsPerMonth
  const remaining = Math.max(0, limit - used)

  const endsAt = entitlements.subscription?.endsAt ?? null
  let daysRemaining: number | null = null
  let renewSoon = false
  if (endsAt) {
    const ms = new Date(endsAt).getTime() - Date.now()
    daysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
    renewSoon = daysRemaining <= 7 && entitlements.planId !== "free"
  }

  return {
    planId: entitlements.planId,
    planName: entitlements.planName,
    conversationsUsed: used,
    conversationsLimit: limit,
    conversationsRemaining: remaining,
    suggestionsLimit: entitlements.limits.dailySuggestions,
    evaQuestionsLimit: entitlements.limits.evaQuestionsPerDay,
    messagesPerConversation: entitlements.limits.messagesPerConversation,
    endsAt,
    daysRemaining,
    renewSoon,
    isPaid: entitlements.planId !== "free",
    trialEndsAt: entitlements.trialEndsAt ?? null,
    trialDaysRemaining: isTrialActive(entitlements.trialEndsAt)
      ? trialDaysRemaining(entitlements.trialEndsAt)
      : null,
    isTrialBoost: Boolean(entitlements.isTrialBoost && isTrialActive(entitlements.trialEndsAt)),
  }
}
