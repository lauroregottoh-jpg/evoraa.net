"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  COACHING_PACKS,
  COACHING_SESSION_MINUTES,
  type CoachingPackId,
} from "@/lib/billing/coachingOffers"
import { startCoachingCheckoutAction } from "@/app/actions/coaching"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { cn } from "@/utils/cn"

export function CoachingCheckoutPanel({
  suggestedMode = "mobile_money",
  moduleId,
  moduleTitle,
}: {
  suggestedMode?: BictorysPaymentMode
  moduleId?: string | null
  moduleTitle?: string | null
}) {
  const router = useRouter()
  const [packId, setPackId] = React.useState<CoachingPackId>("c4")
  const [mode, setMode] = React.useState<BictorysPaymentMode>(suggestedMode)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setMode(suggestedMode)
  }, [suggestedMode])

  const selected = COACHING_PACKS.find((p) => p.id === packId) || COACHING_PACKS[0]

  const pay = async () => {
    setLoading(true)
    setError("")
    try {
      const r = await startCoachingCheckoutAction({
        packId,
        paymentMode: mode,
        moduleId,
        moduleTitle,
      })
      if (r.error) {
        setError(r.error)
        if (r.checkoutPath?.startsWith("/login")) router.push(r.checkoutPath)
        return
      }
      if (r.checkoutPath) {
        if (r.checkoutPath.startsWith("http")) {
          window.location.href = r.checkoutPath
        } else {
          router.push(r.checkoutPath)
        }
        return
      }
      setError("URL de paiement manquante.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-5">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold">Choisir votre pack</h2>
        <p className="text-sm text-muted-foreground">
          Séances de <strong>{COACHING_SESSION_MINUTES} minutes</strong> (visio ou téléphone).
          Petits avantages sur les packs — pas de casse de prix.
        </p>
      </div>

      <div className="space-y-2">
        {COACHING_PACKS.map((p) => {
          const active = p.id === packId
          const saved = p.listXof - p.amountXof
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPackId(p.id)}
              className={cn(
                "w-full text-left rounded-xl border px-4 py-3 transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/30",
                p.popular && !active && "border-accent/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {p.label}
                    {p.popular ? (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-accent font-bold">
                        Populaire
                      </span>
                    ) : null}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{p.hint}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">
                    {p.amountXof.toLocaleString("fr-FR")} FCFA
                  </p>
                  {saved > 0 ? (
                    <p className="text-[10px] text-muted-foreground">
                      <span className="line-through">
                        {p.listXof.toLocaleString("fr-FR")}
                      </span>{" "}
                      · −{saved.toLocaleString("fr-FR")}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <PaymentModePicker value={mode} onChange={setMode} suggested={suggestedMode} />

      <button
        type="button"
        disabled={loading}
        onClick={() => void pay()}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
      >
        {loading
          ? "Redirection…"
          : `Payer ${selected.amountXof.toLocaleString("fr-FR")} FCFA`}
      </button>

      {error ? (
        <p className="text-sm text-destructive break-words">{error}</p>
      ) : null}

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Après paiement, un formulaire s’ouvre pour vos coordonnées et disponibilités.
        Le coaching n’est pas inclus dans Alliance.
      </p>
    </section>
  )
}
