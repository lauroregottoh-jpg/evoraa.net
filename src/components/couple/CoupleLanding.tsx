"use client"

import * as React from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowRight } from "lucide-react"
import { PageHero } from "@/components/marketing/PageHero"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { CoupleOfferPrice } from "@/components/couple/CoupleOfferPrice"
import {
  VizConversation,
  VizMap,
  VizPath,
  VizRingProgress,
  VizTwoGazes,
} from "@/components/couple/CoupleVisuals"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"
import {
  LANDING_CLOSING,
  LANDING_HERO,
  LANDING_IMAGINE,
  LANDING_OFFERS,
  LANDING_SITUATIONS,
  LANDING_STEPS,
  LANDING_TOOLS,
} from "@/lib/couple/landingCopy"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

/**
 * Landing KELYA Couple — style éditorial « carnet / dossier »
 * (volontairement distinct de l’accueil Matching).
 */
export function CoupleLanding() {
  const rootRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".ck-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          y: 18,
          duration: 0.75,
          ease: "power2.out",
        })
      })

      gsap.utils.toArray<HTMLElement>(".ck-line").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power2.out",
        })
      })
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="bg-[#FBF9F6] text-[#1C1412]">
      <PageHero
        eyebrow={COUPLE_TAGLINE}
        title={COUPLE_BRAND}
        subtitle={LANDING_HERO.hook}
        imageSrc="/home/hero-african-wedding.png"
        imageClassName="object-[center_32%] sm:object-center"
        imageAlt={COUPLE_BRAND}
        className="min-h-[48vh] sm:min-h-[54vh]"
      >
        <div className="pt-5 flex flex-wrap gap-3">
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            {LANDING_HERO.ctaPrimary}
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            href="/couple/rejoindre"
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
          >
            {LANDING_HERO.ctaSecondary}
          </MagneticButton>
        </div>
      </PageHero>

      {/* Situations — prose + filet, pas de grosses cartes */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="ck-reveal space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              01 — Votre moment
            </p>
            <div className="ck-line h-px w-16 bg-accent/70" />
          </div>

          <ul className="space-y-8">
            {LANDING_SITUATIONS.map((s, i) => (
              <li key={s.id} className="ck-reveal flex gap-5 sm:gap-8">
                <span className="font-mono text-xs text-accent pt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1.5 border-l border-[#1C1412]/12 pl-5 sm:pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">
                    {s.label}
                  </p>
                  <p className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                    {s.title}
                  </p>
                  <p className="text-sm sm:text-base text-[#1C1412]/70 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="ck-reveal font-serif text-xl sm:text-2xl font-bold leading-snug text-primary max-w-2xl">
            {LANDING_HERO.essentialQ}
          </p>
        </div>
      </section>

      {/* Tensions */}
      <section className="px-6 sm:px-12 lg:px-20 py-12 border-y border-[#1C1412]/8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div className="ck-reveal space-y-4">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              02 — Ce qui revient
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {LANDING_HERO.invite}
            </p>
            <VizRingProgress className="w-20 h-20 text-accent mt-4" />
          </div>
          <ul className="ck-reveal space-y-4">
            {LANDING_HERO.tensions.map((t) => (
              <li
                key={t}
                className="text-sm sm:text-base leading-relaxed text-[#1C1412]/80 pl-4 border-l-2 border-accent/40"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Carte de compréhension — compact, asymétrique */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <div className="ck-reveal flex justify-center lg:justify-start text-primary">
            <VizMap className="w-48 h-32 sm:w-56 sm:h-36" />
          </div>
          <div className="ck-reveal space-y-5">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              03 — Le dossier
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Une carte de compréhension — pas un quiz
            </h2>
            <p className="text-sm sm:text-base text-[#1C1412]/75 leading-relaxed">
              Chacun répond de son côté. Puis vos deux regards sont mis en
              relation : convergences, différences, forces, zones de vigilance,
              priorités.
            </p>
            <p className="text-sm sm:text-base text-[#1C1412]/75 leading-relaxed">
              Vous repartez avec des mots sur ce que vous vivez déjà — et une
              idée claire de par où commencer.
            </p>
            <MagneticButton href="/couple/offre" variant="primary">
              {LANDING_HERO.ctaPrimary}
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Deux regards */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 bg-white/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="ck-reveal space-y-4">
            <VizTwoGazes className="w-36 h-20 text-accent" />
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              04 — Deux personnes
            </p>
            <h3 className="font-serif text-2xl font-bold">Chacun répond en privé</h3>
            <p className="text-sm text-[#1C1412]/75 leading-relaxed">
              Sans regarder l’autre répondre. Sans modifier une réponse pour
              éviter une discussion. Honnêtement. En confiance.
            </p>
          </div>
          <div className="ck-reveal space-y-4 md:pt-10">
            <h3 className="font-serif text-2xl font-bold">
              Puis KELIAA croise vos résultats
            </h3>
            <p className="text-sm text-[#1C1412]/75 leading-relaxed">
              La question n’est pas seulement « qui êtes-vous ? » — c’est{" "}
              <span className="font-semibold text-foreground">
                que se passe-t-il lorsque vos deux façons de fonctionner se
                rencontrent ?
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Ce que le rapport contient — filet, pas piliers Matching */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="ck-reveal space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              05 — Dans votre rapport
            </p>
            <h2 className="font-serif text-3xl font-bold">
              Vous ne recevez pas juste un score
            </h2>
          </div>
          <dl className="space-y-0">
            {[
              ["Forces", "Ce qui fonctionne déjà — une ressource pour la relation."],
              ["Convergences", "Là où vos attentes et visions se rejoignent."],
              ["Différences", "Là où vous ne voyez pas forcément les choses pareil."],
              [
                "Vigilance",
                "Ce qu’il vaut mieux clarifier avant que ça ne tourne en boucle.",
              ],
              ["Priorités", "Les quelques sujets par lesquels commencer vraiment."],
            ].map(([k, v]) => (
              <div
                key={k}
                className="ck-reveal grid sm:grid-cols-[9rem_1fr] gap-2 sm:gap-6 py-5 border-t border-[#1C1412]/10"
              >
                <dt className="font-serif text-lg font-bold text-primary">{k}</dt>
                <dd className="text-sm text-[#1C1412]/75 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="ck-reveal text-sm font-medium leading-relaxed">
            Vous passez de « nous avons un problème » à « nous savons ce que
            nous devons comprendre et travailler ».
          </p>
        </div>
      </section>

      {/* Après le bilan — outils */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 border-y border-[#1C1412]/8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[auto_1fr] gap-10">
          <div className="ck-reveal text-accent hidden lg:block">
            <VizConversation className="w-40 h-24" />
          </div>
          <div className="space-y-8">
            <div className="ck-reveal space-y-2">
              <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
                06 — Et ensuite
              </p>
              <h2 className="font-serif text-3xl font-bold max-w-xl">
                De la compréhension à l’action
              </h2>
            </div>
            <div className="space-y-6">
              {LANDING_TOOLS.items.map((item, i) => (
                <div key={item.title} className="ck-reveal flex gap-4">
                  <span className="font-mono text-xs text-accent shrink-0 pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#1C1412]/75 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui — cheminants etc. */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="ck-reveal space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              07 — Pour qui
            </p>
            <h2 className="font-serif text-3xl font-bold">
              Cheminants, fiancés, mariés — et au-delà
            </h2>
          </div>
          <div className="space-y-8">
            <div className="ck-reveal space-y-2">
              <h3 className="font-serif text-xl font-bold">Vous préparez votre mariage</h3>
              <p className="text-sm text-[#1C1412]/75 leading-relaxed">
                Un temps pour parler de sujets que la préparation du mariage ne
                permet pas toujours d’approfondir. Vous préparez une vie à deux —
                pas seulement une cérémonie.
              </p>
            </div>
            <div className="ck-reveal space-y-2">
              <h3 className="font-serif text-xl font-bold">Vous êtes déjà mariés</h3>
              <p className="text-sm text-[#1C1412]/75 leading-relaxed">
                Comprendre des fonctionnements, mettre des mots sur ce qui
                revient, retrouver vos forces, décider ensemble de ce que vous
                voulez améliorer. Il n’est jamais trop tôt — ni trop tard.
              </p>
            </div>
            <div className="ck-reveal space-y-2">
              <h3 className="font-serif text-xl font-bold">Vous êtes chrétiens</h3>
              <p className="text-sm text-[#1C1412]/75 leading-relaxed">
                KELIAA est pensée d’abord pour vous. Et si vous ne l’êtes pas :
                vous êtes également le bienvenu. Le cœur reste votre dynamique
                relationnelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours — timeline verticale */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 bg-white/70">
        <div className="max-w-4xl mx-auto">
          <div className="ck-reveal mb-10 space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              08 — Comment ça commence
            </p>
            <h2 className="font-serif text-3xl font-bold">Cinq étapes</h2>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10">
            <VizPath className="ck-reveal w-8 h-56 text-accent mt-1" />
            <ol className="space-y-7 pb-2">
              {LANDING_STEPS.map((step) => (
                <li key={step.n} className="ck-reveal">
                  <p className="font-mono text-[10px] text-accent">{step.n}</p>
                  <p className="font-serif text-lg font-bold">{step.title}</p>
                  <p className="text-sm text-[#1C1412]/70">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Offres — prix ici, pas en hero */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="ck-reveal max-w-xl space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              09 — Niveaux d’accompagnement
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              {LANDING_OFFERS.eyebrow}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <article className="ck-reveal space-y-5 border-t-2 border-[#1C1412]/15 pt-6">
              <h3 className="font-serif text-2xl font-bold">Bilan Essentiel</h3>
              <CoupleOfferPrice offerId="couple_essential" />
              <p className="text-sm text-[#1C1412]/75 leading-relaxed">
                {LANDING_OFFERS.essentialFor}
              </p>
              <ul className="space-y-1.5 text-sm text-[#1C1412]/7">
                {LANDING_OFFERS.essentialFeatures.map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <MagneticButton
                href="/couple/checkout/couple_essential"
                variant="outline"
              >
                Choisir Essentiel — 30 000 FCFA
              </MagneticButton>
            </article>

            <article className="ck-reveal space-y-5 border-t-2 border-accent pt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Aller plus loin
              </p>
              <h3 className="font-serif text-2xl font-bold">Bilan Premium Plus</h3>
              <CoupleOfferPrice offerId="couple_premium_plus" />
              <p className="text-sm text-[#1C1412]/75 leading-relaxed">
                {LANDING_OFFERS.premiumFor}
              </p>
              <ul className="space-y-1.5 text-sm text-[#1C1412]/7">
                {LANDING_OFFERS.premiumFeatures.map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <MagneticButton
                href="/couple/checkout/couple_premium_plus"
                variant="primary"
              >
                Choisir Premium Plus — 50 000 FCFA
              </MagneticButton>
            </article>
          </div>

          <p className="ck-reveal text-sm text-[#1C1412]/65 max-w-lg">
            En résumé : 30 000 FCFA pour comprendre — 50 000 FCFA pour comprendre
            et aller beaucoup plus loin dans le travail. Dans les deux cas, bien
            plus qu’un score.
          </p>
        </div>
      </section>

      {/* Conversation après */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 border-t border-[#1C1412]/8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="ck-reveal space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              10 — Après
            </p>
            <h2 className="font-serif text-3xl font-bold leading-tight">
              {LANDING_IMAGINE.title}
            </h2>
            <p className="text-sm text-[#1C1412]/75 leading-relaxed">
              {LANDING_IMAGINE.body}
            </p>
          </div>
          <div className="ck-reveal space-y-4 pl-0 sm:pl-2">
            {LANDING_IMAGINE.quotes.map((q) => (
              <p
                key={q}
                className="font-serif text-lg sm:text-xl italic text-primary/90 leading-snug"
              >
                « {q} »
              </p>
            ))}
          </div>
          <p className="ck-reveal text-sm font-medium">{LANDING_IMAGINE.close}</p>
        </div>
      </section>

      {/* Closing — left aligned, new copy */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 bg-white/80">
        <div className="max-w-2xl space-y-5">
          <h2 className="ck-reveal font-serif text-3xl sm:text-4xl font-bold leading-tight">
            {LANDING_CLOSING.title}
          </h2>
          <p className="ck-reveal text-base sm:text-lg text-[#1C1412]/8 leading-relaxed">
            {LANDING_CLOSING.body}
          </p>
          <p className="ck-reveal font-serif text-xl font-bold text-primary">
            {LANDING_CLOSING.bodyEnd}
          </p>
          <div className="ck-reveal flex flex-wrap gap-3 pt-2">
            <MagneticButton href="/couple/checkout/couple_essential" variant="primary">
              Commencer — 30 000 FCFA
            </MagneticButton>
            <MagneticButton
              href="/couple/checkout/couple_premium_plus"
              variant="outline"
            >
              Premium Plus — 50 000 FCFA
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Dernière question — left, not centered */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-2xl space-y-6">
          <div className="ck-reveal space-y-2">
            <p className="couple-chapter text-[10px] font-bold uppercase text-primary">
              Pour finir
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              {LANDING_CLOSING.lastQ}
            </h2>
            <p className="text-sm text-[#1C1412]/75 leading-relaxed">
              {LANDING_CLOSING.lastPrompt}
            </p>
          </div>
          <ul className="ck-reveal space-y-2">
            {LANDING_CLOSING.lastOptions.map((o) => (
              <li
                key={o}
                className="text-sm border-l-2 border-accent/50 pl-3 text-[#1C1412]/8"
              >
                {o}
              </li>
            ))}
          </ul>
          <p className="ck-reveal font-serif text-lg italic text-primary">
            « {LANDING_CLOSING.lastQuote} »
          </p>
          <p className="ck-reveal text-sm font-medium">{LANDING_CLOSING.start}</p>
          <p className="ck-reveal text-xs text-[#1C1412]/55 italic">
            {COUPLE_BRAND} — {LANDING_CLOSING.tagline}
          </p>
          <MagneticButton href="/couple/offre" variant="primary">
            Je commence
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
          <div>
            <Link href="/couple/espace" className="text-sm font-semibold text-primary">
              Mon espace couple →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
