/**
 * Composition Premium — assemble le spine maître + harmonisation (Directive).
 * couple_essential = bilan Premium ; couple_premium_plus = Premium + modules PP.
 */

import {
  COUPLE_BRAND,
  COUPLE_CONTENT_VERSION,
  COUPLE_QUESTIONNAIRE_VERSION,
  COUPLE_REPORT_VERSION,
  COUPLE_SCORING_VERSION,
  COUPLE_TAGLINE,
} from "@/lib/couple/config"
import { isPremiumPlusOffer, type CoupleOfferId } from "@/lib/couple/offers"
import {
  interpretGlobalScore,
  type CoupleScoringResult,
} from "@/lib/couple/scoring"
import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import {
  interpretDimension,
  profileHighlights,
} from "@/lib/couple/interpretations"
import { scrubAiFiller } from "@/lib/couple/engine/charter"
import type { EngineResult, SelectedResource } from "@/lib/couple/engine/types"
import type {
  CoupleActionStep,
  CoupleExercise,
  CoupleReportDocument,
  CoupleReportNames,
  CoupleReportSection,
} from "@/lib/couple/report"
import {
  callout,
  chapter,
  conclusionPart,
  fill,
  h2,
  harmonizeReport,
  ol,
  p,
  scoreChart,
  selectPremiumPlusModules,
  ul,
  welcomeParagraphs,
  howToReadParagraphs,
  regardParagraphs,
} from "@/lib/couple/engine/masters"
import type { DifferenceChapter, HarmonizedPlan } from "@/lib/couple/engine/masters"

function section(
  id: string,
  title: string,
  subtitle: string | undefined,
  paragraphs: string[],
  blocks?: CoupleReportBlock[]
): CoupleReportSection {
  return {
    id,
    title,
    subtitle,
    paragraphs: paragraphs.map(scrubAiFiller),
    blocks,
  }
}

function resourceToExercise(
  sel: SelectedResource,
  names: CoupleReportNames
): CoupleExercise {
  const r = sel.resource
  return {
    id: r.id,
    title: r.title,
    objective: r.objective,
    why: sel.adaptedWhy,
    duration: r.duration,
    preparation: "Choisissez un moment calme. Téléphones de côté.",
    steps: sel.adaptedSteps,
    questions: sel.adaptedQuestions,
    share: "Partagez ce que vous avez écrit ou vécu — pas vos hypothèses sur l’autre.",
    debrief: "Ai-je été entendu(e) ? Ai-je écouté sans me justifier trop vite ?",
    takeaway: r.objective,
    nextAction:
      sel.adaptedSteps[sel.adaptedSteps.length - 1] ??
      "Revenez à ce sujet dans 7 jours.",
    premiumPlus: r.premiumPlus,
    fillPrompts: sel.adaptedQuestions.slice(0, 3),
    rolePlay:
      r.format === "exercice"
        ? {
            title: `Jeu de rôle — ${r.title}`,
            roleA: `${names.nameA} : exprime ton vécu en « je » (90 secondes).`,
            roleB: `${names.nameB} : reformule uniquement ce que tu as entendu.`,
            scene: r.why,
          }
        : undefined,
  }
}

function differenceToBlocks(
  d: DifferenceChapter,
  names: CoupleReportNames
): CoupleReportBlock[] {
  return chapter([
    scoreChart({
      label: d.card.label,
      scoreA: d.card.scoreA,
      scoreB: d.card.scoreB,
      nameA: names.nameA,
      nameB: names.nameB,
      convergence: d.card.convergence,
    }),
    ...d.analysis.map((t) => p(t)),
    h2(d.exerciseTitle),
    p(d.exerciseSubtitle),
    ol(d.exerciseSteps),
    ...d.fillPrompts.map((prompt) => fill(prompt)),
    ...conclusionPart(d.conclusion),
  ])
}

function differenceToExercise(
  d: DifferenceChapter,
  names: CoupleReportNames
): CoupleExercise {
  return {
    id: `ex-diff-${d.card.dimension}`,
    title: d.exerciseTitle,
    objective: `Clarifier « ${d.card.label} » à partir de vos résultats réels.`,
    why: d.analysis[0] ?? d.conclusion,
    duration: "30–45 min",
    preparation: "Chacun répond d’abord seul, puis vous partagez.",
    steps: d.exerciseSteps,
    questions: d.fillPrompts,
    share: "Reformulez avant d’argumenter.",
    debrief: "Qu’avez-vous appris sur le besoin derrière la position de l’autre ?",
    takeaway: d.conclusion,
    nextAction: d.conclusion,
    fillPrompts: d.fillPrompts,
    rolePlay: {
      title: `Échange guidé — ${d.card.label}`,
      roleA: `${names.nameA} : ce que tu cherches à protéger sur ce sujet.`,
      roleB: `${names.nameB} : ce dont tu as besoin pour te sentir entendu(e).`,
      scene: d.subtitle,
    },
  }
}

function buildActionPlan(
  plan: HarmonizedPlan,
  names: CoupleReportNames
): CoupleActionStep[] {
  const steps: CoupleActionStep[] = plan.differenceChapters.map((d, i) => ({
    order: i + 1,
    what: `Ensemble — Priorité ${d.rank} : ${d.card.label}`,
    how: d.conclusion,
    when: i === 0 ? "Cette semaine" : "Prochaines 2 semaines",
    goal: `Rendre explicite le besoin de chacun sur « ${d.card.label} ».`,
    progressSignal: "Une règle ou une date de revue écrite à deux.",
  }))
  steps.push({
    order: steps.length + 1,
    what: `Individuel — ${plan.securizerName}`,
    how: "Transformer « pas encore » en conditions concrètes et partageables.",
    when: "Cette semaine",
    goal: "3 conditions écrites, dont 1 indispensable.",
    progressSignal: "Conditions montrées au partenaire.",
  })
  steps.push({
    order: steps.length + 1,
    what: `Individuel — ${plan.advancerName}`,
    how: "Transformer « il faut avancer » en première étape concrète et datée.",
    when: "Cette semaine",
    goal: "1 micro-étape qui prouve que le projet existe.",
    progressSignal: "Micro-étape proposée sans pression.",
  })
  steps.push({
    order: steps.length + 1,
    what: "À discuter — règle de communication",
    how: "« Nous pouvons prendre du temps sans laisser l’autre dans le flou. »",
    when: "Lors du prochain rendez-vous de couple",
    goal: "Signal de pause + date de reprise.",
    progressSignal: "Règle notée sur la charte.",
  })
  return steps
}

function buildPremiumPlusExtras(
  names: CoupleReportNames,
  plan: HarmonizedPlan,
  engine: EngineResult
): CoupleReportSection[] {
  const mods = selectPremiumPlusModules({ engine, plan, max: 5 })
  return mods.map((m, i) =>
    section(
      m.id,
      m.title,
      m.subtitle,
      [
        `Module Premium Plus ${i + 1} — sélectionné pour votre dynamique (${plan.securizerName} / ${plan.advancerName}) et vos priorités.`,
      ],
      m.blocks(names, plan.securizerName, plan.advancerName)
    )
  )
}

function portraitBlocks(
  seat: "A" | "B",
  names: CoupleReportNames,
  scoring: CoupleScoringResult,
  plan: HarmonizedPlan
): { title: string; subtitle: string; paragraphs: string[]; blocks: CoupleReportBlock[] } {
  const me = seat === "A" ? names.nameA : names.nameB
  const other = seat === "A" ? names.nameB : names.nameA
  const role = seat === "A" ? plan.roleA : plan.roleB
  const prof = profileHighlights(scoring, seat, names)

  const roleLine =
    role === "securizer"
      ? `${me}, vos résultats font souvent ressortir un besoin de sécurité, de préparation et de maîtrise avant certaines décisions. Ce n’est pas une volonté de ralentir pour ralentir : c’est souvent une manière de protéger ce que vous construisez.`
      : role === "advancer"
        ? `${me}, vos résultats font souvent ressortir une orientation forte vers la concrétisation et le mouvement du projet commun. Savoir que le projet existe peut ne pas suffire : vous avez besoin de voir qu’il avance.`
        : `${me}, votre profil ne se réduit pas à un seul pôle : vous combinez des besoins de sécurité et de mouvement selon les sujets.`

  const paragraphs = [
    `Portrait de ${me} — ce que ce bilan révèle de vous dans le couple (pas un diagnostic).`,
    roleLine,
    ...prof.narrative.slice(0, 6),
    `Ce que ${other} gagnerait à comprendre : vos scores élevés ne sont pas des exigences capricieuses ; vos scores plus bas ne sont pas du désintérêt. Derrière chaque chiffre, il y a un besoin. Le nommer change le climat.`,
  ]

  const subtitle =
    role === "securizer"
      ? "Une recherche importante de sécurité, de stabilité et de maîtrise"
      : role === "advancer"
        ? "Une projection forte vers le couple et les prochaines étapes"
        : "Un profil à lire sujet par sujet"

  return {
    title: `Le profil de ${me}`,
    subtitle,
    paragraphs,
    blocks: chapter([
      h2("Ce que vos résultats mettent en lumière"),
      ...paragraphs.slice(1).map((t) => p(t)),
      h2("Ce que vos résultats vous invitent à préserver"),
      ul(
        prof.highs.map((d) => {
          const score = seat === "A" ? d.scoreA : d.scoreB
          return `${d.label} (${score} %) — ${interpretDimension(d, names).meaning}`
        })
      ),
      h2("Zones plus sensibles"),
      ul(
        prof.lows.map((d) => {
          const score = seat === "A" ? d.scoreA : d.scoreB
          return `${d.label} (${score} %) — à clarifier sans jugement`
        })
      ),
    ]),
  }
}

export function composeCoupleReport(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
  engine: EngineResult
}): CoupleReportDocument {
  const { offerId, names, scoring, engine } = args
  const interpretation = interpretGlobalScore(scoring.globalScore)
  const plan = harmonizeReport({
    engine,
    names,
    globalScore: scoring.globalScore,
  })

  const voice = {
    nameA: names.nameA,
    nameB: names.nameB,
    globalScore: scoring.globalScore,
    scoreTitle: interpretation.title,
    contextLabel: plan.contextLabel,
    dynamicsTitle: plan.dynamicsTitle,
    dynamicsBody: plan.dynamicsBody,
    forceLabels: plan.forceCards.map((c) => c.label),
    priorityLabels: plan.differenceChapters.map((d) => d.card.label),
    securizerName: plan.securizerName,
    advancerName: plan.advancerName,
  }

  const profA = portraitBlocks("A", names, scoring, plan)
  const profB = portraitBlocks("B", names, scoring, plan)

  const welcome = welcomeParagraphs(voice)
  const howTo = howToReadParagraphs(voice)
  const regard = regardParagraphs(voice)

  const sections: CoupleReportSection[] = [
    section(
      "accueil",
      "Bienvenue dans votre bilan",
      "Votre histoire compte, mais votre avenir mérite aussi d’être clarifié",
      welcome,
      chapter([
        h2("Votre histoire compte, mais votre avenir mérite aussi d’être clarifié"),
        ...welcome.map((t) => p(t)),
        callout(
          "Ce bilan n’est ni un diagnostic clinique ni un verdict d’avenir. C’est une carte de travail.",
          "info"
        ),
      ])
    ),
    section(
      "lire",
      "Comment lire votre rapport",
      "Prenez le temps de vous découvrir autrement",
      howTo,
      chapter([
        h2("Prenez le temps de vous découvrir autrement"),
        ...howTo.map((t) => p(t)),
        ol([
          "Lire les portraits sans se défendre",
          "Identifier d’abord les forces",
          "Puis les différences et priorités",
          "Faire les exercices — une chose à la fois",
        ]),
      ])
    ),
    section(
      "regard",
      "Votre couple en un regard",
      interpretation.title,
      regard,
      chapter([
        h2("Une base commune, avec des différences à comprendre"),
        ...regard.map((t) => p(t)),
        h2("Vos principaux points de convergence"),
        ul(
          plan.forceCards.map(
            (c) =>
              `${c.label} : ${names.nameA} ${c.scoreA} % / ${names.nameB} ${c.scoreB} %`
          )
        ),
        h2("Vos principaux points d’attention"),
        ul(
          plan.differenceChapters.map(
            (d) =>
              `${d.card.label} : ${names.nameA} ${d.card.scoreA} % / ${names.nameB} ${d.card.scoreB} %`
          )
        ),
        callout(
          `Score global ${scoring.globalScore} % — indicateur de dynamique, jamais une note d’amour.`,
          "gold"
        ),
      ])
    ),
    section("profil-a", profA.title, profA.subtitle, profA.paragraphs, profA.blocks),
    section("profil-b", profB.title, profB.subtitle, profB.paragraphs, profB.blocks),
    section(
      "croisement",
      "Ce qui se passe lorsque vos deux profils se rencontrent",
      plan.dynamicsTitle.replace("Votre dynamique centrale : ", ""),
      plan.dynamicsBody,
      chapter([
        h2(plan.dynamicsTitle),
        ...plan.dynamicsBody.map((t) => p(t)),
        ...conclusionPart(
          `La question utile n’est pas « qui doit changer ? » mais « comment avancer sans sacrifier ce dont ${plan.securizerName} et ${plan.advancerName} ont réellement besoin ? ».`
        ),
      ])
    ),
    section(
      "communication",
      "Votre manière de communiquer",
      "Quand deux personnes parlent, elles ne cherchent pas toujours la même chose",
      plan.communicationNote,
      chapter([
        h2("Quand deux personnes parlent, elles ne cherchent pas toujours la même chose"),
        ...plan.communicationNote.map((t) => p(t)),
        h2(`Ce que ${names.nameA} peut apporter`),
        p(
          plan.roleA === "securizer"
            ? `${names.nameA}, votre besoin de réflexion est une force s’il est accompagné d’un repère concret : pourquoi vous avez besoin de temps, et quand vous revenez.`
            : `${names.nameA}, votre capacité à chercher de la clarté est une ressource si elle laisse aussi un espace à l’autre pour construire sa réponse.`
        ),
        h2(`Ce que ${names.nameB} peut apporter`),
        p(
          plan.roleB === "securizer"
            ? `${names.nameB}, votre besoin de réflexion est une force s’il est accompagné d’un repère concret : pourquoi vous avez besoin de temps, et quand vous revenez.`
            : `${names.nameB}, votre capacité à chercher de la clarté est une ressource si elle laisse aussi un espace à l’autre pour construire sa réponse.`
        ),
        h2("Votre règle de communication"),
        callout(
          "« Nous pouvons prendre du temps sans laisser l’autre dans le flou. »",
          "gold"
        ),
        fill("Lorsque l’un de nous a besoin de temps, nous nous engageons à…"),
        fill("Lorsque l’un de nous a besoin d’une clarification, nous nous engageons à…"),
        ...conclusionPart(
          "Votre prochaine étape n’est pas de parler davantage. C’est de mieux comprendre ce que chacun essaie de protéger lorsqu’il parle, insiste ou demande du temps."
        ),
      ])
    ),
    section(
      "desaccords",
      "Lorsque vous n’êtes pas d’accord",
      "La manière dont vous traversez vos désaccords",
      plan.disagreementNote,
      chapter([
        h2("Ce qui peut se passer entre vous"),
        ...plan.disagreementNote.map((t) => p(t)),
        ...conclusionPart(
          "Revenez au sujet et au besoin. Laissez de côté le procès d’intention le temps d’une conversation structurée."
        ),
      ])
    ),
    section(
      "forces",
      "Vos forces",
      "Ce qui vous porte déjà",
      plan.forceCards.map((c) => interpretDimension(c.pair, names).meaning),
      chapter([
        h2("Ce qui vous porte déjà"),
        callout(
          "Convergence = alignement de vos réponses sur un axe. Ce n’est ni une note d’amour ni une garantie.",
          "info"
        ),
        ...plan.forceCards.flatMap((c) => {
          const ix = interpretDimension(c.pair, names)
          return [
            h2(c.label),
            scoreChart({
              label: c.label,
              scoreA: c.scoreA,
              scoreB: c.scoreB,
              nameA: names.nameA,
              nameB: names.nameB,
              convergence: c.convergence,
            }),
            p(ix.meaning),
            p(`Pour préserver cette force : ${ix.actions[0] ?? "La nommer à voix haute cette semaine."}`),
          ]
        }),
      ])
    ),
  ]

  // Grandes différences — uniquement celles sélectionnées (max 3)
  for (const d of plan.differenceChapters) {
    sections.push(
      section(
        `diff-${d.rank}`,
        d.title,
        d.subtitle,
        d.analysis,
        differenceToBlocks(d, names)
      )
    )
  }

  sections.push(
    section(
      "dynamique-phrase",
      "Votre dynamique en une phrase",
      "Le fil rouge de votre bilan",
      [plan.dynamicsOneLiner],
      chapter([
        h2("Le fil rouge"),
        callout(plan.dynamicsOneLiner, "gold"),
        p(
          "Gardez cette phrase visible pendant vos prochaines conversations importantes. Elle rappelle que vous pouvez défendre le même foyer avec des outils différents."
        ),
      ])
    ),
    section(
      "plan",
      "Votre plan d’action Premium",
      "Ensemble · Individuel · À discuter · À observer",
      buildActionPlan(plan, names).map(
        (s) => `${s.what} — ${s.how} (${s.when})`
      ),
      chapter([
        h2("Cette semaine / prochaines semaines"),
        ol(
          buildActionPlan(plan, names).map(
            (s) => `${s.what} : ${s.how} — ${s.when}. Signal : ${s.progressSignal}`
          )
        ),
      ])
    ),
    section(
      "suivi",
      "Votre outil de suivi",
      "Garder le fil sans vous surcharger",
      [
        "Notez une fois par semaine : ce qui a été clarifié, ce qui reste flou, une micro-victoire.",
      ],
      chapter([
        h2("Check-in 7 jours"),
        fill("Cette semaine, nous avons clarifié…"),
        fill("Ce qui reste encore flou…"),
        fill("Une micro-victoire à reconnaître…"),
        h2("Check-in 21 jours"),
        fill("Sur la priorité n°1, qu’est-ce qui a réellement changé ?"),
        fill("Quelle règle tenons-nous vraiment ?"),
      ])
    ),
    section(
      "carte-relationnelle",
      "Votre carte relationnelle",
      "Synthèse finale de votre bilan Premium",
      plan.relationalCardBullets,
      chapter([
        h2("Synthèse"),
        ul(plan.relationalCardBullets),
        callout(
          "Cette carte n’est pas un jugement. C’est un rappel de ce qui vous unit et de ce que vous avez choisi de travailler.",
          "info"
        ),
      ])
    ),
    section(
      "conclusion",
      "Conclusion de votre bilan Premium",
      "Voir · Choisir · Agir",
      [
        `Voir — ${plan.dynamicsOneLiner}`,
        `Choisir — Priorité n°1 : ${plan.differenceChapters[0]?.card.label ?? "entretenir une force"}`,
        `Agir — ${plan.differenceChapters[0]?.conclusion ?? "Un check-in de 15 minutes à deux."}`,
      ],
      chapter([
        h2("Ce que vous devez retenir"),
        p(
          `${names.nameA} et ${names.nameB}, vous n’avez pas besoin de reconstruire votre relation depuis zéro. Vous avez des appuis. Votre travail consiste à utiliser ce qui fonctionne déjà pour mieux traverser ce qui vous différencie.`
        ),
        h2("Voir · Choisir · Agir"),
        ol([
          `Voir — ${plan.dynamicsOneLiner}`,
          `Choisir — ${plan.differenceChapters[0]?.card.label ?? "Une force à cultiver"}`,
          `Agir — ${plan.differenceChapters[0]?.conclusion ?? "Check-in 15 min"}`,
        ]),
        h2("Notre premier engagement"),
        fill("Nous nous engageons, dans les 14 prochains jours, à…"),
      ])
    )
  )

  const premiumPlusExtras = isPremiumPlusOffer(offerId)
    ? buildPremiumPlusExtras(names, plan, engine)
    : []

  // Exercices = grandes différences (+ ressources catalogue liées)
  const exercises: CoupleExercise[] = [
    ...plan.differenceChapters.map((d) => differenceToExercise(d, names)),
  ]
  const fromCatalog = engine.selectedResources
    .filter(
      (s) =>
        s.resource.format === "exercice" || s.resource.format === "protocole"
    )
    .slice(0, isPremiumPlusOffer(offerId) ? 3 : 2)
    .map((s) => resourceToExercise(s, names))
  for (const ex of fromCatalog) {
    if (!exercises.find((e) => e.id === ex.id)) exercises.push(ex)
  }

  const actionPlan = buildActionPlan(plan, names)
  if (isPremiumPlusOffer(offerId)) {
    actionPlan.push({
      order: actionPlan.length + 1,
      what: "Premium Plus — appliquer un protocole de décision une fois",
      how: "Utiliser le module « Une décision en 30 minutes » si sélectionné.",
      when: "Dans les 14 jours.",
      goal: "Terminer les étapes sans humiliation.",
      progressSignal: "Protocole complété et décision écrite.",
    })
  }

  let safetyNotice: string | null = null
  if (scoring.safetyFlags.includes("limites_securite")) {
    safetyNotice =
      "Certaines réponses touchent à la sécurité relationnelle et au respect des limites. Ce bilan ne pose aucun diagnostic. Si vous vous sentez en danger, diminué(e) ou contrôlé(e), contactez un professionnel compétent. Les exercices de communication ne remplacent pas une mise en sécurité."
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
      generation_date: new Date().toISOString(),
    },
    sections,
    exercises,
    actionPlan,
    premiumPlusExtras,
    safetyNotice,
  }
}
