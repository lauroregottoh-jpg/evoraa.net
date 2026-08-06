"use server"

import { sendResendEmail } from "@/lib/email/send"
import { brandedEmailShell, contactAckEmailHtml } from "@/lib/email/templates"
import { escapeHtml } from "@/lib/security/html"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"
import { contactSchema, firstZodError } from "@/lib/security/schemas"

const SUBJECT_LABELS: Record<string, string> = {
  question: "Question générale",
  coaching: "Conseil / coaching",
  report: "Signalement / éthique",
  billing: "Abonnement / paiement",
  other: "Autre",
}

export async function submitContactAction(payload: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ error?: string; success?: boolean; emailed?: boolean }> {
  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return { error: firstZodError(parsed.error) }
  }
  const { name, email, message, subject: subjectCode } = parsed.data

  const rl = await enforceRateLimit({ ...RL.contact, subject: email })
  if (!rl.ok) return { error: rl.error }

  const subjectLabel = SUBJECT_LABELS[subjectCode] || "Autre"
  const to = process.env.CONTACT_INBOX_EMAIL || "lauroregottoh@gmail.com"
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subjectLabel)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>")

  const html = brandedEmailShell({
    title: `Contact — ${subjectLabel}`,
    bodyHtml: `
      <p><strong>De :</strong> ${safeName} &lt;${safeEmail}&gt;</p>
      <p><strong>Sujet :</strong> ${safeSubject}</p>
      <p style="margin-top:16px">${safeMessage}</p>
    `,
  })

  const result = await sendResendEmail({
    to,
    subject: `[KELIAA Contact] ${subjectLabel} — ${name}`,
    html,
    replyTo: email,
  })

  if ("skipped" in result && result.skipped) {
    return {
      error:
        "L’envoi automatique n’est pas encore configuré. Écrivez-nous à contact@keliaa.org avec votre message.",
    }
  }

  if ("error" in result && result.error) {
    return { error: "Impossible d’envoyer le message pour le moment." }
  }

  await sendResendEmail({
    to: email,
    subject: "Keliaa — nous avons bien reçu votre message",
    html: contactAckEmailHtml({ name: safeName }),
  })

  return { success: true, emailed: true }
}
