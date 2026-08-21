"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { COACHING_ROSTER, type CoachingRosterEntry } from "@/lib/coaching/roster"

const DEFAULT_SLOTS: Array<{ weekday: number; start: string; end: string }> = [
  { weekday: 1, start: "09:00", end: "10:00" },
  { weekday: 1, start: "15:00", end: "16:00" },
  { weekday: 2, start: "09:00", end: "10:00" },
  { weekday: 2, start: "15:00", end: "16:00" },
  { weekday: 3, start: "09:00", end: "10:00" },
  { weekday: 3, start: "15:00", end: "16:00" },
  { weekday: 4, start: "09:00", end: "10:00" },
  { weekday: 4, start: "15:00", end: "16:00" },
  { weekday: 5, start: "09:00", end: "10:00" },
  { weekday: 5, start: "15:00", end: "16:00" },
]

async function findExistingCoach(
  admin: ReturnType<typeof createAdminClient>,
  entry: CoachingRosterEntry
) {
  const codes = [entry.coachCode, ...entry.legacyCodes]
  const { data: byCode } = await admin
    .from("coaches")
    .select("id, display_name, gender, coach_code, status, accepts_sessions")
    .in("coach_code", codes)
    .limit(5)

  if (byCode?.length) return byCode[0]

  const { data: all } = await admin
    .from("coaches")
    .select("id, display_name, gender, coach_code, status, accepts_sessions")
    .eq("status", "active")
    .limit(40)

  return (
    (all || []).find((c) =>
      entry.nameMatchers.some((re) => re.test(String(c.display_name || "")))
    ) || null
  )
}

async function seedAvailability(
  admin: ReturnType<typeof createAdminClient>,
  coachId: string
) {
  const { count } = await admin
    .from("coach_availability")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", coachId)

  if ((count ?? 0) > 0) return

  await admin.from("coach_availability").insert(
    DEFAULT_SLOTS.map((s) => ({
      coach_id: coachId,
      weekday: s.weekday,
      start_time: s.start,
      end_time: s.end,
      is_recurring: true,
    }))
  )
}

/**
 * Garantit Sara + Antoine actifs, avec créneaux par défaut si besoin.
 */
export async function ensureCoachingRoster(): Promise<
  Array<{
    id: string
    name: string
    gender: "female" | "male"
    key: string
  }>
> {
  const admin = createAdminClient()
  const out: Array<{
    id: string
    name: string
    gender: "female" | "male"
    key: string
  }> = []

  for (const entry of COACHING_ROSTER) {
    const existing = await findExistingCoach(admin, entry)
    let id = existing?.id as string | undefined

    if (id) {
      await admin
        .from("coaches")
        .update({
          display_name: entry.displayName,
          gender: entry.gender,
          status: "active",
          accepts_sessions: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
    } else {
      const { data: created, error } = await admin
        .from("coaches")
        .insert({
          display_name: entry.displayName,
          gender: entry.gender,
          coach_code: entry.coachCode,
          status: "active",
          accepts_sessions: true,
          short_bio: `Coach ${entry.displayName} — KELIAA`,
          specialties: ["accompagnement", "communication"],
        })
        .select("id")
        .single()
      if (error || !created) continue
      id = created.id as string
    }

    if (!id) continue
    await seedAvailability(admin, id)
    out.push({
      id,
      name: entry.displayName,
      gender: entry.gender,
      key: entry.key,
    })
  }

  return out
}
