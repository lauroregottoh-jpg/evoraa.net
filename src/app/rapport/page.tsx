import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { buildLivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { RapportHubView } from "@/components/rapport/RapportHubView"
import { DiscoveryRapportTeaser } from "@/components/rapport/DiscoveryRapportTeaser"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export const dynamic = "force-dynamic"

/** Hub Rapport — Alliance : document vivant ; Découverte : aperçu flouté. */
export default async function RapportPage() {
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
            Connectez-vous pour voir votre rapport.
          </p>
          <Link
            href="/login?next=/rapport"
            className="text-primary font-semibold underline"
          >
            Connexion
          </Link>
        </div>
      </MemberPage>
    )
  }

  const [{ data: profile }, usage] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, psychometric_results")
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
        <RapportHubView
          firstName={profile?.first_name}
          living={living}
          isAlliance
        />
        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/rapport/global"
            className="underline font-semibold text-accent"
          >
            Rapport global (toutes les sections)
          </Link>
          {" · "}
          <a
            href="/rapport/telecharger"
            className="underline font-semibold text-primary"
          >
            Télécharger
          </a>
          {" · "}
          <Link href="/assessments" className="underline">
            Continuer mes tests
          </Link>
        </p>
      </div>
    </MemberPage>
  )
}
