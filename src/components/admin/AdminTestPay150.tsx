"use client"

import * as React from "react"
import { adminBictorysSandboxCharge } from "@/app/actions/admin"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import Link from "next/link"

/** Micro-paiement démo Alliance (live). */
export const ALLIANCE_DEMO_AMOUNT_XOF = 17
/** Plancher souvent imposé par Bictorys en live. */
const FALLBACK_AMOUNT_XOF = 100

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
  const [info, setInfo] = React.useState<string | null>(null)

  async function pay(amount: number) {
    setBusy(true)
    setError(null)
    setInfo(null)
    try {
      const r = await adminBictorysSandboxCharge({
        amount,
        paymentMode: mode,
      })
      if (r.error) {
        const low =
          amount < FALLBACK_AMOUNT_XOF &&
          /amount|montant|minimum|min/i.test(r.error)
        if (low) {
          setInfo(
            `Bictorys a refusé ${amount} FCFA. Nouvelle tentative à ${FALLBACK_AMOUNT_XOF} FCFA…`
          )
          const r2 = await adminBictorysSandboxCharge({
            amount: FALLBACK_AMOUNT_XOF,
            paymentMode: mode,
          })
          if (r2.error) {
            setError(r2.error)
            return
          }
          if (r2.checkoutUrl) {
            window.location.href = r2.checkoutUrl
            return
          }
        }
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
          Micro-paiement <strong>live</strong> via Bictorys pour valider webhook + activation
          Alliance sur <strong>ce compte</strong> (celui avec lequel vous êtes connecté).
        </p>
      </div>

      <ol className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
        <li>Restez connecté avec votre compte OPS.</li>
        <li>Choisissez Mobile Money ou carte.</li>
        <li>Cliquez payer → finalisez sur Bictorys.</li>
        <li>Au retour, Alliance doit être active sur ce compte.</li>
      </ol>

      <div className="rounded-xl border border-border px-4 py-3 text-sm space-y-1">
        <p>
          Montant cible : <strong>{ALLIANCE_DEMO_AMOUNT_XOF} FCFA</strong>
          <span className="text-muted-foreground text-xs">
            {" "}
            (repli auto {FALLBACK_AMOUNT_XOF} si Bictorys refuse)
          </span>
        </p>
        <p>
          Provider : <strong>{paymentProvider}</strong>
          {demoMode ? (
            <span className="text-amber-700"> · PAYMENTS_DEMO_MODE=ON (ce test live marche quand même)</span>
          ) : (
            " · live"
          )}
        </p>
        {!hasBictorys && (
          <p className="text-destructive text-xs">BICTORYS_API_KEY manquant côté serveur.</p>
        )}
      </div>

      <PaymentModePicker value={mode} onChange={setMode} suggested="mobile_money" />

      <button
        type="button"
        disabled={busy || !hasBictorys}
        onClick={() => void pay(ALLIANCE_DEMO_AMOUNT_XOF)}
        className="w-full inline-flex items-center justify-center rounded-xl bg-accent text-accent-foreground h-12 px-6 text-sm font-bold hover:brightness-95 disabled:opacity-60"
      >
        {busy ? "Redirection Bictorys…" : `Payer ${ALLIANCE_DEMO_AMOUNT_XOF} FCFA — Alliance`}
      </button>

      <button
        type="button"
        disabled={busy || !hasBictorys}
        onClick={() => void pay(FALLBACK_AMOUNT_XOF)}
        className="w-full inline-flex items-center justify-center rounded-xl border border-border h-11 px-6 text-sm font-semibold hover:bg-secondary/50 disabled:opacity-60"
      >
        Ou payer {FALLBACK_AMOUNT_XOF} FCFA (si 17 refuse)
      </button>

      {info && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {info}
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive break-words rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2">
          {error}
        </p>
      )}

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Après paiement réussi : Alliance active sur <em>ce</em> compte. Pas besoin d’un autre
        profil.
      </p>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href={OPS_CONSOLE_PATH} className="text-primary underline">
          ← Console ops
        </Link>
        <Link href={`${OPS_CONSOLE_PATH}/rapport-demo`} className="text-primary underline">
          Voir le rapport démo
        </Link>
      </div>
    </div>
  )
}
