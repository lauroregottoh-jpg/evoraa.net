import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { getCheckoutHints } from "@/app/actions/billing"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { createClient } from "@/utils/supabase/server"
import { PremiumHeroCarousel } from "@/components/premium/PremiumHeroCarousel"
import {
  AllianceBenefitCards,
  AllianceBilanSection,
} from "@/components/premium/AllianceBenefitCards"
import { AllianceCheckoutPanel } from "@/components/premium/AllianceCheckoutPanel"
import { BoostSection } from "@/components/premium/BoostSection"
import { PremiumSocialProof } from "@/components/premium/PremiumSocialProof"
import { AlliancePrioritySupport } from "@/components/premium/AlliancePrioritySupport"
import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs"

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
            Connectez-vous pour activer Alliance : bilan relationnel, Coffre
            Premium et Matching enrichi.
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

  const [{ data: profile }, usage, checkoutHints] = await Promise.all([
    supabase.from("profiles").select("first_name").eq("user_id", user.id).maybeSingle(),
    getUsageSnapshot(user.id),
    getCheckoutHints(),
  ])

  return (
    <MemberPage>
      <div className="relative max-w-3xl mx-auto space-y-8 pb-8">
        <AmbientSnowOrbs density="soft" className="opacity-60" />
        <div className="relative z-10 space-y-8">
        <PremiumHeroCarousel firstName={profile?.first_name ?? undefined} />

        <section className="rounded-2xl border border-border/70 bg-white/80 px-5 py-5 sm:px-7 sm:py-6 space-y-2 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Qu’est-ce qu’Alliance ?
          </p>
          <h2 className="font-serif text-2xl font-bold leading-tight">
            Plus qu’un abonnement : un cadre pour avancer sérieusement
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Alliance est l’offre KELIAA pour ceux qui veulent préparer leur
            mariage avec lucidité. Elle ouvre votre bilan relationnel, enrichit
            le Matching, et inclut le Coffre Premium.
          </p>
        </section>

        <AllianceBenefitCards />

        <AllianceBilanSection />

        <AllianceCheckoutPanel
          showModePicker={checkoutHints?.showModePicker ?? true}
          suggestedMode={checkoutHints?.suggestedMode ?? "mobile_money"}
          isPaid={Boolean(usage?.isPaid)}
        />

        <BoostSection />

        <AlliancePrioritySupport isPaid={Boolean(usage?.isPaid)} />

        <PremiumSocialProof />

        <p className="text-center text-xs text-muted-foreground">
          Gérer mon abonnement :{" "}
          <Link
            href="/billing"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            facturation Alliance
          </Link>
          {" · "}
          <Link
            href="/rapport"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            Mon rapport personnalisé
          </Link>
        </p>
        </div>
      </div>
    </MemberPage>
  )
}
