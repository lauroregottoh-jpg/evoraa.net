/**
 * Narratifs Rapport Alliance — calqués sur
 * 32-1_SAMPLE_REPORT_ALLIANCE (incomplet) et 33-1_SAMPLE_FULL_REPORT (complet).
 */

import type { ReportPillarId } from "@/lib/rapport/pillars"
import type { InsightCard } from "@/lib/rapport/personalized/insightCards"

export type ReportDocumentMode = "incomplete" | "complete"

export function reportDocumentMode(
  essentialsDone: number,
  essentialsTotal: number
): ReportDocumentMode {
  return essentialsDone >= essentialsTotal && essentialsTotal > 0
    ? "complete"
    : "incomplete"
}

export function starsFromScore(score: number | null): string {
  if (score == null) return "☆☆☆☆☆☆☆☆☆☆"
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)))
  return `${"★".repeat(filled)}${"☆".repeat(10 - filled)}`
}

export function preparationBandCopy(score: number | null): string {
  if (score == null) {
    return "Votre niveau de préparation se précisera au fur et à mesure des évaluations."
  }
  if (score >= 85) {
    return "Vous présentez un profil globalement équilibré.\n\nLes évaluations montrent une bonne maturité relationnelle et des bases solides pour construire une relation durable.\n\nCertaines compétences méritent encore d’être développées afin de renforcer votre stabilité émotionnelle et votre capacité à traverser les difficultés avec sérénité."
  }
  if (score >= 70) {
    return "Vous présentez un profil en bonne voie.\n\nLes évaluations mettent en évidence des ressources relationnelles intéressantes, ainsi que des domaines où une progression régulière portera du fruit."
  }
  return "Votre préparation est en cours de construction.\n\nLes premières évaluations révèlent déjà des ressources, et les prochaines étapes permettront d’affiner votre portrait et vos priorités."
}

/** Accueil — sample 32 vs 33 */
export function composeWelcome(input: {
  firstName: string
  mode: ReportDocumentMode
  completenessPercent: number
}): string {
  const name = input.firstName.trim() || "Membre"
  if (input.mode === "complete") {
    return `Bonjour ${name},\n\nFélicitations.\n\nVous venez de terminer l’ensemble des évaluations du parcours Alliance.\n\nLe document que vous tenez entre les mains représente bien plus qu’un simple compte rendu de tests. Il rassemble les principaux enseignements issus de votre parcours afin de vous offrir une vision claire de votre manière de construire une relation, de communiquer, de gérer les défis du quotidien et de préparer votre futur mariage.\n\nAucun être humain ne peut être résumé par quelques scores. C’est pourquoi ce rapport privilégie une lecture globale de votre personnalité plutôt qu’une simple addition de résultats.\n\nAu fil des pages, vous découvrirez les qualités qui constituent aujourd’hui vos principales forces, les compétences qui méritent d’être développées ainsi que des pistes concrètes pour continuer à grandir.\n\nNotre souhait est que ce rapport ne reste pas un document que l’on consulte une seule fois, mais qu’il devienne un véritable guide de réflexion auquel vous pourrez revenir régulièrement au cours de votre préparation au mariage.`
  }
  return `Bonjour ${name},\n\nNous sommes heureux de vous remettre la première version de votre Rapport Personnalisé Alliance.\n\nCe document est bien plus qu’un simple compte rendu de vos évaluations. Il constitue un véritable carnet de route destiné à vous accompagner dans votre préparation au mariage.\n\nChaque évaluation que vous réaliserez enrichira progressivement ce rapport. Les analyses deviendront plus précises, les conseils plus personnalisés et votre portrait relationnel se complétera naturellement au fil de votre parcours.\n\nAujourd’hui, votre rapport est complété à ${input.completenessPercent} %. Les informations disponibles permettent déjà de dégager plusieurs tendances intéressantes, mais certaines dimensions importantes de votre fonctionnement relationnel restent encore à découvrir.\n\nNous vous invitons donc à lire ce rapport comme une première photographie de votre profil actuel, appelée à évoluer avec vous.`
}

/** Section « Où en êtes-vous » — sample 32 */
export function composeStatusSection(input: {
  testsDone: number
  testsTotal: number
  remainingLabels: string[]
}): { intro: string; included: string[]; remaining: string[] } {
  return {
    intro: `Vous avez déjà réalisé ${input.testsDone} des ${input.testsTotal} évaluations essentielles du parcours Alliance.\n\nGrâce à ces premières réponses, nous avons pu commencer à identifier certains de vos modes de fonctionnement relationnels.`,
    included: [
      "un premier portrait relationnel",
      "vos principales qualités observées",
      "plusieurs pistes de progression",
      "des recommandations personnalisées",
    ],
    remaining:
      input.remainingLabels.length > 0
        ? input.remainingLabels
        : [
            "votre manière de communiquer",
            "votre gestion des conflits",
            "votre vision du mariage",
            "votre rapport aux finances",
            "vos valeurs fondamentales",
            "votre projet de vie",
          ],
  }
}

/** Résumé — sample 32 / 33 */
export function composeSummaryNarrative(input: {
  firstName: string
  mode: ReportDocumentMode
  forces: InsightCard[]
  vigilances: InsightCard[]
  testsDone: number
  testsTotal: number
}): string {
  const name = input.firstName.trim() || "Membre"
  const f0 = input.forces[0]?.title.toLowerCase()
  const f1 = input.forces[1]?.title.toLowerCase()
  const a0 = input.vigilances[0]?.title.toLowerCase()
  const a1 = input.vigilances[1]?.title.toLowerCase()

  if (input.mode === "incomplete") {
    const resources =
      f0 && f1
        ? `Vous semblez naturellement rechercher des relations harmonieuses, avec notamment ${f0} et ${f1}. Cette souplesse constitue un atout précieux dans la construction d’une relation durable, car elle favorise l’écoute, la coopération et la recherche d’équilibre.`
        : f0
          ? `Vous semblez naturellement rechercher des relations harmonieuses, avec notamment ${f0}. Cette disposition constitue un atout précieux dans la construction d’une relation durable.`
          : `Vous semblez naturellement rechercher des relations harmonieuses et vous manifestez une réelle capacité d’adaptation lorsque votre environnement évolue. Cette souplesse constitue un atout précieux dans la construction d’une relation durable, car elle favorise l’écoute, la coopération et la recherche d’équilibre.`

    return `Les premiers résultats de vos évaluations mettent en évidence une personnalité qui accorde une grande importance à la qualité des relations humaines.\n\n${resources}\n\nVos réponses montrent également que vous êtes attentif(ve) aux autres et que vous souhaitez construire des relations sincères. Vous ne recherchez pas simplement une relation sentimentale, mais une relation porteuse de sens, capable de grandir dans le temps.\n\nCependant, les informations actuellement disponibles restent encore limitées. Certaines compétences essentielles à la vie de couple n’ont pas encore été évaluées.\n\nIl serait donc prématuré de tirer des conclusions définitives sur votre profil, ${name}.\n\nLes analyses disponibles aujourd’hui permettent surtout d’identifier de belles ressources personnelles ainsi que plusieurs domaines qui mériteront d’être explorés plus en profondeur dans les prochaines évaluations.\n\nNotre conseil est simple : poursuivez votre parcours. Chaque nouvelle évaluation enrichira votre rapport et vous offrira une compréhension plus complète de votre fonctionnement relationnel.`
  }

  const forceBlock =
    f0 && f1
      ? `Vous possédez notamment des ressources autour de ${f0} et de ${f1}. Vous savez généralement reconnaître ce qui compte pour vous et prendre du recul avant d’agir. Cette capacité favorise des échanges apaisés et limite les réactions impulsives lors des désaccords.`
      : `Vous possédez une bonne maturité relationnelle. Vous savez généralement reconnaître vos émotions et prendre du recul avant d’agir. Cette capacité favorise des échanges apaisés et limite les réactions impulsives lors des désaccords.`

  const growthBlock =
    a0 && a1
      ? `Certaines dimensions peuvent toutefois être renforcées.\n\nVous pourriez notamment progresser sur ${a0} et ${a1}. Si ces attitudes partent souvent d’une bonne intention, elles peuvent aussi conduire à différer des discussions pourtant nécessaires.\n\nExprimer vos besoins avec calme et assurance contribuera à construire des relations encore plus équilibrées.`
      : a0
        ? `Certaines dimensions peuvent toutefois être renforcées, notamment autour de ${a0}. Exprimer vos besoins avec calme et assurance contribuera à construire des relations encore plus équilibrées.`
        : `Certaines dimensions peuvent toutefois être renforcées afin de consolider encore davantage votre stabilité relationnelle.`

  return `Les différentes évaluations réalisées dressent le portrait d’une personne profondément investie dans la qualité de ses relations. Vous recherchez naturellement des échanges sincères, respectueux et empreints de confiance. Votre manière d’entrer en relation laisse apparaître un véritable désir de construire plutôt que de simplement vivre une histoire affective.\n\n${forceBlock}\n\nLes évaluations mettent également en évidence une vision du mariage fondée sur l’engagement, la fidélité, la croissance commune et la présence de Dieu au cœur du couple. Cette cohérence entre vos valeurs personnelles et votre projet de vie constitue l’un des principaux facteurs favorables à la réussite de votre futur mariage.\n\n${growthBlock}\n\nDans l’ensemble, votre profil révèle une personne disposant de solides fondations relationnelles et d’un réel potentiel de croissance. Les recommandations proposées dans ce rapport ont pour objectif de consolider ces acquis afin de préparer un mariage durable.`
}

const MISSING_PORTRAIT_DIMS = [
  "votre manière de communiquer lors des désaccords",
  "votre gestion des émotions dans les périodes de tension",
  "votre façon de prendre des décisions importantes",
  "votre vision du rôle de chacun dans le mariage",
  "votre rapport aux finances communes",
]

export function missingPortraitDimensions(): string[] {
  return [...MISSING_PORTRAIT_DIMS]
}

/** Portrait — sample 32 / 33 */
export function composePortraitNarrativeV2(input: {
  firstName: string
  mode: ReportDocumentMode
  ranked: { id: ReportPillarId; score: number }[]
  packs: Record<
    ReportPillarId,
    { portraitForce: string; portraitGrowth: string }
  >
}): string {
  const name = input.firstName.trim() || "Membre"

  if (input.mode === "incomplete") {
    const top = input.ranked[0]
    const forceLine = top
      ? input.packs[top.id].portraitForce
      : "Vous semblez naturellement privilégier le dialogue plutôt que la confrontation. Lorsque les échanges se déroulent dans un climat serein, vous êtes capable de créer un environnement rassurant où chacun peut s’exprimer librement."

    const adaptLine =
      "Votre personnalité laisse également apparaître une bonne capacité d’adaptation. Vous acceptez relativement facilement les changements lorsqu’ils sont porteurs de sens et vous savez ajuster votre comportement pour préserver la qualité de vos relations.\n\nCette capacité constitue une force importante dans la perspective d’un mariage, car la vie conjugale demande régulièrement de s’adapter aux évolutions de la vie, aux projets communs et aux besoins de son conjoint."

    return `À partir des informations actuellement disponibles, ${name}, vous donnez l’image d’une personne qui apprécie les relations stables et équilibrées.\n\n${forceLine}\n\n${adaptLine}\n\nEn revanche, votre portrait reste encore incomplet.\n\nNous ne disposons pas encore d’informations suffisantes concernant :\n\n${MISSING_PORTRAIT_DIMS.map((d) => `• ${d}`).join("\n")}\n\nCes éléments seront progressivement intégrés à votre portrait au fur et à mesure de vos prochaines évaluations.\n\nÀ ce stade, votre profil révèle davantage un potentiel qu’un portrait définitif. C’est précisément tout l’intérêt du Rapport Alliance : il évolue avec vous et devient de plus en plus précis au fil de votre progression.`
  }

  const top = input.ranked.slice(0, 2)
  const low = [...input.ranked].sort((a, b) => a.score - b.score).slice(0, 2)
  const parts: string[] = [
    "Ce qui ressort le plus fortement de votre profil est votre volonté de construire des relations profondes, stables et porteuses de sens.",
    "Vous ne semblez pas rechercher une relation fondée uniquement sur les émotions ou l’attirance. Vos réponses montrent que vous accordez une place importante à la confiance, au respect mutuel et au développement commun.",
    "Lorsque vous vous sentez écouté(e) et respecté(e), vous êtes capable d’exprimer vos idées avec clarté tout en restant attentif(ve) aux besoins de votre interlocuteur. Vous privilégiez généralement la coopération plutôt que la compétition et cherchez à trouver des solutions qui préservent la qualité de la relation.",
    "Votre entourage vous perçoit probablement comme une personne fiable, posée et capable d’apporter de la stabilité dans les relations. Vous inspirez facilement confiance, notamment grâce à votre cohérence entre ce que vous dites et ce que vous faites.",
  ]

  for (const p of top) {
    parts.push(input.packs[p.id].portraitForce)
  }

  parts.push(
    "Cependant, votre désir de préserver l’harmonie peut parfois vous conduire à différer certaines conversations importantes. Vous préférez souvent attendre le bon moment plutôt que d’aborder immédiatement un sujet sensible. Cette prudence peut être bénéfique dans certaines situations, mais elle risque également de laisser s’installer des incompréhensions lorsqu’elle devient une habitude."
  )

  for (const p of low) {
    if (top.some((t) => t.id === p.id)) continue
    parts.push(input.packs[p.id].portraitGrowth)
  }

  parts.push(
    "Votre profil ne révèle pas la recherche d’une relation parfaite, mais celle d’une relation authentique. Vous acceptez que deux personnes puissent être différentes tout en construisant un projet commun. Cette vision réaliste représente l’une de vos plus grandes richesses.",
    "En résumé, vous disposez aujourd’hui de bases solides pour construire une relation durable. Les prochaines pages permettront d’explorer plus en détail chacune des grandes dimensions de votre fonctionnement relationnel afin d’identifier avec précision les ressources sur lesquelles vous pourrez vous appuyer ainsi que les compétences qui renforceront encore davantage votre futur mariage."
  )

  return parts.join("\n\n")
}

/** Forces narratives style sample (titre + corps, sans jargon score). */
export const SAMPLE_FORCE_NARRATIVES: {
  id: string
  shortLabel: string
  incompleteTitle: string
  completeTitle: string
  incompleteBody: string
  completeBody: string
  pillarHint?: ReportPillarId
}[] = [
  {
    id: "adaptation",
    shortLabel: "Capacité d’adaptation",
    incompleteTitle: "Une bonne capacité d’adaptation",
    completeTitle: "Vous possédez une bonne capacité d’adaptation",
    incompleteBody:
      "Vos réponses montrent que vous savez généralement vous ajuster lorsque les circonstances changent.\n\nCette qualité vous permettra d’aborder plus sereinement les différentes étapes de la vie conjugale et de construire des solutions lorsque les situations évolueront.\n\nContinuez à cultiver cette souplesse tout en restant fidèle à vos convictions profondes.",
    completeBody:
      "Vous acceptez les changements lorsqu’ils servent un projet plus grand.\n\nCette souplesse facilitera les nombreuses transitions qui accompagnent la vie conjugale.",
    pillarHint: "humain",
  },
  {
    id: "relations",
    shortLabel: "Communication respectueuse",
    incompleteTitle: "Une sensibilité aux relations humaines",
    completeTitle: "Vous recherchez la compréhension avant le jugement",
    incompleteBody:
      "Vous accordez de l’importance à la qualité des liens que vous construisez.\n\nVous semblez attentif(ve) au bien-être des personnes qui vous entourent et vous recherchez des relations authentiques plutôt que superficielles.\n\nCette disposition favorise la confiance et la proximité émotionnelle.",
    completeBody:
      "Vous prenez le temps d’écouter avant de tirer des conclusions.\n\nCette attitude réduit les malentendus et favorise des échanges respectueux.",
    pillarHint: "relationnel",
  },
  {
    id: "croissance",
    shortLabel: "Volonté de progresser",
    incompleteTitle: "Une volonté de progresser",
    completeTitle: "Vous souhaitez continuellement progresser",
    incompleteBody:
      "Le fait même que vous réalisiez ces évaluations traduit une démarche volontaire de croissance personnelle.\n\nVous ne cherchez pas uniquement à trouver la bonne personne.\n\nVous cherchez également à devenir un(e) meilleur(e) partenaire de vie.\n\nCette attitude représente un excellent point de départ.",
    completeBody:
      "L’ensemble de vos réponses révèle une personne qui cherche moins à avoir raison qu’à grandir.\n\nCette attitude est probablement l’une des qualités les plus prometteuses de votre profil.",
    pillarHint: "humain",
  },
  {
    id: "confiance",
    shortLabel: "Cohérence qui inspire confiance",
    incompleteTitle: "Une cohérence qui inspire confiance",
    completeTitle: "Vous inspirez confiance",
    incompleteBody:
      "Vos réponses suggèrent une cohérence entre vos paroles et vos attitudes.\n\nCette stabilité favorise un climat de sécurité indispensable dans la construction d’une relation durable.",
    completeBody:
      "Vos réponses montrent une grande cohérence entre vos convictions, vos paroles et vos comportements.\n\nLes personnes qui vous entourent savent généralement à quoi s’attendre avec vous. Cette stabilité favorise un climat de sécurité indispensable dans la construction d’une relation durable.",
    pillarHint: "valeurs",
  },
  {
    id: "engagement",
    shortLabel: "Sens de l’engagement",
    incompleteTitle: "Un sens de l’engagement réfléchi",
    completeTitle: "Votre engagement est réfléchi",
    incompleteBody:
      "Vous ne prenez pas les décisions importantes à la légère.\n\nVous cherchez à construire des bases solides avant de vous engager durablement.",
    completeBody:
      "Vous ne prenez pas les décisions importantes à la légère.\n\nVous cherchez à construire des bases solides avant de vous engager durablement.",
    pillarHint: "projets_de_vie",
  },
]

export function buildSampleForceCards(input: {
  mode: ReportDocumentMode
  ranked: { id: ReportPillarId; score: number }[]
}): InsightCard[] {
  const count = input.mode === "complete" ? 5 : 3
  const ordered = [...SAMPLE_FORCE_NARRATIVES]

  // Prefer narratives matching top pillars when available
  if (input.ranked.length) {
    ordered.sort((a, b) => {
      const ai = input.ranked.findIndex((r) => r.id === a.pillarHint)
      const bi = input.ranked.findIndex((r) => r.id === b.pillarHint)
      const av = ai === -1 ? 99 : ai
      const bv = bi === -1 ? 99 : bi
      return av - bv
    })
  }

  return ordered.slice(0, count).map((n, i) => {
    const pillar =
      n.pillarHint && input.ranked.find((r) => r.id === n.pillarHint)
        ? n.pillarHint
        : input.ranked[i]?.id || "relationnel"
    return {
      id: `force_sample_${n.id}`,
      kind: "force" as const,
      title:
        input.mode === "complete" ? n.completeTitle : n.incompleteTitle,
      description:
        input.mode === "complete" ? n.completeBody : n.incompleteBody,
      why: n.shortLabel,
      impact:
        "Dans le mariage, elle favorise la sécurité, la coopération et la croissance commune.",
      tip: "Continuez à cultiver cette qualité dans vos échanges quotidiens.",
      pillarId: pillar,
      score: input.ranked.find((r) => r.id === pillar)?.score,
    }
  })
}

export function buildSampleVigilanceCards(input: {
  mode: ReportDocumentMode
  remainingTitles: string[]
}): InsightCard[] {
  if (input.mode === "incomplete") {
    const defaults = [
      {
        id: "comm",
        title: "Développer votre communication relationnelle",
        description:
          "Une communication claire est l’un des piliers d’un couple solide.\n\nVotre prochaine évaluation sur la communication permettra de mieux comprendre votre manière d’exprimer vos attentes, d’écouter votre interlocuteur et de gérer les échanges difficiles.\n\nCette analyse enrichira considérablement votre rapport.",
      },
      {
        id: "assert",
        title: "Développer votre affirmation de soi",
        description:
          "Les relations durables reposent sur un équilibre entre l’écoute des autres et le respect de ses propres besoins.\n\nApprendre à exprimer vos limites avec calme et respect contribuera à construire des relations plus saines.",
      },
      {
        id: "ie",
        title: "Développer votre intelligence émotionnelle",
        description:
          "Comprendre ses émotions et savoir les exprimer de manière constructive constitue une compétence essentielle dans le mariage.\n\nVotre future évaluation permettra d’identifier vos ressources émotionnelles ainsi que les domaines dans lesquels vous pourrez encore progresser.",
      },
    ]
    return defaults.map((d) => ({
      id: `axe_sample_${d.id}`,
      kind: "vigilance" as const,
      title: d.title,
      description: d.description,
      why: "Ces éléments ne constituent pas des faiblesses. Ils représentent simplement des compétences qui pourront renforcer votre futur mariage.",
      impact:
        "Les développer contribuera à la confiance, à la compréhension mutuelle et à la sérénité du couple.",
      tip: "Poursuivez les évaluations recommandées pour affiner ces axes.",
      pillarId: "relationnel" as ReportPillarId,
    }))
  }

  const completeDefaults = [
    {
      id: "assert",
      title: "Développer davantage l’affirmation de soi",
      description:
        "Vous pourriez développer davantage votre affirmation de soi. Exprimer vos besoins avec calme et assurance contribuera à construire des relations encore plus équilibrées.",
    },
    {
      id: "tension",
      title: "Gérer plus sereinement les situations de tension",
      description:
        "Apprendre à traverser les désaccords avec calme, sans éviter ni dramatiser, renforcera la confiance et la qualité du dialogue.",
    },
    {
      id: "vision",
      title: "Préciser votre projet de couple",
      description:
        "Construire une vision encore plus précise de votre projet de couple facilitera les décisions importantes et les conversations sur l’avenir.",
    },
  ]

  return completeDefaults.map((d) => ({
    id: `axe_sample_${d.id}`,
    kind: "vigilance" as const,
    title: d.title,
    description: d.description,
    why: "Ces axes auront le plus d’impact sur la qualité de votre futur mariage.",
    impact:
      "Sans ce travail, certaines frustrations silencieuses peuvent s’installer.",
    tip: "Intégrez une action concrète cette semaine liée à cet axe.",
    pillarId: "relationnel" as ReportPillarId,
  }))
}

/** Contenu « en attente » pour chapitres non débloqués — sample 32-2 */
export const PENDING_CHAPTER_COPY: Record<
  string,
  { sections: { heading: string; body: string }[]; durationHint?: string }
> = {
  communication: {
    durationHint: "Temps estimé : 8 minutes",
    sections: [
      {
        heading: "Pourquoi cette compétence est essentielle",
        body: "La communication est l’un des piliers d’une relation durable. Elle permet de partager ses attentes, de résoudre les incompréhensions et de construire une relation fondée sur la confiance.\n\nÀ ce stade de votre parcours, cette évaluation n’a pas encore été réalisée. Nous ne disposons donc pas encore de suffisamment d’informations pour analyser votre style de communication.\n\nCela ne signifie pas que cette compétence est absente chez vous. Cela signifie simplement que nous ne pouvons pas encore la décrire avec précision.",
      },
      {
        heading: "Ce que cette évaluation vous permettra de découvrir",
        body: "En réalisant l’évaluation « Communication », vous découvrirez notamment :\n\n• votre manière naturelle de communiquer ;\n• votre façon d’écouter les autres ;\n• votre capacité à exprimer vos besoins ;\n• votre style lors des conversations importantes ;\n• vos points forts dans les échanges ;\n• les habitudes qui pourraient fragiliser une relation.\n\nCette analyse viendra compléter votre portrait relationnel et permettra de personnaliser davantage les conseils proposés dans votre rapport.",
      },
    ],
  },
  conflits: {
    sections: [
      {
        heading: "Pourquoi cette compétence est importante",
        body: "Aucun couple n’échappe aux désaccords.\n\nLa différence entre une relation fragile et une relation solide ne réside pas dans l’absence de conflits, mais dans la manière de les traverser.\n\nAujourd’hui, nous ne disposons pas encore des informations nécessaires pour analyser votre fonctionnement dans les situations de tension.\n\nCette partie de votre rapport sera automatiquement complétée après votre évaluation.",
      },
      {
        heading: "Ce que cette évaluation ajoutera à votre rapport",
        body: "Vous découvrirez :\n\n• votre réaction face aux désaccords ;\n• votre capacité à rechercher une solution commune ;\n• votre manière de gérer la colère ou la frustration ;\n• les comportements qui favorisent l’apaisement ;\n• les réflexes à développer pour préserver la qualité du dialogue.\n\nCette évaluation enrichira également votre plan de progression.",
      },
    ],
  },
  intelligence_emotionnelle: {
    sections: [
      {
        heading: "Ce que révèlent vos premières réponses",
        body: "Les premiers éléments disponibles montrent que vous semblez posséder une certaine sensibilité émotionnelle.\n\nVous accordez de l’importance aux relations humaines et vous cherchez généralement à préserver un climat relationnel agréable.\n\nCette disposition constitue une base intéressante pour construire une relation équilibrée.\n\nCependant, l’intelligence émotionnelle va bien au-delà de la sensibilité. Elle comprend également la capacité à reconnaître ses émotions, la maîtrise de ses réactions, l’expression saine des ressentis et l’écoute des émotions de l’autre.",
      },
      {
        heading: "Prochaine étape",
        body: "Ces dimensions seront progressivement approfondies au fil de votre parcours. Complétez l’évaluation pour enrichir automatiquement ce chapitre.",
      },
    ],
  },
  valeurs: {
    sections: [
      {
        heading: "Analyse en attente",
        body: "Vos valeurs influencent chacune de vos décisions.\n\nElles orientent vos choix, vos priorités et votre manière de construire une relation.\n\nCette partie du rapport sera disponible après votre évaluation « Valeurs fondamentales ».",
      },
      {
        heading: "Ce que vous découvrirez",
        body: "Cette analyse vous aidera à mieux comprendre :\n\n• les convictions qui guident vos choix ;\n• vos priorités de vie ;\n• les valeurs que vous souhaitez partager dans votre futur foyer ;\n• les domaines dans lesquels un dialogue sera essentiel avec votre futur conjoint.",
      },
    ],
  },
  vision_mariage: {
    sections: [
      {
        heading: "Analyse en attente",
        body: "Chaque personne possède une représentation différente du mariage.\n\nCertaines y voient avant tout un engagement spirituel. D’autres privilégient la complicité, la stabilité ou le projet familial.\n\nComprendre votre vision du mariage permettra d’enrichir considérablement votre Rapport Alliance.",
      },
      {
        heading: "Ce que cette évaluation apportera",
        body: "Vous découvrirez notamment :\n\n• votre conception de l’engagement ;\n• votre vision du rôle de chacun ;\n• vos attentes vis-à-vis de votre futur conjoint ;\n• les points de vigilance à prendre en compte avant le mariage.",
      },
    ],
  },
  projet_de_vie: {
    sections: [
      {
        heading: "Analyse en attente",
        body: "Votre projet de vie constitue l’une des bases de la compatibilité dans un couple.\n\nAujourd’hui, nous ne disposons pas encore d’informations suffisantes pour analyser cette dimension.",
      },
      {
        heading: "Ce que cette évaluation apportera",
        body: "Cette future évaluation permettra notamment d’explorer :\n\n• vos objectifs personnels ;\n• vos priorités à long terme ;\n• votre vision de la famille ;\n• votre équilibre entre vie personnelle, professionnelle et conjugale.",
      },
    ],
  },
  finances: {
    sections: [
      {
        heading: "Analyse en attente",
        body: "L’argent est un sujet qui mérite d’être abordé avec sérénité avant le mariage.\n\nCette évaluation ne cherche pas à mesurer vos revenus. Elle vise à comprendre votre manière de gérer les ressources qui vous sont confiées.",
      },
      {
        heading: "Ce que cette évaluation apportera",
        body: "Après cette évaluation, votre rapport pourra notamment analyser :\n\n• votre rapport aux dépenses ;\n• votre manière d’épargner ;\n• votre vision du budget familial ;\n• votre niveau de transparence financière.",
      },
    ],
  },
  spiritualite: {
    sections: [
      {
        heading: "Analyse en attente",
        body: "Votre vie spirituelle joue un rôle important dans la construction d’un mariage chrétien.\n\nCette dimension sera étudiée lorsque vous aurez réalisé l’évaluation correspondante.",
      },
      {
        heading: "Ce que vous découvrirez",
        body: "Vous découvrirez notamment :\n\n• la place de Dieu dans votre projet de mariage ;\n• votre manière de vivre votre foi au quotidien ;\n• votre vision de la croissance spirituelle dans le couple.",
      },
    ],
  },
}

/** Chapitres débloqués — structure sample 33-2 */
export function composeUnlockedChapterSections(input: {
  chapterId: string
  chapterTitle: string
  forceTitle?: string
  forceWhy?: string
  vigilanceTitle?: string
  vigilanceWhy?: string
  tipAdvice: string[]
}): { heading: string; body: string }[] {
  const tips =
    input.tipAdvice.length > 0
      ? input.tipAdvice
          .slice(0, 4)
          .map((a, i) => `${i + 1}. ${a}`)
          .join("\n")
      : "1. Continuez à observer vos réactions dans les échanges importants.\n2. Exprimez un besoin simple avec calme cette semaine.\n3. Revenez sur cette section après votre prochaine évaluation."

  if (input.chapterId === "communication") {
    return [
      {
        heading: "Votre manière de communiquer",
        body: `Votre profil révèle une communication principalement tournée vers le dialogue et la compréhension mutuelle.\n\nAvant d’exprimer votre opinion, vous cherchez généralement à comprendre le point de vue de votre interlocuteur. Vous appréciez les échanges calmes, structurés et respectueux.\n\nDans une relation de couple, cette disposition constitue un véritable atout. Elle favorise un climat de confiance où les sujets importants peuvent être abordés avec sérénité.\n\nCependant, votre recherche d’harmonie peut parfois vous conduire à minimiser certains désaccords ou à différer des conversations pourtant nécessaires. Une communication équilibrée consiste autant à écouter qu’à oser dire les choses avec bienveillance.`,
      },
      {
        heading: "Ce que vous faites particulièrement bien",
        body: input.forceTitle
          ? `Vous savez notamment cultiver « ${input.forceTitle} ». ${input.forceWhy || ""}\n\nCes qualités constituent des bases très solides pour construire une communication durable.`
          : "Vous savez écouter, reformuler et choisir des mots respectueux, même lorsque vous n’êtes pas d’accord. Ces qualités constituent des bases très solides.",
      },
      {
        heading: "Vos points de vigilance",
        body: input.vigilanceTitle
          ? `Lorsque le sujet est sensible, attention à « ${input.vigilanceTitle} ». ${input.vigilanceWhy || ""}\n\nÀ long terme, ces comportements risquent d’alimenter des frustrations silencieuses.`
          : "Lorsque le sujet est sensible, vous pouvez avoir tendance à attendre trop longtemps avant d’aborder un problème. À long terme, cela risque d’alimenter des frustrations silencieuses.",
      },
      {
        heading: "Recommandations personnalisées",
        body: tips,
      },
    ]
  }

  if (input.chapterId === "conflits") {
    return [
      {
        heading: "Votre manière de réagir face aux désaccords",
        body: "Vous ne recherchez pas le conflit.\n\nVotre premier réflexe consiste généralement à préserver la relation plutôt qu’à défendre immédiatement votre point de vue.\n\nCette attitude traduit une réelle maturité relationnelle, mais elle comporte également un risque : celui de sacrifier vos propres besoins pour maintenir une paix apparente.\n\nLes conflits ne sont pas nécessairement le signe qu’une relation va mal. Ils peuvent devenir des occasions de mieux se comprendre lorsque chacun apprend à exprimer ses attentes avec calme.",
      },
      {
        heading: "Ce que cette compétence apporte au mariage",
        body: "Une bonne gestion des conflits permet d’éviter l’accumulation des frustrations, de renforcer la confiance, de développer une meilleure compréhension mutuelle et de préserver la qualité du dialogue même dans les périodes difficiles.",
      },
      {
        heading: "Conseils personnalisés",
        body: `Ne cherchez pas à éviter tous les désaccords. Cherchez plutôt à apprendre à les traverser avec sagesse.\n\n${tips}`,
      },
    ]
  }

  return [
    {
      heading: `Votre fonctionnement — ${input.chapterTitle}`,
      body: input.forceWhy
        ? `${input.forceTitle ? `${input.forceTitle}. ` : ""}${input.forceWhy}`
        : `Cette section présente votre fonctionnement observé concernant « ${input.chapterTitle} ».`,
    },
    {
      heading: "Vos points forts",
      body: input.forceTitle
        ? `${input.forceTitle} — ${input.forceWhy || "Ressource déjà présente dans votre profil."}`
        : "Des ressources sont déjà présentes ; poursuivez les tests pour les préciser.",
    },
    {
      heading: "Points de vigilance",
      body: input.vigilanceTitle
        ? `${input.vigilanceTitle} — ${input.vigilanceWhy || "Axe de progression utile pour votre futur mariage."}`
        : "Les axes de progression apparaîtront au fur et à mesure des évaluations.",
    },
    {
      heading: "Conseils personnalisés",
      body: tips,
    },
  ]
}

export function composeConclusion(input: {
  firstName: string
  mode: ReportDocumentMode
  completenessPercent: number
  testsDone: number
  testsTotal: number
  nextTitle?: string | null
}): string {
  const name = input.firstName.trim() || "Membre"
  if (input.mode === "incomplete") {
    return `${name},\n\nVous venez de franchir une première étape importante.\n\nPrendre le temps de mieux se connaître est déjà une démarche de maturité.\n\nBeaucoup de personnes préparent leur mariage en pensant uniquement à la cérémonie ou au choix du conjoint. Vous avez choisi de commencer par vous connaître davantage.\n\nC’est un investissement qui portera ses fruits dans toutes vos relations.\n\nVotre rapport est encore au début de son parcours. Il ne cherche pas à vous donner une image figée de votre personnalité. Il évoluera avec vous, au rythme de vos découvertes, de vos progrès et des évaluations que vous réaliserez.\n\nNous vous encourageons à poursuivre ce chemin avec confiance.\n\nChaque nouvelle étape vous apportera une compréhension plus fine de vous-même et vous aidera à construire les bases d’une relation solide, équilibrée et durable.\n\nNous sommes heureux de vous accompagner dans cette préparation.\n\nÀ très bientôt pour la suite de votre parcours Alliance.`
  }
  return `${name},\n\nVous venez de consacrer du temps à mieux vous connaître.\n\nC’est un choix qui demande de l’humilité, du courage et une véritable volonté de grandir.\n\nBeaucoup de personnes espèrent rencontrer le bon conjoint. Peu prennent d’abord le temps de devenir elles-mêmes un partenaire de vie plus mature.\n\nVous recherchez un mariage qui repose sur la confiance, la fidélité et la croissance commune. Vous ne semblez pas rechercher une relation parfaite — vous recherchez une relation authentique.\n\nCette différence est essentielle.\n\nContinuez à développer votre communication, votre capacité à exprimer vos besoins avec bienveillance, votre intelligence émotionnelle et votre capacité à traverser les désaccords avec sérénité.\n\nLa préparation au mariage est un chemin. Chaque expérience vous permettra de continuer à grandir.\n\nMerci d’avoir pris le temps de découvrir votre Rapport Personnalisé KELIAA Alliance.`
}

export function composePlanIntro(mode: ReportDocumentMode): string {
  if (mode === "incomplete") {
    return "Les résultats actuellement disponibles permettent déjà de définir plusieurs priorités de progression.\n\nCes recommandations ne cherchent pas à transformer votre personnalité. Elles visent à développer les compétences qui favoriseront la construction d’un mariage solide, équilibré et durable.\n\nConsidérez cette feuille de route comme un accompagnement progressif. Il n’est pas nécessaire de tout mettre en pratique immédiatement. L’important est d’avancer avec régularité."
  }
  return "Vous connaissez désormais vos principales forces ainsi que les compétences qui méritent d’être développées.\n\nCependant, la connaissance de soi n’a de valeur que lorsqu’elle conduit à des changements concrets.\n\nL’objectif de cette partie est de vous aider à transformer les enseignements de ce rapport en habitudes durables. Il ne s’agit pas de tout changer en quelques semaines, mais de progresser régulièrement dans les domaines qui auront le plus d’impact sur votre futur mariage."
}
