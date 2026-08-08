/**
 * Profils opérateurs / tests à masquer de la Communauté publique.
 *
 * Comptes confirmés à masquer :
 * - Sarah Gande
 * - Laurore / Laura Atintoh
 * - Albertine Atintoh
 * - Admin / seed internes
 */
const HIDDEN_EXACT_FIRST = new Set([
  "laura",
  "laure",
  "laurore",
  "albertine",
  "admin",
  "suspect",
])

const HIDDEN_EXACT_LAST = new Set([
  "gande",
  "gandy",
  "dandee",
  "atintoh",
  "regottoh",
  "evoraa",
  "spam",
])

/** Sarah uniquement avec ces noms de famille (comptes test). */
const SARAH_HIDDEN_LAST = ["gande", "gandy", "dandee"]

export function isHiddenOperatorProfile(
  firstName?: string | null,
  lastName?: string | null
): boolean {
  const f = (firstName || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
  const l = (lastName || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  if (!f && !l) return false

  if (HIDDEN_EXACT_FIRST.has(f)) return true
  if (l && HIDDEN_EXACT_LAST.has(l)) return true

  // L'aura / Laura / Laurore variants
  if (f.includes("aura") && f.length <= 10) return true
  if (f.includes("laurore") || f.includes("albertine")) return true

  // Sarah Gande / Dandee
  if (f === "sarah" && SARAH_HIDDEN_LAST.some((x) => l.startsWith(x))) return true

  // Laurore/Laura/Albertine Atintoh (si prénom partiel)
  if (l === "atintoh") return true

  return false
}
