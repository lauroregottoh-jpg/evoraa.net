/**
 * Envoi Resend — réservé au serveur (route handlers / actions).
 * Ne pas exporter depuis un fichier `"use server"` (sinon callable côté client).
 */

function defaultFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() || "KELIAA <contact@keliaa.org>"
  )
}

export async function sendResendEmail(input: {
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
      console.error("[resend]", detail.slice(0, 400))
      return { error: "Envoi email impossible." }
    }
    return { success: true as const }
  } catch {
    return { error: "email_failed" }
  }
}
