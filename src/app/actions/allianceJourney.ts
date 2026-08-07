"use server"

import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { getCoffreState } from "@/app/actions/coffre"
import {
  computeMissionProgress,
  resolveAllianceLevel,
  type AllianceAchievementFlags,
  type AllianceMissionFlags,
} from "@/lib/alliance/journey"

export type AllianceJourneyState = {
  firstName: string
  isPaid: boolean
  memberSinceLabel: string
  daysRemaining: number | null
  suggestionsLimit: number
  evaQuestionsLimit: number
  conversationsRemaining: number
  coffreUnlocked: number
  missions: AllianceMissionFlags
  missionProgress: { done: number; total: number; percent: number }
  level: 1 | 2 | 3
  achievements: AllianceAchievementFlags
  assessmentsDone: number
  completionPercentage: number
}

export async function getAllianceJourneyState(): Promise<AllianceJourneyState | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const [usage, coffre, profileRes, testsRes, convRes] = await Promise.all([
    getUsageSnapshot(user.id),
    getCoffreState(),
    supabase
      .from("profiles")
      .select("first_name, completion_percentage, created_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("test_results")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("matches")
      .select("id")
      .or(`user_one.eq.${user.id},user_two.eq.${user.id}`)
      .limit(5),
  ])

  const profile = profileRes.data
  const firstName = (profile?.first_name as string) || "Membre"
  const completionPercentage = Number(profile?.completion_percentage ?? 0)
  const assessmentsDone = testsRes.count ?? 0
  const coffreUnlocked = coffre.access.unlockedIds?.length ?? 0
  const hasConversation = (convRes.data?.length ?? 0) > 0

  const memberSince = profile?.created_at
    ? new Date(profile.created_at as string)
    : new Date()
  const memberSinceLabel = memberSince.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })

  const missions: AllianceMissionFlags = {
    bilanSeen: assessmentsDone > 0,
    coffreStarted: coffreUnlocked > 0,
    evaAsked: false,
    profileComplete: completionPercentage >= 100,
  }

  // Eva "asked" — soft signal via localStorage is client-side; server stays false unless we add table later.
  const missionProgress = computeMissionProgress(missions)
  const level = resolveAllianceLevel(missionProgress.percent)

  const achievements: AllianceAchievementFlags = {
    bilan: assessmentsDone > 0,
    profil: completionPercentage >= 100,
    eva: false,
    pdf: coffreUnlocked > 0,
    conversation: hasConversation,
    compat85: false,
  }

  return {
    firstName,
    isPaid: Boolean(usage?.isPaid),
    memberSinceLabel:
      memberSinceLabel.charAt(0).toUpperCase() + memberSinceLabel.slice(1),
    daysRemaining: usage?.daysRemaining ?? null,
    suggestionsLimit: usage?.suggestionsLimit ?? 15,
    evaQuestionsLimit: usage?.evaQuestionsLimit ?? 20,
    conversationsRemaining: usage?.conversationsRemaining ?? 0,
    coffreUnlocked,
    missions,
    missionProgress,
    level,
    achievements,
    assessmentsDone,
    completionPercentage,
  }
}
