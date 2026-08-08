/**
 * Réutilisation des tests Découverte / Alliance pour préremplir KELYA COUPLE.
 * On propose des valeurs à relire — jamais un envoi silencieux.
 */

import type { CoupleDimensionId } from "@/lib/couple/questionBank"
import { COUPLE_QUESTIONS } from "@/lib/couple/questionBank"

/** Mapping dimension Couple ← dimensions des piliers Matching (0–100). */
const DIMENSION_SOURCES: Record<
  CoupleDimensionId,
  Array<{ pillar: string; key: string; label: string }>
> = {
  vision_couple: [
    { pillar: "couple_life", key: "vision", label: "Projet de vie / vision" },
    { pillar: "spiritual", key: "marriage_vision", label: "Vision du mariage" },
  ],
  valeurs: [
    { pillar: "spiritual", key: "faith_importance", label: "Importance de la foi" },
    { pillar: "personality", key: "responsibility", label: "Responsabilité" },
  ],
  mariage: [
    { pillar: "spiritual", key: "marriage_vision", label: "Vision du mariage" },
    { pillar: "couple_life", key: "vision", label: "Vision du couple" },
  ],
  communication: [
    { pillar: "relationship", key: "communication", label: "Communication" },
    { pillar: "personality", key: "communication", label: "Communication (personnalité)" },
  ],
  conflits: [
    { pillar: "relationship", key: "conflict", label: "Gestion des conflits" },
  ],
  emotions: [
    { pillar: "relationship", key: "emotional", label: "Émotions" },
    { pillar: "personality", key: "emotional_stability", label: "Stabilité émotionnelle" },
  ],
  affection: [
    { pillar: "relationship", key: "partnership", label: "Partenariat" },
    { pillar: "couple_life", key: "intimacy", label: "Intimité" },
  ],
  intimite: [
    { pillar: "couple_life", key: "intimacy", label: "Intimité" },
  ],
  finances: [
    { pillar: "finances", key: "management", label: "Gestion financière" },
    { pillar: "finances", key: "transparency", label: "Transparence financière" },
    { pillar: "finances", key: "stewardship", label: "Intendance" },
  ],
  famille: [
    { pillar: "couple_life", key: "family", label: "Famille" },
  ],
  roles: [
    { pillar: "couple_life", key: "roles", label: "Rôles conjugaux" },
  ],
  decision: [
    { pillar: "relationship", key: "partnership", label: "Partenariat / décisions" },
    { pillar: "couple_life", key: "roles", label: "Rôles" },
  ],
  projet_vie: [
    { pillar: "couple_life", key: "vision", label: "Vision / projet" },
  ],
  carriere: [
    { pillar: "personality", key: "responsibility", label: "Responsabilité" },
    { pillar: "finances", key: "planning", label: "Planification" },
  ],
  enfants: [
    { pillar: "couple_life", key: "family", label: "Famille / parentalité" },
  ],
  autonomie: [
    { pillar: "personality", key: "openness", label: "Ouverture" },
    { pillar: "relationship", key: "partnership", label: "Partenariat" },
  ],
  spiritualite: [
    { pillar: "spiritual", key: "faith_importance", label: "Foi" },
    { pillar: "spiritual", key: "practices", label: "Pratiques spirituelles" },
  ],
  limites: [
    { pillar: "personality", key: "emotional_stability", label: "Stabilité émotionnelle" },
    { pillar: "relationship", key: "conflict", label: "Conflits / limites" },
  ],
}

export type CouplePrefillSuggestion = {
  questionId: string
  questionText: string
  dimension: CoupleDimensionId
  value: number
  sourceLabel: string
  pillarScore: number
}

function scoreToLikert(score0to100: number): number {
  const v = Math.round(1 + (Math.max(0, Math.min(100, score0to100)) / 100) * 4)
  return Math.max(1, Math.min(5, v))
}

function pickDimensionScore(
  dimensionsByPillar: Record<string, Record<string, number>> | undefined,
  sources: Array<{ pillar: string; key: string; label: string }>
): { score: number; label: string } | null {
  if (!dimensionsByPillar) return null
  for (const src of sources) {
    const pillar = dimensionsByPillar[src.pillar]
    const raw = pillar?.[src.key]
    if (typeof raw === "number" && Number.isFinite(raw)) {
      return { score: raw, label: src.label }
    }
  }
  return null
}

/**
 * Construit des suggestions 1–5 à partir des dimensions déjà scorées
 * dans psychometric_results.dimensions (tests Découverte / Alliance).
 */
export function buildCouplePrefillFromPsychometrics(
  psychometric: unknown
): CouplePrefillSuggestion[] {
  if (!psychometric || typeof psychometric !== "object") return []
  const dims = (psychometric as { dimensions?: Record<string, Record<string, number>> })
    .dimensions
  if (!dims || typeof dims !== "object") return []

  const out: CouplePrefillSuggestion[] = []
  for (const q of COUPLE_QUESTIONS) {
    const sources = DIMENSION_SOURCES[q.dimension]
    const picked = pickDimensionScore(dims, sources)
    if (!picked) continue
    out.push({
      questionId: q.id,
      questionText: q.text,
      dimension: q.dimension,
      value: scoreToLikert(picked.score),
      sourceLabel: picked.label,
      pillarScore: Math.round(picked.score),
    })
  }
  return out
}
