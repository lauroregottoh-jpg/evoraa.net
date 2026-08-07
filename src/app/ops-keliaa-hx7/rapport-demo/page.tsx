import Link from "next/link"
import { getAdminDashboardData } from "@/app/actions/admin"
import { createAdminClient } from "@/utils/supabase/admin"
import { canAccessOpsConsole, OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import { buildLivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { PersonalizedReportView } from "@/components/rapport/PersonalizedReportView"
import {
  ASSESSMENT_ORDER,
  type AssessmentSlug,
} from "@/lib/assessments/questionBank"
import { TEST_IDS } from "@/lib/assessments/testIds"

export const dynamic = "force-dynamic"

type Psych = {
  personality?: number | null
  spiritual?: number | null
  relationship?: number | null
  couple_life?: number | null
  finances?: number | null
  dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
}

/** Jeu de démo si aucun membre n’a encore de tests en base. */
const FALLBACK_PSYCH: Psych = {
  personality: 78,
  spiritual: 84,
  relationship: 62,
  couple_life: 71,
  finances: 69,
  dimensions: {
    personality: {
      emotional_stability: 72,
      communication: 65,
      openness: 80,
      reliability: 74,
    },
    spiritual: {
      prayer: 88,
      service: 76,
      church: 82,
    },
    relationship: {
      conflict: 55,
      listening: 68,
      affection: 70,
    },
    couple_life: {
      marriage_vision: 75,
      children: 68,
      daily_rhythm: 71,
    },
    finances: {
      stewardship: 70,
      transparency: 66,
      priorities: 72,
    },
  },
}

function psychFromTestRows(
  rows: { test_id: string; score: number | null; dimensions: unknown }[]
): Psych | null {
  if (!rows.length) return null
  const dimensionsByPillar: Partial<Record<AssessmentSlug, Record<string, number>>> =
    {}
  const scores: Psych = {}
  for (const slug of ASSESSMENT_ORDER) {
    const row = rows.find((r) => r.test_id === TEST_IDS[slug])
    if (!row) continue
    scores[slug] = row.score != null ? Number(row.score) : null
    if (row.dimensions && typeof row.dimensions === "object") {
      dimensionsByPillar[slug] = row.dimensions as Record<string, number>
    }
  }
  if (Object.keys(dimensionsByPillar).length === 0 && Object.keys(scores).length === 0) {
    return null
  }
  return { ...scores, dimensions: dimensionsByPillar }
}

/** Aperçu admin : rapport Alliance (données réelles si dispo, sinon démo). */
export default async function OpsRapportDemoPage() {
  let data: Awaited<ReturnType<typeof getAdminDashboardData>>
  try {
    data = await getAdminDashboardData()
  } catch {
    return <Gate title="Console indisponible" body="Erreur temporaire." />
  }

  if (data.error || !data.viewerRole) {
    return (
      <Gate
        title="Accès réservé"
        body={data.error || "Connectez-vous avec un compte administrateur."}
      />
    )
  }

  if (!canAccessOpsConsole({ role: data.viewerRole })) {
    return (
      <Gate title="Accès refusé" body="Réservé à l’équipe ops KELIAA." />
    )
  }

  const admin = createAdminClient()

  let chosen: { firstName: string; psych: Psych; label: string } | null = null

  const { data: recentResults } = await admin
    .from("test_results")
    .select("user_id, test_id, score, dimensions")
    .order("completed_at", { ascending: false })
    .limit(400)

  const byUser = new Map<
    string,
    { test_id: string; score: number | null; dimensions: unknown }[]
  >()
  for (const r of recentResults ?? []) {
    const uid = r.user_id as string
    if (!uid) continue
    const list = byUser.get(uid) ?? []
    list.push({
      test_id: r.test_id as string,
      score: r.score as number | null,
      dimensions: r.dimensions,
    })
    byUser.set(uid, list)
  }

  const candidateIds = [...byUser.entries()]
    .filter(([, rows]) => rows.length >= 2)
    .map(([uid]) => uid)
    .slice(0, 20)

  if (candidateIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("user_id, first_name, last_name, psychometric_results")
      .in("user_id", candidateIds)

    for (const p of profiles ?? []) {
      const uid = p.user_id as string
      const fromRows = psychFromTestRows(byUser.get(uid) ?? [])
      const fromProfile = p.psychometric_results as Psych | null
      const psych =
        fromRows?.dimensions && Object.keys(fromRows.dimensions).length > 0
          ? fromRows
          : fromProfile?.dimensions
            ? fromProfile
            : fromRows
      if (!psych) continue
      const fn = (p.first_name as string) || "Membre"
      const ln = ((p.last_name as string) || "").trim()
      chosen = {
        firstName: fn,
        psych,
        label: `Données réelles · ${fn}${ln ? ` ${ln[0]}.` : ""}`,
      }
      break
    }
  }

  if (!chosen) {
    chosen = {
      firstName: "Chloé",
      psych: FALLBACK_PSYCH,
      label: "Exemple illustratif (aucun profil avec tests en base)",
    }
  }

  const living = buildLivingPersonalizedReport({
    firstName: chosen.firstName,
    psychometric: chosen.psych,
    isAlliance: true,
  })

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto mb-4 flex flex-wrap gap-3 text-sm">
        <Link href={OPS_CONSOLE_PATH} className="text-primary underline font-semibold">
          ← Console ops
        </Link>
        <span className="text-muted-foreground">
          Aperçu Rapport Personnalisé Alliance™ (PDF ensuite)
        </span>
      </div>
      <PersonalizedReportView
        firstName={chosen.firstName}
        living={living}
        isAlliance
        demoLabel={chosen.label}
      />
    </div>
  )
}

function Gate({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#F4F6F5]">
      <div className="max-w-md text-center space-y-3 rounded-2xl border border-border bg-card p-8">
        <h1 className="font-serif text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{body}</p>
        <Link
          href={`/login?next=${encodeURIComponent(`${OPS_CONSOLE_PATH}/rapport-demo`)}`}
          className="text-primary underline text-sm"
        >
          Se connecter
        </Link>
      </div>
    </main>
  )
}
