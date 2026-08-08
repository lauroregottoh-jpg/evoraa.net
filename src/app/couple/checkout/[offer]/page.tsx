import { Suspense } from "react"
import CoupleCheckoutClient from "./CheckoutClient"
import { isCoupleDemoPricing } from "@/lib/couple/offers"

export default async function CoupleCheckoutPage({
  params,
}: {
  params: Promise<{ offer: string }>
}) {
  const { offer } = await params
  return (
    <Suspense fallback={<p className="p-8 text-sm">Chargement…</p>}>
      <CoupleCheckoutClient
        offer={offer}
        demoPricing={isCoupleDemoPricing()}
      />
    </Suspense>
  )
}
