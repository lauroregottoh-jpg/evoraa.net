import { cn } from "@/utils/cn"
import { LANDING_PRICE_DISPLAY } from "@/lib/couple/landingCopy"
import type { CoupleOfferId } from "@/lib/couple/offers"

function fmt(n: number) {
  return n.toLocaleString("fr-FR")
}

/** Prix doc : barré + par personne + total couple — contraste fort. */
export function CoupleOfferPrice({
  offerId,
  className,
}: {
  offerId: CoupleOfferId
  className?: string
}) {
  const p = LANDING_PRICE_DISPLAY[offerId]

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-base text-[#1C1412]/55 line-through">
        {fmt(p.compareAtXof)} FCFA
      </p>
      <p className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412]">
        <span className="text-primary">{fmt(p.coupleTotalXof)} FCFA</span>
        <span className="ml-2 text-base font-sans font-medium text-[#1C1412]">
          pour vous deux
        </span>
      </p>
      <p className="text-base sm:text-lg font-semibold text-[#1C1412]">
        soit {fmt(p.perPersonXof)} FCFA par personne
      </p>
    </div>
  )
}
