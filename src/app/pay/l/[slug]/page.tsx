import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPaymentLinkPublic } from "@/app/actions/paymentLinks"
import { PaymentLinkCheckout } from "@/components/billing/PaymentLinkCheckout"
import { resolveLiveProvider } from "@/lib/billing/provider"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Paiement",
  description: "Page de paiement sécurisée.",
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ paid?: string; cancel?: string }>
}

export default async function PublicPaymentLinkPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const result = await getPaymentLinkPublic(slug)

  if (result.error || !result.link) {
    notFound()
  }

  return (
    <PaymentLinkCheckout
      slug={result.link.slug}
      amount={result.link.amount}
      currency={result.link.currency}
      label={result.link.label}
      status={result.link.status}
      paid={sp.paid === "1"}
      cancelled={sp.cancel === "1"}
      provider={resolveLiveProvider()}
    />
  )
}
