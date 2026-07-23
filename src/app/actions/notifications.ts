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

/** Optional email via Resend when RESEND_API_KEY is set */
export async function sendEmailNotificationStub(input: {
  to: string
  subject: string
  html: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    return { skipped: true as const, reason: "RESEND_API_KEY absent" }
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "KELIA <noreply@kelia.net>",
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "email_failed" }
  }
}
