/**
 * Harmonisation — sélectionne et adapte le contenu maître aux données réelles.
 * Directive : structure commune, contenu variable ; ne jamais forcer la démo Daniel/Naomi.
 */

import type { CoupleDimensionId } from "@/lib/couple/questionBank"
import {
  interpretDimension,
  DIMENSION_LIBRARY,
} from "@/lib/couple/interpretations"
import type {
  DimensionReadingCard,
  EngineResult,
  PrioritySpec,
} from "@/lib/couple/engine/types"
import { contextLabel } from "@/lib/couple/engine/masters/voice"

export type PartnerRole = "securizer" | "advancer" | "balanced"

export type DifferenceChapter = {
  rank: 1 | 2 | 3
  card: DimensionReadingCard
  title: string
  subtitle: string
  analysis: string[]
  exerciseTitle: string
  exerciseSubtitle: string
  exerciseSteps: string[]
  fillPrompts: string[]
  conclusion: string
}

export type HarmonizedPlan = {
  dynamicsTitle: string
  dynamicsBody: string[]
  dynamicsOneLiner: string
  securizerName: string
  advancerName: string
  roleA: PartnerRole
  roleB: PartnerRole
  contextLabel: string
  forceCards: DimensionReadingCard[]
  differenceChapters: DifferenceChapter[]
  communicationNote: string[]
  disagreementNote: string[]
  relationalCardBullets: string[]
}

const SECURE_DIMS: CoupleDimensionId[] = [
  "finances",
  "limites",
  "carriere",
  "autonomie",
  "decision",
]
const ADVANCE_DIMS: CoupleDimensionId[] = [
  "projet_vie",
  "mariage",
  "enfants",
  "affection",
  "vision_couple",
]

function whoHigher(card: DimensionReadingCard): "A" | "B" | "tie" {
  if (card.scoreA - card.scoreB >= 12) return "A"
  if (card.scoreB - card.scoreA >= 12) return "B"
  return "tie"
}

function inferRoles(
  priorities: PrioritySpec[],
  names: { nameA: string; nameB: string }
): {
  roleA: PartnerRole
  roleB: PartnerRole
  securizerName: string
  advancerName: string
} {
  let secureA = 0
  let secureB = 0
  let advanceA = 0
  let advanceB = 0
  for (const p of priorities) {
    const c = p.card
    const w = whoHigher(c)
    if (SECURE_DIMS.includes(c.dimension)) {
      if (w === "A") secureA += 2
      else if (w === "B") secureB += 2
    }
    if (ADVANCE_DIMS.includes(c.dimension)) {
      if (w === "A") advanceA += 2
      else if (w === "B") advanceB += 2
    }
  }
  const aSecureLean = secureA + (advanceB - advanceA)
  const bSecureLean = secureB + (advanceA - advanceB)

  if (Math.abs(aSecureLean - bSecureLean) < 2) {
    return {
      roleA: "balanced",
      roleB: "balanced",
      securizerName: names.nameA,
      advancerName: names.nameB,
    }
  }
  if (aSecureLean > bSecureLean) {
    return {
      roleA: "securizer",
      roleB: "advancer",
      securizerName: names.nameA,
      advancerName: names.nameB,
    }
  }
  return {
    roleA: "advancer",
    roleB: "securizer",
    securizerName: names.nameB,
    advancerName: names.nameA,
  }
}

function exerciseForDimension(
  card: DimensionReadingCard,
  names: { nameA: string; nameB: string },
  securizer: string,
  advancer: string
): Pick<
  DifferenceChapter,
  "exerciseTitle" | "exerciseSubtitle" | "exerciseSteps" | "fillPrompts"
> {
  const dim = card.dimension
  const lib = DIMENSION_LIBRARY[dim]
  if (dim === "finances") {
    return {
      exerciseTitle: "Exercice Premium — Notre définition de la sécurité financière",
      exerciseSubtitle: "Comprendre avant de décider",
      exerciseSteps: [
        `${names.nameA} complète seul(e) : ce dont il/elle a besoin pour se sentir en sécurité avant une grande décision financière.`,
        `${names.nameB} complète seul(e) : ce que signifie attendre trop longtemps avant d’avancer un projet.`,
        "Partagez à tour de rôle. Celui qui écoute reformule avant d’argumenter.",
        "Écrivez trois règles communes : décisions à deux, marge personnelle, date de revue.",
      ],
      fillPrompts: [
        `${securizer} — « Pour me sentir suffisamment en sécurité avant une grande décision financière, j’ai besoin de… »`,
        `${advancer} — « Lorsque nous attendons trop longtemps avant d’avancer, ce que cela signifie pour moi, c’est… »`,
        "Nos trois premières règles financières communes…",
      ],
    }
  }
  if (dim === "projet_vie") {
    return {
      exerciseTitle: "Exercice Premium — Notre ligne du temps",
      exerciseSubtitle: "Donner une forme concrète à votre vision",
      exerciseSteps: [
        "Chacun décrit seul sa vision à 6, 12 et 24 mois (logement, engagement, famille, travail).",
        "Comparez : commencez par ce qui est commun, puis les écarts de calendrier.",
        "Choisissez une seule étape à clarifier dans les 14 prochains jours.",
      ],
      fillPrompts: [
        "Dans six mois, j’aimerais que nous ayons commencé à…",
        "Dans douze mois, j’aimerais voir…",
        "La décision que nous voulons clarifier maintenant…",
      ],
    }
  }
  if (dim === "carriere") {
    return {
      exerciseTitle: "Exercice Premium — Notre accord carrière & couple",
      exerciseSubtitle: "Protéger les ambitions sans négliger la relation",
      exerciseSteps: [
        "Chacun nomme l’objectif professionnel qui compte le plus aujourd’hui.",
        "Indiquez le temps/énergie que vous êtes prêts à y consacrer — et ce qui doit rester protégé pour le couple.",
        "Fixez une date de revue (3 à 6 mois) et une limite claire.",
      ],
      fillPrompts: [
        "L’objectif professionnel qui compte particulièrement pour moi…",
        "Ce que je veux protéger pour notre couple pendant cette période…",
        "Date de revue et signal que l’équilibre n’est plus tenable…",
      ],
    }
  }
  if (dim === "enfants") {
    return {
      exerciseTitle: "Exercice Premium — Notre conversation parentalité",
      exerciseSubtitle: "Timing, désir et conditions — sans procès",
      exerciseSteps: [
        "Chacun écrit seul : désir, timing idéal, conditions non négociables.",
        "Partagez en reformulant d’abord le besoin de l’autre.",
        "Décidez une prochaine conversation datée (pas une décision forcée ce soir).",
      ],
      fillPrompts: [
        "Ce que je ressens aujourd’hui concernant les enfants…",
        "Les conditions dont j’ai besoin avant d’avancer…",
        "La date à laquelle nous reviendrons sur ce sujet…",
      ],
    }
  }
  if (dim === "communication" || dim === "conflits") {
    return {
      exerciseTitle: "Exercice Premium — Comprends-moi avant de me répondre",
      exerciseSubtitle: "Entendre ce qui se trouve derrière les mots",
      exerciseSteps: [
        "Choisissez une conversation récente un peu tendue mais gérable.",
        `${names.nameA} écrit ce qu’il/elle cherchait à protéger.`,
        `${names.nameB} écrit ce dont il/elle avait besoin de savoir.`,
        "Reformulez avant de corriger : « Si je comprends bien… »",
      ],
      fillPrompts: [
        "Lorsque mon/ma partenaire aborde un sujet important, ce que je cherche à protéger…",
        "Ce que j’aimerais qu’il/elle comprenne mieux dans ma manière de répondre…",
      ],
    }
  }
  if (dim === "affection" || dim === "intimite" || dim === "emotions") {
    return {
      exerciseTitle: "Exercice Premium — Ma carte de connexion",
      exerciseSubtitle: "Rendre explicite la manière d’aimer et d’être aimé",
      exerciseSteps: [
        "Chacun liste 3 gestes qui le font se sentir proche.",
        "Chacun liste 3 gestes qu’il croit offrir — puis comparez.",
        "Choisissez 1 rituel de connexion pour les 7 prochains jours.",
      ],
      fillPrompts: [
        "Je me sens aimé(e) quand…",
        "Je crois offrir de l’amour en…",
        "Notre rituel de connexion cette semaine…",
      ],
    }
  }
  if (dim === "famille" || dim === "roles" || dim === "limites") {
    return {
      exerciseTitle: "Exercice Premium — Notre carte des frontières",
      exerciseSubtitle: "Couple, familles, responsabilités",
      exerciseSteps: [
        "Chacun note ce qui doit rester protégé dans le couple face aux familles / rôles.",
        "Identifiez une situation récente où une frontière a été floue.",
        "Écrivez une règle simple à deux pour les 30 prochains jours.",
      ],
      fillPrompts: [
        "Une frontière importante pour moi…",
        "Une situation où je me suis senti(e) débordé(e)…",
        "Notre règle pour les 30 prochains jours…",
      ],
    }
  }
  // Générique aligné bibliothèque
  return {
    exerciseTitle: `Exercice Premium — Clarifier « ${card.label} »`,
    exerciseSubtitle: lib.measures,
    exerciseSteps: [
      "Chacun répond seul aux questions de l’axe (sans se corriger).",
      "Partagez et reformulez avant de négocier.",
      `Action concrète : ${lib.actions[0] ?? "Fixer une conversation de 20 minutes cette semaine."}`,
    ],
    fillPrompts: lib.questions.slice(0, 3),
  }
}

function buildDifferenceChapter(
  p: PrioritySpec,
  names: { nameA: string; nameB: string },
  securizer: string,
  advancer: string
): DifferenceChapter {
  const card = p.card
  const ix = interpretDimension(card.pair, names)
  const higher = whoHigher(card)
  const highName =
    higher === "A" ? names.nameA : higher === "B" ? names.nameB : null
  const lowName =
    higher === "A" ? names.nameB : higher === "B" ? names.nameA : null

  const analysis = [
    `Votre différence sur « ${card.label} » ressort avec une intensité particulière (${names.nameA} ${card.scoreA} % · ${names.nameB} ${card.scoreB} % · écart ${card.gap} pts). Elle mérite davantage qu’une simple phrase indiquant que vous n’êtes pas alignés.`,
    ix.meaning,
    highName && lowName
      ? `${highName} se situe plus haut sur cet axe ; ${lowName} exprime un besoin ou un rythme différent. Aucune des deux positions n’est « la bonne » en soi. Le travail consiste à rendre explicite ce que chacun cherche à protéger.`
      : `Vos scores sont proches sur le chiffre, mais le statut « ${card.differenceClass.replaceAll("_", " ")} » invite à regarder le sens derrière les réponses.`,
    ix.conflictPattern
      ? `Ce qui peut se jouer entre vous : ${ix.conflictPattern}`
      : `Le risque n’est pas seulement le désaccord initial : c’est d’interpréter l’intention de l’autre (« tu bloques », « tu précipites ») au lieu de parler du besoin réel.`,
    `Question centrale pour vous : qu’est-ce que chacun considère comme suffisamment clair ou sécurisé pour pouvoir avancer sereinement sur « ${card.label} » ?`,
  ]

  const ex = exerciseForDimension(card, names, securizer, advancer)

  return {
    rank: p.rank,
    card,
    title: `Votre ${p.rank === 1 ? "première" : p.rank === 2 ? "deuxième" : "troisième"} grande différence : ${card.label}`,
    subtitle: `${names.nameA} ${card.scoreA} % — ${names.nameB} ${card.scoreB} %`,
    analysis,
    ...ex,
    conclusion: `Retenez : sur « ${card.label} », votre enjeu n’est pas d’éliminer la différence, mais de la rendre négociable. Première action : ${p.firstAction}`,
  }
}

export function harmonizeReport(args: {
  engine: EngineResult
  names: { nameA: string; nameB: string }
  globalScore: number
}): HarmonizedPlan {
  const { engine, names } = args
  const roles = inferRoles(engine.synthesis.priorities, names)
  const { securizerName, advancerName, roleA, roleB } = roles

  const dynamicsTitle = `Votre dynamique centrale : sécuriser avant d’avancer, avancer pour construire`
  const dynamicsBody = [
    `Lorsque nous regardons vos profils séparément, chacun possède sa propre logique. ${securizerName} semble davantage chercher à vérifier que les bases sont suffisamment solides avant de franchir certaines étapes. ${advancerName} semble davantage avoir besoin de sentir que la relation et les projets communs continuent d’évoluer concrètement. Aucune de ces deux logiques n’est intrinsèquement mauvaise.`,
    `La difficulté peut apparaître lorsque chacun interprète le comportement de l’autre à travers son propre besoin. ${securizerName} peut voir de l’impatience et y percevoir un manque de prudence ; ${advancerName} peut voir de la prudence et y percevoir un manque d’engagement dans l’action. La conversation quitte alors le sujet réel pour entrer sur les intentions supposées.`,
    `Votre bilan vous invite à regarder ce qui se trouve derrière ces comportements. Vous pourriez défendre deux dimensions différentes d’un même objectif. La question devient : comment avancer sans sacrifier ce dont chacun a réellement besoin ?`,
    engine.synthesis.dynamicsSentence,
  ]

  const differenceChapters = engine.synthesis.priorities
    .slice(0, 3)
    .map((p) =>
      buildDifferenceChapter(p, names, securizerName, advancerName)
    )

  const forceCards =
    engine.synthesis.forces.length > 0
      ? engine.synthesis.forces
      : engine.synthesis.convergences.slice(0, 3)

  const comCard = engine.cards.find((c) => c.dimension === "communication")
  const comIx = comCard
    ? interpretDimension(comCard.pair, names)
    : null

  const communicationNote = [
    comCard
      ? `Votre bilan fait ressortir une base de communication ${comCard.convergenceLevel === "forte" ? "plutôt favorable" : "à observer de près"}. ${names.nameA} ${comCard.scoreA} % · ${names.nameB} ${comCard.scoreB} %.`
      : `La communication reste un levier central pour traiter vos priorités.`,
    comIx?.meaning ??
      `Bien communiquer ne signifie pas communiquer de la même manière. L’un peut chercher une solution ; l’autre, d’abord se sentir compris.`,
    `Dans votre dynamique (${securizerName} / ${advancerName}), cette différence mérite d’être observée surtout sur vos sujets sensibles : ${differenceChapters.map((d) => d.card.label).join(", ") || "vos priorités"}.`,
    `Votre règle utile : « Nous pouvons prendre du temps sans laisser l’autre dans le flou. » Si une décision ne peut pas être prise immédiatement, définissez ce qui doit encore être clarifié et choisissez un moment pour revenir au sujet.`,
  ]

  const disagreementNote = [
    `Être en couple ne signifie pas être d’accord sur tout. Le désaccord devient surtout important lorsque chacun commence à interpréter la réaction de l’autre au lieu d’essayer de comprendre ce qui se passe réellement.`,
    `Dans votre cas, la tension typique peut ressembler à ceci : ${advancerName} cherche une clarification ou une direction ; ${securizerName} a davantage besoin de recul, de préparation ou de vérification avant de se positionner.`,
    `Votre objectif n’est pas de supprimer les désaccords. C’est d’apprendre à reconnaître ce qui se passe entre vous lorsque vous n’êtes pas d’accord, afin que le sujet ne devienne pas plus important que votre relation.`,
  ]

  const relationalCardBullets = [
    `Dynamique : ${securizerName} sécurise · ${advancerName} fait avancer`,
    ...forceCards.map(
      (c) =>
        `Force — ${c.label} (${names.nameA} ${c.scoreA}% / ${names.nameB} ${c.scoreB}%)`
    ),
    ...differenceChapters.map(
      (d) =>
        `Priorité ${d.rank} — ${d.card.label} (écart ${d.card.gap} pts)`
    ),
  ]

  return {
    dynamicsTitle,
    dynamicsBody,
    dynamicsOneLiner: `${securizerName} sécurise avant d’avancer ; ${advancerName} a besoin de voir avancer pour construire — deux chemins vers le même foyer.`,
    securizerName,
    advancerName,
    roleA,
    roleB,
    contextLabel: contextLabel(engine.coupleMap.context),
    forceCards,
    differenceChapters,
    communicationNote,
    disagreementNote,
    relationalCardBullets,
  }
}
