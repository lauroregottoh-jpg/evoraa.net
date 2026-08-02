import type { MatchableProfile } from "./types"

export type InteractionSeverity = "info" | "watch" | "risk"

export type InteractionInsight = {
  id: string
  severity: InteractionSeverity
  title: string
  message: string
  /** Impact négatif sur le score psycho (0–12). */
  penalty: number
}

type DimMap = Partial<Record<string, Record<string, number>>>

function dim(
  dimensions: DimMap | null | undefined,
  pillar: string,
  key: string
): number | null {
  const v = dimensions?.[pillar]?.[key]
  return typeof v === "number" ? v : null
}

function eitherWay(
  a: number | null,
  b: number | null,
  pred: (hi: number, lo: number) => boolean
): boolean {
  if (a == null || b == null) return false
  return pred(a, b) || pred(b, a)
}

/**
 * Règles d'interaction à fort signal — croisent les profils
 * (pas seulement la similarité des notes).
 */
export function evaluateInteractionRules(
  a: MatchableProfile["psychometric_results"],
  b: MatchableProfile["psychometric_results"]
): InteractionInsight[] {
  if (!a?.dimensions || !b?.dimensions) return []

  const da = a.dimensions
  const db = b.dimensions
  const out: InteractionInsight[] = []

  const faithA = dim(da, "spiritual", "faith_importance")
  const faithB = dim(db, "spiritual", "faith_importance")
  if (eitherWay(faithA, faithB, (hi, lo) => hi >= 75 && lo <= 50)) {
    out.push({
      id: "faith_gap",
      severity: "risk",
      title: "Écart majeur sur la place de la foi",
      message:
        "L'un place Dieu au centre du projet de couple, l'autre beaucoup moins. Ce point mérite un dialogue clair avant tout engagement.",
      penalty: 9,
    })
  }

  const visionA = dim(da, "spiritual", "marriage_vision")
  const visionB = dim(db, "spiritual", "marriage_vision")
  if (
    visionA != null &&
    visionB != null &&
    Math.abs(visionA - visionB) >= 30
  ) {
    out.push({
      id: "marriage_vision_gap",
      severity: "risk",
      title: "Visions du mariage divergentes",
      message:
        "Vos réponses sur le sens du mariage s'éloignent nettement. Clarifiez alliance, durée et vocation avant d'avancer.",
      penalty: 7,
    })
  }

  const conflictA = dim(da, "relationship", "conflict")
  const conflictB = dim(db, "relationship", "conflict")
  if (
    conflictA != null &&
    conflictB != null &&
    conflictA < 55 &&
    conflictB < 55
  ) {
    out.push({
      id: "conflict_both_low",
      severity: "risk",
      title: "Double fragilité sur les conflits",
      message:
        "Tous les deux peinent à gérer les désaccords. Sans cadre commun (pause, écoute, réconciliation), les tensions risquent de s'accumuler.",
      penalty: 7,
    })
  } else if (
    conflictA != null &&
    conflictB != null &&
    Math.min(conflictA, conflictB) < 48
  ) {
    out.push({
      id: "conflict_weak_floor",
      severity: "watch",
      title: "Point sensible : gestion des conflits",
      message:
        "Au moins l'un des deux se ferme, s'emporte ou évite quand ça chauffe. Un rythme de dialogue à deux sera essentiel.",
      penalty: 4,
    })
  }

  const commA = dim(da, "personality", "communication")
  const commB = dim(db, "personality", "communication")
  if (eitherWay(commA, commB, (hi, lo) => hi >= 80 && lo < 50)) {
    out.push({
      id: "comm_asymmetry",
      severity: "watch",
      title: "Asymétrie de communication",
      message:
        "L'un s'exprime volontiers et clairement, l'autre beaucoup moins. Risque de frustration si les besoins ne sont pas nommés tôt.",
      penalty: 4,
    })
  }

  const emotionalA = dim(da, "relationship", "emotional")
  const stabilityB = dim(db, "personality", "emotional_stability")
  const emotionalB = dim(db, "relationship", "emotional")
  const stabilityA = dim(da, "personality", "emotional_stability")
  if (
    (emotionalA != null &&
      stabilityB != null &&
      emotionalA >= 78 &&
      stabilityB < 50) ||
    (emotionalB != null &&
      stabilityA != null &&
      emotionalB >= 78 &&
      stabilityA < 50)
  ) {
    out.push({
      id: "affection_vs_regulation",
      severity: "watch",
      title: "Besoin d'expression × régulation sous stress",
      message:
        "L'un a un fort besoin d'expression affective ; l'autre régule difficilement sous pression. Anticiper des rituels de dialogue évite les malentendus.",
      penalty: 5,
    })
  }

  const transA = dim(da, "finances", "transparency")
  const transB = dim(db, "finances", "transparency")
  if (eitherWay(transA, transB, (hi, lo) => hi >= 78 && lo < 52)) {
    out.push({
      id: "finance_transparency_gap",
      severity: "watch",
      title: "Transparence financière inégale",
      message:
        "L'un valorise une grande clarté sur l'argent, l'autre moins. Abordez revenus, dettes et habitudes tôt et sans jugement.",
      penalty: 5,
    })
  }

  const planA = dim(da, "finances", "planning")
  const mgmtB = dim(db, "finances", "management")
  const planB = dim(db, "finances", "planning")
  const mgmtA = dim(da, "finances", "management")
  if (
    (planA != null && mgmtB != null && planA >= 75 && mgmtB < 50) ||
    (planB != null && mgmtA != null && planB >= 75 && mgmtA < 50)
  ) {
    out.push({
      id: "planning_vs_management",
      severity: "watch",
      title: "Projets financiers × discipline de budget",
      message:
        "Un côté planifie volontiers l'avenir, l'autre peinent sur la gestion au quotidien. Un budget simple partagé réduit la friction.",
      penalty: 3,
    })
  }

  const intimacyA = dim(da, "couple_life", "intimacy")
  const intimacyB = dim(db, "couple_life", "intimacy")
  if (
    intimacyA != null &&
    intimacyB != null &&
    Math.abs(intimacyA - intimacyB) >= 28
  ) {
    out.push({
      id: "intimacy_misalign",
      severity: "watch",
      title: "Limites & pureté à clarifier",
      message:
        "Vos repères sur les limites physiques avant le mariage divergent. Mieux vaut s'aligner explicitement que découvrir le conflit trop tard.",
      penalty: 5,
    })
  }

  const familyA = dim(da, "couple_life", "family")
  const familyB = dim(db, "couple_life", "family")
  if (
    familyA != null &&
    familyB != null &&
    Math.abs(familyA - familyB) >= 30
  ) {
    out.push({
      id: "family_boundaries",
      severity: "watch",
      title: "Rapport aux familles élargies",
      message:
        "Vous n'avez pas la même lecture des liens et limites avec les familles. Posez tôt ce qui est négociable et ce qui ne l'est pas.",
      penalty: 4,
    })
  }

  const partnerA = dim(da, "relationship", "partnership")
  const partnerB = dim(db, "relationship", "partnership")
  if (
    partnerA != null &&
    partnerB != null &&
    Math.abs(partnerA - partnerB) >= 30 &&
    Math.min(partnerA, partnerB) < 60
  ) {
    out.push({
      id: "partnership_gap",
      severity: "watch",
      title: "Décisions à deux déséquilibrées",
      message:
        "L'un tend vers un vrai partenariat décisionnel, l'autre moins. Sans accord sur « qui décide quoi », les frustrations montent vite.",
      penalty: 4,
    })
  }

  const practicesA = dim(da, "spiritual", "practices")
  const practicesB = dim(db, "spiritual", "practices")
  if (
    practicesA != null &&
    practicesB != null &&
    practicesA < 45 &&
    practicesB < 45
  ) {
    out.push({
      id: "practices_both_low",
      severity: "info",
      title: "Pratiques spirituelles encore fragiles",
      message:
        "Aucun des deux n'a aujourd'hui un rythme spirituel très ancré. Un couple peut grandir — à condition d'en faire un projet commun, pas une attente implicite.",
      penalty: 2,
    })
  }

  const stabilityA2 = dim(da, "personality", "emotional_stability")
  const stabilityB2 = dim(db, "personality", "emotional_stability")
  if (
    stabilityA2 != null &&
    stabilityB2 != null &&
    stabilityA2 < 50 &&
    stabilityB2 < 50
  ) {
    out.push({
      id: "stability_both_low",
      severity: "risk",
      title: "Double sensibilité sous stress",
      message:
        "Tous les deux réagissent fortement sous pression. Sans outils de régulation partagés, le quotidien peut vite devenir orageux.",
      penalty: 6,
    })
  }

  // Une seule insight par id ; prioriser risk > watch > info si doublons
  const byId = new Map<string, InteractionInsight>()
  const rank = { risk: 3, watch: 2, info: 1 }
  for (const insight of out) {
    const prev = byId.get(insight.id)
    if (!prev || rank[insight.severity] > rank[prev.severity]) {
      byId.set(insight.id, insight)
    }
  }

  return Array.from(byId.values()).sort(
    (x, y) => rank[y.severity] - rank[x.severity] || y.penalty - x.penalty
  )
}

export function totalInteractionPenalty(insights: InteractionInsight[]): number {
  // Cap pour ne pas écraser un match sinon solide
  return Math.min(
    18,
    insights.reduce((sum, i) => sum + i.penalty, 0)
  )
}
