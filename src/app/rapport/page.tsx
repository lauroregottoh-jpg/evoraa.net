import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { buildProfileReport } from "@/lib/matching/report/buildProfileReport"
import { PersonalizedReportView } from "@/components/rapport/PersonalizedReportView"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export const dynamic = "force-dynamic"

export default async function RapportPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <MemberPage>
        <div className="max-w-lg mx-auto text-center py-12 space-y-3">
          <h1 className="font-serif text-3xl font-bold">Rapport personnalisé</h1>
          <p className="text-sm text-muted-foreground">Connectez-vous pour voir votre rapport.</p>
          <Link href="/login?next=/rapport" className="text-primary font-semibold underline">
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

  const psych = profile?.psychometric_results as {
    personality?: number | null
    spiritual?: number | null
    relationship?: number | null
    couple_life?: number | null
    finances?: number | null
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
  } | null

  const isAlliance = Boolean(usage?.isPaid)
  const report = buildProfileReport({
    firstName: profile?.first_name,
    psychometric: psych,
    isAlliance,
  })

  return (
    <MemberPage>
      <div className="pb-10 space-y-4">
        <PersonalizedReportView
          firstName={profile?.first_name}
          report={report}
          isAlliance={isAlliance}
          scores={{
            personality: psych?.personality ?? null,
            spiritual: psych?.spiritual ?? null,
            relationship: psych?.relationship ?? null,
            couple_life: psych?.couple_life ?? null,
            finances: psych?.finances ?? null,
          }}
        />
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/premium" className="underline font-semibold text-primary">
            Retour Alliance
          </Link>
          {" · "}
          <Link href="/assessments" className="underline">
            Tests de compatibilité
          </Link>
        </p>
      </div>
    </MemberPage>
  )
}
