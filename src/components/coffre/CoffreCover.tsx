"use client"

import { COFFRE_CATEGORY_META, type CoffreResource } from "@/lib/coffre/resources"
import { cn } from "@/utils/cn"

type Props = {
  resource: CoffreResource
  locked?: boolean
  className?: string
}

/** Couverture typographique — bibliothèque haut de gamme, sans image stock. */
export function CoffreCover({ resource, locked, className }: Props) {
  const meta = COFFRE_CATEGORY_META[resource.category]

  if (resource.coverImage) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-t-[1.1rem]",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resource.coverImage}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
            locked && "opacity-70 saturate-[0.75]"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-t-[1.1rem]",
        className
      )}
      style={{
        background: `linear-gradient(155deg, ${meta.tone} 0%, #1C1412 78%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(248,244,238,0.45), transparent 45%), radial-gradient(circle at 85% 80%, rgba(184,149,74,0.35), transparent 40%)",
        }}
      />
      <div
        className="absolute inset-3 rounded-[0.85rem] border border-white/15"
        aria-hidden
      />
      <div className="absolute top-5 left-5 right-5">
        <span
          className="inline-flex text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-white/25 bg-white/10"
          style={{ color: meta.ink }}
        >
          {meta.label}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 bg-gradient-to-t from-black/50 to-transparent">
        <p
          className={cn(
            "font-serif text-[1.15rem] sm:text-xl font-semibold leading-snug line-clamp-4",
            locked && "opacity-80"
          )}
          style={{ color: meta.ink }}
        >
          {resource.title}
        </p>
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[18%] opacity-[0.07] font-serif text-7xl font-bold select-none"
        style={{ color: meta.ink }}
        aria-hidden
      >
        {String(resource.unlockOrder).padStart(2, "0")}
      </div>
    </div>
  )
}
