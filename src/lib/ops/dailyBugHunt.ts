import { createAdminClient } from "@/utils/supabase/admin"
import {
  countFailedEmailOutbox,
  enqueueEmail,
  processEmailOutbox,
} from "@/lib/email/outbox"
import { getKillSwitches } from "@/lib/platform/killSwitches"
import { resolveSupabaseUrl } from "@/lib/config/supabase"
import {
  BUG_HUNT_SETTING_KEY,
  type BugFinding,
  type BugHuntReport,
} from "@/lib/ops/bugHuntTypes"

export type { BugFinding, BugHuntReport }
export { BUG_HUNT_SETTING_KEY, parseBugHuntReport } from "@/lib/ops/bugHuntTypes"

/**
 * Chasse bugs quotidienne — détecte + corrige UNIQUEMENT l’allowlist ops.
 * Jamais : auth, RLS, CSP, secrets, provider paiement, kill-switch ON, migrations.
 */
export async function runDailyBugHunt(): Promise<BugHuntReport> {
  const findings: BugFinding[] = []
  let fixed = 0

  // 1) Health Auth Supabase
  try {
    const url = resolveSupabaseUrl()
    const started = Date.now()
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      findings.push({
        id: "auth_health",
        severity: "fail",
        title: "Auth Supabase unhealthy",
        detail: `status_${res.status} en ${Date.now() - started}ms`,
      })
    } else {
      findings.push({
        id: "auth_health",
        severity: "info",
        title: "Auth OK",
        detail: `${Date.now() - started}ms`,
      })
    }
  } catch (e) {
    findings.push({
      id: "auth_health",
      severity: "fail",
      title: "Auth probe failed",
      detail: e instanceof Error ? e.message : "probe_failed",
    })
  }

  // 2) Outbox DLQ — auto : requeue failed → pending (attempts reset soft)
  const failedCount = await countFailedEmailOutbox()
  if (failedCount > 0) {
    const requeued = await requeueFailedOutbox(25)
    fixed += requeued
    findings.push({
      id: "outbox_dlq",
      severity: requeued > 0 ? "warn" : "fail",
      title: "Emails failed en outbox",
      detail: `${failedCount} failed ; ${requeued} remis en file`,
      autoFixed: requeued > 0,
      fixNote: requeued > 0 ? "requeue_failed_outbox" : undefined,
    })
  }

  // 3) Flush pending outbox (même logique cron email-outbox)
  try {
    const out = await processEmailOutbox(30)
    if (out.error) {
      findings.push({
        id: "outbox_flush",
        severity: "warn",
        title: "Flush outbox partiel",
        detail: out.error,
      })
    } else if (out.processed > 0) {
      findings.push({
        id: "outbox_flush",
        severity: "info",
        title: "Outbox flushé",
        detail: `processed=${out.processed} sent=${out.sent} failed=${out.failed}`,
        autoFixed: out.sent > 0,
        fixNote: "process_email_outbox",
      })
      if (out.sent > 0) fixed += 1
    }
  } catch (e) {
    findings.push({
      id: "outbox_flush",
      severity: "warn",
      title: "Flush outbox erreur",
      detail: e instanceof Error ? e.message : "flush_failed",
    })
  }

  // 4) Rate-limit buckets expirés — cleanup safe
  const cleaned = await cleanupExpiredRateLimits()
  if (cleaned > 0) {
    fixed += 1
    findings.push({
      id: "rl_cleanup",
      severity: "info",
      title: "Rate-limit buckets expirés nettoyés",
      detail: `${cleaned} lignes`,
      autoFixed: true,
      fixNote: "cleanup_rate_limit_buckets",
    })
  }

  // 5) Kill switches — informatif seulement (jamais auto-ON/OFF)
  const ks = await getKillSwitches()
  if (ks.maintenanceMode || ks.paymentsPaused || ks.registrationsPaused) {
    findings.push({
      id: "kill_switches",
      severity: "warn",
      title: "Kill switch(es) actifs",
      detail: [
        ks.maintenanceMode ? "maintenance" : null,
        ks.paymentsPaused ? "payments_paused" : null,
        ks.registrationsPaused ? "registrations_paused" : null,
      ]
        .filter(Boolean)
        .join(", "),
    })
  }

  // 6) Env critiques manquants (lecture seule)
  if (!process.env.CRON_SECRET?.trim()) {
    findings.push({
      id: "env_cron",
      severity: "fail",
      title: "CRON_SECRET manquant",
      detail: "Les crons Vercel ne peuvent pas s’authentifier.",
    })
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    findings.push({
      id: "env_service_role",
      severity: "fail",
      title: "SUPABASE_SERVICE_ROLE_KEY manquant",
      detail: "Ops / webhooks / crons cassés.",
    })
  }

  const needsHuman = findings.filter(
    (f) => f.severity === "fail" || (f.severity === "warn" && !f.autoFixed)
  ).length
  const ok = !findings.some((f) => f.severity === "fail")

  const report: BugHuntReport = {
    checkedAt: new Date().toISOString(),
    findings,
    fixed,
    needsHuman,
    ok,
  }

  try {
    const admin = createAdminClient()
    await admin.from("platform_settings").upsert({
      key: BUG_HUNT_SETTING_KEY,
      value: report as never,
      updated_at: new Date().toISOString(),
    })
    await admin.from("admin_audit_log").insert({
      actor_user_id: null,
      actor_email: "cron:daily-bug-hunt",
      action: "daily_bug_hunt",
      target_type: "ops",
      target_id: null,
      meta: {
        ok: report.ok,
        fixed: report.fixed,
        needsHuman: report.needsHuman,
        findings: report.findings.map((f) => ({
          id: f.id,
          severity: f.severity,
          autoFixed: f.autoFixed ?? false,
        })),
      },
    })
  } catch (e) {
    console.error("[daily-bug-hunt] persist", e)
  }

  if (!ok || needsHuman > 0) {
    await notifyOpsBugHunt(report)
  }

  return report
}

async function requeueFailedOutbox(limit: number): Promise<number> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("email_outbox")
      .select("id, attempts")
      .eq("status", "failed")
      .order("updated_at", { ascending: true })
      .limit(limit)
    if (error || !data?.length) return 0

    let n = 0
    for (const row of data) {
      const attempts = Number(row.attempts ?? 0)
      // Ne pas boucler à l’infini : max 2 requeues auto (attempts < 7)
      if (attempts >= 7) continue
      const { error: upErr } = await admin
        .from("email_outbox")
        .update({
          status: "pending",
          send_after: new Date().toISOString(),
          last_error: "requeued_by_daily_bug_hunt",
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
      if (!upErr) n += 1
    }
    return n
  } catch {
    return 0
  }
}

async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    const admin = createAdminClient()
    // Buckets inactifs > 48h (window_start / updated_at)
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const { data, error } = await admin
      .from("rate_limit_buckets")
      .delete()
      .lt("updated_at", cutoff)
      .select("bucket_key")
    if (error) return 0
    return data?.length ?? 0
  } catch {
    return 0
  }
}

async function notifyOpsBugHunt(report: BugHuntReport) {
  const to =
    process.env.CONTACT_INBOX_EMAIL?.trim() ||
    process.env.OPS_ALERT_EMAIL?.trim()
  if (!to) return

  const rows = report.findings
    .filter((f) => f.severity !== "info")
    .map(
      (f) =>
        `<li><strong>[${f.severity}]</strong> ${f.title} — ${f.detail}` +
        (f.autoFixed ? ` <em>(auto: ${f.fixNote})</em>` : "") +
        `</li>`
    )
    .join("")

  await enqueueEmail({
    to,
    subject: `[KELIAA] Bug hunt ${report.ok ? "WARN" : "FAIL"} — ${report.needsHuman} à revoir`,
    html: `<p>Chasse bugs ${report.checkedAt}</p>
<p>Fixes auto : ${report.fixed} · À revoir : ${report.needsHuman}</p>
<ul>${rows || "<li>Aucun détail</li>"}</ul>
<p>Auth / paiements / RLS ne sont jamais auto-modifiés.</p>`,
  })
}
