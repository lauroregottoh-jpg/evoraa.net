"use client"

import * as React from "react"

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export type PwaInstallState = {
  canPrompt: boolean
  isIos: boolean
  isStandalone: boolean
  ready: boolean
  install: () => Promise<void>
}

const DISMISS_KEY = "keliaa_pwa_install_dismissed"

export function isPwaDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1"
  } catch {
    return false
  }
}

export function dismissPwaPrompt() {
  try {
    localStorage.setItem(DISMISS_KEY, "1")
  } catch {
    /* ignore */
  }
}

export function usePwaInstall(): PwaInstallState {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [isIos, setIsIos] = React.useState(false)
  const [isStandalone, setIsStandalone] = React.useState(false)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    setIsStandalone(standalone)

    const ua = navigator.userAgent || ""
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIos(ios)

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", onBip)
    setReady(true)

    return () => window.removeEventListener("beforeinstallprompt", onBip)
  }, [])

  const install = React.useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    try {
      await deferred.userChoice
    } catch {
      /* ignore */
    }
    setDeferred(null)
    dismissPwaPrompt()
  }, [deferred])

  return {
    canPrompt: Boolean(deferred),
    isIos,
    isStandalone,
    ready,
    install,
  }
}
