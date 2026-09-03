"use client"

import * as React from "react"
import { Crown } from "lucide-react"
import { COFFRE_CATEGORY_META, type CoffreResource } from "@/lib/coffre/resources"
import { cn } from "@/utils/cn"

type Props = {
  resource: CoffreResource
  locked?: boolean
  className?: string
}

/** Vignette premium — couverture image ou typographique haut de gamme. */
export function CoffreCover({ resource, locked, className }: Props) {
  const meta = COFFRE_CATEGORY_META[resource.category]
  const [imgFailed, setImgFailed] = React.useState(false)
  const showImage = Boolean(resource.coverImage) && !imgFailed

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-t-[1.1rem]",
        className
      )}
      style={
        showImage
          ? undefined
          : {
              background: `linear-gradient(155deg, ${meta.tone} 0%, #7F5557 78%)`,
            }
      }
    >
      {showImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resource.coverImage}
            alt=""
            onError={() => setImgFailed(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
              locked && "opacity-70 saturate-[0.75]"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 15%, rgba(255,253,249,0.45), transparent 45%), radial-gradient(circle at 85% 80%, rgba(215,184,102,0.35), transparent 40%)",
            }}
          />
          <div
            className="absolute inset-3 rounded-[0.85rem] border border-[#B8954A]/35"
            aria-hidden
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[18%] opacity-[0.07] font-serif text-7xl font-bold select-none"
            style={{ color: meta.ink }}
            aria-hidden
          >
            {String(resource.unlockOrder).padStart(2, "0")}
          </div>
        </>
      )}

      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border",
            showImage
              ? "border-white/30 bg-black/30 text-white"
              : "border-white/25 bg-white/10"
          )}
          style={showImage ? undefined : { color: meta.ink }}
        >
          {meta.label}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/55 bg-gradient-to-r from-[#7F5557] to-[#7A5F28] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F2EBE0] shadow-sm">
          <Crown className="h-3 w-3 text-[#D4AF72]" />
          Premium
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
        <p
          className={cn(
            "font-serif text-[1.05rem] sm:text-lg font-semibold leading-snug line-clamp-3",
            showImage ? "text-white drop-shadow-sm" : "",
            locked && "opacity-80"
          )}
          style={showImage ? undefined : { color: meta.ink }}
        >
          {resource.title}
        </p>
      </div>
    </div>
  )
}
