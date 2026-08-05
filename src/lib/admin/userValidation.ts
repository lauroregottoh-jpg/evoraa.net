export type OpsUserValidationRow = {
  id: string
  userId: string
  name: string
  city: string
  country: string
  gender: string
  age: number | null
  denomination: string
  church: string
  pastorName: string
  completion: number
  role: string
  status: string
  onboarding: string | null
  verified: boolean
  hasAvatar: boolean
  createdAt: string | null
  trustScore: number
  warningCount: number
  sanctionStatus: string
  hasBiography: boolean
  hasTestimony: boolean
  hasMaritalStatus: boolean
  missing: string[]
}

/** Champs requis pour valider l’accès (revue humaine). */
export function computeMissingProfileFields(input: {
  name: string
  city: string
  gender: string
  age: number | null
  denomination: string
  church: string
  hasAvatar: boolean
  hasBiography: boolean
  hasTestimony: boolean
  hasMaritalStatus: boolean
}): string[] {
  const missing: string[] = []
  if (!input.name || input.name === "Sans nom") missing.push("Nom")
  if (!input.city || input.city === "?") missing.push("Ville")
  if (!input.gender || input.gender === "?") missing.push("Genre")
  if (input.age == null) missing.push("Âge / date de naissance")
  if (!input.denomination) missing.push("Dénomination")
  if (!input.church) missing.push("Église")
  if (!input.hasAvatar) missing.push("Photo")
  if (!input.hasMaritalStatus) missing.push("Situation matrimoniale")
  if (!input.hasBiography && !input.hasTestimony) missing.push("Bio / témoignage")
  return missing
}

export const VALIDATION_MESSAGE_TEMPLATES: Array<{
  id: string
  label: string
  body: (missing: string[]) => string
}> = [
  {
    id: "complete_missing",
    label: "Compléter les infos manquantes",
    body: (missing) =>
      missing.length > 0
        ? `Bonjour,\n\nPour valider votre accès sur KELIAA, merci de compléter : ${missing.join(", ")}.\n\nUne fois fait, notre équipe pourra finaliser la revue de votre profil.\n\nL’équipe KELIAA`
        : `Bonjour,\n\nMerci de finaliser les derniers détails de votre profil pour accélérer la validation.\n\nL’équipe KELIAA`,
  },
  {
    id: "need_photo",
    label: "Photo de profil requise",
    body: () =>
      `Bonjour,\n\nPour valider votre profil, une photo claire de vous est indispensable (visage visible, photo récente).\n\nAjoutez-la depuis votre espace membre, puis répondez à ce message si besoin.\n\nL’équipe KELIAA`,
  },
  {
    id: "approved",
    label: "Profil validé — bienvenue",
    body: () =>
      `Bonjour,\n\nBonne nouvelle : votre profil a été validé. Vous pouvez maintenant profiter pleinement de KELIAA.\n\nBienvenue dans la communauté.\n\nL’équipe KELIAA`,
  },
  {
    id: "rejected_soft",
    label: "Profil à revoir",
    body: (missing) =>
      `Bonjour,\n\nVotre profil n’a pas encore pu être validé.${
        missing.length ? ` Points à corriger : ${missing.join(", ")}.` : ""
      }\n\nMettez à jour votre fiche puis contactez-nous si besoin.\n\nL’équipe KELIAA`,
  },
]
