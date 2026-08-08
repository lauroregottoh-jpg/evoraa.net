"use client"

import * as React from "react"
import { Download, X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "keliaa_pwa_install_dismissed"

/**
 * Hint « Installer KELIAA » — Android Chrome (beforeinstallprompt) + iOS Add to Home Screen.
 */
export function PwaInstallHint() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [iosHint, setIosHint] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return
    } catch {
      /* ignore */
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    if (standalone) return

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", onBip)

    const ua = navigator.userAgent || ""
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    if (isIOS && !standalone) {
      setIosHint(true)
      setVisible(true)
    }

    return () => window.removeEventListener("beforeinstallprompt", onBip)
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    try {
      await deferred.userChoice
    } catch {
      /* ignore */
    }
    setDeferred(null)
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="rounded-2xl border border-primary/20 bg-card px-4 py-3 flex items-start gap-3 shadow-sm">
      <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Installer KELIAA</p>
        <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
          {iosHint && !deferred
            ? "Sur iPhone : Partager → Sur l’écran d’accueil. Accès direct sans passer par le navigateur."
            : "Ajoutez l’app sur votre écran d’accueil pour un accès rapide (messagerie, EVA, matching)."}
        </p>
        {deferred && (
          <button
            type="button"
            onClick={install}
            className="mt-2 inline-flex h-9 items-center rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground"
          >
            Installer
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Fermer"
        onClick={dismiss}
        className="text-muted-foreground hover:text-foreground p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
