/**
 * Génération de rapport KELYA COUPLE™
 * Essentiel = base rédigée ; Premium Plus = Essentiel + ajouts (cumulatif).
 */

import {
  COUPLE_BRAND,
  COUPLE_CONTENT_VERSION,
  COUPLE_PROMISE,
  COUPLE_QUESTIONNAIRE_VERSION,
  COUPLE_REPORT_VERSION,
  COUPLE_SCORING_VERSION,
  COUPLE_TAGLINE,
} from "@/lib/couple/config"
import type { CoupleOfferId } from "@/lib/couple/offers"
import { isPremiumPlusOffer } from "@/lib/couple/offers"
import {
  interpretGlobalScore,
  type CoupleScoringResult,
  type DimensionPairScore,
} from "@/lib/couple/scoring"
import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import { sectionBlocksFromLegacy } from "@/lib/couple/reportBlocks"
import {
  explainConvergenceMetric,
  interpretDimension,
  profileHighlights,
} from "@/lib/couple/interpretations"

export type CoupleReportNames = {
  nameA: string
  nameB: string
}

export type CoupleReportSection = {
  id: string
  title: string
  subtitle?: string
  paragraphs: string[]
  bullets?: string[]
  /** Blocs structurés (préférés pour l’UI slides). */
  blocks?: CoupleReportBlock[]
}

export type CoupleExercise = {
  id: string
  title: string
  objective: string
  why: string
  duration: string
  preparation: string
  steps: string[]
  questions: string[]
  share: string
  debrief: string
  takeaway: string
  nextAction: string
  premiumPlus?: boolean
  /** Jeu de rôle optionnel. */
  rolePlay?: {
    title: string
    roleA: string
    roleB: string
    scene: string
  }
  fillPrompts?: string[]
}

export type CoupleActionStep = {
  order: number
  what: string
  how: string
  when: string
  goal: string
  progressSignal: string
}

export type CoupleReportDocument = {
  brand: string
  tagline: string
  offerId: CoupleOfferId
  names: CoupleReportNames
  globalScore: number
  scoreInterpretation: ReturnType<typeof interpretGlobalScore>
  versions: {
    questionnaire_version: string
    scoring_version: string
    content_version: string
    report_version: string
    offer: CoupleOfferId
    generation_date: string
  }
  sections: CoupleReportSection[]
  exercises: CoupleExercise[]
  actionPlan: CoupleActionStep[]
  premiumPlusExtras: CoupleReportSection[]
  safetyNotice: string | null
}

function dimList(items: DimensionPairScore[], max = 4): string {
  return items
    .slice(0, max)
    .map((d) => d.label)
    .join(", ")
}

function forceParagraph(d: DimensionPairScore, names: CoupleReportNames): string {
  const ix = interpretDimension(d, names)
  return `${ix.data} ${ix.meaning} ${explainConvergenceMetric(d.gap, d.convergence)}`
}

function differenceParagraph(
  d: DimensionPairScore,
  names: CoupleReportNames
): string {
  const ix = interpretDimension(d, names)
  return `${ix.data} ${ix.meaning} ${ix.notConclude} Pour échanger : ${ix.questions[0] ?? ""}`
}

/** Chapitre dimension — interprétation réelle (pas de template clone). */
function dimensionDeepChapter(
  d: DimensionPairScore,
  names: CoupleReportNames
): CoupleReportSection {
  const ix = interpretDimension(d, names)
  const paragraphs = [
    ix.measures,
    ix.data,
    ix.meaning,
    ix.notConclude,
    ix.conflictPattern
      ? `Dynamique typique sur cet axe : ${ix.conflictPattern}`
      : `Sur cet axe, l’enjeu n’est pas d’effacer la différence mais de la rendre parlable.`,
  ]

  const blocks: CoupleReportBlock[] = [
    {
      type: "scoreChart",
      label: d.label,
      scoreA: d.scoreA,
      scoreB: d.scoreB,
      nameA: names.nameA,
      nameB: names.nameB,
      convergence: d.convergence,
    },
    { type: "h2", text: "Ce que mesure cet axe" },
    { type: "paragraph", text: ix.measures },
    {
      type: "callout",
      tone: "info",
      text: explainConvergenceMetric(d.gap, d.convergence),
    },
    { type: "h2", text: "Ce que vos réponses montrent" },
    { type: "paragraph", text: ix.data },
    { type: "h2", text: "Interprétation" },
    { type: "paragraph", text: ix.meaning },
    {
      type: "callout",
      tone: d.status === "vigilance" ? "alert" : "gold",
      text: `${ix.levelLabel} — ${ix.notConclude}`,
    },
  ]

  if (ix.conflictPattern) {
    blocks.push(
      { type: "h2", text: "Motif de conflit fréquent" },
      { type: "paragraph", text: ix.conflictPattern }
    )
  }

  blocks.push(
    { type: "h2", text: "Questions pour échanger" },
    { type: "ol", items: ix.questions },
    { type: "h2", text: "À mettre en place" },
    { type: "ul", items: ix.actions },
    {
      type: "fillBlank",
      prompt: `Ce qui diffère vraiment pour nous sur « ${d.label} » :`,
      lines: 3,
    }
  )

  return {
    id: `dim-${d.dimension}`,
    title: `${d.label} — ${ix.levelLabel}`,
    subtitle: "Données · Sens · Questions · Action",
    paragraphs,
    blocks,
  }
}

function withBlocks(
  section: Omit<CoupleReportSection, "blocks"> & { blocks?: CoupleReportBlock[] }
): CoupleReportSection {
  if (section.blocks?.length) return section as CoupleReportSection
  return {
    ...section,
    blocks: sectionBlocksFromLegacy({
      paragraphs: section.paragraphs,
      bullets: section.bullets,
      subtitleBlocks: section.subtitle
        ? [{ type: "h2", text: section.subtitle }]
        : undefined,
    }),
  }
}

function buildPremiumPlusDepth(
  names: CoupleReportNames,
  scoring: CoupleScoringResult
): CoupleReportSection[] {
  const a = names.nameA
  const b = names.nameB
  const top = scoring.priorities[0]?.label ?? "la communication"
  return [
    {
      id: "pp-dynamique",
      title: "Analyse approfondie des dynamiques (Premium Plus)",
      subtitle: "Qui initie · qui reçoit · qui répare",
      paragraphs: [
        `Au-delà des scores, ${a} et ${b} créent un système : ce que l’un initie, l’autre reçoit, et ce que l’autre reçoit influence ce que le premier ose ensuite. Observer « qui initie / qui reçoit / qui répare » est souvent plus utile qu’une note globale.`,
        "Dans beaucoup de couples, l’un porte la conversation difficile pendant que l’autre porte le calme apparent. Ce partage n’est pas moralement « juste » ou « injuste » : il est souvent historique, culturel ou lié à la peur. Le nommer permet de le redistribuer.",
        `Scénario de travail (14 jours) : inversez volontairement une habitude. Celui qui parle peu initie une fois une conversation sensible. Celui qui presse ralentit une fois et reformule avant de trancher. Notez le climat le jour J et le jour J+1.`,
        "Question de supervision : « Est-ce que notre façon de résoudre les problèmes renforce la proximité, ou est-ce qu’elle crée un gagnant et un perdant ? »",
      ],
      blocks: [
        { type: "h2", text: "Le système à deux" },
        {
          type: "paragraph",
          text: `Au-delà des scores, ${a} et ${b} créent un système : qui initie, qui reçoit, qui répare.`,
        },
        {
          type: "ol",
          items: [
            "Nommer qui porte la conversation difficile.",
            "Inverser une habitude pendant 14 jours.",
            "Noter le climat J / J+1.",
          ],
        },
        {
          type: "callout",
          tone: "gold",
          text: "Question : notre façon de résoudre renforce-t-elle la proximité, ou crée-t-elle un gagnant et un perdant ?",
        },
        {
          type: "fillBlank",
          prompt: "Chez nous, celui qui initie souvent / celui qui répare souvent :",
          lines: 2,
        },
      ],
    },
    {
      id: "pp-interactions",
      title: "Interactions entre dimensions (Premium Plus)",
      subtitle: "Lire les écarts comme un réseau",
      paragraphs: [
        `Vos priorités (notamment ${top}) ne vivent pas isolées. Une tension sur les finances colore souvent la communication ; une différence sur le projet de vie peut amplifier les conflits ; une solidité sur les valeurs peut au contraire protéger les autres axes.`,
        "Lisez donc vos écarts comme un réseau : si vous travaillez un seul levier sans regarder les leviers voisins, le progrès reste fragile. Si vous travaillez un levier prioritaire avec un rituel de réparation, plusieurs zones s’améliorent souvent ensemble.",
        `Cartographie suggérée pour ${a} & ${b} : 1) axe prioritaire, 2) axe de soutien (une force), 3) axe de vigilance. Travaillez-les dans cet ordre pendant 30 jours.`,
      ],
    },
    {
      id: "pp-scenarios",
      title: "Scénarios relationnels (Premium Plus)",
      subtitle: "Trois situations types",
      paragraphs: [
        `Scénario 1 — Désaccord de rythme : ${a} veut accélérer une décision, ${b} veut ralentir. Sans cadre, l’un se sent freiné, l’autre se sent poussé. Cadre : « On décide ce soir si on décide aujourd’hui ou dans 7 jours — pas les deux en même temps. »`,
        "Scénario 2 — Silence après dispute : l’un a besoin d’espace, l’autre de rapprochement. Accord : signal de pause + heure de reprise (ex. « on reprend à 20h »). Le silence sans date nourrit l’abandon.",
        "Scénario 3 — Famille / argent / projet : un sujet sensible revient. Utilisez le protocole Premium Plus (sujet unique, tours de parole, reformulation, une demande, un engagement daté).",
        "Après chaque scénario, notez une phrase : « Ce qui a marché » et « Ce qu’on ajuste la prochaine fois ». La mémoire écrite bat la bonne intention floue.",
      ],
      blocks: [
        { type: "h2", text: "Scénarios à rejouer" },
        {
          type: "ol",
          items: [
            "Désaccord de rythme — décider si on décide aujourd’hui ou dans 7 jours.",
            "Silence après dispute — pause + heure de reprise.",
            "Sujet sensible — protocole 5 étapes.",
          ],
        },
        {
          type: "rolePlay",
          title: "Jeu de rôle — rythme",
          roleA: `${a} veut accélérer.`,
          roleB: `${b} veut ralentir.`,
          scene: "Vous avez 8 minutes pour poser un cadre commun sans humiliations.",
        },
      ],
    },
    {
      id: "pp-protocole",
      title: "Protocole de conversation difficile (Premium Plus)",
      subtitle: "25–30 minutes chronométrées",
      paragraphs: [
        "1) Cadre (2 min) : un seul sujet, durée totale 25–30 min, pas d’interrupteurs, téléphones hors de portée.",
        "2) Tour A (5 min) puis tour B (5 min) : chacun parle de son vécu, sans attaquer le caractère de l’autre.",
        "3) Reformulation croisée (5 min) : chacun reformule ce qu’il a compris avant de répondre.",
        "4) Une demande concrète chacun (3 min) : formulée en besoin, pas en ultimatum.",
        "5) Un micro-engagement daté (2 min) : qui fait quoi, pour quand, comment on saura que c’est fait.",
        "Si la tension monte : pause de 20 minutes minimum, puis reprise du protocole — pas reprise du combat. Ce protocole n’est pas une thérapie ; c’est une hygiène relationnelle.",
      ],
      blocks: [
        { type: "h2", text: "Les 5 étapes" },
        {
          type: "ol",
          items: [
            "Cadre (2 min) — un sujet, 25–30 min, téléphones hors de portée.",
            "Tour A puis tour B (5 min chacun) — vécu, pas attaque.",
            "Reformulation croisée (5 min).",
            "Une demande concrète chacun (3 min).",
            "Micro-engagement daté (2 min).",
          ],
        },
        {
          type: "callout",
          tone: "alert",
          text: "Tension qui monte → pause 20 min minimum, puis reprise du protocole (pas du combat).",
        },
      ],
    },
    {
      id: "pp-charte",
      title: "Charte relationnelle (Premium Plus)",
      subtitle: "5 engagements visibles",
      paragraphs: [
        "Rédigez ensemble une charte courte en 5 engagements. Affichez-la où vous la verrez. Relisez-la le 1er dimanche du mois.",
        "La charte n’est pas un contrat juridique : c’est un rappel visible de ce que vous choisissez d’être l’un pour l’autre, surtout quand vous êtes fatigués.",
      ],
      bullets: [
        "Nous ne nous humilions pas, même en colère.",
        "Nous utilisons un signal de pause avant l’emballement.",
        "Nous réparons avant de « passer à autre chose ».",
        "Nous décidons ensemble au-delà du seuil convenu.",
        "Nous célébrons au moins une chose positive chaque semaine.",
      ],
    },
    {
      id: "pp-fiches",
      title: "Fiches pratiques (Premium Plus)",
      subtitle: "Quatre feuilles à vivre",
      paragraphs: [
        "Fiche 1 — Check-in hebdomadaire (15 min) : une joie, une friction, une demande, une gratitude.",
        "Fiche 2 — Budget émotionnel : noter 3 moments où l’un s’est senti seul(e) malgré la présence de l’autre.",
        "Fiche 3 — Décision à deux : options, critères, délai, qui tranche en cas de blocage temporaire.",
        "Fiche 4 — Réparation : « Ce que j’ai fait / ce que ça a produit / ce que je propose / ce dont j’ai besoin ».",
        "Utilisez une fiche par semaine pendant 4 semaines, puis choisissez les 2 qui vous servent vraiment.",
      ],
    },
    {
      id: "pp-plan-etendu",
      title: "Plan d’action étendu 90 jours (Premium Plus)",
      subtitle: "Stabiliser · Prioriser · Élargir",
      paragraphs: [
        "Jours 1–14 : stabiliser la réparation et le check-in. Objectif : 2 rituels tenus.",
        `Jours 15–45 : travailler en priorité « ${top} » avec un micro-ajustement hebdomadaire mesurable.`,
        "Jours 46–90 : élargir à un second axe, puis faire une revue de couple écrite (ce qui a bougé, ce qui reste).",
        "À J+90 : décider ensemble si vous poursuivez en autonomie, avec coaching, ou avec un professionnel — sans honte. Demander de l’aide est une compétence de couple.",
      ],
    },
    {
      id: "pp-ressources",
      title: "Ressources & orientation (Premium Plus)",
      subtitle: "Au-delà du dossier",
      paragraphs: [
        "Ce bilan peut s’accompagner de lectures ciblées, de séances de coaching KELIAA, ou d’un accompagnement pastoral / thérapeutique selon votre contexte.",
        "Si apparaît de la peur, du contrôle, de l’humiliation répétée ou une atteinte à la sécurité, priorisez la mise en sécurité et un professionnel compétent. KELYA COUPLE éclaire ; il ne remplace pas un suivi clinique.",
      ],
    },
    {
      id: "pp-conclusion",
      title: "Conclusion Premium Plus",
      subtitle: "De la compréhension à l’action",
      paragraphs: [
        `${a} et ${b}, vous disposez maintenant d’une base Essentiel complète, enrichie d’outils de mise en pratique. La valeur de Premium Plus n’est pas d’avoir « plus de pages » pour impressionner : c’est de passer de la compréhension à l’action sans vous perdre.`,
        "Choisissez une seule priorité cette semaine. Tenez-la. Puis revenez au dossier. C’est ainsi qu’un bilan devient un compagnon, pas un souvenir PDF.",
      ],
    },
  ]
}

function buildCoreExercises(
  priorities: DimensionPairScore[],
  names?: { nameA: string; nameB: string }
): CoupleExercise[] {
  const focus = priorities[0]
  const focusLabel = focus?.label ?? "la communication"
  const ix = focus && names ? interpretDimension(focus, names) : null
  return [
    {
      id: "ex-comprendre",
      title: `Ce que j’aimerais que tu comprennes — ${focusLabel}`,
      objective: `Clarifier ce qui diffère vraiment sur « ${focusLabel} » sans accuser.`,
      why:
        ix?.meaning ??
        `Votre bilan met en avant « ${focusLabel} » comme zone prioritaire.`,
      duration: "25–35 minutes",
      preparation:
        "Choisissez un moment calme. Téléphones de côté. Convenez que chacun parle sans être interrompu.",
      steps: [
        `Chacun écrit pendant 8 minutes sur « ${focusLabel} » : ce que je vis, ce que je crains, ce dont j’ai besoin.`,
        "À tour de rôle, lisez votre texte (3 minutes max).",
        "L’autre reformule ce qu’il a compris, sans défendre ni corriger.",
        ix?.actions[0]
          ? `Notez ensemble : ${ix.actions[0]}`
          : "Notez ensemble une seule chose concrète à essayer cette semaine.",
      ],
      questions: ix?.questions ?? [
        "Qu’est-ce qui m’a touché(e) dans ce que j’ai entendu ?",
        "Quelle demande précise puis-je formuler sans attaquer ?",
      ],
      share: "Partagez uniquement ce que vous avez écrit — pas vos hypothèses sur l’autre.",
      debrief:
        "Demandez-vous : ai-je été entendu(e) ? Ai-je écouté sans me justifier trop vite ?",
      takeaway:
        "La compréhension précède la solution. Une demande claire vaut mieux qu’un reproche vague.",
      nextAction:
        ix?.actions[1] ??
        "Cette semaine, appliquez la même structure sur une situation réelle.",
      fillPrompts: [
        `Sur « ${focusLabel} », ce que je veux que tu comprennes :`,
        "Ce que j’ai entendu et retenu :",
        "Notre micro-ajustement daté :",
      ],
      rolePlay: {
        title: `Jeu de rôle — ${focusLabel}`,
        roleA: "Parle 2 minutes de ton besoin (sans accuser).",
        roleB: "Reformule uniquement : « Ce que j’entends, c’est… »",
        scene: ix?.conflictPattern
          ? `Scène : ${ix.conflictPattern}`
          : `Sujet : un moment récent lié à « ${focusLabel} ».`,
      },
    },
    {
      id: "ex-reparation",
      title: "Réparer après friction",
      objective: "Installer un rituel de réparation après tension.",
      why: priorities[1]
        ? `Utile surtout quand « ${priorities[1].label} » ou « ${focusLabel} » monte en pression.`
        : "Sans réparation, les écarts s’accumulent même quand l’amour est réel.",
      duration: "15–20 minutes",
      preparation: "Acceptez que le but n’est pas de « gagner » mais de rétablir le lien.",
      steps: [
        "Chacun dit : « Ce que j’ai ressenti » (pas « ce que tu as fait »).",
        "Chacun reconnaît une part de responsabilité, même petite.",
        "Formulez une réparation concrète (geste, moment, ajustement).",
        "Convenez d’un signal pour calmer le jeu la prochaine fois.",
      ],
      questions: [
        "Qu’est-ce qui m’a blessé(e) vraiment ?",
        "Quelle part je reconnais ?",
        "De quoi ai-je besoin pour me sentir à nouveau en sécurité ?",
      ],
      share: "Parlez à la première personne. Évitez les généralisations (« toujours », « jamais »).",
      debrief: "La réparation a-t-elle ramené de la chaleur, ou seulement un cessez-le-feu ?",
      takeaway: "Réparer tôt coûte moins cher que laisser durcir le silence.",
      nextAction: "Écrivez votre « signal de pause » commun et affichez-le quelque part visible.",
      fillPrompts: [
        "Ce que j’ai ressenti :",
        "La part que je reconnais :",
        "Notre signal de pause :",
      ],
      rolePlay: {
        title: "Jeu de rôle — réparation",
        roleA: "Dis ton ressenti en « je » (90 secondes).",
        roleB: "Reconnais une part + propose un geste de réparation.",
        scene: "Après une friction récente (sujet unique).",
      },
    },
  ]
}

function buildPremiumExercises(): CoupleExercise[] {
  return [
    {
      id: "ex-scenario-finance",
      title: "Simulation — Une décision financière importante",
      objective: "Rendre visibles vos seuils, peurs et autonomies autour de l’argent.",
      why: "Les tensions financières naissent souvent de règles implicites jamais dites.",
      duration: "40 minutes",
      preparation: "Préparez un carnet. Répondez d’abord séparément, puis comparez.",
      steps: [
        "Répondez séparément aux questions ci-dessous.",
        "Comparez vos seuils et vos peurs sans juger.",
        "Rédigez ensemble 3 règles de décision financière pour les 90 prochains jours.",
      ],
      questions: [
        "À partir de quel montant est-il important que nous décidions ensemble ?",
        "Qu’est-ce qui me rassure avant une dépense importante ?",
        "Quelle marge d’autonomie financière est importante pour moi ?",
        "Que ferais-je si nous n’étions pas d’accord ?",
      ],
      share: "Comparez les réponses comme des cartes, pas comme des preuves de « qui a raison ».",
      debrief: "Où est l’écart le plus utile à clarifier maintenant ?",
      takeaway: "Des règles explicites protègent le couple mieux que les non-dits.",
      nextAction: "Écrivez vos 3 règles et datez-les. Revoyez-les dans 90 jours.",
      premiumPlus: true,
      fillPrompts: [
        "Mon seuil de décision commune :",
        "Ce qui me rassure avant une grosse dépense :",
        "Règle 1 / 2 / 3 (90 jours) :",
      ],
      rolePlay: {
        title: "Jeu de rôle — décision argent",
        roleA: "Tu veux avancer sur une dépense / investissement.",
        roleB: "Tu as besoin de temps et de critères clairs.",
        scene: "Vous avez 10 minutes pour poser seuil, délai et qui tranche temporairement.",
      },
    },
  ]
}

function buildActionPlan(priorities: DimensionPairScore[], names: CoupleReportNames): CoupleActionStep[] {
  const steps: CoupleActionStep[] = priorities.slice(0, 3).map((d, i) => {
    const ix = interpretDimension(d, names)
    return {
      order: i + 1,
      what: `Travailler « ${d.label} » (priorité ${i + 1})`,
      how: `${ix.actions[0] ?? "Clarifier attentes."} Questions guides : ${ix.questions.slice(0, 2).join(" · ")}`,
      when:
        i === 0
          ? "Dans les 7 prochains jours, créneau de 30 minutes."
          : i === 1
            ? "Chaque semaine, jour fixe, pendant 4 semaines."
            : "J+30 après la lecture du rapport.",
      goal: ix.meaning.slice(0, 160) + (ix.meaning.length > 160 ? "…" : ""),
      progressSignal: ix.actions[1] ?? "Vous pouvez citer un ajustement tenu.",
    }
  })
  if (!steps.length) {
    steps.push({
      order: 1,
      what: "Entretenir vos convergences",
      how: "Relisez vos forces et choisissez un rituel hebdomadaire de 15 min.",
      when: "Cette semaine.",
      goal: "Ne pas laisser l’alignement s’user.",
      progressSignal: "Le rituel a eu lieu.",
    })
  }
  return steps
}

export function buildCoupleReport(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
}): CoupleReportDocument {
  const { offerId, names, scoring } = args
  const interpretation = interpretGlobalScore(scoring.globalScore)
  const generationDate = new Date().toISOString()

  const topDim = scoring.priorities[0] ?? scoring.dimensions[0]
  const sections: CoupleReportSection[] = [
    withBlocks({
      id: "accueil",
      title: "Message d’accueil",
      subtitle: "Votre dossier commence ici",
      paragraphs: [
        `${names.nameA} et ${names.nameB}, bienvenue dans votre bilan ${COUPLE_BRAND}.`,
        COUPLE_PROMISE,
        "Ce dossier n’est pas un jugement sur votre avenir. C’est une carte de compréhension : ce qui vous rapproche, ce qui vous différencie, et ce que vous pouvez construire ensemble avec lucidité et bienveillance.",
      ],
      blocks: [
        { type: "h2", text: "Ce que vous allez trouver" },
        {
          type: "ol",
          items: [
            "Une synthèse lisible de votre dynamique.",
            "Des chapitres dimension par dimension, avec graphiques.",
            "Un cahier d’exercices et un plan d’action séparés.",
          ],
        },
        {
          type: "callout",
          tone: "gold",
          text: "Indicateur de dynamique — jamais un verdict d’incompatibilité.",
        },
        { type: "paragraph", text: COUPLE_PROMISE },
      ],
    }),
    withBlocks({
      id: "lire",
      title: "Comment lire ce bilan",
      subtitle: "Ordre de lecture recommandé",
      paragraphs: [
        "Lisez d’abord la synthèse et le score global comme un indicateur de dynamique, pas comme une note définitive.",
        "Ensuite, explorez vos forces et convergences — ce sont vos ressources. Puis abordez différences et zones de vigilance comme des sujets de travail, jamais comme des preuves d’échec.",
        "Les exercices et le plan d’action transforment l’analyse en pratique. Un bilan sans mise en mouvement reste une information ; avec pratique, il devient un levier.",
      ],
      blocks: [
        { type: "h2", text: "Ordre suggéré" },
        {
          type: "ol",
          items: [
            "Synthèse + score global",
            "Forces et convergences",
            "Différences et vigilance",
            "Chapitres dimension par dimension",
            "Exercices + plan d’action (cahiers séparés)",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "Relisez d’abord vos forces avant les écarts : le moral conditionne la qualité du travail.",
        },
      ],
    }),
    withBlocks({
      id: "synthese",
      title: "Synthèse de votre couple",
      subtitle: "Vue d’ensemble",
      paragraphs: [
        `Votre score global s’établit à ${scoring.globalScore} %. ${interpretation.paragraph}`,
        scoring.strengths.length
          ? `Parmi vos appuis les plus clairs : ${dimList(scoring.strengths)}.`
          : "Vos réponses dessinent un profil nuancé, à lire dimension par dimension.",
        scoring.priorities.length
          ? `Les priorités de travail les plus utiles aujourd’hui concernent notamment : ${dimList(scoring.priorities)}.`
          : "Peu d’écarts majeurs ressortent ; le travail consistera surtout à entretenir et approfondir.",
      ],
      blocks: [
        ...(topDim
          ? [
              {
                type: "scoreChart" as const,
                label: "Aperçu — " + topDim.label,
                scoreA: topDim.scoreA,
                scoreB: topDim.scoreB,
                nameA: names.nameA,
                nameB: names.nameB,
                convergence: topDim.convergence,
              },
            ]
          : []),
        { type: "h2", text: "En une phrase" },
        {
          type: "paragraph",
          text: `Score ${scoring.globalScore} % — ${interpretation.title}. ${interpretation.paragraph}`,
        },
        { type: "h2", text: "Appuis & priorités" },
        {
          type: "ul",
          items: [
            scoring.strengths.length
              ? `Appuis : ${dimList(scoring.strengths)}`
              : "Appuis à lire dimension par dimension",
            scoring.priorities.length
              ? `Priorités : ${dimList(scoring.priorities)}`
              : "Entretenir et approfondir",
          ],
        },
      ],
    }),
    withBlocks({
      id: "score",
      title: "Votre score global",
      subtitle: interpretation.title,
      paragraphs: [
        `Score : ${scoring.globalScore} % — ${interpretation.title}`,
        interpretation.paragraph,
        "Rappel essentiel : un score bas n’écrit pas « vous êtes incompatibles ». Un score élevé n’écrit pas « vous n’avez rien à travailler ».",
      ],
      blocks: [
        ...(topDim
          ? [
              {
                type: "scoreChart" as const,
                label: "Score de référence (1re dimension)",
                scoreA: topDim.scoreA,
                scoreB: topDim.scoreB,
                nameA: names.nameA,
                nameB: names.nameB,
                convergence: topDim.convergence,
              },
            ]
          : []),
        {
          type: "callout",
          tone: "gold",
          text: `Score couple : ${scoring.globalScore} % — ${interpretation.title}`,
        },
        { type: "paragraph", text: interpretation.paragraph },
        {
          type: "ul",
          items: [
            "Un score bas ≠ incompatibilité.",
            "Un score élevé ≠ « rien à travailler ».",
            "Lisez toujours avec les chapitres dimension.",
          ],
        },
      ],
    }),
    withBlocks({
      id: "forces",
      title: "Vos grandes forces",
      subtitle: "Ressources à nommer et entretenir",
      paragraphs: scoring.strengths.slice(0, 5).map((d) => forceParagraph(d, names)),
      blocks: [
        {
          type: "callout",
          tone: "gold",
          text: "Une force = axe où vous êtes alignés et à un niveau utile. Ce n’est pas « acquis pour toujours » : ça s’entretient.",
        },
        { type: "h2", text: "Vos appuis (interprétation)" },
        ...scoring.strengths.slice(0, 5).flatMap((d) => {
          const ix = interpretDimension(d, names)
          return [
            {
              type: "paragraph" as const,
              text: `• ${d.label} — ${names.nameA} ${d.scoreA} % · ${names.nameB} ${d.scoreB} % (convergence ${d.convergence} %)`,
            },
            { type: "paragraph" as const, text: ix.meaning },
          ]
        }),
      ],
    }),
    withBlocks({
      id: "convergences",
      title: "Vos principales convergences",
      subtitle: "Ce que signifie « convergence »",
      paragraphs: [
        "La convergence mesure l’alignement de vos scores sur un axe : 100 % signifie un écart quasi nul entre vous. Ce n’est pas une note d’amour, ni une garantie d’avenir — c’est un indicateur d’accord de réponses.",
        ...scoring.convergences.slice(0, 8).map((d) => {
          const ix = interpretDimension(d, names)
          return `${d.label} (${d.convergence} %) — ${ix.meaning}`
        }),
      ],
      blocks: [
        {
          type: "callout",
          tone: "info",
          text: "Convergence 100 % = vos réponses se rejoignent sur cet axe. Cela facilite la confiance, mais reste à entretenir (pas « acquis pour toujours »).",
        },
        { type: "h2", text: "Liste des convergences fortes" },
        {
          type: "ul",
          items: scoring.convergences.slice(0, 8).map((d) => {
            const ix = interpretDimension(d, names)
            return `${d.label} — conv. ${d.convergence} % (${names.nameA} ${d.scoreA} % · ${names.nameB} ${d.scoreB} %) · ${ix.levelLabel}`
          }),
        },
        { type: "h2", text: "Lecture courte" },
        ...scoring.convergences.slice(0, 5).map((d) => ({
          type: "paragraph" as const,
          text: interpretDimension(d, names).meaning,
        })),
      ],
    }),
    withBlocks({
      id: "differences",
      title: "Vos différences",
      subtitle: "Ce qui diffère — et quoi mettre en place",
      paragraphs:
        scoring.divergences.length > 0
          ? scoring.divergences.slice(0, 6).map((d) => differenceParagraph(d, names))
          : [
              "Peu de divergences marquées ressortent. Vérifiez quand même que les accords implicites restent explicites.",
            ],
      blocks:
        scoring.divergences.length > 0
          ? [
              {
                type: "callout" as const,
                tone: "gold" as const,
                text: "Une différence n’est pas une accusation. C’est ce qui n’est pas encore assez clair pour échanger et décider.",
              },
              ...scoring.divergences.slice(0, 6).flatMap((d) => {
                const ix = interpretDimension(d, names)
                return [
                  { type: "h2" as const, text: d.label },
                  {
                    type: "scoreChart" as const,
                    label: d.label,
                    scoreA: d.scoreA,
                    scoreB: d.scoreB,
                    nameA: names.nameA,
                    nameB: names.nameB,
                    convergence: d.convergence,
                  },
                  { type: "paragraph" as const, text: ix.data },
                  { type: "paragraph" as const, text: ix.meaning },
                  {
                    type: "ol" as const,
                    items: [
                      `Échanger : ${ix.questions[0]}`,
                      `Mettre en place : ${ix.actions[0]}`,
                    ],
                  },
                ]
              }),
            ]
          : [
              {
                type: "paragraph" as const,
                text: "Peu de divergences marquées. Continuez à expliciter les accords implicites.",
              },
            ],
    }),
    withBlocks({
      id: "vigilance",
      title: "Zones de vigilance",
      subtitle: "Écarts structurants à clarifier",
      paragraphs: scoring.vigilanceZones.length
        ? scoring.vigilanceZones.slice(0, 5).map((d) => {
            const ix = interpretDimension(d, names)
            return `${ix.data} ${ix.meaning}`
          })
        : [
            "Aucune zone de vigilance majeure aux seuils actuels. Restez attentifs aux micro-tensions du quotidien.",
          ],
      blocks: scoring.vigilanceZones.length
        ? [
            {
              type: "callout" as const,
              tone: "alert" as const,
              text: "Vigilance = écart important (≥ 35 pts) ou niveau bas. Ce n’est pas une accusation : c’est un signal pour ralentir, expliquer ce qui diffère, et poser une action datée.",
            },
            ...scoring.vigilanceZones.slice(0, 5).flatMap((d) => {
              const ix = interpretDimension(d, names)
              return [
                { type: "h2" as const, text: `Vigilance — ${d.label}` },
                {
                  type: "scoreChart" as const,
                  label: d.label,
                  scoreA: d.scoreA,
                  scoreB: d.scoreB,
                  nameA: names.nameA,
                  nameB: names.nameB,
                  convergence: d.convergence,
                },
                { type: "paragraph" as const, text: `Ce que mesure cet axe : ${ix.measures}` },
                { type: "paragraph" as const, text: ix.meaning },
                { type: "ol" as const, items: ix.questions },
                { type: "ul" as const, items: ix.actions },
              ]
            }),
          ]
        : [
            {
              type: "paragraph" as const,
              text: "Aucune zone de vigilance majeure aux seuils actuels.",
            },
          ],
    }),
    (() => {
      const profA = profileHighlights(scoring, "A", names)
      return withBlocks({
        id: "profil-a",
        title: `Profil individuel — ${names.nameA}`,
        subtitle: "Hauts · bas · ce que l’autre gagnerait à comprendre",
        paragraphs: profA.narrative,
        blocks: [
          { type: "h2", text: "Points hauts" },
          {
            type: "ul",
            items: profA.highs.map(
              (d) =>
                `${d.label} — ${d.scoreA} % (partenaire ${d.scoreB} %)`
            ),
          },
          { type: "h2", text: "Points plus bas" },
          {
            type: "ul",
            items: profA.lows.map(
              (d) =>
                `${d.label} — ${d.scoreA} % (partenaire ${d.scoreB} %)`
            ),
          },
          ...profA.narrative.map((t) => ({
            type: "paragraph" as const,
            text: t,
          })),
        ],
      })
    })(),
    (() => {
      const profB = profileHighlights(scoring, "B", names)
      return withBlocks({
        id: "profil-b",
        title: `Profil individuel — ${names.nameB}`,
        subtitle: "Hauts · bas · ce que l’autre gagnerait à comprendre",
        paragraphs: profB.narrative,
        blocks: [
          { type: "h2", text: "Points hauts" },
          {
            type: "ul",
            items: profB.highs.map(
              (d) =>
                `${d.label} — ${d.scoreB} % (partenaire ${d.scoreA} %)`
            ),
          },
          { type: "h2", text: "Points plus bas" },
          {
            type: "ul",
            items: profB.lows.map(
              (d) =>
                `${d.label} — ${d.scoreB} % (partenaire ${d.scoreA} %)`
            ),
          },
          ...profB.narrative.map((t) => ({
            type: "paragraph" as const,
            text: t,
          })),
        ],
      })
    })(),
    (() => {
      const top = scoring.priorities.slice(0, 3)
      const patterns = top
        .map((d) => interpretDimension(d, names).conflictPattern)
        .filter(Boolean) as string[]
      return withBlocks({
        id: "dynamique",
        title: "Votre dynamique à deux",
        subtitle: "Motifs de conflit · boucles · réparation",
        paragraphs: [
          "À deux, vous créez un système : ce que l’un fait influence ce que l’autre ressent. Observez le motif qui se répète, pas « qui a tort ».",
          patterns.length
            ? `Sur vos priorités actuelles, les motifs fréquents sont : ${patterns.join(" · ")}`
            : "Peu de motifs de conflit structurants ressortent des écarts majeurs — restez attentifs aux micro-tensions.",
          "La réparation (geste, mot, reprise datée) bat le silence prolongé. Sans réparation, même un petit écart devient une histoire.",
        ],
        blocks: [
          { type: "h2", text: "Motifs liés à vos priorités" },
          {
            type: "ol",
            items: top.length
              ? top.map((d) => {
                  const ix = interpretDimension(d, names)
                  return `${d.label} — ${ix.conflictPattern ?? ix.meaning}`
                })
              : ["Dynamique globalement fluide sur les grands écarts."],
          },
          {
            type: "callout",
            tone: "gold",
            text: "Question de couple : notre façon de résoudre renforce-t-elle la proximité, ou crée-t-elle un gagnant et un perdant ?",
          },
        ],
      })
    })(),
    withBlocks({
      id: "priorites",
      title: "Vos priorités",
      subtitle: "Domaines 1 à 5 — travail concret",
      paragraphs: [
        "Voici les domaines prioritaires issus de vos écarts. Travaillez-les un par un — une priorité tenue vaut dix intentions.",
        ...scoring.priorities.slice(0, 5).map((d, i) => {
          const ix = interpretDimension(d, names)
          return `Priorité ${i + 1} — ${d.label} : ${ix.meaning} Action : ${ix.actions[0]}`
        }),
      ],
      blocks: [
        {
          type: "callout",
          tone: "alert",
          text: "Ces priorités viennent de vos scores (écarts / vigilance), pas d’un jugement moral.",
        },
        ...scoring.priorities.slice(0, 5).flatMap((d, i) => {
          const ix = interpretDimension(d, names)
          return [
            { type: "h2" as const, text: `Priorité ${i + 1} — ${d.label}` },
            {
              type: "scoreChart" as const,
              label: d.label,
              scoreA: d.scoreA,
              scoreB: d.scoreB,
              nameA: names.nameA,
              nameB: names.nameB,
              convergence: d.convergence,
            },
            { type: "paragraph" as const, text: ix.measures },
            { type: "paragraph" as const, text: ix.meaning },
            { type: "ol" as const, items: ix.questions },
            { type: "ul" as const, items: ix.actions },
          ]
        }),
      ],
    }),
    // Chapitres dimension : priorités + vigilances + différences d’abord, puis le reste
    ...[
      ...scoring.priorities,
      ...scoring.vigilanceZones.filter(
        (v) => !scoring.priorities.some((p) => p.dimension === v.dimension)
      ),
      ...scoring.divergences.filter(
        (v) =>
          !scoring.priorities.some((p) => p.dimension === v.dimension) &&
          !scoring.vigilanceZones.some((p) => p.dimension === v.dimension)
      ),
      ...scoring.strengths
        .filter(
          (v) =>
            !scoring.priorities.some((p) => p.dimension === v.dimension) &&
            !scoring.divergences.some((p) => p.dimension === v.dimension)
        )
        .slice(0, 4),
    ]
      .filter(
        (d, i, arr) => arr.findIndex((x) => x.dimension === d.dimension) === i
      )
      .map((d) => dimensionDeepChapter(d, names)),
    withBlocks({
      id: "reco",
      title: "Recommandations",
      subtitle: "Pour toi · pour l’autre · pour le couple",
      paragraphs: [
        `Pour ${names.nameA} : choisissez une demande précise liée à votre priorité n°1, et formulez-la en « j’ai besoin de… » plutôt qu’en reproche.`,
        `Pour ${names.nameB} : pratiquez la reformulation avant la réponse. Être compris précède souvent le fait d’être d’accord.`,
        "Pour le couple : protégez un rendez-vous hebdomadaire court. La régularité bat l’intensité sporadique.",
        "Dans les 7 jours : une conversation structurée de 20 minutes sur la priorité n°1, avec une seule décision concrète à la fin.",
        "Dans les 30 jours : relisez ce dossier ensemble et notez ce qui a réellement bougé — même un peu.",
      ],
      blocks: [
        { type: "h2", text: "Pour chacun" },
        {
          type: "ol",
          items: [
            `${names.nameA} — une demande en « j’ai besoin de… » sur la priorité n°1.`,
            `${names.nameB} — reformuler avant de répondre.`,
            "Le couple — un rendez-vous hebdomadaire court protégé.",
          ],
        },
        { type: "h2", text: "Calendrier" },
        {
          type: "ul",
          items: [
            "7 jours : conversation structurée 20 min + une décision.",
            "30 jours : relire le dossier et noter ce qui a bougé.",
          ],
        },
      ],
    }),
    withBlocks({
      id: "ressources-base",
      title: "Ressources pour poursuivre",
      subtitle: "Garder le dossier vivant",
      paragraphs: [
        "Gardez ce dossier accessible. Relisez d’abord les forces avant les écarts : le moral conditionne la qualité du travail.",
        "Si un sujet déborde (trauma, violence, addiction, détresse), orientez-vous vers un professionnel. Ce bilan n’est pas un diagnostic.",
      ],
    }),
    withBlocks({
      id: "conclusion",
      title: "Conclusion",
      subtitle: "Une action concrète cette semaine",
      paragraphs: [
        `Votre couple n’est pas résumé par un pourcentage. ${names.nameA} et ${names.nameB}, vous repartez avec une lecture plus nette de vos appuis et de vos chantiers.`,
        "La prochaine étape n’est pas de « devenir parfaits », mais de choisir une action concrète cette semaine et de la tenir.",
        "Si certaines zones touchent à la sécurité, à la peur ou à une blessure profonde, un professionnel compétent peut compléter ce bilan. KELYA COUPLE éclaire ; il ne remplace pas un accompagnement clinique ou thérapeutique.",
      ],
    }),
  ]

  const premiumPlusExtras: CoupleReportSection[] = isPremiumPlusOffer(offerId)
    ? buildPremiumPlusDepth(names, scoring).map((s) => withBlocks(s))
    : []

  const exercises = [
    ...buildCoreExercises(scoring.priorities, names),
    ...(isPremiumPlusOffer(offerId) ? buildPremiumExercises() : []),
  ]

  const actionPlan = buildActionPlan(scoring.priorities, names)
  if (isPremiumPlusOffer(offerId)) {
    actionPlan.push({
      order: 4,
      what: "Appliquer le protocole de conversation difficile une fois",
      how: "Utilisez la section Premium Plus dédiée, chronomètre en main.",
      when: "Dans les 14 jours.",
      goal: "Vivre une conversation structurée sans dérive.",
      progressSignal: "Vous avez terminé les 5 étapes du protocole.",
    })
  }

  let safetyNotice: string | null = null
  if (scoring.safetyFlags.includes("limites_securite")) {
    safetyNotice =
      "Certaines réponses touchent à la sécurité relationnelle et au respect des limites. Ce bilan ne pose aucun diagnostic. Si vous vous sentez en danger, diminué(e) ou contrôlé(e), contactez un professionnel compétent ou un service d’écoute adapté à votre contexte. Les exercices de communication ne remplacent pas une mise en sécurité."
  }

  return {
    brand: COUPLE_BRAND,
    tagline: COUPLE_TAGLINE,
    offerId,
    names,
    globalScore: scoring.globalScore,
    scoreInterpretation: interpretation,
    versions: {
      questionnaire_version: COUPLE_QUESTIONNAIRE_VERSION,
      scoring_version: COUPLE_SCORING_VERSION,
      content_version: COUPLE_CONTENT_VERSION,
      report_version: COUPLE_REPORT_VERSION,
      offer: offerId,
      generation_date: generationDate,
    },
    sections,
    exercises,
    actionPlan,
    premiumPlusExtras,
    safetyNotice,
  }
}

export function qaCoupleReport(doc: CoupleReportDocument): {
  ok: boolean
  notes: string[]
} {
  const notes: string[] = []
  if (!doc.names.nameA?.trim() || !doc.names.nameB?.trim()) {
    notes.push("Noms participants manquants")
  }
  if (doc.globalScore < 0 || doc.globalScore > 100) {
    notes.push("Score global hors bornes")
  }
  if (doc.sections.length < 8) notes.push("Sections insuffisantes")
  if (doc.exercises.length < 1) notes.push("Exercices manquants")
  if (doc.actionPlan.length < 1) notes.push("Plan d’action manquant")
  const blob = JSON.stringify(doc)
  if (/TODO|FIXME|placeholder|lorem ipsum/i.test(blob)) {
    notes.push("Placeholders détectés")
  }
  if (isPremiumPlusOffer(doc.offerId) && doc.premiumPlusExtras.length < 1) {
    notes.push("Premium Plus sans ajouts")
  }
  // Interdiction de formulations de condamnation
  if (/incompatibles|condamné|divorce certain|mariage garanti/i.test(blob)) {
    notes.push("Formulation interdite détectée")
  }
  return { ok: notes.length === 0, notes }
}
