"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  adminGetEngagementBriefing,
  adminGetVoicePlaybackUrlAction,
  adminRetranscribeVoiceNoteAction,
  type EngagementArchiveDay,
  type EngagementBriefing,
  type EngagementConversationRow,
} from "@/app/actions/adminEngagement"
import { cn } from "@/utils/cn"

type TabId = "point" | "likes" | "conversations" | "archive"

const TABS: { id: TabId; label: string }[] = [
  { id: "point", label: "Point du jour" },
  { id: "likes", label: "Likes" },
  { id: "conversations", label: "Discussions" },
  { id: "archive", label: "Historique" },
]

function fmt(iso: string | null | undefined) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

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

function ThreadReader({
  conversation,
  onClose,
}: {
  conversation: EngagementConversationRow
  onClose: () => void
}) {
  const [audioUrl, setAudioUrl] = React.useState<Record<string, string>>({})
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [localErr, setLocalErr] = React.useState("")

  const listen = async (id: string) => {
    setBusyId(id)
    setLocalErr("")
    try {
      const res = await adminGetVoicePlaybackUrlAction(id)
      if (res.error || !res.url) {
        setLocalErr(res.error || "Lecture impossible.")
        return
      }
      setAudioUrl((prev) => ({ ...prev, [id]: res.url! }))
    } finally {
      setBusyId(null)
    }
  }

  const retranscribe = async (id: string) => {
    setBusyId(id)
    setLocalErr("")
    try {
      const res = await adminRetranscribeVoiceNoteAction(id)
      if (res.error) {
        setLocalErr(res.error)
        return
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-[#C4A35A]/40 bg-card p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold">
            {conversation.aName} ↔ {conversation.bName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {conversation.messageCount} message
            {conversation.messageCount > 1 ? "s" : ""}
            {conversation.score != null ? ` · compat ${Math.round(conversation.score)}%` : ""}
            {conversation.status ? ` · ${conversation.status}` : ""}
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Scan : {conversation.scan}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Fermer
        </Button>
      </div>
      {localErr ? <p className="text-xs text-destructive">{localErr}</p> : null}
      <div className="max-h-[420px] overflow-y-auto space-y-2 rounded-xl bg-secondary/40 p-3">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun message dans ce fil.</p>
        ) : (
          conversation.messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl bg-background/80 border border-border px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">{m.senderName}</span>
                <span className="text-[10px] text-muted-foreground">{fmt(m.at)}</span>
              </div>
              {m.kind === "voice" ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{m.text || "Vocal"}</p>
                  {audioUrl[m.id] ? (
                    <audio src={audioUrl[m.id]} controls className="w-full h-8" />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs"
                      disabled={busyId === m.id}
                      onClick={() => void listen(m.id)}
                    >
                      {busyId === m.id ? "…" : "Écouter"}
                    </Button>
                  )}
                  <div className="rounded-lg bg-secondary/60 px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                      Retranscription ops
                      {m.transcriptStatus && m.transcriptStatus !== "ready"
                        ? ` · ${m.transcriptStatus}`
                        : ""}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {m.transcript ||
                        "Pas encore de texte — la clé OpenAI transcrit après envoi, ou recliquez Retranscrire."}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-7 px-2 text-[11px]"
                      disabled={busyId === m.id}
                      onClick={() => void retranscribe(m.id)}
                    >
                      Retranscrire
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ArchiveCard({ day }: { day: EngagementArchiveDay }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-serif text-lg font-bold">{day.date}</p>
        <p className="text-[10px] text-muted-foreground">{fmt(day.generatedAt)}</p>
      </div>
      <p className="text-sm font-medium mt-2">{day.headline}</p>
      <ul className="mt-2 space-y-1">
        {day.bullets.map((b, i) => (
          <li key={i} className="text-xs text-muted-foreground leading-relaxed">
            · {b}
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-muted-foreground mt-3">
        {day.totals.likesToday} likes jour · {day.totals.mutuals} réciproques ·{" "}
        {day.totals.activeThreads} fils actifs · {day.totals.messages} messages
      </p>
    </div>
  )
}

export function AdminEngagementBriefing({
  isFullAdmin,
  defaultTab = "point",
}: {
  isFullAdmin: boolean
  defaultTab?: TabId
}) {
  const [data, setData] = React.useState<EngagementBriefing | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [tab, setTab] = React.useState<TabId>(defaultTab)
  const [selectedConvId, setSelectedConvId] = React.useState<string | null>(null)

  const load = React.useCallback(async (persist = true) => {
    setLoading(true)
    setError(null)
    const res = await adminGetEngagementBriefing({ persist })
    if (res.error) {
      setError(res.error)
      setData(null)
    } else if (res.briefing) {
      setData(res.briefing)
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    void load(true)
  }, [load])

  if (!isFullAdmin) {
    return (
      <p className="text-sm text-muted-foreground">
        Briefing Eva réservé aux administrateurs complets.
      </p>
    )
  }

  const selected = data?.conversations.find((c) => c.id === selectedConvId) || null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Briefing Eva</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            À chaque ouverture : point du jour sur les likes, les réciproques, et ce qui se dit
            dans les conversations. Mis à jour automatiquement et archivé jour par jour.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => void load(true)}
        >
          {loading ? "Actualisation…" : "Rafraîchir le point"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading && !data ? (
        <p className="text-sm text-muted-foreground">Chargement du briefing…</p>
      ) : null}

      {data ? (
        <>
          <div className="rounded-2xl border border-[#C4A35A]/35 bg-gradient-to-br from-[#0F1F1A]/[0.04] to-[#C4A35A]/10 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {data.dayKey} · généré {fmt(data.generatedAt)}
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold mt-1 leading-snug">
              {data.headline}
            </p>
            <ul className="mt-3 space-y-1.5">
              {data.bullets.map((b, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <Kpi label="Likes" value={data.totals.likes} hint="Cumulés" />
            <Kpi label="Aujourd’hui" value={data.totals.likesToday} hint="Nouveaux likes" />
            <Kpi label="Réciproques" value={data.totals.mutuals} />
            <Kpi label="Conversations" value={data.totals.conversations} />
            <Kpi label="Messages" value={data.totals.messages} />
            <Kpi
              label="Fils actifs"
              value={data.totals.activeThreads}
              hint="Avec au moins 1 message"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "bg-[#0F1F1A] text-white"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {t.label}
                {t.id === "likes" ? ` (${data.likes.length})` : ""}
                {t.id === "conversations" ? ` (${data.conversations.length})` : ""}
                {t.id === "archive" ? ` (${data.archive.length})` : ""}
              </button>
            ))}
          </div>

          {tab === "point" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <h2 className="font-serif text-xl font-bold">Ce qu’il faut retenir</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Ce panneau se met à jour à chaque connexion / rafraîchissement. L’onglet
                  Historique garde le point des jours précédents pour lire l’évolution.
                </p>
                {data.mutuals.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Likes réciproques
                    </p>
                    <ul className="mt-2 space-y-1">
                      {data.mutuals.map((m) => (
                        <li key={`${m.aProfileId}-${m.bProfileId}`} className="text-sm">
                          {m.aName} ↔ {m.bName}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">
                    Pas encore de like réciproque.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h2 className="font-serif text-xl font-bold">Scan discussions (aperçu)</h2>
                {data.conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">
                    Aucune conversation ouverte pour l’instant.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {data.conversations.slice(0, 8).map((c) => (
                      <li key={c.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                        <button
                          type="button"
                          className="text-left w-full group"
                          onClick={() => {
                            setSelectedConvId(c.id)
                            setTab("conversations")
                          }}
                        >
                          <p className="text-sm font-semibold group-hover:text-[#C4A35A]">
                            {c.aName} ↔ {c.bName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {c.scan}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {data.notes.length > 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-900">
                  {data.notes.join(" · ")}
                </div>
              ) : null}
            </div>
          )}

          {tab === "likes" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-serif text-xl font-bold">Qui like qui</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Source : favoris communauté (`profile_favorites`).
                </p>
              </div>
              {data.likes.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Aucun like pour le moment.</p>
              ) : (
                <div className="divide-y divide-border max-h-[560px] overflow-y-auto">
                  {data.likes.map((l) => (
                    <div
                      key={l.id}
                      className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                    >
                      <p className="text-sm">
                        <span className="font-semibold">{l.fromName}</span>
                        {l.fromCity ? (
                          <span className="text-muted-foreground"> ({l.fromCity})</span>
                        ) : null}
                        <span className="text-muted-foreground"> → </span>
                        <span className="font-semibold">{l.toName}</span>
                        {l.toCity ? (
                          <span className="text-muted-foreground"> ({l.toCity})</span>
                        ) : null}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {l.isToday ? (
                          <span className="rounded-full bg-emerald-500/15 text-emerald-800 px-2 py-0.5 font-semibold">
                            Aujourd’hui
                          </span>
                        ) : null}
                        <span>{fmt(l.at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "conversations" && (
            <div className="space-y-4">
              {selected ? <ThreadReader conversation={selected} onClose={() => setSelectedConvId(null)} /> : null}

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <h2 className="font-serif text-xl font-bold">Conversations</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cliquez un fil pour lire le détail des messages.
                  </p>
                </div>
                {data.conversations.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">Aucune conversation.</p>
                ) : (
                  <div className="divide-y divide-border max-h-[560px] overflow-y-auto">
                    {data.conversations.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedConvId(c.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors",
                          selectedConvId === c.id && "bg-secondary/60"
                        )}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {c.aName} ↔ {c.bName}
                          </p>
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {fmt(c.lastMessageAt || c.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.messageCount} msg
                          {c.lastPreview ? ` · « ${c.lastPreview} »` : " · (silencieux)"}
                        </p>
                        <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed">
                          {c.scan}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "archive" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Chaque jour où vous ouvrez ce panneau, le point est sauvegardé. Relisez
                l’évolution sans perdre le fil.
              </p>
              {data.archive.length === 0 ? (
                <p className="text-sm text-muted-foreground">Pas encore d’historique.</p>
              ) : (
                data.archive.map((d) => <ArchiveCard key={d.date} day={d} />)
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
