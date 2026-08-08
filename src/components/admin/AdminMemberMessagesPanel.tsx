"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  adminListMemberMessageTemplates,
  adminPreviewMemberMessageAudience,
  adminSendScopedMemberMessage,
  adminListRecentMemberMessages,
} from "@/app/actions/admin"
import type { AdminMessageScope } from "@/lib/admin/memberMessageTemplates"

export function AdminMemberMessagesPanel({
  isFullAdmin,
  selectedUserId,
  selectedName,
}: {
  isFullAdmin: boolean
  selectedUserId?: string | null
  selectedName?: string | null
}) {
  const [templates, setTemplates] = React.useState<
    Awaited<ReturnType<typeof adminListMemberMessageTemplates>>["templates"]
  >([])
  const [recent, setRecent] = React.useState<
    Awaited<ReturnType<typeof adminListRecentMemberMessages>>["messages"]
  >([])
  const [scope, setScope] = React.useState<AdminMessageScope>("private")
  const [templateId, setTemplateId] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [customMessage, setCustomMessage] = React.useState("")
  const [audience, setAudience] = React.useState<number | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    const [t, r] = await Promise.all([
      adminListMemberMessageTemplates(),
      adminListRecentMemberMessages(),
    ])
    if (t.templates?.length) {
      setTemplates(t.templates)
      if (!templateId && t.templates[0]) {
        setTemplateId(t.templates[0].id)
        setTitle(t.templates[0].title)
        setBody(t.templates[0].body)
        setScope(t.templates[0].scope)
      }
    }
    if (r.messages) setRecent(r.messages)
  }, [templateId])

  React.useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = templates.filter((t) => t.scope === scope)

  React.useEffect(() => {
    const first = filtered[0]
    if (!first) return
    if (!filtered.some((t) => t.id === templateId)) {
      setTemplateId(first.id)
      setTitle(first.title)
      setBody(first.body)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope])

  const applyTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id)
    if (!t) return
    setTemplateId(t.id)
    setTitle(t.title)
    setBody(t.body)
  }

  const refreshAudience = async () => {
    const res = await adminPreviewMemberMessageAudience({
      scope,
      userId: selectedUserId || undefined,
    })
    if (res.error) setMsg(res.error)
    else setAudience(res.count ?? 0)
  }

  if (!isFullAdmin) {
    return (
      <p className="text-sm text-muted-foreground">
        Réservé aux administrateurs complets.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-bold">Messages aux membres</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Privé (1 membre), général (tous) ou rappels ciblés — avec templates.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["private", "Privé"],
            ["broadcast", "Général (tous)"],
            ["reminder", "Rappel"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setScope(id)}
            className={
              scope === id
                ? "rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold"
                : "rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {scope === "private" ? (
        <p className="text-xs text-muted-foreground">
          Destinataire :{" "}
          <strong>
            {selectedName || selectedUserId || "Sélectionnez un membre (onglet Utilisateurs)"}
          </strong>
        </p>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <label className="block text-xs font-semibold space-y-1">
            Template
            <select
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
              value={templateId}
              onChange={(e) => applyTemplate(e.target.value)}
            >
              {filtered.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold space-y-1">
            Titre notification
            <input
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold space-y-1">
            Corps (variables : {"{{prenom}}"}, {"{{message}}"})
            <textarea
              className="w-full min-h-36 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          {body.includes("{{message}}") ? (
            <label className="block text-xs font-semibold space-y-1">
              Texte libre {"{{message}}"}
              <textarea
                className="w-full min-h-20 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </label>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => void refreshAudience()}
            >
              Estimer l’audience
              {audience != null ? ` (${audience})` : ""}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy || (scope === "private" && !selectedUserId)}
              onClick={() => {
                void (async () => {
                  setBusy(true)
                  setMsg(null)
                  const res = await adminSendScopedMemberMessage({
                    scope,
                    templateId,
                    title,
                    body,
                    customMessage,
                    userId: selectedUserId || undefined,
                  })
                  if (res.error) setMsg(res.error)
                  else {
                    setMsg(`Envoyé à ${res.sent ?? 0} membre(s).`)
                    await load()
                  }
                  setBusy(false)
                })()
              }}
            >
              Envoyer
            </Button>
          </div>
          {msg ? <p className="text-xs text-muted-foreground">{msg}</p> : null}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Derniers envois
          </p>
          <div className="max-h-80 overflow-y-auto divide-y divide-border text-xs">
            {(recent || []).length === 0 ? (
              <p className="py-4 text-muted-foreground">Aucun envoi encore.</p>
            ) : (
              recent.map((m) => (
                <div key={m.id} className="py-2 space-y-0.5">
                  <p className="font-semibold">
                    {m.title}{" "}
                    <span className="text-muted-foreground font-normal">
                      · {m.scope} · {m.recipientCount} dest.
                    </span>
                  </p>
                  <p className="text-muted-foreground line-clamp-2">{m.body}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(m.createdAt).toLocaleString("fr-FR")}
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
