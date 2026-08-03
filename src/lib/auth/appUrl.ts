import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

/** URL publique stable pour liens email / redirects Auth. */
export async function resolveAppUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim()
  if (configured && !configured.includes("localhost")) {
    return configured
  }

  try {
    const h = await headers()
    const host = h.get("x-forwarded-host") || h.get("host")
    const proto = h.get("x-forwarded-proto") || "https"
    if (host && !host.includes("localhost")) {
      return `${proto}://${host}`.replace(/\/$/, "")
    }
  } catch {
    /* headers() indisponible hors requête */
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "")
  }

  return configured || "http://localhost:3000"
}

export function resolveAppUrlSync(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  )
}

export async function resolvePostAuthPath(
  userId: string
): Promise<"/onboarding" | "/dashboard"> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("completion_percentage, onboarding_status")
    .eq("user_id", userId)
    .maybeSingle()

  const completion = profile?.completion_percentage ?? 0
  const status = profile?.onboarding_status

  if (
    completion < 70 ||
    !status ||
    status === "step1_account" ||
    status === "step2_profile"
  ) {
    return "/onboarding"
  }

  return "/dashboard"
}
