"use client"

import Link from "next/link"
import { CheckCircle2, Headphones, Lock } from "lucide-react"
import { CoachingCheckoutPanel } from "@/components/coaching/CoachingCheckoutPanel"
import { CoachingWhyGrid } from "@/components/coaching/CoachingWhyGrid"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"

/**
 * Page coaching vente : audio, anonymat d’affichage, packs + répartition.
 */
export function CoachingSalesPage({
  suggestedMode,
  moduleId,
  moduleTitle,
  initialFirstName,
  initialLastName,
  cancel,
  hasCredits,
}: {
  suggestedMode: BictorysPaymentMode
  moduleId?: string
  moduleTitle?: string
  initialFirstName: string
  initialLastName: string
  cancel?: boolean
  hasCredits: boolean
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-[#5C1F28] via-[#4A1820] to-[#3D2A14] px-5 py-8 sm:px-8 sm:py-10 text-[#F8F4EE] shadow-elevated">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(184,149,74,0.45), transparent 70%)",
          }}
        />
        <div className="relative space-y-3 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
            Coaching relationnel · audio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Une session pour débloquer un vrai point
          </h1>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            Séances en audio dans KELIAA (pas Zoom, pas de visio obligatoire).
            Choisissez votre offre, réservation avec Sara ou Antoine, puis
            rejoignez la réunion. Anonymat d’affichage optionnel.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {hasCredits ? (
              <Link
                href="/coaching/session"
                className="inline-flex h-11 items-center rounded-xl bg-[#F3D9A4] px-5 text-sm font-bold text-[#5C1F28]"
              >
                Faire votre session
              </Link>
            ) : (
              <a
                href="#payer"
                className="inline-flex h-11 items-center rounded-xl bg-[#F3D9A4] px-5 text-sm font-bold text-[#5C1F28]"
              >
                Prendre une session — débloquer
              </a>
            )}
            <Link
              href="/coaching/session"
              className="inline-flex h-11 items-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-white"
            >
              Voir l’espace session
            </Link>
          </div>
        </div>
      </header>

      {moduleTitle ? (
        <p className="text-xs rounded-xl border border-border bg-secondary/40 px-3 py-2">
          Thème Académie : <strong>{moduleTitle}</strong>
        </p>
      ) : null}
      {cancel ? (
        <p className="text-sm text-amber-800 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          Paiement annulé. Vous pouvez reprendre ci-dessous.
        </p>
      ) : null}

      <CoachingWhyGrid />

      <section className="relative overflow-hidden rounded-2xl border border-[#5C1F28]/15 bg-[#FBF9F6] p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5C1F28]/10 text-[#5C1F28]">
            <Headphones className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
              Ce qui se débloque
            </p>
            <h2 className="font-serif text-xl font-bold text-[#5C1F28]">
              Votre salle audio privée
            </h2>
          </div>
        </div>
        <ul className="space-y-2.5 text-sm text-[#1C1412]/80">
          {[
            "1 crédit = 30 min · packs 30 min / 1 h / multi-séances",
            "Répartition des séances dès l’achat",
            "Calendrier de réservation sur les dispos coach",
            "Salle d’attente puis séance audio dans KELIAA",
            "Anonymat d’affichage optionnel (identité connue du système / coach)",
            "Questionnaire + rapport auto en fin de séance",
          ].map((line) => (
            <li key={line} className="flex gap-2 items-start">
              {hasCredits ? (
                <CheckCircle2 className="h-4 w-4 text-[#5C1F28] shrink-0 mt-0.5" />
              ) : (
                <Lock className="h-4 w-4 text-[#5C1F28]/45 shrink-0 mt-0.5" />
              )}
              <span className={hasCredits ? "" : "opacity-80"}>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[#1C1412]/55 leading-relaxed">
          Un compte-rendu de séance est généré automatiquement pour le suivi.
          Les échanges restent dans KELIAA (messages prédéfinis).
        </p>
        <Link
          href="/coaching/session"
          className="mt-4 inline-flex text-sm font-semibold text-[#5C1F28] underline underline-offset-4"
        >
          {hasCredits
            ? "Accéder à Faire votre session →"
            : "Aperçu de l’espace session →"}
        </Link>
      </section>

      <div id="payer" className="scroll-mt-24">
        <CoachingCheckoutPanel
          suggestedMode={suggestedMode}
          moduleId={moduleId}
          moduleTitle={moduleTitle}
          initialFirstName={initialFirstName}
          initialLastName={initialLastName}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Besoin d’aide ?{" "}
        <Link href="/messages" className="underline">
          Contacter le support
        </Link>
      </p>
    </div>
  )
}
