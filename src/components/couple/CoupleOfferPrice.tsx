import { cn } from "@/utils/cn"
import { LANDING_PRICE_DISPLAY } from "@/lib/couple/landingCopy"
import type { CoupleOfferId } from "@/lib/couple/offers"

type Tone = "light" | "dark" | "onPrimary"

function fmt(n: number) {
  return n.toLocaleString("fr-FR")
}

/** Prix doc : barré + par personne + total couple. */
export function CoupleOfferPrice({
  offerId,
  tone = "light",
  className,
}: {
  offerId: CoupleOfferId
  tone?: Tone
  className?: string
}) {
  const p = LANDING_PRICE_DISPLAY[offerId]
  const muted =
    tone === "dark"
      ? "text-white/55"
      : tone === "onPrimary"
        ? "text-white/60"
        : "text-muted-foreground"
  const strong =
    tone === "dark" || tone === "onPrimary" ? "text-white" : "text-foreground"
  const accent =
    tone === "dark" || tone === "onPrimary" ? "text-accent" : "text-primary"

  return (
    <div className={cn("space-y-1", className)}>
      <p className={cn("text-base line-through", muted)}>
        {fmt(p.compareAtXof)} FCFA
      </p>
      <p className={cn("font-serif text-3xl sm:text-4xl font-bold", strong)}>
        <span className={accent}>{fmt(p.coupleTotalXof)} FCFA</span>
        <span className={cn("ml-2 text-base font-sans font-normal", muted)}>
          pour vous deux
        </span>
      </p>
      <p className={cn("text-sm sm:text-base", muted)}>
        soit {fmt(p.perPersonXof)} FCFA par personne
      </p>
    </div>
  )
}

export function CouplePriceHint({ className }: { className?: string }) {
  const e = LANDING_PRICE_DISPLAY.couple_essential
  const p = LANDING_PRICE_DISPLAY.couple_premium_plus
  return (
    <p className={cn("text-xs sm:text-sm", className)}>
      Essentiel{" "}
      <span className="line-through opacity-60">{fmt(e.compareAtXof)}</span>{" "}
      <strong>{fmt(e.coupleTotalXof)} FCFA</strong>
      {" · "}
      Premium Plus{" "}
      <span className="line-through opacity-60">{fmt(p.compareAtXof)}</span>{" "}
      <strong>{fmt(p.coupleTotalXof)} FCFA</strong>
      {" — pour vous deux"}
    </p>
  )
}
