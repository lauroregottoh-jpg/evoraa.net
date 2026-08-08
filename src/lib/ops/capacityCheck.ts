import { createAdminClient } from "@/utils/supabase/admin"
import { countFailedEmailOutbox, enqueueEmail } from "@/lib/email/outbox"
import { getKillSwitches } from "@/lib/platform/killSwitches"
import {
  CAPACITY_SETTING_KEY,
  CAPACITY_THRESHOLDS as T,
  rankSeverity,
  type CapacityAlert,
  type CapacitySeverity,
  type CapacitySnapshot,
} from "@/lib/ops/capacityThresholds"

async function countProfiles(): Promise<number> {
  const admin = createAdminClient()
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null)
  if (error) return -1
  return count ?? 0
}

async function countMessages24h(): Promise<number> {
  const admin = createAdminClient()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count, error } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since)
  if (error) return -1
  return count ?? 0
}

async function countPendingPayments(): Promise<number> {
  const admin = createAdminClient()
  const olderThan = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const newerThan = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  const { count, error } = await admin
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .lte("created_at", olderThan)
    .gte("created_at", newerThan)
  if (error) return -1
  return count ?? 0
}

function buildAlerts(input: {
  profiles: number
  messages24h: number
  outboxFailed: number
  pendingPayments: number
}): CapacityAlert[] {
  const alerts: CapacityAlert[] = []

  if (input.profiles >= 0) {
    if (input.profiles >= T.profilesCritical) {
      alerts.push({
        id: "profiles_critical",
        severity: "critical",
        title: "Inscrits au-delà du soft-launch",
        detail: `${input.profiles} profils (≥ ${T.profilesCritical}). Passez Supabase Pro avant une campagne, et vérifiez Realtime / disque dans le dashboard.`,
        upgrade: "supabase_pro",
      })
    } else if (input.profiles >= T.profilesWarn) {
      alerts.push({
        id: "profiles_warn",
        severity: "warn",
        title: "Approche soft-launch 1 000",
        detail: `${input.profiles} profils (≥ ${T.profilesWarn}). Préparez Supabase Pro et surveillez Usage → Realtime / Database.`,
        upgrade: "supabase_pro",
      })
    }
  }

  if (input.messages24h >= 0) {
    if (input.messages24h >= T.messages24hCritical) {
      alerts.push({
        id: "chat_load_critical",
        severity: "critical",
        title: "Charge messagerie élevée",
        detail: `${input.messages24h} messages / 24h. Risque de saturer Realtime Free (~200 connexions). Passez Supabase Pro.`,
        upgrade: "supabase_pro",
      })
    } else if (input.messages24h >= T.messages24hWarn) {
      alerts.push({
        id: "chat_load_warn",
        severity: "warn",
        title: "Messagerie en hausse",
        detail: `${input.messages24h} messages / 24h. Surveillez les pics Realtime ; Pro si erreurs too_many_connections.`,
        upgrade: "supabase_pro",
      })
    }
  }

  if (input.outboxFailed >= T.outboxFailedCritical) {
    alerts.push({
      id: "outbox_critical",
      severity: "critical",
      title: "Emails en échec (DLQ)",
      detail: `${input.outboxFailed} emails failed. Vérifiez RESEND_API_KEY / domaine expéditeur.`,
      upgrade: "none",
    })
  } else if (input.outboxFailed >= T.outboxFailedWarn) {
    alerts.push({
      id: "outbox_warn",
      severity: "warn",
      title: "Emails en échec",
      detail: `${input.outboxFailed} emails failed dans l’outbox.`,
      upgrade: "none",
    })
  }

  if (input.pendingPayments >= T.pendingPaymentsCritical) {
    alerts.push({
      id: "payments_pending_critical",
      severity: "critical",
      title: "Beaucoup de paiements non terminés",
      detail: `${input.pendingPayments} paiements pending stagnants. Vérifiez webhooks Bictorys/Moneroo et timeouts Vercel.`,
      upgrade: "vercel_pro",
    })
  } else if (input.pendingPayments >= T.pendingPaymentsWarn) {
    alerts.push({
      id: "payments_pending_warn",
      severity: "warn",
      title: "Paiements abandonnés en hausse",
      detail: `${input.pendingPayments} pending stagnants — le cron abandoned-payments relance déjà.`,
      upgrade: "none",
    })
  }

  return alerts
}

export async function runCapacityCheck(): Promise<CapacitySnapshot> {
  const [profiles, messages24h, outboxFailed, pendingPayments, killSwitches] =
    await Promise.all([
      countProfiles(),
      countMessages24h(),
      countFailedEmailOutbox(),
      countPendingPayments(),
      getKillSwitches(),
    ])

  const alerts = buildAlerts({
    profiles,
    messages24h,
    outboxFailed: Math.max(0, outboxFailed),
    pendingPayments: Math.max(0, pendingPayments),
  })

  let worst: CapacitySeverity = "ok"
  for (const a of alerts) worst = rankSeverity(worst, a.severity)

  const snapshot: CapacitySnapshot = {
    checkedAt: new Date().toISOString(),
    profiles,
    messages24h,
    outboxFailed,
    pendingPayments,
    killSwitches,
    alerts,
    worst,
  }

  try {
    const admin = createAdminClient()
    await admin.from("platform_settings").upsert({
      key: CAPACITY_SETTING_KEY,
      value: snapshot as never,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error("[capacity-check] persist", e)
  }

  if (worst !== "ok") {
    await notifyOpsCapacity(snapshot)
  }

  return snapshot
}

async function notifyOpsCapacity(snapshot: CapacitySnapshot) {
  const to =
    process.env.CONTACT_INBOX_EMAIL?.trim() ||
    process.env.OPS_ALERT_EMAIL?.trim()
  if (!to) return

  const lines = snapshot.alerts
    .map(
      (a) =>
        `<li><strong>[${a.severity}]</strong> ${a.title} — ${a.detail}` +
        (a.upgrade !== "none"
          ? ` → <em>${a.upgrade === "supabase_pro" ? "Supabase Pro" : a.upgrade === "vercel_pro" ? "Vercel Pro" : a.upgrade}</em>`
          : "") +
        `</li>`
    )
    .join("")

  await enqueueEmail({
    to,
    subject: `[KELIAA] Capacité ${snapshot.worst.toUpperCase()} — ${snapshot.alerts.length} alerte(s)`,
    html: `<p>Contrôle capacité ${snapshot.checkedAt}</p>
<ul>
<li>Profils : ${snapshot.profiles}</li>
<li>Messages 24h : ${snapshot.messages24h}</li>
<li>Outbox failed : ${snapshot.outboxFailed}</li>
<li>Paiements pending : ${snapshot.pendingPayments}</li>
</ul>
<ul>${lines}</ul>
<p>Voir aussi Usage Supabase (Realtime / Database / Egress) et la console ops.</p>`,
    delaySeconds: 0,
  })
}
