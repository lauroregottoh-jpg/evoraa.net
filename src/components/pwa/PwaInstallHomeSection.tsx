"use client"

import { Download, MessageCircle, Sparkles, Smartphone } from "lucide-react"
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton"

/**
 * Section dédiée page d’accueil — télécharger l’app KELIAA.
 */
export function PwaInstallHomeSection() {
  return (
    <section className="relative py-24 sm:py-28 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1F1A] via-[#1C1412] to-[#5C1F28]" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,74,0.45), transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(248,244,238,0.2), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="rounded-[2rem] border border-white/15 bg-white/[0.06] backdrop-blur-md p-8 sm:p-12 lg:p-14 shadow-elevated">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-5 text-white">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                <Smartphone className="h-3.5 w-3.5" />
                Application KELIAA
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Téléchargez KELIAA sur votre téléphone
              </h2>
              <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">
                Accédez directement à la messagerie, à EVA et au matching — sans
                repasser par le navigateur. Une app installable, pensée pour votre
                quotidien.
              </p>
              <ul className="space-y-2.5 text-sm text-white/80">
                {[
                  "Icône sur l’écran d’accueil, comme une vraie app",
                  "Notifications et échanges plus rapides au quotidien",
                  "Fonctionne sur Android et iPhone (via navigateur)",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <PwaInstallButton variant="alliance" size="lg" />
                <p className="text-xs text-white/55 max-w-[14rem] leading-relaxed">
                  Gratuit · Pas besoin de Play Store ni App Store
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[240px]">
              <div className="aspect-[9/16] rounded-[2rem] border-4 border-white/20 bg-gradient-to-b from-[#5C1F28] to-[#0F1F1A] shadow-elevated overflow-hidden flex flex-col">
                <div className="px-4 pt-5 pb-3 border-b border-white/10">
                  <p className="font-serif text-xl font-bold text-white">KELIAA</p>
                  <p className="text-[10px] uppercase tracking-widest text-accent/90 mt-1">
                    Sur votre écran d’accueil
                  </p>
                </div>
                <div className="flex-1 p-4 space-y-3">
                  {[
                    { icon: MessageCircle, label: "Messagerie" },
                    { icon: Sparkles, label: "EVA" },
                    { icon: Download, label: "Coffre Premium" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5"
                    >
                      <row.icon className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-white/90">
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4 pt-0">
                  <div className="rounded-xl bg-accent text-accent-foreground text-center text-xs font-bold py-2.5">
                    Installer l’app
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
