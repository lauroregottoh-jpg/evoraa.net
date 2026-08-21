"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { canAccessOpsConsole, resolveAuthEmail } from "@/lib/admin/consolePath"

async function requireOps() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  if (
    !canAccessOpsConsole({
      role: profile?.role,
      email: resolveAuthEmail(user),
    })
  ) {
    return { error: "Accès réservé." as const }
  }
  return { ok: true as const, userId: user.id }
}

export type AdminCoachRow = {
  id: string
  displayName: string
  coachCode: string
  gender: string | null
  status: string
  userId: string | null
  sessionCount: number
  completedCount: number
  avgRating: number | null
  ratingCount: number
}

export type AdminCoachingSessionRow = {
  id: string
  status: string
  coachId: string
  coachName: string
  userId: string
  memberName: string | null
  memberEmail: string | null
  displayedMinutes: number
  startedAt: string | null
  endedAt: string | null
  createdAt: string | null
  transcriptStatus: string
  transcriptPreview: string | null
  adminNotes: string | null
  clientScore: number | null
  coachScore: number | null
  clientFeedback: string | null
}

export type AdminCoachingOpsData = {
  kpis: {
    coachesActive: number
    sessionsTotal: number
    sessionsCompleted: number
    sessionsActive: number
    membersWithCredits: number
    creditsSold: number
    avgClientRating: number | null
  }
  coaches: AdminCoachRow[]
  sessions: AdminCoachingSessionRow[]
  recentBuyers: Array<{
    userId: string
    name: string | null
    email: string | null
    credits: number
  }>
}

export async function getAdminCoachingOpsData(): Promise<{
  error?: string
  data?: AdminCoachingOpsData
}> {
  const gate = await requireOps()
  if ("error" in gate) return { error: gate.error }

  const admin = createAdminClient()

  const [
    { data: coaches },
    { data: sessions },
    { data: ratings },
    { data: ledger },
  ] = await Promise.all([
    admin
      .from("coaches")
      .select("id, display_name, coach_code, gender, status, user_id")
      .order("created_at", { ascending: false }),
    admin
      .from("coaching_sessions")
      .select(
        "id, status, coach_id, user_id, displayed_minutes, started_at, ended_at, created_at, transcript_text, transcript_status, admin_notes"
      )
      .order("created_at", { ascending: false })
      .limit(200),
    admin
      .from("coaching_ratings")
      .select("session_id, rater_role, score, free_text")
      .limit(500),
    admin
      .from("coaching_credits_ledger")
      .select("user_id, delta_credits, reason")
      .limit(2000),
  ])

  const coachList = coaches || []
  const sessionList = sessions || []
  const ratingList = ratings || []
  const ledgerList = ledger || []

  const userIds = [
    ...new Set([
      ...sessionList.map((s) => s.user_id as string),
      ...ledgerList.filter((l) => Number(l.delta_credits) > 0).map((l) => l.user_id as string),
    ]),
  ]

  const { data: profiles } =
    userIds.length > 0
      ? await admin
          .from("profiles")
          .select("user_id, first_name, last_name")
          .in("user_id", userIds)
      : { data: [] }

  const emailById = new Map<string, string>()
  // Emails via auth admin (profiles may not store email)
  for (const uid of userIds.slice(0, 80)) {
    try {
      const { data } = await admin.auth.admin.getUserById(uid)
      if (data?.user?.email) emailById.set(uid, data.user.email)
    } catch {
      /* ignore */
    }
  }

  const profileMap = new Map(
    (profiles || []).map((p) => [
      p.user_id as string,
      {
        name: [p.first_name, p.last_name].filter(Boolean).join(" ") || null,
        email: emailById.get(p.user_id as string) || null,
      },
    ])
  )

  const coachName = new Map(
    coachList.map((c) => [c.id as string, c.display_name as string])
  )

  const ratingsBySession = new Map<
    string,
    { client?: { score: number; text: string | null }; coach?: { score: number; text: string | null } }
  >()
  for (const r of ratingList) {
    const sid = r.session_id as string
    const cur = ratingsBySession.get(sid) || {}
    if (r.rater_role === "client") {
      cur.client = { score: Number(r.score), text: (r.free_text as string) || null }
    } else {
      cur.coach = { score: Number(r.score), text: (r.free_text as string) || null }
    }
    ratingsBySession.set(sid, cur)
  }

  const coachStats = new Map<
    string,
    { sessionCount: number; completedCount: number; scores: number[] }
  >()
  for (const s of sessionList) {
    const cid = s.coach_id as string
    const st = coachStats.get(cid) || {
      sessionCount: 0,
      completedCount: 0,
      scores: [],
    }
    st.sessionCount += 1
    if (s.status === "COMPLETED") st.completedCount += 1
    const rat = ratingsBySession.get(s.id as string)
    if (rat?.client) st.scores.push(rat.client.score)
    coachStats.set(cid, st)
  }

  const coachesOut: AdminCoachRow[] = coachList.map((c) => {
    const st = coachStats.get(c.id as string)
    const scores = st?.scores || []
    return {
      id: c.id as string,
      displayName: c.display_name as string,
      coachCode: c.coach_code as string,
      gender: (c.gender as string) || null,
      status: c.status as string,
      userId: (c.user_id as string) || null,
      sessionCount: st?.sessionCount || 0,
      completedCount: st?.completedCount || 0,
      avgRating:
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : null,
      ratingCount: scores.length,
    }
  })

  const sessionsOut: AdminCoachingSessionRow[] = sessionList.map((s) => {
    const prof = profileMap.get(s.user_id as string)
    const rat = ratingsBySession.get(s.id as string)
    const transcript = (s.transcript_text as string) || null
    return {
      id: s.id as string,
      status: s.status as string,
      coachId: s.coach_id as string,
      coachName: coachName.get(s.coach_id as string) || "—",
      userId: s.user_id as string,
      memberName: prof?.name || null,
      memberEmail: prof?.email || null,
      displayedMinutes: Number(s.displayed_minutes || 30),
      startedAt: (s.started_at as string) || null,
      endedAt: (s.ended_at as string) || null,
      createdAt: (s.created_at as string) || null,
      transcriptStatus: (s.transcript_status as string) || "none",
      transcriptPreview: transcript
        ? transcript.slice(0, 280) + (transcript.length > 280 ? "…" : "")
        : null,
      adminNotes: (s.admin_notes as string) || null,
      clientScore: rat?.client?.score ?? null,
      coachScore: rat?.coach?.score ?? null,
      clientFeedback: rat?.client?.text ?? null,
    }
  })

  const creditByUser = new Map<string, number>()
  let creditsSold = 0
  for (const row of ledgerList) {
    const uid = row.user_id as string
    const d = Number(row.delta_credits || 0)
    creditByUser.set(uid, (creditByUser.get(uid) || 0) + d)
    if (d > 0) creditsSold += d
  }

  const recentBuyers = [...creditByUser.entries()]
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([userId, credits]) => {
      const prof = profileMap.get(userId)
      return {
        userId,
        name: prof?.name || null,
        email: prof?.email || null,
        credits,
      }
    })

  const clientScores = ratingList
    .filter((r) => r.rater_role === "client")
    .map((r) => Number(r.score))
  const avgClientRating =
    clientScores.length > 0
      ? Math.round(
          (clientScores.reduce((a, b) => a + b, 0) / clientScores.length) * 10
        ) / 10
      : null

  return {
    data: {
      kpis: {
        coachesActive: coachList.filter((c) => c.status === "active").length,
        sessionsTotal: sessionList.length,
        sessionsCompleted: sessionList.filter((s) => s.status === "COMPLETED")
          .length,
        sessionsActive: sessionList.filter((s) =>
          ["WAITING", "PREP", "CONNECTING", "ACTIVE", "GRACE_PERIOD"].includes(
            s.status as string
          )
        ).length,
        membersWithCredits: [...creditByUser.values()].filter((c) => c > 0).length,
        creditsSold,
        avgClientRating,
      },
      coaches: coachesOut,
      sessions: sessionsOut,
      recentBuyers,
    },
  }
}

export async function adminUpdateSessionNotesAction(input: {
  sessionId: string
  adminNotes: string
}): Promise<{ error?: string; ok?: boolean }> {
  const gate = await requireOps()
  if ("error" in gate) return { error: gate.error }

  const admin = createAdminClient()
  const { error } = await admin
    .from("coaching_sessions")
    .update({ admin_notes: input.adminNotes })
    .eq("id", input.sessionId)

  if (error) return { error: error.message }
  return { ok: true }
}

/** Seed démo transcription pour previews ops (sans audio réel). */
export async function adminSeedDemoTranscriptAction(sessionId: string): Promise<{
  error?: string
  ok?: boolean
}> {
  const gate = await requireOps()
  if ("error" in gate) return { error: gate.error }

  const sample = [
    "[00:01] Coach — Bonjour, merci d’être là. Qu’est-ce qui vous amène aujourd’hui ?",
    "[00:45] Membre — J’ai du mal à clarifier ce que j’attends dans une relation.",
    "[03:20] Coach — On va partir de vos besoins, pas des peurs. Qu’est-ce qui compte vraiment pour vous ?",
    "[08:10] Membre — La confiance et le respect des valeurs. Je me sens souvent précipité(e).",
    "[14:00] Coach — Résumons : besoin de rythme, clarté sur les valeurs, et un prochain pas concret.",
    "[22:30] Coach — Votre micro-action : une conversation de 15 minutes cette semaine sur vos non-négociables.",
  ].join("\n")

  const admin = createAdminClient()
  const { error } = await admin
    .from("coaching_sessions")
    .update({
      transcript_text: sample,
      transcript_status: "ready",
    })
    .eq("id", sessionId)

  if (error) return { error: error.message }
  return { ok: true }
}
