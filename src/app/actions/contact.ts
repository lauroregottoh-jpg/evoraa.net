"use server"

import { sendEmailNotificationStub } from "@/app/actions/notifications"
import { brandedEmailShell, contactAckEmailHtml } from "@/lib/email/templates"

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
  const name = payload.name.trim()
  const email = payload.email.trim()
  const message = payload.message.trim()
  const subjectCode = payload.subject.trim() || "question"

  if (!name || !email || !message) {
    return { error: "Nom, email et message sont requis." }
  }
  if (!email.includes("@")) {
    return { error: "Email invalide." }
  }
  if (message.length < 20) {
    return { error: "Votre message doit faire au moins 20 caractères." }
  }

  const subjectLabel = SUBJECT_LABELS[subjectCode] || subjectCode
  const to = process.env.CONTACT_INBOX_EMAIL || "lauroregottoh@gmail.com"
  const html = brandedEmailShell({
    title: `Contact — ${subjectLabel}`,
    bodyHtml: `
      <p><strong>De :</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Sujet :</strong> ${subjectLabel}</p>
      <p style="margin-top:16px">${message.replace(/\n/g, "<br/>")}</p>
    `,
  })

  const result = await sendEmailNotificationStub({
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
    return { error: result.error }
  }

  // Accusé de réception membre (best-effort)
  await sendEmailNotificationStub({
    to: email,
    subject: "Keliaa — nous avons bien reçu votre message",
    html: contactAckEmailHtml({ name }),
  })

  return { success: true, emailed: true }
}
