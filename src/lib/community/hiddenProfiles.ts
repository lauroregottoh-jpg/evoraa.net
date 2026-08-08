/**
 * Profils opérateurs / tests à masquer des surfaces membres
 * (Communauté, Matching, Messages, Social).
 *
 * Comptes confirmés à masquer :
 * - Sarah Gande
 * - Laurore / Laura Atintoh
 * - Albertine Atintoh
 * - Admin / seed internes
 */

function normalizePart(value?: string | null): string {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

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

/** Sous-chaînes interdites dans prénom ou nom (typos / nom composé). */
const HIDDEN_NAME_FRAGMENTS = [
  "atintoh",
  "regottoh",
  "laurore",
  "albertine",
]

/** Sarah uniquement avec ces noms de famille (comptes test). */
const SARAH_HIDDEN_LAST = ["gande", "gandy", "dandee"]

export function isHiddenOperatorProfile(
  firstName?: string | null,
  lastName?: string | null
): boolean {
  const f = normalizePart(firstName)
  const l = normalizePart(lastName)
  const full = `${f} ${l}`.trim()

  if (!f && !l) return false

  // Atintoh / variantes — partout dans le nom affiché
  if (HIDDEN_NAME_FRAGMENTS.some((frag) => full.includes(frag))) return true

  if (HIDDEN_EXACT_FIRST.has(f)) return true
  if (l && HIDDEN_EXACT_LAST.has(l)) return true
  if (l && [...HIDDEN_EXACT_LAST].some((x) => l.includes(x))) return true

  // L'aura / Laura / Laurore variants
  if (f.includes("aura") && f.length <= 10) return true

  // Sarah Gande / Dandee
  if (f === "sarah" && SARAH_HIDDEN_LAST.some((x) => l.startsWith(x) || l.includes(x))) {
    return true
  }

  return false
}
