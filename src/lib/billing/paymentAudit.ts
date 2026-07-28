import { createAdminClient } from "@/utils/supabase/admin"

export type PaymentEventType =
  | "charge_initiated"
  | "charge_failed"
  | "webhook_received"
  | "webhook_ignored"
  | "payment_completed"
  | "payment_failed"
  | "sandbox_probe"
  | "sandbox_test"

type LogArgs = {
  paymentId?: string | null
  provider?: string | null
  eventType: PaymentEventType
  status?: string | null
  message?: string | null
  payload?: Record<string, unknown> | null
}

export async function logPaymentEvent(args: LogArgs) {
  try {
    const admin = createAdminClient()
    await admin.from("payment_events").insert({
      payment_id: args.paymentId || null,
      provider: args.provider || null,
      event_type: args.eventType,
      status: args.status || null,
      message: args.message || null,
      payload: args.payload ?? null,
    })
  } catch {
    // Audit must not block payment flow
  }
}
