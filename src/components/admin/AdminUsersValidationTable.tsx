"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  adminBulkSendMemberFeedback,
  adminBulkUpdateModerationStatus,
  adminFindUsersByEmails,
  adminLoadMoreUsers,
  adminResolveUserEmails,
  adminSendMemberFeedback,
  adminUpdateModerationStatus,
} from "@/app/actions/admin"
import {
  buildUsersCsv,
  OPS_USER_EXPORT_COLUMNS,
  VALIDATION_MESSAGE_TEMPLATES,
  type OpsUserExportColumnId,
  type OpsUserValidationRow,
} from "@/lib/admin/userValidation"
import { PILLAR_KEYS, PILLAR_LABELS } from "@/lib/admin/matchingIntelligence"
import { cn } from "@/utils/cn"
import {
  CheckCircle2,
  Download,
  Loader2,
  Search,
  Send,
  Upload,
  XCircle,
} from "lucide-react"

type FilterStatus =
  | "pending"
  | "all"
  | "approved"
  | "rejected"
  | "incomplete"
  | "tests_incomplete"

type MatchRow = {
  id: string
  score: number | null
  status: string | null
  createdAt: string | null
  userOne: string
  userTwo: string
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function AdminUsersValidationTable({
  users: initialUsers,
  matches = [],
  busy,
  run,
}: {
  users: OpsUserValidationRow[]
  matches?: MatchRow[]
  busy: string
  run: (
    key: string,
    fn: () => Promise<{ error?: string; success?: boolean }>
  ) => Promise<void>
}) {
  const [rows, setRows] = React.useState(initialUsers)
  React.useEffect(() => setRows(initialUsers), [initialUsers])

  const [q, setQ] = React.useState("")
  const [filter, setFilter] = React.useState<FilterStatus>("pending")
  const [cityFilter, setCityFilter] = React.useState("")
  const [noPhotoOnly, setNoPhotoOnly] = React.useState(false)
  const [minCompletion, setMinCompletion] = React.useState(0)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [checked, setChecked] = React.useState<Record<string, boolean>>({})
  const [templateId, setTemplateId] = React.useState(
    VALIDATION_MESSAGE_TEMPLATES[0].id
  )
  const [message, setMessage] = React.useState("")
  const [panel, setPanel] = React.useState<
    "message" | "tests" | "export" | "import"
  >("message")
  const [exportCols, setExportCols] = React.useState<OpsUserExportColumnId[]>(
    () =>
      OPS_USER_EXPORT_COLUMNS.map((c) => c.id).filter(
        (id) => id !== "trustScore"
      )
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(initialUsers.length >= 1000)
  const [localBusy, setLocalBusy] = React.useState("")
  const [flash, setFlash] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const selected = rows.find((u) => u.id === selectedId) ?? null
  const checkedIds = Object.keys(checked).filter((id) => checked[id])
  const cities = React.useMemo(() => {
    const set = new Set<string>()
    for (const u of rows) {
      if (u.city && u.city !== "?") set.add(u.city)
    }
    return [...set].sort((a, b) => a.localeCompare(b, "fr"))
  }, [rows])

  React.useEffect(() => {
    if (!selected) return
    const tpl =
      VALIDATION_MESSAGE_TEMPLATES.find((t) => t.id === templateId) ||
      VALIDATION_MESSAGE_TEMPLATES[0]
    setMessage(tpl.body(selected.missing))
  }, [selectedId, templateId, selected])

  const nameByUserId = React.useMemo(() => {
    const m = new Map<string, string>()
    for (const u of rows) m.set(u.userId, u.name)
    return m
  }, [rows])

  const matchesForSelected = React.useMemo(() => {
    if (!selected) return []
    return matches
      .filter(
        (m) => m.userOne === selected.userId || m.userTwo === selected.userId
      )
      .map((m) => {
        const partnerId =
          m.userOne === selected.userId ? m.userTwo : m.userOne
        return {
          ...m,
          partnerId,
          partnerName: nameByUserId.get(partnerId) || partnerId.slice(0, 8),
        }
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 8)
  }, [matches, selected, nameByUserId])

  const matchCountByUser = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const m of matches) {
      map.set(m.userOne, (map.get(m.userOne) || 0) + 1)
      map.set(m.userTwo, (map.get(m.userTwo) || 0) + 1)
    }
    return map
  }, [matches])

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase()
    const cityNeedle = cityFilter.trim().toLowerCase()
    return rows.filter((u) => {
      if (filter === "pending" && u.status !== "pending") return false
      if (filter === "approved" && u.status !== "approved") return false
      if (filter === "rejected" && u.status !== "rejected") return false
      if (filter === "incomplete" && u.missing.length === 0) return false
      if (filter === "tests_incomplete" && (u.pillarsCompleted ?? 0) >= 5)
        return false
      if (noPhotoOnly && u.hasAvatar) return false
      if (u.completion < minCompletion) return false
      if (cityNeedle && !u.city.toLowerCase().includes(cityNeedle)) return false
      if (!needle) return true
      const blob =
        `${u.name} ${u.email || ""} ${u.city} ${u.country} ${u.denomination} ${u.church} ${u.gender} ${u.onboarding || ""} ${u.profileType || ""}`.toLowerCase()
      return blob.includes(needle)
    })
  }, [rows, q, filter, cityFilter, noPhotoOnly, minCompletion])

  const pendingCount = rows.filter((u) => u.status === "pending").length
  const allFilteredChecked =
    filtered.length > 0 && filtered.every((u) => checked[u.id])

  const toggleAllFiltered = () => {
    setChecked((prev) => {
      const next = { ...prev }
      if (allFilteredChecked) {
        for (const u of filtered) delete next[u.id]
      } else {
        for (const u of filtered) next[u.id] = true
      }
      return next
    })
  }

  const mergeEmails = (emails: Record<string, string>) => {
    setRows((prev) =>
      prev.map((u) =>
        emails[u.userId] ? { ...u, email: emails[u.userId] } : u
      )
    )
  }

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const res = await adminLoadMoreUsers({ offset: rows.length, limit: 300 })
      if (res.error) {
        setFlash(res.error)
        return
      }
      const known = new Set(rows.map((u) => u.id))
      const extra = res.users.filter((u) => !known.has(u.id))
      setRows((prev) => [...prev, ...extra])
      setHasMore(Boolean(res.hasMore))
      setFlash(`${extra.length} profils ajoutés`)
    } finally {
      setLoadingMore(false)
    }
  }

  const doExport = async () => {
    setLocalBusy("export")
    try {
      const exportRows =
        checkedIds.length > 0
          ? rows.filter((u) => checked[u.id])
          : filtered
      const needEmail = exportCols.includes("email")
      let withEmail = exportRows
      if (needEmail) {
        const res = await adminResolveUserEmails(
          exportRows.map((u) => u.userId)
        )
        if (res.emails) {
          mergeEmails(res.emails)
          withEmail = exportRows.map((u) => ({
            ...u,
            email: res.emails[u.userId] || u.email,
          }))
        }
      }
      const csv = buildUsersCsv(withEmail, exportCols)
      downloadTextFile(
        `keliaa-utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`,
        csv
      )
      setFlash(`Export ${withEmail.length} ligne(s)`)
    } finally {
      setLocalBusy("")
    }
  }

  const onImportFile = async (file: File) => {
    setLocalBusy("import")
    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(Boolean)
      const emails: string[] = []
      for (const line of lines) {
        const parts = line.split(/[,;]/).map((p) => p.trim().replace(/^"|"$/g, ""))
        for (const p of parts) {
          if (p.includes("@")) emails.push(p.toLowerCase())
        }
      }
      const res = await adminFindUsersByEmails(emails)
      if (res.error) {
        setFlash(res.error)
        return
      }
      const next: Record<string, boolean> = { ...checked }
      for (const m of res.matches) {
        next[m.profileId] = true
        setRows((prev) =>
          prev.map((u) =>
            u.id === m.profileId ? { ...u, email: m.email } : u
          )
        )
      }
      setChecked(next)
      setFlash(
        `${res.matches.length} contact(s) trouvés et sélectionnés (sur ${emails.length} e-mails lus)`
      )
      setPanel("message")
    } finally {
      setLocalBusy("")
    }
  }

  const bulkApprove = () =>
    run("bulk-approve", async () => {
      const res = await adminBulkUpdateModerationStatus({
        profileIds: checkedIds,
        status: "approved",
      })
      if (res.error) return res
      setRows((prev) =>
        prev.map((u) =>
          checked[u.id] ? { ...u, status: "approved", missing: u.missing } : u
        )
      )
      setFlash(`${res.ok ?? checkedIds.length} profil(s) validés`)
      setChecked({})
      return { success: true }
    })

  const bulkMessage = () =>
    run("bulk-msg", async () => {
      const targets = rows
        .filter((u) => checked[u.id])
        .map((u) => ({ profileId: u.id, userId: u.userId }))
      const res = await adminBulkSendMemberFeedback({ targets, message })
      if (res.error) return res
      setFlash(`Message envoyé à ${res.sent ?? targets.length} membre(s)`)
      return { success: true }
    })

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Utilisateurs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Validation membre — {pendingCount} en attente · {rows.length}{" "}
            chargés · {filtered.length} visibles
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["pending", `À valider (${pendingCount})`],
              ["incomplete", "Infos manquantes"],
              ["tests_incomplete", "Tests incomplets"],
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
                "rounded-lg px-3.5 py-2 text-xs font-semibold border",
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

      {flash && (
        <p className="text-sm rounded-xl border border-border bg-secondary/40 px-4 py-2">
          {flash}
        </p>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher nom, e-mail, ville, église…"
            className="pl-9 h-11 rounded-xl text-sm"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm min-w-[160px]"
        >
          <option value="">Toutes les villes</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm h-11 px-3 rounded-xl border border-border bg-card cursor-pointer">
          <input
            type="checkbox"
            checked={noPhotoOnly}
            onChange={(e) => setNoPhotoOnly(e.target.checked)}
          />
          Sans photo
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          % min
          <input
            type="number"
            min={0}
            max={100}
            value={minCompletion}
            onChange={(e) => setMinCompletion(Number(e.target.value) || 0)}
            className="h-11 w-20 rounded-xl border border-border bg-background px-2 text-sm"
          />
        </label>
      </div>

      {checkedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm font-semibold">
            {checkedIds.length} sélectionné(s)
          </span>
          <Button
            size="sm"
            disabled={busy === "bulk-approve"}
            onClick={bulkApprove}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Valider la sélection
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy === "bulk-msg" || !message.trim()}
            onClick={bulkMessage}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Message à la sélection
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setChecked({})}
          >
            Tout désélectionner
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[min(75vh,820px)] overflow-y-auto -webkit-overflow-scrolling-touch">
            <table className="w-full text-left text-sm border-collapse min-w-0 md:min-w-[720px]">
              <thead className="sticky top-0 z-10 bg-[#E8EAEC] text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredChecked}
                      onChange={toggleAllFiltered}
                      aria-label="Tout sélectionner"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Nom</th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">
                    E-mail
                  </th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">
                    Ville
                  </th>
                  <th className="py-3 px-4 font-semibold">Tests</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">
                    Typologie
                  </th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">
                    Profil
                  </th>
                  <th className="py-3 px-4 font-semibold hidden xl:table-cell">
                    Manquant
                  </th>
                  <th className="py-3 px-4 font-semibold">Statut</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-12 px-4 text-center text-muted-foreground"
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
                      <td
                        className="py-3.5 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(checked[u.id])}
                          onChange={(e) =>
                            setChecked((prev) => ({
                              ...prev,
                              [u.id]: e.target.checked,
                            }))
                          }
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {u.gender !== "?" ? u.gender : "—"}
                          {u.age != null ? ` · ${u.age} ans` : ""}
                          {u.pastorName ? ` · Past. ${u.pastorName}` : ""}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-[180px] truncate hidden sm:table-cell">
                        {u.email || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground hidden md:table-cell">
                        {u.city}
                        {u.country && u.country !== "?" ? `, ${u.country}` : ""}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold tabular-nums text-xs">
                          {u.pillarsCompleted ?? 0}/5
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {matchCountByUser.get(u.userId) || 0} match
                          {(matchCountByUser.get(u.userId) || 0) !== 1
                            ? "s"
                            : ""}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs max-w-[140px] hidden lg:table-cell">
                        {u.profileType || "—"}
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${Math.min(100, u.completion)}%`,
                              }}
                            />
                          </div>
                          <span className="tabular-nums font-semibold text-xs">
                            {u.completion}%
                          </span>
                        </div>
                        <div className="mt-1">
                          {u.hasAvatar ? (
                            <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-800">
                              Photo
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-900">
                              Sans photo
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px] text-xs leading-snug hidden xl:table-cell">
                        {u.missing.length === 0 ? (
                          <span className="text-emerald-700 font-medium">
                            Complet
                          </span>
                        ) : (
                          <span className="text-amber-900">
                            {u.missing.join(", ")}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px]",
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
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          className="h-8 text-xs mr-1"
                          disabled={busy === u.id || u.status === "approved"}
                          onClick={() => {
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
                          className="h-8 text-xs"
                          disabled={busy === `${u.id}-rej`}
                          onClick={() => {
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
          <div className="border-t border-border px-4 py-3 flex flex-wrap gap-2 items-center justify-between bg-card">
            <p className="text-xs text-muted-foreground">
              Affichage {filtered.length} / {rows.length}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={loadingMore || !hasMore}
              onClick={loadMore}
            >
              {loadingMore ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {hasMore ? "Charger plus" : "Fin de liste"}
            </Button>
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3 sticky top-4">
          <div className="flex gap-1 p-1 rounded-lg bg-secondary/50">
            {(
              [
                ["message", "Message"],
                ["tests", "Tests & matchs"],
                ["export", "Exporter"],
                ["import", "Importer"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPanel(id)}
                className={cn(
                  "flex-1 rounded-md py-2 text-xs font-semibold",
                  panel === id
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {panel === "message" && (
            <>
              <h2 className="font-serif text-lg font-bold">Message</h2>
              {!selected && checkedIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Cliquez une ligne ou cochez plusieurs membres.
                </p>
              ) : (
                <>
                  {selected && (
                    <div>
                      <p className="text-sm font-semibold">{selected.name}</p>
                      <Link
                        href={`/compatibility/${selected.userId}`}
                        target="_blank"
                        className="text-xs text-primary underline"
                      >
                        Ouvrir la fiche
                      </Link>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                      Modèle
                    </label>
                    <select
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                    >
                      {VALIDATION_MESSAGE_TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={9}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-relaxed"
                  />
                  {selected && (
                    <Button
                      className="w-full"
                      disabled={
                        !message.trim() || busy === `${selected.id}-msg`
                      }
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
                      Envoyer à ce membre
                    </Button>
                  )}
                  {checkedIds.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!message.trim() || busy === "bulk-msg"}
                      onClick={bulkMessage}
                    >
                      Envoyer à la sélection ({checkedIds.length})
                    </Button>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Notification in-app uniquement (pas d’e-mail / 0 crédit
                    Resend).
                  </p>
                </>
              )}
            </>
          )}

          {panel === "tests" && (
            <>
              <h2 className="font-serif text-lg font-bold">Tests & matchs</h2>
              {!selected ? (
                <p className="text-sm text-muted-foreground">
                  Sélectionnez un membre dans le tableau.
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">{selected.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selected.profileType} · {selected.pillarsCompleted ?? 0}
                      /5 tests
                    </p>
                    {selected.spiritualPractice && (
                      <p className="text-[11px] mt-1">
                        Pratique : {selected.spiritualPractice}
                      </p>
                    )}
                    {selected.communicationStyle && (
                      <p className="text-[11px]">
                        Communication : {selected.communicationStyle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                      Questionnaires
                    </p>
                    {PILLAR_KEYS.map((key) => {
                      const score = selected.pillars?.[key]
                      const done = score != null
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                        >
                          <span className="text-xs font-medium">
                            {PILLAR_LABELS[key]}
                          </span>
                          {done ? (
                            <span className="text-xs font-semibold tabular-nums text-emerald-700">
                              {score}/100
                            </span>
                          ) : (
                            <Badge className="text-[10px] bg-amber-100 text-amber-900">
                              Manquant
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {selected.weakDimensions &&
                    selected.weakDimensions.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                          Points fragiles
                        </p>
                        <p className="text-xs text-amber-900">
                          {selected.weakDimensions.join(", ")}
                        </p>
                      </div>
                    )}

                  <div>
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-2">
                      Matchs ({matchCountByUser.get(selected.userId) || 0})
                    </p>
                    {matchesForSelected.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Aucun match enregistré dans l’échantillon chargé.
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {matchesForSelected.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-center justify-between gap-2 text-xs rounded-lg bg-secondary/40 px-3 py-2"
                          >
                            <span className="truncate font-medium">
                              {m.partnerName}
                            </span>
                            <span className="shrink-0 tabular-nums font-semibold">
                              {m.score != null ? `${m.score}%` : "—"} ·{" "}
                              {m.status || "pending"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTemplateId("need_tests")
                      setPanel("message")
                    }}
                  >
                    Préparer rappel questionnaires
                  </Button>
                </div>
              )}
            </>
          )}

          {panel === "export" && (
            <>
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                <Download className="h-4 w-4" /> Exporter CSV
              </h2>
              <p className="text-xs text-muted-foreground">
                {checkedIds.length > 0
                  ? `${checkedIds.length} sélectionné(s)`
                  : `${filtered.length} ligne(s) filtrées`}
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {OPS_USER_EXPORT_COLUMNS.map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={exportCols.includes(col.id)}
                      onChange={(e) => {
                        setExportCols((prev) =>
                          e.target.checked
                            ? [...prev, col.id]
                            : prev.filter((id) => id !== col.id)
                        )
                      }}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
              <Button
                className="w-full"
                disabled={localBusy === "export" || exportCols.length === 0}
                onClick={doExport}
              >
                {localBusy === "export" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Télécharger
              </Button>
            </>
          )}

          {panel === "import" && (
            <>
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                <Upload className="h-4 w-4" /> Importer contacts
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                CSV ou liste d’e-mails. On sélectionne automatiquement les
                membres déjà inscrits (pas de création de compte).
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void onImportFile(f)
                  e.target.value = ""
                }}
              />
              <Button
                className="w-full"
                variant="outline"
                disabled={localBusy === "import"}
                onClick={() => fileRef.current?.click()}
              >
                {localBusy === "import" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Choisir un fichier
              </Button>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
