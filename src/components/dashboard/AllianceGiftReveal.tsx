"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardList,
  Gift,
  Headphones,
  Library,
  Route,
  Sparkles,
} from "lucide-react"
import { cn } from "@/utils/cn"

const ITEMS = [
  {
    icon: ClipboardList,
    title: "Rapport Personnalisé",
    href: "/rapport/global",
    dx: "-42%",
    dy: "-58%",
  },
  {
    icon: Sparkles,
    title: "Tests débloqués",
    href: "/assessments",
    dx: "38%",
    dy: "-52%",
  },
  {
    icon: Library,
    title: "Coffre Premium",
    href: "/coffre-premium",
    dx: "-48%",
    dy: "8%",
  },
  {
    icon: Headphones,
    title: "Support humain",
    href: "/coaching",
    dx: "42%",
    dy: "12%",
  },
  {
    icon: Route,
    title: "Parcours guidé",
    href: "/alliance/parcours",
    dx: "0%",
    dy: "55%",
  },
] as const

/** Grand coffret animé — tourne en boucle avant la carte membre. */
export function AllianceGiftReveal({ firstName }: { firstName: string }) {
  const name = firstName.trim() || "Membre"
  const [phase, setPhase] = React.useState<"closed" | "open" | "burst">(
    "closed"
  )
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    const run = () => {
      if (cancelled) return
      setPhase("closed")
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase("open")
          timers.push(
            window.setTimeout(() => {
              if (cancelled) return
              setPhase("burst")
              timers.push(
                window.setTimeout(() => {
                  if (cancelled) return
                  setCycle((c) => c + 1)
                }, 3800)
              )
            }, 1100)
          )
        }, 900)
      )
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [cycle])

  return (
    <section className="relative z-10 overflow-hidden rounded-[1.85rem] border-2 border-[#B8954A]/55 bg-gradient-to-br from-[#120f10] via-[#2A1810] to-[#7F5557] text-[#F5EDE0] px-4 py-10 sm:px-8 sm:py-12 shadow-elevated min-h-[28rem] sm:min-h-[32rem]">
      <div
        aria-hidden
        className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8954A]/25 blur-3xl"
      />

      <div className="relative z-10 text-center space-y-2 mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D4AF72]">
          Votre coffret Alliance
        </p>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
          {name}, regardez ce qui s’ouvre
        </h2>
        <p className="text-sm text-white/65 max-w-md mx-auto">
          Animation en boucle — chaque cadeau est une fonctionnalité que vous
          venez de débloquer.
        </p>
      </div>

      <div className="relative z-10 mx-auto h-56 sm:h-64 w-full max-w-lg">
        {/* Labels qui sortent du coffret */}
        {ITEMS.map((item, i) => {
          const Icon = item.icon
          const show = phase === "burst"
          return (
            <Link
              key={`${cycle}-${item.title}`}
              href={item.href}
              className={cn(
                "absolute left-1/2 top-1/2 z-30 flex items-center gap-2 rounded-xl border border-[#B8954A]/45 bg-[#7F5557]/95 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-700",
                show
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50 pointer-events-none"
              )}
              style={{
                transform: show
                  ? `translate(calc(-50% + ${item.dx}), calc(-50% + ${item.dy}))`
                  : "translate(-50%, -50%)",
                transitionDelay: show ? `${i * 90}ms` : "0ms",
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8954A]/25 text-[#D4AF72]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold whitespace-nowrap text-[#F5EDE0]">
                {item.title}
              </span>
            </Link>
          )
        })}

        {/* Grand coffret au centre */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-700",
            phase === "open" && "scale-110",
            phase === "burst" && "scale-105"
          )}
        >
          {/* Couvercle */}
          <div
            className={cn(
              "relative mx-auto h-14 w-44 sm:h-16 sm:w-52 rounded-t-2xl border-2 border-[#D4AF72]/70 bg-gradient-to-b from-[#E8C56A] to-[#B8954A] shadow-xl origin-bottom transition-transform duration-700 ease-out",
              phase !== "closed" && "-translate-y-14 -rotate-[18deg]"
            )}
          >
            <div className="absolute left-1/2 top-1/2 h-4 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FDFBF7]/40" />
            <div className="absolute -bottom-1 left-1/2 h-3 w-8 -translate-x-1/2 rounded-sm bg-[#8A6B2E]" />
          </div>
          {/* Corps */}
          <div className="relative mx-auto -mt-1 flex h-28 w-44 sm:h-32 sm:w-52 items-center justify-center rounded-b-2xl border-2 border-[#B8954A]/80 bg-gradient-to-b from-[#C9A227] to-[#7A5F28] shadow-[0_20px_50px_-12px_rgba(215,184,102,0.85)]">
            <div className="absolute inset-x-3 top-3 h-1 rounded-full bg-[#D4AF72]/35" />
            <Gift
              className={cn(
                "h-12 w-12 text-[#7F5557] transition-all duration-500",
                phase === "burst" && "scale-90 opacity-50"
              )}
            />
            <div className="absolute inset-x-6 bottom-4 h-2 rounded-full bg-[#7F5557]/15" />
          </div>
        </div>

        {/* Confettis */}
        {phase === "burst"
          ? Array.from({ length: 18 }).map((_, i) => (
              <span
                key={`c-${cycle}-${i}`}
                className="alliance-gift-confetti absolute left-1/2 top-1/2 rounded-[2px]"
                style={{
                  width: 5 + (i % 4) * 2,
                  height: 7 + (i % 3) * 2,
                  background:
                    i % 3 === 0
                      ? "#D4AF37"
                      : i % 3 === 1
                        ? "#FDFBF7"
                        : "#722F37",
                  animationDelay: `${(i % 8) * 0.04}s`,
                  ["--dx" as string]: `${-50 + (i % 11) * 10}px`,
                }}
              />
            ))
          : null}
      </div>
    </section>
  )
}
