"use client"

import * as React from "react"
import { Download, Smartphone } from "lucide-react"
import { cn } from "@/utils/cn"
import { usePwaInstall } from "@/components/pwa/usePwaInstall"

type Variant = "primary" | "outline" | "soft" | "alliance" | "discovery"

type Props = {
  variant?: Variant
  className?: string
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

export function PwaInstallButton({
  variant = "primary",
  className,
  showWhenInstalled = false,
  label,
  size = "md",
}: Props) {
  const { canPrompt, isIos, isInstalled, ready, install } = usePwaInstall()
  const [showHelp, setShowHelp] = React.useState(false)

  if (!ready) return null
  if (isInstalled && !showWhenInstalled) return null

  if (isInstalled) {
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
      ? "Installer l’app"
      : isIos
        ? "Ajouter à l’écran d’accueil"
        : "Comment installer")

  const onClick = async () => {
    if (canPrompt) {
      await install()
      return
    }
    setShowHelp(true)
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
        {canPrompt ? (
          <Download className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
        ) : (
          <Smartphone className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
        )}
        {text}
      </button>
      {showHelp && (
        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs rounded-lg border border-border bg-card/95 px-3 py-2 shadow-sm">
          {isIos
            ? "Sur iPhone / iPad : Partager → « Sur l’écran d’accueil »."
            : "Menu ⋮ ou Partager → « Installer l’application » / « Ajouter à l’écran d’accueil ». Aucun fichier à télécharger."}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setShowHelp(false)}
          >
            OK
          </button>
        </p>
      )}
    </div>
  )
}
