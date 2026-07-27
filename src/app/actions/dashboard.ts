"use server"

import { createClient } from "@/utils/supabase/server"
import { listConversations } from "@/app/actions/messaging"
import { getCompatibilitySuggestions } from "@/app/actions/matching"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { getUsageSnapshot, type UsageSnapshot } from "@/lib/billing/usage"
import { getSocialInsights, type SocialInsights } from "@/app/actions/social"

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
  affirmation: string
  affirmationSource: string
  dailyTip: { title: string; body: string }
  mission: DashboardMission
}

const AFFIRMATIONS = [
  {
    text: "Que tout ce que vous faites soit fait avec amour.",
    source: "1 Corinthiens 16.14",
  },
  {
    text: "Le discernement prend du temps. Aujourd'hui, une conversation honnête vaut mieux que dix swipes.",
    source: "KELIAA — rappel du jour",
  },
  {
    text: "Vous n'êtes pas en retard. Vous construisez quelque chose de digne.",
    source: "KELIAA — rappel du jour",
  },
  {
    text: "La paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs.",
    source: "Philippiens 4.7",
  },
]

const DAILY_TIPS = [
  {
    title: "Implique ta famille avec sagesse",
    body: "Le mariage concerne aussi les familles. Garde-les informés, sans tout décider sous pression.",
  },
  {
    title: "Une photo claire change tout",
    body: "Un visage visible inspire confiance et te rend trouvable dans les suggestions.",
  },
  {
    title: "Écoute avant de répondre",
    body: "Dans un message délicat : 1 minute d'écoute intérieure, puis une phrase honnête.",
  },
  {
    title: "Les 5 piliers avant la précipitation",
    body: "Complète tes questionnaires : le matching KELIAA devient vraiment utile.",
  },
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

  const [conversationsResult, suggestionsResult, assessments, usage, social] =
    await Promise.all([
      listConversations(),
      getCompatibilitySuggestions(6),
      getAssessmentsProgress(),
      getUsageSnapshot(user.id),
      getSocialInsights(),
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
      body: "Plus votre profil est clair, plus le matching sur vos 5 piliers est précis.",
      href: "/profile",
      cta: "Compléter",
      tone: "profile",
    })
  }
  if (assessmentsDone < 5) {
    nextSteps.push({
      id: "tests",
      title: `${assessmentsDone}/5 questionnaires de discernement`,
      body: "Personnalité, foi, conflits, vision du couple, finances — profils plus précis.",
      href: "/assessments",
      cta: "Continuer",
      tone: "tests",
    })
  }
  if (usage.isTrialBoost && usage.trialDaysRemaining != null) {
    nextSteps.push({
      id: "trial",
      title: `Période découverte enrichie — ${usage.trialDaysRemaining} jour(s) restant(s)`,
      body: "Quotas boostés : plus de conversations et suggestions. Profitez-en pour tester KELIAA.",
      href: "/compatibility",
      cta: "Explorer",
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
  const tipIndex = new Date().getDate() % DAILY_TIPS.length
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
      nextSteps: nextSteps.slice(0, 3),
      affirmation: AFFIRMATIONS[dayIndex].text,
      affirmationSource: AFFIRMATIONS[dayIndex].source,
      dailyTip: DAILY_TIPS[tipIndex],
      mission,
    },
  }
}
