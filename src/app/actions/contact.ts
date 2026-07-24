"use server"

import { sendEmailNotificationStub } from "@/app/actions/notifications"

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
  const to = process.env.CONTACT_INBOX_EMAIL || "contact@keliaa.net"
  const html = `
    <p><strong>De :</strong> ${name} &lt;${email}&gt;</p>
    <p><strong>Sujet :</strong> ${subjectLabel}</p>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `

  const result = await sendEmailNotificationStub({
    to,
    subject: `[KELIAA Contact] ${subjectLabel} — ${name}`,
    html,
  })

  if ("skipped" in result && result.skipped) {
    // Honest fallback: no fake success — ask user to email directly
    return {
      error:
        "L’envoi automatique n’est pas encore configuré. Écrivez-nous à contact@keliaa.net avec votre message.",
    }
  }

  if ("error" in result && result.error) {
    return { error: result.error }
  }

  return { success: true, emailed: true }
}
