import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { computeMissingProfileFields } from "@/lib/admin/userValidation"

function authorizeCron(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  return auth === `Bearer ${secret}`
}

/**
 * Rappels auto — profils incomplets / en attente (notification in-app uniquement).
 * Pas d’e-mail → 0 crédit Resend.
 * Vercel Hobby : cron quotidien.
 */
export async function GET(request: NextRequest) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = Date.now()
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString()

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, gender, birth_date, denomination, church_attended, avatar_url, biography, testimony, marital_status, completion_percentage, moderation_status, onboarding_status, created_at"
    )
    .or("moderation_status.eq.pending,onboarding_status.neq.active")
    .lt("created_at", dayAgo)
    .order("created_at", { ascending: true })
    .limit(150)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let notified = 0
  let skipped = 0

  for (const p of profiles ?? []) {
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

    if (missing.length === 0 && p.moderation_status === "approved") {
      skipped++
      continue
    }

    const title =
      missing.length > 0
        ? "Rappel : complétez votre profil KELIAA"
        : "Profil en cours de validation"

    const body =
      missing.length > 0
        ? `Il manque encore : ${missing.join(", ")}. Complétez votre fiche pour accélérer l’accès à la communauté.`
        : "Votre profil est en revue. Merci pour votre patience — nous revenons vers vous bientôt."

    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", p.user_id)
      .eq("title", title)
      .gte("created_at", threeDaysAgo)
      .limit(1)

    if (existing && existing.length > 0) {
      skipped++
      continue
    }

    const { error: nErr } = await supabase.from("notifications").insert({
      user_id: p.user_id,
      title,
      body,
      is_read: false,
    })
    if (!nErr) notified++
  }

  return NextResponse.json({
    ok: true,
    scanned: profiles?.length ?? 0,
    notified,
    skipped,
  })
}
