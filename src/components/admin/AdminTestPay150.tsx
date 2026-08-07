"use client"

import * as React from "react"
import { adminBictorysSandboxCharge } from "@/app/actions/admin"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import Link from "next/link"

/** Micro-paiement démo Alliance (live) — visible dans l’onglet Alliance admin. */
export const ALLIANCE_DEMO_AMOUNT_XOF = 17

export function AdminTestPay150({
  demoMode,
  hasBictorys,
  paymentProvider,
}: {
  demoMode: boolean
  hasBictorys: boolean
  paymentProvider: string
}) {
  const [mode, setMode] = React.useState<BictorysPaymentMode>("mobile_money")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function pay() {
    setBusy(true)
    setError(null)
    try {
      const r = await adminBictorysSandboxCharge({
        amount: ALLIANCE_DEMO_AMOUNT_XOF,
        paymentMode: mode,
      })
      if (r.error) {
        setError(r.error)
        return
      }
      if (r.checkoutUrl) {
        window.location.href = r.checkoutUrl
        return
      }
      setError("Charge créée mais aucune URL Bictorys reçue.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Démo Alliance · admin seulement
        </p>
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Payer {ALLIANCE_DEMO_AMOUNT_XOF} FCFA
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Micro-paiement live via Bictorys pour valider webhook + activation Alliance sur{" "}
          <strong>ce compte admin</strong>.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm space-y-1">
        <p>
          Montant : <strong>{ALLIANCE_DEMO_AMOUNT_XOF} FCFA</strong>
        </p>
        <p>
          Provider : <strong>{paymentProvider}</strong>
          {demoMode ? " · ⚠ demo encore ON" : " · live"}
        </p>
        {!hasBictorys && (
          <p className="text-destructive text-xs">BICTORYS_API_KEY manquant côté serveur.</p>
        )}
      </div>

      <PaymentModePicker value={mode} onChange={setMode} suggested="mobile_money" />

      <button
        type="button"
        disabled={busy || !hasBictorys || demoMode}
        onClick={() => void pay()}
        className="w-full inline-flex items-center justify-center rounded-xl bg-accent text-accent-foreground h-12 px-6 text-sm font-bold hover:brightness-95 disabled:opacity-60"
      >
        {busy ? "Redirection Bictorys…" : `Payer ${ALLIANCE_DEMO_AMOUNT_XOF} FCFA — Alliance`}
      </button>

      {demoMode && (
        <p className="text-xs text-destructive">
          `PAYMENTS_DEMO_MODE` est true — passe-le à false puis redeploy avant ce test.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive break-words rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2">
          {error}
        </p>
      )}

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Après paiement réussi : Alliance active sur ce compte. Échec forcé sandbox : montant 13
        XOF.
      </p>

      <Link href={OPS_CONSOLE_PATH} className="text-sm text-primary underline inline-block">
        ← Retour console ops
      </Link>
    </div>
  )
}
