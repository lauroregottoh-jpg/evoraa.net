"use client"

import * as React from "react"
import {
  getAdminCoupleOpsData,
  type AdminCoupleOpsData,
} from "@/app/actions/adminCouple"
import { COUPLE_BRAND } from "@/lib/couple/config"
import { COUPLE_OFFERS } from "@/lib/couple/offers"

function Kpi({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-serif text-2xl font-bold mt-1">{value}</p>
      {hint ? (
        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{hint}</p>
      ) : null}
    </div>
  )
}

export function AdminCouplePanel() {
  const [data, setData] = React.useState<AdminCoupleOpsData | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    void (async () => {
      setLoading(true)
      const res = await getAdminCoupleOpsData()
      setLoading(false)
      if (res.error || !res.data) {
        setError(res.error || "Données indisponibles.")
        return
      }
      setData(res.data)
    })()
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement Couple…</p>
  }
  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    )
  }
  if (!data) return null

  const { kpis, couples, purchases } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">{COUPLE_BRAND}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Achats, couples, questionnaires et rapports — même console ops.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground space-y-1">
        <p>
          <strong className="text-foreground">Offres :</strong>{" "}
          {COUPLE_OFFERS.couple_essential.marketingName}{" "}
          {COUPLE_OFFERS.couple_essential.amountXof.toLocaleString("fr-FR")} FCFA
          {" · "}
          {COUPLE_OFFERS.couple_premium_plus.marketingName}{" "}
          {COUPLE_OFFERS.couple_premium_plus.amountXof.toLocaleString("fr-FR")}{" "}
          FCFA (ponctuel, ≠ Alliance mensuelle)
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Kpi label="Achats complétés" value={kpis.purchasesCompleted} />
        <Kpi label="Couples (échantillon)" value={kpis.couplesTotal} />
        <Kpi label="Couples actifs" value={kpis.couplesActive} />
        <Kpi
          label="Les deux ont terminé"
          value={kpis.bothCompleted}
          hint="Questionnaires complets / analyse"
        />
        <Kpi label="Rapports prêts" value={kpis.reportsReady} />
        <Kpi
          label="Accès sous 30 j"
          value={kpis.accessExpiring30d}
          hint="Expiration interactive proche"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">Couples récents</h2>
          </div>
          <div className="max-h-80 overflow-auto divide-y divide-border">
            {couples.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">Aucun couple pour l’instant.</p>
            ) : (
              couples.slice(0, 40).map((c) => (
                <div key={c.id} className="px-4 py-2.5 text-xs space-y-0.5">
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    {c.id}
                  </p>
                  <p className="font-semibold">
                    {c.status} · {c.offerId} · {c.participantCount}/2
                  </p>
                  <p className="text-muted-foreground">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">Achats récents</h2>
          </div>
          <div className="max-h-80 overflow-auto divide-y divide-border">
            {purchases.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">Aucun achat.</p>
            ) : (
              purchases.slice(0, 40).map((p) => (
                <div key={p.id} className="px-4 py-2.5 text-xs space-y-0.5">
                  <p className="font-semibold">
                    {p.offerId} · {p.amountXof.toLocaleString("fr-FR")} FCFA ·{" "}
                    {p.status}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    acheteur {p.purchaserUserId}
                  </p>
                  <p className="text-muted-foreground">
                    {p.completedAt
                      ? new Date(p.completedAt).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
