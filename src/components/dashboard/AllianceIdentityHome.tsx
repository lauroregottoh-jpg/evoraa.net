"use client"

import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheck,
  ClipboardList,
  Crown,
  Library,
  Route,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs"
import { AllianceGiftReveal } from "@/components/dashboard/AllianceGiftReveal"

const UNLOCKED = [
  {
    icon: ClipboardList,
    title: "Rapport Personnalisé complet",
    body: "Bilan relationnel enrichi — chapitres qui s’ouvrent au fil des tests.",
    href: "/rapport/global",
  },
  {
    icon: Sparkles,
    title: "Tests supplémentaires Alliance",
    body: "Matériel enrichi : évaluations du Rapport visibles et débloquées.",
    href: "/assessments",
  },
  {
    icon: Library,
    title: "Coffre Premium",
    body: "Guides et ressources exclusives pour préparer votre mariage.",
    href: "/coffre-premium",
  },
  {
    icon: Route,
    title: "Parcours Alliance guidé",
    body: "Missions, niveaux et prochaine étape claire — vous n’êtes jamais perdu.",
    href: "/alliance/parcours",
  },
] as const

function defaultAvatar(gender: "M" | "F" | null) {
  if (gender === "M") return "/avatars/avatar-man-default.png"
  return "/avatars/avatar-woman-default.png"
}

/** Accueil Alliance : grand coffret → carte or → espace enrichi. */
export function AllianceIdentityHome({
  firstName,
  lastName,
  avatarUrl,
  gender,
  memberSinceLabel,
  isVerified,
  assessmentsDone,
}: {
  firstName: string
  lastName?: string
  avatarUrl: string | null
  gender: "M" | "F" | null
  memberSinceLabel: string
  isVerified: boolean
  assessmentsDone: number
}) {
  const name = firstName.trim() || "Membre"
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || name
  const photo = avatarUrl || defaultAvatar(gender)
  const nextHref =
    assessmentsDone < 5 ? "/assessments" : "/alliance/parcours"
  const nextLabel =
    assessmentsDone < 5
      ? "Compléter mes tests (Matching + Alliance)"
      : "Continuer mon parcours Alliance"

  return (
    <div className="relative space-y-5">
      <AmbientSnowOrbs density="soft" className="opacity-55 z-0" />

      {/* 1. Grand coffret animé — AVANT la carte */}
      <AllianceGiftReveal firstName={name} />

      {/* 2. Carte membre */}
      <section className="relative z-10 overflow-hidden rounded-[1.6rem] border-2 border-[#B8954A]/55 bg-gradient-to-br from-[#A07070] via-[#2A1A12] to-[#3D2418] text-[#F2EBE0] p-5 sm:p-7 shadow-elevated">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#B8954A]/30 blur-3xl"
        />
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-55"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative mx-auto sm:mx-0 shrink-0">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border-2 border-[#B8954A]/70 shadow-[0_12px_40px_-12px_rgba(215,184,102,0.65)] ring-2 ring-[#D4AF72]/25">
              <Image
                src={photo}
                alt={`Portrait de ${fullName}`}
                width={128}
                height={128}
                className="h-full w-full object-cover"
                unoptimized={!avatarUrl}
                priority
              />
            </div>
            <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-[#B8954A]/50 bg-[#B8954A] text-[#A07070]">
              <Crown className="h-4 w-4" />
            </span>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
              Carte membre Alliance
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Bienvenue, {name} ✨
            </h1>
            <p className="text-sm text-[#D4AF72]/90 font-medium">
              Félicitations — Alliance était le bon choix.
            </p>
            <p className="text-sm text-white/65">{fullName}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/45 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF72]">
                <BadgeCheck className="h-3.5 w-3.5" />
                Membre Premium
              </span>
              <span className="rounded-full border border-[#B8954A]/25 bg-white/5 px-3 py-1 text-[10px] font-semibold text-[#D4AF72]/85">
                Depuis {memberSinceLabel}
              </span>
              {isVerified ? (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold text-emerald-200">
                  Profil vérifié
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Espace enrichi */}
      <section className="relative z-10 rounded-[1.5rem] border border-[#E4D8CC] bg-white p-5 sm:p-7 space-y-4 shadow-card">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
            Espace enrichi débloqué
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Vous avez débloqué un espace enrichi
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Bravo. Vous disposez désormais de tests supplémentaires, d’un bilan
            relationnel complet, du Coffre Premium, d’un parcours guidé et d’un
            accès au support humain — étape par étape.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3">
          {UNLOCKED.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="flex gap-3 rounded-xl border border-[#B8954A]/30 bg-white p-4 hover:border-[#B8954A]/55 transition-colors h-full shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B8954A]/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {item.body}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="rounded-xl border border-[#E4D8CC] bg-[#F8F4EC] p-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7F5557]">
            Prochaine étape
          </p>
          <p className="text-sm font-semibold text-[#2F2424]">
            {assessmentsDone < 5
              ? "Complétez vos tests Matching, puis explorez les 10 clés Alliance."
              : "Suivez votre parcours : missions, rapport global et Coffre Premium."}
          </p>
          <Link
            href={nextHref}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#7F5557] px-5 text-sm font-bold text-[#F7F1EA]"
          >
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
