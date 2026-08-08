"use client"

import * as React from "react"
import { Download, Smartphone } from "lucide-react"
import { cn } from "@/utils/cn"
import { usePwaInstall } from "@/components/pwa/usePwaInstall"

type Variant = "primary" | "outline" | "soft" | "alliance" | "discovery"

type Props = {
  variant?: Variant
  className?: string
  /** Toujours visible même si déjà installé (affiche « App installée ») */
  showWhenInstalled?: boolean
  label?: string
  size?: "sm" | "md" | "lg"
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-95 border border-transparent",
  outline:
    "border border-primary/30 bg-transparent text-primary hover:bg-primary/5",
  soft: "border border-border bg-card text-foreground hover:bg-muted/60",
  alliance:
    "bg-accent text-accent-foreground hover:opacity-95 border border-transparent font-bold",
  discovery:
    "bg-[#5C1F28] text-white hover:brightness-110 border border-transparent",
}

/**
 * Bouton d’installation app — espaces membres Découverte / Alliance + marketing.
 */
export function PwaInstallButton({
  variant = "primary",
  className,
  showWhenInstalled = false,
  label,
  size = "md",
}: Props) {
  const { canPrompt, isIos, isStandalone, ready, install } = usePwaInstall()
  const [iosOpen, setIosOpen] = React.useState(false)

  if (!ready) return null
  if (isStandalone && !showWhenInstalled) return null

  if (isStandalone) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-xl text-xs font-semibold text-muted-foreground",
          size === "lg" ? "h-12 px-5" : size === "sm" ? "h-9 px-3" : "h-10 px-4",
          className
        )}
      >
        <Smartphone className="h-4 w-4" />
        App installée
      </span>
    )
  }

  const text =
    label ||
    (canPrompt
      ? "Télécharger l’app"
      : isIos
        ? "Ajouter à l’écran d’accueil"
        : "Installer KELIAA")

  const onClick = async () => {
    if (canPrompt) {
      await install()
      return
    }
    if (isIos) {
      setIosOpen(true)
      return
    }
    // Desktop / navigateurs sans beforeinstallprompt : ouvrir le menu navigateur
    setIosOpen(true)
  }

  return (
    <div className={cn("relative inline-flex flex-col items-stretch gap-2", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
          size === "lg" ? "h-12 px-6 text-base" : size === "sm" ? "h-9 px-3 text-xs" : "h-10 px-4",
          VARIANT_CLASS[variant]
        )}
      >
        <Download className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
        {text}
      </button>
      {iosOpen && (
        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs rounded-lg border border-border bg-card/95 px-3 py-2 shadow-sm">
          {isIos
            ? "Sur iPhone / iPad : appuyez sur Partager → « Sur l’écran d’accueil »."
            : "Dans votre navigateur : menu ⋮ ou Partager → « Installer l’application » / « Ajouter à l’écran d’accueil »."}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setIosOpen(false)}
          >
            OK
          </button>
        </p>
      )}
    </div>
  )
}
