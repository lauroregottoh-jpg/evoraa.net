import {
  classifyProfileType,
  DIMENSION_LABELS,
  parsePillars,
} from "@/lib/admin/matchingIntelligence"

export type OpsUserValidationRow = {
  id: string
  userId: string
  name: string
  firstName: string
  lastName: string
  email: string | null
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
  pillarsCompleted: number
  pillars: Partial<
    Record<
      "personality" | "spiritual" | "relationship" | "couple_life" | "finances",
      number | null
    >
  >
  profileType: string
  weakDimensions: string[]
  spiritualPractice: string | null
  communicationStyle: string | null
}

export type OpsUserExportColumnId =
  | "name"
  | "firstName"
  | "lastName"
  | "email"
  | "city"
  | "country"
  | "gender"
  | "age"
  | "denomination"
  | "church"
  | "pastorName"
  | "completion"
  | "status"
  | "onboarding"
  | "verified"
  | "hasAvatar"
  | "missing"
  | "createdAt"
  | "trustScore"
  | "pillarsCompleted"
  | "profileType"

export const OPS_USER_EXPORT_COLUMNS: Array<{
  id: OpsUserExportColumnId
  label: string
}> = [
  { id: "name", label: "Nom complet" },
  { id: "firstName", label: "Prénom" },
  { id: "lastName", label: "Nom" },
  { id: "email", label: "E-mail" },
  { id: "city", label: "Ville" },
  { id: "country", label: "Pays" },
  { id: "gender", label: "Genre" },
  { id: "age", label: "Âge" },
  { id: "denomination", label: "Dénomination" },
  { id: "church", label: "Église" },
  { id: "pastorName", label: "Pasteur" },
  { id: "completion", label: "% profil" },
  { id: "pillarsCompleted", label: "Tests (/5)" },
  { id: "profileType", label: "Typologie match" },
  { id: "status", label: "Statut modération" },
  { id: "onboarding", label: "Onboarding" },
  { id: "verified", label: "Vérifié" },
  { id: "hasAvatar", label: "Photo" },
  { id: "missing", label: "Champs manquants" },
  { id: "createdAt", label: "Inscrit le" },
  { id: "trustScore", label: "Confiance" },
]

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

export function mapProfileToOpsUser(p: Record<string, unknown>): OpsUserValidationRow {
  let age: number | null = null
  if (p.birth_date) {
    const y = new Date(p.birth_date as string).getFullYear()
    if (Number.isFinite(y)) age = new Date().getFullYear() - y
  }
  const firstName = (p.first_name as string) || ""
  const lastName = (p.last_name as string) || ""
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Sans nom"
  const city = (p.city as string) || "?"
  const gender = (p.gender as string) || "?"
  const denomination = (p.denomination as string) || ""
  const church = (p.church_attended as string) || ""
  const hasAvatar = Boolean(p.avatar_url)
  const hasBiography = Boolean(
    typeof p.biography === "string" && (p.biography as string).trim()
  )
  const hasTestimony = Boolean(
    typeof p.testimony === "string" && (p.testimony as string).trim()
  )
  const hasMaritalStatus = Boolean(p.marital_status)
  const missing = computeMissingProfileFields({
    name,
    city,
    gender,
    age,
    denomination,
    church,
    hasAvatar,
    hasBiography,
    hasTestimony,
    hasMaritalStatus,
  })

  const { pillars, dimensions, completed } = parsePillars(p.psychometric_results)
  const weakDimensions = Object.entries(dimensions)
    .filter(([, v]) => typeof v === "number" && v < 60)
    .sort((a, b) => (a[1] as number) - (b[1] as number))
    .slice(0, 3)
    .map(([k]) => DIMENSION_LABELS[k] || k)

  const ind =
    p.matching_indicators &&
    typeof p.matching_indicators === "object" &&
    !Array.isArray(p.matching_indicators)
      ? (p.matching_indicators as Record<string, unknown>)
      : null

  return {
    id: p.id as string,
    userId: p.user_id as string,
    name,
    firstName,
    lastName,
    email: null,
    city,
    country: (p.country as string) || "?",
    gender,
    age,
    denomination,
    church,
    pastorName: (p.pastor_name as string) || "",
    completion: Number(p.completion_percentage ?? 0),
    role: (p.role as string) || "member",
    status: (p.moderation_status as string) || "pending",
    onboarding: (p.onboarding_status as string) || null,
    verified: Boolean(p.is_verified || p.identity_verified),
    hasAvatar,
    createdAt: (p.created_at as string) || null,
    trustScore: Number(p.trust_score ?? 50),
    warningCount: Number(p.warning_count ?? 0),
    sanctionStatus: (p.sanction_status as string) || "none",
    hasBiography,
    hasTestimony,
    hasMaritalStatus,
    missing,
    pillarsCompleted: completed,
    pillars,
    profileType: classifyProfileType(pillars, completed),
    weakDimensions,
    spiritualPractice:
      typeof ind?.spiritual_practice === "string"
        ? ind.spiritual_practice
        : null,
    communicationStyle:
      typeof ind?.communication_style === "string"
        ? ind.communication_style
        : null,
  }
}

export const PROFILE_SELECT_FOR_OPS =
  "id, user_id, first_name, last_name, city, country, gender, birth_date, denomination, church_attended, pastor_name, pastor_contact, completion_percentage, role, moderation_status, onboarding_status, is_verified, identity_verified, created_at, avatar_url, trust_score, warning_count, sanction_status, sanction_until, biography, testimony, marital_status, psychometric_results, matching_indicators"

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
    id: "need_tests",
    label: "Rappel questionnaires",
    body: () =>
      `Bonjour,\n\nPour activer le matching, merci de compléter les 5 questionnaires (personnalité, foi, communication, foyer, finances) dans votre espace membre.\n\nL’équipe KELIAA`,
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

export function csvEscape(value: string | number | boolean | null | undefined): string {
  const s = value == null ? "" : String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function buildUsersCsv(
  rows: OpsUserValidationRow[],
  columns: OpsUserExportColumnId[]
): string {
  const header = columns
    .map(
      (id) =>
        OPS_USER_EXPORT_COLUMNS.find((c) => c.id === id)?.label || id
    )
    .join(",")
  const body = rows
    .map((u) =>
      columns
        .map((id) => {
          switch (id) {
            case "missing":
              return csvEscape(u.missing.join("; "))
            case "verified":
            case "hasAvatar":
              return csvEscape(u[id] ? "oui" : "non")
            case "email":
              return csvEscape(u.email || "")
            case "pillarsCompleted":
              return csvEscape(`${u.pillarsCompleted}/5`)
            default:
              return csvEscape(
                (u[id] as string | number | null | undefined) ?? ""
              )
          }
        })
        .join(",")
    )
    .join("\n")
  return `${header}\n${body}`
}
