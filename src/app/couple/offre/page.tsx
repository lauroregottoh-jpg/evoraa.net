import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleOffreCheckout } from "@/components/couple/CoupleOffreCheckout"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"
import { isCoupleDemoPricing } from "@/lib/couple/offers"
import { getBictorysEnabledPaymentModes } from "@/lib/billing/bictorys"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"

export const metadata = {
  title: `Offres & paiement | ${COUPLE_BRAND}`,
  description: `Choisissez Premium ou Premium Plus et payez par Mobile Money ou carte. ${COUPLE_TAGLINE}`,
}

export const dynamic = "force-dynamic"

export default function CoupleOffrePage() {
  const demoPricing = isCoupleDemoPricing()
  const provider = resolveLiveProvider()
  const demoMode = isDemoPaymentsEnv()
  const enabledPaymentModes =
    provider === "bictorys" ? getBictorysEnabledPaymentModes() : []
  const showModePicker =
    provider === "bictorys" && !demoMode && enabledPaymentModes.length > 1

  return (
    <MemberPage dense contentWidth="wide">
      <CoupleShell activeHref="/couple/offre" showWelcome={false} variant="sales">
        <div className="max-w-xl mx-auto space-y-8 pb-6">
          <header className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7F5557]">
              {COUPLE_BRAND}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7F5557]">
              Offres & paiement
            </h1>
            <p className="text-sm sm:text-base text-[#7F5557]/70 max-w-xl leading-relaxed">
              Premium Plus = tout le Premium + Points d’approfondissement,
              analyses, scénarios, protocoles et charte. Payez ici dans KELIAA
              par Mobile Money ou carte — puis accédez à votre espace couple.
            </p>
          </header>

          <CoupleOffreCheckout
            demoPricing={demoPricing}
            showModePicker={showModePicker}
            suggestedMode="mobile_money"
            enabledPaymentModes={enabledPaymentModes}
          />

          <p className="text-center text-sm text-[#7F5557]/55">
            <Link href="/couple" className="font-semibold text-[#7F5557]">
              ← Retour à la présentation
            </Link>
            {" · "}
            <Link href="/couple/espace" className="font-semibold text-[#7F5557]">
              Déjà acheteur ? Espace couple
            </Link>
            {" · "}
            <Link
              href="/couple/rejoindre"
              className="font-semibold text-[#7F5557]"
            >
              J’ai un code partenaire
            </Link>
          </p>
        </div>
      </CoupleShell>
    </MemberPage>
  )
}
