"use client"

import * as React from "react"
import { Download, X } from "lucide-react"
import {
  dismissPwaPrompt,
  isPwaDismissed,
  usePwaInstall,
} from "@/components/pwa/usePwaInstall"

/**
 * Hint compact membre — Android Chrome + iOS Add to Home Screen.
 */
export function PwaInstallHint() {
  const { canPrompt, isIos, isStandalone, ready, install } = usePwaInstall()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (!ready || isStandalone || isPwaDismissed()) {
      setVisible(false)
      return
    }
    // Afficher si on peut installer, ou iOS, ou tip générique après un court délai
    if (canPrompt || isIos) setVisible(true)
    else {
      const t = window.setTimeout(() => setVisible(true), 1200)
      return () => window.clearTimeout(t)
    }
  }, [ready, isStandalone, canPrompt, isIos])

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

  if (!visible) return null

  return (
    <div className="rounded-2xl border border-primary/20 bg-card px-4 py-3 flex items-start gap-3 shadow-sm">
      <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Installer KELIAA</p>
        <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
          {isIos && !canPrompt
            ? "Sur iPhone : Partager → Sur l’écran d’accueil. Accès direct sans passer par le navigateur."
            : "Ajoutez l’app sur votre écran d’accueil pour un accès rapide (messagerie, EVA, matching)."}
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
