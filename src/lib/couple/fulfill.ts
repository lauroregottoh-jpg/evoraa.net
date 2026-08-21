import {
  COUPLE_ACCESS_DAYS,
  COUPLE_INVITE_DAYS,
  COUPLE_QUESTIONNAIRE_VERSION,
} from "@/lib/couple/config"
import {
  generateCouplePublicCode,
  generateInviteCode,
  generateInviteToken,
  hashInviteToken,
} from "@/lib/couple/codes"
import {
  getCoupleOffer,
  snapshotCoupleOffer,
  type CoupleOfferId,
} from "@/lib/couple/offers"
import type { SupabaseClient } from "@supabase/supabase-js"

type Admin = SupabaseClient

export function coupleAccessExpiresAt(from = new Date()): Date {
  const d = new Date(from)
  d.setDate(d.getDate() + COUPLE_ACCESS_DAYS)
  return d
}

export function coupleInviteExpiresAt(from = new Date()): Date {
  const d = new Date(from)
  d.setDate(d.getDate() + COUPLE_INVITE_DAYS)
  return d
}

/**
 * Après paiement confirmé : crée purchase + couple + seat 1 (acheteur) + invitation.
 * Idempotent si payment déjà lié à un purchase completed.
 */
export async function fulfillCouplePurchase(args: {
  admin: Admin
  paymentId: string
  purchaserUserId: string
  offerId: CoupleOfferId
  amountXof: number
  displayName?: string | null
}): Promise<{ coupleId: string; inviteToken: string; inviteCode: string; already?: boolean }> {
  const offer = getCoupleOffer(args.offerId)
  if (!offer) throw new Error("Offre couple invalide")

  const { data: existing } = await args.admin
    .from("couple_purchases")
    .select("id, status")
    .eq("payment_id", args.paymentId)
    .maybeSingle()

  if (existing?.status === "completed") {
    const { data: couple } = await args.admin
      .from("couples")
      .select("id")
      .eq("purchase_id", existing.id)
      .maybeSingle()
    if (couple) {
      const { data: invite } = await args.admin
        .from("couple_invitations")
        .select("invite_code")
        .eq("couple_id", couple.id)
        .eq("status", "ACTIVE")
        .maybeSingle()
      return {
        coupleId: couple.id,
        inviteToken: "",
        inviteCode: (invite?.invite_code as string) || "",
        already: true,
      }
    }
  }

  const snapshot = snapshotCoupleOffer(offer)
  const accessExpires = coupleAccessExpiresAt()

  let purchaseId: string

  const { data: pendingPurchase } = await args.admin
    .from("couple_purchases")
    .select("id")
    .eq("payment_id", args.paymentId)
    .maybeSingle()

  if (pendingPurchase) {
    await args.admin
      .from("couple_purchases")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        offer_snapshot: snapshot,
        amount_xof: args.amountXof,
      })
      .eq("id", pendingPurchase.id)
    purchaseId = pendingPurchase.id

    const { data: existingCouple } = await args.admin
      .from("couples")
      .select("id")
      .eq("purchase_id", purchaseId)
      .maybeSingle()
    if (existingCouple) {
      return {
        coupleId: existingCouple.id,
        inviteToken: "",
        inviteCode: "",
        already: true,
      }
    }
  } else {
    const { data: purchase, error: purchaseErr } = await args.admin
      .from("couple_purchases")
      .insert({
        purchaser_user_id: args.purchaserUserId,
        payment_id: args.paymentId,
        offer_id: offer.id,
        amount_xof: args.amountXof,
        currency: "XOF",
        status: "completed",
        offer_snapshot: snapshot,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (purchaseErr || !purchase) {
      throw new Error(purchaseErr?.message || "Création purchase couple impossible")
    }
    purchaseId = purchase.id
  }

  const publicCode = generateCouplePublicCode()
  const { data: couple, error: coupleErr } = await args.admin
    .from("couples")
    .insert({
      public_code: publicCode,
      purchase_id: purchaseId,
      purchaser_user_id: args.purchaserUserId,
      offer_id: offer.id,
      status: "INVITATION_PENDING",
      offer_snapshot: snapshot,
      access_expires_at: accessExpires.toISOString(),
    })
    .select("id")
    .single()

  if (coupleErr || !couple) {
    throw new Error(coupleErr?.message || "Création couple impossible")
  }

  const { error: seatErr } = await args.admin.from("couple_participants").insert({
    couple_id: couple.id,
    user_id: args.purchaserUserId,
    seat: 1,
    display_name: args.displayName || null,
    questionnaire_status: "NOT_STARTED",
  })
  if (seatErr) throw new Error(seatErr.message)

  await args.admin.from("couple_access").insert({
    couple_id: couple.id,
    interactive_access: true,
    access_expires_at: accessExpires.toISOString(),
    download_allowed: true,
  })

  const inviteCode = generateInviteCode()
  const inviteToken = generateInviteToken()
  const tokenHash = hashInviteToken(inviteToken)

  const { error: inviteErr } = await args.admin.from("couple_invitations").insert({
    couple_id: couple.id,
    invite_code: inviteCode,
    token_hash: tokenHash,
    status: "ACTIVE",
    created_by: args.purchaserUserId,
    expires_at: coupleInviteExpiresAt().toISOString(),
  })
  if (inviteErr) throw new Error(inviteErr.message)

  await args.admin.from("couple_funnel_events").insert({
    couple_id: couple.id,
    user_id: args.purchaserUserId,
    event: "PURCHASE",
    meta: { offer_id: offer.id },
  })

  return { coupleId: couple.id, inviteToken, inviteCode }
}

export async function refreshCoupleInvite(args: {
  admin: Admin
  coupleId: string
  userId: string
}): Promise<{ inviteToken: string; inviteCode: string }> {
  // Revoke previous active invites
  await args.admin
    .from("couple_invitations")
    .update({ status: "REVOKED" })
    .eq("couple_id", args.coupleId)
    .eq("status", "ACTIVE")

  const inviteCode = generateInviteCode()
  const inviteToken = generateInviteToken()
  const tokenHash = hashInviteToken(inviteToken)

  const { error } = await args.admin.from("couple_invitations").insert({
    couple_id: args.coupleId,
    invite_code: inviteCode,
    token_hash: tokenHash,
    status: "ACTIVE",
    created_by: args.userId,
    expires_at: coupleInviteExpiresAt().toISOString(),
  })
  if (error) throw new Error(error.message)
  return { inviteToken, inviteCode }
}

export { COUPLE_QUESTIONNAIRE_VERSION }
