/**
 * LiveKit Cloud — salles audio coaching (plan Build gratuit, sans CB).
 * Env : LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
 */

import { AccessToken } from "livekit-server-sdk"

export function livekitRoomNameForSession(sessionId: string): string {
  const compact = sessionId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  return `keliaa-${compact.slice(0, 40) || "session"}`
}

export async function issueLiveKitJoinCredentials(input: {
  sessionId: string
  userId: string
  displayName: string
  role: "client" | "coach"
}): Promise<{ url?: string; token?: string; roomName?: string; error?: string }> {
  const url = process.env.LIVEKIT_URL?.trim()
  const apiKey = process.env.LIVEKIT_API_KEY?.trim()
  const apiSecret = process.env.LIVEKIT_API_SECRET?.trim()

  if (!url || !apiKey || !apiSecret) {
    return {
      error:
        "Salle audio non configurée. Ajoutez LIVEKIT_URL, LIVEKIT_API_KEY et LIVEKIT_API_SECRET dans Vercel (compte gratuit cloud.livekit.io, sans carte).",
    }
  }

  const roomName = livekitRoomNameForSession(input.sessionId)
  const identity = `${input.role}-${input.userId}`.slice(0, 64)

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: input.displayName,
      ttl: "3h",
    })
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })
    const token = await at.toJwt()
    return { url, token, roomName }
  } catch (e) {
    console.error("LiveKit token error", e)
    return {
      error: "Impossible de créer l’accès à la salle audio. Réessayez.",
    }
  }
}
