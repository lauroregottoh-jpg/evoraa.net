/**
 * Templates messagerie ops → membres (privé / général / rappel).
 * Source de secours si la table SQL n’est pas encore migrée.
 */

export type AdminMessageScope = "private" | "broadcast" | "reminder"

export type AdminMessageTemplate = {
  id: string
  label: string
  scope: AdminMessageScope
  title: string
  body: string
}

export const BUILTIN_ADMIN_MESSAGE_TEMPLATES: AdminMessageTemplate[] = [
  {
    id: "welcome_private",
    label: "Bienvenue personnalisé",
    scope: "private",
    title: "Bienvenue sur KELIAA",
    body: "Bonjour {{prenom}},\n\nNous sommes heureux de vous accueillir. Complétez votre profil et les questionnaires pour activer le Matching.\n\nL’équipe KELIAA",
  },
  {
    id: "complete_profile",
    label: "Compléter le profil",
    scope: "private",
    title: "Finalisez votre profil",
    body: "Bonjour {{prenom}},\n\nPour avancer sur KELIAA, merci de finaliser votre profil (photo, infos essentielles, questionnaires).\n\nL’équipe KELIAA",
  },
  {
    id: "need_photo",
    label: "Photo requise",
    scope: "private",
    title: "Ajoutez votre photo",
    body: "Bonjour {{prenom}},\n\nUne photo claire de vous est indispensable pour valider votre profil et apparaître auprès des membres.\n\nL’équipe KELIAA",
  },
  {
    id: "need_tests",
    label: "Rappel questionnaires",
    scope: "reminder",
    title: "Vos questionnaires vous attendent",
    body: "Bonjour {{prenom}},\n\nLes 5 questionnaires de compatibilité sont la clé du Matching KELIAA™. Prenez quelques minutes pour les compléter.\n\nL’équipe KELIAA",
  },
  {
    id: "alliance_invite",
    label: "Invitation Alliance",
    scope: "reminder",
    title: "Passez Alliance pour aller plus loin",
    body: "Bonjour {{prenom}},\n\nAvec Alliance : Rapport Personnalisé, Coffre Premium, Matching enrichi et Programme Fidélité.\n\nDécouvrez l’offre sur /premium.\n\nL’équipe KELIAA",
  },
  {
    id: "renewal_reminder",
    label: "Rappel renouvellement",
    scope: "reminder",
    title: "Votre Alliance arrive à échéance",
    body: "Bonjour {{prenom}},\n\nVotre abonnement Alliance arrive bientôt à échéance. Renouvelez pour conserver vos avantages et votre progression fidélité.\n\nL’équipe KELIAA",
  },
  {
    id: "broadcast_community",
    label: "Annonce Communauté",
    scope: "broadcast",
    title: "Nouveauté : Communauté KELIAA",
    body: "Bonjour {{prenom}},\n\nLa Communauté KELIAA est ouverte : découvrez les membres, likez avec intention. Un like mutuel débloque la conversation.\n\nL’équipe KELIAA",
  },
  {
    id: "broadcast_general",
    label: "Message général",
    scope: "broadcast",
    title: "Message de l’équipe KELIAA",
    body: "Bonjour {{prenom}},\n\n{{message}}\n\nL’équipe KELIAA",
  },
  {
    id: "approved",
    label: "Profil validé",
    scope: "private",
    title: "Votre profil est validé",
    body: "Bonjour {{prenom}},\n\nBonne nouvelle : votre profil a été validé. Bienvenue pleinement dans la communauté KELIAA.\n\nL’équipe KELIAA",
  },
]

export function fillAdminMessageTemplate(
  text: string,
  vars: { prenom?: string; message?: string }
): string {
  return text
    .replace(/\{\{\s*prenom\s*\}\}/gi, vars.prenom?.trim() || "cher membre")
    .replace(/\{\{\s*message\s*\}\}/gi, vars.message?.trim() || "")
}
