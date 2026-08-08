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
  return `Sur « ${d.label} », ${names.nameA} et ${names.nameB} se rejoignent nettement (convergence ${d.convergence} %). Cette proximité est une ressource : elle facilite la confiance et réduit les malentendus. Elle mérite d’être nommée et entretenue — pas considérée comme acquise à jamais.`
}

function differenceParagraph(d: DimensionPairScore, names: CoupleReportNames): string {
  return `Sur « ${d.label} », vos réponses divergent (écart ${d.gap} points). Ce n’est pas une condamnation : c’est une invitation à clarifier ce que chacun vit, attend ou craint. ${names.nameA} se situe autour de ${d.scoreA} %, ${names.nameB} autour de ${d.scoreB} %. L’objectif n’est pas d’effacer la différence, mais de la rendre parlable et travaillable.`
}

/** Chapitre long par dimension — profondeur type modèles EX / 05_MODELES. */
function dimensionDeepChapter(
  d: DimensionPairScore,
  names: CoupleReportNames
): CoupleReportSection {
  const a = names.nameA
  const b = names.nameB
  const statusLine =
    d.status === "convergence"
      ? `Sur cet axe, vos réponses convergent nettement (convergence ${d.convergence} %).`
      : d.status === "vigilance"
        ? `Sur cet axe, une vigilance particulière s’impose (écart ${d.gap} pts, niveaux ${d.scoreA} % / ${d.scoreB} %).`
        : `Sur cet axe, une différence réelle apparaît (écart ${d.gap} pts).`

  const paragraphs = [
    `${statusLine} ${a} se situe autour de ${d.scoreA} %, ${b} autour de ${d.scoreB} %. Ces chiffres ne jugent ni l’amour ni la valeur de chacun : ils décrivent une manière d’habiter le couple aujourd’hui.`,
    `Lorsque le sujet « ${d.label.toLowerCase()} » revient dans votre quotidien, l’un peut avoir l’impression d’être entendu rapidement, tandis que l’autre peut avoir l’impression de devoir trop expliquer — ou l’inverse.`,
    `Pour ${a} : dites votre besoin en « j’ai besoin de… » plutôt qu’en reproche. Pour ${b} : reformulez avant de répondre.`,
    `Piège à éviter : le procès d’intention. Préférez observation + besoin + proposition datée.`,
  ]

  const blocks: CoupleReportBlock[] = [
    {
      type: "scoreChart",
      label: d.label,
      scoreA: d.scoreA,
      scoreB: d.scoreB,
      nameA: a,
      nameB: b,
      convergence: d.convergence,
    },
    { type: "h2", text: "Ce que ça signifie" },
    { type: "paragraph", text: paragraphs[0]! },
    { type: "paragraph", text: paragraphs[1]! },
    { type: "h2", text: "Pour chacun" },
    {
      type: "ol",
      items: [
        `${a} — nommez un besoin précis lié à « ${d.label} ».`,
        `${b} — reformulez ce que vous avez compris avant de répondre.`,
        "Le couple — une seule demande concrète pour les 7 prochains jours.",
      ],
    },
    { type: "h2", text: "À faire cette semaine" },
    {
      type: "ul",
      items: [
        "Choisir un exemple réel des 14 derniers jours sur cet axe.",
        "En parler 3 minutes chacun, sans interruption.",
        "Noter un micro-ajustement daté.",
      ],
    },
    {
      type: "callout",
      tone: "gold",
      text: `Signal de progrès : deux conversations sur « ${d.label} » sans humiliation, avec un ajustement tenu.`,
    },
    {
      type: "fillBlank",
      prompt: `Ce que je voudrais que mon partenaire comprenne sur « ${d.label} » :`,
      lines: 3,
    },
  ]

  return {
    id: `dim-${d.dimension}`,
    title: `${d.label} — lecture croisée`,
    subtitle: "Comprendre · Nommer · Ajuster",
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

function buildCoreExercises(priorities: DimensionPairScore[]): CoupleExercise[] {
  const focus = priorities[0]?.label ?? "la communication"
  return [
    {
      id: "ex-comprendre",
      title: "Ce que j’aimerais que tu comprennes",
      objective: "Mettre des mots précis sur un besoin relationnel sans accuser.",
      why: `Votre bilan met en avant « ${focus} » comme zone prioritaire. Cet exercice crée un cadre sûr pour en parler.`,
      duration: "25–35 minutes",
      preparation:
        "Choisissez un moment calme. Téléphones de côté. Convenez que chacun parle sans être interrompu.",
      steps: [
        "Chacun écrit pendant 8 minutes : « Ce que j’aimerais que tu comprennes sur moi dans notre couple ».",
        "À tour de rôle, lisez votre texte (3 minutes max).",
        "L’autre reformule ce qu’il a compris, sans défendre ni corriger.",
        "Notez ensemble une seule chose concrète à essayer cette semaine.",
      ],
      questions: [
        "Qu’est-ce qui m’a touché(e) dans ce que j’ai entendu ?",
        "Qu’est-ce qui reste encore flou ?",
        "Quelle demande précise puis-je formuler sans attaquer ?",
      ],
      share: "Partagez uniquement ce que vous avez écrit — pas vos hypothèses sur l’autre.",
      debrief:
        "Demandez-vous : ai-je été entendu(e) ? Ai-je écouté sans me justifier trop vite ?",
      takeaway:
        "La compréhension précède la solution. Une demande claire vaut mieux qu’un reproche vague.",
      nextAction:
        "Cette semaine, choisissez une situation réelle et appliquez la même structure (écrire → lire → reformuler).",
      fillPrompts: [
        "Ce que j’aimerais que tu comprennes sur moi :",
        "Ce que j’ai entendu et retenu :",
        "Notre micro-ajustement cette semaine :",
      ],
      rolePlay: {
        title: "Jeu de rôle — reformulation",
        roleA: "Parle 2 minutes de ton besoin (sans accuser).",
        roleB: "Reformule uniquement : « Ce que j’entends, c’est… »",
        scene: "Sujet : un moment récent lié à « " + focus + " ».",
      },
    },
    {
      id: "ex-reparation",
      title: "Réparer après friction",
      objective: "Installer un rituel de réparation après tension.",
      why: "Sans réparation, les écarts s’accumulent même quand l’amour est réel.",
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

function buildActionPlan(priorities: DimensionPairScore[]): CoupleActionStep[] {
  const p1 = priorities[0]?.label ?? "la communication"
  const p2 = priorities[1]?.label ?? "les conflits"
  return [
    {
      order: 1,
      what: `Ouvrir une conversation structurée sur « ${p1} »`,
      how: "Utilisez l’exercice « Ce que j’aimerais que tu comprennes » sans chercher à tout résoudre le même soir.",
      when: "Dans les 7 prochains jours, créneau de 30 minutes bloqué dans vos agendas.",
      goal: "Nommer le sujet sans monter en pression.",
      progressSignal: "Chacun peut reformuler le besoin de l’autre en une phrase exacte.",
    },
    {
      order: 2,
      what: `Installer un micro-rituel lié à « ${p2} »`,
      how: "Choisissez un geste hebdomadaire (check-in de 10 min, marche, prière/partage selon votre cadre).",
      when: "Chaque semaine, jour fixe, pendant 4 semaines.",
      goal: "Créer de la régularité plutôt que des conversations uniquement en crise.",
      progressSignal: "Le rituel a eu lieu au moins 3 semaines sur 4.",
    },
    {
      order: 3,
      what: "Revue de couple à 30 jours",
      how: "Relisez vos priorités du bilan et notez ce qui a bougé (même un peu).",
      when: "J+30 après la lecture du rapport.",
      goal: "Constater le progrès sans attendre la perfection.",
      progressSignal: "Vous pouvez citer 2 changements concrets observés.",
    },
  ]
}

export function buildCoupleReport(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
}): CoupleReportDocument {
  const { offerId, names, scoring } = args
  const interpretation = interpretGlobalScore(scoring.globalScore)
  const generationDate = new Date().toISOString()

  const topDim = scoring.dimensions[0]
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
      subtitle: "Ce qui vous porte déjà",
      paragraphs: scoring.strengths.slice(0, 4).map((d) => forceParagraph(d, names)),
    }),
    withBlocks({
      id: "convergences",
      title: "Vos principales convergences",
      subtitle: "Là où vous vous rejoignez",
      paragraphs: [
        "Les convergences sont les zones où vos réponses se rejoignent. Elles facilitent la coopération et la confiance.",
      ],
      bullets: scoring.convergences.slice(0, 6).map(
        (d) =>
          `${d.label} — convergence ${d.convergence} % (${names.nameA} ${d.scoreA} % · ${names.nameB} ${d.scoreB} %)`
      ),
    }),
    withBlocks({
      id: "differences",
      title: "Vos différences",
      subtitle: "Matière à construire",
      paragraphs:
        scoring.divergences.length > 0
          ? scoring.divergences.slice(0, 4).map((d) => differenceParagraph(d, names))
          : [
              "Peu de divergences marquées ressortent dans cette version. Continuez à vérifier que les accords implicites restent explicites — le silence confortable peut parfois masquer un besoin non dit.",
            ],
    }),
    withBlocks({
      id: "vigilance",
      title: "Zones de vigilance",
      subtitle: "Ralentir · Clarifier · Respecter",
      paragraphs: [
        "Une zone de vigilance n’est pas une accusation. C’est un signal : ici, le couple gagne à ralentir, clarifier et parfois se faire accompagner.",
        ...(scoring.vigilanceZones.length
          ? scoring.vigilanceZones
              .slice(0, 3)
              .map(
                (d) =>
                  `Sur « ${d.label} », l’écart ou le niveau bas (${d.gap} pts d’écart) invite à une conversation honnête et respectueuse.`
              )
          : [
              "Aucune zone de vigilance majeure n’apparaît dans les seuils actuels. Restez attentifs aux micro-tensions du quotidien.",
            ]),
      ],
      blocks: [
        {
          type: "callout",
          tone: "alert",
          text: "Vigilance ≠ accusation. C’est un signal pour ralentir et clarifier.",
        },
        {
          type: "ul",
          items: scoring.vigilanceZones.length
            ? scoring.vigilanceZones.slice(0, 3).map(
                (d) =>
                  `${d.label} — écart ${d.gap} pts (${names.nameA} ${d.scoreA} % · ${names.nameB} ${d.scoreB} %)`
              )
            : ["Aucune zone majeure aux seuils actuels — restez attentifs au quotidien."],
        },
      ],
    }),
    withBlocks({
      id: "profil-a",
      title: `Profil individuel — ${names.nameA}`,
      subtitle: "Ce que vous apportez",
      paragraphs: [
        `${names.nameA}, vos réponses dessinent une manière personnelle d’habiter le couple. Les dimensions où vous vous situez le plus haut sont autant de ressources que vous apportez à la relation.`,
        `Ce que ${names.nameB} gagnerait à comprendre : vos besoins ne sont pas des exigences capricieuses ; ce sont des conditions de sécurité et d’élan. Les nommer clairement aide le couple à cesser de deviner.`,
      ],
    }),
    withBlocks({
      id: "profil-b",
      title: `Profil individuel — ${names.nameB}`,
      subtitle: "Ce que vous apportez",
      paragraphs: [
        `${names.nameB}, votre profil complète celui de ${names.nameA}. Là où vous divergez, il y a souvent une complémentarité possible — à condition de ne pas transformer la différence en procès.`,
        `Ce que ${names.nameA} gagnerait à comprendre : votre façon de réagir (ou de vous taire) a une logique. La rendre visible réduit les malentendus.`,
      ],
    }),
    withBlocks({
      id: "dynamique",
      title: "Votre dynamique à deux",
      subtitle: "Le système que vous créez",
      paragraphs: [
        "À deux, vous créez un système : ce que l’un fait influence ce que l’autre ressent, et inversement. Les cycles relationnels (approche / retrait, critique / défense, silence / pression) naissent souvent de bonnes intentions mal synchronisées.",
        "Observez non pas « qui a tort », mais « quel motif se répète ». C’est ce motif que le plan d’action et les exercices cherchent à assouplir.",
      ],
    }),
    withBlocks({
      id: "priorites",
      title: "Vos priorités",
      subtitle: "Une priorité tenue vaut dix intentions",
      paragraphs: [
        "Travaillez d’abord ce qui a le plus d’impact relationnel, pas tout en même temps. Un couple progresse mieux avec une priorité tenue qu’avec dix intentions abandonnées.",
        "Pour chaque priorité : nommez le besoin, choisissez un micro-ajustement, fixez une date de revue courte.",
      ],
      bullets: scoring.priorities.slice(0, 5).map(
        (d, i) =>
          `Priorité ${i + 1} — ${d.label} : clarifier les attentes, puis pratiquer un micro-ajustement hebdomadaire.`
      ),
    }),
    ...scoring.dimensions.map((d) => dimensionDeepChapter(d, names)),
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
    ...buildCoreExercises(scoring.priorities),
    ...(isPremiumPlusOffer(offerId) ? buildPremiumExercises() : []),
  ]

  const actionPlan = buildActionPlan(scoring.priorities)
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
