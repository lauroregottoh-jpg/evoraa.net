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
export const MIN_RECOMMENDED_SCORE = 60
