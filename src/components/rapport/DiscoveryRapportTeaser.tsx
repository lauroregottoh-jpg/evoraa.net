"use client"

import Link from "next/link"
import { Crown, Lock } from "lucide-react"
import { ScoreRing } from "@/components/rapport/ReportVisuals"

/**
 * Aperçu Découverte du Rapport Alliance — forme premium visible,
 * contenu flouté + grand cadenas pour pousser à l’upgrade.
 */
export function DiscoveryRapportTeaser({
  firstName,
}: {
  firstName?: string | null
}) {
  const name = firstName?.trim() || "Membre"

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <header className="rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-[#2D1020] via-[#722F37] to-[#3D1830] p-6 sm:p-8 text-[#F2EBE0] shadow-elevated">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
          Découverte · Aperçu Rapport
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
          {name}, découvrez la forme de votre Rapport Alliance™
        </h1>
        <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-xl">
          Voici à quoi ressemble le Rapport Personnalisé. Le contenu reste
          verrouillé en formule Découverte — passez Alliance pour le lire et le
          télécharger.
        </p>
        <Link
          href="/premium?next=/rapport"
          className="mt-5 inline-flex h-12 items-center gap-2 rounded-xl bg-[#B8954A] px-5 text-sm font-bold text-[#2D1020]"
        >
          <Crown className="h-4 w-4" />
          Débloquer mon Rapport Alliance
        </Link>
      </header>

      <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/40 shadow-elevated">
        {/* Preview “premium” flouté */}
        <div
          aria-hidden
          className="select-none pointer-events-none blur-[7px] sm:blur-[8px] opacity-90 scale-[1.01]"
        >
          <div className="bg-gradient-to-br from-[#2D1020] via-[#2A1810] to-[#2D1020] text-[#F2EBE0] p-8 sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF72]">
              KELIAA ALLIANCE™
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2">
              Rapport Personnalisé Alliance™
            </h2>
            <p className="text-[#D4AF72]/90 mt-1">Préparation au Mariage</p>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <div className="rounded-2xl bg-white/95 p-2">
                <ScoreRing value={72} label="Complétude" size={100} />
              </div>
              <div className="rounded-2xl bg-white/95 p-2">
                <ScoreRing value={86} label="Préparation" size={100} />
              </div>
              <div className="min-w-[12rem] flex-1 space-y-2 text-sm">
                <p>
                  <span className="text-white/50">Nom · </span>
                  {name}
                </p>
                <p>
                  <span className="text-white/50">Version · </span>
                  Alliance Premium 1.0
                </p>
                <p>
                  <span className="text-white/50">Évaluations · </span>
                  7 / 10
                </p>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#B8954A] to-[#D4AF72]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F2EBE0] p-6 sm:p-8 space-y-5">
            <FakePage
              title="Résumé exécutif"
              lines={[
                "Les évaluations dressent le portrait d’une personne investie dans la qualité de ses relations…",
                "Votre communication constitue un point fort. Vous privilégiez le dialogue…",
                "Certaines dimensions peuvent encore être renforcées pour consolider…",
              ]}
            />
            <FakePage
              title="Votre portrait relationnel"
              lines={[
                "Ce qui ressort le plus fortement est votre volonté de construire des relations stables…",
                "Vous inspirez confiance grâce à la cohérence entre vos paroles et vos actes…",
              ]}
            />
            <FakePage
              title="Vos cinq plus grandes forces"
              lines={[
                "1. Vous inspirez confiance — cohérence et stabilité relationnelle…",
                "2. Vous recherchez la compréhension avant le jugement…",
                "3. Vous possédez une bonne capacité d’adaptation…",
              ]}
            />
            <div className="rounded-2xl border border-[#B8954A]/25 bg-white p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A5F28]">
                Lecture graphique
              </p>
              {[88, 82, 76, 71, 68].map((v, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-2.5 rounded-full bg-[#B8954A]/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8A6A2E] to-[#D4AF72]"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay cadenas */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#2D1020]/45 backdrop-blur-[1px] px-6 text-center">
          <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border-2 border-[#B8954A] bg-[#2D1020]/85 shadow-[0_0_40px_rgba(215,184,102,0.35)]">
            <Lock className="h-12 w-12 sm:h-14 sm:w-14 text-[#D4AF72]" strokeWidth={1.75} />
          </div>
          <p className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#F2EBE0]">
            Rapport Alliance verrouillé
          </p>
          <p className="mt-2 max-w-md text-sm text-white/80 leading-relaxed">
            Vous voyez la forme du document premium. Le texte et les analyses
            s’ouvrent avec Alliance — mis à jour automatiquement après chaque
            test.
          </p>
          <Link
            href="/premium?next=/rapport"
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-xl bg-[#B8954A] px-6 text-sm font-bold text-[#2D1020]"
          >
            <Crown className="h-4 w-4" />
            Débloquer avec Alliance
          </Link>
          <Link
            href="/assessments"
            className="mt-3 text-xs font-semibold text-[#D4AF72] underline underline-offset-2"
          >
            Continuer mes tests Découverte
          </Link>
        </div>
      </div>
    </div>
  )
}

function FakePage({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-[1.35rem] border border-[#B8954A]/30 bg-white p-5 space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8954A]">
        Page
      </p>
      <h3 className="font-serif text-xl font-bold text-[#2D1020]">{title}</h3>
      {lines.map((line) => (
        <p key={line.slice(0, 24)} className="text-sm text-[#5c534c] leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  )
}
