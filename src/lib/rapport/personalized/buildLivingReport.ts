/**
 * Rapport vivant Alliance — assemblé depuis le pack RAPPORT PERSONNALISE.
 * Contenu V1 : templates locaux (DOSSIER) + chapitres verrouillés (pas de LIA encore).
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
  buildForceCards,
  buildVigilanceCards,
  composeChapterAnalysis,
  composeExecutiveSummary,
  composePortraitNarrative,
  type InsightCard,
} from "@/lib/rapport/personalized/insightCards"

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
  /** Liens d’action (ex. évolution → tests restants) */
  unlockActions?: { label: string; href: string }[]
  /** Cartes force / axe premium (23-2) */
  insightCards?: InsightCard[]
  /** Sous-sections structurées (analyse détaillée) */
  sections?: { heading: string; body: string }[]
}

export type LivingPersonalizedReport = {
  base: ProfileReport
  generatedAt: string
  completenessPercent: number
  globalIndex: number | null
  testsCompleted: number
  testsRemaining: number
  essentialsTotal: number
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
  if (!dims) return true // slug done = enough for V1
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

    // V1: complementary without sourceSlug stay "coming soon" locked
    if (!a.sourceSlug && a.tier !== "premium_plus") {
      state = done ? "done" : input.isAlliance ? "available" : "locked"
    }
    if (!a.sourceSlug && !done) {
      // Pas encore de questionnaire dédié — carte visible, verrouillée soft
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
  const forceCards = buildForceCards(ranked)
  const vigilanceCards = buildVigilanceCards(ranked)
  const portraitBody = composePortraitNarrative({
    firstName: name,
    ranked,
  })
  const resumeBody = composeExecutiveSummary({
    firstName: name,
    forces: forceCards,
    vigilances: vigilanceCards,
    testsDone: essentialsDone,
    testsTotal: essentialsTotal,
  })

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
      // Document : dès qu’il y a des scores Matching, portrait / forces / axes s’ouvrent
      (hasScores &&
        (def.id === "portrait" ||
          def.id === "forces" ||
          def.id === "vigilances" ||
          def.id === "synthese" ||
          def.id === "plan"))

    if (!unlocked) {
      const needed = unlockAssessment(def.unlockedBy, doneIds)
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: false,
        unlockHint: needed
          ? `${REPORT_COPY.missingEval} Évaluation requise : « ${needed.title} ».`
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
        body: REPORT_COPY.welcome.replace(
          "Bienvenue dans votre Rapport Personnalisé KELIAA Alliance.",
          `${name}, bienvenue dans votre Rapport Personnalisé KELIAA Alliance.`
        ),
      }
    }

    if (def.id === "resume") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: resumeBody,
        bullets: [
          `${essentialsDone} / ${essentialsTotal} évaluations essentielles complétées`,
          forceCards.length
            ? `${forceCards.length} force${forceCards.length > 1 ? "s" : ""} mise${forceCards.length > 1 ? "s" : ""} en avant`
            : "Forces en cours d’identification",
          vigilanceCards.length
            ? `${vigilanceCards.length} axe${vigilanceCards.length > 1 ? "s" : ""} de progression`
            : "Axes à affiner avec les prochains tests",
        ],
      }
    }

    if (def.id === "forces") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: REPORT_COPY.forcesIntro,
        insightCards:
          forceCards.length > 0
            ? forceCards
            : undefined,
        bullets:
          forceCards.length === 0
            ? [
                "Complétez au moins une évaluation pour faire apparaître vos premières forces.",
              ]
            : undefined,
        tips: chapterTips.slice(0, 2),
      }
    }

    if (def.id === "vigilances") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: REPORT_COPY.vigilancesIntro,
        insightCards:
          vigilanceCards.length > 0 ? vigilanceCards : undefined,
        bullets:
          vigilanceCards.length === 0
            ? [REPORT_COPY.noPriority]
            : undefined,
        tips: chapterTips.slice(0, 3),
      }
    }

    if (def.id === "portrait") {
      const needed = unlockAssessment(
        ["personnalite", "intelligence_emotionnelle"],
        doneIds
      )
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: portraitBody,
        unlockHref: needed?.sourceSlug
          ? `/assessments/${needed.sourceSlug}`
          : "/assessments/personality",
      }
    }

    if (def.id === "synthese") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: "Vue d’ensemble de vos ressources et de vos axes — sans jargon, sans étiquette.",
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
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: REPORT_COPY.tipsIntro,
        insightCards: vigilanceCards.slice(0, 3).map((c) => ({
          ...c,
          id: `plan_${c.id}`,
          kind: "vigilance" as const,
        })),
        tips: base.lightTips.slice(0, 5),
      }
    }

    if (def.id === "ressources") {
      return {
        id: def.id,
        page: def.page,
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: "Orientez-vous vers les contenus Alliance les plus utiles pour votre saison.",
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
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: REPORT_COPY.evolution,
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
        title: def.title,
        teaser: def.teaser,
        unlocked: true,
        body: `${REPORT_COPY.conclusion}\n\n${REPORT_COPY.motivation}`,
      }
    }

    // Chapitres compétence (communication, conflits, …)
    const linked = def.unlockedBy[0]
      ? PERSONALIZED_ASSESSMENTS.find((a) => a.id === def.unlockedBy[0])
      : undefined
    const pillarId = chapterPillarMap[def.id]
    const analysis = composeChapterAnalysis({
      chapterTitle: def.title,
      pillarId,
      tipTitles: chapterTips.map((t) => t.title),
      tipAdvice: chapterTips.map((t) => t.advice),
    })
    return {
      id: def.id,
      page: def.page,
      title: def.title,
      teaser: def.teaser,
      unlocked: true,
      body: analysis.body,
      sections: analysis.sections,
      tips: chapterTips.slice(0, 4),
      unlockHref: linked?.sourceSlug
        ? `/assessments/${linked.sourceSlug}`
        : undefined,
    }
  })

  const nextCard = cards.find(
    (c) => c.tier === "essential" && c.state !== "done" && c.href
  )
  const nextChapter = chapters.find((c) => !c.unlocked)

  return {
    base,
    generatedAt: new Date().toISOString(),
    completenessPercent,
    globalIndex,
    testsCompleted: essentialsDone,
    testsRemaining: Math.max(0, essentialsTotal - essentialsDone),
    essentialsTotal,
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
