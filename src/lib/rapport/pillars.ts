/**
 * Remap officiel : dimensions des questionnaires → 5 piliers du rapport individuel.
 * Source : docs/DOSSIER RAPPORT.md + docs/rapport/00_remap.md
 * ≠ matching de paires.
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export type ReportPillarId =
  | "relationnel"
  | "spirituel"
  | "projets_de_vie"
  | "valeurs"
  | "humain"

export const REPORT_PILLAR_ORDER: ReportPillarId[] = [
  "relationnel",
  "spirituel",
  "projets_de_vie",
  "valeurs",
  "humain",
]

export const REPORT_PILLARS: Record<
  ReportPillarId,
  { label: string; shortLabel: string; order: number }
> = {
  relationnel: {
    label: "Compatibilité relationnelle",
    shortLabel: "Relationnel",
    order: 1,
  },
  spirituel: {
    label: "Compatibilité spirituelle",
    shortLabel: "Spirituel",
    order: 2,
  },
  projets_de_vie: {
    label: "Compatibilité des projets de vie",
    shortLabel: "Projets de vie",
    order: 3,
  },
  valeurs: {
    label: "Compatibilité des valeurs",
    shortLabel: "Valeurs",
    order: 4,
  },
  humain: {
    label: "Compatibilité humaine",
    shortLabel: "Humain",
    order: 5,
  },
}

/** Échelle officielle DOSSIER RAPPORT §2 */
export type ScoreBandId =
  | "axe_prioritaire"
  | "en_developpement"
  | "bon_equilibre"
  | "force_majeure"

export function scoreBand(score: number): ScoreBandId {
  if (score <= 39) return "axe_prioritaire"
  if (score <= 59) return "en_developpement"
  if (score <= 79) return "bon_equilibre"
  return "force_majeure"
}

export const SCORE_BAND_LABELS: Record<ScoreBandId, string> = {
  axe_prioritaire: "Axe prioritaire de développement",
  en_developpement: "Compétence en développement",
  bon_equilibre: "Bon équilibre",
  force_majeure: "Force majeure",
}

const DIMENSION_DEFAULT: Record<string, ReportPillarId> = {
  conflict: "relationnel",
  emotional: "relationnel",
  partnership: "relationnel",
  faith_importance: "spirituel",
  practices: "spirituel",
  community: "spirituel",
  vision: "projets_de_vie",
  roles: "projets_de_vie",
  family: "projets_de_vie",
  planning: "projets_de_vie",
  management: "projets_de_vie",
  marriage_vision: "valeurs",
  intimacy: "valeurs",
  stewardship: "valeurs",
  emotional_stability: "humain",
  openness: "humain",
  responsibility: "humain",
}

const SLUG_FALLBACK: Record<AssessmentSlug, ReportPillarId> = {
  relationship: "relationnel",
  spiritual: "spirituel",
  couple_life: "projets_de_vie",
  finances: "valeurs",
  personality: "humain",
}

/**
 * Résout le pilier dossier à partir du slug d’assessment + dimension.
 */
export function resolveReportPillar(
  slug: AssessmentSlug,
  dimension: string
): ReportPillarId {
  if (dimension === "communication") {
    return slug === "personality" ? "humain" : "relationnel"
  }
  return DIMENSION_DEFAULT[dimension] ?? SLUG_FALLBACK[slug]
}

export function reportPillarLabel(id: ReportPillarId): string {
  return REPORT_PILLARS[id].label
}
