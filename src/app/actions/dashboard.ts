"use server"

import { createClient } from "@/utils/supabase/server"
import { listConversations } from "@/app/actions/messaging"
import { getCompatibilitySuggestions } from "@/app/actions/matching"

export type DashboardData = {
  firstName: string
  completionPercentage: number
  isVerified: boolean
  retreatMode: boolean
  unreadMessages: number
  conversationCount: number
  topHarmonyCount: number
  topHarmonyScore: number
  latestPartnerName: string | null
  latestConversationId: string | null
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
      "first_name, completion_percentage, is_verified, identity_verified, privacy_settings"
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const privacy =
    profile.privacy_settings && typeof profile.privacy_settings === "object"
      ? (profile.privacy_settings as Record<string, unknown>)
      : {}

  const [conversationsResult, suggestionsResult] = await Promise.all([
    listConversations(),
    getCompatibilitySuggestions(5),
  ])

  const conversations = conversationsResult.conversations ?? []
  const unreadMessages = conversations.filter((c) => c.unread).length
  const latest = conversations[0]
  const suggestions = suggestionsResult.suggestions ?? []
  const highHarmony = suggestions.filter((s) => s.harmonyScore >= 75)

  return {
    data: {
      firstName: profile.first_name || "Membre",
      completionPercentage: profile.completion_percentage ?? 0,
      isVerified: Boolean(profile.is_verified || profile.identity_verified),
      retreatMode: Boolean(privacy.retreat_mode),
      unreadMessages,
      conversationCount: conversations.length,
      topHarmonyCount: highHarmony.length || suggestions.length,
      topHarmonyScore: suggestions[0]?.harmonyScore ?? 0,
      latestPartnerName: latest?.partnerName ?? null,
      latestConversationId: latest?.id ?? null,
    },
  }
}
