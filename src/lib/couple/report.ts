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

export type CoupleReportNames = {
  nameA: string
  nameB: string
}

export type CoupleReportSection = {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
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

  const sections: CoupleReportSection[] = [
    {
      id: "accueil",
      title: "Message d’accueil",
      paragraphs: [
        `${names.nameA} et ${names.nameB}, bienvenue dans votre bilan ${COUPLE_BRAND}.`,
        COUPLE_PROMISE,
        "Ce dossier n’est pas un jugement sur votre avenir. C’est une carte de compréhension : ce qui vous rapproche, ce qui vous différencie, et ce que vous pouvez construire ensemble avec lucidité et bienveillance.",
      ],
    },
    {
      id: "lire",
      title: "Comment lire ce bilan",
      paragraphs: [
        "Lisez d’abord la synthèse et le score global comme un indicateur de dynamique, pas comme une note définitive.",
        "Ensuite, explorez vos forces et convergences — ce sont vos ressources. Puis abordez différences et zones de vigilance comme des sujets de travail, jamais comme des preuves d’échec.",
        "Les exercices et le plan d’action transforment l’analyse en pratique. Un bilan sans mise en mouvement reste une information ; avec pratique, il devient un levier.",
      ],
    },
    {
      id: "synthese",
      title: "Synthèse de votre couple",
      paragraphs: [
        `Votre score global s’établit à ${scoring.globalScore} %. ${interpretation.paragraph}`,
        scoring.strengths.length
          ? `Parmi vos appuis les plus clairs : ${dimList(scoring.strengths)}.`
          : "Vos réponses dessinent un profil nuancé, à lire dimension par dimension.",
        scoring.priorities.length
          ? `Les priorités de travail les plus utiles aujourd’hui concernent notamment : ${dimList(scoring.priorities)}.`
          : "Peu d’écarts majeurs ressortent ; le travail consistera surtout à entretenir et approfondir.",
      ],
    },
    {
      id: "score",
      title: "Votre score global",
      paragraphs: [
        `Score : ${scoring.globalScore} % — ${interpretation.title}`,
        interpretation.paragraph,
        "Rappel essentiel : un score bas n’écrit pas « vous êtes incompatibles ». Un score élevé n’écrit pas « vous n’avez rien à travailler ».",
      ],
    },
    {
      id: "forces",
      title: "Vos grandes forces",
      paragraphs: scoring.strengths.slice(0, 4).map((d) => forceParagraph(d, names)),
    },
    {
      id: "convergences",
      title: "Vos principales convergences",
      paragraphs: [
        "Les convergences sont les zones où vos réponses se rejoignent. Elles facilitent la coopération et la confiance.",
      ],
      bullets: scoring.convergences.slice(0, 6).map(
        (d) =>
          `${d.label} — convergence ${d.convergence} % (${names.nameA} ${d.scoreA} % · ${names.nameB} ${d.scoreB} %)`
      ),
    },
    {
      id: "differences",
      title: "Vos différences",
      paragraphs:
        scoring.divergences.length > 0
          ? scoring.divergences.slice(0, 4).map((d) => differenceParagraph(d, names))
          : [
              "Peu de divergences marquées ressortent dans cette version. Continuez à vérifier que les accords implicites restent explicites — le silence confortable peut parfois masquer un besoin non dit.",
            ],
    },
    {
      id: "vigilance",
      title: "Zones de vigilance",
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
    },
    {
      id: "profil-a",
      title: `Profil individuel — ${names.nameA}`,
      paragraphs: [
        `${names.nameA}, vos réponses dessinent une manière personnelle d’habiter le couple. Les dimensions où vous vous situez le plus haut sont autant de ressources que vous apportez à la relation.`,
        `Ce que ${names.nameB} gagnerait à comprendre : vos besoins ne sont pas des exigences capricieuses ; ce sont des conditions de sécurité et d’élan. Les nommer clairement aide le couple à cesser de deviner.`,
      ],
    },
    {
      id: "profil-b",
      title: `Profil individuel — ${names.nameB}`,
      paragraphs: [
        `${names.nameB}, votre profil complète celui de ${names.nameA}. Là où vous divergez, il y a souvent une complémentarité possible — à condition de ne pas transformer la différence en procès.`,
        `Ce que ${names.nameA} gagnerait à comprendre : votre façon de réagir (ou de vous taire) a une logique. La rendre visible réduit les malentendus.`,
      ],
    },
    {
      id: "dynamique",
      title: "Votre dynamique à deux",
      paragraphs: [
        "À deux, vous créez un système : ce que l’un fait influence ce que l’autre ressent, et inversement. Les cycles relationnels (approche / retrait, critique / défense, silence / pression) naissent souvent de bonnes intentions mal synchronisées.",
        "Observez non pas « qui a tort », mais « quel motif se répète ». C’est ce motif que le plan d’action et les exercices cherchent à assouplir.",
      ],
    },
    {
      id: "priorites",
      title: "Vos priorités",
      paragraphs: [
        "Travaillez d’abord ce qui a le plus d’impact relationnel, pas tout en même temps.",
      ],
      bullets: scoring.priorities.slice(0, 5).map(
        (d, i) =>
          `Priorité ${i + 1} — ${d.label} : clarifier les attentes, puis pratiquer un micro-ajustement hebdomadaire.`
      ),
    },
    {
      id: "reco",
      title: "Recommandations",
      paragraphs: [
        `Pour ${names.nameA} : choisissez une demande précise liée à votre priorité n°1, et formulez-la en « j’ai besoin de… » plutôt qu’en reproche.`,
        `Pour ${names.nameB} : pratiquez la reformulation avant la réponse. Être compris précède souvent le fait d’être d’accord.`,
        "Pour le couple : protégez un rendez-vous hebdomadaire court. La régularité bat l’intensité sporadique.",
      ],
    },
    {
      id: "conclusion",
      title: "Conclusion",
      paragraphs: [
        `Votre couple n’est pas résumé par un pourcentage. ${names.nameA} et ${names.nameB}, vous repartez avec une lecture plus nette de vos appuis et de vos chantiers.`,
        "La prochaine étape n’est pas de « devenir parfaits », mais de choisir une action concrète cette semaine et de la tenir.",
        "Si certaines zones touchent à la sécurité, à la peur ou à une blessure profonde, un professionnel compétent peut compléter ce bilan. KELYA COUPLE éclaire ; il ne remplace pas un accompagnement clinique ou thérapeutique.",
      ],
    },
  ]

  const premiumPlusExtras: CoupleReportSection[] = isPremiumPlusOffer(offerId)
    ? [
        {
          id: "pp-dynamique",
          title: "Analyse approfondie des dynamiques (Premium Plus)",
          paragraphs: [
            "Au-delà des scores, observez le « qui initie / qui reçoit / qui répare ». Souvent, l’un porte la conversation difficile pendant que l’autre porte le calme apparent. Nommer ces rôles permet de les répartir autrement.",
            "Scénario de travail : pendant 14 jours, inversez volontairement une habitude (celui qui parle peu initie une fois ; celui qui presse ralentit une fois). Notez ce qui change dans le climat.",
          ],
        },
        {
          id: "pp-charte",
          title: "Charte relationnelle (Premium Plus)",
          paragraphs: [
            "Rédigez ensemble une charte courte en 5 engagements : respect en désaccord, signal de pause, réparation sous 24 h, décisions financières à partir d’un seuil, et un rituel de rejoicing (ce qui a bien marché cette semaine).",
            "La charte n’est pas un contrat juridique : c’est un rappel visible de ce que vous choisissez d’être l’un pour l’autre.",
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
          id: "pp-protocole",
          title: "Protocole de conversation difficile (Premium Plus)",
          paragraphs: [
            "1) Cadre (2 min) : sujet unique, durée, pas d’interrupteurs. 2) Tour A puis tour B (5 min chacun). 3) Reformulation croisée. 4) Une demande concrète chacun. 5) Un micro-engagement daté.",
            "Si la tension monte : pause de 20 minutes minimum, puis reprise du protocole — pas reprise du combat.",
          ],
        },
      ]
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
