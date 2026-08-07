import Link from "next/link"
import { getAdminDashboardData } from "@/app/actions/admin"
import { createAdminClient } from "@/utils/supabase/admin"
import { canAccessOpsConsole, OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import { buildProfileReport } from "@/lib/matching/report/buildProfileReport"
import { PersonalizedReportView } from "@/components/rapport/PersonalizedReportView"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export const dynamic = "force-dynamic"

/** Aperçu admin : rapport Alliance généré depuis un vrai profil avec tests. */
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
  const { data: profiles } = await admin
    .from("profiles")
    .select("user_id, first_name, last_name, psychometric_results")
    .not("psychometric_results", "is", null)
    .limit(100)

  type Psych = {
    personality?: number | null
    spiritual?: number | null
    relationship?: number | null
    couple_life?: number | null
    finances?: number | null
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
  }

  let chosen: {
    firstName: string
    psych: Psych
    label: string
  } | null = null

  for (const p of profiles ?? []) {
    const psych = p.psychometric_results as Psych | null
    if (!psych?.dimensions) continue
    const dimCount = Object.values(psych.dimensions).filter(
      (d) => d && Object.keys(d).length > 0
    ).length
    if (dimCount < 2) continue
    const fn = (p.first_name as string) || "Membre"
    const ln = ((p.last_name as string) || "").trim()
    chosen = {
      firstName: fn,
      psych,
      label: `Données réelles · ${fn}${ln ? ` ${ln[0]}.` : ""}`,
    }
    break
  }

  if (!chosen) {
    return (
      <Gate
        title="Aucun profil avec tests"
        body="Complétez les 5 tests sur un compte, puis rechargez."
      />
    )
  }

  const report = buildProfileReport({
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
        <span className="text-muted-foreground">Aperçu rapport Alliance (PDF ensuite)</span>
      </div>
      <PersonalizedReportView
        firstName={chosen.firstName}
        report={report}
        isAlliance
        demoLabel={chosen.label}
        scores={{
          personality: chosen.psych.personality ?? null,
          spiritual: chosen.psych.spiritual ?? null,
          relationship: chosen.psych.relationship ?? null,
          couple_life: chosen.psych.couple_life ?? null,
          finances: chosen.psych.finances ?? null,
        }}
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
