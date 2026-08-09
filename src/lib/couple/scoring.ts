/**
 * Moteur de scoring / matching KELYA COUPLE™
 * Score = indicateur de dynamique, jamais un verdict d’avenir.
 */

import {
  COUPLE_DIMENSION_META,
  COUPLE_QUESTIONS,
  type CoupleDimensionId,
} from "@/lib/couple/questionBank"
import { COUPLE_SCORING_VERSION } from "@/lib/couple/config"

export type AnswerMap = Record<string, number>

export type DimensionPairScore = {
  dimension: CoupleDimensionId
  label: string
  scoreA: number
  scoreB: number
  gap: number
  convergence: number
  status: "convergence" | "difference" | "vigilance"
}

export type CoupleScoringResult = {
  scoringVersion: string
  globalScore: number
  dimensions: DimensionPairScore[]
  convergences: DimensionPairScore[]
  divergences: DimensionPairScore[]
  vigilanceZones: DimensionPairScore[]
  strengths: DimensionPairScore[]
  priorities: DimensionPairScore[]
  safetyFlags: string[]
}

function mean(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function dimensionScore(answers: AnswerMap, dimension: CoupleDimensionId): number {
  const qs = COUPLE_QUESTIONS.filter((q) => q.dimension === dimension)
  const vals = qs
    .map((q) => answers[q.id])
    .filter((v): v is number => typeof v === "number" && v >= 1 && v <= 5)
  if (!vals.length) return 0
  // 1–5 → 0–100
  return Math.round(((mean(vals) - 1) / 4) * 100)
}

/**
 * Interprétation nuancée — jamais « incompatibles ».
 */
export function interpretGlobalScore(score: number): {
  band: "low" | "mid" | "high"
  title: string
  paragraph: string
} {
  if (score < 40) {
    return {
      band: "low",
      title: "Une dynamique qui demande du travail conscient",
      paragraph:
        "Ce résultat ne signifie pas que votre couple est condamné. Il met en lumière des écarts ou des frictions qui méritent d’être nommés, compris et travaillés. Beaucoup de couples solidifient leur lien précisément en passant par cette lucidité. Ce bilan vous donne une carte pour avancer — pas un verdict sur votre avenir.",
    }
  }
  if (score < 70) {
    return {
      band: "mid",
      title: "Des bases réelles, avec des zones à clarifier",
      paragraph:
        "Vous partagez des points d’appui, et certaines différences demandent encore de la conversation et de la pratique. Ce n’est ni une réussite figée ni un échec : c’est une dynamique vivante. Les pages qui suivent vous aident à renforcer ce qui marche et à traiter ce qui frotte.",
    }
  }
  return {
    band: "high",
    title: "Une belle convergence — à entretenir",
    paragraph:
      "Vos réponses montrent de nombreuses convergences. Cela ne signifie pas que vous n’avez « rien à travailler ». Même les couples très alignés gagnent à nommer les nuances, prévenir l’usure et cultiver volontairement ce qui les unit. Ce bilan propose des pistes pour approfondir.",
  }
}

export function scoreCouplePair(
  answersA: AnswerMap,
  answersB: AnswerMap
): CoupleScoringResult {
  const dimensions: DimensionPairScore[] = (
    Object.keys(COUPLE_DIMENSION_META) as CoupleDimensionId[]
  )
    .sort((a, b) => COUPLE_DIMENSION_META[a].order - COUPLE_DIMENSION_META[b].order)
    .map((dimension) => {
      const scoreA = dimensionScore(answersA, dimension)
      const scoreB = dimensionScore(answersB, dimension)
      const gap = Math.abs(scoreA - scoreB)
      const avg = (scoreA + scoreB) / 2
      const convergence = Math.max(0, Math.round(100 - gap * 0.85))
      let status: DimensionPairScore["status"] = "convergence"
      if (gap >= 35 || avg < 40) status = "vigilance"
      else if (gap >= 18) status = "difference"
      return {
        dimension,
        label: COUPLE_DIMENSION_META[dimension].label,
        scoreA,
        scoreB,
        gap: Math.round(gap),
        convergence,
        status,
      }
    })

  const globalScore = Math.round(
    mean(dimensions.map((d) => (d.convergence * 0.55 + ((d.scoreA + d.scoreB) / 2) * 0.45)))
  )

  const convergences = dimensions
    .filter((d) => d.status === "convergence" && d.convergence >= 70)
    .sort((a, b) => b.convergence - a.convergence)
  const divergences = dimensions
    .filter((d) => d.status === "difference" || d.status === "vigilance")
    .sort((a, b) => b.gap - a.gap)
  const vigilanceZones = dimensions
    .filter((d) => d.status === "vigilance")
    .sort((a, b) => b.gap - a.gap || a.scoreA + a.scoreB - (b.scoreA + b.scoreB))
  const strengths = [...dimensions]
    .sort((a, b) => b.convergence - a.convergence || b.scoreA + b.scoreB - (a.scoreA + a.scoreB))
    .slice(0, 5)
  const priorities = [...divergences].slice(0, 5)

  const safetyFlags: string[] = []
  const lim = dimensions.find((d) => d.dimension === "limites")
  if (lim && (lim.scoreA < 35 || lim.scoreB < 35 || lim.gap >= 40)) {
    safetyFlags.push("limites_securite")
  }

  return {
    scoringVersion: COUPLE_SCORING_VERSION,
    globalScore,
    dimensions,
    convergences,
    divergences,
    vigilanceZones,
    strengths,
    priorities,
    safetyFlags,
  }
}
