export type MatchingIndicators = {
  spiritual_practice?: string | null
  marriage_vision?: string | null
  family_project?: string | null
  communication_style?: string | null
  age_declared?: number | null
}

export type MatchableProfile = {
  id: string
  user_id: string
  first_name: string | null
  gender: string | null
  birth_date: string | null
  city: string | null
  country: string | null
  denomination: string | null
  attendance_frequency: string | null
  biography: string | null
  testimony: string | null
  matching_indicators: MatchingIndicators | null
  psychometric_results: {
    personality?: number | null
    spiritual?: number | null
    relationship?: number | null
    couple_life?: number | null
    finances?: number | null
    /** Scores par dimension à l'intérieur de chaque pilier — matching fin. */
    dimensions?: Partial<
      Record<
        "personality" | "spiritual" | "relationship" | "couple_life" | "finances",
        Record<string, number>
      >
    > | null
    pillars_completed?: number | null
    updated_at?: string | null
  } | null
  completion_percentage: number | null
  moderation_status: string | null
  onboarding_status: string | null
  deleted_at: string | null
  is_verified: boolean | null
  avatar_url: string | null
}

export type ScoredMatch = {
  profile: MatchableProfile
  score: number
  reasons: string[]
  pillars: {
    spirituality: string
    familyVision: string
    dialogue: string
  }
  level: "excellent" | "high" | "moderate" | "low"
}

export const FREE_DAILY_SUGGESTIONS = 3
/** Seuil minimum pour apparaître en suggestion (après questionnaires). */
export const MIN_RECOMMENDED_SCORE = 62
/** Un score ≥ 90 exige au moins N piliers partagés. */
export const HIGH_SCORE_MIN_PILLARS = 4
/** Un score ≥ 95 exige au moins N piliers partagés. */
export const EXCELLENT_SCORE_MIN_PILLARS = 5
