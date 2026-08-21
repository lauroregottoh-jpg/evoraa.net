import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import {
  MESSAGE_CREDIT_TTL_DAYS,
} from "@/lib/matching/testCoverage"

export type MessageCreditSource =
  | "test_complete"
  | "invite_sent"
  | "invite_accepted"

export async function grantMessageCredits(input: {
  userId: string
  amount: number
  source: MessageCreditSource
  sourceKey: string
}): Promise<{ granted: boolean; already?: boolean }> {
  const amount = Math.max(0, Math.round(input.amount))
  if (amount <= 0) return { granted: false }

  try {
    const admin = createAdminClient()
    const expires = new Date()
    expires.setDate(expires.getDate() + MESSAGE_CREDIT_TTL_DAYS)

    const { error } = await admin.from("message_credit_lots").insert({
      user_id: input.userId,
      amount,
      remaining: amount,
      source: input.source,
      source_key: input.sourceKey.slice(0, 180),
      expires_at: expires.toISOString(),
    })

    if (error) {
      if (/unique|duplicate/i.test(error.message)) {
        return { granted: false, already: true }
      }
      console.error("[credits] grant", error.message)
      return { granted: false }
    }
    return { granted: true }
  } catch (e) {
    console.error("[credits] grant", e)
    return { granted: false }
  }
}

export async function getMessageCreditBalance(userId: string): Promise<{
  remaining: number
  nextExpiresAt: string | null
}> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("message_credit_lots")
      .select("remaining, expires_at")
      .eq("user_id", userId)
      .gt("remaining", 0)
      .gt("expires_at", new Date().toISOString())

    if (error) return { remaining: 0, nextExpiresAt: null }

    let remaining = 0
    let nextExpiresAt: string | null = null
    for (const row of data ?? []) {
      remaining += Number(row.remaining) || 0
      const exp = row.expires_at as string
      if (!nextExpiresAt || exp < nextExpiresAt) nextExpiresAt = exp
    }
    return { remaining, nextExpiresAt }
  } catch {
    return { remaining: 0, nextExpiresAt: null }
  }
}

/** Consomme 1 crédit non expiré (le plus tôt à périmer). */
export async function consumeMessageCredit(userId: string): Promise<boolean> {
  try {
    const admin = createAdminClient()
    const { data: lots, error } = await admin
      .from("message_credit_lots")
      .select("id, remaining")
      .eq("user_id", userId)
      .gt("remaining", 0)
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: true })
      .limit(1)

    if (error || !lots?.[0]) return false
    const lot = lots[0]
    const next = Math.max(0, Number(lot.remaining) - 1)
    const { data: updated, error: upErr } = await admin
      .from("message_credit_lots")
      .update({ remaining: next })
      .eq("id", lot.id)
      .eq("remaining", lot.remaining)
      .select("id")
      .maybeSingle()

    if (upErr || !updated) return false
    return true
  } catch {
    return false
  }
}
