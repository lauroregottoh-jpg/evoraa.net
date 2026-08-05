"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  adminSendMemberFeedback,
  adminUpdateModerationStatus,
} from "@/app/actions/admin"
import {
  VALIDATION_MESSAGE_TEMPLATES,
  type OpsUserValidationRow,
} from "@/lib/admin/userValidation"
import { cn } from "@/utils/cn"
import { CheckCircle2, Send, Search, XCircle } from "lucide-react"

type FilterStatus = "pending" | "all" | "approved" | "rejected" | "incomplete"

export function AdminUsersValidationTable({
  users,
  busy,
  run,
}: {
  users: OpsUserValidationRow[]
  busy: string
  run: (
    key: string,
    fn: () => Promise<{ error?: string; success?: boolean }>
  ) => Promise<void>
}) {
  const [q, setQ] = React.useState("")
  const [filter, setFilter] = React.useState<FilterStatus>("pending")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [templateId, setTemplateId] = React.useState(
    VALIDATION_MESSAGE_TEMPLATES[0].id
  )
  const [message, setMessage] = React.useState("")

  const selected =
    users.find((u) => u.id === selectedId) ??
    null

  React.useEffect(() => {
    if (!selected) return
    const tpl =
      VALIDATION_MESSAGE_TEMPLATES.find((t) => t.id === templateId) ||
      VALIDATION_MESSAGE_TEMPLATES[0]
    setMessage(tpl.body(selected.missing))
  }, [selectedId, templateId, selected])

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users.filter((u) => {
      if (filter === "pending" && u.status !== "pending") return false
      if (filter === "approved" && u.status !== "approved") return false
      if (filter === "rejected" && u.status !== "rejected") return false
      if (filter === "incomplete" && u.missing.length === 0) return false
      if (!needle) return true
      const blob = `${u.name} ${u.city} ${u.country} ${u.denomination} ${u.church} ${u.gender}`.toLowerCase()
      return blob.includes(needle)
    })
  }, [users, q, filter])

  const pendingCount = users.filter((u) => u.status === "pending").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Utilisateurs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tableau de validation — {pendingCount} en attente · {users.length}{" "}
            chargés
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {(
            [
              ["pending", `À valider (${pendingCount})`],
              ["incomplete", "Infos manquantes"],
              ["approved", "Validés"],
              ["rejected", "Rejetés"],
              ["all", "Tous"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold border",
                filter === id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-secondary/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher nom, ville, église…"
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[min(70vh,720px)] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead className="sticky top-0 z-10 bg-[#ECEEF0] text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Nom</th>
                  <th className="py-2.5 px-3 font-semibold">Ville</th>
                  <th className="py-2.5 px-3 font-semibold">Profil</th>
                  <th className="py-2.5 px-3 font-semibold">Rempli</th>
                  <th className="py-2.5 px-3 font-semibold">Manquant</th>
                  <th className="py-2.5 px-3 font-semibold">Statut</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 px-4 text-center text-sm text-muted-foreground"
                    >
                      Aucun utilisateur dans ce filtre.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => {
                  const active = selectedId === u.id
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedId(u.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        active ? "bg-primary/8" : "hover:bg-secondary/40"
                      )}
                    >
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-sm text-foreground">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {u.gender !== "?" ? u.gender : "—"}
                          {u.age != null ? ` · ${u.age} ans` : ""}
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {u.city}
                        {u.country && u.country !== "?" ? `, ${u.country}` : ""}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${Math.min(100, u.completion)}%`,
                              }}
                            />
                          </div>
                          <span className="tabular-nums font-semibold">
                            {u.completion}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {u.hasAvatar ? (
                            <Badge className="text-[9px] px-1 py-0 bg-emerald-100 text-emerald-800">
                              Photo
                            </Badge>
                          ) : (
                            <Badge className="text-[9px] px-1 py-0 bg-amber-100 text-amber-900">
                              Sans photo
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-foreground/90 max-w-[180px]">
                        {[
                          u.denomination,
                          u.church,
                          u.hasMaritalStatus ? "Situation OK" : null,
                          u.hasTestimony || u.hasBiography ? "Bio OK" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </td>
                      <td className="py-2.5 px-3 max-w-[200px]">
                        {u.missing.length === 0 ? (
                          <span className="text-emerald-700 font-medium">
                            Complet
                          </span>
                        ) : (
                          <span className="text-amber-800 leading-snug">
                            {u.missing.join(", ")}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            u.status === "approved" &&
                              "border-emerald-500/40 text-emerald-700",
                            u.status === "pending" &&
                              "border-amber-500/40 text-amber-800",
                            u.status === "rejected" &&
                              "border-destructive/40 text-destructive"
                          )}
                        >
                          {u.status === "pending"
                            ? "En attente"
                            : u.status === "approved"
                              ? "Validé"
                              : u.status === "rejected"
                                ? "Rejeté"
                                : u.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          className="h-7 text-[11px] mr-1"
                          disabled={busy === u.id || u.status === "approved"}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(u.id)
                            return run(u.id, () =>
                              adminUpdateModerationStatus(u.id, "approved")
                            )
                          }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px]"
                          disabled={busy === `${u.id}-rej`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(u.id)
                            return run(`${u.id}-rej`, () =>
                              adminUpdateModerationStatus(
                                u.id,
                                "rejected",
                                "incomplete_profile",
                                message || undefined
                              )
                            )
                          }}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Rejeter
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3 sticky top-4">
          <h2 className="font-serif text-lg font-bold">Message au membre</h2>
          {!selected ? (
            <p className="text-sm text-muted-foreground">
              Cliquez une ligne du tableau pour préparer un message.
            </p>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold">{selected.name}</p>
                <Link
                  href={`/compatibility/${selected.userId}`}
                  target="_blank"
                  className="text-xs text-primary underline"
                >
                  Ouvrir la fiche
                </Link>
                {selected.missing.length > 0 && (
                  <p className="text-[11px] text-amber-800 mt-2">
                    Manquant : {selected.missing.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Modèle de message
                </label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {VALIDATION_MESSAGE_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Texte à envoyer
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm leading-relaxed"
                />
              </div>

              <Button
                className="w-full"
                disabled={!message.trim() || busy === `${selected.id}-msg`}
                onClick={() =>
                  run(`${selected.id}-msg`, () =>
                    adminSendMemberFeedback({
                      profileId: selected.id,
                      userId: selected.userId,
                      message,
                    })
                  )
                }
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Notification dans l’espace membre (+ trace ops).
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
