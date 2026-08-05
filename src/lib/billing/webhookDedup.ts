/**
 * Dedup durable des webhooks paiement (parity Evora WebhookLog).
 * UNIQUE(provider, external_id, event_type) — claim avant side-effects, mark après succès.
 */

import type { SupabaseClient } from "@supabase/supabase-js"

export type WebhookProviderName = "bictorys" | "moneroo"

export type ClaimWebhookResult =
  | { status: "fresh"; id: string }
  /** Already fully processed — ACK without side-effects */
  | { status: "deduped"; id: string }
  /** Row exists but never marked processed (retry after crash) — continue work */
  | { status: "retry"; id: string }
  | { status: "error"; message: string }

type AdminLike = Pick<SupabaseClient, "from">

export function buildWebhookExternalKey(parts: {
  paymentId?: string | null
  transactionId?: string | null
  fallback?: string | null
}): string {
  const a = (parts.transactionId || "").trim()
  const b = (parts.paymentId || "").trim()
  const c = (parts.fallback || "").trim()
  return a || b || c
}

export async function claimWebhookDelivery(
  admin: AdminLike,
  input: {
    provider: WebhookProviderName
    externalId: string
    eventType: string
    paymentId?: string | null
  }
): Promise<ClaimWebhookResult> {
  const externalId = input.externalId.trim()
  const eventType = (input.eventType || "default").trim() || "default"
  if (!externalId) {
    return { status: "error", message: "external_id_empty" }
  }

  const { data: inserted, error: insertError } = await admin
    .from("webhook_deliveries")
    .insert({
      provider: input.provider,
      external_id: externalId,
      event_type: eventType,
      payment_id: input.paymentId || null,
    })
    .select("id")
    .maybeSingle()

  if (!insertError && inserted?.id) {
    return { status: "fresh", id: inserted.id as string }
  }

  // Unique violation → load existing
  const code = (insertError as { code?: string } | null)?.code
  if (code && code !== "23505") {
    return {
      status: "error",
      message: insertError?.message || "webhook_claim_failed",
    }
  }

  const { data: existing, error: selErr } = await admin
    .from("webhook_deliveries")
    .select("id, processed_at")
    .eq("provider", input.provider)
    .eq("external_id", externalId)
    .eq("event_type", eventType)
    .maybeSingle()

  if (selErr || !existing?.id) {
    return {
      status: "error",
      message: selErr?.message || "webhook_claim_race",
    }
  }

  if (existing.processed_at) {
    return { status: "deduped", id: existing.id as string }
  }

  if (input.paymentId) {
    await admin
      .from("webhook_deliveries")
      .update({ payment_id: input.paymentId })
      .eq("id", existing.id)
      .is("payment_id", null)
  }

  return { status: "retry", id: existing.id as string }
}

export async function markWebhookDeliveryProcessed(
  admin: AdminLike,
  deliveryId: string
): Promise<void> {
  try {
    await admin
      .from("webhook_deliveries")
      .update({ processed_at: new Date().toISOString() })
      .eq("id", deliveryId)
      .is("processed_at", null)
  } catch {
    // never block ACK
  }
}
