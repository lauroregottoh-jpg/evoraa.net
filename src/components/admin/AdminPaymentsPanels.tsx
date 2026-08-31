"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionCard } from "@/components/admin/AdminShell"
import {
  adminBictorysProbe,
  adminBictorysSandboxCharge,
  type AdminOpsFlags,
} from "@/app/actions/admin"
import { isIndependentPaymentMetadata } from "@/lib/billing/adminPaymentLinks"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { bictorysPaymentModeLabel } from "@/lib/billing/bictorys"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import { ExternalLink, FlaskConical, Radio } from "lucide-react"

type PaymentRow = {
  id: string
  amount: number
  currency: string
  status: string | null
  provider: string | null
  transaction_reference: string | null
  created_at: string | null
  metadata?: unknown
}

type PaymentEventRow = {
  id: string
  paymentId: string | null
  provider: string | null
  eventType: string
  status: string | null
  message: string | null
  createdAt: string | null
}

type Run = (
  key: string,
  fn: () => Promise<{ error?: string; success?: boolean; checkoutUrl?: string }>
) => Promise<void>

function eventLabel(type: string) {
  const map: Record<string, string> = {
    charge_initiated: "Charge créée",
    charge_failed: "Échec charge",
    webhook_received: "Webhook reçu",
    webhook_ignored: "Webhook ignoré",
    payment_completed: "Paiement validé",
    payment_failed: "Paiement échoué",
    sandbox_probe: "Probe clé API",
    sandbox_test: "Test sandbox",
    admin_link_checkout: "Encaissement indépendant",
  }
  return map[type] || type
}

function paymentModeFromMeta(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null
  const mode = (metadata as { payment_mode?: string }).payment_mode
  return mode || null
}

export function PaymentsAuditPanel({
  payments,
  paymentEvents,
}: {
  payments: PaymentRow[]
  paymentEvents: PaymentEventRow[]
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <SectionCard title="Journal d'audit paiements">
        <div className="divide-y divide-border max-h-[28rem] overflow-y-auto">
          {paymentEvents.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              Aucun événement. Les charges Bictorys et webhooks apparaîtront ici.
            </p>
          )}
          {paymentEvents.map((e) => (
            <div key={e.id} className="py-3 text-sm space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{eventLabel(e.eventType)}</span>
                <span className="text-[11px] text-muted-foreground">
                  {e.createdAt ? new Date(e.createdAt).toLocaleString("fr-FR") : "—"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {e.provider && <Badge variant="outline">{e.provider}</Badge>}
                {e.status && <Badge variant="secondary">{e.status}</Badge>}
              </div>
              {e.message && (
                <p className="text-xs text-muted-foreground break-words">{e.message}</p>
              )}
              {e.paymentId && (
                <p className="text-[10px] font-mono text-muted-foreground truncate">
                  {e.paymentId}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Paiements détaillés">
        <div className="divide-y divide-border max-h-[28rem] overflow-y-auto">
          {payments.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">Aucun paiement.</p>
          )}
          {payments.map((p) => {
            const mode = paymentModeFromMeta(p.metadata)
            const independent = isIndependentPaymentMetadata(p.metadata)
            return (
              <div key={p.id} className="py-3 flex justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">
                    {p.amount.toLocaleString("fr-FR")} {p.currency}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    {p.transaction_reference || p.id}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {independent && (
                      <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-800">
                        Hors plateforme
                      </Badge>
                    )}
                    {p.provider && (
                      <Badge variant="outline" className="text-[10px]">
                        {p.provider}
                      </Badge>
                    )}
                    {mode && (
                      <Badge variant="secondary" className="text-[10px]">
                        {bictorysPaymentModeLabel(mode as BictorysPaymentMode)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="outline">{p.status || "—"}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}

export function BictorysSandboxPanel({
  ops,
  isFullAdmin,
  busy,
  run,
  setMsg,
}: {
  ops: AdminOpsFlags
  isFullAdmin: boolean
  busy: string
  run: Run
  setMsg: (m: string) => void
}) {
  const [amount, setAmount] = React.useState(17)
  const [mode, setMode] = React.useState<BictorysPaymentMode>("mobile_money")
  const [lastUrl, setLastUrl] = React.useState<string | null>(null)

  if (!ops.hasBictorys) return null

  return (
    <SectionCard title="Sandbox Bictorys">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant={ops.bictorysSandbox ? "secondary" : "outline"}>
            {ops.bictorysSandbox ? "Clé test (sandbox)" : "Clé production"}
          </Badge>
          <Badge variant="outline">Provider actif : {ops.paymentProvider}</Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          Carte test : <strong>4242 4242 4242 4242</strong> · Mobile Money OTP :{" "}
          <strong>123456</strong> · Montant <strong>13</strong> XOF = échec forcé.
        </p>
        <p className="text-xs">
          Micro-test live 17 FCFA (démo Alliance) :{" "}
          <a href={`${OPS_CONSOLE_PATH}/test-pay`} className="text-primary underline font-medium">
            page dédiée
          </a>
        </p>

        {isFullAdmin && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={busy === "bictorys-probe"}
                onClick={() =>
                  run("bictorys-probe", async () => {
                    const r = await adminBictorysProbe()
                    if (r.error) return { error: r.error }
                    setMsg(
                      `Clé Bictorys OK (${r.sandbox ? "sandbox" : "prod"}, HTTP ${r.httpStatus})`
                    )
                    return { success: true }
                  })
                }
              >
                <Radio className="h-3.5 w-3.5 mr-1.5" />
                Vérifier la clé API
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-sm space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Montant test (XOF)
                </span>
                <input
                  type="number"
                  min={13}
                  max={500000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 17)}
                  className="w-full rounded-xl border border-border px-3 py-2"
                />
              </label>
            </div>

            <PaymentModePicker
              value={mode}
              onChange={setMode}
              enabledModes={ops.bictorysPaymentModes}
            />

            <Button
              size="sm"
              disabled={busy === "bictorys-test"}
              onClick={() =>
                run("bictorys-test", async () => {
                  const r = await adminBictorysSandboxCharge({
                    amount,
                    paymentMode: mode,
                  })
                  if (r.error) return { error: r.error }
                  if (r.checkoutUrl) setLastUrl(r.checkoutUrl)
                  setMsg(`Charge sandbox créée (${r.transactionId})`)
                  return { success: true, checkoutUrl: r.checkoutUrl }
                })
              }
            >
              <FlaskConical className="h-3.5 w-3.5 mr-1.5" />
              Lancer un paiement test
            </Button>

            {lastUrl && (
              <a
                href={lastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary underline"
              >
                Ouvrir la page Bictorys
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </>
        )}

        {!isFullAdmin && (
          <p className="text-xs text-muted-foreground">
            Réservé aux administrateurs complets.
          </p>
        )}
      </div>
    </SectionCard>
  )
}
