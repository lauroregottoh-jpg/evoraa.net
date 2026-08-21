"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import {
  ASSESSMENT_ORDER,
  ASSESSMENTS,
  type AssessmentSlug,
} from "@/lib/assessments/questionBank"
import { grantMessageCredits } from "@/lib/billing/messageCredits"
import {
  ASSESSMENT_INVITES_PER_DAY,
  MESSAGE_CREDIT_PER_INVITE_ACCEPTED,
  MESSAGE_CREDIT_PER_INVITE_SENT,
  MESSAGE_CREDIT_PER_TEST,
  assessmentTitle,
} from "@/lib/matching/testCoverage"

function isSlug(value: string): value is AssessmentSlug {
  return (ASSESSMENT_ORDER as string[]).includes(value)
}

export type IncomingAssessmentInvite = {
  id: string
  testSlug: AssessmentSlug
  testTitle: string
  inviterName: string
  createdAt: string
}

export async function inviteToAssessmentAction(input: {
  inviteeUserId: string
  testSlug: string
}): Promise<{ error?: string; ok?: boolean; already?: boolean }> {
  const slug = input.testSlug
  if (!isSlug(slug)) return { error: "Questionnaire inconnu." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Vous devez être connecté." }
  if (user.id === input.inviteeUserId) {
    return { error: "Vous ne pouvez pas vous inviter vous-même." }
  }

  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from("assessment_invites")
    .select("id", { count: "exact", head: true })
    .eq("inviter_id", user.id)
    .gte("created_at", dayStart.toISOString())

  if ((count ?? 0) >= ASSESSMENT_INVITES_PER_DAY) {
    return {
      error: `Maximum ${ASSESSMENT_INVITES_PER_DAY} invitations par jour. Revenez demain.`,
    }
  }

  const { data: inserted, error } = await supabase
    .from("assessment_invites")
    .insert({
      inviter_id: user.id,
      invitee_id: input.inviteeUserId,
      test_slug: slug,
      status: "pending",
    })
    .select("id")
    .maybeSingle()

  if (error) {
    if (/unique|duplicate/i.test(error.message)) {
      return { ok: true, already: true }
    }
    return { error: error.message }
  }
  if (!inserted?.id) return { error: "Invitation non enregistrée." }

  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("user_id", user.id)
    .maybeSingle()
  const inviterName = (inviterProfile?.first_name as string) || "Un membre KELIAA"
  const title = assessmentTitle(slug)

  try {
    const admin = createAdminClient()
    await admin.from("notifications").insert({
      user_id: input.inviteeUserId,
      title: `${inviterName} vous invite`,
      body: `${inviterName} vous recommande / vous invite à faire le test « ${title} » afin de tester votre compatibilité.`,
      is_read: false,
    })
  } catch (e) {
    console.error("[invite] notify", e)
  }

  await grantMessageCredits({
    userId: user.id,
    amount: MESSAGE_CREDIT_PER_INVITE_SENT,
    source: "invite_sent",
    sourceKey: inserted.id as string,
  })

  revalidatePath("/compatibility")
  revalidatePath("/assessments")
  revalidatePath("/notifications")
  revalidatePath("/messages")
  return { ok: true }
}

export async function listIncomingAssessmentInvites(): Promise<{
  invites: IncomingAssessmentInvite[]
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { invites: [] }

  const { data: rows } = await supabase
    .from("assessment_invites")
    .select("id, test_slug, inviter_id, created_at")
    .eq("invitee_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(20)

  if (!rows?.length) return { invites: [] }

  const inviterIds = [...new Set(rows.map((r) => r.inviter_id as string))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name")
    .in("user_id", inviterIds)
  const nameByUser = new Map(
    (profiles ?? []).map((p) => [p.user_id as string, (p.first_name as string) || "Un membre"])
  )

  return {
    invites: rows
      .filter((r) => isSlug(String(r.test_slug)))
      .map((r) => {
        const slug = r.test_slug as AssessmentSlug
        return {
          id: r.id as string,
          testSlug: slug,
          testTitle: ASSESSMENTS[slug].name,
          inviterName: nameByUser.get(r.inviter_id as string) || "Un membre",
          createdAt: (r.created_at as string) || "",
        }
      }),
  }
}

/** Appelé après une première validation de test. */
export async function grantCreditsForCompletedTest(input: {
  userId: string
  slug: AssessmentSlug
  isFirstCompletion: boolean
}): Promise<void> {
  if (input.isFirstCompletion) {
    await grantMessageCredits({
      userId: input.userId,
      amount: MESSAGE_CREDIT_PER_TEST,
      source: "test_complete",
      sourceKey: input.slug,
    })
  }

  try {
    const admin = createAdminClient()
    const { data: pending } = await admin
      .from("assessment_invites")
      .select("id, inviter_id")
      .eq("invitee_id", input.userId)
      .eq("test_slug", input.slug)
      .eq("status", "pending")

    for (const row of pending ?? []) {
      await admin
        .from("assessment_invites")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", row.id)

      await grantMessageCredits({
        userId: row.inviter_id as string,
        amount: MESSAGE_CREDIT_PER_INVITE_ACCEPTED,
        source: "invite_accepted",
        sourceKey: row.id as string,
      })

      const { data: invitee } = await admin
        .from("profiles")
        .select("first_name")
        .eq("user_id", input.userId)
        .maybeSingle()
      const name = (invitee?.first_name as string) || "Un membre"
      await admin.from("notifications").insert({
        user_id: row.inviter_id,
        title: `${name} a fait le test`,
        body: `${name} a rempli « ${assessmentTitle(input.slug)} ». +${MESSAGE_CREDIT_PER_INVITE_ACCEPTED} messages (20 jours).`,
        is_read: false,
      })
    }
  } catch (e) {
    console.error("[invite] complete", e)
  }
}
