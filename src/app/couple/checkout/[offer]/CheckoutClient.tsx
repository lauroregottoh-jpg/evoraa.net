"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { confirmCoupleDemoPaymentAction } from "@/app/actions/couple"
import { CoupleCheckoutPanel } from "@/components/couple/CoupleCheckoutPanel"
import { COUPLE_DEMO_AMOUNT_XOF, getCoupleOffer } from "@/lib/couple/offers"
import type { CoupleOfferId } from "@/lib/couple/offers"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { parseBictorysPaymentMode } from "@/lib/billing/bictorys"

export default function CoupleCheckoutClient({
  offer,
  demoPricing,
  showModePicker,
  suggestedMode,
}: {
  offer: string
  demoPricing: boolean
  showModePicker: boolean
  suggestedMode: BictorysPaymentMode
}) {
  const search = useSearchParams()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const paymentId = search.get("paymentId")
  const isDemo = search.get("demo") === "1"
  const autostart = search.get("autostart") === "1"
  const modeFromQuery = parseBictorysPaymentMode(search.get("mode"))
  const codeFromQuery = search.get("code") || ""

  const offerMeta = getCoupleOffer(offer)
  const offerId: CoupleOfferId =
    offerMeta?.id ?? "couple_essential"

  const confirm = async () => {
    if (!paymentId) {
      setError("Paiement manquant.")
      return
    }
    setLoading(true)
    const res = await confirmCoupleDemoPaymentAction(paymentId)
    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    const q = new URLSearchParams()
    if (res.inviteCode) q.set("inviteCode", res.inviteCode)
    if (res.inviteToken) q.set("inviteToken", res.inviteToken)
    const suffix = q.toString() ? `?${q.toString()}` : ""
    router.push(`/couple/confirmation${suffix}`)
  }

  if (isDemo && paymentId) {
    return (
      <div className="max-w-lg mx-auto space-y-4 py-10 px-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C1412]">
          Confirmation démo
        </h1>
        <p className="text-sm text-[#1C1412]/70 leading-relaxed">
          Offre :{" "}
          <span className="font-medium text-[#1C1412]">
            {offerMeta?.marketingName ?? offer}
          </span>
          {demoPricing ? (
            <>
              {" "}
              ·{" "}
              <span className="font-semibold text-[#5C1F28]">
                {COUPLE_DEMO_AMOUNT_XOF} FCFA (démo)
              </span>
            </>
          ) : null}
        </p>
        <p className="text-sm leading-relaxed text-[#1C1412]/80">
          Confirmez pour activer votre bilan couple et accéder à l’onboarding /
          espace de travail.
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => void confirm()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#5C1F28] text-white px-5 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Confirmation…" : "Confirmer et ouvrir mon espace couple"}
        </button>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Link href="/couple/offre" className="text-sm font-semibold text-[#5C1F28]">
          ← Retour aux offres
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-6 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C1F28]">
          KELYA Couple
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#1C1412]">
          Paiement du bilan
        </h1>
        <p className="text-sm text-[#1C1412]/65">
          Mobile Money ou carte — sans passer par l’espace membre.
        </p>
      </div>
      <CoupleCheckoutPanel
        demoPricing={demoPricing}
        showModePicker={showModePicker}
        suggestedMode={suggestedMode}
        initialOfferId={offerId}
        initialPaymentMode={modeFromQuery ?? undefined}
        initialPromoCode={codeFromQuery}
        autostart={autostart && !isDemo}
      />
    </div>
  )
}
