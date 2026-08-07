"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Crown, Smartphone, Tag } from "lucide-react"
import { cn } from "@/utils/cn"
import {
  ALLIANCE_DURATION_OPTIONS,
  getAllianceDuration,
  type AllianceDurationId,
} from "@/lib/billing/premiumOffers"
import { startCheckoutAction } from "@/app/actions/billing"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"

export function AllianceCheckoutPanel({
  showModePicker = true,
  suggestedMode = "mobile_money",
  isPaid = false,
}: {
  showModePicker?: boolean
  suggestedMode?: BictorysPaymentMode
  isPaid?: boolean
}) {
  const router = useRouter()
  const [durationId, setDurationId] = React.useState<AllianceDurationId>("1m")
  const [paymentMode, setPaymentMode] = React.useState<BictorysPaymentMode>(suggestedMode)
  const [promoOpen, setPromoOpen] = React.useState(false)
  const [promo, setPromo] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [info, setInfo] = React.useState("")

  React.useEffect(() => {
    setPaymentMode(suggestedMode)
  }, [suggestedMode])

  const selected = getAllianceDuration(durationId)
  const monthly =
    selected.months > 1
      ? Math.round(selected.amountXof / selected.months)
      : selected.amountXof

  const handlePay = async () => {
    setLoading(true)
    setError("")
    setInfo("")
    try {
      if (durationId !== "1m") {
        setError(
          "Pour l'instant, seul Alliance 1 mois est payable en ligne. Les offres 3 et 6 mois arrivent bientôt."
        )
        setLoading(false)
        return
      }
      if (promo.trim()) {
        setInfo(
          "Les codes promo seront appliqués automatiquement dans une prochaine version. Votre paiement se fait au tarif affiché."
        )
      }
      const result = await startCheckoutAction(
        selected.checkoutPlanId,
        showModePicker ? paymentMode : undefined
      )
      if (result.checkoutPath) {
        if (result.checkoutPath.startsWith("http")) {
          window.location.href = result.checkoutPath
        } else {
          router.push(result.checkoutPath)
        }
        return
      }
      setError(result.error || "Impossible de démarrer le paiement.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-7 space-y-6 shadow-card">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold">
          {isPaid ? "Renouveler Alliance" : "Activer Alliance"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Rapport Personnalisé, Coffre Premium, Matching enrichi — choisissez la
          durée et payez (Mobile Money ou carte).
        </p>
      </div>

      <div className="space-y-3">
        {ALLIANCE_DURATION_OPTIONS.map((opt) => {
          const active = opt.id === durationId
          const perMonth =
            opt.months > 1 ? Math.round(opt.amountXof / opt.months) : opt.amountXof
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDurationId(opt.id)}
              className={cn(
                "relative w-full text-left rounded-2xl border px-4 py-4 transition-all",
                active
                  ? "border-accent bg-accent/10 shadow-card"
                  : "border-border hover:border-accent/40 bg-background/40"
              )}
            >
              {opt.popular && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                  Populaire
                </span>
              )}
              <span className="absolute -top-2.5 right-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5">
                -{opt.discountPercent} %
              </span>
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={cn(
                      "mt-1 h-4 w-4 rounded-full border-2 shrink-0",
                      active ? "border-accent bg-accent" : "border-border"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {opt.label}
                      {opt.id !== "1m" && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
                          Bientôt
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {perMonth.toLocaleString("fr-FR")} FCFA/mois
                      {opt.months > 1 && (
                        <>
                          {" · "}
                          <span className="line-through">
                            {opt.compareAtXof.toLocaleString("fr-FR")}
                          </span>{" "}
                          → {opt.amountXof.toLocaleString("fr-FR")} FCFA
                        </>
                      )}
                    </p>
                    <p className="text-[11px] text-primary font-medium mt-1.5 leading-snug">
                      Quotas Alliance : 15 suggestions/jour · 25 conversations/mois ·
                      100 messages/conversation · Eva 20/jour · Rapport Personnalisé
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1">
                  {opt.id === "1m" ? "Payable" : "Bientôt"}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setPromoOpen((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Tag className="h-4 w-4" />
          J&apos;ai un code promo
        </button>
        {promoOpen && (
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Code promo"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        )}
      </div>

      {showModePicker && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Comment voulez-vous payer ?</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <PayModeCard
              active={paymentMode === "mobile_money"}
              onClick={() => setPaymentMode("mobile_money")}
              icon={<Smartphone className="h-5 w-5" />}
              title="Mobile Money"
              brands={["Orange", "Wave", "Moov"]}
            />
            <PayModeCard
              active={paymentMode === "card"}
              onClick={() => setPaymentMode("card")}
              icon={<CreditCard className="h-5 w-5" />}
              title="Carte bancaire"
              brands={["Visa", "Mastercard"]}
            />
          </div>
        </div>
      )}

      <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Total affiché</p>
          <p className="font-serif text-2xl font-bold text-foreground">
            {selected.amountXof.toLocaleString("fr-FR")} FCFA
          </p>
          <p className="text-[11px] text-muted-foreground">
            soit {monthly.toLocaleString("fr-FR")} FCFA / mois
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground h-12 px-6 text-sm font-bold hover:brightness-95 disabled:opacity-60 shadow-card"
      >
        <Crown className="h-4 w-4" />
        {loading ? "Préparation…" : isPaid ? "Renouveler Alliance" : "Devenir membre Alliance"}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Activation après confirmation du paiement · Renouvellement manuel
      </p>
      <p className="text-center text-[11px] font-medium text-primary">
        Paiement sécurisé · renouvellement manuel
      </p>
      {info && <p className="text-xs text-muted-foreground text-center">{info}</p>}
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </section>
  )
}

function PayModeCard({
  active,
  onClick,
  icon,
  title,
  brands,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  brands: string[]
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-4 text-left transition-all",
        active ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"
      )}
    >
      <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
        <span className="text-accent">{icon}</span>
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {brands.map((b) => (
          <span
            key={b}
            className="rounded-md bg-white border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
          >
            {b}
          </span>
        ))}
      </div>
    </button>
  )
}
