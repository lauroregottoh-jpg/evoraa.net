/**
 * Seuils Free → upgrade (proxies app).
 * Quotas exacts Realtime/egress : dashboard Supabase.
 */

export const CAPACITY_SETTING_KEY = "ops_capacity_alerts" as const

export const CAPACITY_THRESHOLDS = {
  /** Soft-launch checklist */
  profilesWarn: 800,
  profilesCritical: 1000,
  /** Proxy activité chat 24h — alerte avant plafond Realtime Free (~200) */
  messages24hWarn: 400,
  messages24hCritical: 1200,
  /** Outbox DLQ */
  outboxFailedWarn: 5,
  outboxFailedCritical: 20,
  /** Paiements pending stagnants (1h–72h) */
  pendingPaymentsWarn: 15,
  pendingPaymentsCritical: 40,
} as const

export type CapacitySeverity = "ok" | "warn" | "critical"

export type CapacityAlert = {
  id: string
  severity: CapacitySeverity
  title: string
  detail: string
  /** Abonnement recommandé */
  upgrade: "supabase_pro" | "vercel_pro" | "openai" | "none"
}

export type CapacitySnapshot = {
  checkedAt: string
  profiles: number
  messages24h: number
  outboxFailed: number
  pendingPayments: number
  killSwitches: {
    maintenanceMode: boolean
    paymentsPaused: boolean
    registrationsPaused: boolean
  }
  alerts: CapacityAlert[]
  worst: CapacitySeverity
}

export function rankSeverity(a: CapacitySeverity, b: CapacitySeverity): CapacitySeverity {
  const order = { ok: 0, warn: 1, critical: 2 }
  return order[a] >= order[b] ? a : b
}

export function parseCapacitySnapshot(value: unknown): CapacitySnapshot | null {
  if (!value || typeof value !== "object") return null
  const v = value as Partial<CapacitySnapshot>
  if (!v.checkedAt || !Array.isArray(v.alerts)) return null
  return v as CapacitySnapshot
}
