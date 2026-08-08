import type { ReactNode } from "react"
import Link from "next/link"
import { PageHero } from "@/components/marketing/PageHero"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"
import { COUPLE_OFFERS } from "@/lib/couple/offers"
import {
  LANDING_AFTER,
  LANDING_CHANGE,
  LANDING_CLOSING,
  LANDING_DISCOVER,
  LANDING_FAITH,
  LANDING_FAQ,
  LANDING_HERO,
  LANDING_NO_CRISIS,
  LANDING_NOT,
  LANDING_REPORT,
  LANDING_SCORE,
  LANDING_STEPS,
  LANDING_WHY,
} from "@/lib/couple/landingCopy"

function Section({
  children,
  className = "",
  tone = "plain",
}: {
  children: ReactNode
  className?: string
  tone?: "plain" | "warm" | "soft"
}) {
  const toneClass =
    tone === "warm"
      ? "bg-[#F8F4EE]"
      : tone === "soft"
        ? "bg-secondary/30"
        : ""
  return (
    <section
      className={`py-16 sm:py-20 px-6 sm:px-12 lg:px-20 ${toneClass} ${className}`}
    >
      <div className="max-w-3xl mx-auto space-y-6">{children}</div>
    </section>
  )
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
      {children}
    </h2>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
      {children}
    </p>
  )
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
      {children}
    </p>
  )
}

export function CoupleLanding() {
  const essential = COUPLE_OFFERS.couple_essential
  const premium = COUPLE_OFFERS.couple_premium_plus

  return (
    <>
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
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            {LANDING_HERO.ctaPrimary}
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

      <Section>
        <Lead>{LANDING_HERO.lead}</Lead>
        <Body>{LANDING_HERO.promise}</Body>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          Vous ne repartez pas simplement avec un pourcentage. Vous repartez
          avec une lecture de votre dynamique, des sujets à approfondir, des
          forces, des conversations à avoir et des actions concrètes pour
          avancer à deux.
        </p>
      </Section>

      <Section tone="warm">
        <H2>{LANDING_WHY.title}</H2>
        <Lead>{LANDING_WHY.subtitle}</Lead>
        {LANDING_WHY.body.map((p) => (
          <Body key={p.slice(0, 40)}>{p}</Body>
        ))}
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_WHY.close}
        </p>
      </Section>

      <Section>
        <H2>{LANDING_DISCOVER.title}</H2>
        <Lead>{LANDING_DISCOVER.intro}</Lead>
        <div className="space-y-8 pt-2">
          {LANDING_DISCOVER.blocks.map((b) => (
            <div key={b.title} className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {b.title}
              </h3>
              <Body>{b.body}</Body>
            </div>
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-2 pt-2 text-sm text-muted-foreground">
          {LANDING_DISCOVER.themes.map((t) => (
            <li key={t} className="after:content-['·'] after:ml-3 last:after:content-none">
              {t}
            </li>
          ))}
        </ul>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_DISCOVER.close}
        </p>
      </Section>

      <Section tone="soft">
        <H2>{LANDING_SCORE.title}</H2>
        {LANDING_SCORE.body.map((p) => (
          <Body key={p.slice(0, 40)}>{p}</Body>
        ))}
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_SCORE.close}
        </p>
      </Section>

      <Section>
        <H2>{LANDING_STEPS.title}</H2>
        <Lead>{LANDING_STEPS.subtitle}</Lead>
        <Body>{LANDING_STEPS.intro}</Body>
        <ol className="space-y-6 pt-4">
          {LANDING_STEPS.items.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div className="space-y-1.5 pt-0.5">
                <h3 className="font-serif text-xl font-bold">{step.title}</h3>
                <Body>{step.body}</Body>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="warm">
        <H2>{LANDING_REPORT.title}</H2>
        <div className="space-y-8">
          {LANDING_REPORT.items.map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {item.title}
              </h3>
              <Body>{item.body}</Body>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <H2>{LANDING_AFTER.title}</H2>
        <Lead>{LANDING_AFTER.subtitle}</Lead>
        <div className="space-y-8 pt-2">
          {LANDING_AFTER.items.map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="font-serif text-xl font-bold">{item.title}</h3>
              <Body>{item.body}</Body>
            </div>
          ))}
        </div>
      </Section>

      <section className="py-16 sm:py-20 px-6 sm:px-12 lg:px-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <H2>Deux niveaux pour deux niveaux d’accompagnement</H2>
            <Body>
              Premium Plus comprend tout le Bilan Essentiel, puis va plus loin
              dans l’analyse et le travail à deux.
            </Body>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <article className="space-y-4 border-t border-border pt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Bilan Essentiel
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                {essential.marketingName}
              </h3>
              <p className="font-serif text-xl font-semibold text-foreground">
                {essential.amountXof.toLocaleString("fr-FR")} FCFA{" "}
                <span className="text-sm font-sans font-normal text-muted-foreground">
                  pour le couple
                </span>
              </p>
              <Body>
                Pour les couples qui veulent comprendre leur dynamique et savoir
                sur quoi travailler.
              </Body>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Questionnaires individuels confidentiels",
                  "Analyse individuelle + analyse croisée",
                  "Forces, priorités, recommandations",
                  "Exercices relationnels + plan d’action",
                  "Rapport personnalisé (repère 35–50 pages)",
                  "Accès espace KELIAA selon l’offre",
                ].map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Body>
                Pour vous si vous voulez faire le point sérieusement et repartir
                avec des priorités concrètes.
              </Body>
              <MagneticButton
                href="/couple/checkout/couple_essential"
                variant="outline"
                size="lg"
              >
                Choisir le Bilan Essentiel —{" "}
                {essential.amountXof.toLocaleString("fr-FR")} FCFA
              </MagneticButton>
            </article>

            <article className="space-y-4 border-t-2 border-accent pt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Bilan Premium Plus
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                {premium.marketingName}
              </h3>
              <p className="font-serif text-xl font-semibold text-foreground">
                {premium.amountXof.toLocaleString("fr-FR")} FCFA{" "}
                <span className="text-sm font-sans font-normal text-muted-foreground">
                  pour le couple
                </span>
              </p>
              <Body>
                Pour les couples qui veulent aller beaucoup plus loin dans la
                compréhension et le travail. Tout l’Essentiel, puis plus
                d’analyse, de structure et d’outils.
              </Body>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Tout le Bilan Essentiel",
                  "Dynamiques relationnelles approfondies",
                  "Scénarios relationnels",
                  "Conversations guidées détaillées",
                  "Protocoles de travail + charte relationnelle",
                  "Plan d’action étendu · rapport 50–70 pages",
                ].map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Body>
                Pour vous si vous préparez une étape importante, consolidez des
                bases, ou voulez réellement travailler votre dynamique — pas
                seulement savoir où vous en êtes.
              </Body>
              <MagneticButton
                href="/couple/checkout/couple_premium_plus"
                variant="primary"
                size="lg"
              >
                Choisir le Premium Plus —{" "}
                {premium.amountXof.toLocaleString("fr-FR")} FCFA
              </MagneticButton>
            </article>
          </div>

          <div className="text-center">
            <Link
              href="/pricing#couples"
              className="text-sm font-semibold text-primary"
            >
              Comparer aussi sur la page Tarifs →
            </Link>
          </div>
        </div>
      </section>

      <Section tone="warm">
        <H2>{LANDING_NO_CRISIS.title}</H2>
        <Body>{LANDING_NO_CRISIS.body}</Body>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_NO_CRISIS.close}
        </p>
      </Section>

      <Section>
        <H2>{LANDING_FAITH.title}</H2>
        <Body>{LANDING_FAITH.body}</Body>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_FAITH.close}
        </p>
      </Section>

      <Section tone="soft">
        <H2>{LANDING_NOT.title}</H2>
        <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
          {LANDING_NOT.items.map((item) => (
            <li key={item} className="leading-relaxed">
              — {item}
            </li>
          ))}
        </ul>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_NOT.close}
        </p>
      </Section>

      <Section>
        <H2>{LANDING_CHANGE.title}</H2>
        <div className="space-y-4">
          {LANDING_CHANGE.quotes.map((q) => (
            <blockquote
              key={q}
              className="border-l-2 border-accent/60 pl-4 text-sm sm:text-base text-foreground/90 leading-relaxed italic font-serif"
            >
              « {q} »
            </blockquote>
          ))}
        </div>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_CHANGE.close}
        </p>
      </Section>

      <Section tone="warm">
        <H2>{LANDING_CLOSING.title}</H2>
        <Body>{LANDING_CLOSING.body}</Body>
        <ul className="space-y-2 text-sm sm:text-base font-medium text-foreground">
          {LANDING_CLOSING.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <MagneticButton href="/couple/offre" variant="primary" size="lg">
          Commencer mon Bilan de Couple
        </MagneticButton>
      </Section>

      <Section>
        <H2>{LANDING_CLOSING.lastTitle}</H2>
        <Body>{LANDING_CLOSING.lastBody}</Body>
        <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
          {LANDING_CLOSING.lastClose}
        </p>
        <MagneticButton href="/couple/offre" variant="primary" size="lg">
          Je commence mon bilan
        </MagneticButton>
      </Section>

      <Section tone="soft">
        <H2>FAQ</H2>
        <div className="divide-y divide-border">
          {LANDING_FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-serif text-lg font-bold text-foreground pr-6 relative">
                {item.q}
                <span className="absolute right-0 top-0 text-muted-foreground group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <section className="py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            {COUPLE_BRAND}
          </p>
          <div className="space-y-2 font-serif text-2xl sm:text-3xl font-bold leading-snug">
            {LANDING_CLOSING.footerLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            Choisir mon bilan de couple
          </MagneticButton>
          <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed max-w-xl mx-auto">
            {COUPLE_BRAND} — {LANDING_CLOSING.tagline}
          </p>
          <Link
            href="/couple/espace"
            className="inline-flex text-sm font-semibold text-primary"
          >
            Mon espace couple →
          </Link>
        </div>
      </section>
    </>
  )
}
