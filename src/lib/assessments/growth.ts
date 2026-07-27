import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import { ASSESSMENTS } from "@/lib/assessments/questionBank"

export type GrowthAxis = {
  id: string
  pillar: AssessmentSlug
  pillarName: string
  dimension: string
  dimensionLabel: string
  score: number
  title: string
  advice: string
  academyHref: string
}

const DIMENSION_LABELS: Record<string, string> = {
  emotional_stability: "Stabilité émotionnelle",
  communication: "Communication",
  openness: "Ouverture au changement",
  responsibility: "Fiabilité & engagements",
  faith_importance: "Place de la foi",
  practices: "Pratiques spirituelles",
  marriage_vision: "Vision du mariage",
  community: "Vie d'église & service",
  conflict: "Gestion des conflits",
  emotional: "Expression affective",
  partnership: "Partenariat & décisions",
  vision: "Rythme de vie à deux",
  family: "Relation aux familles",
  intimacy: "Pureté & limites",
  roles: "Rôles au foyer",
  transparency: "Transparence financière",
  stewardship: "Générosité & intendance",
  management: "Gestion du budget",
  planning: "Planification & épargne",
}

const ADVICE: Record<string, { title: string; advice: string; module: string }> = {
  emotional_stability: {
    title: "Apaiser vos réactions sous stress",
    advice:
      "Quand la pression monte, nommez ce que vous ressentez avant de répondre. Une pause de 10 minutes + une prière courte change souvent le ton de la conversation.",
    module: "emotions",
  },
  communication: {
    title: "Clarifier sans attaquer",
    advice:
      "Pratiquez « je ressens… quand… j'ai besoin de… ». Évitez les généralisations (« toujours / jamais »). Un feedback clair construit la confiance.",
    module: "dialogue",
  },
  conflict: {
    title: "Sortir du silence ou de la colère",
    advice:
      "Choisissez une règle de couple : on ne couche pas sur une dispute non dite, ou on fixe une heure pour y revenir. La réconciliation est une compétence.",
    module: "conflits",
  },
  intimacy: {
    title: "Poser des limites physiques claires",
    advice:
      "Écrivez à deux (ou avec un conseiller) ce qui est OK / pas OK avant le mariage. La clarté protège l'amour ; le flou crée la confusion.",
    module: "purete",
  },
  family: {
    title: "Honorer la famille sans diluer le couple",
    advice:
      "Décidez ensemble vos limites (visites, argent, décisions). Honorer ses parents et construire un foyer autonome ne s'opposent pas.",
    module: "familles",
  },
  transparency: {
    title: "Parler d'argent sans honte",
    advice:
      "Faites un inventaire honnête (revenus, dettes, habitudes). La transparence avant l'engagement évite les surprises qui blessent.",
    module: "finances",
  },
  stewardship: {
    title: "Aligner générosité et foyer",
    advice:
      "Décidez à deux ce que vous donnez, à qui, et jusqu'où. La générosité chrétienne se vit mieux dans un cadre commun.",
    module: "finances",
  },
  practices: {
    title: "Ancrer une discipline spirituelle réaliste",
    advice:
      "Choisissez un rythme tenable (Parole + prière) plutôt qu'un idéal impossible. La constance bat l'intensité sporadique.",
    module: "foi",
  },
  community: {
    title: "Servir sans négliger le couple",
    advice:
      "Discutez du temps d'église / service avant de vous surengager. Un couple uni sert mieux qu'un couple épuisé.",
    module: "foi",
  },
  partnership: {
    title: "Décider vraiment à deux",
    advice:
      "Pour les choix importants : chacun expose son avis, vous priez, puis vous tranchez ensemble. Ni domination, ni abdication.",
    module: "dialogue",
  },
  management: {
    title: "Structurer le budget du foyer",
    advice:
      "Un budget simple (besoins / épargne / dons / plaisir) vu chaque mois à deux suffit souvent à baisser la tension.",
    module: "finances",
  },
  planning: {
    title: "Passer du « on verra » au plan",
    advice:
      "Fixez 1–2 objectifs concrets (logement, enfants, épargne) avec une échéance. Le projet commun donne du sens aux efforts.",
    module: "projet",
  },
  faith_importance: {
    title: "Mettre la foi au centre du projet",
    advice:
      "Clarifiez ce que « Dieu au centre » veut dire pour vous (prière, décisions, dimanche, pureté). Puis cherchez quelqu'un d'aligné.",
    module: "foi",
  },
  marriage_vision: {
    title: "Affiner votre vision du mariage",
    advice:
      "Alliance pour la vie, projet temporaire, ou terrain de croissance ? Dites-le clairement — le matching en dépend.",
    module: "projet",
  },
  emotional: {
    title: "Oser dire vos besoins affectifs",
    advice:
      "L'autre ne lit pas dans vos pensées. Une demande douce et précise vaut mieux qu'un silence qui s'accumule.",
    module: "dialogue",
  },
  openness: {
    title: "Accueillir la différence sans vous perdre",
    advice:
      "Distinguez les non-négociables des préférences. L'adaptation est une force ; l'effacement de soi n'en est pas une.",
    module: "emotions",
  },
  responsibility: {
    title: "Tenir parole, même dans le petit",
    advice:
      "La fiabilité se construit sur les petits engagements (horaires, messages, promesses). C'est le ciment de la confiance.",
    module: "projet",
  },
  vision: {
    title: "Harmoniser le rythme de vie à deux",
    advice:
      "Temps de qualité, indépendance, vie sociale : dites ce dont vous avez besoin chaque semaine. Le non-dit crée la frustration.",
    module: "projet",
  },
  roles: {
    title: "Clarifier les rôles du foyer",
    advice:
      "Qui fait quoi ? Qui décide quoi ? Une discussion calme vaut mieux qu'une répartition implicite qui fait mal plus tard.",
    module: "projet",
  },
}

const LOW_SCORE_THRESHOLD = 68

export function buildGrowthAxes(
  psychometric: {
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>> | null
  } | null
): GrowthAxis[] {
  if (!psychometric?.dimensions) return []

  const axes: GrowthAxis[] = []

  for (const [pillar, dims] of Object.entries(psychometric.dimensions)) {
    if (!dims) continue
    const slug = pillar as AssessmentSlug
    const pillarName = ASSESSMENTS[slug]?.name ?? pillar

    for (const [dimension, score] of Object.entries(dims)) {
      if (typeof score !== "number" || score >= LOW_SCORE_THRESHOLD) continue
      const tip = ADVICE[dimension] ?? {
        title: `Renforcer : ${DIMENSION_LABELS[dimension] ?? dimension}`,
        advice:
          "Prenez le temps de prier et d'en parler avec une personne mature. La croissance relationnelle est un chemin, pas un sprint.",
        module: "projet",
      }
      axes.push({
        id: `${slug}-${dimension}`,
        pillar: slug,
        pillarName,
        dimension,
        dimensionLabel: DIMENSION_LABELS[dimension] ?? dimension.replace(/_/g, " "),
        score,
        title: tip.title,
        advice: tip.advice,
        academyHref: `/academie-mariage/${tip.module}`,
      })
    }
  }

  return axes.sort((a, b) => a.score - b.score).slice(0, 6)
}
