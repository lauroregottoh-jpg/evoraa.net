"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import {
  ASSESSMENTS,
  ASSESSMENT_ORDER,
  scoreAnswers,
  type AssessmentSlug,
} from "@/lib/assessments/questionBank"
import { ASSESSMENT_RETAKE_COOLDOWN_DAYS } from "@/lib/assessments/constants"
import {
  canRetakeAssessment,
  formatRetakeDate,
  getNextRetakeDate,
} from "@/lib/assessments/retake"
import { buildGrowthAxes } from "@/lib/assessments/growth"
import { createNotification } from "@/app/actions/notifications"

const TEST_IDS: Record<AssessmentSlug, string> = {
  personality: "a1111111-1111-4111-8111-111111111111",
  spiritual: "a2222222-2222-4222-8222-222222222222",
  relationship: "a3333333-3333-4333-8333-333333333333",
  couple_life: "a4444444-4444-4444-8444-444444444444",
  finances: "a5555555-5555-4555-8555-555555555555",
}

const TEST_INDEX: Record<AssessmentSlug, number> = {
  personality: 1,
  spiritual: 2,
  relationship: 3,
  couple_life: 4,
  finances: 5,
}

function getQuestionId(slug: AssessmentSlug, index: number) {
  const t = TEST_INDEX[slug]
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

  const progress = ASSESSMENT_ORDER.map((slug) => {
    const meta = ASSESSMENTS[slug]
    const row = byTest.get(TEST_IDS[slug])
    const completedAt = row?.completed_at ?? null
    const canRetake = canRetakeAssessment(completedAt)
    const nextRetake = getNextRetakeDate(completedAt)

    return {
      slug,
      name: meta.name,
      description: meta.description,
      questionCount: meta.questions.length,
      completed: Boolean(row),
      score: row?.score != null ? Number(row.score) : null,
      completedAt,
      canRetake,
      canStart: !row || canRetake,
      nextRetakeAt: nextRetake && !canRetake ? nextRetake.toISOString() : null,
      lockMessage:
        row && !canRetake && nextRetake
          ? `Mise à jour possible à partir du ${formatRetakeDate(nextRetake)} (tous les ${ASSESSMENT_RETAKE_COOLDOWN_DAYS} jours).`
          : null,
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

  const testId = TEST_IDS[slug]
  const { data: existingResult } = await supabase
    .from("test_results")
    .select("id, completed_at")
    .eq("user_id", user.id)
    .eq("test_id", testId)
    .maybeSingle()

  if (existingResult?.completed_at && !canRetakeAssessment(existingResult.completed_at)) {
    const next = getNextRetakeDate(existingResult.completed_at)
    return {
      error: next
        ? `Ce questionnaire a déjà été validé. Prochaine mise à jour : ${formatRetakeDate(next)}.`
        : "Ce questionnaire ne peut pas être refait pour le moment.",
    }
  }

  const scored = scoreAnswers(bank.questions, answers)

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
      const { error: answerError } = await supabase
        .from("test_answers")
        .update({ answer_value: value })
        .eq("id", existing.id)
      if (answerError) return { error: answerError.message }
    } else {
      const { error: answerError } = await supabase.from("test_answers").insert({
        user_id: user.id,
        question_id: questionId,
        answer_value: value,
      })
      if (answerError) return { error: answerError.message }
    }
  }

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
    .select("test_id, score, dimensions")
    .eq("user_id", user.id)

  const dimensionsByPillar: Record<string, Record<string, number>> = {}
  for (const slug of ASSESSMENT_ORDER) {
    const row = allResults?.find((r) => r.test_id === TEST_IDS[slug])
    if (row?.dimensions && typeof row.dimensions === "object") {
      dimensionsByPillar[slug] = row.dimensions as Record<string, number>
    }
  }

  const psychometric = {
    personality: findScore(allResults, TEST_IDS.personality),
    spiritual: findScore(allResults, TEST_IDS.spiritual),
    relationship: findScore(allResults, TEST_IDS.relationship),
    couple_life: findScore(allResults, TEST_IDS.couple_life),
    finances: findScore(allResults, TEST_IDS.finances),
    dimensions: dimensionsByPillar,
    pillars_completed: ASSESSMENT_ORDER.filter(
      (s) => findScore(allResults, TEST_IDS[s]) != null
    ).length,
    updated_at: new Date().toISOString(),
  }

  const completedCount = psychometric.pillars_completed

  const { computeProfileCompletion } = await import("@/lib/profile/completion")

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("trial_ends_at")
    .eq("user_id", user.id)
    .maybeSingle()

  const profileUpdate: Record<string, unknown> = {
    psychometric_results: psychometric,
    onboarding_status: completedCount >= 5 ? "active" : "step3_tests",
    completion_percentage: computeProfileCompletion({
      onboardingDone: true,
      assessmentsDone: completedCount,
    }),
    updated_at: new Date().toISOString(),
  }

  if (completedCount >= 5 && !currentProfile?.trial_ends_at) {
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 30)
    profileUpdate.trial_ends_at = trialEnd.toISOString()
  }

  await supabase.from("profiles").update(profileUpdate).eq("user_id", user.id)

  await createNotification({
    userId: user.id,
    title: `Questionnaire « ${bank.name} » validé`,
    body: `Profil enrichi (${scored.normalized}%). ${
      completedCount >= 5
        ? "Les 5 piliers sont complétés — matching optimisé."
        : `${completedCount}/5 questionnaires complétés.`
    }`,
  })

  revalidatePath("/assessments")
  revalidatePath("/compatibility")
  revalidatePath("/dashboard")

  return {
    success: true,
    score: scored.normalized,
    allDone: completedCount >= 5,
  }
}

export async function getMyGrowthAxes() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { axes: [] as ReturnType<typeof buildGrowthAxes>, error: "Non authentifié." }

  const { data: profile } = await supabase
    .from("profiles")
    .select("psychometric_results")
    .eq("user_id", user.id)
    .maybeSingle()

  const psych = profile?.psychometric_results as {
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
  } | null

  return { axes: buildGrowthAxes(psych) }
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
