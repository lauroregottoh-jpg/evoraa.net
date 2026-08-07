/** Templates email brandés Keliaa / KELIAA™ (Resend). */

export function brandedEmailShell(opts: {
  title: string
  preheader?: string
  bodyHtml: string
  ctaLabel?: string
  ctaHref?: string
}) {
  const year = new Date().getFullYear()
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>`
    : ""
  const cta =
    opts.ctaHref && opts.ctaLabel
      ? `<p style="margin:28px 0 8px;text-align:center">
          <a href="${opts.ctaHref}" style="display:inline-block;background:#1F4B3A;color:#ffffff;text-decoration:none;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;padding:14px 28px;border-radius:12px">
            ${opts.ctaLabel}
          </a>
        </p>`
      : ""

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:#EEF1EF;font-family:Arial,Helvetica,sans-serif;color:#1A1A1A">
  ${preheader}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#EEF1EF;padding:32px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #D9E0DC">
          <tr>
            <td style="background:linear-gradient(135deg,#1F4B3A,#2F6B52);padding:28px 28px 22px;text-align:center">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;letter-spacing:0.04em;color:#ffffff">KELIAA</div>
              <div style="margin-top:6px;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:0.08em;text-transform:uppercase">Rencontres chrétiennes</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px">
              <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#1F4B3A">${opts.title}</h1>
              <div style="font-size:15px;line-height:1.65;color:#333333">${opts.bodyHtml}</div>
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px">
              <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6B7280;border-top:1px solid #E5E7EB;padding-top:16px">
                L’équipe Keliaa · Discernement, respect, projet de mariage<br/>
                Cet email concerne votre compte sur la plateforme KELIAA.<br/>
                © ${year} KELIAA
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function welcomeEmailHtml(input: {
  firstName: string
  appUrl: string
}) {
  const name = input.firstName.trim() || "ami(e)"
  return brandedEmailShell({
    title: `Bienvenue, ${name}`,
    preheader: "Votre espace Keliaa vous attend — connectez-vous pour continuer.",
    bodyHtml: `
      <p>Merci d’avoir rejoint <strong>Keliaa</strong>.</p>
      <p>Ici, des célibataires chrétiens sérieux s’engagent vers le mariage, dans un cadre éthique fondé sur la foi, les valeurs et le respect.</p>
      <p><strong>Pour accéder à votre espace :</strong> utilisez le bouton ci-dessous, puis connectez-vous avec <em>le même email et le mot de passe</em> choisis à l’inscription.</p>
      <p>Si la connexion affiche « incorrect », cliquez sur <strong>Mot de passe oublié</strong> — un lien KELIAA vous permettra d’en choisir un nouveau.</p>
    `,
    ctaLabel: "Me connecter à mon espace",
    ctaHref: `${input.appUrl}/login?welcome=1`,
  })
}

export function contactAckEmailHtml(input: { name: string }) {
  return brandedEmailShell({
    title: "Nous avons bien reçu votre message",
    preheader: "L’équipe Keliaa vous répondra avec soin.",
    bodyHtml: `
      <p>Bonjour ${input.name},</p>
      <p>Votre message est arrivé. Un membre de l’équipe Keliaa vous répondra dans les meilleurs délais, avec bienveillance et confidentialité.</p>
      <p>En attendant, vous pouvez déjà avancer sur votre profil et vos questionnaires.</p>
    `,
  })
}

export function subscriptionReminderEmailHtml(input: {
  firstName: string
  appUrl: string
  endsAtLabel: string
}) {
  const name = input.firstName.trim() || "ami(e)"
  return brandedEmailShell({
    title: "Votre Alliance arrive à échéance",
    preheader: `Renouvellement possible avant le ${input.endsAtLabel}.`,
    bodyHtml: `
      <p>Bonjour ${name},</p>
      <p>Votre abonnement <strong>Alliance</strong> se termine le <strong>${input.endsAtLabel}</strong>.</p>
      <p>Pour continuer à profiter du Matching KELIAA™ et de vos quotas renforcés, renouvelez simplement depuis votre espace billing.</p>
    `,
    ctaLabel: "Gérer mon Alliance",
    ctaHref: `${input.appUrl}/billing`,
  })
}

export function abandonedPaymentEmailHtml(input: {
  firstName: string
  appUrl: string
  amountLabel: string
}) {
  const name = input.firstName.trim() || "ami(e)"
  return brandedEmailShell({
    title: "Paiement Alliance non terminé",
    preheader: "Reprenez votre paiement quand vous êtes prêt(e).",
    bodyHtml: `
      <p>Bonjour ${name},</p>
      <p>Vous avez commencé un paiement <strong>Alliance</strong> (${input.amountLabel}) sans le finaliser.</p>
      <p>Aucun problème — vous pouvez reprendre en un clic dès que vous êtes prêt(e). Votre rapport personnalisé, le Matching enrichi et le Coffre Premium vous attendent.</p>
    `,
    ctaLabel: "Finaliser mon Alliance",
    ctaHref: `${input.appUrl}/premium`,
  })
}

export function allianceActivatedEmailHtml(input: {
  firstName: string
  appUrl: string
  endsAtLabel: string
}) {
  const name = input.firstName.trim() || "ami(e)"
  return brandedEmailShell({
    title: "Votre Alliance est active",
    preheader: `Paiement confirmé — Alliance active jusqu’au ${input.endsAtLabel}.`,
    bodyHtml: `
      <p>Bonjour ${name},</p>
      <p>Votre paiement Mobile Money a bien été reçu. Votre abonnement <strong>Alliance</strong> est maintenant <strong>actif</strong>.</p>
      <p>Valable jusqu’au <strong>${input.endsAtLabel}</strong> — Matching KELIAA™ et quotas renforcés sont débloqués.</p>
      <p>Que ce nouveau chapitre serve votre discernement et votre projet de mariage.</p>
    `,
    ctaLabel: "Ouvrir mon espace",
    ctaHref: `${input.appUrl}/dashboard`,
  })
}

export function passwordResetEmailHtml(input: {
  appUrl: string
  resetHref: string
}) {
  return brandedEmailShell({
    title: "Réinitialisez votre mot de passe",
    preheader: "Lien sécurisé KELIAA pour créer un nouveau mot de passe.",
    bodyHtml: `
      <p>Vous avez demandé à réinitialiser le mot de passe de votre compte <strong>Keliaa</strong>.</p>
      <p>Cliquez sur le bouton ci-dessous. Vous pourrez alors choisir un nouveau mot de passe et accéder à votre espace membre.</p>
      <p style="font-size:13px;color:#6B7280">Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
    `,
    ctaLabel: "Choisir un nouveau mot de passe",
    ctaHref: input.resetHref,
  })
}

/** Instructions collables dans Supabase → Auth → Email Templates (Confirm signup). */
export function supabaseConfirmSignupTemplateHint(appUrl: string) {
  return brandedEmailShell({
    title: "Confirmez votre adresse email",
    preheader: "Un clic pour activer votre espace Keliaa.",
    bodyHtml: `
      <p>Bonjour,</p>
      <p>Merci de vous être inscrit(e) sur <strong>Keliaa</strong>. Pour sécuriser votre compte et accéder à votre espace membre, confirmez votre adresse email :</p>
    `,
    ctaLabel: "Confirmer mon email",
    ctaHref: "{{ .ConfirmationURL }}",
  }).replaceAll(appUrl, "{{ .SiteURL }}")
}
