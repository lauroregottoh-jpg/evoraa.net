"use server"

import { after } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getUserEntitlements } from "@/lib/billing/entitlements"
import {
  consumeLoyaltyBonusMessage,
  getLoyaltyAccount,
} from "@/lib/loyalty/account"
import {
  consumeMessageCredit,
  getMessageCreditBalance,
} from "@/lib/billing/messageCredits"
import { transcribeStoredVoiceNote, cleanClientTranscript } from "@/lib/messaging/transcribeVoice"
import {
  VOICE_NOTE_BUCKET,
  VOICE_NOTE_MAX_BYTES,
  VOICE_NOTE_MAX_DURATION_MS,
  VOICE_NOTE_SIGNED_URL_SECONDS,
  extensionForMime,
  normalizeAudioMime,
  voicePreviewLabel,
} from "@/lib/messaging/voiceNotes"
import {
  VOICE_SANDBOX_DISPLAY,
  VOICE_SANDBOX_EMAIL,
  VOICE_SANDBOX_FIRST,
  VOICE_SANDBOX_LAST,
} from "@/lib/messaging/voiceSandbox"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"

export type ConversationListItem = {
  id: string
  partnerName: string
  partnerProfileId: string
  harmonyScore: number
  lastMessage: string
  timestamp: string
  unread: boolean
}

export type ChatMessageKind = "text" | "voice"

export type ChatMessageDTO = {
  id: string
  senderId: string
  text: string
  createdAt: string
  isRead: boolean
  isMine: boolean
  kind: ChatMessageKind
  durationMs: number | null
  audioUrl: string | null
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
  /** Crédits tests / invitations (expirent sous 20 jours) */
  testCreditsRemaining: number
  testCreditsExpiresAt: string | null
  hasMoreOlder: boolean
  /** Vocaux : Alliance (et comptes ops). Lecture possible pour les deux. */
  voiceNotesEnabled: boolean
}

const MESSAGE_SELECT =
  "id, sender_id, message, is_read, created_at, kind, audio_path, audio_duration_ms"
const LEGACY_MESSAGE_SELECT = "id, sender_id, message, is_read, created_at"

function isMissingVoiceColumn(message: string | undefined): boolean {
  const m = (message || "").toLowerCase()
  return (
    m.includes("kind") ||
    m.includes("audio_path") ||
    m.includes("audio_duration") ||
    m.includes("transcript")
  )
}

type MessageRow = {
  id: string
  sender_id: string
  message: string
  is_read: boolean | null
  created_at: string | null
  kind?: string | null
  audio_path?: string | null
  audio_duration_ms?: number | null
}

async function signedVoiceUrls(paths: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))]
  const map = new Map<string, string>()
  if (!unique.length) return map
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.storage
      .from(VOICE_NOTE_BUCKET)
      .createSignedUrls(unique, VOICE_NOTE_SIGNED_URL_SECONDS)
    if (error) {
      console.error("[voice] signed urls", error.message)
      return map
    }
    for (const row of data ?? []) {
      if (row.path && row.signedUrl) map.set(row.path, row.signedUrl)
    }
  } catch (e) {
    console.error("[voice] signed urls", e)
  }
  return map
}

function mapChatMessage(
  m: MessageRow,
  userId: string,
  urlByPath: Map<string, string>
): ChatMessageDTO {
  const kind: ChatMessageKind = m.kind === "voice" ? "voice" : "text"
  const path = m.audio_path || null
  return {
    id: m.id,
    senderId: m.sender_id,
    text: m.message,
    createdAt: m.created_at ?? new Date().toISOString(),
    isRead: Boolean(m.is_read),
    isMine: m.sender_id === userId,
    kind,
    durationMs: m.audio_duration_ms ?? null,
    audioUrl: kind === "voice" && path ? urlByPath.get(path) ?? null : null,
  }
}

async function consumeOutgoingQuota(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  conversationId: string
): Promise<{ error?: string }> {
  const { count: myCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("sender_id", userId)

  const entitlements = await getUserEntitlements(userId)
  const messageLimit = entitlements.limits.messagesPerConversation
  const count = myCount ?? 0

  if (count >= messageLimit) {
    const usedCredit = await consumeMessageCredit(userId)
    if (usedCredit) return {}
    if (entitlements.isPaid) {
      const usedBonus = await consumeLoyaltyBonusMessage(userId)
      if (!usedBonus) {
        return {
          error: `Limite de messages atteinte pour votre offre ${entitlements.planName}. Faites un test (+10) ou invitez (+5), valables 20 jours — ou consultez /premium.`,
        }
      }
    } else {
      return {
        error: `Limite de messages atteinte. Faites un questionnaire (+10 messages, 20 jours) ou invitez quelqu’un à un test (+5).`,
      }
    }
  }
  return {}
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

  const { isHiddenOperatorProfile, isVoiceSandboxProfile } = await import(
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
      ) &&
      !isVoiceSandboxProfile(
        partner.first_name as string | null,
        partner.last_name as string | null
      )
    ) {
      continue
    }
    const extra = extraByConv.get(conv.id)

    items.push({
      id: conv.id,
      partnerName: isVoiceSandboxProfile(
        partner?.first_name as string | null,
        partner?.last_name as string | null
      )
        ? VOICE_SANDBOX_DISPLAY
        : partner?.first_name || "Membre",
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

  const { isHiddenOperatorProfile, isVoiceSandboxProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )
  if (
    partner &&
    isHiddenOperatorProfile(
      partner.first_name as string | null,
      partner.last_name as string | null
    ) &&
    !isVoiceSandboxProfile(
      partner.first_name as string | null,
      partner.last_name as string | null
    )
  ) {
    return { error: "Conversation introuvable." }
  }

  const PAGE = 80
  let { data: messages, error: msgError } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(PAGE + 1)

  if (msgError && isMissingVoiceColumn(msgError.message)) {
    const retry = await supabase
      .from("messages")
      .select(LEGACY_MESSAGE_SELECT)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(PAGE + 1)
    messages = retry.data
    msgError = retry.error
  }

  if (msgError) {
    return { error: msgError.message }
  }

  const hasMoreOlder = (messages?.length ?? 0) > PAGE
  const pageRows = ((messages ?? []) as MessageRow[]).slice(0, PAGE).reverse()

  // Mark partner messages as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false)

  const urlByPath = await signedVoiceUrls(
    pageRows
      .filter((m) => m.kind === "voice" && m.audio_path)
      .map((m) => m.audio_path as string)
  )
  const mapped: ChatMessageDTO[] = pageRows.map((m) =>
    mapChatMessage(m, user.id, urlByPath)
  )

  const entitlements = await getUserEntitlements(user.id)
  const messageLimit = entitlements.limits.messagesPerConversation
  const loyalty = await getLoyaltyAccount(user.id, {
    isPaid: entitlements.isPaid,
  })
  const credits = await getMessageCreditBalance(user.id)
  const { count: myMessageCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("sender_id", user.id)

  return {
    room: {
      id: conversationId,
      partnerName: isVoiceSandboxProfile(
        partner?.first_name as string | null,
        partner?.last_name as string | null
      )
        ? VOICE_SANDBOX_DISPLAY
        : partner?.first_name || "Membre",
      partnerProfileId: partner?.id || "",
      partnerUserId,
      harmonyScore: Math.round(Number(match.compatibility_score ?? 0)),
      messages: mapped,
      messageCount: myMessageCount ?? mapped.filter((m) => m.isMine).length,
      freeLimit: messageLimit,
      bonusMessagesRemaining: entitlements.isPaid
        ? loyalty.bonusMessagesBalance
        : 0,
      testCreditsRemaining: credits.remaining,
      testCreditsExpiresAt: credits.nextExpiresAt,
      hasMoreOlder,
      voiceNotesEnabled: entitlements.isPaid,
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
  let { data: rows, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("conversation_id", conversationId)
    .lt("created_at", beforeCreatedAt)
    .order("created_at", { ascending: false })
    .limit(PAGE + 1)

  if (error && isMissingVoiceColumn(error.message)) {
    const retry = await supabase
      .from("messages")
      .select(LEGACY_MESSAGE_SELECT)
      .eq("conversation_id", conversationId)
      .lt("created_at", beforeCreatedAt)
      .order("created_at", { ascending: false })
      .limit(PAGE + 1)
    rows = retry.data
    error = retry.error
  }

  if (error) return { error: error.message }

  const hasMoreOlder = (rows?.length ?? 0) > PAGE
  const pageRows = ((rows ?? []) as MessageRow[]).slice(0, PAGE).reverse()
  const urlByPath = await signedVoiceUrls(
    pageRows
      .filter((m) => m.kind === "voice" && m.audio_path)
      .map((m) => m.audio_path as string)
  )

  return {
    messages: pageRows.map((m) => mapChatMessage(m, user.id, urlByPath)),
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

  const quota = await consumeOutgoingQuota(supabase, user.id, conversationId)
  if (quota.error) return { error: quota.error }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message: trimmed,
      is_read: false,
    })
    .select(LEGACY_MESSAGE_SELECT)
    .single()

  if (error || !data) {
    return { error: error?.message || "Échec d'envoi." }
  }

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)
  revalidatePath("/premium")

  return {
    message: mapChatMessage(data as MessageRow, user.id, new Map()),
  }
}

export async function getVoicePlaybackUrlAction(
  conversationId: string,
  messageId: string
): Promise<{ error?: string; url?: string }> {
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

  const { data: row } = await supabase
    .from("messages")
    .select("id, audio_path, kind")
    .eq("id", messageId)
    .eq("conversation_id", conversationId)
    .maybeSingle()

  if (!row?.audio_path || row.kind !== "voice") {
    return { error: "Vocal introuvable." }
  }

  const urls = await signedVoiceUrls([row.audio_path as string])
  const url = urls.get(row.audio_path as string)
  if (!url) return { error: "Lecture indisponible. Réessayez." }
  return { url }
}

export async function sendVoiceNoteAction(
  formData: FormData
): Promise<{ error?: string; message?: ChatMessageDTO }> {
  const conversationId = String(formData.get("conversationId") || "").trim()
  const durationRaw = Number(formData.get("durationMs") || 0)
  const clientTranscript = cleanClientTranscript(
    String(formData.get("clientTranscript") || "")
  )
  const file = formData.get("audio")
  if (!conversationId) return { error: "Conversation manquante." }
  if (!(file instanceof File) || file.size < 400) {
    return { error: "Enregistrement trop court. Réessayez." }
  }
  if (file.size > VOICE_NOTE_MAX_BYTES) {
    return { error: "Vocal trop lourd (max 2 Mo). Parlez un peu moins longtemps." }
  }

  const mime =
    normalizeAudioMime(file.type) ||
    (file.name.endsWith(".m4a") || file.name.endsWith(".mp4")
      ? "audio/mp4"
      : file.name.endsWith(".ogg")
        ? "audio/ogg"
        : "audio/webm")

  const durationMs = Math.min(
    VOICE_NOTE_MAX_DURATION_MS + 5_000,
    Math.max(800, Math.round(durationRaw || 0))
  )
  if (durationRaw > VOICE_NOTE_MAX_DURATION_MS + 8_000) {
    return { error: "Vocal trop long (max 60 secondes)." }
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté." }

  const entitlements = await getUserEntitlements(user.id)
  if (!entitlements.isPaid) {
    return {
      error: "Les vocaux sont réservés à Alliance. Passez Alliance sur /billing.",
    }
  }

  const rl = await enforceRateLimit({
    ...RL.voiceNote,
    subject: user.id,
  })
  if (!rl.ok) return { error: rl.error }

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

  const quota = await consumeOutgoingQuota(supabase, user.id, conversationId)
  if (quota.error) return { error: quota.error }

  const messageId = crypto.randomUUID()
  const ext = extensionForMime(mime)
  const audioPath = `${conversationId}/${messageId}.${ext}`

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return { error: "Stockage vocal indisponible. Contactez le support." }
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const { error: upErr } = await admin.storage
    .from(VOICE_NOTE_BUCKET)
    .upload(audioPath, bytes, {
      contentType: mime,
      upsert: false,
    })

  if (upErr) {
    console.error("[voice] upload", upErr.message)
    return { error: "Impossible d’enregistrer le vocal. Réessayez." }
  }

  const preview = voicePreviewLabel(durationMs)
  const hasServerTranscriber = Boolean(
    process.env.GROQ_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
  )
  const { data, error } = await supabase
    .from("messages")
    .insert({
      id: messageId,
      conversation_id: conversationId,
      sender_id: user.id,
      message: preview,
      is_read: false,
      kind: "voice",
      audio_path: audioPath,
      audio_duration_ms: durationMs,
      audio_mime: mime,
      transcript_text: clientTranscript,
      transcript_status: clientTranscript
        ? hasServerTranscriber
          ? "pending"
          : "ready"
        : hasServerTranscriber
          ? "pending"
          : "none",
    })
    .select(MESSAGE_SELECT)
    .single()

  if (error || !data) {
    await admin.storage.from(VOICE_NOTE_BUCKET).remove([audioPath])
    return { error: error?.message || "Échec d'envoi du vocal." }
  }

  after(() =>
    transcribeStoredVoiceNote({
      messageId,
      audioPath,
      mime,
      clientTranscript,
    }).catch((e) => console.error("[voice] after transcribe", e))
  )

  const urlByPath = await signedVoiceUrls([audioPath])

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)
  revalidatePath("/premium")

  return {
    message: mapChatMessage(data as MessageRow, user.id, urlByPath),
  }
}

export async function openVoiceSandboxAction(): Promise<{
  error?: string
  conversationId?: string
}> {
  const { user } = await getAuthUser()
  if (!user) return { error: "Vous devez être connecté." }

  const entitlements = await getUserEntitlements(user.id)
  if (!entitlements.isPaid) {
    return {
      error:
        "Les vocaux sont réservés à Alliance. Passez Alliance sur /billing, puis réessayez.",
    }
  }

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return { error: "Impossible d’ouvrir le banc d’essai vocal." }
  }

  const lookup = async () => {
    const { data } = await admin.rpc("get_auth_user_id_by_email" as never, {
      p_email: VOICE_SANDBOX_EMAIL,
    } as never)
    if (typeof data === "string" && data.length > 10) return data
    return null
  }

  let sandboxUserId = await lookup()
  if (!sandboxUserId) {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: VOICE_SANDBOX_EMAIL,
      password: `${crypto.randomUUID()}Aa1!`,
      email_confirm: true,
      user_metadata: { keliaa_sandbox: "voice" },
    })
    sandboxUserId = created?.user?.id ?? (await lookup())
    if (!sandboxUserId) {
      return {
        error: createErr?.message || "Impossible de créer le partenaire d’essai.",
      }
    }
  }

  if (sandboxUserId === user.id) {
    return { error: "Utilisez votre compte fondateur, pas Echo." }
  }

  await admin
    .from("profiles")
    .update({
      first_name: VOICE_SANDBOX_FIRST,
      last_name: VOICE_SANDBOX_LAST,
    })
    .eq("user_id", sandboxUserId)

  const { data: asOne } = await admin
    .from("matches")
    .select("id")
    .eq("user_one", user.id)
    .eq("user_two", sandboxUserId)
    .maybeSingle()
  const { data: asTwo } = asOne
    ? { data: null }
    : await admin
        .from("matches")
        .select("id")
        .eq("user_one", sandboxUserId)
        .eq("user_two", user.id)
        .maybeSingle()

  let matchId = (asOne?.id as string | undefined) || (asTwo?.id as string | undefined)
  if (!matchId) {
    const { data: createdMatch, error: matchErr } = await admin
      .from("matches")
      .insert({
        user_one: user.id,
        user_two: sandboxUserId,
        compatibility_score: 100,
        status: "accepted",
      })
      .select("id")
      .single()
    if (matchErr || !createdMatch) {
      return { error: matchErr?.message || "Impossible d’ouvrir le match d’essai." }
    }
    matchId = createdMatch.id as string
  } else {
    await admin.from("matches").update({ status: "accepted" }).eq("id", matchId)
  }

  const { data: existingConv } = await admin
    .from("conversations")
    .select("id")
    .eq("match_id", matchId)
    .maybeSingle()

  let conversationId = existingConv?.id as string | undefined
  if (!conversationId) {
    const { data: createdConv, error: convErr } = await admin
      .from("conversations")
      .insert({ match_id: matchId })
      .select("id")
      .single()
    if (convErr || !createdConv) {
      return {
        error: convErr?.message || "Impossible d’ouvrir la conversation d’essai.",
      }
    }
    conversationId = createdConv.id as string
  }

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)
  return { conversationId }
}
