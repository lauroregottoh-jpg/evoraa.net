"use client"

import * as React from "react"
import { Download, Smartphone, X } from "lucide-react"
import {
  usePwaInstall,
  dismissPwaPrompt,
  isPwaDismissed,
} from "@/components/pwa/usePwaInstall"
import { cn } from "@/utils/cn"

/**
 * Badge flottant d’install — masqué si déjà installé ou dismiss.
 */
export function PwaInstallBadge() {
  const { canPrompt, isIos, isInstalled, ready, install } = usePwaInstall()
  const [hidden, setHidden] = React.useState(true)
  const [showHelp, setShowHelp] = React.useState(false)

  React.useEffect(() => {
    if (!ready) return
    if (isInstalled || isPwaDismissed()) {
      setHidden(true)
      return
    }
    setHidden(false)
  }, [ready, isInstalled])

  if (!ready || hidden || isInstalled) return null

  const onInstall = async () => {
    if (canPrompt) {
      await install()
      setHidden(true)
      return
    }
    setShowHelp(true)
  }

  const onDismiss = () => {
    dismissPwaPrompt()
    setHidden(true)
  }

  return (
    <div
      className={cn(
        "fixed z-[70] right-3 sm:right-5 bottom-[4.75rem] md:bottom-5",
        "flex flex-col items-end gap-2 pointer-events-none"
      )}
    >
      {showHelp && (
        <div className="pointer-events-auto max-w-[16rem] rounded-2xl border border-border bg-card px-3 py-2.5 text-[11px] text-muted-foreground shadow-elevated leading-relaxed">
          {isIos
            ? "iPhone : Partager → Sur l’écran d’accueil."
            : "Menu du navigateur → Installer l’app / Ajouter à l’écran d’accueil."}
        </div>
      )}
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-primary/25 bg-[#0F1F1A] text-white shadow-elevated pl-1 pr-1 py-1">
        <button
          type="button"
          onClick={onInstall}
          className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground h-10 pl-3 pr-4 text-xs font-bold hover:brightness-110 transition-all"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/15">
            {canPrompt ? (
              <Download className="h-3.5 w-3.5" />
            ) : (
              <Smartphone className="h-3.5 w-3.5" />
            )}
          </span>
          {canPrompt ? "Installer l’app" : "Comment installer"}
        </button>
        <button
          type="button"
          aria-label="Masquer"
          onClick={onDismiss}
          className="h-9 w-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
