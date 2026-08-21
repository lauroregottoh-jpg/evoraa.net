"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { normalizeCoachCode, creditsFromPackSessions } from "@/lib/coaching/domain"
import {
  COACHING_CANNED_TEMPLATES,
  type CannedRole,
} from "@/lib/coaching/cannedMessages"
import {
  buildJitsiRoomConfig,
  getVideoSessionProvider,
} from "@/lib/coaching/videoSessionProvider"
import { issueLiveKitJoinCredentials } from "@/lib/coaching/livekitRooms"

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function getCoachingCreditBalanceAction(): Promise<{
  error?: string
  balance?: number
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data, error } = await supabase
    .from("coaching_credits_ledger")
    .select("delta_credits")
    .eq("user_id", user.id)

  if (error) return { balance: 0 }

  const balance = (data || []).reduce(
    (sum, row) => sum + Number(row.delta_credits || 0),
    0
  )
  return { balance }
}

/** Coach saisit son code pour confirmer / activer son espace (pas le client). */
export async function activateCoachByCodeAction(codeRaw: string): Promise<{
  error?: string
  coachName?: string
  coachId?: string
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const code = normalizeCoachCode(codeRaw)
  if (code.length < 4) return { error: "Code coach invalide." }

  const { data: coach, error } = await supabase
    .from("coaches")
    .select("id, display_name, status, accepts_sessions, user_id")
    .eq("coach_code", code)
    .maybeSingle()

  if (error) return { error: "Impossible de vérifier le code pour le moment." }
  if (!coach) return { error: "Code coach introuvable." }
  if (coach.status !== "active") {
    return { error: "Ce profil coach n’est pas actif." }
  }

  if (coach.user_id && coach.user_id !== user.id) {
    return { error: "Ce code est déjà lié à un autre compte." }
  }

  if (!coach.user_id) {
    const { error: linkErr } = await supabase
      .from("coaches")
      .update({ user_id: user.id, updated_at: new Date().toISOString() })
      .eq("id", coach.id)
    if (linkErr) return { error: linkErr.message }
  }

  revalidatePath("/coaching/session")
  revalidatePath("/coaching/coach")
  return {
    coachId: coach.id as string,
    coachName: coach.display_name as string,
  }
}

/** @deprecated client ne saisit plus le code — conservé pour ops / legacy */
export async function linkCoachByCodeAction(codeRaw: string): Promise<{
  error?: string
  coachName?: string
  coachId?: string
}> {
  return activateCoachByCodeAction(codeRaw)
}

export async function getMyCoachProfileAction(): Promise<{
  error?: string
  coach?: { id: string; name: string; code: string } | null
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data } = await supabase
    .from("coaches")
    .select("id, display_name, coach_code")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!data) return { coach: null }
  return {
    coach: {
      id: data.id as string,
      name: data.display_name as string,
      code: data.coach_code as string,
    },
  }
}

export async function getLinkedCoachesAction(): Promise<{
  error?: string
  coaches?: Array<{ id: string; name: string; code?: string }>
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data, error } = await supabase
    .from("coaching_coach_links")
    .select("coach_id, coaches(id, display_name, coach_code)")
    .eq("user_id", user.id)

  if (error) return { coaches: [] }

  const coaches = (data || [])
    .map((row) => {
      const c = row.coaches as
        | { id: string; display_name: string; coach_code: string }
        | { id: string; display_name: string; coach_code: string }[]
        | null
      const coach = Array.isArray(c) ? c[0] : c
      if (!coach) return null
      return {
        id: coach.id,
        name: coach.display_name,
        code: coach.coach_code,
      }
    })
    .filter(Boolean) as Array<{ id: string; name: string; code?: string }>

  return { coaches }
}

/** Coachs actifs pour matching / réservation — roster Sara / Antoine uniquement. */
export async function listBookableCoachesAction(input?: {
  genderPreference?: "female" | "male" | "none"
}): Promise<{
  error?: string
  coaches?: Array<{ id: string; name: string; gender: string | null }>
}> {
  const { user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { ensureCoachingRoster } = await import("@/lib/coaching/ensureRoster")
  let roster = await ensureCoachingRoster()
  const pref = input?.genderPreference
  if (pref === "female" || pref === "male") {
    roster = roster.filter((c) => c.gender === pref)
  }

  return {
    coaches: roster.map((c) => ({
      id: c.id,
      name: c.name,
      gender: c.gender,
    })),
  }
}

export type CoachingSessionListItem = {
  id: string
  bookingId: string | null
  status: string
  displayedMinutes: number
  scheduledStart: string | null
  coachName: string
  coachId: string
  clientDisplayName: string | null
  displayAnonymous: boolean
  subject: string | null
  createdAt: string
}

export async function listClientSessionsAction(): Promise<{
  error?: string
  sessions?: CoachingSessionListItem[]
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data, error } = await supabase
    .from("coaching_sessions")
    .select(
      "id, booking_id, status, displayed_minutes, client_display_name, client_display_mode, created_at, coach_id, coaches(display_name), coaching_bookings(scheduled_start, display_anonymous, brief_subject)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40)

  if (error) return { sessions: [] }

  const sessions: CoachingSessionListItem[] = (data || []).map((row) => {
    const coach = Array.isArray(row.coaches) ? row.coaches[0] : row.coaches
    const booking = Array.isArray(row.coaching_bookings)
      ? row.coaching_bookings[0]
      : row.coaching_bookings
    return {
      id: row.id as string,
      bookingId: (row.booking_id as string) || null,
      status: row.status as string,
      displayedMinutes: Number(row.displayed_minutes || 30),
      scheduledStart: (booking?.scheduled_start as string) || null,
      coachName: (coach?.display_name as string) || "Coach",
      coachId: row.coach_id as string,
      clientDisplayName: (row.client_display_name as string) || null,
      displayAnonymous: Boolean(booking?.display_anonymous),
      subject: (booking?.brief_subject as string) || null,
      createdAt: row.created_at as string,
    }
  })

  return { sessions }
}

export async function listCoachInboxAction(): Promise<{
  error?: string
  sessions?: Array<
    CoachingSessionListItem & {
      briefMessage: string | null
      objectives: string[]
      userId: string
      realFirstName: string | null
    }
  >
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: coach } = await supabase
    .from("coaches")
    .select("id, display_name")
    .eq("user_id", user.id)
    .maybeSingle()
  if (!coach) return { error: "Profil coach introuvable." }

  const { data, error } = await supabase
    .from("coaching_sessions")
    .select(
      "id, booking_id, status, displayed_minutes, client_display_name, client_display_mode, created_at, coach_id, user_id, coaching_bookings(scheduled_start, display_anonymous, brief_subject, brief_message, brief_objectives)"
    )
    .eq("coach_id", coach.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return { sessions: [] }

  const userIds = [...new Set((data || []).map((r) => r.user_id as string))]
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, first_name")
        .in("user_id", userIds)
    : { data: [] as Array<{ user_id: string; first_name: string | null }> }

  const nameByUser = new Map(
    (profiles || []).map((p) => [
      p.user_id as string,
      p.first_name as string | null,
    ])
  )

  const sessions = (data || []).map((row) => {
    const booking = Array.isArray(row.coaching_bookings)
      ? row.coaching_bookings[0]
      : row.coaching_bookings
    const anonymous = Boolean(booking?.display_anonymous)
    const realName = nameByUser.get(row.user_id as string) || null
    const display = anonymous
      ? row.client_display_name || "Membre (anonymat d’affichage)"
      : realName || row.client_display_name || "Membre"

    const objectivesRaw = booking?.brief_objectives
    const objectives = Array.isArray(objectivesRaw)
      ? (objectivesRaw as string[])
      : []

    return {
      id: row.id as string,
      bookingId: (row.booking_id as string) || null,
      status: row.status as string,
      displayedMinutes: Number(row.displayed_minutes || 30),
      scheduledStart: (booking?.scheduled_start as string) || null,
      coachName: coach.display_name as string,
      coachId: coach.id as string,
      clientDisplayName: display,
      displayAnonymous: anonymous,
      subject: (booking?.brief_subject as string) || null,
      createdAt: row.created_at as string,
      briefMessage: (booking?.brief_message as string) || null,
      objectives,
      userId: row.user_id as string,
      realFirstName: realName,
    }
  })

  return { sessions }
}

export async function getCoachAvailabilityAction(coachId?: string): Promise<{
  error?: string
  slots?: Array<{
    id: string
    weekday: number | null
    startTime: string | null
    endTime: string | null
    startsAt: string | null
    endsAt: string | null
    isRecurring: boolean
  }>
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  let resolvedCoachId = coachId
  if (!resolvedCoachId) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
    resolvedCoachId = coach?.id
  }
  if (!resolvedCoachId) return { slots: [] }

  const { data, error } = await supabase
    .from("coach_availability")
    .select(
      "id, weekday, start_time, end_time, starts_at, ends_at, is_recurring"
    )
    .eq("coach_id", resolvedCoachId)
    .order("weekday", { ascending: true })

  if (error) return { slots: [] }

  return {
    slots: (data || []).map((s) => ({
      id: s.id as string,
      weekday: s.weekday == null ? null : Number(s.weekday),
      startTime: (s.start_time as string) || null,
      endTime: (s.end_time as string) || null,
      startsAt: (s.starts_at as string) || null,
      endsAt: (s.ends_at as string) || null,
      isRecurring: Boolean(s.is_recurring),
    })),
  }
}

export async function upsertCoachAvailabilityAction(input: {
  weekday: number
  startTime: string
  endTime: string
}): Promise<{ error?: string; id?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
  if (!coach) return { error: "Profil coach requis." }

  if (input.weekday < 0 || input.weekday > 6) {
    return { error: "Jour invalide." }
  }

  const { data, error } = await supabase
    .from("coach_availability")
    .insert({
      coach_id: coach.id,
      weekday: input.weekday,
      start_time: input.startTime,
      end_time: input.endTime,
      is_recurring: true,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }
  revalidatePath("/coaching/session")
  return { id: data.id as string }
}

export async function deleteCoachAvailabilityAction(
  id: string
): Promise<{ error?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
  if (!coach) return { error: "Profil coach requis." }

  const { error } = await supabase
    .from("coach_availability")
    .delete()
    .eq("id", id)
    .eq("coach_id", coach.id)

  if (error) return { error: error.message }
  revalidatePath("/coaching/session")
  return {}
}

export async function bookCoachingSlotAction(input: {
  coachId: string
  scheduledStart: string
  credits: number
  displayAnonymous?: boolean
  genderPreference?: "female" | "male" | "none"
  subject?: string
  message?: string
  objectives?: string[]
  splitPlan?: Record<string, unknown>
}): Promise<{ error?: string; sessionId?: string; bookingId?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const credits = Math.max(1, Math.min(4, Math.floor(input.credits || 1)))
  const bal = await getCoachingCreditBalanceAction()
  if ((bal.balance ?? 0) < credits) {
    return { error: "Crédits insuffisants pour cette réservation." }
  }

  const displayedMinutes = credits * 30
  const displayAnonymous = Boolean(input.displayAnonymous)

  const { data: booking, error: bookErr } = await supabase
    .from("coaching_bookings")
    .insert({
      user_id: user.id,
      coach_id: input.coachId,
      credits_reserved: credits,
      scheduled_start: input.scheduledStart,
      status: "SCHEDULED",
      gender_preference: input.genderPreference || "none",
      display_anonymous: displayAnonymous,
      brief_subject: input.subject || null,
      brief_message: input.message || null,
      brief_objectives: input.objectives || [],
      split_plan: input.splitPlan || {},
    })
    .select("id")
    .single()

  if (bookErr || !booking) {
    return { error: bookErr?.message || "Réservation impossible." }
  }

  await supabase.from("coaching_coach_links").upsert(
    {
      user_id: user.id,
      coach_id: input.coachId,
      linked_at: new Date().toISOString(),
    },
    { onConflict: "user_id,coach_id" }
  )

  const { data: session, error: sessErr } = await supabase
    .from("coaching_sessions")
    .insert({
      booking_id: booking.id,
      user_id: user.id,
      coach_id: input.coachId,
      status: "WAITING",
      displayed_minutes: displayedMinutes,
      allocated_seconds: displayedMinutes === 60 ? 50 * 60 : 40 * 60,
      client_display_mode: displayAnonymous ? "anonymous" : "profile",
      client_display_name: displayAnonymous ? "Membre" : null,
    })
    .select("id")
    .single()

  if (sessErr || !session) {
    return { error: sessErr?.message || "Session impossible à créer." }
  }

  // Confirmation + rappels mail (J-1 / H-1 via délai outbox)
  try {
    const admin = createAdminClient()
    const { data: coachRow } = await admin
      .from("coaches")
      .select("display_name")
      .eq("id", input.coachId)
      .maybeSingle()
    const coachName = (coachRow?.display_name as string) || "votre coach"

    const { data: profile } = await admin
      .from("profiles")
      .select("first_name")
      .eq("user_id", user.id)
      .maybeSingle()
    const firstName = (profile?.first_name as string) || ""

    const email =
      user.email ||
      (typeof user.user_metadata?.email === "string"
        ? user.user_metadata.email
        : "")

    if (email) {
      const { enqueueEmail } = await import("@/lib/email/outbox")
      const {
        coachingBookingConfirmEmailHtml,
        coachingSessionReminderEmailHtml,
      } = await import("@/lib/email/templates")
      const { resolveAppUrlSync } = await import("@/lib/auth/appUrl")
      const appUrl = resolveAppUrlSync()
      const sessionUrl = `${appUrl}/coaching/session`
      const when = new Date(input.scheduledStart)
      const whenLabel = when.toLocaleString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })

      await enqueueEmail({
        to: email,
        subject: `KELIAA · Séance confirmée avec ${coachName}`,
        html: coachingBookingConfirmEmailHtml({
          firstName,
          coachName,
          whenLabel,
          minutes: displayedMinutes,
          sessionUrl,
        }),
      })

      const msUntil = when.getTime() - Date.now()
      const delay24h = Math.floor((msUntil - 24 * 60 * 60 * 1000) / 1000)
      const delay1h = Math.floor((msUntil - 60 * 60 * 1000) / 1000)

      if (delay24h > 60) {
        await enqueueEmail({
          to: email,
          subject: `KELIAA · Rappel séance demain avec ${coachName}`,
          html: coachingSessionReminderEmailHtml({
            firstName,
            coachName,
            whenLabel,
            urgency: "24h",
            sessionUrl,
          }),
          delaySeconds: delay24h,
        })
      }
      if (delay1h > 60) {
        await enqueueEmail({
          to: email,
          subject: `KELIAA · Votre séance avec ${coachName} commence bientôt`,
          html: coachingSessionReminderEmailHtml({
            firstName,
            coachName,
            whenLabel,
            urgency: "1h",
            sessionUrl,
          }),
          delaySeconds: delay1h,
        })
      }
    }
  } catch (e) {
    console.warn("[coaching] email booking", e)
  }

  revalidatePath("/coaching/session")
  return { sessionId: session.id as string, bookingId: booking.id as string }
}

export async function sendCannedMessageAction(input: {
  role: CannedRole
  templateId: string
  bookingId?: string | null
  sessionId?: string | null
}): Promise<{ error?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const templates = COACHING_CANNED_TEMPLATES[input.role]
  const tpl = templates.find((t) => t.id === input.templateId)
  if (!tpl) return { error: "Message prédéfini inconnu." }

  const { error } = await supabase.from("coaching_canned_messages").insert({
    booking_id: input.bookingId || null,
    session_id: input.sessionId || null,
    from_role: input.role,
    from_user_id: user.id,
    template_id: tpl.id,
    body: tpl.body,
  })

  if (error) return { error: error.message }
  return {}
}

export async function listCannedMessagesAction(input: {
  bookingId?: string | null
  sessionId?: string | null
}): Promise<{
  error?: string
  messages?: Array<{
    id: string
    fromRole: string
    body: string
    createdAt: string
  }>
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  let query = supabase
    .from("coaching_canned_messages")
    .select("id, from_role, body, created_at")
    .order("created_at", { ascending: true })
    .limit(40)

  if (input.bookingId) query = query.eq("booking_id", input.bookingId)
  else if (input.sessionId) query = query.eq("session_id", input.sessionId)
  else return { messages: [] }

  const { data, error } = await query
  if (error) return { messages: [] }

  return {
    messages: (data || []).map((m) => ({
      id: m.id as string,
      fromRole: m.from_role as string,
      body: m.body as string,
      createdAt: m.created_at as string,
    })),
  }
}

export async function clearSessionReminderAction(
  sessionId: string,
  role: "client" | "coach"
): Promise<{ error?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const patch =
    role === "client"
      ? { reminder_cleared_client: true }
      : { reminder_cleared_coach: true }

  const { error } = await supabase
    .from("coaching_sessions")
    .update(patch)
    .eq("id", sessionId)

  if (error) return { error: error.message }
  return {}
}

export async function getUpcomingSessionRemindersAction(): Promise<{
  reminders?: Array<{
    sessionId: string
    role: "client" | "coach"
    label: string
    when: string
  }>
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { reminders: [] }

  const now = Date.now()
  const horizon = now + 26 * 60 * 60 * 1000

  const { data: asClient } = await supabase
    .from("coaching_sessions")
    .select(
      "id, reminder_cleared_client, status, coaching_bookings(scheduled_start), coaches(display_name)"
    )
    .eq("user_id", user.id)
    .in("status", ["WAITING", "PREP", "CONNECTING", "ACTIVE"])
    .eq("reminder_cleared_client", false)
    .limit(10)

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  const { data: asCoach } = coach
    ? await supabase
        .from("coaching_sessions")
        .select(
          "id, reminder_cleared_coach, status, coaching_bookings(scheduled_start), client_display_name"
        )
        .eq("coach_id", coach.id)
        .in("status", ["WAITING", "PREP", "CONNECTING", "ACTIVE"])
        .eq("reminder_cleared_coach", false)
        .limit(10)
    : { data: [] as never[] }

  const reminders: Array<{
    sessionId: string
    role: "client" | "coach"
    label: string
    when: string
  }> = []

  for (const row of asClient || []) {
    const booking = Array.isArray(row.coaching_bookings)
      ? row.coaching_bookings[0]
      : row.coaching_bookings
    const when = (booking?.scheduled_start as string) || ""
    if (!when) continue
    const t = new Date(when).getTime()
    if (t < now - 30 * 60 * 1000 || t > horizon) continue
    const coachRow = Array.isArray(row.coaches) ? row.coaches[0] : row.coaches
    reminders.push({
      sessionId: row.id as string,
      role: "client",
      label: `Séance avec ${coachRow?.display_name || "votre coach"}`,
      when,
    })
  }

  for (const row of asCoach || []) {
    const booking = Array.isArray(row.coaching_bookings)
      ? row.coaching_bookings[0]
      : row.coaching_bookings
    const when = (booking?.scheduled_start as string) || ""
    if (!when) continue
    const t = new Date(when).getTime()
    if (t < now - 30 * 60 * 1000 || t > horizon) continue
    reminders.push({
      sessionId: row.id as string,
      role: "coach",
      label: `Séance avec ${row.client_display_name || "un membre"}`,
      when,
    })
  }

  return { reminders }
}

export async function markSessionJoinedAction(input: {
  sessionId: string
  role: "client" | "coach"
}): Promise<{
  error?: string
  status?: string
  clientJoined?: boolean
  coachJoined?: boolean
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, status, client_joined_at, coach_joined_at")
    .eq("id", input.sessionId)
    .maybeSingle()
  if (!session) return { error: "Session introuvable." }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (input.role === "client") {
    patch.client_joined_at = new Date().toISOString()
    patch.reminder_cleared_client = true
  } else {
    patch.coach_joined_at = new Date().toISOString()
    patch.reminder_cleared_coach = true
  }

  const clientJoined =
    input.role === "client" || Boolean(session.client_joined_at)
  const coachJoined =
    input.role === "coach" || Boolean(session.coach_joined_at)

  let status = session.status as string
  if (
    clientJoined &&
    coachJoined &&
    (status === "WAITING" || status === "SCHEDULED")
  ) {
    status = "PREP"
    patch.status = "PREP"
    patch.prep_started_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("coaching_sessions")
    .update(patch)
    .eq("id", input.sessionId)

  if (error) return { error: error.message }
  return { status, clientJoined, coachJoined }
}

export async function getCoachingSessionPresenceAction(
  sessionId: string
): Promise<{
  error?: string
  status?: string
  clientJoined?: boolean
  coachJoined?: boolean
  bothReady?: boolean
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session, error } = await supabase
    .from("coaching_sessions")
    .select("id, status, client_joined_at, coach_joined_at")
    .eq("id", sessionId)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!session) return { error: "Session introuvable." }

  const clientJoined = Boolean(session.client_joined_at)
  const coachJoined = Boolean(session.coach_joined_at)
  const status = session.status as string
  const bothReady =
    clientJoined &&
    coachJoined &&
    (status === "PREP" || status === "ACTIVE" || status === "WAITING")

  return {
    status,
    clientJoined,
    coachJoined,
    bothReady: clientJoined && coachJoined,
  }
}

export async function startActiveSessionAction(
  sessionId: string
): Promise<{ error?: string; status?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, status, client_joined_at, coach_joined_at, started_at")
    .eq("id", sessionId)
    .maybeSingle()

  if (!session) return { error: "Session introuvable." }
  if (session.status === "ACTIVE") return { status: "ACTIVE" }
  if (session.status === "COMPLETED" || session.status === "CANCELLED") {
    return { error: "Session déjà terminée." }
  }
  if (!session.client_joined_at || !session.coach_joined_at) {
    return { error: "Les deux participants doivent être présents." }
  }

  // Salle ouverte — le chrono (started_at) ne démarre qu’à la connexion audio réelle
  const { error } = await supabase
    .from("coaching_sessions")
    .update({
      status: "ACTIVE",
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)

  if (error) return { error: error.message }
  return { status: "ACTIVE" }
}

/** Démarre le chrono officiel quand l’audio est bien établi entre les deux. */
export async function markSessionAudioStartedAction(
  sessionId: string
): Promise<{ error?: string; startedAt?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, status, started_at, client_joined_at, coach_joined_at")
    .eq("id", sessionId)
    .maybeSingle()

  if (!session) return { error: "Session introuvable." }
  if (session.status === "COMPLETED" || session.status === "CANCELLED") {
    return { error: "Session terminée." }
  }
  if (!session.client_joined_at || !session.coach_joined_at) {
    return { error: "Les deux participants doivent être présents." }
  }
  if (session.started_at) {
    return { startedAt: session.started_at as string }
  }

  const startedAt = new Date().toISOString()
  const { error } = await supabase
    .from("coaching_sessions")
    .update({
      status: "ACTIVE",
      started_at: startedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)

  if (error) return { error: error.message }
  return { startedAt }
}

export async function getSessionRuntimeAction(sessionId: string): Promise<{
  error?: string
  status?: string
  startedAt?: string | null
  displayedMinutes?: number
  requiredMs?: number
  elapsedMs?: number
  remainingMs?: number
  canComplete?: boolean
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { requiredSessionDurationMs } = await import("@/lib/coaching/domain")
  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, status, started_at, displayed_minutes")
    .eq("id", sessionId)
    .maybeSingle()

  if (!session) return { error: "Session introuvable." }
  const displayedMinutes = Number(session.displayed_minutes || 30)
  const requiredMs = requiredSessionDurationMs(displayedMinutes)
  const startedAt = (session.started_at as string) || null
  const elapsedMs = startedAt ? Math.max(0, Date.now() - new Date(startedAt).getTime()) : 0
  const remainingMs = startedAt ? Math.max(0, requiredMs - elapsedMs) : requiredMs

  return {
    status: session.status as string,
    startedAt,
    displayedMinutes,
    requiredMs,
    elapsedMs,
    remainingMs,
    canComplete: Boolean(startedAt) && elapsedMs >= requiredMs - 5_000,
  }
}

/** Quitte la salle d’attente sans terminer la séance (efface sa présence). */
export async function leaveWaitingRoomAction(input: {
  sessionId: string
  role: "client" | "coach"
}): Promise<{ error?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, status, client_joined_at, coach_joined_at, started_at")
    .eq("id", input.sessionId)
    .maybeSingle()
  if (!session) return { error: "Session introuvable." }
  // Si le chrono audio a déjà démarré, utiliser abortSessionAction côté UI
  if (session.status === "COMPLETED") return {}
  if (session.status === "ACTIVE" && session.started_at) return {}

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (input.role === "client") {
    patch.client_joined_at = null
  } else {
    patch.coach_joined_at = null
  }

  if (session.status === "PREP" || session.status === "ACTIVE") {
    patch.status = "WAITING"
    patch.prep_started_at = null
  }

  const { error } = await supabase
    .from("coaching_sessions")
    .update(patch)
    .eq("id", input.sessionId)

  if (error) return { error: error.message }
  return {}
}

/**
 * Interruption / échec : pas de crédits, pas de « séance complète ».
 * (ex. micro refusé, un seul participant, départ avant la durée.)
 */
export async function abortSessionAction(input: {
  sessionId: string
  reason?: string
}): Promise<{ error?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, status, booking_id, started_at")
    .eq("id", input.sessionId)
    .maybeSingle()

  if (!session) return { error: "Session introuvable." }
  if (session.status === "COMPLETED") return {}
  if (session.status === "CANCELLED") return {}

  const { error } = await supabase
    .from("coaching_sessions")
    .update({
      status: "CANCELLED",
      ended_at: new Date().toISOString(),
      end_reason: input.reason || "aborted",
      report_json: {
        aborted: true,
        reason: input.reason || "aborted",
        hadAudioStart: Boolean(session.started_at),
        at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.sessionId)

  if (error) return { error: error.message }

  if (session.booking_id) {
    await supabase
      .from("coaching_bookings")
      .update({ status: "CANCELLED", updated_at: new Date().toISOString() })
      .eq("id", session.booking_id)
  }

  revalidatePath("/coaching/session")
  return {}
}

/**
 * Séance complète uniquement si audio démarré ET durée (30 ou 60 min) écoulée.
 * C’est seulement là que les crédits sont consommés.
 */
export async function completeSessionAction(input: {
  sessionId: string
  consumeCredits?: boolean
}): Promise<{
  error?: string
  incomplete?: boolean
  remainingMs?: number
  completed?: boolean
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { requiredSessionDurationMs } = await import("@/lib/coaching/domain")

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select(
      "id, user_id, coach_id, displayed_minutes, status, booking_id, started_at, client_joined_at, coach_joined_at"
    )
    .eq("id", input.sessionId)
    .maybeSingle()

  if (!session) return { error: "Session introuvable." }
  if (session.status === "COMPLETED") return { completed: true }

  if (!session.client_joined_at || !session.coach_joined_at) {
    return {
      error:
        "La séance ne peut pas être validée : les deux participants ne se sont pas connectés.",
      incomplete: true,
    }
  }

  if (!session.started_at) {
    return {
      error:
        "La séance audio n’a pas démarré (pas de connexion entre les deux). Aucun crédit n’est consommé.",
      incomplete: true,
    }
  }

  const requiredMs = requiredSessionDurationMs(
    Number(session.displayed_minutes || 30)
  )
  const elapsed = Date.now() - new Date(session.started_at as string).getTime()
  if (elapsed < requiredMs - 5_000) {
    return {
      error: `La durée prévue n’est pas écoulée (${session.displayed_minutes} min). La séance n’est pas encore complète.`,
      incomplete: true,
      remainingMs: requiredMs - elapsed,
    }
  }

  const { error } = await supabase
    .from("coaching_sessions")
    .update({
      status: "COMPLETED",
      ended_at: new Date().toISOString(),
      end_reason: "duration_complete",
      report_json: {
        generatedAt: new Date().toISOString(),
        summary: "Séance menée à terme — en attente du rapport coach.",
        displayedMinutes: session.displayed_minutes,
        elapsedSeconds: Math.round(elapsed / 1000),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.sessionId)

  if (error) return { error: error.message }

  if (input.consumeCredits !== false) {
    const credits = Math.max(
      1,
      Math.round(Number(session.displayed_minutes || 30) / 30)
    )
    const admin = createAdminClient()
    // Évite double débit
    const { count } = await admin
      .from("coaching_credits_ledger")
      .select("id", { count: "exact", head: true })
      .eq("ref_session_id", session.id)
      .eq("reason", "session_completed")
    if ((count ?? 0) === 0) {
      await admin.from("coaching_credits_ledger").insert({
        user_id: session.user_id,
        delta_credits: -credits,
        reason: "session_completed",
        ref_session_id: session.id,
        metadata: { displayedMinutes: session.displayed_minutes },
      })
    }
  }

  if (session.booking_id) {
    await supabase
      .from("coaching_bookings")
      .update({ status: "COMPLETED", updated_at: new Date().toISOString() })
      .eq("id", session.booking_id)
  }

  revalidatePath("/coaching/session")
  return { completed: true }
}

export async function submitEndQuestionnaireAction(input: {
  sessionId: string
  role: "client" | "coach"
  score: number
  answers: Record<string, unknown>
  freeText?: string
  /** Rapport coach (canevas 4 points). */
  coachReport?: Record<string, string>
}): Promise<{ error?: string }> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const score = Math.min(5, Math.max(1, Math.floor(input.score)))

  const answers =
    input.role === "coach" && input.coachReport
      ? { ...input.answers, report: input.coachReport }
      : input.answers

  const { error } = await supabase.from("coaching_ratings").upsert(
    {
      session_id: input.sessionId,
      rater_role: input.role,
      rater_user_id: user.id,
      score,
      answers,
      free_text: input.freeText || null,
    },
    { onConflict: "session_id,rater_role" }
  )
  if (error) return { error: error.message }

  const flag =
    input.role === "client"
      ? { end_questionnaire_done_client: true }
      : { end_questionnaire_done_coach: true }

  const patch: Record<string, unknown> = {
    ...flag,
    updated_at: new Date().toISOString(),
  }

  if (input.role === "coach" && input.coachReport) {
    const { data: sess } = await supabase
      .from("coaching_sessions")
      .select("report_json")
      .eq("id", input.sessionId)
      .maybeSingle()
    const prev =
      sess?.report_json && typeof sess.report_json === "object"
        ? (sess.report_json as Record<string, unknown>)
        : {}
    patch.report_json = {
      ...prev,
      coachReport: input.coachReport,
      coachReportAt: new Date().toISOString(),
      summary: "Rapport de coaching renseigné par le coach.",
    }
  }

  await supabase.from("coaching_sessions").update(patch).eq("id", input.sessionId)

  revalidatePath("/coaching/session")
  return {}
}

async function assertSessionParticipant(input: {
  sessionId: string
  role: "client" | "coach"
}): Promise<{
  error?: string
  userId?: string
  displayName?: string
}> {
  const { supabase, user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const { data: session } = await supabase
    .from("coaching_sessions")
    .select("id, user_id, coach_id")
    .eq("id", input.sessionId)
    .maybeSingle()
  if (!session) return { error: "Session introuvable." }

  if (input.role === "client" && session.user_id !== user.id) {
    return { error: "Accès refusé." }
  }
  if (input.role === "coach") {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id, display_name")
      .eq("user_id", user.id)
      .maybeSingle()
    if (!coach || coach.id !== session.coach_id) {
      return { error: "Accès refusé." }
    }
    return {
      userId: user.id,
      displayName: (coach.display_name as string) || "Coach",
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("user_id", user.id)
    .maybeSingle()

  const displayName =
    (profile?.first_name as string)?.trim() || "Membre"

  return { userId: user.id, displayName }
}

export async function appendCoachingSessionTranscriptAction(input: {
  sessionId: string
  role: "client" | "coach"
  chunk: string
}): Promise<{ error?: string; ok?: boolean }> {
  const gate = await assertSessionParticipant(input)
  if (gate.error || !gate.userId) return { error: gate.error || "Accès refusé." }

  const text = input.chunk.replace(/\s+/g, " ").trim().slice(0, 2000)
  if (!text) return { ok: true }

  const label = input.role === "coach" ? "Coach" : "Membre"
  const line = `[${label}] ${text}`
  const admin = createAdminClient()
  const { data: session } = await admin
    .from("coaching_sessions")
    .select("transcript_text")
    .eq("id", input.sessionId)
    .maybeSingle()

  const prev = ((session?.transcript_text as string) || "").trim()
  const next = `${prev}${prev ? "\n" : ""}${line}`.slice(0, 48000)

  const { error } = await admin
    .from("coaching_sessions")
    .update({
      transcript_text: next,
      transcript_status: "ready",
    })
    .eq("id", input.sessionId)

  if (error) return { error: error.message }
  return { ok: true }
}

/**
 * Ouvre la salle audio coaching (LiveKit Cloud).
 * Auth = compte KELIAA uniquement — pas Google/GitHub, pas de CB Daily.
 */
export async function issueCoachingMediaRoomAction(input: {
  sessionId: string
  role: "client" | "coach"
}): Promise<{
  error?: string
  room?: {
    provider: "livekit"
    url: string
    token: string
    roomName: string
    displayName: string
  }
}> {
  const gate = await assertSessionParticipant(input)
  if (gate.error || !gate.userId) return { error: gate.error || "Accès refusé." }

  const displayName =
    gate.displayName || (input.role === "coach" ? "Coach" : "Membre")

  const lk = await issueLiveKitJoinCredentials({
    sessionId: input.sessionId,
    userId: gate.userId,
    displayName,
    role: input.role,
  })
  if (lk.error || !lk.url || !lk.token || !lk.roomName) {
    return { error: lk.error || "Salle indisponible." }
  }

  return {
    room: {
      provider: "livekit",
      url: lk.url,
      token: lk.token,
      roomName: lk.roomName,
      displayName,
    },
  }
}

/** @deprecated meet.jit.si (auth Google) — préférer issueCoachingMediaRoomAction. */
export async function issueJitsiRoomAction(input: {
  sessionId: string
  role: "client" | "coach"
}): Promise<{
  error?: string
  room?: {
    domain: string
    roomName: string
    externalApiUrl: string
    displayName: string
  }
}> {
  const gate = await assertSessionParticipant(input)
  if (gate.error || !gate.userId) return { error: gate.error || "Accès refusé." }

  const cfg = buildJitsiRoomConfig(input.sessionId)
  return {
    room: {
      ...cfg,
      displayName:
        gate.displayName || (input.role === "coach" ? "Coach" : "Membre"),
    },
  }
}

/** @deprecated WebRTC — préférer issueJitsiRoomAction. */
export async function issueAudioJoinTokenAction(input: {
  sessionId: string
  role: "client" | "coach"
}): Promise<{
  error?: string
  token?: {
    sessionId: string
    role: "client" | "coach"
    expiresAt: number
    iceServers: RTCIceServer[]
  }
}> {
  const gate = await assertSessionParticipant(input)
  if (gate.error || !gate.userId) return { error: gate.error || "Accès refusé." }

  const provider = getVideoSessionProvider()
  await provider.createRoom(input.sessionId)
  const token = await provider.issueJoinToken({
    sessionId: input.sessionId,
    userId: gate.userId,
    role: input.role,
  })
  return { token }
}

export async function previewSplitCreditsAction(input: {
  sessions: number
  minutesPerSession: 30 | 60
}): Promise<{ credits: number }> {
  return {
    credits: creditsFromPackSessions(input.sessions, input.minutesPerSession),
  }
}
