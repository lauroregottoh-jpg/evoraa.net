"use client"

import * as React from "react"
import { cn } from "@/utils/cn"

type Orb = {
  left: string
  size: number
  delay: string
  duration: string
  opacity: number
  tone: "ivory" | "gold" | "burgundy" | "soft"
}

/** Soft floating “snowball” orbs — light CSS particles for brand atmosphere. */
export function AmbientSnowOrbs({
  className,
  density = "normal",
  variant = "light",
}: {
  className?: string
  density?: "soft" | "normal" | "rich"
  variant?: "light" | "dark"
}) {
  const count = density === "soft" ? 18 : density === "rich" ? 42 : 28

  const orbs = React.useMemo(() => {
    const tones: Orb["tone"][] = ["ivory", "gold", "burgundy", "soft"]
    return Array.from({ length: count }, (_, i) => {
      const size = 4 + ((i * 7) % 14)
      return {
        left: `${(i * 37 + 11) % 100}%`,
        size,
        delay: `${-((i * 1.3) % 12)}s`,
        duration: `${10 + (i % 9)}s`,
        opacity: variant === "dark" ? 0.22 + (i % 5) * 0.05 : 0.35 + (i % 5) * 0.08,
        tone: tones[i % tones.length],
      } satisfies Orb
    })
  }, [count, variant])

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {orbs.map((orb, i) => (
        <span
          key={i}
          className={cn(
            "ambient-snow-orb absolute rounded-full blur-[0.5px]",
            orb.tone === "ivory" && "bg-[#FDFBF7]",
            orb.tone === "gold" && "bg-[#D4AF37]",
            orb.tone === "burgundy" && "bg-[#722F37]",
            orb.tone === "soft" && "bg-[#E8D5A3]"
          )}
          style={{
            left: orb.left,
            width: orb.size,
            height: orb.size,
            opacity: orb.opacity,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
            top: `-${orb.size}px`,
            boxShadow:
              variant === "dark"
                ? `0 0 ${orb.size * 1.2}px rgba(212,175,55,0.25)`
                : `0 0 ${orb.size}px rgba(253,251,247,0.8)`,
          }}
        />
      ))}
    </div>
  )
}
