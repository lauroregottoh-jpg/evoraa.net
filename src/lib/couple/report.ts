/**
 * Rapport KELYA COUPLE™ — façade sur le moteur de décision (docs 41/86/133/181).
 */

import { interpretGlobalScore } from "@/lib/couple/scoring"
import type { CoupleScoringResult } from "@/lib/couple/scoring"
import type { CoupleOfferId } from "@/lib/couple/offers"
import { isPremiumPlusOffer } from "@/lib/couple/offers"
import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import { runCoupleEngine } from "@/lib/couple/engine/pipeline"
import type { CoupleContext } from "@/lib/couple/engine/types"

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
  /** Notes du quality gate (debug / ops). */
  engineNotes?: string[]
}

export function buildCoupleReport(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
  context?: CoupleContext
}): CoupleReportDocument {
  const { doc, gate } = runCoupleEngine({
    offerId: args.offerId,
    names: args.names,
    scoring: args.scoring,
    context: args.context,
  })
  return {
    ...doc,
    engineNotes: gate.notes,
  }
}

export function qaCoupleReport(doc: CoupleReportDocument): {
  ok: boolean
  notes: string[]
} {
  const notes: string[] = [...(doc.engineNotes || [])]
  if (!doc.names.nameA?.trim() || !doc.names.nameB?.trim()) {
    notes.push("Noms participants manquants")
  }
  if (doc.globalScore < 0 || doc.globalScore > 100) {
    notes.push("Score global hors bornes")
  }
  if (doc.sections.length < 8) notes.push("Sections insuffisantes")
  if (doc.exercises.length < 1) notes.push("Exercices manquants")
  if (doc.actionPlan.length < 1) notes.push("Plan d’action manquant")

  const priorities = doc.sections.find((s) => s.id === "priorites")
  if (priorities) {
    const h2Count = (priorities.blocks || []).filter((b) => b.type === "h2").length
    // approx: each priority has several h2s — check we don't claim >3 in title list
    const priLines = (priorities.paragraphs || []).filter((p) =>
      /^Priorité\s+[123]\b/i.test(p)
    )
    if (priLines.length > 3) notes.push("Plus de 3 priorités listées")
  }

  const blob = JSON.stringify(doc)
  if (/TODO|FIXME|placeholder|lorem ipsum/i.test(blob)) {
    notes.push("Placeholders détectés")
  }
  if (isPremiumPlusOffer(doc.offerId) && doc.premiumPlusExtras.length < 1) {
    notes.push("Premium Plus sans extras")
  }
  // Deduplicate notes
  const unique = [...new Set(notes)]
  return { ok: unique.length === 0, notes: unique }
}
