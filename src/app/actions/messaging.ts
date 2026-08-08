"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getUserEntitlements } from "@/lib/billing/entitlements"
import {
  consumeLoyaltyBonusMessage,
  getLoyaltyAccount,
} from "@/lib/loyalty/account"

export type ConversationListItem = {
  id: string
  partnerName: string
  partnerProfileId: string
  harmonyScore: number
  lastMessage: string
  timestamp: string
  unread: boolean
}

export type ChatMessageDTO = {
  id: string
  senderId: string
  text: string
  createdAt: string
  isRead: boolean
  isMine: boolean
}

export type ConversationRoomDTO = {
  id: string
  partnerName: string
  partnerProfileId: string
  partnerUserId: string
  harmonyScore: number
  messages: ChatMessageDTO[]
  /** Messages envoyés par moi (pour quota) */
  messageCount: number
  freeLimit: number
  /** Solde fidélité (utilisable seulement si Alliance) */
  bonusMessagesRemaining: number
  hasMoreOlder: boolean
}

function formatListTime(iso: string | null): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (sameDay) {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return "Hier"
  }
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

async function ensureMatch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  viewerId: string,
  partnerUserId: string,
  scoreHint?: number
) {
  const { data: existingAsOne } = await supabase
    .from("matches")
    .select("id, compatibility_score, status")
    .eq("user_one", viewerId)
    .eq("user_two", partnerUserId)
    .maybeSingle()

  if (existingAsOne) {
    if (existingAsOne.status !== "accepted") {
      await supabase
        .from("matches")
        .update({ status: "accepted" })
        .eq("id", existingAsOne.id)
    }
    return existingAsOne.id as string
  }

  const { data: existingAsTwo } = await supabase
    .from("matches")
    .select("id, compatibility_score, status")
    .eq("user_one", partnerUserId)
    .eq("user_two", viewerId)
    .maybeSingle()

  if (existingAsTwo) {
    if (existingAsTwo.status !== "accepted") {
      await supabase
        .from("matches")
        .update({ status: "accepted" })
        .eq("id", existingAsTwo.id)
    }
    return existingAsTwo.id as string
  }

  const { data: created, error } = await supabase
    .from("matches")
    .insert({
      user_one: viewerId,
      user_two: partnerUserId,
      compatibility_score: scoreHint ?? null,
      status: "accepted",
    })
    .select("id")
    .single()

  if (error || !created) {
    throw new Error(error?.message || "Impossible de créer le match.")
  }

  return created.id as string
}

export async function startConversationFromProfile(profileId: string): Promise<{
  error?: string
  conversationId?: string
}> {
  const { supabase, user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté." }

  const { data: partner, error: partnerError } = await supabase
    .from("profiles")
    .select("id, user_id")
    .eq("id", profileId)
    .maybeSingle()

  if (partnerError || !partner) {
    return { error: "Profil partenaire introuvable." }
  }

  if (partner.user_id === user.id) {
    return { error: "Vous ne pouvez pas vous écrire à vous-même." }
  }

  try {
    const entitlements = await getUserEntitlements(user.id)
    const matchId = await ensureMatch(supabase, user.id, partner.user_id)

    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("match_id", matchId)
      .maybeSingle()

    if (existingConv?.id) {
      return { conversationId: existingConv.id }
    }

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const { data: userMatches } = await supabase
      .from("matches")
      .select("id")
      .or(`user_one.eq.${user.id},user_two.eq.${user.id}`)

    const matchIds = (userMatches ?? []).map((m) => m.id)
    if (matchIds.length > 0) {
      const { count: convCount } = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .in("match_id", matchIds)
        .gte("created_at", monthStart.toISOString())

      if ((convCount ?? 0) >= entitlements.limits.conversationsPerMonth) {
        return {
          error: `Limite de conversations atteinte pour votre offre ${entitlements.planName}. Passez Alliance sur /billing.`,
        }
      }
    }

    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ match_id: matchId })
      .select("id")
      .single()

    if (error || !created) {
      return { error: error?.message || "Impossible d'ouvrir la conversation." }
    }

    revalidatePath("/messages")
    return { conversationId: created.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inattendue." }
  }
}

export async function listConversations(): Promise<{
  error?: string
  conversations: ConversationListItem[]
}> {
  const { supabase, user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté.", conversations: [] }

  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("id, user_one, user_two, compatibility_score")
    .or(`user_one.eq.${user.id},user_two.eq.${user.id}`)

  if (matchError) {
    return { error: matchError.message, conversations: [] }
  }

  if (!matches?.length) {
    return { conversations: [] }
  }

  const matchIds = matches.map((m) => m.id)
  const { data: conversations, error: convError } = await supabase
    .from("conversations")
    .select("id, match_id, created_at")
    .in("match_id", matchIds)

  if (convError) {
    return { error: convError.message, conversations: [] }
  }

  if (!conversations?.length) {
    return { conversations: [] }
  }

  const partnerUserIds = matches.map((m) =>
    m.user_one === user.id ? m.user_two : m.user_one
  )

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, user_id, first_name, last_name")
    .in("user_id", partnerUserIds)

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )

  const profileByUser = new Map((profiles ?? []).map((p) => [p.user_id, p]))

  const conversationIds = conversations.map((c) => c.id as string)
  const { data: extras, error: extrasError } = await supabase.rpc(
    "conversation_list_extras" as never,
    {
      p_user_id: user.id,
      p_conversation_ids: conversationIds,
    } as never
  )

  if (extrasError) {
    console.error("[listConversations] extras", extrasError.message)
  }

  type ExtraRow = {
    conversation_id: string
    last_message: string | null
    last_at: string | null
    unread_count: number | string | null
  }
  const extraByConv = new Map<string, ExtraRow>()
  for (const row of (extras as ExtraRow[] | null) ?? []) {
    extraByConv.set(row.conversation_id, row)
  }

  const items: ConversationListItem[] = []

  for (const conv of conversations) {
    const match = matches.find((m) => m.id === conv.match_id)
    if (!match) continue
    const partnerUserId = match.user_one === user.id ? match.user_two : match.user_one
    const partner = profileByUser.get(partnerUserId)
    if (
      partner &&
      isHiddenOperatorProfile(
        partner.first_name as string | null,
        partner.last_name as string | null
      )
    ) {
      continue
    }
    const extra = extraByConv.get(conv.id)

    items.push({
      id: conv.id,
      partnerName: partner?.first_name || "Membre",
      partnerProfileId: partner?.id || "",
      harmonyScore: Math.round(Number(match.compatibility_score ?? 0)),
      lastMessage:
        extra?.last_message ||
        "Conversation ouverte — écrivez le premier message.",
      timestamp: formatListTime(extra?.last_at ?? conv.created_at),
      unread: Number(extra?.unread_count ?? 0) > 0,
    })
  }

  items.sort((a, b) => {
    if (a.unread !== b.unread) return a.unread ? -1 : 1
    return 0
  })

  return { conversations: items }
}

export async function getConversationRoom(conversationId: string): Promise<{
  error?: string
  room?: ConversationRoomDTO
}> {
  const { supabase, user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté." }

  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("id, match_id")
    .eq("id", conversationId)
    .maybeSingle()

  if (convError || !conversation) {
    return { error: "Conversation introuvable." }
  }

  const { data: match } = await supabase
    .from("matches")
    .select("id, user_one, user_two, compatibility_score")
    .eq("id", conversation.match_id)
    .maybeSingle()

  if (!match || (match.user_one !== user.id && match.user_two !== user.id)) {
    return { error: "Accès non autorisé à cette conversation." }
  }

  const partnerUserId = match.user_one === user.id ? match.user_two : match.user_one
  const { data: partner } = await supabase
    .from("profiles")
    .select("id, user_id, first_name, last_name")
    .eq("user_id", partnerUserId)
    .maybeSingle()

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )
  if (
    partner &&
    isHiddenOperatorProfile(
      partner.first_name as string | null,
      partner.last_name as string | null
    )
  ) {
    return { error: "Conversation introuvable." }
  }

  const PAGE = 80
  const { data: messages, error: msgError } = await supabase
    .from("messages")
    .select("id, sender_id, message, is_read, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(PAGE + 1)

  if (msgError) {
    return { error: msgError.message }
  }

  const hasMoreOlder = (messages?.length ?? 0) > PAGE
  const pageRows = (messages ?? []).slice(0, PAGE).reverse()

  // Mark partner messages as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false)

  const mapped: ChatMessageDTO[] = pageRows.map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    text: m.message,
    createdAt: m.created_at ?? new Date().toISOString(),
    isRead: Boolean(m.is_read),
    isMine: m.sender_id === user.id,
  }))

  const entitlements = await getUserEntitlements(user.id)
  const messageLimit = entitlements.limits.messagesPerConversation
  const loyalty = await getLoyaltyAccount(user.id, {
    isPaid: entitlements.isPaid,
  })
  const { count: myMessageCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("sender_id", user.id)

  return {
    room: {
      id: conversationId,
      partnerName: partner?.first_name || "Membre",
      partnerProfileId: partner?.id || "",
      partnerUserId,
      harmonyScore: Math.round(Number(match.compatibility_score ?? 0)),
      messages: mapped,
      messageCount: myMessageCount ?? mapped.filter((m) => m.isMine).length,
      freeLimit: messageLimit,
      bonusMessagesRemaining: entitlements.isPaid
        ? loyalty.bonusMessagesBalance
        : 0,
      hasMoreOlder,
    },
  }
}

export async function loadOlderMessagesAction(
  conversationId: string,
  beforeCreatedAt: string
): Promise<{ error?: string; messages?: ChatMessageDTO[]; hasMoreOlder?: boolean }> {
  const { supabase, user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté." }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, match_id")
    .eq("id", conversationId)
    .maybeSingle()
  if (!conversation) return { error: "Conversation introuvable." }

  const { data: match } = await supabase
    .from("matches")
    .select("user_one, user_two")
    .eq("id", conversation.match_id)
    .maybeSingle()
  if (!match || (match.user_one !== user.id && match.user_two !== user.id)) {
    return { error: "Accès non autorisé à cette conversation." }
  }

  const PAGE = 80
  const { data: rows, error } = await supabase
    .from("messages")
    .select("id, sender_id, message, is_read, created_at")
    .eq("conversation_id", conversationId)
    .lt("created_at", beforeCreatedAt)
    .order("created_at", { ascending: false })
    .limit(PAGE + 1)

  if (error) return { error: error.message }

  const hasMoreOlder = (rows?.length ?? 0) > PAGE
  const pageRows = (rows ?? []).slice(0, PAGE).reverse()

  return {
    messages: pageRows.map((m) => ({
      id: m.id,
      senderId: m.sender_id,
      text: m.message,
      createdAt: m.created_at ?? new Date().toISOString(),
      isRead: Boolean(m.is_read),
      isMine: m.sender_id === user.id,
    })),
    hasMoreOlder,
  }
}

export async function sendMessageAction(
  conversationId: string,
  text: string
): Promise<{ error?: string; message?: ChatMessageDTO }> {
  const trimmed = text.trim()
  if (!trimmed) return { error: "Message vide." }
  if (trimmed.length > 2000) return { error: "Message trop long (max 2000 caractères)." }

  const { supabase, user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté." }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, match_id")
    .eq("id", conversationId)
    .maybeSingle()

  if (!conversation) return { error: "Conversation introuvable." }

  const { data: match } = await supabase
    .from("matches")
    .select("id, user_one, user_two")
    .eq("id", conversation.match_id)
    .maybeSingle()

  if (!match || (match.user_one !== user.id && match.user_two !== user.id)) {
    return { error: "Accès non autorisé à cette conversation." }
  }

  const { count: myCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("sender_id", user.id)

  const entitlements = await getUserEntitlements(user.id)
  const messageLimit = entitlements.limits.messagesPerConversation
  const count = myCount ?? 0

  if (count >= messageLimit) {
    if (entitlements.isPaid) {
      const usedBonus = await consumeLoyaltyBonusMessage(user.id)
      if (!usedBonus) {
        return {
          error: `Limite de messages atteinte pour votre offre ${entitlements.planName}. Consultez votre solde fidélité sur /premium.`,
        }
      }
    } else {
      return {
        error: `Limite de messages atteinte pour votre offre ${entitlements.planName}. Passez Alliance sur /billing.`,
      }
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: trimmed,
      is_read: false,
    })
    .select("id, sender_id, message, is_read, created_at")
    .single()

  if (error || !data) {
    return { error: error?.message || "Échec d'envoi." }
  }

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)
  revalidatePath("/premium")

  return {
    message: {
      id: data.id,
      senderId: data.sender_id,
      text: data.message,
      createdAt: data.created_at ?? new Date().toISOString(),
      isRead: Boolean(data.is_read),
      isMine: true,
    },
  }
}
