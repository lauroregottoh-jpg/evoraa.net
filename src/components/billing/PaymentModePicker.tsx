"use client"

import * as React from "react"
import { cn } from "@/utils/cn"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { bictorysPaymentModeLabel } from "@/lib/billing/bictorys"
import { CreditCard, Smartphone } from "lucide-react"

export function PaymentModePicker({
  value,
  onChange,
  suggested,
}: {
  value: BictorysPaymentMode
  onChange: (mode: BictorysPaymentMode) => void
  suggested?: BictorysPaymentMode
}) {
  const options: Array<{
    id: BictorysPaymentMode
    icon: React.ComponentType<{ className?: string }>
    hint: string
  }> = [
    {
      id: "mobile_money",
      icon: Smartphone,
      hint: "Wave, Orange Money, Free Money…",
    },
    {
      id: "card",
      icon: CreditCard,
      hint: "Visa, Mastercard",
    },
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Mode de paiement
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon
          const active = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-secondary/40"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <span className="text-sm font-semibold">{bictorysPaymentModeLabel(opt.id)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{opt.hint}</p>
              {suggested === opt.id && (
                <p className="text-[10px] text-accent font-semibold mt-1">Suggéré pour vous</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
