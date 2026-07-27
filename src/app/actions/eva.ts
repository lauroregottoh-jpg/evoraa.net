"use server"

import { getUserEntitlements } from "@/lib/billing/entitlements"
import { createClient } from "@/utils/supabase/server"
import {
  EVA_COUNTER_KEY,
  getCounterCount,
  incrementCounter,
  todayPeriodKey,
} from "@/lib/billing/usage-counters"

export async function getEvaQuotaAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié.", limit: 3, used: 0, remaining: 0 }

  const entitlements = await getUserEntitlements(user.id)
  const limit = entitlements.limits.evaQuestionsPerDay
  const used = await getCounterCount(user.id, EVA_COUNTER_KEY, todayPeriodKey())
  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    isPaid: entitlements.isPaid,
  }
}

export async function consumeEvaQuotaAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." }

  const entitlements = await getUserEntitlements(user.id)
  const limit = entitlements.limits.evaQuestionsPerDay
  const periodKey = todayPeriodKey()
  const used = await getCounterCount(user.id, EVA_COUNTER_KEY, periodKey)

  if (used >= limit) {
    return {
      error: "Quota EVA du jour atteint. Revenez demain ou passez Alliance.",
      remaining: 0,
      limit,
    }
  }

  const next = await incrementCounter(user.id, EVA_COUNTER_KEY, periodKey)
  return {
    success: true as const,
    remaining: Math.max(0, limit - next),
    limit,
  }
}
