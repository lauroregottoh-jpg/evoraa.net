/** Growth helpers — invite links & attribution (no extra DB required for capture). */

export function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "https://evoraa-net.vercel.app")
  )
}

/** Short invite code from user id (stable, shareable). */
export function inviteCodeFromUserId(userId: string) {
  return userId.replace(/-/g, "").slice(0, 8)
}

export function buildInviteUrl(code: string, extras?: Record<string, string>) {
  const url = new URL("/register", appBaseUrl())
  url.searchParams.set("ref", code)
  url.searchParams.set("utm_source", extras?.utm_source || "invite")
  url.searchParams.set("utm_medium", extras?.utm_medium || "share")
  url.searchParams.set("utm_campaign", extras?.utm_campaign || "member_referral")
  return url.toString()
}

export function buildPublicShareUrl(path = "/", utm?: Record<string, string>) {
  const url = new URL(path, appBaseUrl())
  url.searchParams.set("utm_source", utm?.utm_source || "share")
  url.searchParams.set("utm_medium", utm?.utm_medium || "social")
  url.searchParams.set("utm_campaign", utm?.utm_campaign || "recommend")
  return url.toString()
}

export const INVITE_MESSAGE =
  "Je te recommande KELLIA — rencontres chrétiennes fondées sur le discernement, pas sur le swipe. Rejoins-nous : "
