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
  VizMap,
  VizPath,
  VizRingProgress,
  VizTwoGazes,
} from "@/components/couple/CoupleVisuals"
import {
  VizDualFinish,
  VizReportUnlockScene,
} from "@/components/couple/CoupleSceneVisuals"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"
import { cn } from "@/utils/cn"
import {
  LANDING_AUDIENCES,
  LANDING_CLOSING,
  LANDING_HERO,
  LANDING_IMAGINE,
  LANDING_OFFERS,
  LANDING_REPORT_BLOCKS,
  LANDING_SITUATIONS,
  LANDING_STEPS,
  LANDING_TOOLS,
} from "@/lib/couple/landingCopy"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

/**
 * Landing KELYA Couple — carnet / dossier, lisible, animations dédiées.
 */
export function CoupleLanding() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [activeSit, setActiveSit] = React.useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".ck-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
            toggleActions: "play none none none",
          },
          y: 14,
          duration: 0.65,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "transform",
        })
      })

      gsap.utils.toArray<HTMLElement>(".ck-sit-item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveSit(i),
          onEnterBack: () => setActiveSit(i),
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

      {/* 01 — Situations + curseur scroll */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[3.5rem_1fr] gap-6 lg:gap-10">
          <div
            className="hidden lg:flex flex-col items-center gap-3 sticky top-28 self-start pt-2"
            aria-hidden
          >
            {LANDING_SITUATIONS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-all duration-300",
                  activeSit === i
                    ? "couple-sit-active bg-primary text-white border-primary scale-110 shadow-md"
                    : "border-[#1C1412]/20 text-[#1C1412]/35"
                )}
              >
                {i + 1}
              </span>
            ))}
          </div>

          <div className="space-y-10">
            <div className="ck-reveal space-y-2">
              <p className="couple-chapter text-xs font-bold uppercase text-primary">
                01 — Identifiez votre situation
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Votre situation
              </h2>
            </div>

            <ul className="space-y-10 sm:space-y-12">
              {LANDING_SITUATIONS.map((s, i) => (
                <li
                  key={s.id}
                  className={cn(
                    "ck-sit-item ck-reveal border-l-2 pl-5 sm:pl-7 transition-colors duration-300",
                    activeSit === i ? "border-accent" : "border-[#1C1412]/12"
                  )}
                >
                  <p className="lg:hidden font-mono text-sm font-bold text-accent mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/80">
                    {s.label}
                  </p>
                  <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold leading-snug">
                    {s.title}
                  </p>
                  <p className="mt-3 text-base sm:text-lg text-[#1C1412] leading-relaxed">
                    {s.body}
                  </p>
                </li>
              ))}
            </ul>

            <p className="ck-reveal font-serif text-2xl sm:text-3xl font-bold leading-snug text-primary max-w-2xl">
              {LANDING_HERO.essentialQ}
            </p>
          </div>
        </div>
      </section>

      {/* 02 — Tensions : 5 tirets */}
      <section className="px-6 sm:px-12 lg:px-20 py-14 sm:py-16 border-y border-[#1C1412]/8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-start">
          <div className="ck-reveal space-y-4">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              02 — Ce qui revient
            </p>
            <p className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              {LANDING_HERO.invite}
            </p>
            <VizRingProgress className="w-28 h-28 text-accent mt-2" />
          </div>
          <ul className="ck-reveal space-y-4">
            {LANDING_HERO.tensions.map((t) => (
              <li
                key={t}
                className="flex gap-3 text-base sm:text-lg leading-relaxed text-[#1C1412]"
              >
                <span className="text-accent font-bold shrink-0">—</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — Deux personnes (était 04) */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 bg-white/70">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="ck-reveal space-y-3">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              03 — Deux personnes
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Deux regards. Une analyse.
            </h2>
            <VizTwoGazes className="w-56 h-32 sm:w-72 sm:h-40 text-accent" />
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <div className="ck-reveal space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Chacun répond en privé
              </h3>
              <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
                Sans regarder l’autre répondre. Sans modifier une réponse pour
                éviter une discussion. Honnêtement. En confiance. Vos réponses
                brutes restent confidentielles.
              </p>
            </div>
            <div className="ck-reveal space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Puis KELIAA croise vos résultats
              </h3>
              <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
                La question n’est pas seulement « qui êtes-vous ? » — c’est{" "}
                <strong className="text-foreground font-semibold underline decoration-accent/50 underline-offset-4">
                  que se passe-t-il lorsque vos deux façons de fonctionner se
                  rencontrent ?
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Carte (était 03) — animation plus grande */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="ck-reveal flex justify-center text-primary">
            <VizMap className="w-72 h-48 sm:w-96 sm:h-64" />
          </div>
          <div className="ck-reveal space-y-5">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              04 — Le dossier
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Une carte de compréhension — pas un quiz
            </h2>
            <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
              Chacun répond de son côté. Puis vos deux regards sont mis en
              relation : convergences, différences, forces, zones de vigilance,
              priorités.
            </p>
            <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
              Vous repartez avec des mots sur ce que vous vivez déjà — et une
              idée claire de par où commencer.
            </p>
            <MagneticButton href="/couple/offre" variant="primary" size="lg">
              {LANDING_HERO.ctaPrimary}
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 05 — Rapport 2×2 */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 border-y border-[#1C1412]/8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="ck-reveal max-w-2xl space-y-3">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              05 — Dans votre rapport
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Vous ne recevez pas juste un score
            </h2>
            <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
              Imaginez ouvrir votre dossier. Voici ce que vous y trouvez —
              développé, structuré, à lire à deux.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
            {LANDING_REPORT_BLOCKS.map((b) => (
              <article
                key={b.title}
                className="ck-reveal space-y-3 border-t border-[#1C1412]/12 pt-5"
              >
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary">
                  {b.title}
                </h3>
                <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
                  {b.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Action enrichie */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="ck-reveal space-y-3">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              06 — Et ensuite
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              {LANDING_TOOLS.title}
            </h2>
            <p className="text-base sm:text-lg text-[#1C1412]">
              {LANDING_TOOLS.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
            {LANDING_TOOLS.items.map((item, i) => (
              <div key={item.title} className="ck-reveal space-y-2">
                <p className="font-mono text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — Pour qui */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 bg-white/70">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="ck-reveal space-y-2">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              07 — Pour qui
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Cheminants, fiancés, mariés — et tous ceux qui veulent clarifier
            </h2>
          </div>
          <div className="space-y-8">
            {LANDING_AUDIENCES.map((a) => (
              <div key={a.title} className="ck-reveal space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold underline decoration-accent/40 underline-offset-4">
                  {a.title}
                </h3>
                <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Parcours */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="ck-reveal mb-10 space-y-2">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              08 — Comment ça commence
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412]">
              Comment ça se passe
            </h2>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10">
            <VizPath className="ck-reveal w-10 h-80 text-accent mt-1" />
            <ol className="space-y-6 pb-2">
              {LANDING_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="ck-reveal rounded-xl border border-[#1C1412]/12 bg-[#FBF9F6] px-4 py-4 sm:px-5 sm:py-5"
                >
                  <p className="font-mono text-sm font-bold text-accent">
                    {step.n}
                  </p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1412]">
                    {step.title}
                  </p>
                  <p className="mt-2 text-base sm:text-lg text-[#1C1412] leading-relaxed">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 09 — Offres */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-24 bg-[#F8F4EE]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="ck-reveal max-w-2xl space-y-3">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              09 — Niveaux d’accompagnement
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1412] underline decoration-accent/60 underline-offset-8">
              {LANDING_OFFERS.eyebrow}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <article className="ck-reveal space-y-5 rounded-2xl border-2 border-[#1C1412]/15 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-3xl font-bold text-[#1C1412]">
                Bilan Essentiel
              </h3>
              <CoupleOfferPrice offerId="couple_essential" />
              <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed font-medium">
                {LANDING_OFFERS.essentialFor}
              </p>
              <ul className="space-y-3 text-base sm:text-lg text-[#1C1412]">
                {LANDING_OFFERS.essentialFeatures.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
                {LANDING_OFFERS.essentialClose}
              </p>
              <MagneticButton
                href="/couple/checkout/couple_essential"
                variant="outline"
                size="lg"
              >
                Choisir Essentiel — 30 000 FCFA
              </MagneticButton>
            </article>

            <article className="ck-reveal space-y-5 rounded-2xl border-2 border-accent bg-white p-6 sm:p-8 shadow-elevated">
              <p className="text-xs font-bold uppercase tracking-wider text-accent underline underline-offset-4">
                Aller plus loin
              </p>
              <h3 className="font-serif text-3xl font-bold text-[#1C1412]">
                Bilan Premium Plus
              </h3>
              <CoupleOfferPrice offerId="couple_premium_plus" />
              <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed font-medium">
                {LANDING_OFFERS.premiumFor}
              </p>
              <ul className="space-y-3 text-base sm:text-lg text-[#1C1412]">
                {LANDING_OFFERS.premiumFeatures.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">—</span>
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <MagneticButton
                href="/couple/checkout/couple_premium_plus"
                variant="primary"
                size="lg"
              >
                Choisir Premium Plus — 50 000 FCFA
              </MagneticButton>
            </article>
          </div>
        </div>
      </section>

      {/* Imagine */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 items-center">
          <div className="ck-reveal">
            <VizReportUnlockScene />
          </div>
          <div className="ck-reveal space-y-5">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              10 — Imaginez
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#1C1412]">
              {LANDING_IMAGINE.title}
            </h2>
            <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
              {LANDING_IMAGINE.body}
            </p>
            <div className="space-y-3">
              {LANDING_IMAGINE.quotes.map((q) => (
                <p
                  key={q}
                  className="font-serif text-xl sm:text-2xl italic text-primary leading-snug"
                >
                  « {q} »
                </p>
              ))}
            </div>
            <p className="text-base sm:text-lg font-semibold text-[#1C1412]">
              {LANDING_IMAGINE.close}
            </p>
          </div>
        </div>
      </section>

      {/* Closing — un seul bloc */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 bg-[#F8F4EE]">
        <div className="max-w-2xl space-y-6">
          <h2 className="ck-reveal font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#1C1412]">
            {LANDING_CLOSING.title}
          </h2>
          <p className="ck-reveal text-lg sm:text-xl text-[#1C1412] leading-relaxed font-medium">
            {LANDING_CLOSING.body}
          </p>
          <div className="ck-reveal flex flex-wrap gap-3 pt-2">
            <MagneticButton
              href="/couple/checkout/couple_essential"
              variant="primary"
              size="lg"
            >
              Commencer — 30 000 FCFA
            </MagneticButton>
            <MagneticButton
              href="/couple/checkout/couple_premium_plus"
              variant="outline"
              size="lg"
            >
              Premium Plus — 50 000 FCFA
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Pour finir + dual */}
      <section className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20 bg-white">
        <div className="max-w-2xl space-y-8">
          <div className="ck-reveal space-y-3">
            <p className="couple-chapter text-xs font-bold uppercase text-primary">
              {LANDING_CLOSING.finishTitle}
            </p>
            <p className="text-base sm:text-lg text-[#1C1412] leading-relaxed">
              {LANDING_CLOSING.lastPrompt}
            </p>
          </div>
          <div className="ck-reveal">
            <VizDualFinish />
          </div>
          <p className="ck-reveal font-serif text-2xl sm:text-3xl italic text-primary leading-snug">
            « {LANDING_CLOSING.lastQuote} »
          </p>
          <p className="ck-reveal text-lg sm:text-xl font-semibold text-[#1C1412]">
            {LANDING_CLOSING.start}
          </p>
          <p className="ck-reveal text-base text-[#1C1412] italic">
            {COUPLE_BRAND} — {LANDING_CLOSING.tagline}
          </p>
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            Je commence
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
          <div>
            <Link
              href="/couple/espace"
              className="text-base font-semibold text-primary"
            >
              Mon espace couple →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
