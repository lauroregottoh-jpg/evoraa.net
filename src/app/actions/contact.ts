"use server"

import { sendResendEmail } from "@/lib/email/send"
import { brandedEmailShell, contactAckEmailHtml } from "@/lib/email/templates"
import { escapeHtml } from "@/lib/security/html"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"

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
  const name = payload.name.trim().slice(0, 120)
  const email = payload.email.trim().slice(0, 200)
  const message = payload.message.trim().slice(0, 5000)
  const subjectCode = payload.subject.trim() || "question"

  if (!name || !email || !message) {
    return { error: "Nom, email et message sont requis." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Email invalide." }
  }
  if (message.length < 20) {
    return { error: "Votre message doit faire au moins 20 caractères." }
  }

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
        "L’envoi automatique n’est pas encore configuré. Écrivez-nous à lauroregottoh@gmail.com avec votre message.",
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
