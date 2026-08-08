"use client"

import * as React from "react"
import { Smartphone, X } from "lucide-react"
import {
  dismissPwaPrompt,
  isPwaDismissed,
  usePwaInstall,
} from "@/components/pwa/usePwaInstall"

export function PwaInstallHint() {
  const { canPrompt, isIos, isMobile, isInstalled, ready, install } =
    usePwaInstall()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (!ready || isInstalled || isPwaDismissed()) {
      setVisible(false)
      return
    }
    if (canPrompt || isIos) setVisible(true)
    else {
      const t = window.setTimeout(() => setVisible(true), 1200)
      return () => window.clearTimeout(t)
    }
  }, [ready, isInstalled, canPrompt, isIos])

  const dismiss = () => {
    setVisible(false)
    dismissPwaPrompt()
  }

  const onInstall = async () => {
    if (canPrompt) {
      await install()
      setVisible(false)
    }
  }

  if (!visible || isInstalled) return null

  const body =
    isIos && !canPrompt
      ? "Sur iPhone : Partager → Sur l’écran d’accueil."
      : canPrompt
        ? "Ajoutez l’app sur votre écran d’accueil pour un accès rapide."
        : !isMobile
          ? "Pour installer KELIAA, ouvrez le site sur votre téléphone."
          : "Via le menu du navigateur : Installer / Ajouter à l’écran d’accueil."

  return (
    <div className="rounded-2xl border border-primary/20 bg-card px-4 py-3 flex items-start gap-3 shadow-sm">
      <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {!isMobile && !canPrompt ? "Installer sur mobile" : "Installer KELIAA"}
        </p>
        <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
          {body}
        </p>
        {canPrompt && (
          <button
            type="button"
            onClick={onInstall}
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
