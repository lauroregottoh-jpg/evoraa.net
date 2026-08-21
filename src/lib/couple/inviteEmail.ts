import { brandedEmailShell } from "@/lib/email/templates"
import { sendEmailWithRetry } from "@/lib/email/outbox"

export function coupleAccessEmailHtml(input: {
  firstName: string
  spaceUrl: string
  partnerUrl: string
  inviteCode: string
}) {
  const name = input.firstName.trim() || "ami(e)"
  return brandedEmailShell({
    title: "Votre espace couple est ouvert",
    preheader: `Code partenaire : ${input.inviteCode}`,
    bodyHtml: `
      <p>Bonjour ${name},</p>
      <p>Votre bilan couple est activé. Deux liens :</p>
      <p><strong>Votre espace (vous deux, une fois inscrits) :</strong><br/>
      <a href="${input.spaceUrl}">${input.spaceUrl}</a></p>
      <p><strong>Lien à envoyer à l’autre :</strong><br/>
      <a href="${input.partnerUrl}">${input.partnerUrl}</a></p>
      <p><strong>Code à lui communiquer :</strong>
      <span style="font-family:monospace;font-size:18px;letter-spacing:0.12em">${input.inviteCode}</span></p>
      <p>S’il/elle n’a pas encore de compte KELIAA, le lien demande d’abord l’inscription. Après inscription, un nouveau clic ouvre l’espace (ou la page du code).</p>
      <p>S’il/elle a déjà un compte, le lien ouvre la page pour entrer le code.</p>
    `,
    ctaLabel: "Ouvrir mon espace couple",
    ctaHref: input.spaceUrl,
  })
}

export async function sendCoupleAccessEmail(input: {
  to: string
  firstName: string
  spaceUrl: string
  partnerUrl: string
  inviteCode: string
}) {
  if (!input.to || !input.inviteCode) return
  await sendEmailWithRetry({
    to: input.to,
    subject: "KELYA Couple — lien d’espace et code partenaire",
    html: coupleAccessEmailHtml(input),
  })
}
