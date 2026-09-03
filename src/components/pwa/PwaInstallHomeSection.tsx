"use client"

import { Smartphone } from "lucide-react"
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton"
import { usePwaInstall } from "@/components/pwa/usePwaInstall"

/** Section PWA compacte — page d’accueil. */
export function PwaInstallHomeSection() {
  const { isInstalled, isMobile, ready } = usePwaInstall()

  if (ready && isInstalled) return null

  return (
    <section className="relative py-12 sm:py-14 px-6 sm:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto rounded-2xl border border-border/70 bg-gradient-to-r from-[#0F1F1A] to-[#2D1020] px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3 text-white min-w-0">
          <Smartphone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">
              {ready && !isMobile
                ? "Installer KELIAA sur mobile"
                : "Installer l’app KELIAA"}
            </p>
            <p className="text-xs text-white/65 mt-0.5 leading-relaxed">
              {ready && !isMobile
                ? "Ouvrez keliaa.org sur votre téléphone pour l’ajouter à l’écran d’accueil."
                : "Sur l’écran d’accueil — messagerie, EVA et matching en un tap."}
            </p>
          </div>
        </div>
        <PwaInstallButton variant="alliance" size="md" className="shrink-0" />
      </div>
    </section>
  )
}
