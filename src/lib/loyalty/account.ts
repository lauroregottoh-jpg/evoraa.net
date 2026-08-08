import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import {
  fidelityCardById,
  nextRewardPreview,
  resolveFidelityCardId,
  rewardForConsecutiveMonth,
  type FidelityCardId,
} from "@/lib/loyalty/rules"

export type LoyaltyAccountDTO = {
  consecutiveMonths: number
  bonusMessagesBalance: number
  profileBoostsAvailable: number
  vipSessionEligible: boolean
  fidelityCardId: FidelityCardId
  fidelityCardLabel: string
  nextMonth: number
  nextBonusMessages: number
  nextBoosts: number
  nextIsMilestone: boolean
  bonusActive: boolean
}

const emptyAccount = (isPaid: boolean): LoyaltyAccountDTO => ({
  consecutiveMonths: 0,
  bonusMessagesBalance: 0,
  profileBoostsAvailable: 0,
  vipSessionEligible: false,
  fidelityCardId: "welcome",
  fidelityCardLabel: "Bienvenue",
  nextMonth: 1,
  nextBonusMessages: 15,
  nextBoosts: 0,
  nextIsMilestone: false,
  bonusActive: isPaid,
})

export async function getLoyaltyAccount(
  userId: string,
  opts?: { isPaid?: boolean }
): Promise<LoyaltyAccountDTO> {
  const isPaid = Boolean(opts?.isPaid)
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("loyalty_accounts")
      .select(
        "consecutive_months, bonus_messages_balance, profile_boosts_available, vip_session_eligible, fidelity_card_id"
      )
      .eq("user_id", userId)
      .maybeSingle()

    if (!data) return emptyAccount(isPaid)

    const consecutiveMonths = Number(data.consecutive_months) || 0
    const next = nextRewardPreview(consecutiveMonths)
    const card = fidelityCardById(String(data.fidelity_card_id || "welcome"))

    return {
      consecutiveMonths,
      bonusMessagesBalance: Number(data.bonus_messages_balance) || 0,
      profileBoostsAvailable: Number(data.profile_boosts_available) || 0,
      vipSessionEligible: Boolean(data.vip_session_eligible),
      fidelityCardId: card.id,
      fidelityCardLabel: card.label,
      nextMonth: next.nextMonth,
      nextBonusMessages: next.bonusMessages,
      nextBoosts: next.boosts,
      nextIsMilestone: next.isMilestone,
      bonusActive: isPaid,
    }
  } catch {
    return emptyAccount(isPaid)
  }
}

/**
 * Attribution après activation paiement Alliance (idempotent via payment_ref).
 */
export async function grantAllianceLoyaltyForPayment(input: {
  userId: string
  paymentId: string
  isRenewal?: boolean
  monthsPurchased?: number
}): Promise<{
  ok: boolean
  already?: boolean
  skipped?: boolean
  reward?: ReturnType<typeof rewardForConsecutiveMonth>
  consecutiveMonths?: number
  error?: string
}> {
  const monthsPurchased = Math.max(1, input.monthsPurchased ?? 1)
  const paymentRef = `payment:${input.paymentId}`

  try {
    const admin = createAdminClient()

    const { data: existing } = await admin
      .from("loyalty_grants")
      .select("id")
      .eq("payment_ref", paymentRef)
      .maybeSingle()

    if (existing?.id) {
      return { ok: true, already: true }
    }

    const { data: account } = await admin
      .from("loyalty_accounts")
      .select(
        "consecutive_months, bonus_messages_balance, profile_boosts_available, vip_session_eligible, fidelity_card_id"
      )
      .eq("user_id", input.userId)
      .maybeSingle()

    // Interruption : si pas un renouvellement, streak repart à 0 puis +months
    let streak = Number(account?.consecutive_months) || 0
    if (!input.isRenewal) {
      streak = 0
    }

    let totalBonus = 0
    let totalBoosts = 0
    let lastReward = rewardForConsecutiveMonth(1)
    let vip = Boolean(account?.vip_session_eligible)

    for (let i = 1; i <= monthsPurchased; i++) {
      streak += 1
      lastReward = rewardForConsecutiveMonth(streak)
      totalBonus += lastReward.bonusMessages
      totalBoosts += lastReward.boosts
      if (lastReward.vipSession) vip = true
    }

    const bonusBalance =
      (Number(account?.bonus_messages_balance) || 0) + totalBonus
    const boostsAvailable =
      (Number(account?.profile_boosts_available) || 0) + totalBoosts

    const { data: profile } = await admin
      .from("profiles")
      .select("created_at, completion_percentage")
      .eq("user_id", input.userId)
      .maybeSingle()

    const createdAt = profile?.created_at
      ? new Date(profile.created_at as string).getTime()
      : Date.now()
    const monthsOnPlatform = Math.max(
      0,
      Math.floor((Date.now() - createdAt) / (30 * 86400_000))
    )

    const cardId = resolveFidelityCardId({
      monthsOnPlatform,
      consecutiveAllianceMonths: streak,
      completionPercentage: Number(profile?.completion_percentage) || 0,
      assessmentsDone: 0,
    })

    const upsertPayload: Record<string, unknown> = {
      user_id: input.userId,
      consecutive_months: streak,
      bonus_messages_balance: bonusBalance,
      profile_boosts_available: boostsAvailable,
      vip_session_eligible: vip,
      fidelity_card_id: cardId,
      last_grant_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    if (vip && !account?.vip_session_eligible) {
      upsertPayload.vip_session_reached_at = new Date().toISOString()
    }

    const { error: upsertError } = await admin
      .from("loyalty_accounts")
      .upsert(upsertPayload, { onConflict: "user_id" })

    if (upsertError) {
      return { ok: false, error: upsertError.message }
    }

    const { error: grantError } = await admin.from("loyalty_grants").insert({
      user_id: input.userId,
      payment_ref: paymentRef,
      months_credited: monthsPurchased,
      consecutive_months_after: streak,
      bonus_messages: totalBonus,
      boosts: totalBoosts,
      kind: lastReward.isMilestone ? "milestone" : "renewal",
      meta: {
        is_renewal: Boolean(input.isRenewal),
        vip_session: lastReward.vipSession,
      },
    })

    if (grantError) {
      // Unique violation = already granted
      if (grantError.code === "23505") {
        return { ok: true, already: true }
      }
      return { ok: false, error: grantError.message }
    }

    // Activer un boost 24h stocké comme disponible (consommable plus tard)
    if (totalBoosts > 0) {
      const ends = new Date(Date.now() + 24 * 3600_000).toISOString()
      for (let b = 0; b < totalBoosts; b++) {
        await admin.from("profile_boosts").insert({
          user_id: input.userId,
          pack_id: "boost_24h_loyalty",
          amount_xof: 0,
          currency: "XOF",
          status: "available",
          starts_at: null,
          ends_at: null,
          payment_id: input.paymentId,
          metadata: { source: "loyalty", consecutive_months: streak },
        })
      }
      void ends
    }

    return {
      ok: true,
      reward: {
        bonusMessages: totalBonus,
        boosts: totalBoosts,
        isMilestone: lastReward.isMilestone,
        vipSession: vip && lastReward.vipSession,
      },
      consecutiveMonths: streak,
    }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "loyalty_grant_failed",
      skipped: true,
    }
  }
}

export async function consumeLoyaltyBonusMessage(
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc(
      "consume_loyalty_bonus_message" as never,
      { p_user_id: userId } as never
    )
    if (error) return false
    return Boolean(data)
  } catch {
    return false
  }
}
