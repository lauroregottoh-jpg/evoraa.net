import { createHash, randomBytes } from "crypto"

/** Identifiant public couple — sans PII. */
export function generateCouplePublicCode(): string {
  const part = randomBytes(3).toString("hex").toUpperCase()
  return `KLY-CPL-${part}`
}

/** Code d’invitation court (usage unique). */
export function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = "KLY-"
  const bytes = randomBytes(5)
  for (let i = 0; i < 5; i++) {
    out += alphabet[bytes[i]! % alphabet.length]
  }
  return out
}

export function generateInviteToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
