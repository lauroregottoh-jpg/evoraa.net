"use client"

import { Download, Smartphone } from "lucide-react"
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton"
import { cn } from "@/utils/cn"

type Props = {
  isPaid: boolean
  className?: string
}

/**
 * Carte d’installation dans l’espace membre — variante Découverte ou Alliance.
 */
export function PwaMemberInstallCard({ isPaid, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between",
        isPaid
          ? "border-accent/35 bg-gradient-to-r from-accent/10 via-[#F8F4EE] to-primary/5"
          : "border-primary/20 bg-gradient-to-r from-primary/[0.06] via-card to-accent/[0.06]",
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span
          className={cn(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            isPaid
              ? "border-accent/40 bg-accent/15 text-accent"
              : "border-primary/25 bg-primary/10 text-primary"
          )}
        >
          <Smartphone className="h-5 w-5" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {isPaid
              ? "Alliance — gardez KELIAA dans votre poche"
              : "Découverte — installez KELIAA sur votre téléphone"}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isPaid
              ? "Messagerie, EVA et Coffre Premium en un tap — sans repasser par le site."
              : "Matching, EVA et parcours Découverte en accès direct depuis l’écran d’accueil."}
          </p>
        </div>
      </div>
      <PwaInstallButton
        variant={isPaid ? "alliance" : "discovery"}
        size="md"
        label={isPaid ? "Télécharger l’app Alliance" : "Télécharger l’app"}
        className="shrink-0"
      />
    </div>
  )
}

/** Bouton compact pour la barre membre. */
export function PwaMemberInstallNavButton({ isPaid }: { isPaid?: boolean }) {
  return (
    <PwaInstallButton
      variant={isPaid ? "alliance" : "discovery"}
      size="sm"
      label="App"
      className="shrink-0"
    />
  )
}
