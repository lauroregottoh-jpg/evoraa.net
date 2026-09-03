"use client"

import * as React from "react"
import {
  adminUpdateFeedbackStatus,
  type FeedbackRow,
} from "@/app/actions/feedback"
import { FEEDBACK_CATEGORY_LABELS } from "@/lib/feedback/categories"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { MessageSquareHeart } from "lucide-react"

export function AdminFeedbackPanel({
  items: initial,
}: {
  items: FeedbackRow[]
}) {
  const [items, setItems] = React.useState(initial)
  const [filter, setFilter] = React.useState<"all" | "new" | "reviewed" | "resolved">(
    "new"
  )
  const [busy, setBusy] = React.useState("")
  const [msg, setMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    setItems(initial)
  }, [initial])

  const filtered = items.filter((i) =>
    filter === "all" ? true : i.status === filter
  )
  const newCount = items.filter((i) => i.status === "new").length

  const setStatus = async (
    id: string,
    status: "new" | "reviewed" | "resolved"
  ) => {
    setBusy(id + status)
    setMsg(null)
    const res = await adminUpdateFeedbackStatus({ id, status })
    if (res.error) setMsg(res.error)
    else {
      setItems((prev) =>
        prev.map((row) => (row.id === id ? { ...row, status } : row))
      )
      setMsg("Statut mis à jour.")
    }
    setBusy("")
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A5F28] mb-1">
            Retours utilisateurs
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquareHeart className="h-7 w-7 text-primary" />
            Plaintes & améliorations
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Inscriptions bloquées, plaintes, suggestions UX — tout ce que les
            membres écrivent depuis « Avis » ou la page d’inscription.
          </p>
        </div>
        <span className="text-xs font-semibold rounded-full bg-red-500/10 text-red-700 border border-red-500/20 px-3 py-1">
          {newCount} nouveau{newCount !== 1 ? "x" : ""}
        </span>
      </div>

      {msg && (
        <p className="text-xs rounded-xl border border-border bg-card px-3 py-2">
          {msg}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["new", "Nouveaux"],
            ["reviewed", "En cours"],
            ["resolved", "Traités"],
            ["all", "Tous"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors",
              filter === id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Aucun retour dans ce filtre pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    {row.name || "Anonyme"}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {row.email}
                    </span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {FEEDBACK_CATEGORY_LABELS[row.category] || row.category}
                    {row.page_path ? ` · ${row.page_path}` : ""}
                    {" · "}
                    {new Date(row.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5",
                    row.status === "new" && "bg-amber-500/15 text-amber-800",
                    row.status === "reviewed" && "bg-sky-500/15 text-sky-800",
                    row.status === "resolved" &&
                      "bg-emerald-500/15 text-emerald-800"
                  )}
                >
                  {row.status}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {row.message}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {row.status !== "reviewed" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy.startsWith(row.id)}
                    onClick={() => setStatus(row.id, "reviewed")}
                    className="rounded-xl"
                  >
                    Marquer en cours
                  </Button>
                )}
                {row.status !== "resolved" && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy.startsWith(row.id)}
                    onClick={() => setStatus(row.id, "resolved")}
                    className="rounded-xl"
                  >
                    Marquer traité
                  </Button>
                )}
                {row.email && (
                  <a
                    href={`mailto:${row.email}?subject=${encodeURIComponent(
                      "KELIAA — suite à votre retour"
                    )}`}
                    className="inline-flex items-center text-xs font-semibold text-primary underline px-2"
                  >
                    Répondre par email
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
