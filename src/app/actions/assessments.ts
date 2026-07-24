"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import {
  ASSESSMENTS,
  scoreAnswers,
  type AssessmentSlug,
} from "@/lib/assessments/questionBank"
import { createNotification } from "@/app/actions/notifications"

const TEST_IDS: Record<AssessmentSlug, string> = {
  personality: "a1111111-1111-4111-8111-111111111111",
  spiritual: "a2222222-2222-4222-8222-222222222222",
  relationship: "a3333333-3333-4333-8333-333333333333",
}

function getQuestionId(slug: AssessmentSlug, index: number) {
  const map = { personality: 1, spiritual: 2, relationship: 3 } as const
  const t = map[slug]
  const i = index + 1
  return `00000000-0000-4000-8000-${String(t).padStart(4, "0")}${String(i).padStart(8, "0")}`
}

export async function getAssessmentsProgress() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié.", progress: [] as const, allDone: false }

  const { data: results } = await supabase
    .from("test_results")
    .select("test_id, score, profile_code, completed_at")
    .eq("user_id", user.id)

  const byTest = new Map((results ?? []).map((r) => [r.test_id, r]))

  const progress = (Object.keys(ASSESSMENTS) as AssessmentSlug[]).map((slug) => {
    const meta = ASSESSMENTS[slug]
    const row = byTest.get(TEST_IDS[slug])
    return {
      slug,
      name: meta.name,
      description: meta.description,
      questionCount: meta.questions.length,
      completed: Boolean(row),
      score: row?.score != null ? Number(row.score) : null,
      completedAt: row?.completed_at ?? null,
    }
  })

  const allDone = progress.every((p) => p.completed)
  return { progress, allDone }
}

export async function submitAssessmentAction(
  slug: AssessmentSlug,
  answers: Record<string, number>
) {
  const bank = ASSESSMENTS[slug]
  if (!bank) return { error: "Questionnaire inconnu." }

  for (const q of bank.questions) {
    const v = answers[q.key]
    if (!v || v < 1 || v > 5) {
      return { error: "Merci de répondre à toutes les questions." }
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." }

  const scored = scoreAnswers(bank.questions, answers)
  const testId = TEST_IDS[slug]

  for (const [idx, q] of bank.questions.entries()) {
    const questionId = getQuestionId(slug, idx)
    const value = q.reverse ? 6 - answers[q.key] : answers[q.key]
    const { data: existing } = await supabase
      .from("test_answers")
      .select("id")
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .maybeSingle()

    if (existing?.id) {
      await supabase
        .from("test_answers")
        .update({ answer_value: value })
        .eq("id", existing.id)
    } else {
      await supabase.from("test_answers").insert({
        user_id: user.id,
        question_id: questionId,
        answer_value: value,
      })
    }
  }

  const { data: existingResult } = await supabase
    .from("test_results")
    .select("id")
    .eq("user_id", user.id)
    .eq("test_id", testId)
    .maybeSingle()

  if (existingResult?.id) {
    const { error } = await supabase
      .from("test_results")
      .update({
        score: scored.normalized,
        dimensions: scored.dimensions,
        profile_code: dominantDimension(scored.dimensions),
        completed_at: new Date().toISOString(),
      })
      .eq("id", existingResult.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("test_results").insert({
      user_id: user.id,
      test_id: testId,
      score: scored.normalized,
      dimensions: scored.dimensions,
      profile_code: dominantDimension(scored.dimensions),
      completed_at: new Date().toISOString(),
    })
    if (error) return { error: error.message }
  }

  const { data: allResults } = await supabase
    .from("test_results")
    .select("test_id, score")
    .eq("user_id", user.id)

  const psychometric = {
    personality: findScore(allResults, TEST_IDS.personality),
    spiritual: findScore(allResults, TEST_IDS.spiritual),
    relationship: findScore(allResults, TEST_IDS.relationship),
    updated_at: new Date().toISOString(),
  }

  const completedCount = [
    psychometric.personality,
    psychometric.spiritual,
    psychometric.relationship,
  ].filter((s) => s != null).length

  await supabase
    .from("profiles")
    .update({
      psychometric_results: psychometric,
      onboarding_status: completedCount >= 3 ? "active" : "step3_tests",
      completion_percentage: completedCount >= 3 ? 95 : 85,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  await createNotification({
    userId: user.id,
    title: `Questionnaire « ${bank.name} » terminé`,
    body: `Score : ${scored.normalized}%. ${
      completedCount >= 3
        ? "Vous pouvez accéder pleinement aux suggestions KELIA."
        : "Continuez les questionnaires restants."
    }`,
  })

  revalidatePath("/assessments")
  revalidatePath("/compatibility")
  revalidatePath("/dashboard")

  return {
    success: true,
    score: scored.normalized,
    allDone: completedCount >= 3,
  }
}

function dominantDimension(dimensions: Record<string, number>) {
  let best = "balanced"
  let max = -1
  for (const [k, v] of Object.entries(dimensions)) {
    if (v > max) {
      max = v
      best = k
    }
  }
  return best
}

function findScore(
  rows: { test_id: string; score: number | null }[] | null,
  testId: string
) {
  const row = rows?.find((r) => r.test_id === testId)
  return row?.score != null ? Number(row.score) : null
}
