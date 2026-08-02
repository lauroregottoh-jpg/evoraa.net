/**
 * Modes de croisement par dimension.
 * - align : similarité requise (foi, vision mariage…)
 * - floor : le plus bas des deux tire le score (compétences relationnelles)
 * - complement : écart modéré OK si les deux sont sains
 */

export type DimensionMode = "align" | "floor" | "complement"

export const DIMENSION_MODES: Record<string, DimensionMode> = {
  // Spiritual — alignement critique
  faith_importance: "align",
  practices: "align",
  marriage_vision: "align",
  community: "align",

  // Personality
  emotional_stability: "floor",
  communication: "floor",
  openness: "complement",
  responsibility: "floor",

  // Relationship
  conflict: "floor",
  emotional: "complement",
  partnership: "floor",

  // Couple life
  vision: "complement",
  family: "align",
  intimacy: "align",
  roles: "complement",

  // Finances
  transparency: "align",
  stewardship: "align",
  management: "floor",
  planning: "floor",
}

export function getDimensionMode(dimension: string): DimensionMode {
  return DIMENSION_MODES[dimension] ?? "floor"
}

/** Score de compatibilité 0–100 pour une paire de scores dimensionnels. */
export function scoreDimensionPair(
  dimension: string,
  a: number,
  b: number
): number {
  const mode = getDimensionMode(dimension)
  const gap = Math.abs(a - b)
  const floor = Math.min(a, b)
  const avg = (a + b) / 2

  if (mode === "align") {
    let base = 100 - gap * 1.25
    if (floor < 45) base = Math.min(base, 38 + floor * 0.35)
    else if (floor < 60) base = Math.min(base, base * 0.92)
    return clamp(Math.round(base))
  }

  if (mode === "complement") {
    // Écart modéré toléré si les deux sont au-dessus d'un plancher sain.
    if (floor >= 58) {
      const softGap = Math.min(gap, 38)
      return clamp(Math.round(floor * 0.5 + avg * 0.3 + (100 - softGap) * 0.2))
    }
    return clamp(Math.round(floor * 0.75 + (100 - gap) * 0.25))
  }

  // floor — la compétence du plus faible compte le plus
  return clamp(Math.round(floor * 0.78 + avg * 0.12 + (100 - gap) * 0.1))
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}
