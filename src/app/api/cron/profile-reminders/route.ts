import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { computeMissingProfileFields } from "@/lib/admin/userValidation"
import { parsePillars } from "@/lib/admin/matchingIntelligence"
import {
  buildEvaReminders,
  pickPrimaryEvaReminder,
} from "@/lib/eva/reminders"
import { verifyCronSecret } from "@/lib/security/cronAuth"

/**
 * Rappels Eva auto — profils / photo / tests incomplets (notification in-app).
 * Pas d’e-mail → 0 crédit Resend. Dédup 3 jours sur le titre Eva.
 */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  const supabase = createAdminClient()
  const now = Date.now()
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString()

  // 1) Onboarding / pending (comme avant)
  const { data: incomplete, error: e1 } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, gender, birth_date, denomination, church_attended, avatar_url, biography, testimony, marital_status, completion_percentage, moderation_status, onboarding_status, psychometric_results, created_at"
    )
    .or("moderation_status.eq.pending,onboarding_status.neq.active")
    .lt("created_at", dayAgo)
    .order("created_at", { ascending: true })
    .limit(120)

  if (e1) {
    return NextResponse.json({ error: e1.message }, { status: 500 })
  }

  // 2) Membres actifs incomplets (photo / tests) — Eva rappelle aussi là
  const { data: activeGap, error: e2 } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, gender, birth_date, denomination, church_attended, avatar_url, biography, testimony, marital_status, completion_percentage, moderation_status, onboarding_status, psychometric_results, created_at"
    )
    .eq("onboarding_status", "active")
    .eq("moderation_status", "approved")
    .lt("created_at", dayAgo)
    .order("updated_at", { ascending: true })
    .limit(80)

  if (e2) {
    return NextResponse.json({ error: e2.message }, { status: 500 })
  }

  type ProfileRow = {
    id: string
    user_id: string
    first_name: string | null
    last_name: string | null
    city: string | null
    gender: string | null
    birth_date: string | null
    denomination: string | null
    church_attended: string | null
    avatar_url: string | null
    biography: string | null
    testimony: string | null
    marital_status: string | null
    completion_percentage: number | null
    moderation_status: string | null
    onboarding_status: string | null
    psychometric_results: unknown
    created_at: string | null
  }

  const byUser = new Map<string, ProfileRow>()
  for (const raw of [...(incomplete ?? []), ...(activeGap ?? [])]) {
    const p = raw as ProfileRow
    if (!p.user_id) continue
    byUser.set(p.user_id, p)
  }

  let notified = 0
  let skipped = 0

  for (const p of byUser.values()) {
    let age: number | null = null
    if (p.birth_date) {
      const y = new Date(p.birth_date as string).getFullYear()
      if (Number.isFinite(y)) age = new Date().getFullYear() - y
    }
    const name =
      [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom"
    const missing = computeMissingProfileFields({
      name,
      city: (p.city as string) || "?",
      gender: (p.gender as string) || "?",
      age,
      denomination: (p.denomination as string) || "",
      church: (p.church_attended as string) || "",
      hasAvatar: Boolean(p.avatar_url),
      hasBiography: Boolean(
        typeof p.biography === "string" && p.biography.trim()
      ),
      hasTestimony: Boolean(
        typeof p.testimony === "string" && p.testimony.trim()
      ),
      hasMaritalStatus: Boolean(p.marital_status),
    })

    const { completed } = parsePillars(p.psychometric_results)
    const reminders = buildEvaReminders({
      firstName: p.first_name as string | null,
      missingFields: missing,
      hasAvatar: Boolean(p.avatar_url),
      pillarsCompleted: completed,
      pillarsTotal: 5,
      moderationStatus: p.moderation_status as string | null,
    })

    const primary = pickPrimaryEvaReminder(reminders)
    if (!primary) {
      skipped++
      continue
    }

    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", p.user_id)
      .eq("title", primary.title)
      .gte("created_at", threeDaysAgo)
      .limit(1)

    if (existing && existing.length > 0) {
      skipped++
      continue
    }

    const { error: nErr } = await supabase.from("notifications").insert({
      user_id: p.user_id,
      title: primary.title,
      body: primary.body,
      is_read: false,
    })
    if (!nErr) notified++
    else skipped++
  }

  return NextResponse.json({
    ok: true,
    scanned: byUser.size,
    notified,
    skipped,
    voice: "eva",
  })
}
