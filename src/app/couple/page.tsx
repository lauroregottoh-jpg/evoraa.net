import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { CouplePromiseLine } from "@/components/couple/CoupleShell"
import {
  COUPLE_BRAND,
  COUPLE_TAGLINE,
  isCoupleFeatureEnabled,
} from "@/lib/couple/config"
import {
  COUPLE_DEMO_AMOUNT_XOF,
  COUPLE_OFFERS,
  isCoupleDemoPricing,
} from "@/lib/couple/offers"

export const metadata = {
  title: `${COUPLE_BRAND} | KELIAA`,
  description: COUPLE_TAGLINE,
}

export default function CoupleLandingPage() {
  if (!isCoupleFeatureEnabled()) {
    return (
      <MemberPage>
        <p className="text-sm text-muted-foreground">Service temporairement indisponible.</p>
      </MemberPage>
    )
  }

  const demoPricing = isCoupleDemoPricing()

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-10 pb-16">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-[#F8F4EE] via-[#F3EFE8] to-[#E8E0D4] px-6 py-10 sm:px-10 shadow-premium">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Service spécialisé KELIAA
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
            {COUPLE_BRAND}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{COUPLE_TAGLINE}</p>
          <div className="mt-4">
            <CouplePromiseLine />
          </div>
          {demoPricing && (
            <p className="mt-4 rounded-xl border border-accent/30 bg-white/60 px-3 py-2 text-xs text-foreground">
              Démo active — Essentiel et Premium Plus à{" "}
              <strong>{COUPLE_DEMO_AMOUNT_XOF} FCFA</strong> pour tester tout le
              parcours.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/couple/offre"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 text-sm font-semibold"
            >
              {demoPricing
                ? `Tester à ${COUPLE_DEMO_AMOUNT_XOF} FCFA`
                : "Découvrir le bilan"}
            </Link>
            <Link
              href="/couple/rejoindre"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white/70 px-5 text-sm font-semibold text-foreground"
            >
              J’ai un code
            </Link>
            <Link
              href="/couple/espace"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-transparent px-4 text-sm font-medium text-primary"
            >
              Mon espace couple
            </Link>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold">Comment ça fonctionne</h2>
          <ol className="space-y-2 text-sm text-muted-foreground leading-relaxed list-decimal pl-5">
            <li>Un partenaire achète le bilan (Essentiel ou Premium Plus).</li>
            <li>Il invite l’autre avec un lien ou un code — deux places maximum.</li>
            <li>Chacun répond séparément, sans voir les réponses brutes de l’autre.</li>
            <li>Quand les deux ont terminé, l’analyse et le rapport se génèrent.</li>
            <li>Vous consultez résultats, exercices, plan d’action, et téléchargez le dossier.</li>
          </ol>
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          {Object.values(COUPLE_OFFERS).map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl border border-border/70 bg-white/80 p-5 space-y-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Offre
              </p>
              <h3 className="font-serif text-xl font-bold">{offer.marketingName}</h3>
              <p className="font-serif text-2xl font-bold text-primary">
                {(demoPricing
                  ? COUPLE_DEMO_AMOUNT_XOF
                  : offer.amountXof
                ).toLocaleString("fr-FR")}{" "}
                FCFA
              </p>
              {demoPricing && (
                <p className="text-xs text-muted-foreground line-through">
                  {offer.amountXof.toLocaleString("fr-FR")} FCFA
                </p>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {offer.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </MemberPage>
  )
}
