import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import { ASSESSMENT_ORDER, ASSESSMENTS } from "@/lib/assessments/questionBank"
import type { MatchableProfile } from "@/lib/matching/types"

export const MESSAGE_CREDIT_TTL_DAYS = 20
export const MESSAGE_CREDIT_PER_TEST = 10
export const MESSAGE_CREDIT_PER_INVITE_SENT = 5
export const MESSAGE_CREDIT_PER_INVITE_ACCEPTED = 5
export const ASSESSMENT_INVITES_PER_DAY = 5

export function completedAssessmentSlugs(
  psychometric: MatchableProfile["psychometric_results"] | null | undefined
): AssessmentSlug[] {
  if (!psychometric) return []
  return ASSESSMENT_ORDER.filter((slug) => {
    const v = psychometric[slug]
    return typeof v === "number" && Number.isFinite(v)
  })
}

export function missingAssessmentSlugs(
  psychometric: MatchableProfile["psychometric_results"] | null | undefined
): AssessmentSlug[] {
  const done = new Set(completedAssessmentSlugs(psychometric))
  return ASSESSMENT_ORDER.filter((slug) => !done.has(slug))
}

export function assessmentTitle(slug: AssessmentSlug): string {
  return ASSESSMENTS[slug]?.name || slug
}
