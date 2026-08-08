/**
 * Profils internes / tests à masquer de la Communauté publique.
 */
const HIDDEN_EXACT_FIRST = new Set([
  "laura",
  "laure",
  "albertine",
  "admin",
  "suspect",
])

/** Sarah uniquement avec ces noms de famille (comptes test). */
const SARAH_HIDDEN_LAST = ["gande", "gandy", "dandee"]

const HIDDEN_LAST = new Set(["regottoh", "evoraa", "spam", ...SARAH_HIDDEN_LAST])

export function isHiddenOperatorProfile(
  firstName?: string | null,
  lastName?: string | null
): boolean {
  const f = (firstName || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
  const l = (lastName || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")

  if (!f && !l) return false
  if (HIDDEN_EXACT_FIRST.has(f)) return true
  // L'aura / Laura variants
  if (f.includes("aura") && f.length <= 8) return true
  if (f.includes("albertine")) return true
  if (l && HIDDEN_LAST.has(l)) {
    // last name alone enough for operator surnames
    if (l === "regottoh" || l === "evoraa" || l === "spam") return true
  }
  // Sarah Gande / Dandee only
  if (f === "sarah" && SARAH_HIDDEN_LAST.some((x) => l.startsWith(x))) return true
  return false
}
