import Link from "next/link"
import { HeartHandshake } from "lucide-react"
import { COUPLE_BRAND, COUPLE_PROMISE, COUPLE_TAGLINE } from "@/lib/couple/config"
import { cn } from "@/utils/cn"

const STEPS = [
  { href: "/couple/espace", label: "Espace" },
  { href: "/couple/inviter", label: "Invitation" },
  { href: "/couple/questionnaire", label: "Questionnaire" },
  { href: "/couple/resultats", label: "Résultats" },
  { href: "/couple/rapport", label: "Rapport" },
] as const

export function CoupleShell({
  children,
  activeHref,
  className,
}: {
  children: React.ReactNode
  activeHref?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            <HeartHandshake className="h-3.5 w-3.5" />
            {COUPLE_BRAND}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{COUPLE_TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap gap-1">
          {STEPS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                activeHref === s.href
                  ? "bg-foreground/[0.08] text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
              )}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}

export function CouplePromiseLine() {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
      {COUPLE_PROMISE}
    </p>
  )
}
