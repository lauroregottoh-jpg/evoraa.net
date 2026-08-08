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
  title: `${COUPLE_BRAND} | Bilan de couple | KELIAA`,
  description: COUPLE_TAGLINE,
}

const AUDIENCES = [
  {
    title: "Vous êtes fiancés ou cheminants",
    body: "Avant de franchir une étape majeure, vous voulez savoir ce qui est déjà solide — et quels sujets il faut encore clarifier à deux, sans dramatiser.",
  },
  {
    title: "Vous êtes nouvellement mariés",
    body: "Les premières années posent les habitudes. Le bilan vous donne une carte pour ajuster communication, rôles, finances et intimité avant que les tensions s’installent.",
  },
  {
    title: "Vous êtes ensemble depuis longtemps",
    body: "Vous vous aimez, mais certains sujets tournent en boucle. Le bilan nomme les convergences, les écarts de perception et les priorités concrètes à travailler.",
  },
  {
    title: "Vous voulez construire, pas juger",
    body: "Pas de verdict « compatible / incompatible ». Une lecture respectueuse de votre dynamique, pour décider ensemble de ce que vous construisez.",
  },
]

const JOURNEY = [
  {
    title: "Un partenaire achète le bilan",
    body: "Essentiel ou Premium Plus — le tarif couple couvre les deux participants. Ce n’est pas deux tests séparés : c’est une expérience d’analyse à deux.",
  },
  {
    title: "Invitation sécurisée",
    body: "Lien ou code à usage unique, deux places maximum. Votre partenaire rejoint son propre espace.",
  },
  {
    title: "Chacun répond en privé",
    body: "Questionnaires individuels confidentiels. Les réponses brutes ne sont jamais partagées avec l’autre.",
  },
  {
    title: "Analyse croisée",
    body: "Quand les deux ont terminé : convergences, différences, écarts de perception, complémentarités, zones de vigilance.",
  },
  {
    title: "Rapport, exercices, plan",
    body: "Un dossier rédigé pour vous deux — à relire, discuter, et mettre en pratique. Accès interactif un an, téléchargement local possible.",
  },
]

const ESSENTIAL_DETAIL = [
  {
    title: "Deux profils, une analyse",
    body: "Création des espaces, questionnaires complets, forces personnelles et points de vigilance pour chaque partenaire.",
  },
  {
    title: "Croisement relationnel",
    body: "Indice de convergence, convergences, divergences, écarts de perception, complémentarités et zones de vigilance du couple.",
  },
  {
    title: "Priorités actionnables",
    body: "3 à 5 priorités claires, actions individuelles et actions communes — pas seulement un score.",
  },
  {
    title: "Rapport rédigé",
    body: "Environ 35 à 50 pages selon la richesse de vos résultats : une carte de compréhension, pas un quiz.",
  },
  {
    title: "Exercices & plan",
    body: "Exercices de réflexion et plan d’action pour transformer l’analyse en conversations utiles.",
  },
  {
    title: "Confidentialité",
    body: "Votre partenaire ne lit pas vos réponses ligne à ligne. Le rapport commun éclaire la dynamique.",
  },
]

const PREMIUM_EXTRA = [
  {
    title: "Tout l’Essentiel, enrichi",
    body: "Premium Plus = Essentiel + profondeur. Pas un produit séparé : une couche supplémentaire sur la même base.",
  },
  {
    title: "Dynamiques & scénarios",
    body: "Analyses de dynamiques approfondies et scénarios relationnels rédigés pour anticiper les situations réelles.",
  },
  {
    title: "Protocoles & charte",
    body: "Protocoles de travail à deux et charte relationnelle pour poser des règles claires et respectueuses.",
  },
  {
    title: "Conversations guidées",
    body: "Conversations personnalisées détaillées — les sujets à ouvrir, dans quel ordre, avec quelles questions.",
  },
  {
    title: "Feuille de route étendue",
    body: "Plan d’action détaillé, exercices supplémentaires, ressources ciblées et parcours suggéré selon vos résultats.",
  },
  {
    title: "Rapport plus dense",
    body: "Repère 50 à 70 pages lorsque la richesse des résultats le justifie — jamais gonflé artificiellement.",
  },
]

const WHY_BUY = [
  "Parce que « on se connaît déjà » n’empêche pas les malentendus sur l’argent, la famille, les rôles ou l’intimité.",
  "Parce qu’un conflit qui revient n’est souvent pas un manque d’amour — c’est un sujet non clarifié.",
  "Parce que vous méritez un outil structuré, chrétien dans l’esprit, qui respecte votre dignité : pas un swipe, pas un jugement.",
  "Parce que le prix couple est pensé pour deux (valeur individuelle théorique 40 000 / 60 000 FCFA) — vous achetez l’analyse croisée, pas deux PDF isolés.",
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
      <div className="max-w-3xl mx-auto space-y-14 pb-20">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-[#F8F4EE] via-[#F3EFE8] to-[#E8E0D4] px-6 py-10 sm:px-10 shadow-premium">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Service spécialisé KELIAA
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
            {COUPLE_BRAND}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{COUPLE_TAGLINE}</p>
          <div className="mt-4">
            <CouplePromiseLine />
          </div>
          <p className="mt-5 text-sm sm:text-base text-foreground/85 leading-relaxed max-w-xl">
            {COUPLE_PROMISE} Ce n’est pas une app de rencontre. C’est un{" "}
            <strong className="font-semibold">bilan relationnel approfondi</strong>{" "}
            pour deux personnes déjà engagées — fiancés, cheminants, mariés —
            qui veulent une carte claire de leur dynamique.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/couple/offre"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 text-sm font-semibold"
            >
              Commencer le bilan
            </Link>
            <Link
              href="/pricing#couples"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white/70 px-5 text-sm font-semibold"
            >
              Voir les tarifs
            </Link>
            <Link
              href="/couple/rejoindre"
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-primary"
            >
              J’ai un code
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Pour qui est conçu ce bilan ?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si vous vous reconnaissez dans l’une de ces situations, {COUPLE_BRAND}{" "}
            a été pensé pour vous.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {AUDIENCES.map((a) => (
              <article
                key={a.title}
                className="rounded-2xl border border-border/70 bg-white/85 p-4 space-y-1.5"
              >
                <h3 className="font-serif text-lg font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {a.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-6 space-y-3">
          <h2 className="font-serif text-2xl font-bold">
            Pourquoi des milliers de couples ont besoin de ça
          </h2>
          <ul className="space-y-2.5">
            {WHY_BUY.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-sm text-foreground/90 leading-relaxed"
              >
                <span className="text-accent font-bold">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Ce que vous vivez, concrètement
          </h2>
          <ol className="space-y-3">
            {JOURNEY.map((step, i) => (
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

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Bilan Essentiel — ce que vous obtenez
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tarif couple{" "}
              <strong className="text-foreground">
                {essential.amountXof.toLocaleString("fr-FR")} FCFA
              </strong>{" "}
              (valeur théorique 40 000 FCFA pour deux analyses séparées). Vous
              achetez une expérience à deux, pas un questionnaire isolé.
            </p>
          </div>
          <div className="space-y-3">
            {ESSENTIAL_DETAIL.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-white/90 px-4 py-3"
              >
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
              Le plus choisi
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Bilan Premium Plus — la profondeur en plus
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tarif couple{" "}
              <strong className="text-foreground">
                {premium.amountXof.toLocaleString("fr-FR")} FCFA
              </strong>{" "}
              (valeur théorique 60 000 FCFA). Tout l’Essentiel, puis les couches
              qui transforment la lecture en protocole de travail.
            </p>
          </div>
          <div className="space-y-3">
            {PREMIUM_EXTRA.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-accent/35 bg-accent/5 px-4 py-3"
              >
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-6 space-y-3">
          <h2 className="font-serif text-xl font-bold">
            Ce que ce bilan n’est pas
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pas un quiz amusant. Pas une prédiction de mariage. Pas un diagnostic
            clinique. Pas un jugement qui vous dit de rester ou de partir. Si une
            zone touche à la sécurité ou à une blessure profonde, un professionnel
            compétent peut compléter ce bilan — {COUPLE_BRAND} éclaire ; il ne
            remplace pas un accompagnement thérapeutique.
          </p>
        </section>

        <section className="rounded-[1.5rem] border border-primary/25 bg-gradient-to-br from-white to-[#F8F4EE] px-6 py-8 space-y-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Prêts à voir clairement ce que vous construisez ?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            À la fin du parcours, vous ne repartez pas avec un simple score :
            vous repartez avec un langage commun, des priorités, des exercices et
            un plan. Si ce n’est pas le moment de payer, mettez de côté —
            beaucoup de couples le font avant une étape importante.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/couple/offre"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 text-sm font-semibold"
            >
              Choisir Essentiel ou Premium Plus
            </Link>
            <Link
              href="/couple/espace"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold"
            >
              Mon espace couple
            </Link>
          </div>
        </section>
      </div>
    </MemberPage>
  )
}
