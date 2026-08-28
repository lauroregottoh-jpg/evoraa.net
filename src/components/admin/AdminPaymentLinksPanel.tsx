"use client"

import * as React from "react"
import Link from "next/link"
import {
  adminCreatePaymentLink,
  adminListPaymentLinks,
  type AdminPaymentLinkRow,
} from "@/app/actions/paymentLinks"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"

export function AdminPaymentLinksPanel({
  hasBictorys,
  hasMoneroo,
  paymentProvider,
  embedded = false,
}: {
  hasBictorys: boolean
  hasMoneroo: boolean
  paymentProvider: string
  embedded?: boolean
}) {
  const [amount, setAmount] = React.useState("5000")
  const [label, setLabel] = React.useState("")
  const [mode, setMode] = React.useState<BictorysPaymentMode>("mobile_money")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [lastLink, setLastLink] = React.useState<AdminPaymentLinkRow | null>(null)
  const [links, setLinks] = React.useState<AdminPaymentLinkRow[]>([])
  const [copied, setCopied] = React.useState<string | null>(null)

  const canPay = hasBictorys || hasMoneroo

  async function refresh() {
    const r = await adminListPaymentLinks(20)
    if (!r.error) setLinks(r.links)
  }

  React.useEffect(() => {
    void refresh()
  }, [])

  async function createLink() {
    setBusy(true)
    setError(null)
    setLastLink(null)
    try {
      const r = await adminCreatePaymentLink({
        amount: Number(amount),
        label: label || null,
        paymentMode: mode,
      })
      if (r.error) {
        setError(r.error)
        return
      }
      if (r.link) {
        setLastLink(r.link)
        await refresh()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue.")
    } finally {
      setBusy(false)
    }
  }

  async function copyUrl(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setError("Impossible de copier le lien.")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          {!embedded && (
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
              Hors plateforme — pas un produit KELIAA
            </p>
          )}
          <h2 className="font-serif text-2xl font-bold mt-1">Créer un lien de paiement</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Pour le coaching, une formation ou toute prestation en dehors de l&apos;application
            membre. Indiquez un montant, générez un lien neutre, envoyez-le à la personne. Elle paie
            le montant exact — l&apos;argent arrive sur votre compte{" "}
            <strong>{paymentProvider}</strong>. Aucun abonnement Alliance ni produit membre
            n&apos;est activé.
          </p>
          <p className="text-xs text-muted-foreground mt-2 rounded-lg border border-emerald-600/20 bg-emerald-50/80 px-3 py-2">
            Ces encaissements sont suivis à part et ne sont pas comptés dans les revenus
            plateforme.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Montant (FCFA)
            </span>
            <input
              type="number"
              min={100}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="5000"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Libellé (optionnel)
            </span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              placeholder="Ex. Séance coaching, acompte formation…"
            />
          </label>

          {hasBictorys && paymentProvider === "bictorys" && (
            <PaymentModePicker value={mode} onChange={setMode} suggested="mobile_money" />
          )}

          {!canPay && (
            <p className="text-sm text-destructive">
              Configurez Bictorys ou Moneroo côté serveur pour activer cette fonctionnalité.
            </p>
          )}

          <button
            type="button"
            disabled={busy || !canPay}
            onClick={() => void createLink()}
            className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 text-white text-sm font-bold disabled:opacity-60"
          >
            {busy ? "Création…" : "Générer le lien de paiement"}
          </button>
        </div>

        {lastLink && (
          <div className="rounded-xl border-2 border-emerald-600/30 bg-emerald-50/50 p-4 space-y-2">
            <p className="text-sm font-semibold">
              Lien créé — {lastLink.amount.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-xs text-muted-foreground break-all">{lastLink.url}</p>
            <button
              type="button"
              onClick={() => void copyUrl(lastLink.url, lastLink.id)}
              className="text-sm font-semibold text-primary underline"
            >
              {copied === lastLink.id ? "Copié ✓" : "Copier le lien"}
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {links.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold">Encaissements récents (hors plateforme)</h3>
          </div>
          <div className="divide-y divide-border max-h-80 overflow-y-auto">
            {links.map((l) => (
              <div key={l.id} className="px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {l.amount.toLocaleString("fr-FR")} FCFA
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      · {l.status === "completed" ? "Payé" : "En attente"}
                    </span>
                  </p>
                  {l.label && <p className="text-xs text-muted-foreground">{l.label}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline"
                  >
                    Ouvrir
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyUrl(l.url, l.id)}
                    className="text-xs text-primary underline"
                  >
                    {copied === l.id ? "Copié" : "Copier"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!embedded && (
        <Link href={OPS_CONSOLE_PATH} className="text-sm text-primary underline">
          ← Retour console ops
        </Link>
      )}
    </div>
  )
}
