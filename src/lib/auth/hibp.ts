/**
 * HIBP k-anonymity — ne envoie que le préfixe SHA-1 (5 chars).
 * Fail-open si HIBP down (ne bloque pas l’inscription).
 * Désactiver : PASSWORD_HIBP_CHECK=false
 */
import { createHash } from "node:crypto"

const HIBP_BASE = "https://api.pwnedpasswords.com/range/"
const TIMEOUT_MS = 2500

function hibpEnabled() {
  const v = process.env.PASSWORD_HIBP_CHECK
  if (v === "false" || v === "0") return false
  return true // lot C : on by défaut
}

export async function pwnedCount(password: string): Promise<number> {
  if (!hibpEnabled()) return 0
  const sha1 = createHash("sha1").update(password, "utf8").digest("hex").toUpperCase()
  const prefix = sha1.slice(0, 5)
  const suffix = sha1.slice(5)

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(HIBP_BASE + prefix, {
      headers: {
        "User-Agent": "keliaa-auth/1",
        "Add-Padding": "true",
      },
      signal: ctrl.signal,
    })
    if (!res.ok) return 0
    const text = await res.text()
    for (const line of text.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const idx = trimmed.indexOf(":")
      if (idx === -1) continue
      if (trimmed.slice(0, idx) === suffix) {
        return Number.parseInt(trimmed.slice(idx + 1), 10) || 0
      }
    }
    return 0
  } catch {
    return 0
  } finally {
    clearTimeout(timer)
  }
}

export async function assertPasswordNotPwned(
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const count = await pwnedCount(password)
  if (count > 0) {
    return {
      ok: false,
      error:
        "Ce mot de passe apparaît dans des fuites connues. Choisissez-en un autre, plus unique.",
    }
  }
  return { ok: true }
}
