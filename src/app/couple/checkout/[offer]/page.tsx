import { Suspense } from "react"
import CoupleCheckoutClient from "./CheckoutClient"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { isCoupleDemoPricing, getCoupleOffer } from "@/lib/couple/offers"
import { getBictorysEnabledPaymentModes } from "@/lib/billing/bictorys"
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
  const enabledPaymentModes =
    provider === "bictorys" ? getBictorysEnabledPaymentModes() : []
  const showModePicker =
    provider === "bictorys" && !demoMode && enabledPaymentModes.length > 1

  return (
    <MemberPage dense contentWidth="wide">
      <CoupleShell activeHref="/couple/offre" showWelcome={false} variant="sales">
        <Suspense
          fallback={
            <p className="p-8 text-sm text-[#7F5557]/60">Chargement…</p>
          }
        >
          <CoupleCheckoutClient
            offer={offer}
            demoPricing={isCoupleDemoPricing()}
            showModePicker={showModePicker}
            suggestedMode="mobile_money"
            enabledPaymentModes={enabledPaymentModes}
          />
        </Suspense>
      </CoupleShell>
    </MemberPage>
  )
}
