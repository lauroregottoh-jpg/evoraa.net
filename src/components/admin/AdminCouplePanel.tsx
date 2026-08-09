"use client"

import * as React from "react"
import {
  getAdminCoupleOpsData,
  type AdminCoupleOpsData,
  type AdminCoupleRow,
} from "@/app/actions/adminCouple"
import { adminSendScopedMemberMessage } from "@/app/actions/admin"
import { COUPLE_BRAND } from "@/lib/couple/config"
import { COUPLE_OFFERS, type CoupleOfferId } from "@/lib/couple/offers"

type TabId =
  | "vue"
  | "offres"
  | "couples"
  | "progression"
  | "rapports"
  | "acces"
  | "support"

const TABS: { id: TabId; label: string }[] = [
  { id: "vue", label: "Vue ops" },
  { id: "offres", label: "Offres" },
  { id: "couples", label: "Couples" },
  { id: "progression", label: "Progression" },
  { id: "rapports", label: "Rapports" },
  { id: "acces", label: "Accès" },
  { id: "support", label: "Support" },
]

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

function offerLabel(id: string) {
  if (id === "couple_essential") return "Premium"
  if (id === "couple_premium_plus") return "Premium Plus"
  return id
}

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("fr-FR")
}

function statusTone(status: string) {
  if (status.includes("READY") || status === "COMPLETED" || status === "completed") {
    return "text-emerald-700"
  }
  if (status.includes("FAIL") || status === "CANCELLED" || status === "failed") {
    return "text-destructive"
  }
  if (status.includes("EXPIR")) return "text-amber-700"
  return "text-foreground"
}

export function AdminCouplePanel() {
  const [data, setData] = React.useState<AdminCoupleOpsData | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [tab, setTab] = React.useState<TabId>("vue")
  const [offerFilter, setOfferFilter] = React.useState<CoupleOfferId | "all">(
    "all"
  )
  const [query, setQuery] = React.useState("")
  const [msgUserId, setMsgUserId] = React.useState("")
  const [msgTitle, setMsgTitle] = React.useState("KELYA Couple — message ops")
  const [msgBody, setMsgBody] = React.useState("")
  const [msgBusy, setMsgBusy] = React.useState(false)
  const [msgFeedback, setMsgFeedback] = React.useState<string | null>(null)

  const reload = React.useCallback(async () => {
    setLoading(true)
    const res = await getAdminCoupleOpsData()
    setLoading(false)
    if (res.error || !res.data) {
      setError(res.error || "Données indisponibles.")
      return
    }
    setError(null)
    setData(res.data)
  }, [])

  React.useEffect(() => {
    void reload()
  }, [reload])

  const filteredCouples = React.useMemo(() => {
    if (!data) return []
    let rows = data.couples
    if (offerFilter !== "all") {
      rows = rows.filter((c) => c.offerId === offerFilter)
    }
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (c) =>
        c.publicCode.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        (c.purchaserName || "").toLowerCase().includes(q) ||
        c.participants.some(
          (p) =>
            (p.displayName || "").toLowerCase().includes(q) ||
            (p.firstName || "").toLowerCase().includes(q) ||
            p.userId.toLowerCase().includes(q)
        )
    )
  }, [data, offerFilter, query])

  const sendMessage = async () => {
    if (!msgUserId.trim() || !msgBody.trim()) {
      setMsgFeedback("Destinataire et message requis.")
      return
    }
    setMsgBusy(true)
    setMsgFeedback(null)
    const res = await adminSendScopedMemberMessage({
      scope: "private",
      userId: msgUserId.trim(),
      title: msgTitle.trim() || "KELYA Couple",
      body: msgBody.trim(),
    })
    setMsgBusy(false)
    if (res.error) {
      setMsgFeedback(res.error)
      return
    }
    setMsgFeedback("Message envoyé.")
    setMsgBody("")
  }

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

  const { kpis, byOffer, purchases, reports, access, funnel } = data

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">{COUPLE_BRAND}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Offres prises, progression, rapports, accès et support — dans la
            console ops. Aucune réponse brute partenaire.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          className="self-start rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary/40"
        >
          Actualiser
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-colors ${
              tab === id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "vue" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Achats complétés" value={kpis.purchasesCompleted} />
            <Kpi
              label="CA complété"
              value={`${kpis.revenueCompletedXof.toLocaleString("fr-FR")} FCFA`}
            />
            <Kpi label="Couples actifs" value={kpis.couplesActive} />
            <Kpi label="Les deux ont terminé" value={kpis.bothCompleted} />
            <Kpi label="Rapports prêts" value={kpis.reportsReady} />
            <Kpi
              label="Accès ≤ 30 j"
              value={kpis.accessExpiring30d}
              hint="Expiration interactive proche"
            />
            <Kpi label="Invitations actives" value={kpis.invitesActive} />
            <Kpi
              label="Achats en attente"
              value={kpis.purchasesPending}
              hint={
                kpis.reportsFailed
                  ? `${kpis.reportsFailed} rapport(s) en échec`
                  : undefined
              }
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-bold">Achats récents</h2>
              </div>
              <div className="max-h-72 overflow-auto divide-y divide-border">
                {purchases.length === 0 ? (
                  <p className="p-4 text-xs text-muted-foreground">Aucun achat.</p>
                ) : (
                  purchases.slice(0, 25).map((p) => (
                    <div key={p.id} className="px-4 py-2.5 text-xs space-y-0.5">
                      <p className="font-semibold">
                        {offerLabel(p.offerId)} ·{" "}
                        {p.amountXof.toLocaleString("fr-FR")} FCFA ·{" "}
                        <span className={statusTone(p.status)}>{p.status}</span>
                      </p>
                      <p className="text-muted-foreground">
                        {p.purchaserName || "Acheteur"} · {fmtDate(p.completedAt || p.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-bold">Couples récents</h2>
              </div>
              <div className="max-h-72 overflow-auto divide-y divide-border">
                {data.couples.length === 0 ? (
                  <p className="p-4 text-xs text-muted-foreground">Aucun couple.</p>
                ) : (
                  data.couples.slice(0, 25).map((c) => (
                    <CoupleSummaryRow key={c.id} c={c} compact />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "offres" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {(Object.keys(COUPLE_OFFERS) as CoupleOfferId[]).map((id) => {
              const offer = COUPLE_OFFERS[id]
              const stats = byOffer[id]
              return (
                <article
                  key={id}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl font-bold">
                        {offer.marketingName}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {offer.amountXof.toLocaleString("fr-FR")} FCFA · catalogue
                      </p>
                    </div>
                    {offer.popular ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        Populaire
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Kpi label="Achats" value={stats.purchasesCompleted} />
                    <Kpi
                      label="CA"
                      value={`${stats.revenueXof.toLocaleString("fr-FR")} F`}
                    />
                    <Kpi label="Couples" value={stats.couples} />
                    <Kpi label="Rapports prêts" value={stats.reportsReady} />
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {offer.features.map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      )}

      {(tab === "couples" || tab === "progression") && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Code, nom, user id…"
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs min-w-[12rem]"
            />
            {(
              [
                ["all", "Toutes offres"],
                ["couple_essential", "Premium"],
                ["couple_premium_plus", "Premium Plus"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setOfferFilter(id)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold border ${
                  offerFilter === id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="max-h-[32rem] overflow-auto divide-y divide-border">
              {filteredCouples.length === 0 ? (
                <p className="p-4 text-xs text-muted-foreground">Aucun résultat.</p>
              ) : (
                filteredCouples.map((c) => (
                  <CoupleSummaryRow
                    key={c.id}
                    c={c}
                    showProgress={tab === "progression"}
                    onMessage={(userId) => {
                      setMsgUserId(userId)
                      setTab("support")
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "rapports" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">Rapports</h2>
            <p className="text-[11px] text-muted-foreground">
              Statut de génération uniquement — pas de contenu ni réponses.
            </p>
          </div>
          <div className="max-h-[32rem] overflow-auto divide-y divide-border">
            {reports.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">Aucun rapport.</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="px-4 py-3 text-xs space-y-1">
                  <p className="font-semibold">
                    {r.publicCode} · {offerLabel(r.offerId)} ·{" "}
                    <span className={statusTone(r.status)}>{r.status}</span>
                    {r.qaPassed ? " · QA ok" : ""}
                  </p>
                  <p className="text-muted-foreground">
                    Généré {fmtDate(r.generationDate || r.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "acces" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">Accès interactif</h2>
            <p className="text-[11px] text-muted-foreground">
              Expiration 365 j post-achat (champ access_expires_at).
            </p>
          </div>
          <div className="max-h-[32rem] overflow-auto divide-y divide-border">
            {access.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">Aucun accès enregistré.</p>
            ) : (
              access.map((a) => (
                <div key={a.coupleId} className="px-4 py-3 text-xs space-y-1">
                  <p className="font-semibold">
                    {a.publicCode} · {offerLabel(a.offerId)} ·{" "}
                    <span className={statusTone(a.coupleStatus)}>{a.coupleStatus}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Expire {fmtDate(a.accessExpiresAt)} · interactif{" "}
                    {a.interactiveAccess ? "oui" : "non"} · téléchargement{" "}
                    {a.downloadAllowed ? "oui" : "non"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "support" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <h2 className="text-sm font-bold">Message privé membre</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Envoi via le canal messages ops (privé). Coller un user id depuis
              Couples / Progression.
            </p>
            <label className="block space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                User id
              </span>
              <input
                value={msgUserId}
                onChange={(e) => setMsgUserId(e.target.value)}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-mono"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Titre
              </span>
              <input
                value={msgTitle}
                onChange={(e) => setMsgTitle(e.target.value)}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Message
              </span>
              <textarea
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
              />
            </label>
            <button
              type="button"
              disabled={msgBusy}
              onClick={() => void sendMessage()}
              className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold disabled:opacity-60"
            >
              {msgBusy ? "Envoi…" : "Envoyer"}
            </button>
            {msgFeedback ? (
              <p className="text-xs text-muted-foreground" role="status">
                {msgFeedback}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold">Événements funnel</h2>
              <p className="text-[11px] text-muted-foreground">
                Signaux produit (join, complete, etc.) — pas de contenu réponses.
              </p>
            </div>
            <div className="max-h-96 overflow-auto divide-y divide-border">
              {funnel.length === 0 ? (
                <p className="p-4 text-xs text-muted-foreground">Aucun événement.</p>
              ) : (
                funnel.map((f) => (
                  <div key={f.id} className="px-4 py-2.5 text-xs space-y-0.5">
                    <p className="font-semibold">{f.event}</p>
                    <p className="text-muted-foreground font-mono text-[10px] truncate">
                      couple {f.coupleId || "—"} · user {f.userId || "—"}
                    </p>
                    <p className="text-muted-foreground">{fmtDate(f.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CoupleSummaryRow({
  c,
  compact,
  showProgress,
  onMessage,
}: {
  c: AdminCoupleRow
  compact?: boolean
  showProgress?: boolean
  onMessage?: (userId: string) => void
}) {
  return (
    <div className="px-4 py-3 text-xs space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold">
          {c.publicCode} · {offerLabel(c.offerId)} ·{" "}
          <span className={statusTone(c.status)}>{c.status}</span>
        </p>
        <p className="text-muted-foreground">{fmtDate(c.createdAt)}</p>
      </div>
      <p className="text-muted-foreground">
        Acheteur {c.purchaserName || "—"} · sièges {c.participantCount}/2
        {c.inviteStatus ? ` · invite ${c.inviteStatus}` : ""}
        {c.reportStatus ? ` · rapport ${c.reportStatus}` : ""}
        {c.globalScore != null ? ` · score ${c.globalScore}` : ""}
      </p>
      {!compact && (
        <div className="space-y-1 pt-1">
          {c.participants.map((p) => (
            <div
              key={p.userId}
              className="flex flex-wrap items-center gap-2 text-[11px]"
            >
              <span className="font-semibold">
                Siège {p.seat} — {p.displayName || p.firstName || "Participant"}
              </span>
              {showProgress ? (
                <span className={statusTone(p.questionnaireStatus)}>
                  {p.questionnaireStatus}
                </span>
              ) : null}
              {onMessage ? (
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => onMessage(p.userId)}
                >
                  Message
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
