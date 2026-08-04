"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { sendEmailWithRetry } from "@/lib/email/outbox"
import { brandedEmailShell } from "@/lib/email/templates"
import { escapeHtml } from "@/lib/security/html"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"
import { feedbackSchema, firstZodError } from "@/lib/security/schemas"

export const FEEDBACK_CATEGORY_LABELS: Record<string, string> = {
  signup_help: "Problème d’inscription",
  complaint: "Plainte / difficulté",
  suggestion: "Suggestion d’amélioration",
  ux: "Expérience utilisateur",
  other: "Autre",
}

export async function submitFeedbackAction(input: {
  name: string
  email: string
  category: string
  message: string
  pagePath?: string
}): Promise<{ error?: string; success?: boolean }> {
  const parsed = feedbackSchema.safeParse(input)
  if (!parsed.success) return { error: firstZodError(parsed.error) }
  const { name, email, category, message, pagePath } = parsed.data

  const rl = await enforceRateLimit({
    ...RL.contact,
    action: "feedback",
    subject: email,
  })
  if (!rl.ok) return { error: rl.error }

  let userId: string | null = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id ?? null
  } catch {
    /* anonymous ok */
  }

  try {
    const admin = createAdminClient()
    const { error } = await admin.from("user_feedback").insert({
      user_id: userId,
      name,
      email,
      category,
      message,
      page_path: pagePath || null,
      status: "new",
    })
    if (error) {
      console.error("[feedback] insert", error.message)
      // Continue to email fallback if table not migrated yet
    }
  } catch (e) {
    console.error("[feedback] admin", e)
  }

  const label = FEEDBACK_CATEGORY_LABELS[category] || category
  const inbox = process.env.CONTACT_INBOX_EMAIL || "lauroregottoh@gmail.com"
  const html = brandedEmailShell({
    title: `Retour — ${label}`,
    bodyHtml: `
      <p><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Catégorie :</strong> ${escapeHtml(label)}</p>
      ${pagePath ? `<p><strong>Page :</strong> ${escapeHtml(pagePath)}</p>` : ""}
      <p style="margin-top:16px">${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `,
  })

  await sendEmailWithRetry({
    to: inbox,
    subject: `[KELIAA Retour] ${label} — ${name}`,
    html,
    replyTo: email,
  })

  return { success: true }
}

export async function adminListFeedback() {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("user_feedback")
      .select(
        "id, user_id, name, email, category, message, page_path, status, admin_note, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(200)
    if (error) return { error: error.message, items: [] as FeedbackRow[] }
    return { items: (data ?? []) as FeedbackRow[] }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Erreur",
      items: [] as FeedbackRow[],
    }
  }
}

export type FeedbackRow = {
  id: string
  user_id: string | null
  name: string | null
  email: string | null
  category: string
  message: string
  page_path: string | null
  status: string
  admin_note: string | null
  created_at: string
  updated_at: string | null
}

export async function adminUpdateFeedbackStatus(input: {
  id: string
  status: "new" | "reviewed" | "resolved"
  adminNote?: string
}) {
  try {
    const admin = createAdminClient()
    const patch: Record<string, unknown> = {
      status: input.status,
      updated_at: new Date().toISOString(),
    }
    if (input.adminNote != null) patch.admin_note = input.adminNote
    const { error } = await admin
      .from("user_feedback")
      .update(patch)
      .eq("id", input.id)
    if (error) return { error: error.message }
    revalidatePath("/ops-keliaa-hx7")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur" }
  }
}
