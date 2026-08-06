import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { getCheckoutHints } from "@/app/actions/billing"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { createClient } from "@/utils/supabase/server"
import { PremiumHeroCarousel } from "@/components/premium/PremiumHeroCarousel"
import { AllianceReportPitch } from "@/components/premium/AllianceReportPitch"
import { SimulatedAllianceReport } from "@/components/premium/SimulatedAllianceReport"
import { PremiumUnlockList } from "@/components/premium/PremiumUnlockList"
import { AllianceCheckoutPanel } from "@/components/premium/AllianceCheckoutPanel"
import { BoostSection } from "@/components/premium/BoostSection"
import { PremiumSocialProof } from "@/components/premium/PremiumSocialProof"
import { getMyRelationBilan } from "@/app/actions/assessments"
import { RelationBilanCard } from "@/components/matching/RelationBilanCard"

export default async function PremiumPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <MemberPage>
        <div className="max-w-lg mx-auto text-center space-y-3 py-10">
          <h1 className="font-serif text-3xl font-bold">Alliance KELIAA</h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour activer Alliance : rapport personnalisé, axes
            d’amélioration et Matching enrichi.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-10 px-5 text-sm font-semibold"
          >
            Connexion
          </Link>
        </div>
      </MemberPage>
    )
  }

  const [{ data: profile }, usage, checkoutHints, bilan] = await Promise.all([
    supabase.from("profiles").select("first_name").eq("user_id", user.id).maybeSingle(),
    getUsageSnapshot(user.id),
    getCheckoutHints(),
    getMyRelationBilan(),
  ])

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-8 pb-8">
        <PremiumHeroCarousel firstName={profile?.first_name ?? undefined} />

        <AllianceReportPitch />

        <SimulatedAllianceReport />

        {bilan.report ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">
              {usage?.isPaid
                ? "Votre rapport Alliance actuel :"
                : "Aperçu actuel (complet dès Alliance) :"}
            </p>
            <RelationBilanCard report={bilan.report} compact />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border px-4 py-3">
            Complétez vos questionnaires pour générer le rapport. Alliance
            débloque ensuite les axes d’amélioration détaillés.
          </p>
        )}

        <PremiumUnlockList />

        <AllianceCheckoutPanel
          showModePicker={checkoutHints?.showModePicker ?? true}
          suggestedMode={checkoutHints?.suggestedMode ?? "mobile_money"}
          isPaid={Boolean(usage?.isPaid)}
        />

        <BoostSection />

        <PremiumSocialProof />

        <p className="text-center text-xs text-muted-foreground">
          Gérer mon abonnement :{" "}
          <Link
            href="/billing"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            facturation Alliance
          </Link>
        </p>
      </div>
    </MemberPage>
  )
}
