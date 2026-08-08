"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  COUPLE_DEMO_AMOUNT_XOF,
  COUPLE_OFFERS,
  getCoupleChargeAmountXof,
  type CoupleOfferId,
} from "@/lib/couple/offers"
import { startCoupleCheckoutAction } from "@/app/actions/couple"
import { cn } from "@/utils/cn"

type Props = {
  /** Calculé côté serveur (env non exposée au client). */
  demoPricing: boolean
}

export function CoupleOfferPicker({ demoPricing }: Props) {
  const router = useRouter()
  const [loading, setLoading] = React.useState<CoupleOfferId | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const buy = async (offerId: CoupleOfferId) => {
    setLoading(offerId)
    setError(null)
    const res = await startCoupleCheckoutAction({ offerId })
    setLoading(null)
    if (res.requiresAuth && res.checkoutPath) {
      router.push(res.checkoutPath)
      return
    }
    if (res.error) {
      setError(res.error)
      return
    }
    if (res.checkoutPath) {
      if (res.checkoutPath.startsWith("http")) {
        window.location.href = res.checkoutPath
      } else {
        router.push(res.checkoutPath)
      }
    }
  }

  return (
    <div className="space-y-6">
      {demoPricing && (
        <div className="rounded-xl border border-accent/35 bg-accent/10 px-4 py-3 text-sm text-foreground">
          <p className="font-semibold">Mode démo — {COUPLE_DEMO_AMOUNT_XOF} FCFA</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Essentiel et Premium Plus sont facturés {COUPLE_DEMO_AMOUNT_XOF}{" "}
            FCFA pour vivre tout le parcours (onboarding, invitation,
            questionnaires, rapport). Les prix catalogue restent affichés barrés.
          </p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {(Object.keys(COUPLE_OFFERS) as CoupleOfferId[]).map((id) => {
          const offer = COUPLE_OFFERS[id]
          const charge = demoPricing
            ? COUPLE_DEMO_AMOUNT_XOF
            : getCoupleChargeAmountXof(offer)
          return (
            <article
              key={id}
              className={cn(
                "rounded-2xl border p-5 sm:p-6 flex flex-col gap-4 bg-white/90",
                offer.popular
                  ? "border-accent/40 shadow-card"
                  : "border-border/70"
              )}
            >
              {offer.popular && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Le plus choisi
                </span>
              )}
              <div>
                <h2 className="font-serif text-2xl font-bold">{offer.marketingName}</h2>
                <p className="mt-1 font-serif text-3xl font-bold text-primary">
                  {charge.toLocaleString("fr-FR")}{" "}
                  <span className="text-base font-sans font-medium text-muted-foreground">
                    FCFA
                  </span>
                </p>
                {demoPricing && charge !== offer.amountXof && (
                  <p className="text-xs text-muted-foreground line-through">
                    {offer.amountXof.toLocaleString("fr-FR")} FCFA
                  </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {offer.description}
                </p>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground/90">
                {offer.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={loading !== null}
                onClick={() => buy(id)}
                className="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
              >
                {loading === id
                  ? "Préparation…"
                  : demoPricing
                    ? `Tester à ${COUPLE_DEMO_AMOUNT_XOF} FCFA`
                    : "Choisir cette offre"}
              </button>
            </article>
          )
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Le prix couvre le bilan de couple (deux participants).{" "}
        <Link href="/couple" className="underline">
          Retour
        </Link>
      </p>
    </div>
  )
}
