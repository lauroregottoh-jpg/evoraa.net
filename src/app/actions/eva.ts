"use server"

import { getUserEntitlements } from "@/lib/billing/entitlements"
import { createClient } from "@/utils/supabase/server"
import {
  EVA_COUNTER_KEY,
  getCounterCount,
  incrementCounter,
  todayPeriodKey,
} from "@/lib/billing/usage-counters"
import {
  runEvaEngine,
  type EvaChatMessage,
  type EvaEngineResult,
} from "@/lib/eva/engine"
import { DEFAULT_EVA_CONFIG, parseEvaConfig } from "@/lib/admin/opsRules"

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

/** @deprecated Prefer askEvaAction — keep for older callers */
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

export type AskEvaResult =
  | {
      ok: true
      answer: string
      intent: string
      source: EvaEngineResult["source"]
      ctaHref?: string
      ctaLabel?: string
      remaining: number
      limit: number
    }
  | {
      ok: false
      error: string
      remaining?: number
      limit?: number
    }

/**
 * Pose une question à Eva (moteur docs + OpenAI si clé présente).
 * Consomme 1 crédit de quota du jour. Mémoire = historique court passé par le client.
 */
export async function askEvaAction(input: {
  question: string
  history?: EvaChatMessage[]
}): Promise<AskEvaResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Non authentifié." }

  const question = (input.question || "").trim().slice(0, 1200)
  if (!question) return { ok: false, error: "Question vide." }

  const entitlements = await getUserEntitlements(user.id)
  const limit = entitlements.limits.evaQuestionsPerDay
  const periodKey = todayPeriodKey()
  const used = await getCounterCount(user.id, EVA_COUNTER_KEY, periodKey)

  if (used >= limit) {
    return {
      ok: false,
      error: "Quota EVA du jour atteint. Revenez demain ou passez Alliance.",
      remaining: 0,
      limit,
    }
  }

  let adminNotes = ""
  try {
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "eva_config")
      .maybeSingle()
    const cfg = parseEvaConfig(data?.value ?? DEFAULT_EVA_CONFIG)
    adminNotes = [
      cfg.systemPrompt,
      cfg.knowledgeNotes,
      `Ton: ${cfg.tone}`,
      cfg.forbiddenTopics?.length
        ? `Sujets interdits (ops): ${cfg.forbiddenTopics.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 4000)
  } catch {
    /* ops optional */
  }

  const history = (input.history || [])
    .slice(-8)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content || "").slice(0, 1500),
    }))
    .filter((m) => m.content.length > 0)

  const engine = await runEvaEngine({
    question,
    history,
    adminNotes,
  })

  const next = await incrementCounter(user.id, EVA_COUNTER_KEY, periodKey)

  return {
    ok: true,
    answer: engine.answer,
    intent: engine.intent,
    source: engine.source,
    ctaHref: engine.ctaHref,
    ctaLabel: engine.ctaLabel,
    remaining: Math.max(0, limit - next),
    limit,
  }
}
