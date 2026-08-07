import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { buildLivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { ReportDocumentView } from "@/components/rapport/ReportDocumentView"
import { DiscoveryRapportTeaser } from "@/components/rapport/DiscoveryRapportTeaser"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export const dynamic = "force-dynamic"

/** Rapport global Alliance — reconstruit automatiquement après chaque test. */
export default async function RapportGlobalPage({
  searchParams,
}: {
  searchParams?: Promise<{ maj?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <MemberPage>
        <div className="max-w-lg mx-auto text-center py-12 space-y-3">
          <h1 className="font-serif text-3xl font-bold">
            Rapport Personnalisé Alliance™
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour découvrir votre rapport complet.
          </p>
          <Link
            href="/login?next=/rapport/global"
            className="text-primary font-semibold underline"
          >
            Connexion
          </Link>
        </div>
      </MemberPage>
    )
  }

  const sp = (await searchParams) || {}
  const justUpdated = sp.maj === "1"

  const [{ data: profile }, usage] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, psychometric_results")
      .eq("user_id", user.id)
      .maybeSingle(),
    getUsageSnapshot(user.id),
  ])

  const isAlliance = Boolean(usage?.isPaid)
  if (!isAlliance) {
    return (
      <MemberPage>
        <DiscoveryRapportTeaser firstName={profile?.first_name} />
      </MemberPage>
    )
  }

  const psych = profile?.psychometric_results as {
    personality?: number | null
    spiritual?: number | null
    relationship?: number | null
    couple_life?: number | null
    finances?: number | null
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
  } | null

  const living = buildLivingPersonalizedReport({
    firstName: profile?.first_name,
    psychometric: psych,
    isAlliance: true,
  })

  return (
    <MemberPage>
      <div className="pb-10 space-y-4">
        {justUpdated ? (
          <div className="max-w-3xl mx-auto rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900">
            Rapport mis à jour automatiquement après votre évaluation.
            Les parties liées au test viennent d’être enrichies.
          </div>
        ) : null}
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/rapport" className="underline">
            ← Retour au hub Rapport
          </Link>
          {" · "}
          <a href="/rapport/telecharger" className="underline font-semibold">
            Télécharger le rapport
          </a>
        </p>
        <ReportDocumentView
          firstName={profile?.first_name}
          living={living}
          isAlliance
        />
        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/assessments"
            className="underline font-semibold text-primary"
          >
            Continuer mes tests
          </Link>
          {" · "}
          <Link href="/alliance/parcours" className="underline">
            Mon parcours
          </Link>
        </p>
      </div>
    </MemberPage>
  )
}
