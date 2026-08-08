import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleOfferPicker } from "@/components/couple/CoupleOfferPicker"
import { COUPLE_BRAND } from "@/lib/couple/config"
import { isCoupleDemoPricing } from "@/lib/couple/offers"

export const metadata = {
  title: `Offres | ${COUPLE_BRAND}`,
}

export default function CoupleOffrePage() {
  const demoPricing = isCoupleDemoPricing()

  return (
    <MemberPage>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <header className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {COUPLE_BRAND}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Choisissez votre bilan
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Premium Plus = tout l’Essentiel + analyses, scénarios, protocoles et
            charte. Les prix sont confirmés côté serveur au paiement.
          </p>
        </header>
        <CoupleOfferPicker demoPricing={demoPricing} />
      </div>
    </MemberPage>
  )
}
