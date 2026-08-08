"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, HeartHandshake, Smartphone, Tag } from "lucide-react"
import {
  COUPLE_DEMO_AMOUNT_XOF,
  COUPLE_OFFERS,
  getCoupleChargeAmountXof,
  type CoupleOfferId,
} from "@/lib/couple/offers"
import {
  previewCoupleCouponAction,
  startCoupleCheckoutAction,
} from "@/app/actions/couple"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { cn } from "@/utils/cn"

type Props = {
  demoPricing: boolean
  showModePicker?: boolean
  suggestedMode?: BictorysPaymentMode
  /** Pré-sélection depuis /couple/checkout/[offer] ou ?offer= */
  initialOfferId?: CoupleOfferId
  /** Après login : démarrer le paiement une fois */
  autostart?: boolean
  initialPaymentMode?: BictorysPaymentMode
  initialPromoCode?: string
  className?: string
}

/**
 * Vente Couple — choix d’offre + Mobile Money / carte (comme Alliance).
 * Hors shell membre : page de vente publique.
 */
export function CoupleCheckoutPanel({
  demoPricing,
  showModePicker = true,
  suggestedMode = "mobile_money",
  initialOfferId = "couple_essential",
  autostart = false,
  initialPaymentMode,
  initialPromoCode = "",
  className,
}: Props) {
  const router = useRouter()
  const [offerId, setOfferId] = React.useState<CoupleOfferId>(initialOfferId)
  const [paymentMode, setPaymentMode] = React.useState<BictorysPaymentMode>(
    initialPaymentMode ?? suggestedMode
  )
  const [promoOpen, setPromoOpen] = React.useState(Boolean(initialPromoCode))
  const [promoCode, setPromoCode] = React.useState(initialPromoCode)
  const [promoAmount, setPromoAmount] = React.useState<number | null>(null)
  const [promoHint, setPromoHint] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const autostartDone = React.useRef(false)

  React.useEffect(() => {
    setOfferId(initialOfferId)
  }, [initialOfferId])

  React.useEffect(() => {
    if (initialPaymentMode) setPaymentMode(initialPaymentMode)
    else setPaymentMode(suggestedMode)
  }, [initialPaymentMode, suggestedMode])

  React.useEffect(() => {
    if (!initialPromoCode.trim()) return
    setPromoOpen(true)
    setPromoCode(initialPromoCode)
    void previewCoupleCouponAction(initialPromoCode).then((r) => {
      if (r.ok && r.amountXof != null) {
        setPromoAmount(r.amountXof)
        setPromoHint(r.message || "Code appliqué.")
      }
    })
  }, [initialPromoCode])

  const offer = COUPLE_OFFERS[offerId]
  const baseCharge = demoPricing
    ? COUPLE_DEMO_AMOUNT_XOF
    : getCoupleChargeAmountXof(offer)
  const charge = promoAmount ?? baseCharge

  const applyPromo = async () => {
    setPromoHint(null)
    const r = await previewCoupleCouponAction(promoCode)
    if (r.ok && r.amountXof != null) {
      setPromoAmount(r.amountXof)
      setPromoHint(r.message || "Code appliqué.")
    } else {
      setPromoAmount(null)
      setPromoHint(r.message || "Code invalide.")
    }
  }

  const pay = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await startCoupleCheckoutAction({
        offerId,
        paymentMode: showModePicker ? paymentMode : undefined,
        promoCode: promoCode.trim() || undefined,
      })
      if (res.requiresAuth && res.checkoutPath) {
        router.push(res.checkoutPath)
        return
      }
      if (res.error) {
        setError(res.error)
        return
      }
      if (res.checkoutPath) {
        if (res.checkoutPath.startsWith("http")) {
          window.location.assign(res.checkoutPath)
        } else {
          router.push(res.checkoutPath)
        }
        return
      }
      setError("Aucune URL de paiement reçue. Réessayez.")
    } finally {
      setLoading(false)
    }
  }, [offerId, paymentMode, showModePicker, promoCode, router])

  React.useEffect(() => {
    if (!autostart || autostartDone.current) return
    autostartDone.current = true
    void pay()
  }, [autostart, pay])

  return (
    <section
      id="payer"
      className={cn(
        "rounded-2xl border border-[#1C1412]/10 bg-white p-5 sm:p-7 space-y-6 shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C1F28]">
          <HeartHandshake className="h-3.5 w-3.5" />
          Paiement sécurisé
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412]">
          Choisissez votre bilan et payez
        </h2>
        <p className="text-sm text-[#1C1412]/70 leading-relaxed">
          Mobile Money ou carte bancaire. Un seul achat couvre les deux
          participants.
        </p>
      </div>

      {demoPricing && !promoAmount && (
        <div className="rounded-xl border border-[#B8954A]/35 bg-[#B8954A]/10 px-4 py-3 text-sm">
          <p className="font-semibold text-[#1C1412]">
            Mode démo — {COUPLE_DEMO_AMOUNT_XOF} FCFA
          </p>
          <p className="text-xs text-[#1C1412]/65 mt-1 leading-relaxed">
            Montant de test. Les prix catalogue restent affichés barrés.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {(Object.keys(COUPLE_OFFERS) as CoupleOfferId[]).map((id) => {
          const o = COUPLE_OFFERS[id]
          const amount = promoAmount ?? (demoPricing
            ? COUPLE_DEMO_AMOUNT_XOF
            : getCoupleChargeAmountXof(o))
          const active = offerId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOfferId(id)}
              className={cn(
                "relative w-full text-left rounded-2xl border px-4 py-4 transition-all",
                active
                  ? "border-[#5C1F28] bg-[#F8F4EE] shadow-sm"
                  : "border-[#1C1412]/12 hover:border-[#5C1F28]/40 bg-white"
              )}
            >
              {o.popular && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-[#B8954A] text-[#1C1412] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                  Le plus choisi
                </span>
              )}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={cn(
                      "mt-1 h-4 w-4 rounded-full border-2 shrink-0",
                      active
                        ? "border-[#5C1F28] bg-[#5C1F28]"
                        : "border-[#1C1412]/25"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1C1412]">
                      {o.marketingName}
                    </p>
                    <p className="text-sm mt-1 text-[#1C1412]/70 leading-snug">
                      {o.description}
                    </p>
                    <ul className="mt-2 space-y-0.5 text-xs text-[#1C1412]/65">
                      {o.features.slice(0, 4).map((f) => (
                        <li key={f}>· {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {(demoPricing || promoAmount) && amount !== o.amountXof && (
                    <p className="text-xs text-[#1C1412]/45 line-through">
                      {o.amountXof.toLocaleString("fr-FR")}
                    </p>
                  )}
                  {promoAmount && demoPricing && (
                    <p className="text-xs text-[#1C1412]/45 line-through">
                      {COUPLE_DEMO_AMOUNT_XOF.toLocaleString("fr-FR")}
                    </p>
                  )}
                  <p className="font-serif text-xl font-bold text-[#5C1F28]">
                    {amount.toLocaleString("fr-FR")}
                    <span className="text-xs font-sans font-medium text-[#1C1412]/55 ml-1">
                      FCFA
                    </span>
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setPromoOpen((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5C1F28] hover:underline"
        >
          <Tag className="h-4 w-4" />
          J&apos;ai un code
        </button>
        {promoOpen && (
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value)
                setPromoAmount(null)
                setPromoHint(null)
              }}
              placeholder="Code"
              autoComplete="off"
              className="flex-1 min-w-[10rem] rounded-xl border border-[#1C1412]/15 bg-[#FBF9F6] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B8954A]/50"
            />
            <button
              type="button"
              onClick={() => void applyPromo()}
              className="rounded-xl border border-[#1C1412]/15 px-4 py-2.5 text-sm font-semibold text-[#1C1412] hover:bg-[#F8F4EE]"
            >
              Appliquer
            </button>
          </div>
        )}
        {promoHint && (
          <p
            className={cn(
              "mt-2 text-xs",
              promoAmount ? "text-[#5C1F28] font-semibold" : "text-destructive"
            )}
          >
            {promoHint}
          </p>
        )}
      </div>

      {showModePicker && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#1C1412]">
            Comment voulez-vous payer ?
          </p>
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

      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[#1C1412]/10 pt-4">
        <div>
          <p className="text-xs text-[#1C1412]/55">Total à payer</p>
          <p className="font-serif text-2xl font-bold text-[#1C1412] flex items-baseline gap-2">
            {promoAmount ? (
              <span className="text-lg text-[#1C1412]/40 line-through font-sans font-normal">
                {baseCharge.toLocaleString("fr-FR")}
              </span>
            ) : null}
            {charge.toLocaleString("fr-FR")} FCFA
          </p>
          <p className="text-[11px] text-[#1C1412]/55">
            {offer.marketingName} · 2 participants inclus
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void pay()}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5C1F28] text-white h-12 px-6 text-sm font-bold hover:brightness-110 disabled:opacity-60"
      >
        {loading
          ? "Préparation du paiement…"
          : `Payer ${charge.toLocaleString("fr-FR")} FCFA`}
      </button>

      <p className="text-center text-[11px] text-[#1C1412]/55">
        Connexion requise pour finaliser · activation après confirmation du
        paiement
      </p>
      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
      <p className="text-center text-xs text-[#1C1412]/55">
        Déjà un code d&apos;invitation partenaire ?{" "}
        <Link href="/couple/rejoindre" className="font-semibold text-[#5C1F28]">
          Rejoindre le bilan →
        </Link>
      </p>
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
        active
          ? "border-[#B8954A] bg-[#B8954A]/10"
          : "border-[#1C1412]/12 hover:border-[#B8954A]/40"
      )}
    >
      <div className="flex items-center gap-2 text-[#1C1412] font-semibold text-sm">
        <span className="text-[#5C1F28]">{icon}</span>
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {brands.map((b) => (
          <span
            key={b}
            className="rounded-md bg-white border border-[#1C1412]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1C1412]/55"
          >
            {b}
          </span>
        ))}
      </div>
    </button>
  )
}
