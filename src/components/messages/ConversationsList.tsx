"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Inbox,
  MessageCircle,
  Mic,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import type { ConversationListItem } from "@/app/actions/messaging"
import { openVoiceSandboxAction } from "@/app/actions/messaging"
import type { DemoMatchThread } from "@/lib/demo/sarahGandeSimulations"
import { cn } from "@/utils/cn"

type FilterTab = "all" | "unread" | "recent" | "older"

function parseDayKey(timestamp: string): string {
  // timestamp is display string — use today/yesterday heuristics + raw
  const t = timestamp.toLowerCase()
  if (t.includes("instant") || t.includes("min") || t.includes("h")) {
    return new Date().toISOString().slice(0, 10)
  }
  if (t.includes("hier")) {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().slice(0, 10)
  }
  return "other"
}

function VoiceSandboxOpener() {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")

  const open = async () => {
    setBusy(true)
    setError("")
    try {
      const res = await openVoiceSandboxAction()
      if (res.error || !res.conversationId) {
        setError(res.error || "Impossible d’ouvrir l’essai.")
        return
      }
      router.push(`/messages/${res.conversationId}`)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 rounded-2xl border-2 border-[#D7B866]/60 bg-[#EFE5DA] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">Essai vocaux</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discussion privée avec Echo pour tester l&apos;enregistrement.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void open()}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#641F2B] px-4 text-xs font-bold text-[#FFFDF9] disabled:opacity-60"
        >
          <Mic className="h-3.5 w-3.5" />
          {busy ? "Ouverture…" : "Ouvrir l’essai vocaux"}
        </button>
      </div>
      {error ? <p className="text-xs text-destructive mt-2">{error}</p> : null}
    </div>
  )
}

function ConvRow({ conv }: { conv: ConversationListItem }) {
  return (
    <Link href={`/messages/${conv.id}`} className="block group">
      <Card
        className={cn(
          "rounded-2xl border transition-all duration-300",
          conv.unread
            ? "border-accent/60 bg-accent/5 shadow-sm"
            : "border-border/60 bg-background/90 hover:border-[#D7B866]/35"
        )}
      >
        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center font-serif text-lg font-bold text-primary shadow-inner">
                {conv.partnerName[0]}
              </div>
              {conv.unread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-background" />
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-foreground truncate">
                  {conv.partnerName}
                </h3>
                {conv.harmonyScore > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full border border-accent/30 shrink-0">
                    <Sparkles className="h-2.5 w-2.5 fill-accent" />{" "}
                    {conv.harmonyScore}%
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-xs truncate",
                  conv.unread
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {conv.lastMessage}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground font-sans">
              {conv.timestamp}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ConversationsList({
  conversations,
  error,
  demoThreads = [],
}: {
  conversations: ConversationListItem[]
  error?: string
  demoThreads?: DemoMatchThread[]
}) {
  const [query, setQuery] = React.useState("")
  const [day, setDay] = React.useState("")
  const [tab, setTab] = React.useState<FilterTab>("all")

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return conversations.filter((c) => {
      if (q && !c.partnerName.toLowerCase().includes(q)) return false
      if (day) {
        const key = parseDayKey(c.timestamp)
        if (day === "today" && key !== new Date().toISOString().slice(0, 10)) {
          return false
        }
        if (day === "yesterday") {
          const y = new Date()
          y.setDate(y.getDate() - 1)
          if (key !== y.toISOString().slice(0, 10)) return false
        }
        if (day.length === 10 && key !== day && key !== "other") {
          // loose: if we can't parse exact day, keep when searching by calendar only if timestamp empty match
          if (!c.timestamp) return false
        }
      }
      if (tab === "unread" && !c.unread) return false
      if (tab === "recent" && c.unread) return false
      if (tab === "older") {
        const idx = conversations.filter((x) => !x.unread).indexOf(c)
        if (c.unread || idx < 4) return false
      }
      return true
    })
  }, [conversations, query, day, tab])

  const unread = filtered.filter((c) => c.unread)
  const recent = filtered.filter((c) => !c.unread).slice(0, 4)
  const older = filtered.filter((c) => !c.unread).slice(4)
  const hasDemo = demoThreads.length > 0 && !query && !day && tab === "all"

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "Tous", count: conversations.length },
    {
      id: "unread",
      label: "Non lus",
      count: conversations.filter((c) => c.unread).length,
    },
    { id: "recent", label: "Récents" },
    { id: "older", label: "Plus anciens" },
  ]

  return (
    <div className="space-y-5 py-4">
      {/* Hero inbox */}
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#D7B866]/30 bg-gradient-to-br from-[#FFFBF5] via-[#FFFDF9] to-[#F0E6D4] p-5 sm:p-7 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className="border-[#D7B866]/40 text-[#A78335] bg-white/60 font-sans uppercase tracking-wider text-[10px]"
            >
              Messagerie
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2421]">
              Vos conversations
            </h1>
            <p className="text-sm text-[#2B2421]/65 max-w-md">
              Recherchez par nom, filtrez par jour, et retrouvez vos échanges
              classés.
            </p>
          </div>
          <span className="rounded-full bg-[#641F2B] px-3 py-1.5 text-xs font-bold text-[#FFFDF9]">
            {conversations.length} conversation
            {conversations.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A78335]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tapez un prénom…"
              className="h-11 w-full rounded-xl border border-[#D7B866]/30 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#D7B866]"
            />
            {query ? (
              <button
                type="button"
                aria-label="Effacer"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <label className="relative flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#A78335] shrink-0" />
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="h-11 min-w-[9rem] rounded-xl border border-[#D7B866]/30 bg-white px-3 text-sm outline-none focus:border-[#D7B866]"
            >
              <option value="">Tous les jours</option>
              <option value="today">Aujourd’hui</option>
              <option value="yesterday">Hier</option>
            </select>
          </label>

          <Link
            href="/communaute"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#641F2B] px-4 text-xs font-bold text-[#FFFDF9]"
          >
            Communauté
          </Link>
        </div>

        <VoiceSandboxOpener />

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition",
                tab === t.id
                  ? "bg-[#641F2B] text-[#FFFDF9]"
                  : "border border-[#D7B866]/30 bg-white text-[#641F2B] hover:bg-[#EFE5DA]"
              )}
            >
              {t.label}
              {typeof t.count === "number" ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    tab === t.id ? "bg-white/20" : "bg-[#EFE5DA]"
                  )}
                >
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && conversations.length === 0 && !hasDemo && (
        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-8 text-center space-y-4">
          <p className="font-serif text-xl text-foreground">
            Aucun message pour le moment
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Likez ou envoyez un message depuis un profil.
          </p>
          <Link
            href="/compatibility"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            Voir les compatibilités
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {(tab === "all" || tab === "unread") && unread.length > 0 ? (
          <section className="space-y-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78335]">
              <Inbox className="h-3.5 w-3.5" /> Non lus · {unread.length}
            </p>
            <div className="space-y-2">
              {unread.map((c) => (
                <ConvRow key={c.id} conv={c} />
              ))}
            </div>
          </section>
        ) : null}

        {(tab === "all" || tab === "recent") && recent.length > 0 ? (
          <section className="space-y-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5" /> Récents · {recent.length}
            </p>
            <div className="space-y-2">
              {recent.map((c) => (
                <ConvRow key={c.id} conv={c} />
              ))}
            </div>
          </section>
        ) : null}

        {(tab === "all" || tab === "older") && older.length > 0 ? (
          <details
            open={tab === "older"}
            className="group rounded-2xl border border-border/50 bg-secondary/20"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Plus anciens ({older.length})
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" />
            </summary>
            <div className="space-y-2 px-3 pb-3">
              {older.map((c) => (
                <ConvRow key={c.id} conv={c} />
              ))}
            </div>
          </details>
        ) : null}

        {filtered.length === 0 && conversations.length > 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Aucun résultat pour ces critères.
          </p>
        ) : null}

        {hasDemo ? (
          <section className="space-y-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78335]">
              <span className="rounded bg-[#641F2B] px-1.5 py-0.5 text-[9px] tracking-widest text-[#E8D49A]">
                Démo
              </span>
              Aperçu (jusqu’à 5 vrais échanges)
            </p>
            {demoThreads.map((t) => (
              <Link
                key={t.id}
                href={`/messages/demo/${t.id}`}
                className="block group"
              >
                <Card className="rounded-2xl border border-dashed border-[#D7B866]/40 bg-[#EFE5DA]/50 hover:border-[#D7B866]/60 transition-all">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center font-serif text-lg font-bold text-white",
                          t.photoGradient
                        )}
                      >
                        {t.partnerFirstName[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base truncate">
                            {t.partnerFirstName}
                          </h3>
                          <span className="text-[9px] font-bold uppercase text-[#A78335]">
                            Démo
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {t.preview}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#641F2B] px-2.5 py-1 text-[10px] font-bold text-[#FFFDF9]">
                      Ouvrir
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  )
}
