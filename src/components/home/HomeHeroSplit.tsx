"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Heart,
  MapPin,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react"
import { cn } from "@/utils/cn"

/**
 * Variante claire inspirée de Datify / INSPIRATION EN TETE.
 * L’ancien hero 3D reste dans HomeHeroCarousel + HeroBackground3D.
 */
export function HomeHeroSplit() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")

  const start = (e: React.FormEvent) => {
    e.preventDefault()
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""
    router.push(`/register${q}`)
  }

  return (
    <section className="relative overflow-hidden bg-[#F8F4EE] pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(184,149,74,0.18), transparent 42%), radial-gradient(circle at 82% 18%, rgba(92,31,40,0.10), transparent 36%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-[520px] w-[520px] rounded-full border border-[#D9D0C4]/70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-28 h-[380px] w-[380px] rounded-full border border-[#D9D0C4]/50"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-10 sm:px-10 lg:px-16">
        <div className="space-y-7 max-w-xl">
          <p className="text-sm font-semibold tracking-wide text-accent">
            Parce que vous méritez mieux.
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] font-bold leading-[1.12] tracking-tight text-foreground">
            Remarquée pour{" "}
            <span className="text-gradient italic font-semibold">qui vous êtes</span>
            , pas pour{" "}
            <span className="text-gradient italic font-semibold">votre photo</span>.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
            Vous êtes plus qu&apos;une image. KELIAA aide les célibataires chrétiens à discerner
            une relation sérieuse grâce à cinq piliers de compatibilité — sans swipe, sans
            pression.
          </p>

          <form
            onSubmit={start}
            className="flex flex-col sm:flex-row gap-2 rounded-full border border-border bg-white p-1.5 shadow-card max-w-md"
          >
            <label className="sr-only" htmlFor="hero-email">
              Adresse e-mail
            </label>
            <input
              id="hero-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="flex-1 rounded-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Commencer
            </button>
          </form>

          <p className="text-xs text-muted-foreground">
            Déjà membre ?{" "}
            <Link href="/login" className="font-semibold text-primary underline-offset-2 hover:underline">
              Connexion
            </Link>
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/70">
            {[
              { value: "5", label: "Piliers de discernement" },
              { value: "2", label: "Offres claires" },
              { value: "UEMOA", label: "Mobile Money & carte" },
            ].map((stat) => (
              <div key={stat.label} className="pt-4">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] aspect-[4/5] sm:aspect-[5/6]">
          <div className="absolute inset-4 sm:inset-6 rounded-[1.75rem] overflow-hidden shadow-elevated border border-white/70">
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop"
              alt="Couple souriant, rencontre sérieuse"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 520px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="absolute left-0 top-[18%] flex flex-wrap gap-2 max-w-[55%]">
            {["Foi", "25–35 ans", "Afrique / diaspora"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/95 border border-border px-3 py-1 text-[11px] font-semibold text-foreground shadow-card"
              >
                {tag}
              </span>
            ))}
          </div>

          <FloatingIcon className="absolute right-2 top-[12%]" label="Compatibilité">
            <Heart className="h-4 w-4 text-primary" />
          </FloatingIcon>
          <FloatingIcon className="absolute right-8 top-[28%]" label="Localisation">
            <MapPin className="h-4 w-4 text-accent" />
          </FloatingIcon>
          <FloatingIcon className="absolute -left-1 top-[42%]" label="Confiance">
            <ThumbsUp className="h-4 w-4 text-primary" />
          </FloatingIcon>
          <FloatingIcon className="absolute right-0 bottom-[38%]" label="Discernement">
            <CalendarDays className="h-4 w-4 text-accent" />
          </FloatingIcon>

          <div className="absolute left-0 bottom-6 right-6 sm:right-auto sm:w-[68%] space-y-2">
            <MiniProfile name="Aïcha D." detail="Dakar · 92 % compatible" />
            <MiniProfile name="Samuel K." detail="Abidjan · 88 % compatible" />
          </div>

          <div className="absolute -right-1 sm:right-0 bottom-2 w-[46%] sm:w-[42%] rounded-2xl bg-primary/90 text-primary-foreground p-3.5 shadow-elevated backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/80">
                Alliance
              </p>
            </div>
            <p className="font-serif text-lg font-bold leading-none">5 000 FCFA</p>
            <p className="text-[11px] text-primary-foreground/75 mt-1">30 jours · renouvellement manuel</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FloatingIcon({
  children,
  className,
  label,
}: {
  children: React.ReactNode
  className?: string
  label: string
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-white border border-border shadow-card",
        className
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </div>
  )
}

function MiniProfile({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/95 border border-border px-3 py-2.5 shadow-card backdrop-blur-sm">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{detail}</p>
      </div>
      <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold">
        Voir
      </span>
    </div>
  )
}
