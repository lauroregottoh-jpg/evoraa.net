"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  FileText,
  FolderOpen,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  Route,
  Sparkles,
} from "lucide-react"
import { COUPLE_BRAND, COUPLE_PROMISE, COUPLE_TAGLINE } from "@/lib/couple/config"
import { cn } from "@/utils/cn"

/** Nav dashboard client uniquement (pas la page vente). */
export const COUPLE_APP_NAV = [
  {
    href: "/couple/espace",
    label: "Tableau de bord",
    short: "Accueil",
    icon: LayoutDashboard,
  },
  {
    href: "/couple/dossier",
    label: "Dossier",
    short: "Dossier",
    icon: FolderOpen,
  },
  {
    href: "/couple/questionnaire",
    label: "Questionnaire",
    short: "Questions",
    icon: ClipboardList,
  },
  {
    href: "/couple/rapport",
    label: "Rapport",
    short: "Rapport",
    icon: FileText,
  },
  {
    href: "/couple/exercices",
    label: "Exercices",
    short: "Exercices",
    icon: Sparkles,
  },
  {
    href: "/couple/plan",
    label: "Plan",
    short: "Plan",
    icon: Route,
  },
] as const

const WELCOME_KEY = "keliaa_couple_welcome_seen"

function CoupleWelcomeGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = React.useState<"loading" | "welcome" | "ready">(
    "loading"
  )

  React.useEffect(() => {
    try {
      if (sessionStorage.getItem(WELCOME_KEY) === "1") {
        setPhase("ready")
        return
      }
    } catch {
      /* ignore */
    }
    setPhase("welcome")
  }, [])

  const enter = () => {
    try {
      sessionStorage.setItem(WELCOME_KEY, "1")
    } catch {
      /* ignore */
    }
    setPhase("ready")
  }

  if (phase === "loading") {
    return (
      <div className="min-h-[30vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">…</p>
      </div>
    )
  }

  if (phase === "welcome") {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#2D1020] via-[#4A1820] to-[#2A1810] text-[#F2EBE0] px-6 py-12 sm:px-10 sm:py-16 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative max-w-xl mx-auto text-center space-y-5">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
            <HeartHandshake className="h-4 w-4" />
            {COUPLE_BRAND}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Votre espace couple
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            {COUPLE_TAGLINE}. {COUPLE_PROMISE}
          </p>
          <button
            type="button"
            onClick={enter}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-[#D4AF72] px-8 text-sm font-bold text-[#2D1020]"
          >
            Entrer
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Shell Couple :
 * - sales : page présentation / paiement (sans barre d’onglets)
 * - app : dashboard client (nav compacte)
 */
export function CoupleShell({
  children,
  activeHref,
  className,
  showWelcome = true,
  variant = "app",
}: {
  children: React.ReactNode
  activeHref?: string
  className?: string
  showWelcome?: boolean
  variant?: "sales" | "app"
}) {
  if (variant === "sales") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <HeartHandshake className="h-4 w-4" />
              {COUPLE_BRAND}
            </p>
            <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
              {COUPLE_TAGLINE}
            </p>
          </div>
          <Link
            href="/couple/espace"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#2D1020]/20 bg-white px-3 text-xs sm:text-sm font-semibold text-[#2D1020] shrink-0"
          >
            Mon espace
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {children}
      </div>
    )
  }

  const body = (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <HeartHandshake className="h-4 w-4 shrink-0" />
            {COUPLE_BRAND}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tableau de bord client
          </p>
        </div>
        <Link
          href="/couple"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D1020] underline underline-offset-2 shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Présentation
        </Link>
      </div>

      {/* Nav compacte — scroll horizontal sur mobile, pas de grappe de boutons */}
      <nav
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none"
        aria-label="Navigation couple"
      >
        {COUPLE_APP_NAV.map((s) => {
          const Icon = s.icon
          const active =
            activeHref === s.href ||
            Boolean(activeHref?.startsWith(`${s.href}/`))
          return (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors",
                active
                  ? "bg-[#2D1020] text-[#F2EBE0]"
                  : "bg-[#F3EEE6] text-[#2D1020]/75 hover:bg-[#E8DFD2]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </Link>
          )
        })}
      </nav>

      {children}
    </div>
  )

  if (!showWelcome) return body
  return <CoupleWelcomeGate>{body}</CoupleWelcomeGate>
}

export function CouplePromiseLine() {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
      {COUPLE_PROMISE}
    </p>
  )
}

/** Carte CTA présentation → dashboard client. */
export function CoupleAccessDashboardCard({
  className,
}: {
  className?: string
}) {
  return (
    <Link
      href="/couple/espace"
      className={cn(
        "group relative block overflow-hidden rounded-[1.75rem] border border-[#B8954A]/40",
        "bg-gradient-to-br from-[#2D1020] via-[#3D1830] to-[#2D1020] p-6 sm:p-8 text-[#F2EBE0]",
        "shadow-elevated transition-transform hover:scale-[1.01]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(243,217,164,0.45), transparent 70%)",
        }}
      />
      <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
        Espace client
      </p>
      <h2 className="relative mt-2 font-serif text-2xl sm:text-3xl font-bold leading-tight">
        Découvrir mon tableau de bord
      </h2>
      <p className="relative mt-3 text-sm text-white/75 max-w-md leading-relaxed">
        Voir à quoi ressemble votre espace : dossier, questionnaire, rapport,
        exercices et plan — avec aperçu verrouillé tant que le bilan n’est pas
        débloqué.
      </p>
      <span className="relative mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#D4AF72] px-5 text-sm font-bold text-[#2D1020]">
        Accéder à mon espace
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/** Grande carte module dashboard (avec cadenas optionnel). */
export function CoupleDashTile({
  href,
  title,
  description,
  icon: Icon,
  locked,
  status,
  accent,
}: {
  href: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  locked?: boolean
  status?: string
  accent?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col rounded-2xl border p-5 sm:p-6 transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        accent
          ? "border-[#B8954A]/45 bg-gradient-to-br from-[#B8954A]/15 via-white to-[#F2EBE0]"
          : "border-[#2D1020]/10 bg-white",
        locked && "opacity-95"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            accent
              ? "bg-[#2D1020] text-[#D4AF72]"
              : "bg-[#2D1020]/8 text-[#2D1020]"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {locked ? (
          <Lock className="h-4 w-4 text-[#2D1020]/45 shrink-0" />
        ) : null}
      </div>
      <h3 className="mt-4 font-serif text-xl font-bold text-[#2D1020]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#2D1020]/65 leading-relaxed flex-1">
        {description}
      </p>
      {status ? (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A6A2E]">
          {status}
        </p>
      ) : (
        <p className="mt-3 text-xs font-semibold text-[#2D1020]">
          {locked ? "Aperçu · débloquer →" : "Ouvrir →"}
        </p>
      )}
    </Link>
  )
}
