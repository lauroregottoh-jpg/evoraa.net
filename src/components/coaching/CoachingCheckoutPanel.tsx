"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  COACHING_DURATIONS,
  getCoachingPacks,
  type CoachingDurationMinutes,
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
  const [minutes, setMinutes] = React.useState<CoachingDurationMinutes>(30)
  const [packId, setPackId] = React.useState<CoachingPackId>("c4")
  const [mode, setMode] = React.useState<BictorysPaymentMode>(suggestedMode)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const packs = React.useMemo(() => getCoachingPacks(minutes), [minutes])
  const selected = packs.find((p) => p.id === packId) || packs[0]

  React.useEffect(() => {
    setMode(suggestedMode)
  }, [suggestedMode])

  const pay = async () => {
    setLoading(true)
    setError("")
    try {
      const r = await startCoachingCheckoutAction({
        packId,
        minutes,
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
        <h2 className="font-serif text-2xl font-bold">Choisir votre formule</h2>
        <p className="text-sm text-muted-foreground">
          Deux durées, puis un pack de séances (visio ou téléphone).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {COACHING_DURATIONS.map((d) => {
          const active = d.minutes === minutes
          return (
            <button
              key={d.minutes}
              type="button"
              onClick={() => setMinutes(d.minutes)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/30"
              )}
            >
              <p className="text-sm font-bold">{d.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground">
                  {d.unitXof.toLocaleString("fr-FR")} FCFA
                </span>
                {d.listUnitXof > d.unitXof ? (
                  <span className="ml-1 line-through opacity-60">
                    {d.listUnitXof.toLocaleString("fr-FR")}
                  </span>
                ) : null}{" "}
                / séance
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{d.blurb}</p>
            </button>
          )
        })}
      </div>

      <div className="space-y-2">
        {packs.map((p) => {
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
                  <p className="text-xs text-muted-foreground mt-0.5">{p.hint}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-lg font-bold text-primary">
                    {p.amountXof.toLocaleString("fr-FR")}
                    <span className="text-xs font-sans font-semibold"> FCFA</span>
                  </p>
                  {saved > 0 ? (
                    <p className="text-[10px] text-muted-foreground line-through">
                      {p.listXof.toLocaleString("fr-FR")} FCFA
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <PaymentModePicker value={mode} onChange={setMode} />

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <button
        type="button"
        disabled={loading}
        onClick={pay}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
      >
        {loading
          ? "Redirection…"
          : `Payer ${selected.amountXof.toLocaleString("fr-FR")} FCFA`}
      </button>
    </section>
  )
}
