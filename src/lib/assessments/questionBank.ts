export type AssessmentSlug = "personality" | "spiritual" | "relationship"

export type BankQuestion = {
  key: string
  dimension: string
  text: string
  reverse?: boolean
}

export const ASSESSMENTS: Record<
  AssessmentSlug,
  { name: string; description: string; questions: BankQuestion[] }
> = {
  personality: {
    name: "Personnalité",
    description: "Communication, stabilité émotionnelle, ouverture et fiabilité.",
    questions: [
      { key: "p01", dimension: "communication", text: "J'exprime mes pensées avec clarté et ouverture." },
      { key: "p02", dimension: "communication", text: "J'écoute activement avant de répondre." },
      { key: "p03", dimension: "communication", text: "Je reste respectueux(se) pendant les désaccords." },
      { key: "p04", dimension: "emotional_stability", text: "Je reste calme sous pression." },
      { key: "p05", dimension: "emotional_stability", text: "Je gère mes émotions sans blesser les autres." },
      { key: "p06", dimension: "emotional_stability", text: "Je me relève rapidement après une déception." },
      { key: "p07", dimension: "openness", text: "Je m'adapte facilement au changement." },
      { key: "p08", dimension: "openness", text: "J'apprécie les points de vue différents du mien." },
      { key: "p09", dimension: "openness", text: "J'aime apprendre de nouvelles façons de faire." },
      { key: "p10", dimension: "responsibility", text: "On peut compter sur moi pour tenir mes engagements." },
      { key: "p11", dimension: "responsibility", text: "Je planifie avant de prendre des décisions importantes." },
      { key: "p12", dimension: "responsibility", text: "Je termine généralement ce que j'ai commencé." },
    ],
  },
  spiritual: {
    name: "Compatibilité spirituelle",
    description: "Place de la foi, pratiques et vision chrétienne du mariage.",
    questions: [
      { key: "s01", dimension: "faith_importance", text: "Ma foi influence mes décisions quotidiennes." },
      { key: "s02", dimension: "faith_importance", text: "Je désire que Dieu soit au centre de mon futur mariage." },
      { key: "s03", dimension: "faith_importance", text: "La compatibilité spirituelle est essentielle pour choisir un conjoint." },
      { key: "s04", dimension: "practices", text: "La prière fait partie régulièrement de ma vie." },
      { key: "s05", dimension: "practices", text: "La lecture de la Bible est une habitude importante pour moi." },
      { key: "s06", dimension: "practices", text: "Je valorise la prière à deux en couple." },
      { key: "s07", dimension: "marriage_vision", text: "Je crois que le mariage est une alliance pour la vie." },
      { key: "s08", dimension: "marriage_vision", text: "Je souhaite résoudre les conflits selon des principes bibliques." },
      { key: "s09", dimension: "community", text: "Je suis engagé(e) activement dans une église locale." },
      { key: "s10", dimension: "community", text: "Servir les autres est une part importante de la vie chrétienne." },
    ],
  },
  relationship: {
    name: "Compatibilité relationnelle",
    description: "Dialogue, conflits, disponibilité émotionnelle et partenariat.",
    questions: [
      { key: "r01", dimension: "communication", text: "J'exprime mes besoins avec respect." },
      { key: "r02", dimension: "communication", text: "J'écoute attentivement avant de répondre." },
      { key: "r03", dimension: "communication", text: "Je suis à l'aise pour aborder des sujets difficiles." },
      { key: "r04", dimension: "conflict", text: "Je cherche des solutions plutôt que de « gagner » l'argument." },
      { key: "r05", dimension: "conflict", text: "Je m'excuse quand je réalise que j'ai tort." },
      { key: "r06", dimension: "conflict", text: "Je reste respectueux(se) même en désaccord.", reverse: false },
      { key: "r07", dimension: "emotional", text: "J'exprime facilement soin et affection." },
      { key: "r08", dimension: "emotional", text: "Je suis à l'aise pour parler de mes émotions." },
      { key: "r09", dimension: "emotional", text: "J'encourage une communication émotionnelle ouverte." },
      { key: "r10", dimension: "partnership", text: "Les décisions importantes doivent être prises ensemble." },
      { key: "r11", dimension: "partnership", text: "Je valorise le soutien mutuel au quotidien." },
      { key: "r12", dimension: "partnership", text: "Je suis prêt(e) à des sacrifices personnels pour la réussite du couple." },
    ],
  },
}

export const LIKERT_LABELS = [
  "Pas du tout d'accord",
  "Pas d'accord",
  "Neutre",
  "D'accord",
  "Tout à fait d'accord",
] as const

export function normalizeScore(raw: number, questionCount: number): number {
  const min = questionCount * 1
  const max = questionCount * 5
  if (max === min) return 0
  return Math.round(((raw - min) / (max - min)) * 100)
}

export function scoreAnswers(
  questions: BankQuestion[],
  answers: Record<string, number>
): { raw: number; normalized: number; dimensions: Record<string, number> } {
  let raw = 0
  const dimRaw: Record<string, { sum: number; count: number }> = {}

  for (const q of questions) {
    let value = answers[q.key]
    if (!value || value < 1 || value > 5) value = 3
    if (q.reverse) value = 6 - value
    raw += value
    if (!dimRaw[q.dimension]) dimRaw[q.dimension] = { sum: 0, count: 0 }
    dimRaw[q.dimension].sum += value
    dimRaw[q.dimension].count += 1
  }

  const dimensions: Record<string, number> = {}
  for (const [dim, data] of Object.entries(dimRaw)) {
    dimensions[dim] = normalizeScore(data.sum, data.count)
  }

  return {
    raw,
    normalized: normalizeScore(raw, questions.length),
    dimensions,
  }
}
