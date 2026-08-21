/**
 * Provider salle coaching — Jitsi embarqué (V1).
 * Room name opaque = keliaa-{sessionId} (UUID). JWT 8x8 optionnel via env.
 */

export type SessionMediaMode = "audio" | "audio_video"

export type JitsiRoomConfig = {
  domain: string
  roomName: string
  /** Script External API */
  externalApiUrl: string
}

/** Domaine Jitsi public (gratuit). Surcharge : NEXT_PUBLIC_JITSI_DOMAIN */
export function getJitsiDomain(): string {
  return (
    process.env.NEXT_PUBLIC_JITSI_DOMAIN?.trim() ||
    process.env.JITSI_DOMAIN?.trim() ||
    "meet.jit.si"
  )
}

export function jitsiRoomNameForSession(sessionId: string): string {
  const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64)
  return `keliaa-${safe || "session"}`
}

export function buildJitsiRoomConfig(sessionId: string): JitsiRoomConfig {
  const domain = getJitsiDomain()
  return {
    domain,
    roomName: jitsiRoomNameForSession(sessionId),
    externalApiUrl: `https://${domain}/external_api.js`,
  }
}

/** @deprecated WebRTC maison — conservé pour typage legacy, non utilisé en live. */
export type JoinToken = {
  sessionId: string
  role: "client" | "coach"
  expiresAt: number
  iceServers: RTCIceServer[]
}

/** @deprecated */
export interface VideoSessionProvider {
  createRoom(sessionId: string): Promise<void>
  issueJoinToken(args: {
    sessionId: string
    userId: string
    role: "client" | "coach"
  }): Promise<JoinToken>
}

function iceServersFromEnv(): RTCIceServer[] {
  const stun = process.env.NEXT_PUBLIC_WEBRTC_STUN_URLS?.split(",").filter(Boolean)
  const turnUrls = process.env.WEBRTC_TURN_URLS?.split(",").filter(Boolean)
  const turnUser = process.env.WEBRTC_TURN_USERNAME
  const turnPass = process.env.WEBRTC_TURN_CREDENTIAL
  const servers: RTCIceServer[] = []
  for (const url of stun?.length ? stun : ["stun:stun.l.google.com:19302"]) {
    servers.push({ urls: url })
  }
  if (turnUrls?.length && turnUser && turnPass) {
    servers.push({
      urls: turnUrls,
      username: turnUser,
      credential: turnPass,
    })
  }
  return servers
}

/** @deprecated Provider WebRTC — ne plus brancher sur le live coaching. */
export const nativeWebRtcProvider: VideoSessionProvider = {
  async createRoom() {
    /* unused */
  },
  async issueJoinToken({ sessionId, role }) {
    const ttlMs = 15 * 60 * 1000
    return {
      sessionId,
      role,
      expiresAt: Date.now() + ttlMs,
      iceServers: iceServersFromEnv(),
    }
  },
}

export function getVideoSessionProvider(): VideoSessionProvider {
  return nativeWebRtcProvider
}

export const SESSION_TIMING = {
  prepSeconds: 5 * 60,
  displayedMinutes: 30,
  allocatedSeconds: 40 * 60,
} as const

export function waitingCopy(role: "client" | "coach"): string {
  return role === "client"
    ? "Nous sommes en attente de votre coach…"
    : "Nous sommes en attente du membre…"
}

export function peerConnectedCopy(role: "client" | "coach"): string {
  return role === "client"
    ? "Votre coach est connecté — ouverture de la salle…"
    : "Le membre est connecté — ouverture de la salle…"
}
