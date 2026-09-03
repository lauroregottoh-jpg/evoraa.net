/**
 * Digest ops quotidien — email fin de journée + archive platform_settings.
 */

import { createAdminClient } from "@/utils/supabase/admin"
import { enqueueEmail } from "@/lib/email/outbox"

const ARCHIVE_KEY = "ops_daily_digest_archive"
const ARCHIVE_MAX = 60

export type DailyOpsDigest = {
  dayKey: string
  generatedAt: string
  totals: {
    profilesTotal: number
    newProfilesToday: number
    pendingModeration: number
    pendingPhotos: number
    likesToday: number
    favoritesTotal: number
    mutualPairsApprox: number
    conversationsToday: number
    messagesToday: number
    activeAlliance: number
    assessmentsTouchedToday: number
  }
  headline: string
  bullets: string[]
}

function dayKeyLome(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

function startOfTodayIso() {
  return `${dayKeyLome()}T00:00:00.000Z`
}

export async function buildDailyOpsDigest(): Promise<DailyOpsDigest> {
  const admin = createAdminClient()
  const dayKey = dayKeyLome()
  const since = startOfTodayIso()
  const nowIso = new Date().toISOString()

  await admin
    .from("subscriptions")
    .update({ status: "expired" })
    .eq("status", "active")
    .lt("ends_at", nowIso)

  const [
    profilesTotalRes,
    newProfilesRes,
    pendingModRes,
    pendingPhotosRes,
    likesTodayRes,
    favoritesTotalRes,
    conversationsTodayRes,
    messagesTodayRes,
    allianceRowsRes,
    favsRes,
    psyRes,
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("moderation_status", "pending"),
    admin
      .from("user_photos")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("profile_favorites")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    admin.from("profile_favorites").select("id", { count: "exact", head: true }),
    admin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    admin
      .from("messages")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    admin
      .from("subscriptions")
      .select("user_id")
      .eq("status", "active")
      .eq("plan", "premium_plus")
      .or(`ends_at.is.null,ends_at.gt.${nowIso}`),
    admin
      .from("profile_favorites")
      .select("owner_profile_id, target_profile_id")
      .limit(5000),
    admin
      .from("profiles")
      .select("id")
      .gte("updated_at", since)
      .not("psychometric_results", "is", null)
      .limit(2000),
  ])

  const activeAlliance = new Set(
    (allianceRowsRes.data || []).map((r) => r.user_id as string).filter(Boolean)
  ).size

  const directed = new Set<string>()
  for (const f of favsRes.data || []) {
    directed.add(`${f.owner_profile_id}->${f.target_profile_id}`)
  }
  let mutualPairsApprox = 0
  const seen = new Set<string>()
  for (const f of favsRes.data || []) {
    const a = String(f.owner_profile_id)
    const b = String(f.target_profile_id)
    const key = [a, b].sort().join(":")
    if (seen.has(key)) continue
    if (directed.has(`${b}->${a}`)) {
      seen.add(key)
      mutualPairsApprox += 1
    }
  }

  const totals = {
    profilesTotal: profilesTotalRes.count ?? 0,
    newProfilesToday: newProfilesRes.count ?? 0,
    pendingModeration: pendingModRes.count ?? 0,
    pendingPhotos: pendingPhotosRes.count ?? 0,
    likesToday: likesTodayRes.count ?? 0,
    favoritesTotal: favoritesTotalRes.count ?? 0,
    mutualPairsApprox,
    conversationsToday: conversationsTodayRes.count ?? 0,
    messagesToday: messagesTodayRes.count ?? 0,
    activeAlliance,
    assessmentsTouchedToday: (psyRes.data || []).length,
  }

  const bullets = [
    `${totals.newProfilesToday} nouvelle(s) inscription(s) aujourd’hui (${totals.profilesTotal} au total)`,
    `${totals.likesToday} like(s) aujourd’hui · ${totals.favoritesTotal} likes cumulés · ~${totals.mutualPairsApprox} mutuel(s)`,
    `${totals.conversationsToday} conversation(s) initiée(s) · ${totals.messagesToday} message(s)`,
    `${totals.activeAlliance} Alliance active(s) (membres uniques non expirés)`,
    `${totals.pendingModeration} profil(s) + ${totals.pendingPhotos} photo(s) en attente de modération`,
    `${totals.assessmentsTouchedToday} profil(s) avec tests / MAJ aujourd’hui`,
  ]

  return {
    dayKey,
    generatedAt: new Date().toISOString(),
    totals,
    headline: `Rapport KELIAA — ${dayKey} · ${totals.newProfilesToday} inscrits · ${totals.likesToday} likes · ${totals.conversationsToday} convos`,
    bullets,
  }
}

export async function runDailyOpsDigest(): Promise<{
  ok: boolean
  digest: DailyOpsDigest
  emailed: boolean
}> {
  const digest = await buildDailyOpsDigest()
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", ARCHIVE_KEY)
    .maybeSingle()

  const prev = Array.isArray(existing?.value) ? (existing!.value as unknown[]) : []
  const nextArchive = [
    {
      date: digest.dayKey,
      generatedAt: digest.generatedAt,
      headline: digest.headline,
      bullets: digest.bullets,
      totals: digest.totals,
    },
    ...prev.filter((d) => {
      if (!d || typeof d !== "object") return false
      return (d as { date?: string }).date !== digest.dayKey
    }),
  ].slice(0, ARCHIVE_MAX)

  await admin.from("platform_settings").upsert({
    key: ARCHIVE_KEY,
    value: nextArchive,
    updated_at: new Date().toISOString(),
  })

  const to =
    process.env.CONTACT_INBOX_EMAIL?.trim() ||
    process.env.OPS_ALERT_EMAIL?.trim() ||
    "lauroregottoh@gmail.com"

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2B2421">
      <h1 style="font-size:22px;color:#5C1F28">${digest.headline}</h1>
      <p style="color:#666;font-size:13px">Généré automatiquement · ${digest.dayKey}</p>
      <ul style="line-height:1.7;font-size:15px">
        ${digest.bullets.map((b) => `<li>${b}</li>`).join("")}
      </ul>
      <p style="margin-top:24px;font-size:13px">
        <a href="https://www.keliaa.org/ops-keliaa-hx7">Ouvrir le dashboard ops</a>
      </p>
    </div>
  `

  const queued = await enqueueEmail({
    to,
    subject: `[KELIAA] ${digest.headline}`,
    html,
  })

  return { ok: true, digest, emailed: "queued" in queued }
}
