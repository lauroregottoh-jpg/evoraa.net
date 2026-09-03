"use client"

import * as React from "react"
import {
  getAdminCoachingOpsData,
  adminUpdateSessionNotesAction,
  adminSeedDemoTranscriptAction,
  type AdminCoachingOpsData,
} from "@/app/actions/adminCoaching"
import { COUPLE_OFFERS } from "@/lib/couple/offers"
import { PLANS } from "@/lib/billing/plans"

type TabId = "vue" | "coaches" | "sessions" | "membres" | "transcriptions"

const TABS: { id: TabId; label: string }[] = [
  { id: "vue", label: "Vue ops" },
  { id: "coaches", label: "Coachs" },
  { id: "sessions", label: "Sessions" },
  { id: "membres", label: "Membres / crédits" },
  { id: "transcriptions", label: "Transcriptions" },
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

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("fr-FR")
}

export function AdminCoachingPanel() {
  const [data, setData] = React.useState<AdminCoachingOpsData | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [tab, setTab] = React.useState<TabId>("vue")
  const [selectedSession, setSelectedSession] = React.useState<string | null>(
    null
  )
  const [notes, setNotes] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  const reload = React.useCallback(async () => {
    setLoading(true)
    const res = await getAdminCoachingOpsData()
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

  const selected = data?.sessions.find((s) => s.id === selectedSession) || null

  React.useEffect(() => {
    setNotes(selected?.adminNotes || "")
  }, [selected?.id, selected?.adminNotes])

  const saveNotes = async () => {
    if (!selectedSession) return
    setBusy(true)
    const res = await adminUpdateSessionNotesAction({
      sessionId: selectedSession,
      adminNotes: notes,
    })
    setBusy(false)
    setFeedback(res.error || "Notes enregistrées.")
    void reload()
  }

  const seedTranscript = async () => {
    if (!selectedSession) return
    setBusy(true)
    const res = await adminSeedDemoTranscriptAction(selectedSession)
    setBusy(false)
    setFeedback(res.error || "Transcription démo ajoutée.")
    void reload()
  }

  if (loading && !data) {
    return <p className="text-sm text-muted-foreground">Chargement coaching…</p>
  }
  if (error && !data) {
    return <p className="text-sm text-destructive">{error}</p>
  }
  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#A78335]">
          Produit · Coaching
        </p>
        <h1 className="font-serif text-3xl font-bold tracking-tight mt-1">
          Coaching relationnel
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Coachs, sessions, retours membres. Transcriptions : outil ops uniquement
          — jamais exposé dans l’UI coach.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-xl bg-[#641F2B] text-[#FCFAF6] px-3 py-2 text-sm font-semibold"
                : "rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold"
            }
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void reload()}
          className="rounded-xl border px-3 py-2 text-sm font-semibold"
        >
          Rafraîchir
        </button>
      </div>

      {feedback ? (
        <p className="text-xs text-muted-foreground">{feedback}</p>
      ) : null}

      {tab === "vue" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Coachs actifs" value={data.kpis.coachesActive} />
            <Kpi label="Sessions" value={data.kpis.sessionsTotal} />
            <Kpi
              label="Terminées"
              value={data.kpis.sessionsCompleted}
              hint={`${data.kpis.sessionsActive} en cours`}
            />
            <Kpi
              label="Note moyenne"
              value={data.kpis.avgClientRating ?? "—"}
              hint="Retours clients"
            />
            <Kpi
              label="Membres avec crédits"
              value={data.kpis.membersWithCredits}
            />
            <Kpi label="Crédits vendus" value={data.kpis.creditsSold} />
          </div>
          <div className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground leading-relaxed">
            Transcriptions : réservées à l’ops / admin pour le suivi qualité.
            Ne pas mentionner ni afficher de transcript côté espace coach.
            La retranscription se génère pendant la salle audio (Chrome/Edge)
            et s’affiche ici.
          </div>
        </div>
      ) : null}

      {tab === "coaches" ? (
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Coach</th>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Sessions</th>
                <th className="px-3 py-2">Terminées</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {data.coaches.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{c.displayName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{c.coachCode}</td>
                  <td className="px-3 py-2">{c.sessionCount}</td>
                  <td className="px-3 py-2">{c.completedCount}</td>
                  <td className="px-3 py-2">
                    {c.avgRating != null
                      ? `${c.avgRating} (${c.ratingCount})`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">{c.status}</td>
                </tr>
              ))}
              {data.coaches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    Aucun coach
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "sessions" || tab === "transcriptions" ? (
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-2xl border overflow-hidden max-h-[28rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground sticky top-0">
                <tr>
                  <th className="px-3 py-2">Membre</th>
                  <th className="px-3 py-2">Coach</th>
                  <th className="px-3 py-2">Statut</th>
                  <th className="px-3 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-t cursor-pointer hover:bg-secondary/30 ${
                      selectedSession === s.id ? "bg-secondary/40" : ""
                    }`}
                    onClick={() => setSelectedSession(s.id)}
                  >
                    <td className="px-3 py-2">
                      <p className="font-medium">{s.memberName || "—"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.memberEmail || s.userId.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-3 py-2">{s.coachName}</td>
                    <td className="px-3 py-2 text-xs">{s.status}</td>
                    <td className="px-3 py-2">
                      {s.clientScore != null ? `${s.clientScore}/5` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-3">
            {selected ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A78335]">
                  Détail session
                </p>
                <h2 className="font-serif text-xl font-bold">
                  {selected.memberName || "Membre"} × {selected.coachName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {fmtDate(selected.startedAt || selected.createdAt)} ·{" "}
                  {selected.displayedMinutes} min affichées · {selected.status}
                </p>
                {selected.clientFeedback ? (
                  <p className="text-sm rounded-xl bg-secondary/50 p-3">
                    Retour membre : {selected.clientFeedback}
                  </p>
                ) : null}
                <div>
                  <p className="text-xs font-semibold mb-1">Transcription</p>
                  <pre className="text-xs whitespace-pre-wrap rounded-xl border bg-[#FCFAF6] p-3 max-h-48 overflow-y-auto">
                    {selected.transcriptPreview ||
                      "Pas encore de transcription — ajouter une démo ou brancher l’audio→texte."}
                  </pre>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void seedTranscript()}
                    className="mt-2 text-xs font-semibold underline"
                  >
                    Insérer transcription démo
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">Notes ops / feedback coach</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder="Points à remonter au coach…"
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void saveNotes()}
                    className="mt-2 inline-flex h-9 items-center rounded-xl bg-[#641F2B] px-4 text-xs font-semibold text-white"
                  >
                    Enregistrer les notes
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center">
                Sélectionnez une session
              </p>
            )}
          </div>
        </div>
      ) : null}

      {tab === "membres" ? (
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Membre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Crédits</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBuyers.map((m) => (
                <tr key={m.userId} className="border-t">
                  <td className="px-3 py-2 font-medium">{m.name || "—"}</td>
                  <td className="px-3 py-2 text-xs">{m.email || m.userId.slice(0, 8)}</td>
                  <td className="px-3 py-2">{m.credits}</td>
                </tr>
              ))}
              {data.recentBuyers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">
                    Aucun crédit pour le moment
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

/** Accordion produits sur le dashboard ops. */
export function AdminProductsHub({
  onOpen,
  allianceActive,
  registrations,
  reportsOpen,
  independentRevenueXof,
  showIndependentPayments,
}: {
  onOpen: (id: "alliance" | "couple" | "coaching" | "encaissements") => void
  allianceActive: number
  registrations: number
  reportsOpen: number
  independentRevenueXof?: number
  showIndependentPayments?: boolean
}) {
  const [open, setOpen] = React.useState<string | null>("coaching")
  const [coupleKpis, setCoupleKpis] = React.useState<{
    purchases: number
    couples: number
    reportsReady: number
  } | null>(null)
  const [coachingKpis, setCoachingKpis] = React.useState<{
    sessions: number
    coaches: number
    membersWithCredits: number
  } | null>(null)

  React.useEffect(() => {
    void (async () => {
      const [{ getAdminCoupleOpsData }, coaching] = await Promise.all([
        import("@/app/actions/adminCouple"),
        getAdminCoachingOpsData(),
      ])
      const couple = await getAdminCoupleOpsData()
      if (couple.data) {
        setCoupleKpis({
          purchases: couple.data.kpis.purchasesCompleted,
          couples: couple.data.kpis.couplesTotal,
          reportsReady: couple.data.kpis.reportsReady,
        })
      }
      if (coaching.data) {
        setCoachingKpis({
          sessions: coaching.data.kpis.sessionsTotal,
          coaches: coaching.data.kpis.coachesActive,
          membersWithCredits: coaching.data.kpis.membersWithCredits,
        })
      }
    })()
  }, [])

  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id))

  const alliancePrice = PLANS.premium_plus.amountXof
  const coupleP = COUPLE_OFFERS.couple_essential.amountXof
  const couplePp = COUPLE_OFFERS.couple_premium_plus.amountXof

  const items = [
    {
      id: "alliance",
      title: "Alliance",
      price: `${alliancePrice.toLocaleString("fr-FR")} FCFA / mois`,
      summary: `${allianceActive} actives · ${registrations} inscriptions`,
      body: "Matching, messages, rapport vivant, coffre. Cliquez pour ouvrir Alliance & paiements.",
      nav: "alliance" as const,
    },
    {
      id: "couple",
      title: "KELYA Couple™",
      price: `${coupleP.toLocaleString("fr-FR")} – ${couplePp.toLocaleString("fr-FR")} FCFA`,
      summary: coupleKpis
        ? `${coupleKpis.couples} couples · ${coupleKpis.reportsReady} rapports · ${coupleKpis.purchases} achats`
        : "Bilan ponctuel à deux",
      body: "Achats, progression questionnaires, rapports, accès. Ouvrir le panneau Couple.",
      nav: "couple" as const,
    },
    {
      id: "coaching",
      title: "Coaching",
      price: "Crédits session (durée selon offre)",
      summary: coachingKpis
        ? `${coachingKpis.sessions} sessions · ${coachingKpis.coaches} coachs · ${coachingKpis.membersWithCredits} avec crédits`
        : "Sessions 1:1, salle, retours",
      body: "Coachs, sessions, membres, transcriptions et notes ops. Ouvrir le panneau Coaching.",
      nav: "coaching" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {showIndependentPayments && (
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
              Hors plateforme
            </p>
            <h2 className="font-serif text-2xl font-bold">Encaissements indépendants</h2>
          </div>
          <div className="rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/60 overflow-hidden shadow-sm">
            <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-serif text-lg font-bold">Coaching & prestations externes</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Montant libre · liens de paiement · non compté dans les revenus KELIAA
                </p>
                <p className="text-sm font-bold text-emerald-800 mt-2 tabular-nums">
                  {(independentRevenueXof ?? 0).toLocaleString("fr-FR")} FCFA encaissés
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpen("encaissements")}
                className="inline-flex h-10 items-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shrink-0"
              >
                Ouvrir l&apos;onglet →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#A78335]">
            Produits KELIAA
          </p>
          <h2 className="font-serif text-2xl font-bold">Hub produits</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Signalements ouverts : {reportsOpen}
        </p>
      </div>
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
            >
              <div>
                <p className="font-serif text-lg font-bold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.price} · {item.summary}
                </p>
              </div>
              <span className="text-xl font-bold text-[#641F2B]">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <div className="px-4 pb-4 space-y-3 border-t border-border/60 pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
                <button
                  type="button"
                  onClick={() => onOpen(item.nav)}
                  className="inline-flex h-10 items-center rounded-xl bg-[#641F2B] px-4 text-sm font-semibold text-white"
                >
                  Ouvrir {item.title} →
                </button>
              </div>
            ) : null}
          </div>
        )
      })}
      </div>
    </div>
  )
}
