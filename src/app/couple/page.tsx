import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { CouplePromiseLine } from "@/components/couple/CoupleShell"
import {
  COUPLE_BRAND,
  COUPLE_TAGLINE,
  COUPLE_PROMISE,
  isCoupleFeatureEnabled,
} from "@/lib/couple/config"
import { COUPLE_OFFERS } from "@/lib/couple/offers"

export const metadata = {
  title: `${COUPLE_BRAND} | KELIAA`,
  description: COUPLE_TAGLINE,
}

const STEPS = [
  {
    title: "Un partenaire achète",
    body: "Essentiel ou Premium Plus — le prix couvre les deux participants.",
  },
  {
    title: "Invitation sécurisée",
    body: "Lien ou code à usage unique. Deux places maximum, pas plus.",
  },
  {
    title: "Questionnaires séparés",
    body: "Chacun répond en privé. Les réponses brutes ne sont jamais partagées.",
  },
  {
    title: "Analyse croisée",
    body: "Quand les deux ont terminé, le moteur calcule convergences et écarts.",
  },
  {
    title: "Rapport & plan",
    body: "Forces, priorités, exercices, plan d’action — et téléchargement du dossier.",
  },
]

const ESSENTIAL_DETAIL = [
  "18 dimensions relationnelles (vision, communication, conflits, finances…)",
  "Questionnaires individuels confidentiels",
  "Scores de convergence sans verdict d’incompatibilité",
  "Rapport rédigé : forces, différences, priorités",
  "Exercices pratiques + plan d’action",
  "Accès interactif 365 jours + téléchargement local",
]

const PREMIUM_EXTRA = [
  "Tout le Bilan Essentiel inclus",
  "Analyses de dynamiques approfondies",
  "Scénarios relationnels rédigés",
  "Protocoles de travail couple",
  "Charte relationnelle",
  "Exercices supplémentaires & plan étendu",
]

export default function CoupleLandingPage() {
  if (!isCoupleFeatureEnabled()) {
    return (
      <MemberPage>
        <p className="text-sm text-muted-foreground">
          Service temporairement indisponible.
        </p>
      </MemberPage>
    )
  }

  const essential = COUPLE_OFFERS.couple_essential
  const premium = COUPLE_OFFERS.couple_premium_plus

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-12 pb-16">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-[#F8F4EE] via-[#F3EFE8] to-[#E8E0D4] px-6 py-10 sm:px-10 shadow-premium">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Service spécialisé KELIAA · Nouveau
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
            {COUPLE_BRAND}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{COUPLE_TAGLINE}</p>
          <div className="mt-4">
            <CouplePromiseLine />
          </div>
          <p className="mt-4 text-sm text-foreground/80 leading-relaxed max-w-xl">
            {COUPLE_PROMISE} Ce n’est pas une app de rencontre : c’est un bilan
            pour deux personnes déjà engagées qui veulent clarifier leur
            dynamique.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/couple/offre"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 text-sm font-semibold"
            >
              Choisir une offre
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

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">Pour qui ?</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm leading-relaxed">
            <div className="rounded-2xl border border-border/70 bg-white/80 p-4">
              <p className="font-semibold text-foreground">Oui</p>
              <p className="text-muted-foreground mt-1">
                Fiancés, couples mariés ou engagés qui veulent un miroir
                structuré — sans jugement, avec un plan concret.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/80 p-4">
              <p className="font-semibold text-foreground">Non</p>
              <p className="text-muted-foreground mt-1">
                Pas un matching célibataires, pas un test « compatible /
                incompatible », pas un remplacement d’un accompagnement
                thérapeutique.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">Comment ça fonctionne</h2>
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-3 rounded-2xl border border-border/60 bg-white/70 px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">
            Fonctionnalités détaillées
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <article className="rounded-2xl border border-border/70 bg-white/90 p-5 sm:p-6 space-y-3">
              <h3 className="font-serif text-xl font-bold">
                {essential.marketingName}
              </h3>
              <p className="font-serif text-3xl font-bold text-primary">
                {essential.amountXof.toLocaleString("fr-FR")}{" "}
                <span className="text-base font-sans font-medium text-muted-foreground">
                  FCFA
                </span>
              </p>
              <ul className="space-y-2 text-sm text-foreground/90">
                {ESSENTIAL_DETAIL.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-accent/40 bg-accent/5 p-5 sm:p-6 space-y-3 shadow-card">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Le plus choisi
              </p>
              <h3 className="font-serif text-xl font-bold">
                {premium.marketingName}
              </h3>
              <p className="font-serif text-3xl font-bold text-primary">
                {premium.amountXof.toLocaleString("fr-FR")}{" "}
                <span className="text-base font-sans font-medium text-muted-foreground">
                  FCFA
                </span>
              </p>
              <ul className="space-y-2 text-sm text-foreground/90">
                {PREMIUM_EXTRA.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Premium Plus = tout l’Essentiel + les enrichissements. Les prix sont
            confirmés côté serveur au paiement. Après achat, votre espace couple
            se débloque (invitation, questionnaires, rapport).
          </p>
          <Link
            href="/couple/offre"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 text-sm font-semibold"
          >
            Passer à l’achat
          </Link>
        </section>

        <section className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-5 space-y-2">
          <h2 className="font-serif text-xl font-bold">Confidentialité</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Votre partenaire ne voit pas vos réponses brutes. L’analyse croisée
            produit un rapport commun — pas un dévoilement ligne à ligne. Si
            vous avez déjà passé des tests Découverte / Alliance, certaines
            questions peuvent être préremplies : vous les relisez et validez
            avant envoi.
          </p>
        </section>
      </div>
    </MemberPage>
  )
}
