/**
 * Invariants auth gelés — échouent si quelqu’un casse Google / email / PKCE
 * sans mettre à jour le contrat (docs/AUTH_FROZEN.md + AUTH UNLOCK).
 */
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function read(rel) {
  const p = join(root, rel)
  assert.ok(existsSync(p), `fichier manquant (zone auth) : ${rel}`)
  return readFileSync(p, "utf8")
}

describe("AUTH FROZEN — inscription / Google / PKCE", () => {
  it("document de contrat présent", () => {
    const doc = read("docs/AUTH_FROZEN.md")
    assert.match(doc, /AUTH UNLOCK/)
    assert.match(doc, /www\.keliaa\.org/)
    assert.match(doc, /\.keliaa\.org/)
  })

  it("AUTH_CRITICAL.frozen + fail-open + callback path", () => {
    const src = read("src/lib/auth/criticalPath.ts")
    assert.match(src, /rateLimitFailOpen:\s*true/)
    assert.match(src, /frozen:\s*true/)
    assert.match(src, /oauthCallbackPath:\s*"\/auth\/callback"/)
    assert.match(src, /cookieDomain:\s*"\.keliaa\.org"/)
    assert.match(src, /canonicalHost:\s*"www\.keliaa\.org"/)
    assert.match(src, /cookieSecureInProd:\s*true/)
    assert.match(src, /softConfirmProdDefaultOff:\s*true/)
  })

  it("client browser cookies .keliaa.org + secure HTTPS", () => {
    const src = read("src/utils/supabase/client.ts")
    assert.match(src, /\.keliaa\.org/)
    assert.match(src, /cookieOptions/)
    assert.match(src, /secure/)
  })

  it("lot C : hibp + lockout + turnstile présents", () => {
    assert.ok(existsSync(join(root, "src/lib/auth/hibp.ts")))
    assert.ok(existsSync(join(root, "src/lib/auth/lockout.ts")))
    assert.ok(existsSync(join(root, "src/lib/auth/turnstile.ts")))
    const auth = read("src/app/actions/auth.ts")
    assert.match(auth, /assertPasswordNotPwned|hibp/)
    assert.match(auth, /isLoginLockedOut|recordLoginFailure/)
    assert.match(auth, /registrationsPaused|getKillSwitches/)
  })

  it("rate-limit login/register fail-open", () => {
    const src = read("src/lib/security/rateLimit.ts")
    const rlStart = src.indexOf("export const RL")
    assert.ok(rlStart >= 0, "export const RL manquant")
    const rl = src.slice(rlStart, rlStart + 800)
    assert.match(rl, /login:\s*\{[\s\S]*?failClosed:\s*false/)
    assert.match(rl, /register:\s*\{[\s\S]*?failClosed:\s*false/)
  })

  it("middleware : apex→www + skip PKCE sur /auth/callback", () => {
    const src = read("src/utils/supabase/middleware.ts")
    assert.match(src, /keliaa\.org/)
    assert.match(src, /www\.keliaa\.org/)
    assert.match(src, /\/auth\/callback/)
    assert.match(src, /308/)
  })

  it("Google OAuth → /auth/callback", () => {
    const src = read("src/lib/auth/oauthGoogle.ts")
    assert.match(src, /startGoogleOAuth/)
    assert.match(src, /\/auth\/callback/)
    assert.match(src, /www\.keliaa\.org/)
    assert.doesNotMatch(
      src,
      /redirectTo\s*=\s*`\$\{origin\}\/auth\/finish/
    )
  })

  it("handoff layout code → /auth/callback", () => {
    const src = read("src/app/layout.tsx")
    assert.match(src, /\/auth\/callback/)
  })

  it("callback route échange le code + cookies domaine", () => {
    const src = read("src/app/auth/callback/route.ts")
    assert.match(src, /exchangeCodeForSession/)
    assert.match(src, /\.keliaa\.org/)
    assert.match(src, /www\.keliaa\.org/)
  })

  it("actions login + register exportées", () => {
    const src = read("src/app/actions/auth.ts")
    assert.match(src, /export async function loginAction/)
    assert.match(src, /export async function registerAction/)
    assert.match(src, /isNextRedirectError/)
  })

  it("pages register / login existent", () => {
    const candidates = [
      "src/app/register/page.tsx",
      "src/app/(public)/register/page.tsx",
      "src/app/(auth)/register/page.tsx",
    ]
    const loginCandidates = [
      "src/app/login/page.tsx",
      "src/app/(public)/login/page.tsx",
      "src/app/(auth)/login/page.tsx",
    ]
    assert.ok(
      candidates.some((p) => existsSync(join(root, p))),
      "page /register introuvable"
    )
    assert.ok(
      loginCandidates.some((p) => existsSync(join(root, p))),
      "page /login introuvable"
    )
  })

  it("règle Cursor auth-critical présente", () => {
    const rule = read(".cursor/rules/auth-critical.mdc")
    assert.match(rule, /ZONE AUTH GELÉE/)
    assert.match(rule, /AUTH UNLOCK/)
  })
})
