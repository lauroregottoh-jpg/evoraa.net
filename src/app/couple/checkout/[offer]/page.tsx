import { Suspense } from "react"
import CoupleCheckoutClient from "./CheckoutClient"
import { CinematicLayout } from "@/components/layout/CinematicLayout"
import { isCoupleDemoPricing, getCoupleOffer } from "@/lib/couple/offers"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"
import { notFound } from "next/navigation"
import { COUPLE_BRAND } from "@/lib/couple/config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ offer: string }>
}) {
  const { offer } = await params
  const meta = getCoupleOffer(offer)
  return {
    title: meta
      ? `Payer ${meta.marketingName} | ${COUPLE_BRAND}`
      : `Paiement | ${COUPLE_BRAND}`,
  }
}

export default async function CoupleCheckoutPage({
  params,
}: {
  params: Promise<{ offer: string }>
}) {
  const { offer } = await params
  if (!getCoupleOffer(offer)) notFound()

  const provider = resolveLiveProvider()
  const demoMode = isDemoPaymentsEnv()
  const showModePicker = provider === "bictorys" && !demoMode

  return (
    <CinematicLayout>
      <div className="bg-[#FBF9F6] min-h-[70vh]">
        <Suspense
          fallback={
            <p className="p-8 text-sm text-[#1C1412]/60">Chargement…</p>
          }
        >
          <CoupleCheckoutClient
            offer={offer}
            demoPricing={isCoupleDemoPricing()}
            showModePicker={showModePicker}
            suggestedMode="mobile_money"
          />
        </Suspense>
      </div>
    </CinematicLayout>
  )
}
