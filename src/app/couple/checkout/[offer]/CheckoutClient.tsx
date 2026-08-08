"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { confirmCoupleDemoPaymentAction } from "@/app/actions/couple"
import { MemberPage } from "@/components/layout/MemberPage"
import { COUPLE_DEMO_AMOUNT_XOF } from "@/lib/couple/offers"

export default function CoupleCheckoutClient({
  offer,
  demoPricing,
}: {
  offer: string
  demoPricing: boolean
}) {
  const search = useSearchParams()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const paymentId = search.get("paymentId")
  const isDemo = search.get("demo") === "1"

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
    const q = res.inviteToken
      ? `?inviteToken=${encodeURIComponent(res.inviteToken)}`
      : ""
    router.push(`/couple/confirmation${q}`)
  }

  return (
    <MemberPage>
      <div className="max-w-lg mx-auto space-y-4 py-10">
        <h1 className="font-serif text-3xl font-bold">Paiement du bilan</h1>
        <p className="text-sm text-muted-foreground">
          Offre : <span className="font-medium text-foreground">{offer}</span>
          {demoPricing ? (
            <>
              {" "}
              ·{" "}
              <span className="font-semibold text-primary">
                {COUPLE_DEMO_AMOUNT_XOF} FCFA (démo)
              </span>
            </>
          ) : null}
        </p>
        {isDemo ? (
          <>
            <p className="text-sm leading-relaxed">
              Mode démo activé — confirmez le paiement de{" "}
              {COUPLE_DEMO_AMOUNT_XOF} FCFA pour créer votre couple et obtenir
              l’invitation partenaire. Vous pourrez ensuite tester Essentiel ou
              Premium Plus selon l’offre choisie.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={confirm}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold disabled:opacity-60"
            >
              {loading
                ? "Confirmation…"
                : `Confirmer ${COUPLE_DEMO_AMOUNT_XOF} FCFA (démo)`}
            </button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Finalisez le paiement via le prestataire, puis revenez à la
            confirmation.
          </p>
        )}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </MemberPage>
  )
}
