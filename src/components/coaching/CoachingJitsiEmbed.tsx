"use client"

import * as React from "react"

type JitsiApi = {
  executeCommand: (command: string, ...args: unknown[]) => void
  addListener: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener: (event: string, listener: (...args: unknown[]) => void) => void
  getNumberOfParticipants: () => number
  dispose: () => void
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (
      domain: string,
      options: Record<string, unknown>
    ) => JitsiApi
  }
}

const scriptPromises = new Map<string, Promise<void>>()

function loadExternalApi(scriptUrl: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (window.JitsiMeetExternalAPI) return Promise.resolve()
  const existing = scriptPromises.get(scriptUrl)
  if (existing) return existing

  const p = new Promise<void>((resolve, reject) => {
    const prev = document.querySelector<HTMLScriptElement>(
      `script[data-jitsi-api="${scriptUrl}"]`
    )
    if (prev) {
      prev.addEventListener("load", () => resolve())
      prev.addEventListener("error", () =>
        reject(new Error("Impossible de charger Jitsi."))
      )
      return
    }
    const script = document.createElement("script")
    script.src = scriptUrl
    script.async = true
    script.dataset.jitsiApi = scriptUrl
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Impossible de charger Jitsi."))
    document.body.appendChild(script)
  })
  scriptPromises.set(scriptUrl, p)
  return p
}

export type CoachingJitsiEmbedHandle = {
  hangup: () => void
}

/**
 * Embed Jitsi (audio-first) dans KELIAA.
 * Le micro est demandé par le domaine Jitsi, pas par notre WebRTC.
 */
export const CoachingJitsiEmbed = React.forwardRef<
  CoachingJitsiEmbedHandle,
  {
    domain: string
    roomName: string
    externalApiUrl: string
    displayName: string
    onJoined?: () => void
    /** Au moins 2 participants dans la salle Jitsi */
    onPeerPresent?: () => void
    onFatalError?: (message: string) => void
  }
>(function CoachingJitsiEmbed(
  {
    domain,
    roomName,
    externalApiUrl,
    displayName,
    onJoined,
    onPeerPresent,
    onFatalError,
  },
  ref
) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const apiRef = React.useRef<JitsiApi | null>(null)
  const peerNotifiedRef = React.useRef(false)

  React.useImperativeHandle(
    ref,
    () => ({
      hangup: () => {
        try {
          apiRef.current?.executeCommand("hangup")
        } catch {
          /* ignore */
        }
      },
    }),
    []
  )

  React.useEffect(() => {
    let cancelled = false
    peerNotifiedRef.current = false

    const notifyPeerIfReady = () => {
      if (peerNotifiedRef.current || !apiRef.current) return
      try {
        const n = apiRef.current.getNumberOfParticipants()
        // Jitsi compte souvent le local : >= 2 = soi + l'autre
        if (n >= 2) {
          peerNotifiedRef.current = true
          onPeerPresent?.()
        }
      } catch {
        /* ignore */
      }
    }

    void (async () => {
      try {
        await loadExternalApi(externalApiUrl)
        if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) {
          return
        }

        containerRef.current.innerHTML = ""
        const api = new window.JitsiMeetExternalAPI(domain, {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: { displayName },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: true,
            prejoinConfig: { enabled: false },
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            enableWelcomePage: false,
            disableInviteFunctions: true,
            requireDisplayName: false,
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "hangup",
              "settings",
              "tileview",
            ],
            SETTINGS_SECTIONS: ["devices", "language"],
            MOBILE_APP_PROMO: false,
          },
        })
        apiRef.current = api

        api.addListener("videoConferenceJoined", () => {
          onJoined?.()
          // Petit délai : le compteur de participants se met à jour après join
          window.setTimeout(notifyPeerIfReady, 400)
          window.setTimeout(notifyPeerIfReady, 1500)
        })
        api.addListener("participantJoined", () => {
          notifyPeerIfReady()
        })
        api.addListener("readyToClose", () => {
          /* parent gère hangup métier */
        })
      } catch (e) {
        if (!cancelled) {
          onFatalError?.(
            e instanceof Error ? e.message : "Erreur d’ouverture de la salle."
          )
        }
      }
    })()

    return () => {
      cancelled = true
      try {
        apiRef.current?.dispose()
      } catch {
        /* ignore */
      }
      apiRef.current = null
    }
  }, [
    domain,
    roomName,
    externalApiUrl,
    displayName,
    onJoined,
    onPeerPresent,
    onFatalError,
  ])

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[360px] w-full overflow-hidden rounded-xl bg-black sm:min-h-[480px]"
    />
  )
})
