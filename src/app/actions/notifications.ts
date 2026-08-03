"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function createNotification(input: {
  userId: string
  title: string
  body: string
}) {
  const supabase = await createClient()
  await supabase.from("notifications").insert({
    user_id: input.userId,
    title: input.title,
    body: input.body,
    is_read: false,
  })
}

export async function listMyNotifications() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié.", notifications: [] }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, body, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30)

  if (error) return { error: error.message, notifications: [] }
  return { notifications: data ?? [] }
}

export async function markNotificationReadAction(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." }

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/notifications")
  return { success: true }
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." }

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  revalidatePath("/notifications")
  return { success: true }
}

function defaultFromAddress() {
  // Prod Keliaa : domaine vérifié chez Resend → contact@keliaa.org
  // Fallback tests Resend sans domaine : onboarding@resend.dev
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "KELIAA <contact@keliaa.org>"
  )
}

/** Email brandé via Resend (ignore silencieusement si clé absente). */
export async function sendEmailNotificationStub(input: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    return { skipped: true as const, reason: "RESEND_API_KEY absent" }
  }
  try {
    const payload: Record<string, unknown> = {
      from: defaultFromAddress(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }
    if (input.replyTo) payload.reply_to = input.replyTo

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const detail = await res.text()
      console.error("[resend]", detail)
      return { error: detail }
    }
    return { success: true as const }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "email_failed" }
  }
}
