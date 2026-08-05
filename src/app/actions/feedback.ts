"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { sendEmailWithRetry } from "@/lib/email/outbox"
import { brandedEmailShell } from "@/lib/email/templates"
import { escapeHtml } from "@/lib/security/html"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"
import { feedbackSchema, firstZodError } from "@/lib/security/schemas"
import { FEEDBACK_CATEGORY_LABELS } from "@/lib/feedback/categories"

export async function submitFeedbackAction(input: {
  name: string
  email: string
  category: string
  message: string
  pagePath?: string
  screenshotUrl?: string | null
}): Promise<{ error?: string; success?: boolean }> {
  try {
    const parsed = feedbackSchema.safeParse(input)
    if (!parsed.success) return { error: firstZodError(parsed.error) }
    const { name, email, category, message, pagePath } = parsed.data
    const screenshotUrl = input.screenshotUrl?.trim() || null

    // Fail-open : l’aide inscription ne doit jamais être bloquée par une panne rate-limit.
    const rl = await enforceRateLimit({
      ...RL.contact,
      action: "feedback",
      subject: email,
      failClosed: false,
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

    let stored = false
    try {
      const admin = createAdminClient()
      const row: Record<string, unknown> = {
        user_id: userId,
        name,
        email,
        category,
        message,
        page_path: pagePath || null,
        status: "new",
      }
      if (screenshotUrl) row.screenshot_url = screenshotUrl
      const { error } = await admin.from("user_feedback").insert(row)
      if (error) {
        console.error("[feedback] insert", error.message)
        // Retry without screenshot_url if column missing (migration not applied)
        if (screenshotUrl && /screenshot/i.test(error.message)) {
          const { error: e2 } = await admin.from("user_feedback").insert({
            user_id: userId,
            name,
            email,
            category,
            message,
            page_path: pagePath || null,
            status: "new",
          })
          stored = !e2
          if (e2) console.error("[feedback] insert retry", e2.message)
        }
      } else {
        stored = true
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
      ${
        screenshotUrl
          ? `<p><strong>Capture :</strong> <a href="${escapeHtml(screenshotUrl)}">${escapeHtml(screenshotUrl)}</a></p>`
          : ""
      }
      <p style="margin-top:16px">${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `,
    })

    let emailed = false
    try {
      const mail = await sendEmailWithRetry({
        to: inbox,
        subject: `[KELIAA Retour] ${label} — ${name}`,
        html,
        replyTo: email,
      })
      emailed = Boolean(
        ("success" in mail && mail.success) ||
          ("queued" in mail && mail.queued) ||
          ("skipped" in mail && mail.skipped)
      )
    } catch (e) {
      console.error("[feedback] email", e)
    }

    // Succès si au moins une voie a marché (DB ou email).
    if (stored || emailed) return { success: true }

    return {
      error:
        "Message non enregistré pour le moment. Réessayez dans une minute, ou écrivez à contact@keliaa.org.",
    }
  } catch (e) {
    console.error("[feedback] fatal", e)
    return {
      error: "Envoi impossible pour le moment. Réessayez.",
    }
  }
}

/** Formulaire aide inscription : sans auth, ne doit jamais planter silencieusement. */
export async function submitSignupHelpAction(input: {
  firstName: string
  lastName: string
  email: string
  message: string
  /** base64 without data: prefix — optional */
  screenshotBase64?: string
  screenshotContentType?: string
}): Promise<{ error?: string; success?: boolean }> {
  try {
    const firstName = String(input.firstName ?? "").trim()
    const lastName = String(input.lastName ?? "").trim()
    const email = String(input.email ?? "").trim()
    const message = String(input.message ?? "").trim()

    if (!firstName || !lastName) {
      return { error: "Nom et prénom sont requis." }
    }
    if (!email) return { error: "E-mail requis." }
    if (message.length < 8) {
      return { error: "Décrivez brièvement le problème (quelques mots suffisent)." }
    }

    let screenshotUrl: string | null = null
    const b64 = input.screenshotBase64?.trim()
    const ctype = input.screenshotContentType?.trim() || "image/jpeg"
    if (b64) {
      try {
        const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"]
        if (!allowed.includes(ctype)) {
          // ignore invalid type — don't block the ticket
        } else {
          const buf = Buffer.from(b64, "base64")
          if (buf.length > 0 && buf.length <= 5 * 1024 * 1024) {
            const admin = createAdminClient()
            const ext =
              ctype === "image/png"
                ? "png"
                : ctype === "image/webp"
                  ? "webp"
                  : ctype === "image/gif"
                    ? "gif"
                    : "jpg"
            const path = `signup/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
            const { error: upErr } = await admin.storage
              .from("support-screenshots")
              .upload(path, buf, { contentType: ctype, upsert: false })
            if (!upErr) {
              const { data } = admin.storage
                .from("support-screenshots")
                .getPublicUrl(path)
              screenshotUrl = data.publicUrl
            } else {
              console.error("[signup-help] upload soft-fail", upErr.message)
            }
          }
        }
      } catch (e) {
        console.error("[signup-help] upload soft-fail", e)
      }
    }

    return submitFeedbackAction({
      name: `${firstName} ${lastName}`.trim(),
      email,
      category: "signup_help",
      message,
      pagePath: "/register/help",
      screenshotUrl,
    })
  } catch (e) {
    console.error("[signup-help] fatal", e)
    return { error: "Envoi impossible pour le moment. Réessayez." }
  }
}

export async function adminListFeedback() {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("user_feedback")
      .select(
        "id, user_id, name, email, category, message, page_path, screenshot_url, status, admin_note, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(200)
    if (error) {
      // Fallback if screenshot_url column missing
      const retry = await admin
        .from("user_feedback")
        .select(
          "id, user_id, name, email, category, message, page_path, status, admin_note, created_at, updated_at"
        )
        .order("created_at", { ascending: false })
        .limit(200)
      if (retry.error)
        return { error: retry.error.message, items: [] as FeedbackRow[] }
      return { items: (retry.data ?? []) as FeedbackRow[] }
    }
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
  screenshot_url?: string | null
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
