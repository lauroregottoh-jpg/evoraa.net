"use server"

import { createClient } from "@/utils/supabase/server"
import { listConversations } from "@/app/actions/messaging"
import { getCompatibilitySuggestions } from "@/app/actions/matching"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { getUsageSnapshot, type UsageSnapshot } from "@/lib/billing/usage"

export type DashboardNextStep = {
  id: string
  title: string
  body: string
  href: string
  cta: string
  tone: "photo" | "profile" | "tests" | "upgrade" | "renew"
}

export type DashboardData = {
  firstName: string
  completionPercentage: number
  isVerified: boolean
  retreatMode: boolean
  hasAvatar: boolean
  unreadMessages: number
  conversationCount: number
  topHarmonyCount: number
  topHarmonyScore: number
  latestPartnerName: string | null
  latestConversationId: string | null
  assessmentsDone: number
  assessmentsTotal: number
  topSuggestions: Array<{
    profileId: string
    name: string
    score: number
    city: string | null
  }>
  usage: UsageSnapshot
  nextSteps: DashboardNextStep[]
  affirmation: string
}

const AFFIRMATIONS = [
  "Le discernement prend du temps. Aujourd'hui, une conversation honnête vaut mieux que dix swipes.",
  "Vous n'êtes pas en retard. Vous construisez quelque chose de digne.",
  "La compatibilité se révèle dans la clarté — pas dans la précipitation.",
  "Votre profil sincère attire les bonnes personnes. Continuez d'être vrai(e).",
]

export async function getDashboardData(): Promise<{
  data?: DashboardData
  error?: string
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "first_name, completion_percentage, is_verified, identity_verified, privacy_settings, avatar_url"
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const privacy =
    profile.privacy_settings && typeof profile.privacy_settings === "object"
      ? (profile.privacy_settings as Record<string, unknown>)
      : {}

  const [conversationsResult, suggestionsResult, assessments, usage] =
    await Promise.all([
      listConversations(),
      getCompatibilitySuggestions(6),
      getAssessmentsProgress(),
      getUsageSnapshot(user.id),
    ])

  if (!usage) return { error: "Impossible de charger vos quotas." }

  const conversations = conversationsResult.conversations ?? []
  const unreadMessages = conversations.filter((c) => c.unread).length
  const latest = conversations[0]
  const suggestions = suggestionsResult.suggestions ?? []
  const highHarmony = suggestions.filter((s) => s.harmonyScore >= 75)
  const progress = assessments.progress ?? []
  const assessmentsDone = progress.filter((p) => p.completed).length

  const hasAvatar = Boolean(profile.avatar_url)
  const completion = profile.completion_percentage ?? 0

  const nextSteps: DashboardNextStep[] = []
  if (!hasAvatar) {
    nextSteps.push({
      id: "photo",
      title: "Votre profil sans photo passe inaperçu",
      body: "Ajoutez une photo pour apparaître dans les suggestions et inspirer confiance.",
      href: "/profile",
      cta: "Ajouter",
      tone: "photo",
    })
  }
  if (completion < 70) {
    nextSteps.push({
      id: "profile",
      title: `Profil complété à ${completion}%`,
      body: "Plus votre profil est clair, plus le matching à 3 piliers est précis.",
      href: "/profile",
      cta: "Compléter",
      tone: "profile",
    })
  }
  if (assessmentsDone < 3) {
    nextSteps.push({
      id: "tests",
      title: `${assessmentsDone}/3 tests de compatibilité`,
      body: "Personnalité, foi & valeurs, relationnel : le cœur du matching KELIAA.",
      href: "/assessments",
      cta: "Continuer",
      tone: "tests",
    })
  }
  if (!usage.isPaid && usage.conversationsRemaining <= 1) {
    nextSteps.push({
      id: "upgrade",
      title: "Vous approchez de la limite Découverte",
      body: "Passez Alliance pour accélérer : plus de conversations, messages et suggestions.",
      href: "/billing",
      cta: "Découvrir Alliance",
      tone: "upgrade",
    })
  }
  if (usage.renewSoon) {
    nextSteps.push({
      id: "renew",
      title: `Votre Alliance expire dans ${usage.daysRemaining} jour(s)`,
      body: "Renouvelez maintenant pour ne pas perdre l'élan de vos échanges.",
      href: "/billing",
      cta: "Renouveler",
      tone: "renew",
    })
  }

  const dayIndex = new Date().getDate() % AFFIRMATIONS.length

  return {
    data: {
      firstName: profile.first_name || "Membre",
      completionPercentage: completion,
      isVerified: Boolean(profile.is_verified || profile.identity_verified),
      retreatMode: Boolean(privacy.retreat_mode),
      hasAvatar,
      unreadMessages,
      conversationCount: conversations.length,
      topHarmonyCount: highHarmony.length || suggestions.length,
      topHarmonyScore: suggestions[0]?.harmonyScore ?? 0,
      latestPartnerName: latest?.partnerName ?? null,
      latestConversationId: latest?.id ?? null,
      assessmentsDone,
      assessmentsTotal: 3,
      topSuggestions: suggestions.slice(0, 4).map((s) => ({
        profileId: s.id,
        name: s.name || "Membre",
        score: s.harmonyScore,
        city: s.city ?? null,
      })),
      usage,
      nextSteps: nextSteps.slice(0, 3),
      affirmation: AFFIRMATIONS[dayIndex],
    },
  }
}
