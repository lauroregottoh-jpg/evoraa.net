import Link from "next/link"
import { CinematicLayout } from "@/components/layout/CinematicLayout"
import { CoupleOffreCheckout } from "@/components/couple/CoupleOffreCheckout"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"
import { isCoupleDemoPricing } from "@/lib/couple/offers"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"

export const metadata = {
  title: `Offres & paiement | ${COUPLE_BRAND}`,
  description: `Choisissez Premium ou Premium Plus et payez par Mobile Money ou carte. ${COUPLE_TAGLINE}`,
}

export default function CoupleOffrePage() {
  const demoPricing = isCoupleDemoPricing()
  const provider = resolveLiveProvider()
  const demoMode = isDemoPaymentsEnv()
  const showModePicker = provider === "bictorys" && !demoMode

  return (
    <CinematicLayout>
      <div className="bg-[#FBF9F6] min-h-[70vh]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
          <header className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5C1F28]">
              {COUPLE_BRAND}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412]">
              Offres & paiement
            </h1>
            <p className="text-sm sm:text-base text-[#1C1412]/70 max-w-xl leading-relaxed">
              Premium Plus = tout le Premium + Points d’approfondissement,
              analyses, scénarios, protocoles et charte. Payez ici par Mobile
              Money ou carte — sans passer par l’espace membre.
            </p>
          </header>

          <CoupleOffreCheckout
            demoPricing={demoPricing}
            showModePicker={showModePicker}
            suggestedMode="mobile_money"
          />

          <p className="text-center text-sm text-[#1C1412]/55">
            <Link href="/couple" className="font-semibold text-[#5C1F28]">
              ← Retour à la présentation
            </Link>
            {" · "}
            <Link href="/couple/espace" className="font-semibold text-[#5C1F28]">
              Déjà acheteur ? Espace couple
            </Link>
          </p>
        </div>
      </div>
    </CinematicLayout>
  )
}
