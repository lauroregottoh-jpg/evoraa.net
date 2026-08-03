/** Catalogue partagé — motifs ops + signalements membres. */

export const PROFILE_REJECT_REASONS = [
  { id: "photo_inadaptee", label: "Photo non conforme (visage absent, floue, montage)" },
  { id: "profil_incomplet", label: "Profil trop incomplet pour validation" },
  { id: "identite_douteuse", label: "Doute sur l’identité / authenticité" },
  { id: "temoignage_insuffisant", label: "Témoignage trop court ou hors sujet" },
  { id: "age_criteria", label: "Âge / critères incompatibles avec la charte" },
  { id: "contenu_inapproprie", label: "Contenu contraire au respect / à la charte" },
  { id: "doublon", label: "Compte doublon suspect" },
  { id: "autre", label: "Autre motif (préciser en message)" },
] as const

export const PHOTO_REJECT_REASONS = [
  { id: "visage_non_visible", label: "Visage non clairement visible" },
  { id: "groupe", label: "Plusieurs personnes / selfie de groupe" },
  { id: "filtre_excessif", label: "Filtre ou retouche excessive" },
  { id: "tenue", label: "Tenue non adaptée à la charte" },
  { id: "qualite", label: "Qualité insuffisante (flou, trop sombre)" },
  { id: "texte_superpose", label: "Texte / watermark / sticker" },
  { id: "contenu_inapproprie", label: "Contenu inapproprié" },
  { id: "autre", label: "Autre motif" },
] as const

export const MEMBER_REPORT_REASONS = [
  {
    id: "propos_deplaces",
    label: "Propos déplacés, impatients ou contraires au respect",
  },
  {
    id: "authenticite_suspecte",
    label: "Doute sur la véracité du profil ou des photos",
  },
  {
    id: "sollicitation_commerciale",
    label: "Sollicitation commerciale ou demande financière",
  },
  {
    id: "pression_externe",
    label: "Pression pour quitter la plateforme (WhatsApp, etc.)",
  },
  {
    id: "harcelement",
    label: "Harcèlement, insistance ou messages répétés non désirés",
  },
  {
    id: "contenu_sexuel",
    label: "Contenu à caractère sexuel ou suggestive",
  },
  {
    id: "menaces",
    label: "Menaces, intimidation ou violence verbale",
  },
  {
    id: "usurpation",
    label: "Usurpation d’identité / faux profil",
  },
  {
    id: "spam",
    label: "Spam, liens suspects ou pub non sollicitée",
  },
  {
    id: "autre",
    label: "Autre motif (préciser)",
  },
] as const

export const SANCTION_PRESETS = [
  { id: "warn", label: "Avertissement 1", level: 1 as const },
  { id: "warn2", label: "Avertissement 2", level: 2 as const },
  { id: "suspend", label: "Suspension temporaire", level: 3 as const },
  { id: "block", label: "Blocage du compte", level: 4 as const },
] as const

export type AdSlotId = "dashboard" | "discover" | "messages" | "global"

export const AD_PLACEMENTS: Array<{
  id: AdSlotId
  label: string
  where: string
  format: string
  live: boolean
}> = [
  {
    id: "dashboard",
    label: "Accueil membre",
    where: "Dashboard — entre la sélection et les cartes quotidiens",
    format: "Bannière texte (± image) · largeur max ~680px · ratio conseillé 16:9",
    live: true,
  },
  {
    id: "discover",
    label: "Découvrir (matching)",
    where: "Page /compatibility — au-dessus de la grille de suggestions",
    format: "Carte compacte · 1 ligne titre + CTA",
    live: true,
  },
  {
    id: "messages",
    label: "Messages",
    where: "Page /messages — en tête de la liste de conversations",
    format: "Bandeau horizontal discret · pas d’image obligatoire",
    live: true,
  },
  {
    id: "global",
    label: "Global ( Accueil + fallback )",
    where: "Affiché aussi sur l’accueil membre avec dashboard",
    format: "Même format que Accueil",
    live: true,
  },
]

export function labelForReason(
  catalog: ReadonlyArray<{ id: string; label: string }>,
  id: string
) {
  return catalog.find((r) => r.id === id)?.label || id
}
