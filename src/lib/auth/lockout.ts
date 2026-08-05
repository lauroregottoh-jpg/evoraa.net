/**
 * Lockout après échecs de login — buckets Supabase rate_limit (fail-open).
 * Seuil : 5 échecs / 15 min (par IP+email).
 */
import { createAdminClient } from "@/utils/supabase/admin"
import { enforceRateLimit } from "@/lib/security/rateLimit"

const WINDOW_SEC = 15 * 60
const THRESHOLD = 5

function bucketSuffix(email: string) {
  return email.trim().toLowerCase().slice(0, 200)
}

export async function isLoginLockedOut(
  email: string
): Promise<{ locked: boolean; retryAfterSeconds?: number }> {
  try {
    const admin = createAdminClient()
    const subject = bucketSuffix(email)
    const { data } = await admin
      .from("rate_limit_buckets")
      .select("bucket_key, hit_count, window_start")
      .like("bucket_key", `rl:login_fail:%:${subject}`)
      .limit(20)

    const now = Date.now()
    for (const row of data ?? []) {
      const start = new Date(row.window_start as string).getTime()
      if (now - start > WINDOW_SEC * 1000) continue
      if (Number(row.hit_count) >= THRESHOLD) {
        const retry = Math.max(
          1,
          Math.ceil((start + WINDOW_SEC * 1000 - now) / 1000)
        )
        return { locked: true, retryAfterSeconds: retry }
      }
    }
    return { locked: false }
  } catch {
    return { locked: false }
  }
}

export async function recordLoginFailure(email: string) {
  await enforceRateLimit({
    action: "login_fail",
    limit: THRESHOLD,
    windowSeconds: WINDOW_SEC,
    subject: email,
    failClosed: false,
  })
}

export async function clearLoginFailures(email: string) {
  try {
    const admin = createAdminClient()
    const subject = bucketSuffix(email)
    await admin
      .from("rate_limit_buckets")
      .delete()
      .like("bucket_key", `rl:login_fail:%:${subject}`)
  } catch {
    /* ignore */
  }
}
