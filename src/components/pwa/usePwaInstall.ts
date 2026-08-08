"use client"

import * as React from "react"

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export type PwaInstallState = {
  canPrompt: boolean
  isIos: boolean
  /** Téléphone / tablette (UA ou pointeur tactile). */
  isMobile: boolean
  /** App déjà installée (standalone, appinstalled, ou flag local). */
  isInstalled: boolean
  /** @deprecated alias de isInstalled — compat composants existants */
  isStandalone: boolean
  ready: boolean
  install: () => Promise<void>
}

const DISMISS_KEY = "keliaa_pwa_install_dismissed"
const INSTALLED_KEY = "keliaa_pwa_installed"

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

export function isPwaMarkedInstalled(): boolean {
  try {
    return localStorage.getItem(INSTALLED_KEY) === "1"
  } catch {
    return false
  }
}

export function markPwaInstalled() {
  try {
    localStorage.setItem(INSTALLED_KEY, "1")
  } catch {
    /* ignore */
  }
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  )
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent || ""
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  if (ios) return true
  if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true
  try {
    if (window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 1024) {
      return true
    }
  } catch {
    /* ignore */
  }
  return false
}

export function usePwaInstall(): PwaInstallState {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(
    null
  )
  const [isIos, setIsIos] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const standalone = detectStandalone()
    const marked = isPwaMarkedInstalled()
    if (standalone || marked) {
      setIsInstalled(true)
      if (standalone) markPwaInstalled()
    }

    const ua = navigator.userAgent || ""
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIos(ios)
    setIsMobile(detectMobile())

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      markPwaInstalled()
      setIsInstalled(true)
      setDeferred(null)
    }

    const mq = window.matchMedia("(display-mode: standalone)")
    const onMq = () => {
      if (detectStandalone()) {
        markPwaInstalled()
        setIsInstalled(true)
      }
    }

    window.addEventListener("beforeinstallprompt", onBip)
    window.addEventListener("appinstalled", onInstalled)
    mq.addEventListener?.("change", onMq)
    setReady(true)

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip)
      window.removeEventListener("appinstalled", onInstalled)
      mq.removeEventListener?.("change", onMq)
    }
  }, [])

  const install = React.useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    try {
      const choice = await deferred.userChoice
      if (choice.outcome === "accepted") {
        markPwaInstalled()
        setIsInstalled(true)
        dismissPwaPrompt()
      }
    } catch {
      /* ignore */
    }
    setDeferred(null)
  }, [deferred])

  return {
    canPrompt: Boolean(deferred) && !isInstalled,
    isIos,
    isMobile,
    isInstalled,
    isStandalone: isInstalled,
    ready,
    install,
  }
}
