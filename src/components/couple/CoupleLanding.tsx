"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  ArrowRight,
  ClipboardList,
  HeartHandshake,
  Lock,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react"
import { PageHero } from "@/components/marketing/PageHero"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { CoupleJourneyCard } from "@/components/couple/CoupleJourneyCard"
import { CoupleSituationCards } from "@/components/couple/CoupleSituationCards"
import {
  CoupleOfferPrice,
  CouplePriceHint,
} from "@/components/couple/CoupleOfferPrice"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"
import { cn } from "@/utils/cn"
import {
  LANDING_AUDIENCES,
  LANDING_CLOSING,
  LANDING_DISCOVER_OUTCOMES,
  LANDING_HERO,
  LANDING_IMAGINE,
  LANDING_MAYBE,
  LANDING_OFFERS,
  LANDING_RECOGNIZE,
  LANDING_REPORT_PILLARS,
  LANDING_SITUATIONS,
  LANDING_STEPS,
  LANDING_TOOLS,
  LANDING_TWO_LOOKS,
  type LandingSituationId,
} from "@/lib/couple/landingCopy"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function CoupleLanding() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [situation, setSituation] =
    React.useState<LandingSituationId | null>(null)

  const selectedSituation = LANDING_SITUATIONS.find((s) => s.id === situation)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".couple-fade-up").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          y: 32,
          duration: 0.9,
          ease: "power2.out",
        })
      })

      gsap.utils.toArray<HTMLElement>(".couple-roll-left").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          x: -48,
          duration: 1,
          ease: "power3.out",
        })
      })

      gsap.utils.toArray<HTMLElement>(".couple-roll-right").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          x: 48,
          duration: 1,
          ease: "power3.out",
        })
      })

      gsap.utils.toArray<HTMLElement>(".couple-zoom-frame").forEach((frame) => {
        const img = frame.querySelector(".couple-zoom-img")
        if (!img) return
        gsap.fromTo(
          img,
          { scale: 1.18 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })

      gsap.from(".couple-step-card", {
        scrollTrigger: {
          trigger: ".couple-steps-grid",
          start: "top 82%",
          once: true,
        },
        y: 28,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      })

      gsap.from(".couple-pillar-card", {
        scrollTrigger: {
          trigger: ".couple-pillars-grid",
          start: "top 82%",
          once: true,
        },
        y: 22,
        scale: 0.94,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out",
      })

      gsap.from(".couple-offer-card", {
        scrollTrigger: {
          trigger: ".couple-offers-grid",
          start: "top 80%",
          once: true,
        },
        y: 28,
        duration: 0.8,
        stagger: 0.18,
        ease: "power2.out",
      })

      gsap.from(".couple-situation-card", {
        scrollTrigger: {
          trigger: ".couple-situations-grid",
          start: "top 85%",
          once: true,
        },
        y: 24,
        scale: 0.96,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out",
      })

      gsap.to(".hero-cta-main", {
        scale: 1.02,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="overflow-hidden">
      <PageHero
        eyebrow={COUPLE_TAGLINE}
        title={COUPLE_BRAND}
        subtitle={LANDING_HERO.hook}
        imageSrc="/home/hero-african-wedding.png"
        imageClassName="object-[center_32%] sm:object-center"
        imageAlt={COUPLE_BRAND}
        className="min-h-[52vh] sm:min-h-[58vh]"
      >
        <div className="pt-5 flex flex-wrap gap-3">
          <div className="hero-cta-main">
            <MagneticButton href="/couple/offre" variant="primary" size="lg">
              {LANDING_HERO.ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </MagneticButton>
          </div>
          <MagneticButton
            href="/couple/rejoindre"
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
          >
            {LANDING_HERO.ctaSecondary}
          </MagneticButton>
        </div>
        <p className="pt-3 text-sm text-white/80">
          <span className="line-through text-white/45 mr-2">40 000 FCFA</span>
          À partir de 30 000 FCFA — pour vous deux
        </p>
      </PageHero>

      {/* Quatre situations */}
      <section className="relative py-16 sm:py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28]"
        />
        <div className="relative z-10 mx-auto max-w-6xl space-y-8">
          <div className="couple-fade-up text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F3D9A4]">
              Où en êtes-vous ?
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F8F4EE] leading-tight">
              Choisissez la situation qui vous ressemble
            </h2>
            <p className="text-sm sm:text-base text-[#F8F4EE]/80 leading-relaxed">
              Quatre chemins, une même question : comprendre comment vous
              fonctionnez vraiment à deux.
            </p>
          </div>

          <CoupleSituationCards
            selected={situation}
            onSelect={setSituation}
          />

          <div
            className={cn(
              "couple-fade-up mx-auto max-w-2xl rounded-2xl border border-[#B8954A]/40 bg-[#F8F4EE] p-5 sm:p-6 text-center transition-all duration-500",
              selectedSituation ? "opacity-100 translate-y-0" : "opacity-90"
            )}
          >
            {selectedSituation ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Votre projection
                </p>
                <p className="mt-2 font-serif text-xl font-bold text-[#1C1412]">
                  {selectedSituation.title}
                </p>
                <p className="mt-2 text-sm text-[#1C1412]/75 leading-relaxed">
                  {selectedSituation.body}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#1C1412]/70 leading-relaxed">
                Touchez une carte pour vous projeter dans votre situation.
              </p>
            )}
            <p className="mt-4 font-serif text-base sm:text-lg font-bold text-[#1C1412] leading-snug">
              {LANDING_HERO.essentialQ}
            </p>
          </div>
        </div>
      </section>

      {/* Entête — suite narrative */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="couple-roll-left space-y-5">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Car au début d’une relation, certaines différences peuvent sembler
              anodines. Puis la relation avance, les responsabilités augmentent,
              les décisions deviennent plus importantes et ce qui était autrefois
              facile peut devenir un sujet de tension.
            </p>
            <ul className="space-y-2.5">
              {LANDING_HERO.tensions.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-foreground/90">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
            <p className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-snug">
              {LANDING_HERO.invite}
            </p>
          </div>
          <div className="couple-roll-right couple-zoom-frame relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden shadow-elevated">
            <Image
              src="/home/compare-couple.png"
              alt="Couple — regarder ensemble"
              fill
              className="couple-zoom-img object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-white font-serif text-lg sm:text-xl font-bold drop-shadow-md">
              Une carte de compréhension — pas un quiz
            </p>
          </div>
        </div>

        <div className="couple-fade-up mt-12 max-w-3xl mx-auto space-y-4 text-center">
          <p className="text-base text-muted-foreground leading-relaxed">
            {LANDING_HERO.promise}
          </p>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {LANDING_HERO.discover}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {LANDING_HERO.deeper}
          </p>
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {LANDING_HERO.map}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <MagneticButton href="/couple/offre" variant="primary" size="lg">
              {LANDING_HERO.ctaPrimary}
            </MagneticButton>
            <p className="w-full text-xs text-muted-foreground pt-1">
              <CouplePriceHint />
            </p>
          </div>
        </div>
      </section>

      {/* Recognize */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-[#F8F4EE]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="couple-zoom-frame relative order-2 lg:order-1 h-[320px] sm:h-[440px] rounded-2xl overflow-hidden shadow-elevated">
            <Image
              src="/home/story-community.png"
              alt=""
              fill
              className="couple-zoom-img object-cover object-[center_30%]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="couple-fade-up order-1 lg:order-2 space-y-5">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              {LANDING_RECOGNIZE.eyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              {LANDING_RECOGNIZE.title}
            </h2>
            {LANDING_RECOGNIZE.body.map((p) => (
              <p key={p.slice(0, 32)} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                La vraie question n’est pas :
              </p>
              <blockquote className="border-l-2 border-border pl-4 text-muted-foreground italic">
                « {LANDING_RECOGNIZE.wrongQ} »
              </blockquote>
              <p className="text-sm text-muted-foreground">La vraie question est :</p>
              <blockquote className="border-l-2 border-accent pl-4 font-serif text-lg font-bold text-foreground">
                « {LANDING_RECOGNIZE.rightQ} »
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes cards */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="couple-fade-up text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {LANDING_DISCOVER_OUTCOMES.eyebrow}
          </span>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {LANDING_DISCOVER_OUTCOMES.intro}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LANDING_DISCOVER_OUTCOMES.items.map((item, i) => (
            <article
              key={item.title}
              className="couple-fade-up group rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-500"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="font-mono text-xs font-bold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">{item.hint}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Report pillars — matching style */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-6 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28]"
        />
        <div className="relative z-10 mx-auto max-w-6xl space-y-10">
          <div className="couple-fade-up text-center space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F3D9A4]">
              {LANDING_REPORT_PILLARS.eyebrow}
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F8F4EE] leading-tight">
              {LANDING_REPORT_PILLARS.title}
            </h2>
          </div>
          <div className="couple-pillars-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LANDING_REPORT_PILLARS.items.map((pillar, i) => (
              <article
                key={pillar.title}
                className="couple-pillar-card group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#B8954A]/55 bg-[#F8F4EE] p-5 text-[#1C1412] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              >
                <div
                  aria-hidden
                  className={cn(
                    "mb-4 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-[1.03]",
                    pillar.accent
                  )}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#F3D9A4]/70 bg-black/25 text-[#F3D9A4] shadow-lg">
                    <Sparkles className="h-6 w-6" />
                  </span>
                </div>
                <span className="mb-2 inline-flex h-8 w-fit items-center rounded-lg bg-[#B8954A]/20 px-2.5 font-mono text-xs font-bold text-[#5C1F28]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-lg font-bold leading-snug">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs text-[#1C1412]/70 leading-relaxed grow">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
          <p className="couple-fade-up text-center text-sm sm:text-base text-[#F8F4EE]/85 max-w-2xl mx-auto leading-relaxed">
            {LANDING_REPORT_PILLARS.close}
          </p>
        </div>
      </section>

      {/* Two looks */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="couple-fade-up text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {LANDING_TWO_LOOKS.eyebrow}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <article className="couple-roll-left rounded-2xl border border-border bg-white p-8 shadow-card space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold">
              {LANDING_TWO_LOOKS.privateTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {LANDING_TWO_LOOKS.privateBody}
            </p>
          </article>
          <article className="couple-roll-right rounded-2xl border-2 border-accent bg-white p-8 shadow-elevated space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold">
              {LANDING_TWO_LOOKS.crossTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous ne voulons pas seulement savoir :
            </p>
            <p className="text-sm italic text-muted-foreground">
              « {LANDING_TWO_LOOKS.crossWrong} »
            </p>
            <p className="font-serif text-lg font-bold text-foreground leading-snug">
              « {LANDING_TWO_LOOKS.crossRight} »
            </p>
          </article>
        </div>
      </section>

      {/* Maybe discover */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-secondary/30">
        <div className="max-w-3xl mx-auto couple-fade-up space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center">
            {LANDING_MAYBE.title}
          </h2>
          <ul className="space-y-3">
            {LANDING_MAYBE.items.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-white/90 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="text-center font-medium text-foreground">
            {LANDING_MAYBE.close}
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="couple-fade-up text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {LANDING_TOOLS.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            {LANDING_TOOLS.title}
          </h2>
          <p className="text-muted-foreground">{LANDING_TOOLS.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, ...LANDING_TOOLS.items[0] },
            { icon: ClipboardList, ...LANDING_TOOLS.items[1] },
            { icon: Target, ...LANDING_TOOLS.items[2] },
          ].map((tool) => {
            const Icon = tool.icon
            return (
              <article
                key={tool.title}
                className="couple-fade-up group relative p-8 rounded-2xl bg-white border border-border shadow-card hover:shadow-elevated hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary border border-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.body}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Audiences — image cards */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-10">
        <h2 className="couple-fade-up font-serif text-3xl sm:text-4xl font-bold text-center">
          Pour qui ?
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {LANDING_AUDIENCES.map((a, i) => (
            <article
              key={a.title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border shadow-card min-h-[380px]",
                i % 2 === 0 ? "couple-roll-left" : "couple-roll-right"
              )}
            >
              <div className="couple-zoom-frame absolute inset-0">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  className="couple-zoom-img object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7 space-y-2">
                <h3 className="font-serif text-2xl font-bold text-white">
                  {a.title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">{a.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Parcours 5 steps */}
      <section className="relative py-20 sm:py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="couple-fade-up text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Comment ça commence
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            Votre parcours à deux
          </h2>
        </div>
        <div className="couple-steps-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {LANDING_STEPS.map((step) => (
            <div
              key={step.n}
              className="couple-step-card group relative p-6 rounded-2xl bg-white border border-border shadow-card hover:shadow-elevated hover:-translate-y-2 transition-all duration-500"
            >
              <span className="font-mono text-xs font-bold text-accent">{step.n}</span>
              <h3 className="mt-3 font-serif text-lg font-bold leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <div className="couple-fade-up flex justify-center mt-10">
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            Commencer mon bilan
          </MagneticButton>
        </div>
      </section>

      {/* Offers */}
      <section className="compare-container relative py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/home/hero-african-wedding.png"
            alt=""
            fill
            className="object-cover object-[center_35%]"
            aria-hidden
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          <div className="couple-fade-up text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {LANDING_OFFERS.eyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Deux niveaux d’accompagnement
            </h2>
          </div>
          <div className="couple-offers-grid grid md:grid-cols-2 gap-6 lg:gap-10">
            <article className="couple-offer-card p-8 sm:p-10 rounded-2xl border border-white/15 bg-black/35 backdrop-blur-md space-y-5">
              <h3 className="font-serif text-2xl font-bold text-white">
                Bilan Essentiel
              </h3>
              <CoupleOfferPrice offerId="couple_essential" tone="dark" />
              <p className="text-sm text-white/80 leading-relaxed">
                {LANDING_OFFERS.essentialFor}
              </p>
              <ul className="space-y-2.5">
                {LANDING_OFFERS.essentialFeatures.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-white/85">
                    <span className="text-accent">·</span> {f}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-white/70 leading-relaxed">
                {LANDING_OFFERS.essentialClose}
              </p>
              <MagneticButton
                href="/couple/checkout/couple_essential"
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/40 text-white hover:bg-white/20"
              >
                Choisir Essentiel — 30 000 FCFA
              </MagneticButton>
            </article>

            <article className="couple-offer-card p-8 sm:p-10 rounded-2xl border-2 border-accent bg-white text-foreground shadow-elevated space-y-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Vous voulez aller plus loin
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                Bilan Premium Plus
              </h3>
              <CoupleOfferPrice offerId="couple_premium_plus" tone="light" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {LANDING_OFFERS.premiumFor}
              </p>
              <ul className="space-y-2.5">
                {LANDING_OFFERS.premiumFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2 text-sm font-medium text-foreground"
                  >
                    <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {f}
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
          <div className="couple-fade-up grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-center">
            <p className="text-sm text-white/80">
              <span className="line-through text-white/40 mr-1">40 000</span>
              <span className="text-accent font-semibold">30 000 FCFA</span>
              <br />
              {LANDING_OFFERS.summaryEssential}
            </p>
            <p className="text-sm text-white/80">
              <span className="line-through text-white/40 mr-1">60 000</span>
              <span className="text-accent font-semibold">50 000 FCFA</span>
              <br />
              {LANDING_OFFERS.summaryPremium}
            </p>
          </div>
        </div>
      </section>

      {/* Imagine + journey card */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 relative overflow-hidden bg-[#1C1412] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 20%, rgba(184,149,74,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(92,31,40,0.35), transparent 40%)",
          }}
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="couple-roll-left space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {LANDING_IMAGINE.eyebrow}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              {LANDING_IMAGINE.title}
            </h2>
            <p className="text-white/75 leading-relaxed">{LANDING_IMAGINE.body}</p>
            <div className="space-y-3 pt-2">
              {LANDING_IMAGINE.quotes.map((q) => (
                <blockquote
                  key={q}
                  className="border-l-2 border-accent/70 pl-4 font-serif italic text-accent/95"
                >
                  « {q} »
                </blockquote>
              ))}
            </div>
            <p className="font-medium text-white/90">{LANDING_IMAGINE.close}</p>
          </div>
          <div className="couple-roll-right">
            <CoupleJourneyCard />
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 lg:px-20 max-w-3xl mx-auto text-center space-y-6">
        <h2 className="couple-fade-up font-serif text-3xl sm:text-5xl font-bold leading-tight">
          {LANDING_CLOSING.title}
        </h2>
        <p className="couple-fade-up text-muted-foreground leading-relaxed text-lg">
          {LANDING_CLOSING.body}
        </p>
          <div className="couple-fade-up flex flex-wrap justify-center gap-3 pt-2">
            <MagneticButton href="/couple/checkout/couple_essential" variant="primary" size="lg">
              Commencer mon bilan — 30 000 FCFA
            </MagneticButton>
            <MagneticButton
              href="/couple/checkout/couple_premium_plus"
              variant="outline"
              size="lg"
            >
              Choisir Premium Plus — 50 000 FCFA
            </MagneticButton>
          </div>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-[#F8F4EE]">
        <div className="max-w-3xl mx-auto couple-fade-up space-y-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            {LANDING_CLOSING.lastQ}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {LANDING_CLOSING.lastPrompt}
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {LANDING_CLOSING.lastOptions.map((o) => (
              <li
                key={o}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium"
              >
                {o}
              </li>
            ))}
          </ul>
          <blockquote className="font-serif text-xl italic text-foreground">
            « {LANDING_CLOSING.lastQuote} »
          </blockquote>
          <p className="font-medium">{LANDING_CLOSING.start}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            {COUPLE_BRAND}
          </p>
          <p className="text-sm text-muted-foreground italic">
            {LANDING_CLOSING.tagline}
          </p>
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            Je commence
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
          <div>
            <Link
              href="/couple/espace"
              className="text-sm font-semibold text-primary"
            >
              Mon espace couple →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
