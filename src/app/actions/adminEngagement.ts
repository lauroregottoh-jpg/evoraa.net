"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import {
  canAccessOpsConsole,
  canFullAdminOps,
  resolveAuthEmail,
} from "@/lib/admin/consolePath"

const ARCHIVE_KEY = "ops_eva_engagement_archive"
const ARCHIVE_MAX_DAYS = 45

export type EngagementLikeRow = {
  id: string
  at: string
  fromName: string
  toName: string
  fromCity: string | null
  toCity: string | null
  fromGender: string | null
  toGender: string | null
  fromProfileId: string
  toProfileId: string
  isToday: boolean
}

export type EngagementMutualRow = {
  aName: string
  bName: string
  aProfileId: string
  bProfileId: string
}

export type EngagementMessageRow = {
  id: string
  senderName: string
  senderId: string
  text: string
  at: string
  isRead: boolean
  kind: "text" | "voice"
  durationMs: number | null
  transcript: string | null
  transcriptStatus: string
}

export type EngagementConversationRow = {
  id: string
  createdAt: string
  matchId: string
  status: string | null
  score: number | null
  aName: string
  bName: string
  aUserId: string
  bUserId: string
  messageCount: number
  unreadCount: number
  lastMessageAt: string | null
  lastPreview: string | null
  scan: string
  messages: EngagementMessageRow[]
}

export type EngagementArchiveDay = {
  date: string
  generatedAt: string
  headline: string
  bullets: string[]
  totals: {
    likes: number
    likesToday: number
    mutuals: number
    conversations: number
    messages: number
    activeThreads: number
  }
}

export type EngagementBriefing = {
  generatedAt: string
  dayKey: string
  headline: string
  bullets: string[]
  totals: EngagementArchiveDay["totals"]
  likes: EngagementLikeRow[]
  mutuals: EngagementMutualRow[]
  conversations: EngagementConversationRow[]
  archive: EngagementArchiveDay[]
  notes: string[]
}

function displayName(
  p: { first_name?: string | null; last_name?: string | null } | null | undefined,
  fallback: string
) {
  if (!p) return fallback
  const n = `${p.first_name || ""} ${p.last_name || ""}`.trim()
  return n || fallback
}

function dayKeyParis(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Douala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

function startOfTodayIso() {
  const key = dayKeyParis()
  // Approximate midnight Douala (UTC+1) as ISO for filters
  return `${key}T00:00:00+01:00`
}

function clip(text: string, max = 160) {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function scanThread(messages: EngagementMessageRow[]): string {
  if (!messages.length) {
    return "Fil ouvert, aucun message encore — match silencieux."
  }
  const texts = messages.map((m) =>
    `${m.text} ${m.transcript || ""}`.toLowerCase()
  )
  const joined = texts.join(" ")
  const marks: string[] = []
  const voiceCount = messages.filter((m) => m.kind === "voice").length
  if (voiceCount) {
    marks.push(`${voiceCount} vocal${voiceCount > 1 ? "s" : ""}`)
  }
  if (joined.includes("prière") || joined.includes("prier") || joined.includes("dieu")) {
    marks.push("ton spirituel")
  }
  if (joined.includes("rencontre") || joined.includes("café") || joined.includes("appel")) {
    marks.push("proposition de rencontre")
  }
  if (joined.includes("whatsapp") || joined.includes("numéro") || joined.includes("whtsapp")) {
    marks.push("possible fuite hors app")
  }
  if (joined.includes("?") && messages.length >= 2) {
    marks.push("échange questions/réponses")
  }
  if (messages.length === 1) {
    marks.push("un seul message (attente de réponse)")
  } else if (messages.length >= 8) {
    marks.push("conversation soutenue")
  } else {
    marks.push("échange naissant")
  }
  const last = messages[messages.length - 1]
  return `${marks.join(" · ")}. Dernier : « ${clip(last.text, 90)} » (${last.senderName}).`
}

function buildNarrative(input: {
  likesTotal: number
  likesToday: number
  mutuals: number
  conversations: number
  messages: number
  activeThreads: number
  topReceivers: Array<{ name: string; n: number }>
  silentMatches: number
}): { headline: string; bullets: string[] } {
  const {
    likesTotal,
    likesToday,
    mutuals,
    conversations,
    messages,
    activeThreads,
    topReceivers,
    silentMatches,
  } = input

  let headline: string
  if (likesToday > 0 && activeThreads > 0) {
    headline = `Point du jour : ${likesToday} like${likesToday > 1 ? "s" : ""} + ${activeThreads} conversation${activeThreads > 1 ? "s" : ""} active${activeThreads > 1 ? "s" : ""}.`
  } else if (likesToday > 0) {
    headline = `Point du jour : ${likesToday} like${likesToday > 1 ? "s" : ""} — encore peu d’échanges écrits.`
  } else if (activeThreads > 0) {
    headline = `Point du jour : ${activeThreads} fil${activeThreads > 1 ? "s" : ""} en cours, pas de nouveau like aujourd’hui.`
  } else if (likesTotal > 0) {
    headline = `Point du jour : ${likesTotal} like${likesTotal > 1 ? "s" : ""} au total, activité écrite calme.`
  } else {
    headline = "Point du jour : pas encore de likes ni de conversations membres."
  }

  const bullets: string[] = [
    `${likesTotal} like${likesTotal > 1 ? "s" : ""} cumulé${likesTotal > 1 ? "s" : ""} · ${likesToday} aujourd’hui · ${mutuals} réciproque${mutuals > 1 ? "s" : ""}.`,
    `${conversations} conversation${conversations > 1 ? "s" : ""} · ${messages} message${messages > 1 ? "s" : ""} · ${activeThreads} fil${activeThreads > 1 ? "s" : ""} avec contenu.`,
  ]

  if (topReceivers.length) {
    bullets.push(
      `Profils les plus likés : ${topReceivers
        .slice(0, 3)
        .map((r) => `${r.name} (${r.n})`)
        .join(" · ")}.`
    )
  }
  if (silentMatches > 0) {
    bullets.push(
      `${silentMatches} match/conversation sans message — à relancer si pertinent.`
    )
  }
  if (mutuals === 0 && likesTotal > 0) {
    bullets.push("Aucun like réciproque pour l’instant : le matching n’a pas encore “accroché”.")
  }
  if (messages === 0) {
    bullets.push("Aucun message membre encore : les likes existent, les discussions démarrent après.")
  }

  return { headline, bullets }
}

async function requireOpsFull() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const }

  const email = resolveAuthEmail(user)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  const role = (profile?.role as string) || null
  if (!canAccessOpsConsole({ role, email })) {
    return { error: "Accès réservé au staff." as const }
  }
  if (!canFullAdminOps({ role, email })) {
    return { error: "Briefing Eva réservé aux administrateurs complets." as const }
  }
  return { ok: true as const, userId: user.id, email }
}

function parseArchive(raw: unknown): EngagementArchiveDay[] {
  if (!raw || typeof raw !== "object") return []
  const days = (raw as { days?: unknown }).days
  if (!Array.isArray(days)) return []
  return days
    .filter((d): d is EngagementArchiveDay => {
      if (!d || typeof d !== "object") return false
      const o = d as EngagementArchiveDay
      return typeof o.date === "string" && typeof o.headline === "string"
    })
    .slice(0, ARCHIVE_MAX_DAYS)
}

export async function adminGetEngagementBriefing(opts?: {
  persist?: boolean
}): Promise<{ error?: string; briefing?: EngagementBriefing }> {
  const gate = await requireOpsFull()
  if ("error" in gate && gate.error) return { error: gate.error }

  const admin = createAdminClient()
  const todayStart = startOfTodayIso()
  const todayKey = dayKeyParis()
  const notes: string[] = []

  const { data: favs, error: favErr } = await admin
    .from("profile_favorites")
    .select("id, owner_profile_id, target_profile_id, created_at")
    .order("created_at", { ascending: false })
    .limit(400)

  if (favErr) notes.push(`Likes: ${favErr.message}`)

  const favRows = favs ?? []
  const profileIds = [
    ...new Set(favRows.flatMap((f) => [f.owner_profile_id, f.target_profile_id])),
  ]

  const { data: profiles } = profileIds.length
    ? await admin
        .from("profiles")
        .select("id, user_id, first_name, last_name, city, gender")
        .in("id", profileIds)
    : { data: [] as Array<{
        id: string
        user_id: string
        first_name: string | null
        last_name: string | null
        city: string | null
        gender: string | null
      }> }

  const byProfileId = new Map((profiles ?? []).map((p) => [p.id as string, p]))

  const likes: EngagementLikeRow[] = favRows.map((f) => {
    const from = byProfileId.get(f.owner_profile_id as string)
    const to = byProfileId.get(f.target_profile_id as string)
    const at = (f.created_at as string) || new Date().toISOString()
    return {
      id: f.id as string,
      at,
      fromName: displayName(from, "Membre"),
      toName: displayName(to, "Membre"),
      fromCity: (from?.city as string | null) || null,
      toCity: (to?.city as string | null) || null,
      fromGender: (from?.gender as string | null) || null,
      toGender: (to?.gender as string | null) || null,
      fromProfileId: f.owner_profile_id as string,
      toProfileId: f.target_profile_id as string,
      isToday: at >= todayStart,
    }
  })

  const directed = new Set(
    favRows.map((f) => `${f.owner_profile_id}->${f.target_profile_id}`)
  )
  const mutuals: EngagementMutualRow[] = []
  const seenMutual = new Set<string>()
  for (const f of favRows) {
    const a = f.owner_profile_id as string
    const b = f.target_profile_id as string
    if (!directed.has(`${b}->${a}`)) continue
    const key = [a, b].sort().join("|")
    if (seenMutual.has(key)) continue
    seenMutual.add(key)
    mutuals.push({
      aProfileId: a,
      bProfileId: b,
      aName: displayName(byProfileId.get(a), "Membre"),
      bName: displayName(byProfileId.get(b), "Membre"),
    })
  }

  const receiverCount = new Map<string, { name: string; n: number }>()
  for (const l of likes) {
    const cur = receiverCount.get(l.toProfileId) || { name: l.toName, n: 0 }
    cur.n += 1
    receiverCount.set(l.toProfileId, cur)
  }
  const topReceivers = [...receiverCount.values()].sort((a, b) => b.n - a.n)

  const { count: convCount } = await admin
    .from("conversations")
    .select("id", { count: "exact", head: true })

  const { count: msgCount } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })

  const { data: convs, error: convErr } = await admin
    .from("conversations")
    .select("id, match_id, created_at")
    .order("created_at", { ascending: false })
    .limit(80)

  if (convErr) notes.push(`Conversations: ${convErr.message}`)

  const matchIds = [...new Set((convs ?? []).map((c) => c.match_id as string))]
  const { data: matches } = matchIds.length
    ? await admin
        .from("matches")
        .select("id, user_one, user_two, compatibility_score, status, created_at")
        .in("id", matchIds)
    : { data: [] as Array<{
        id: string
        user_one: string
        user_two: string
        compatibility_score: number | null
        status: string | null
        created_at: string
      }> }

  const matchById = new Map((matches ?? []).map((m) => [m.id as string, m]))
  const userIds = [
    ...new Set(
      (matches ?? []).flatMap((m) => [m.user_one as string, m.user_two as string])
    ),
  ]

  const { data: userProfiles } = userIds.length
    ? await admin
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds)
    : { data: [] as Array<{
        user_id: string
        first_name: string | null
        last_name: string | null
      }> }

  const byUserId = new Map((userProfiles ?? []).map((p) => [p.user_id as string, p]))

  const convIds = (convs ?? []).map((c) => c.id as string)
  let allMsgs: Array<Record<string, unknown>> | null = []
  let msgErr: { message: string } | null = null
  if (convIds.length) {
    const first = await admin
      .from("messages")
      .select(
        "id, conversation_id, sender_id, message, is_read, created_at, kind, audio_duration_ms, transcript_text, transcript_status"
      )
      .in("conversation_id", convIds)
      .order("created_at", { ascending: true })
      .limit(2000)
    if (first.error && /kind|transcript|audio_duration/i.test(first.error.message)) {
      const retry = await admin
        .from("messages")
        .select("id, conversation_id, sender_id, message, is_read, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: true })
        .limit(2000)
      allMsgs = (retry.data as Array<Record<string, unknown>> | null) ?? []
      msgErr = retry.error
    } else {
      allMsgs = (first.data as Array<Record<string, unknown>> | null) ?? []
      msgErr = first.error
    }
  }

  if (msgErr) notes.push(`Messages: ${msgErr.message}`)

  const msgsByConv = new Map<string, Array<Record<string, unknown>>>()
  for (const m of allMsgs ?? []) {
    const cid = String(m.conversation_id || "")
    const list = msgsByConv.get(cid) || []
    list.push(m)
    msgsByConv.set(cid, list)
  }

  const conversations: EngagementConversationRow[] = (convs ?? []).map((c) => {
    const match = matchById.get(c.match_id as string)
    const aUserId = (match?.user_one as string) || ""
    const bUserId = (match?.user_two as string) || ""
    const aName = displayName(byUserId.get(aUserId), "Membre A")
    const bName = displayName(byUserId.get(bUserId), "Membre B")
    const rawMsgs = msgsByConv.get(c.id as string) || []
    const messages: EngagementMessageRow[] = rawMsgs.map((m) => {
      const sid = m.sender_id as string
      const sender =
        sid === aUserId ? aName : sid === bUserId ? bName : displayName(byUserId.get(sid), "Membre")
      return {
        id: m.id as string,
        senderId: sid,
        senderName: sender,
        text: (m.message as string) || "",
        at: (m.created_at as string) || "",
        isRead: Boolean(m.is_read),
        kind: m.kind === "voice" ? "voice" : "text",
        durationMs: (m.audio_duration_ms as number | null) ?? null,
        transcript: (m.transcript_text as string | null) || null,
        transcriptStatus: (m.transcript_status as string) || "none",
      }
    })
    const last = messages[messages.length - 1] || null
    return {
      id: c.id as string,
      createdAt: (c.created_at as string) || "",
      matchId: c.match_id as string,
      status: (match?.status as string | null) || null,
      score:
        match?.compatibility_score != null
          ? Number(match.compatibility_score)
          : null,
      aName,
      bName,
      aUserId,
      bUserId,
      messageCount: messages.length,
      unreadCount: messages.filter((m) => !m.isRead).length,
      lastMessageAt: last?.at || null,
      lastPreview: last ? clip(last.text, 120) : null,
      scan: scanThread(messages),
      messages,
    }
  })

  conversations.sort((a, b) => {
    const ta = a.lastMessageAt || a.createdAt
    const tb = b.lastMessageAt || b.createdAt
    return tb.localeCompare(ta)
  })

  const activeThreads = conversations.filter((c) => c.messageCount > 0).length
  const silentMatches = conversations.filter((c) => c.messageCount === 0).length
  const likesToday = likes.filter((l) => l.isToday).length

  const totals = {
    likes: likes.length,
    likesToday,
    mutuals: mutuals.length,
    conversations: convCount ?? conversations.length,
    messages: msgCount ?? 0,
    activeThreads,
  }

  const { headline, bullets } = buildNarrative({
    likesTotal: totals.likes,
    likesToday: totals.likesToday,
    mutuals: totals.mutuals,
    conversations: totals.conversations,
    messages: totals.messages,
    activeThreads: totals.activeThreads,
    topReceivers,
    silentMatches,
  })

  // Archive journalière (platform_settings)
  let archive: EngagementArchiveDay[] = []
  const { data: archiveRow } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", ARCHIVE_KEY)
    .maybeSingle()

  archive = parseArchive(archiveRow?.value)

  const persist = opts?.persist !== false
  if (persist) {
    const dayEntry: EngagementArchiveDay = {
      date: todayKey,
      generatedAt: new Date().toISOString(),
      headline,
      bullets,
      totals,
    }
    const withoutToday = archive.filter((d) => d.date !== todayKey)
    archive = [dayEntry, ...withoutToday].slice(0, ARCHIVE_MAX_DAYS)
    await admin.from("platform_settings").upsert(
      {
        key: ARCHIVE_KEY,
        value: { days: archive },
        description:
          "Archive quotidienne Briefing Eva (likes, conversations, point du jour).",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )
  }

  const briefing: EngagementBriefing = {
    generatedAt: new Date().toISOString(),
    dayKey: todayKey,
    headline,
    bullets,
    totals,
    likes,
    mutuals,
    conversations,
    archive,
    notes,
  }

  return { briefing }
}

export async function adminGetConversationDetail(conversationId: string): Promise<{
  error?: string
  conversation?: EngagementConversationRow
}> {
  const res = await adminGetEngagementBriefing({ persist: false })
  if (res.error || !res.briefing) return { error: res.error || "Erreur." }
  const conversation = res.briefing.conversations.find((c) => c.id === conversationId)
  if (!conversation) return { error: "Conversation introuvable." }
  return { conversation }
}

export async function adminGetVoicePlaybackUrlAction(messageId: string): Promise<{
  error?: string
  url?: string
}> {
  const gate = await requireOpsFull()
  if ("error" in gate) return { error: gate.error }

  const { VOICE_NOTE_BUCKET, VOICE_NOTE_SIGNED_URL_SECONDS } = await import(
    "@/lib/messaging/voiceNotes"
  )
  const admin = createAdminClient()
  const { data: row } = await admin
    .from("messages")
    .select("audio_path, kind")
    .eq("id", messageId)
    .maybeSingle()

  if (!row?.audio_path || row.kind !== "voice") {
    return { error: "Vocal introuvable." }
  }

  const { data, error } = await admin.storage
    .from(VOICE_NOTE_BUCKET)
    .createSignedUrl(row.audio_path as string, VOICE_NOTE_SIGNED_URL_SECONDS)

  if (error || !data?.signedUrl) {
    return { error: error?.message || "Lecture indisponible." }
  }
  return { url: data.signedUrl }
}

export async function adminRetranscribeVoiceNoteAction(messageId: string): Promise<{
  error?: string
  ok?: boolean
}> {
  const gate = await requireOpsFull()
  if ("error" in gate) return { error: gate.error }

  const admin = createAdminClient()
  const { data: row } = await admin
    .from("messages")
    .select("id, kind, audio_path, audio_mime")
    .eq("id", messageId)
    .maybeSingle()

  if (!row?.audio_path || row.kind !== "voice") {
    return { error: "Vocal introuvable." }
  }

  await admin
    .from("messages")
    .update({ transcript_status: "pending" })
    .eq("id", messageId)

  const { transcribeStoredVoiceNote } = await import(
    "@/lib/messaging/transcribeVoice"
  )
  await transcribeStoredVoiceNote({
    messageId: row.id as string,
    audioPath: row.audio_path as string,
    mime: (row.audio_mime as string | null) || null,
  })
  return { ok: true }
}
