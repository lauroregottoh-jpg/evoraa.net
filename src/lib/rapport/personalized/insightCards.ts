/**
 * Templates premium V1 (sans LLM) — forces / axes / portrait / chapitres.
 * Sources : 23-2_REPORT_TEMPLATE_CONTENT, 08–17 libraries (taxonomie), DOSSIER RAPPORT.
 * Règle : jamais « Vous êtes… » / jamais dramatiser / jamais afficher un % comme titre.
 */

import type { ReportPillarId } from "@/lib/rapport/pillars"
import { scoreBand } from "@/lib/rapport/pillars"
import { REPORT_COPY } from "@/lib/rapport/personalized/copyLibrary"

export type InsightCard = {
  id: string
  kind: "force" | "vigilance"
  title: string
  description: string
  why: string
  impact: string
  tip: string
  pillarId: ReportPillarId
  score?: number
}

type PillarInsightPack = {
  forceTitle: string
  forceDescription: string
  forceWhy: string
  forceImpact: string
  forceTip: string
  vigilanceTitle: string
  vigilanceDescription: string
  vigilanceWhy: string
  vigilanceImpact: string
  vigilanceTip: string
  portraitForce: string
  portraitGrowth: string
}

const PACKS: Record<ReportPillarId, PillarInsightPack> = {
  relationnel: {
    forceTitle: "Qualité de lien et d’écoute",
    forceDescription:
      "Vos réponses suggèrent une capacité réelle à créer du lien, à écouter et à faire sentir à l’autre qu’il compte.",
    forceWhy:
      "Dans une relation durable, savoir accueillir l’autre et communiquer avec clarté est l’une des premières ressources du couple.",
    forceImpact:
      "Cette force favorise la confiance mutuelle, réduit les malentendus et prépare un climat d’alliance plus serein.",
    forceTip:
      "Continuez à reformuler ce que vous comprenez avant de répondre — c’est un geste simple qui renforce encore cette ressource.",
    vigilanceTitle: "Expression claire des besoins",
    vigilanceDescription:
      "Les résultats indiquent que certains besoins ou attentes pourraient rester trop implicites dans vos échanges.",
    vigilanceWhy:
      "Une relation solide repose aussi sur la capacité à dire, avec respect, ce dont on a réellement besoin.",
    vigilanceImpact:
      "Sans cela, des frustrations silencieuses peuvent s’accumuler et fragiliser la compréhension mutuelle.",
    vigilanceTip:
      "Choisissez une conversation calme cette semaine pour exprimer un besoin simple, précis et bienveillant.",
    portraitForce:
      "Dans vos relations, vous semblez naturellement porté(e) vers l’écoute et la construction du lien. Les autres peuvent sentir chez vous une présence attentive.",
    portraitGrowth:
      "Un axe utile consisterait à oser formuler davantage vos attentes, afin que l’autre ne doive pas les deviner.",
  },
  spirituel: {
    forceTitle: "Ancrage spirituel vivant",
    forceDescription:
      "Votre profil montre une place réelle accordée à la foi dans vos décisions et votre vision de la relation.",
    forceWhy:
      "Préparer un mariage chrétien demande une cohérence intérieure entre convictions, prière et choix du quotidien.",
    forceImpact:
      "Cet ancrage peut devenir un pilier commun : discernement, consolation et direction pour le couple.",
    forceTip:
      "Gardez un temps régulier de prière et de lecture biblique — même bref — pour nourrir cette force.",
    vigilanceTitle: "Cohérence foi et décisions",
    vigilanceDescription:
      "Les réponses suggèrent qu’il pourrait être utile d’aligner plus clairement vos choix relationnels avec votre vie spirituelle.",
    vigilanceWhy:
      "La foi prépare le mariage lorsqu’elle oriente concrètement les décisions, pas seulement les intentions.",
    vigilanceImpact:
      "Sans ce lien, la relation risque de manquer d’un socle commun au moment des choix importants.",
    vigilanceTip:
      "Avant une décision relationnelle importante, prenez un moment de prière et notez ce que vous discernez.",
    portraitForce:
      "La dimension spirituelle semble déjà constituer une ressource dans votre manière d’envisager une relation durable.",
    portraitGrowth:
      "Vous pourriez encore renforcer le lien entre vos convictions et vos décisions concrètes au quotidien.",
  },
  projets_de_vie: {
    forceTitle: "Vision claire de l’avenir",
    forceDescription:
      "Vous semblez disposer d’une direction de vie relativement claire — projets, priorités, aspirations.",
    forceWhy:
      "Un couple avance mieux lorsque chacun sait ce qu’il souhaite construire, et peut en parler avec lucidité.",
    forceImpact:
      "Cette clarté facilite le dialogue sur le mariage, la famille, le travail et les choix à long terme.",
    forceTip:
      "Écrivez en quelques lignes votre vision du mariage pour les cinq prochaines années — puis affinez-la.",
    vigilanceTitle: "Clarification des priorités de vie",
    vigilanceDescription:
      "Les résultats indiquent que certains projets ou priorités pourraient encore manquer de précision.",
    vigilanceWhy:
      "Sans vision partagée, les malentendus sur l’avenir (famille, travail, lieu de vie) deviennent fréquents.",
    vigilanceImpact:
      "Un projet flou peut créer de la tension dès que le couple doit trancher ensemble.",
    vigilanceTip:
      "Listez trois priorités non négociables et trois sujets ouverts au dialogue — c’est un excellent point de départ.",
    portraitForce:
      "Vous paraissez capable de projeter votre vie avec une certaine intention — une qualité précieuse pour construire à deux.",
    portraitGrowth:
      "Affiner encore vos priorités (mariage, famille, travail) rendrait votre préparation encore plus concrète.",
  },
  valeurs: {
    forceTitle: "Boussole intérieure solide",
    forceDescription:
      "Vos réponses mettent en avant des valeurs qui guident déjà vos décisions avec une certaine cohérence.",
    forceWhy:
      "Les valeurs partagées (ou au moins respectées) sont le ciment invisible d’une alliance durable.",
    forceImpact:
      "Dans le mariage, cette boussole aide à trancher avec intégrité face aux pressions et aux compromis.",
    forceTip:
      "Nommez vos cinq valeurs essentielles et vérifiez qu’une décision récente les a bien respectées.",
    vigilanceTitle: "Alignement valeurs et choix",
    vigilanceDescription:
      "Il semble utile de clarifier davantage quelles convictions orientent réellement vos choix relationnels.",
    vigilanceWhy:
      "Quand les valeurs restent floues, on peut accepter des situations qui ne correspondent pas à ce que l’on cherche vraiment.",
    vigilanceImpact:
      "À terme, cela peut créer de la dissonance intérieure et des conflits de couple sur l’essentiel.",
    vigilanceTip:
      "Pour chaque décision importante, posez-vous : « Est-ce aligné avec ce que je crois vraiment ? »",
    portraitForce:
      "Vous semblez porté(e) par des convictions qui structurent déjà votre manière d’aimer et de décider.",
    portraitGrowth:
      "Rendre ces valeurs plus explicites vous aidera à discerner plus sereinement une relation d’alliance.",
  },
  humain: {
    forceTitle: "Ouverture et maturité personnelle",
    forceDescription:
      "Votre profil suggère une capacité d’adaptation, de curiosité et d’équilibre dans votre vie personnelle.",
    forceWhy:
      "Une relation saine a besoin de deux personnes capables de grandir, de s’ajuster et de rester intéressantes l’une pour l’autre.",
    forceImpact:
      "Cette maturité personnelle nourrit la bienveillance, la souplesse et la résilience du couple.",
    forceTip:
      "Continuez à cultiver un centre d’intérêt hors couple — cela enrichit aussi la relation.",
    vigilanceTitle: "Équilibre de vie et adaptabilité",
    vigilanceDescription:
      "Les résultats indiquent qu’un meilleur équilibre (rythme, ouverture, habitudes) pourrait encore soutenir vos relations.",
    vigilanceWhy:
      "Le couple souffre souvent non d’un manque d’amour, mais d’un manque d’équilibre et de souplesse au quotidien.",
    vigilanceImpact:
      "Sans cet équilibre, la fatigue et la rigidité peuvent peser sur la qualité du lien.",
    vigilanceTip:
      "Choisissez une habitude simple cette semaine (repos, marche, activité nouvelle) qui nourrit votre équilibre.",
    portraitForce:
      "Sur le plan personnel, vous semblez disposer de ressources d’ouverture et d’équilibre qui favorisent des relations saines.",
    portraitGrowth:
      "Développer encore votre capacité d’adaptation et vos équilibres de vie renforcerait cette base humaine.",
  },
}

/** Construit jusqu’à 5 cartes force à partir des piliers les plus hauts. */
export function buildForceCards(
  ranked: { id: ReportPillarId; score: number }[]
): InsightCard[] {
  if (!ranked.length) return []
  // Toujours valoriser les meilleurs scores (même s’ils sont « moyens »)
  const candidates = ranked.slice(0, 5)
  return candidates.map((p) => {
    const pack = PACKS[p.id]
    const band = scoreBand(p.score)
    const strong = band === "force_majeure" || band === "bon_equilibre"
    return {
      id: `force_${p.id}`,
      kind: "force" as const,
      title: pack.forceTitle,
      description: strong
        ? pack.forceDescription
        : `Les résultats mettent en lumière une ressource intéressante autour de « ${pack.forceTitle.toLowerCase()} », encore en consolidation.`,
      why: pack.forceWhy,
      impact: pack.forceImpact,
      tip: pack.forceTip,
      pillarId: p.id,
      score: p.score,
    }
  })
}

/** Construit jusqu’à 5 axes de progression (pas des « faiblesses »). */
export function buildVigilanceCards(
  ranked: { id: ReportPillarId; score: number }[]
): InsightCard[] {
  if (!ranked.length) return []
  const lowest = [...ranked].sort((a, b) => a.score - b.score).slice(0, 5)
  // Éviter de dupliquer exactement les mêmes piliers que les 2 meilleures forces si possible
  const topIds = new Set(ranked.slice(0, 2).map((p) => p.id))
  const picked = lowest.filter((p) => !topIds.has(p.id)).slice(0, 3)
  const fill =
    picked.length >= 2
      ? picked
      : lowest.slice(0, Math.min(3, lowest.length))

  return fill.map((p) => {
    const pack = PACKS[p.id]
    return {
      id: `axe_${p.id}`,
      kind: "vigilance" as const,
      title: pack.vigilanceTitle,
      description: pack.vigilanceDescription,
      why: pack.vigilanceWhy,
      impact: pack.vigilanceImpact,
      tip: pack.vigilanceTip,
      pillarId: p.id,
      score: p.score,
    }
  })
}

/** Portrait fluide multi-piliers — template V1 (sans LLM). */
export function composePortraitNarrative(input: {
  firstName: string
  ranked: { id: ReportPillarId; score: number }[]
}): string {
  const name = input.firstName.trim() || "Membre"
  if (!input.ranked.length) {
    return `${REPORT_COPY.portraitIntro}\n\n${name}, votre portrait relationnel se construira dès que vous aurez complété vos premières évaluations. Chaque test apportera une pièce nouvelle à cette lecture — sans jamais vous enfermer dans une étiquette.`
  }

  const top = input.ranked.slice(0, 2)
  const low = [...input.ranked].sort((a, b) => a.score - b.score).slice(0, 2)

  const parts: string[] = [
    REPORT_COPY.portraitIntro,
    `${name}, voici une lecture actuelle de votre manière d’entrer en relation — fondée sur les évaluations déjà réalisées. Ce n’est pas une définition figée : c’est une photographie utile pour avancer.`,
  ]

  for (const p of top) {
    parts.push(PACKS[p.id].portraitForce)
  }

  for (const p of low) {
    if (top.some((t) => t.id === p.id)) continue
    parts.push(PACKS[p.id].portraitGrowth)
  }

  parts.push(
    "Dans l’ensemble, vos résultats mettent en lumière des ressources déjà présentes, et des domaines où une progression douce, concrète et régulière portera du fruit. Continuez les évaluations Alliance : chaque clé ouvrira une analyse plus fine de ce portrait."
  )

  return parts.join("\n\n")
}

/** Résumé exécutif (sans scores bruts dans le récit). */
export function composeExecutiveSummary(input: {
  firstName: string
  forces: InsightCard[]
  vigilances: InsightCard[]
  testsDone: number
  testsTotal: number
}): string {
  const name = input.firstName.trim() || "Membre"
  const forceNames = input.forces.map((f) => f.title.toLowerCase())
  const axeNames = input.vigilances.map((v) => v.title.toLowerCase())

  const who =
    forceNames.length > 0
      ? `${name}, dans une relation, vous semblez surtout vous appuyer sur ${forceNames.slice(0, 2).join(" et ")}.`
      : `${name}, votre profil relationnel commence à se dessiner. Complétez vos évaluations pour affiner cette lecture.`

  const qualities =
    forceNames.length > 0
      ? `Vos principales qualités observées : ${forceNames.join(", ")}.`
      : "Vos principales qualités apparaîtront clairement dès que davantage d’évaluations seront complétées."

  const grow =
    axeNames.length > 0
      ? `Les domaines à renforcer en priorité : ${axeNames.join(", ")}. Ce ne sont pas des limites — ce sont des leviers de croissance.`
      : REPORT_COPY.noPriority

  const next =
    input.testsDone < input.testsTotal
      ? `Prochaine étape : poursuivre vos évaluations (${input.testsDone}/${input.testsTotal} essentielles) pour enrichir automatiquement ce rapport.`
      : "Prochaine étape : mettre en pratique votre plan de progression et explorer le Coffre Premium pour consolider ces acquis."

  return [who, qualities, grow, next].join("\n\n")
}

/** Contenu riche pour un chapitre de compétence. */
export function composeChapterAnalysis(input: {
  chapterTitle: string
  pillarId?: ReportPillarId
  tipTitles: string[]
  tipAdvice: string[]
}): { body: string; sections: { heading: string; body: string }[] } {
  const pack = input.pillarId ? PACKS[input.pillarId] : null
  const sections = [
    {
      heading: "Résumé",
      body: pack
        ? `${input.chapterTitle} : ${pack.forceDescription}`
        : `Cette section présente votre fonctionnement observé concernant « ${input.chapterTitle} ».`,
    },
    {
      heading: "Comprendre votre fonctionnement",
      body: pack
        ? `${pack.portraitForce} ${pack.portraitGrowth}`
        : "Les résultats de votre évaluation permettent d’éclairer cette dimension de manière progressive et bienveillante.",
    },
    {
      heading: "Vos points forts",
      body: pack
        ? `${pack.forceTitle} — ${pack.forceWhy}`
        : "Des ressources sont déjà présentes ; poursuivez les tests pour les préciser.",
    },
    {
      heading: "Points de vigilance",
      body: pack
        ? `${pack.vigilanceTitle} — ${pack.vigilanceWhy}`
        : "Les axes de progression apparaîtront au fur et à mesure des évaluations.",
    },
    {
      heading: "Conseils pratiques",
      body:
        input.tipAdvice.length > 0
          ? input.tipAdvice
              .slice(0, 5)
              .map((a, i) => `${i + 1}. ${a}`)
              .join("\n")
          : pack
            ? `1. ${pack.forceTip}\n2. ${pack.vigilanceTip}\n3. Revenez sur cette section après votre prochaine évaluation.`
            : "Complétez l’évaluation liée pour recevoir des conseils personnalisés.",
    },
  ]

  return {
    body: sections[0].body,
    sections,
  }
}

export function insightPackFor(pillarId: ReportPillarId): PillarInsightPack {
  return PACKS[pillarId]
}
