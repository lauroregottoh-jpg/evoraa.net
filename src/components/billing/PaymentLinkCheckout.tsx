"use client"

import * as React from "react"
import { startPaymentLinkCheckout } from "@/app/actions/paymentLinks"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"

export function PaymentLinkCheckout({
  slug,
  amount,
  currency,
  label,
  status,
  paid,
  cancelled,
  provider,
}: {
  slug: string
  amount: number
  currency: string
  label: string | null
  status: string
  paid?: boolean
  cancelled?: boolean
  provider: string
}) {
  const [mode, setMode] = React.useState<BictorysPaymentMode>("mobile_money")
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [polling, setPolling] = React.useState(Boolean(paid))

  const completed = status === "completed"

  React.useEffect(() => {
    if (!polling || completed) return
    const t = setInterval(() => {
      window.location.reload()
    }, 4000)
    return () => clearInterval(t)
  }, [polling, completed])

  async function pay() {
    setBusy(true)
    setError(null)
    try {
      const r = await startPaymentLinkCheckout({
        slug,
        paymentMode: mode,
        customerEmail: email || null,
        customerName: name || null,
      })
      if (r.error) {
        setError(r.error)
        return
      }
      if (r.checkoutUrl) {
        window.location.href = r.checkoutUrl
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue.")
    } finally {
      setBusy(false)
    }
  }

  if (completed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-100">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center space-y-3">
          <h1 className="text-xl font-semibold text-neutral-900">Paiement confirmé</h1>
          <p className="text-sm text-neutral-600">
            {amount.toLocaleString("fr-FR")} {currency} — merci, votre paiement a bien été reçu.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-100">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Paiement</p>
          <h1 className="text-lg font-medium text-neutral-900">
            {label || "Règlement"}
          </h1>
          <p className="text-3xl font-semibold text-neutral-900 tabular-nums">
            {amount.toLocaleString("fr-FR")}{" "}
            <span className="text-lg font-normal text-neutral-500">{currency}</span>
          </p>
        </div>

        {paid && !completed && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
            Confirmation en cours… Cette page se met à jour automatiquement.
          </p>
        )}

        {cancelled && (
          <p className="text-sm text-neutral-600 text-center">Paiement annulé. Vous pouvez réessayer.</p>
        )}

        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom (optionnel)"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optionnel)"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
          />
        </div>

        {provider === "bictorys" && (
          <PaymentModePicker value={mode} onChange={setMode} suggested="mobile_money" />
        )}

        <button
          type="button"
          disabled={busy}
          onClick={() => void pay()}
          className="w-full h-12 rounded-xl bg-neutral-900 text-white text-sm font-semibold disabled:opacity-60"
        >
          {busy ? "Redirection…" : `Payer ${amount.toLocaleString("fr-FR")} ${currency}`}
        </button>

        {error && (
          <p className="text-sm text-red-600 text-center break-words">{error}</p>
        )}

        <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
          Paiement sécurisé via {provider === "moneroo" ? "Moneroo" : "Bictorys"}.
        </p>
      </div>
    </main>
  )
}
