import type { AssessmentSlug } from "@/lib/assessments/questionBank"

/** IDs stables des questionnaires (alignés sur test_results.test_id). */
export const TEST_IDS: Record<AssessmentSlug, string> = {
  personality: "a1111111-1111-4111-8111-111111111111",
  spiritual: "a2222222-2222-4222-8222-222222222222",
  relationship: "a3333333-3333-4333-8333-333333333333",
  couple_life: "a4444444-4444-4444-8444-444444444444",
  finances: "a5555555-5555-4555-8555-555555555555",
}
