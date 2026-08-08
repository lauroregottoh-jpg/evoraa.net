import Link from "next/link"
import { CinematicLayout } from "@/components/layout/CinematicLayout"
import { PageHero } from "@/components/marketing/PageHero"
import { MagneticButton } from "@/components/ui/magnetic-button"
import {
  COUPLE_BRAND,
  COUPLE_TAGLINE,
  COUPLE_PROMISE,
  isCoupleFeatureEnabled,
} from "@/lib/couple/config"
import { COUPLE_OFFERS } from "@/lib/couple/offers"

const AUDIENCES = [
  {
    title: "Fiancés ou cheminants",
    body: "Avant une étape majeure, vous voulez savoir ce qui est déjà solide — et quels sujets clarifier à deux, sans dramatiser.",
  },
  {
    title: "Nouvellement mariés",
    body: "Les premières années fixent les habitudes. Le bilan donne une carte pour ajuster communication, rôles, finances et intimité.",
  },
  {
    title: "Ensemble depuis longtemps",
    body: "Vous vous aimez, mais certains sujets tournent en boucle. Nommez les convergences, les écarts et les priorités concrètes.",
  },
  {
    title: "Vous voulez construire, pas juger",
    body: "Pas de verdict « compatible / incompatible ». Une lecture respectueuse pour décider ensemble de ce que vous construisez.",
  },
]

const JOURNEY = [
  "Un partenaire achète le bilan (Essentiel ou Premium Plus) — tarif couple, deux participants.",
  "Invitation sécurisée : lien ou code, deux places maximum.",
  "Chacun répond en privé. Les réponses brutes ne sont jamais partagées.",
  "Analyse croisée : convergences, différences, écarts de perception, vigilance.",
  "Rapport rédigé, exercices et plan d’action — à vivre ensemble.",
]

const WHY = [
  "Parce que « on se connaît déjà » n’empêche pas les malentendus sur l’argent, la famille ou les rôles.",
  "Parce qu’un conflit qui revient n’est souvent pas un manque d’amour — c’est un sujet non clarifié.",
  "Parce que vous méritez un outil structuré, digne, qui éclaire sans condamner.",
  "Parce que vous achetez une expérience d’analyse à deux — pas deux questionnaires isolés.",
]

export const metadata = {
  title: `${COUPLE_BRAND} | Bilan de couple | KELIAA`,
  description: COUPLE_TAGLINE,
}

export default function CoupleMarketingPage() {
  if (!isCoupleFeatureEnabled()) {
    return (
      <CinematicLayout>
        <p className="p-12 text-sm text-muted-foreground text-center">
          Service temporairement indisponible.
        </p>
      </CinematicLayout>
    )
  }

  const essential = COUPLE_OFFERS.couple_essential
  const premium = COUPLE_OFFERS.couple_premium_plus

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Service spécialisé KELIAA"
        title={COUPLE_BRAND}
        highlight={COUPLE_TAGLINE}
        subtitle={`${COUPLE_PROMISE} Un bilan relationnel pour fiancés, cheminants et couples mariés — distinct du matching célibataires.`}
        imageSrc="/home/hero-african-wedding.png"
        imageClassName="object-[center_32%] sm:object-center"
        imageAlt={COUPLE_BRAND}
      >
        <div className="pt-6 flex flex-wrap gap-3">
          <MagneticButton href="/couple/offre" variant="primary" size="lg">
            Commencer le bilan
          </MagneticButton>
          <MagneticButton
            href="/couple/rejoindre"
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
          >
            J’ai un code
          </MagneticButton>
        </div>
      </PageHero>

      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-serif text-3xl font-bold">Pour qui ?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si vous vous reconnaissez ici, ce bilan a été pensé pour vous.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {AUDIENCES.map((a) => (
            <article
              key={a.title}
              className="rounded-2xl border border-border bg-white/90 p-5 space-y-2"
            >
              <h3 className="font-serif text-xl font-bold">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-14 px-6 sm:px-12 lg:px-20 bg-[#F8F4EE]">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="font-serif text-3xl font-bold text-center">
            Pourquoi ce bilan change la conversation
          </h2>
          <ul className="space-y-3">
            {WHY.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-[#B8954A]/25 bg-white px-4 py-3 text-sm leading-relaxed text-[#1C1412]/85"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-3xl mx-auto space-y-6">
        <h2 className="font-serif text-3xl font-bold">Le parcours</h2>
        <ol className="space-y-3">
          {JOURNEY.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold">Deux niveaux de profondeur</h2>
            <p className="text-sm text-muted-foreground">
              Premium Plus = tout l’Essentiel, enrichi. Les montants sont sur Tarifs —
              ici, ce que vous vivez vraiment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-border bg-white p-6 space-y-3">
              <h3 className="font-serif text-2xl font-bold">{essential.marketingName}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Questionnaires individuels confidentiels",
                  "Analyse croisée : forces, convergences, différences",
                  "Priorités actionnables + exercices",
                  "Rapport rédigé (repère 35–50 pages)",
                  "Accès interactif un an + téléchargement",
                ].map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border-2 border-accent bg-white p-6 space-y-3 shadow-elevated">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Le plus choisi
              </p>
              <h3 className="font-serif text-2xl font-bold">{premium.marketingName}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Tout le Bilan Essentiel",
                  "Dynamiques & scénarios relationnels",
                  "Protocoles de travail + charte",
                  "Conversations guidées détaillées",
                  "Plan d’action étendu (repère 50–70 pages)",
                ].map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <MagneticButton href="/couple/offre" variant="primary" size="lg">
              Choisir mon bilan
            </MagneticButton>
            <MagneticButton href="/pricing#couples" variant="outline" size="lg">
              Voir les tarifs couple
            </MagneticButton>
            <Link
              href="/couple/espace"
              className="inline-flex h-12 items-center px-4 text-sm font-semibold text-primary"
            >
              Mon espace couple →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-3xl mx-auto text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold">
          Prêts à voir clairement ce que vous construisez ?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          À la fin, vous ne repartez pas avec un simple score : vous repartez avec un
          langage commun, des priorités et un plan. Ce n’est pas un quiz — c’est une
          carte de compréhension pour deux.
        </p>
        <MagneticButton href="/couple/offre" variant="primary" size="lg">
          Commencer maintenant
        </MagneticButton>
      </section>
    </CinematicLayout>
  )
}
