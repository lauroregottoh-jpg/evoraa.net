"use server"

import { createClient } from "@/utils/supabase/server"
import { listConversations } from "@/app/actions/messaging"
import { getCompatibilitySuggestions } from "@/app/actions/matching"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { getUsageSnapshot, type UsageSnapshot } from "@/lib/billing/usage"
import { getSocialInsights, type SocialInsights } from "@/app/actions/social"
import { loadPublicCms } from "@/lib/admin/loadCms"
import type { AdSlot } from "@/lib/admin/cms"
import {
  getDailyEditorialPack,
  type EditorialItem,
} from "@/lib/editorial/library"

export type DashboardNextStep = {
  id: string
  title: string
  body: string
  href: string
  cta: string
  tone: "photo" | "profile" | "tests" | "upgrade" | "renew"
}

export type DashboardMission = {
  id: string
  title: string
  body: string
  href: string
  cta: string
  kind: "tests" | "discover" | "photo" | "message" | "done"
}

export type DashboardData = {
  firstName: string
  lastName: string
  userId: string
  completionPercentage: number
  isVerified: boolean
  retreatMode: boolean
  hasAvatar: boolean
  avatarUrl: string | null
  gender: "M" | "F" | null
  memberSinceLabel: string
  unreadMessages: number
  conversationCount: number
  topHarmonyCount: number
  topHarmonyScore: number
  latestPartnerName: string | null
  latestConversationId: string | null
  assessmentsDone: number
  assessmentsTotal: number
  assessmentProgress: Array<{ slug: string; completed: boolean; name: string }>
  topSuggestions: Array<{
    profileId: string
    name: string
    age: number
    score: number
    city: string | null
    photoUrl: string | null
    community: string | null
    isVerified: boolean
  }>
  usage: UsageSnapshot
  social: SocialInsights
  nextSteps: DashboardNextStep[]
  dailyPrimary: EditorialItem
  mission: DashboardMission
  selectionTitle: string
  selectionSubtitle: string
  greetingPrefix: string
  sponsoredAds: AdSlot[]
}

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
      "first_name, last_name, gender, created_at, completion_percentage, is_verified, identity_verified, privacy_settings, avatar_url, onboarding_status"
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const privacy =
    profile.privacy_settings && typeof profile.privacy_settings === "object"
      ? (profile.privacy_settings as Record<string, unknown>)
      : {}

  const [conversationsResult, suggestionsResult, assessments, usage, social, cms] =
    await Promise.all([
      listConversations(),
      getCompatibilitySuggestions(6),
      getAssessmentsProgress(),
      getUsageSnapshot(user.id),
      getSocialInsights(),
      loadPublicCms(),
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
  const genderRaw = String(profile.gender || "").toUpperCase()
  const gender = genderRaw === "M" || genderRaw === "F" ? genderRaw : null
  const memberSince = profile.created_at
    ? new Date(profile.created_at as string)
    : new Date()
  const memberSinceLabel = memberSince.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
  const memberSinceFormatted =
    memberSinceLabel.charAt(0).toUpperCase() + memberSinceLabel.slice(1)
  const { computeProfileCompletion, isOnboardingProfileDone } = await import(
    "@/lib/profile/completion"
  )
  const completion = computeProfileCompletion({
    onboardingDone: isOnboardingProfileDone(profile.onboarding_status as string | null),
    assessmentsDone,
  })
  // Keep DB in sync when legacy % was inflated (e.g. 78 without tests)
  if ((profile.completion_percentage ?? 0) !== completion) {
    void supabase
      .from("profiles")
      .update({ completion_percentage: completion })
      .eq("user_id", user.id)
  }
  const texts = cms.texts

  const nextSteps: DashboardNextStep[] = []
  // Toujours visible (rappel produit) — dismissible côté client
  nextSteps.push({
    id: "mutual-likes",
    title: "Like en retour = conversation débloquée",
    body: "Quand quelqu’un aime votre profil et que vous aimez le sien en retour, la messagerie s’ouvre. Complétez aussi vos tests pour un matching juste.",
    href: "/compatibility",
    cta: "Voir les profils",
    tone: "tests",
  })
  if (!hasAvatar) {
    nextSteps.push({
      id: "photo",
      title: texts.banner_photo_title,
      body: texts.banner_photo_body,
      href: "/profile",
      cta: "Ajouter",
      tone: "photo",
    })
  }
  if (assessmentsDone < 5) {
    nextSteps.push({
      id: "tests",
      title: `Urgent : ${assessmentsDone}/5 tests — profil à ${completion}%`,
      body: "Sans les questionnaires, impossible de rencontrer quelqu’un qui correspond vraiment à votre vision. Complétez-les pour activer le Matching.",
      href: "/assessments",
      cta: "Faire les tests",
      tone: "tests",
    })
  } else if (completion < 100) {
    nextSteps.push({
      id: "profile",
      title: `Profil à ${completion}% — presque prêt`,
      body: "Ajoutez une photo claire pour finaliser votre visibilité.",
      href: "/profile",
      cta: "Compléter",
      tone: "profile",
    })
  }
  if (usage.isTrialBoost && usage.trialDaysRemaining != null) {
    nextSteps.push({
      id: "trial",
      title: `Période découverte enrichie — ${usage.trialDaysRemaining} jour(s) restant(s)`,
      body: "Quotas boostés : plus de conversations et suggestions. Profitez-en pour tester Keliaa.",
      href: "/compatibility",
      cta: "Explorer",
      tone: "tests",
    })
  }
  if (!usage.isPaid && usage.conversationsRemaining <= 1) {
    nextSteps.push({
      id: "upgrade",
      title: texts.banner_alliance_title,
      body: texts.banner_alliance_body,
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

  const editorial = getDailyEditorialPack()
  const assessmentProgress = progress.map((p) => ({
    slug: p.slug,
    completed: p.completed,
    name: p.name,
  }))
  const nextTest = progress.find((p) => !p.completed)

  let mission: DashboardMission
  if (!hasAvatar) {
    mission = {
      id: "photo",
      title: "Ajoutez votre photo",
      body: "Un visage clair inspire confiance et vous rend visible dans les suggestions.",
      href: "/profile",
      cta: "Ajouter",
      kind: "photo",
    }
  } else if (nextTest) {
    mission = {
      id: "tests",
      title: `Mission : ${nextTest.name}`,
      body: "Scénarios courts — environ 5 à 8 minutes. Chaque réponse affine votre matching.",
      href: `/assessments/${nextTest.slug}`,
      cta: "Commencer",
      kind: "tests",
    }
  } else if (unreadMessages > 0 && latest?.id) {
    mission = {
      id: "message",
      title: "Répondre à vos dialogues",
      body: `${unreadMessages} message(s) non lu(s). Une réponse honnête vaut mieux qu'une réponse rapide.`,
      href: `/messages/${latest.id}`,
      cta: "Ouvrir",
      kind: "message",
    }
  } else if (suggestions.length > 0) {
    mission = {
      id: "discover",
      title: `${highHarmony.length || suggestions.length} profil(s) à découvrir`,
      body: "Lisez le diagnostic EVA, puis écrivez si le cœur est en paix.",
      href: "/compatibility",
      cta: "Découvrir",
      kind: "discover",
    }
  } else {
    mission = {
      id: "done",
      title: "Votre espace est prêt",
      body: "Explorez l'Académie, posez une question à EVA, ou affinez votre profil.",
      href: "/academie-mariage",
      cta: "Continuer",
      kind: "done",
    }
  }

  return {
    data: {
      firstName: (profile.first_name || "").trim(),
      lastName: (profile.last_name || "").trim(),
      userId: user.id,
      completionPercentage: completion,
      isVerified: Boolean(profile.is_verified || profile.identity_verified),
      retreatMode: Boolean(privacy.retreat_mode),
      hasAvatar,
      avatarUrl: (profile.avatar_url as string) || null,
      gender,
      memberSinceLabel: memberSinceFormatted,
      unreadMessages,
      conversationCount: conversations.length,
      topHarmonyCount: highHarmony.length || suggestions.length,
      topHarmonyScore: suggestions[0]?.harmonyScore ?? 0,
      latestPartnerName: latest?.partnerName ?? null,
      latestConversationId: latest?.id ?? null,
      assessmentsDone,
      assessmentsTotal: 5,
      assessmentProgress,
      topSuggestions: suggestions.slice(0, 4).map((s) => ({
        profileId: s.id,
        name: s.name || "Membre",
        age: s.age || 0,
        score: s.harmonyScore,
        city: s.city ?? null,
        photoUrl: s.photoUrl ?? null,
        community: s.community ?? null,
        isVerified: Boolean(s.isVerified),
      })),
      usage,
      social,
      nextSteps: nextSteps.slice(0, 4),
      dailyPrimary: editorial.primary,
      mission,
      selectionTitle: texts.selection_title,
      selectionSubtitle: texts.selection_subtitle,
      greetingPrefix: texts.home_greeting_prefix,
      sponsoredAds: cms.ads.filter(
        (a) => a.active && (a.slot === "dashboard" || a.slot === "global")
      ),
    },
  }
}
