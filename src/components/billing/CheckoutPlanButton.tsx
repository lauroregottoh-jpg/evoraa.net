"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { startCheckoutAction } from "@/app/actions/billing"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { PlanId } from "@/lib/billing/plans"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"

export function CheckoutPlanButton({
  planId,
  label,
  popular,
  variant = "outline",
  showModePicker = false,
  suggestedMode = "mobile_money",
}: {
  planId: PlanId
  label: string
  popular?: boolean
  variant?: "primary" | "outline" | "secondary"
  showModePicker?: boolean
  suggestedMode?: BictorysPaymentMode
}) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [paymentMode, setPaymentMode] = React.useState<BictorysPaymentMode>(suggestedMode)

  React.useEffect(() => {
    setPaymentMode(suggestedMode)
  }, [suggestedMode])

  if (planId === "free") {
    return (
      <MagneticButton href="/register" variant={variant} className="w-full">
        {label}
      </MagneticButton>
    )
  }

  const handleClick = async () => {
    setLoading(true)
    setError("")
    try {
      const result = await startCheckoutAction(
        planId,
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
    <div className="space-y-3">
      {showModePicker && (
        <PaymentModePicker
          value={paymentMode}
          onChange={setPaymentMode}
          suggested={suggestedMode}
        />
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          popular || variant === "primary"
            ? "w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-6 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
            : "w-full inline-flex items-center justify-center rounded-md border border-border bg-background h-11 px-6 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
        }
      >
        {loading ? "Préparation…" : label}
      </button>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  )
}
