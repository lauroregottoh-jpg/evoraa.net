/**
 * Rapport vivant Alliance — assemblé depuis le pack RAPPORT PERSONNALISE.
 * Structure calquée sur 32-1 (incomplet) et 33-1 (complet).
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import type { ProfileReport, ProfileReportTip } from "@/lib/matching/report/types"
import { buildProfileReport } from "@/lib/matching/report/buildProfileReport"
import {
  ESSENTIAL_ASSESSMENTS,
  PERSONALIZED_ASSESSMENTS,
  type PersonalizedAssessment,
  type PersonalizedAssessmentId,
} from "@/lib/rapport/personalized/assessments.catalog"
import {
  REPORT_CHAPTERS,
  type ReportChapterId,
} from "@/lib/rapport/personalized/chapters"
import { computePillarScores, rankedPillars } from "@/lib/rapport/pillarScores"
import type { ReportPillarId } from "@/lib/rapport/pillars"
import { REPORT_COPY } from "@/lib/rapport/personalized/copyLibrary"
import {
  insightPackFor,
  type InsightCard,
} from "@/lib/rapport/personalized/insightCards"
import {
  buildSampleForceCards,
  buildSampleVigilanceCards,
  composeConclusion,
  composePlanIntro,
  composePortraitNarrativeV2,
  composeStatusSection,
  composeSummaryNarrative,
  composeUnlockedChapterSections,
  composeWelcome,
  PENDING_CHAPTER_COPY,
  preparationBandCopy,
  reportDocumentMode,
  starsFromScore,
  type ReportDocumentMode,
} from "@/lib/rapport/personalized/reportNarratives"

type Psychometric = {
  personality?: number | null
  spiritual?: number | null
  relationship?: number | null
  couple_life?: number | null
  finances?: number | null
  dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>> | null
} | null

export type AssessmentCardState =
  | "available"
  | "done"
  | "locked"
  | "premium_plus"

export type AssessmentCardView = PersonalizedAssessment & {
  state: AssessmentCardState
  score: number | null
  href: string | null
}

export type LivingChapter = {
  id: ReportChapterId
  page: number
  title: string
  teaser: string
  unlocked: boolean
  body?: string
  bullets?: string[]
  tips?: ProfileReportTip[]
  unlockHint?: string
  unlockHref?: string
  unlockActions?: { label: string; href: string }[]
  insightCards?: InsightCard[]
  sections?: { heading: string; body: string }[]
  durationHint?: string
}

export type ReportGlance = {
  stars: string
  score: number
  narrative: string
  forceLabels: string[]
  priorities: string[]
}

export type ReportStatusBlock = {
  intro: string
  included: string[]
  remaining: string[]
}

export type ReportNextStep = {
  title: string
  href: string
  why: string[]
  completenessNote: string
}

export type LivingPersonalizedReport = {
  base: ProfileReport
  generatedAt: string
  documentMode: ReportDocumentMode
  versionLabel: string
  confidentialLabel: string
  indexLabel: string
  completenessPercent: number
  globalIndex: number | null
  testsCompleted: number
  testsRemaining: number
  essentialsTotal: number
  welcomeBody: string
  statusBlock: ReportStatusBlock | null
  glance: ReportGlance | null
  nextStep: ReportNextStep | null
  chapters: LivingChapter[]
  cards: AssessmentCardView[]
  nextUnlock: { title: string; href: string; chapterTitle: string } | null
}

function slugScore(
  psych: Psychometric,
  slug: AssessmentSlug
): number | null {
  const v = psych?.[slug]
  return typeof v === "number" ? Math.round(v) : null
}

function isAssessmentDone(
  a: PersonalizedAssessment,
  psych: Psychometric
): boolean {
  if (!a.sourceSlug) return false
  if (slugScore(psych, a.sourceSlug) == null) return false
  if (!a.sourceDimensions?.length) return true
  const dims = psych?.dimensions?.[a.sourceSlug]
  if (!dims) return true
  return a.sourceDimensions.some((d) => typeof dims[d] === "number")
}

function averageCompletedScores(psych: Psychometric): number | null {
  const scores = (
    ["personality", "spiritual", "relationship", "couple_life", "finances"] as AssessmentSlug[]
  )
    .map((s) => slugScore(psych, s))
    .filter((n): n is number => n != null)
  if (!scores.length) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

function tipsForChapter(
  chapterId: ReportChapterId,
  tips: ProfileReportTip[]
): ProfileReportTip[] {
  const map: Partial<Record<ReportChapterId, string[]>> = {
    communication: ["relationnel"],
    conflits: ["relationnel"],
    intelligence_emotionnelle: ["humain", "relationnel"],
    valeurs: ["valeurs"],
    vision_mariage: ["projets_de_vie"],
    projet_de_vie: ["projets_de_vie"],
    finances: ["valeurs", "projets_de_vie"],
    spiritualite: ["spirituel"],
    forces: ["relationnel", "spirituel", "humain", "valeurs", "projets_de_vie"],
    vigilances: ["relationnel", "spirituel", "humain", "valeurs", "projets_de_vie"],
    plan: ["relationnel", "spirituel", "humain", "valeurs", "projets_de_vie"],
  }
  const pillars = map[chapterId]
  if (!pillars) return []
  return tips.filter(
    (t) => t.reportPillarId && pillars.includes(t.reportPillarId)
  )
}

function unlockAssessment(
  chapterUnlockedBy: PersonalizedAssessmentId[],
  doneIds: Set<PersonalizedAssessmentId>
): PersonalizedAssessment | undefined {
  for (const id of chapterUnlockedBy) {
    if (!doneIds.has(id)) {
      return PERSONALIZED_ASSESSMENTS.find((a) => a.id === id)
    }
  }
  return undefined
}

const REMAINING_DIM_LABELS: Partial<Record<PersonalizedAssessmentId, string>> = {
  communication: "votre manière de communiquer",
  conflits: "votre gestion des conflits",
  vision_mariage: "votre vision du mariage",
  finances: "votre rapport aux finances",
  valeurs: "vos valeurs fondamentales",
  projet_de_vie: "votre projet de vie",
  spiritualite: "votre fonctionnement spirituel",
  intelligence_emotionnelle: "votre intelligence émotionnelle",
  personnalite: "votre personnalité relationnelle",
  famille: "votre vision de la famille",
}

export function buildLivingPersonalizedReport(input: {
  firstName?: string | null
  psychometric: Psychometric
  isAlliance: boolean
  isSovereign?: boolean
}): LivingPersonalizedReport {
  const base = buildProfileReport({
    firstName: input.firstName,
    psychometric: input.psychometric,
    isAlliance: input.isAlliance,
    isSovereign: input.isSovereign,
  })

  const doneIds = new Set<PersonalizedAssessmentId>()
  for (const a of PERSONALIZED_ASSESSMENTS) {
    if (isAssessmentDone(a, input.psychometric)) doneIds.add(a.id)
  }

  const essentialsDone = ESSENTIAL_ASSESSMENTS.filter((a) =>
    doneIds.has(a.id)
  ).length
  const essentialsTotal = ESSENTIAL_ASSESSMENTS.length
  const completenessPercent = Math.round(
    (essentialsDone / essentialsTotal) * 100
  )
  const globalIndex = averageCompletedScores(input.psychometric)
  const mode = reportDocumentMode(essentialsDone, essentialsTotal)

  const cards: AssessmentCardView[] = PERSONALIZED_ASSESSMENTS.map((a) => {
    const done = doneIds.has(a.id)
    let state: AssessmentCardState = "available"
    if (a.tier === "premium_plus" && !input.isSovereign) {
      state = "premium_plus"
    } else if (a.tier === "complementary" && !input.isAlliance) {
      state = "locked"
    } else if (a.tier === "essential" && !input.isAlliance && !a.sourceSlug) {
      state = "locked"
    } else if (done) {
      state = "done"
    } else if (!a.sourceSlug) {
      state = input.isAlliance ? "available" : "locked"
    }

    if (!a.sourceSlug && a.tier !== "premium_plus") {
      state = done ? "done" : input.isAlliance ? "available" : "locked"
    }
    if (!a.sourceSlug && !done) {
      state = a.tier === "premium_plus" ? "premium_plus" : "locked"
    }

    return {
      ...a,
      state,
      score: a.sourceSlug ? slugScore(input.psychometric, a.sourceSlug) : null,
      href: a.sourceSlug ? `/assessments/${a.sourceSlug}` : null,
    }
  })

  const name = input.firstName?.trim() || "Membre"
  const pillarScores = computePillarScores(input.psychometric)
  const ranked = rankedPillars(pillarScores)
  const forceCards = buildSampleForceCards({ mode, ranked })
  const remainingEssentials = ESSENTIAL_ASSESSMENTS.filter(
    (a) => !doneIds.has(a.id)
  )
  const vigilanceCards = buildSampleVigilanceCards({
    mode,
    remainingTitles: remainingEssentials.map((a) => a.title),
  })

  const packs = {
    relationnel: insightPackFor("relationnel"),
    spirituel: insightPackFor("spirituel"),
    projets_de_vie: insightPackFor("projets_de_vie"),
    valeurs: insightPackFor("valeurs"),
    humain: insightPackFor("humain"),
  }

  const portraitBody = composePortraitNarrativeV2({
    firstName: name,
    mode,
    ranked,
    packs,
  })
  const resumeBody = composeSummaryNarrative({
    firstName: name,
    mode,
    forces: forceCards,
    vigilances: vigilanceCards,
    testsDone: essentialsDone,
    testsTotal: essentialsTotal,
  })
  const welcomeBody = composeWelcome({
    firstName: name,
    mode,
    completenessPercent,
  })

  const remainingLabels = remainingEssentials
    .map((a) => REMAINING_DIM_LABELS[a.id] || a.title.toLowerCase())
    .slice(0, 6)

  const statusBlock =
    mode === "incomplete"
      ? composeStatusSection({
          testsDone: essentialsDone,
          testsTotal: essentialsTotal,
          remainingLabels,
        })
      : null

  const glance: ReportGlance | null =
    mode === "complete" && globalIndex != null
      ? {
          stars: starsFromScore(globalIndex),
          score: globalIndex,
          narrative: preparationBandCopy(globalIndex),
          forceLabels: forceCards.slice(0, 5).map((c) => c.why || c.title),
          priorities: vigilanceCards.slice(0, 3).map((c) => c.title),
        }
      : mode === "incomplete" && globalIndex != null
        ? {
            stars: starsFromScore(globalIndex),
            score: globalIndex,
            narrative: preparationBandCopy(globalIndex),
            forceLabels: forceCards.slice(0, 3).map((c) => c.why || c.title),
            priorities: vigilanceCards.slice(0, 3).map((c) => c.title),
          }
        : null

  const nextCard = cards.find(
    (c) => c.tier === "essential" && c.state !== "done" && c.href
  )
  const nextStep: ReportNextStep | null =
    mode === "incomplete" && nextCard
      ? {
          title: nextCard.title,
          href: nextCard.href as string,
          why: [
            "la qualité des échanges",
            "la résolution des désaccords",
            "la confiance",
            "la compréhension mutuelle",
          ],
          completenessNote: `Votre rapport est aujourd’hui complété à ${completenessPercent} %.`,
        }
      : null

  const chapterPillarMap: Partial<Record<ReportChapterId, ReportPillarId>> = {
    communication: "relationnel",
    conflits: "relationnel",
    intelligence_emotionnelle: "humain",
    valeurs: "valeurs",
    vision_mariage: "projets_de_vie",
    projet_de_vie: "projets_de_vie",
    finances: "valeurs",
    spiritualite: "spirituel",
  }

  const chapters: LivingChapter[] = REPORT_CHAPTERS.map((def) => {
    const hasScores = ranked.length > 0
    const unlocked =
      def.unlockedBy.length === 0 ||
      def.unlockedBy.some((id) => doneIds.has(id)) ||
      (hasScores &&
        (def.id === "portrait" ||
          def.id === "forces" ||
          def.id === "vigilances" ||
          def.id === "synthese" ||
          def.id === "plan"))

    if (!unlocked) {
      const needed = unlockAssessment(def.unlockedBy, doneIds)
      const pending = PENDING_CHAPTER_COPY[def.id]
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: false,
        sections: pending?.sections,
        durationHint: pending?.durationHint,
        unlockHint: needed
          ? `Prochaine étape recommandée : réaliser l’évaluation « ${needed.title} ».`
          : REPORT_COPY.missingEval,
        unlockHref: needed?.sourceSlug
          ? `/assessments/${needed.sourceSlug}`
          : "/assessments",
      }
    }

    const chapterTips = tipsForChapter(def.id, base.lightTips)

    if (def.id === "couverture") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: welcomeBody,
      }
    }

    if (def.id === "resume") {
      return {
        id: def.id,
        page: def.page,
        title:
          mode === "complete" ? "Résumé exécutif" : "Résumé personnalisé",
        teaser: def.teaser,
        unlocked: true,
        body: resumeBody,
      }
    }

    if (def.id === "forces") {
      return {
        id: def.id,
        page: def.page,
        title:
          mode === "complete"
            ? "Vos cinq plus grandes forces"
            : "Vos principales forces",
        teaser: def.teaser,
        unlocked: true,
        body:
          mode === "complete"
            ? "Toute relation solide s’appuie sur des qualités déjà présentes. Les forces présentées ci-dessous représentent les ressources qui ressortent le plus clairement de vos évaluations."
            : REPORT_COPY.forcesIntro,
        insightCards: forceCards,
      }
    }

    if (def.id === "vigilances") {
      return {
        id: def.id,
        page: def.page,
        title:
          mode === "complete"
            ? "Les trois priorités qui auront le plus d’impact"
            : "Les compétences à développer en priorité",
        teaser: def.teaser,
        unlocked: true,
        body:
          mode === "incomplete"
            ? "Les évaluations réalisées permettent déjà d’identifier quelques domaines qui mériteront une attention particulière.\n\nCes éléments ne constituent pas des faiblesses.\n\nIls représentent simplement des compétences qui pourront renforcer votre futur mariage."
            : REPORT_COPY.vigilancesIntro,
        insightCards: vigilanceCards,
      }
    }

    if (def.id === "portrait") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: portraitBody,
      }
    }

    if (def.id === "synthese") {
      return {
        id: def.id,
        page: def.page,
        title:
          mode === "complete"
            ? "Première synthèse générale"
            : "Ce que votre rapport connaît déjà",
        teaser: def.teaser,
        unlocked: true,
        body:
          mode === "complete"
            ? "Après l’analyse de l’ensemble des évaluations, une tendance claire apparaît.\n\nVotre profil est marqué par une forte cohérence entre vos valeurs, votre vision du mariage, votre spiritualité et votre manière d’entrer en relation.\n\nCette cohérence représente probablement votre plus grande force. Les compétences qui méritent encore d’être développées concernent davantage certaines attitudes relationnelles que vos convictions profondes.\n\nAutrement dit, les fondations sont solides. Le travail à poursuivre concerne principalement la manière de mettre ces convictions en pratique dans les situations concrètes de la vie quotidienne."
            : `À ce stade, votre rapport met principalement en évidence :\n\n${forceCards
                .slice(0, 3)
                .map((c) => `• ${c.title}`)
                .join("\n")}\n\nCes qualités constituent de solides fondations.\n\nCependant, elles ne représentent qu’une partie de votre profil. Les prochaines évaluations permettront de construire une vision beaucoup plus complète de votre préparation au mariage.`,
        bullets: [
          ...forceCards.slice(0, 3).map((c) => `Force · ${c.title}`),
          ...vigilanceCards.slice(0, 3).map((c) => `Axe · ${c.title}`),
        ],
      }
    }

    if (def.id === "plan") {
      return {
        id: def.id,
        page: def.page,
        title:
          mode === "complete"
            ? "Votre plan de croissance personnalisé"
            : "Votre feuille de route personnalisée",
        teaser: def.teaser,
        unlocked: true,
        body: composePlanIntro(mode),
        insightCards: vigilanceCards.slice(0, 3).map((c) => ({
          ...c,
          id: `plan_${c.id}`,
          kind: "vigilance" as const,
        })),
        tips: base.lightTips.slice(0, 5),
        sections:
          mode === "complete"
            ? [
                {
                  heading: "Premier mois — Observer",
                  body: "Prenez conscience de vos habitudes relationnelles. Cherchez à mieux comprendre vos réactions. Notez les situations qui vous mettent en difficulté.",
                },
                {
                  heading: "Deuxième mois — Expérimenter",
                  body: "Mettez en pratique les conseils proposés dans ce rapport. Choisissez une compétence à travailler chaque semaine. Cherchez le progrès plutôt que la perfection.",
                },
                {
                  heading: "Troisième mois — Consolider",
                  body: "Transformez les nouvelles habitudes en réflexes. Demandez à une personne de confiance de vous faire un retour sur les évolutions qu’elle observe.",
                },
              ]
            : undefined,
      }
    }

    if (def.id === "ressources") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body:
          mode === "incomplete"
            ? "Certaines personnes préfèrent être accompagnées dans leur réflexion. Si vous souhaitez échanger sur les résultats de votre rapport, poser des questions ou bénéficier d’un accompagnement personnalisé, vous pouvez réserver une séance de coaching."
            : "Nous vous encourageons à approfondir progressivement la communication dans le couple, la gestion des conflits, l’intelligence émotionnelle, la vie spirituelle du couple, la gestion des finances familiales et le discernement avant le mariage.",
        bullets: [
          "Académie du mariage — modules ciblés",
          "Coffre Premium — guides et exercices",
          "Eva — questions de discernement au quotidien",
          "Coaching — accompagnement humain quand vous en avez besoin",
        ],
      }
    }

    if (def.id === "evolution") {
      const remaining = cards.filter(
        (c) => c.tier === "essential" && c.state !== "done"
      )
      return {
        id: def.id,
        page: def.page,
        title:
          mode === "incomplete"
            ? "Votre progression Alliance"
            : "Votre progression en un regard",
        teaser: def.teaser,
        unlocked: true,
        body:
          mode === "incomplete"
            ? `Aujourd’hui, votre parcours est complété à ${completenessPercent} %.\n\nVous avez réalisé ${essentialsDone} évaluations sur ${essentialsTotal}.\n\nIl vous reste ${Math.max(0, essentialsTotal - essentialsDone)} évaluations.\n\nChaque nouvelle évaluation permettra d’enrichir votre portrait relationnel, d’affiner les conseils proposés, d’améliorer votre plan de progression et de rendre votre rapport plus précis.\n\nVotre Rapport Personnalisé évoluera automatiquement après chaque nouvelle évaluation.`
            : `Vous avez réalisé l’ensemble des évaluations du parcours Alliance.\n\nGrâce à votre implication, nous avons pu analyser les principales dimensions qui influencent la construction d’une relation durable. Ces analyses offrent aujourd’hui une lecture globale et cohérente de votre préparation au mariage.`,
        bullets: remaining.slice(0, 5).map(
          (c) =>
            `${c.title} → ouvre ${c.unlocks.slice(0, 2).join(", ") || "de nouvelles parties"}`
        ),
        unlockActions: remaining
          .filter((c) => c.href)
          .slice(0, 5)
          .map((c) => ({
            label: `Faire « ${c.title} »`,
            href: c.href as string,
          })),
        unlockHref: remaining.find((c) => c.href)?.href || "/assessments",
      }
    }

    if (def.id === "conclusion") {
      return {
        id: def.id,
        page: def.page,
        title: mode === "incomplete" ? "Un dernier encouragement" : "Conclusion",
        teaser: def.teaser,
        unlocked: true,
        body: composeConclusion({
          firstName: name,
          mode,
          completenessPercent,
          testsDone: essentialsDone,
          testsTotal: essentialsTotal,
          nextTitle: nextCard?.title,
        }),
        bullets:
          mode === "incomplete"
            ? [
                `Rapport complété : ${completenessPercent} %`,
                `Évaluations réalisées : ${essentialsDone} / ${essentialsTotal}`,
                nextCard
                  ? `Prochaine évaluation recommandée : ${nextCard.title}`
                  : "Poursuivez votre parcours Alliance",
                "Objectif suivant : Enrichir votre portrait relationnel",
              ]
            : [
                `Rapport complété : ${completenessPercent} %`,
                `Évaluations réalisées : ${essentialsDone} / ${essentialsTotal}`,
                globalIndex != null
                  ? `Indice global de préparation : ${globalIndex} / 100`
                  : "Préparation consolidée",
              ],
      }
    }

    // Chapitres compétence
    const linked = def.unlockedBy[0]
      ? PERSONALIZED_ASSESSMENTS.find((a) => a.id === def.unlockedBy[0])
      : undefined
    const pillarId = chapterPillarMap[def.id]
    const pack = pillarId ? insightPackFor(pillarId) : null
    const sections = composeUnlockedChapterSections({
      chapterId: def.id,
      chapterTitle: def.title,
      forceTitle: pack?.forceTitle,
      forceWhy: pack?.forceWhy,
      vigilanceTitle: pack?.vigilanceTitle,
      vigilanceWhy: pack?.vigilanceWhy,
      tipAdvice: chapterTips.map((t) => t.advice),
    })
    return {
      id: def.id,
      page: def.page,
      title: def.title,
      teaser: def.teaser,
      unlocked: true,
      body: sections[0]?.body,
      sections,
      tips: chapterTips.slice(0, 4),
      unlockHref: linked?.sourceSlug
        ? `/assessments/${linked.sourceSlug}`
        : undefined,
    }
  })

  const nextChapter = chapters.find((c) => !c.unlocked)

  return {
    base,
    generatedAt: new Date().toISOString(),
    documentMode: mode,
    versionLabel:
      mode === "complete" ? "Alliance Premium 1.0" : "Alliance 1.0",
    confidentialLabel:
      mode === "complete" ? "RAPPORT CONFIDENTIEL" : "RAPPORT PERSONNEL",
    indexLabel:
      mode === "complete"
        ? "Indice global de préparation"
        : "Indice relationnel actuel",
    completenessPercent,
    globalIndex,
    testsCompleted: essentialsDone,
    testsRemaining: Math.max(0, essentialsTotal - essentialsDone),
    essentialsTotal,
    welcomeBody,
    statusBlock,
    glance,
    nextStep,
    chapters,
    cards,
    nextUnlock:
      nextCard && nextChapter
        ? {
            title: nextCard.title,
            href: nextCard.href || "/assessments",
            chapterTitle: nextChapter.title,
          }
        : nextCard
          ? {
              title: nextCard.title,
              href: nextCard.href || "/assessments",
              chapterTitle: "enrichir votre rapport",
            }
          : null,
  }
}
