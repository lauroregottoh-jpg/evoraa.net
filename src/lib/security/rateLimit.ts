import { headers } from "next/headers"
import { createAdminClient } from "@/utils/supabase/admin"

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; error: string; retryAfterSeconds: number }

async function clientIp(): Promise<string> {
  try {
    const h = await headers()
    const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim()
    const real = h.get("x-real-ip")?.trim()
    const ip = fwd || real || "unknown"
    return ip.slice(0, 64)
  } catch {
    return "unknown"
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 200)
}

/**
 * Fixed-window rate limit via Supabase (service_role).
 * Fails closed on infra errors for sensitive actions when `failClosed` is true.
 */
export async function enforceRateLimit(input: {
  action: string
  limit: number
  windowSeconds: number
  /** Extra identity (email, userId…) */
  subject?: string
  failClosed?: boolean
}): Promise<RateLimitResult> {
  const ip = await clientIp()
  const subject = input.subject ? normalizeEmail(input.subject) : ""
  const bucket = `rl:${input.action}:${ip}:${subject || "-"}`.slice(0, 240)

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc("consume_rate_limit" as never, {
      p_key: bucket,
      p_max: input.limit,
      p_window_seconds: input.windowSeconds,
    } as never)

    if (error) {
      console.error("[rate-limit]", error.message)
      if (input.failClosed) {
        return {
          ok: false,
          error: "Service temporairement indisponible. Réessayez dans une minute.",
          retryAfterSeconds: 60,
        }
      }
      return { ok: true, remaining: input.limit }
    }

    const row = Array.isArray(data) ? data[0] : data
    const allowed = Boolean(row?.allowed)
    const remaining = Number(row?.remaining ?? 0)
    const retryAfterSeconds = Number(row?.retry_after_seconds ?? 60)

    if (!allowed) {
      const mins = Math.ceil(retryAfterSeconds / 60)
      return {
        ok: false,
        error: `Trop de tentatives. Réessayez dans ${mins} min.`,
        retryAfterSeconds,
      }
    }

    return { ok: true, remaining }
  } catch (e) {
    console.error("[rate-limit]", e)
    if (input.failClosed) {
      return {
        ok: false,
        error: "Service temporairement indisponible. Réessayez dans une minute.",
        retryAfterSeconds: 60,
      }
    }
    return { ok: true, remaining: input.limit }
  }
}

/** Presets Keliaa */
export const RL = {
  login: { action: "login", limit: 10, windowSeconds: 15 * 60, failClosed: true },
  register: { action: "register", limit: 5, windowSeconds: 60 * 60, failClosed: true },
  passwordReset: {
    action: "password_reset",
    limit: 5,
    windowSeconds: 60 * 60,
    failClosed: true,
  },
  contact: { action: "contact", limit: 5, windowSeconds: 60 * 60, failClosed: true },
  eva: { action: "eva", limit: 40, windowSeconds: 60 * 60, failClosed: false },
} as const
