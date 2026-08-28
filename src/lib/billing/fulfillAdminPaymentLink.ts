import type { SupabaseClient } from "@supabase/supabase-js"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"

type AdminClient = SupabaseClient

export async function fulfillAdminPaymentLink(args: {
  admin: AdminClient
  paymentId: string
  subscriptionId: string
  paymentMeta: Record<string, unknown>
  transactionId: string
  webhookBody: Record<string, unknown>
  provider: "bictorys" | "moneroo"
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const slug = String(args.paymentMeta.slug || "")

  const { error: payErr } = await args.admin
    .from("payments")
    .update({
      status: "completed",
      transaction_reference: args.transactionId || args.paymentId,
      metadata: {
        ...args.paymentMeta,
        webhook: args.webhookBody,
        provider: args.provider,
        admin_link_paid_at: new Date().toISOString(),
      },
    })
    .eq("id", args.paymentId)
    .eq("status", "pending")

  if (payErr) {
    const { data: refreshed } = await args.admin
      .from("payments")
      .select("status")
      .eq("id", args.paymentId)
      .maybeSingle()
    if (refreshed?.status !== "completed") {
      return { ok: false, error: payErr.message }
    }
  }

  await args.admin
    .from("subscriptions")
    .update({
      status: "paid_admin_link",
      starts_at: new Date().toISOString(),
      ends_at: null,
    })
    .eq("id", args.subscriptionId)

  if (slug) {
    await args.admin
      .from("admin_payment_links")
      .update({
        status: "completed",
        paid_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .eq("payment_id", args.paymentId)
  }

  await logPaymentEvent({
    paymentId: args.paymentId,
    provider: args.provider,
    eventType: "payment_completed",
    status: "completed",
    message: `admin_link:${slug || args.paymentId}`,
  })

  return { ok: true }
}
