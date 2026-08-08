"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CoupleCheckoutPanel } from "@/components/couple/CoupleCheckoutPanel"
import { getCoupleOffer, type CoupleOfferId } from "@/lib/couple/offers"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"

export function CoupleOffreCheckout({
  demoPricing,
  showModePicker,
  suggestedMode,
}: {
  demoPricing: boolean
  showModePicker: boolean
  suggestedMode: BictorysPaymentMode
}) {
  return (
    <Suspense fallback={<p className="text-sm text-[#1C1412]/60">Chargement…</p>}>
      <Inner
        demoPricing={demoPricing}
        showModePicker={showModePicker}
        suggestedMode={suggestedMode}
      />
    </Suspense>
  )
}

function Inner({
  demoPricing,
  showModePicker,
  suggestedMode,
}: {
  demoPricing: boolean
  showModePicker: boolean
  suggestedMode: BictorysPaymentMode
}) {
  const search = useSearchParams()
  const raw = search.get("offer")
  const offer = getCoupleOffer(raw || "")
  const initialOfferId: CoupleOfferId = offer?.id ?? "couple_essential"

  return (
    <CoupleCheckoutPanel
      demoPricing={demoPricing}
      showModePicker={showModePicker}
      suggestedMode={suggestedMode}
      initialOfferId={initialOfferId}
    />
  )
}
