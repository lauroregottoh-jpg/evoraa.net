"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/admin/AdminShell"
import { adminListAuditLog } from "@/app/actions/admin"
import { RefreshCw } from "lucide-react"

type Row = {
  id: string
  actorUserId: string | null
  actorEmail: string | null
  action: string
  targetType: string | null
  targetId: string | null
  meta: Record<string, unknown> | null
  createdAt: string
}

const ACTION_LABELS: Record<string, string> = {
  moderation_status: "Modération profil",
  set_verified: "Vérification",
  set_role: "Changement rôle",
  assign_staff: "Nomination staff",
  resolve_report: "Rapport traité",
  moderate_photo: "Photo",
  apply_sanction: "Sanction",
  grant_alliance: "Alliance offerte",
  platform_setting: "Réglage plateforme",
  broadcast_segment: "Campagne notification",
  create_member: "Création membre",
  review_church_reco: "Reco église",
  send_member_feedback: "Message équipe",
    resync_missing_names: "Resync noms Auth",
    bulk_member_feedback: "Message équipe (bulk)",
  member_feedback_send: "Message équipe",
  member_feedback_bulk_send: "Message équipe (bulk)",
}

export function AdminOpsAuditPanel() {
  const [rows, setRows] = React.useState<Row[]>([])
  const [actionFilter, setActionFilter] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await adminListAuditLog({
        action: actionFilter || undefined,
        limit: 50,
      })
      if (res.error) setError(res.error)
      setRows(res.rows || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement")
    } finally {
      setBusy(false)
    }
  }, [actionFilter])

  React.useEffect(() => {
    void load()
  }, [load])

  return (
    <SectionCard title="Journal d'audit ops">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">Toutes les actions</option>
          {Object.entries(ACTION_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => void load()}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${busy ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive mb-2">{error}</p>
      )}
      <div className="divide-y divide-border max-h-[28rem] overflow-y-auto">
        {rows.length === 0 && !busy && (
          <p className="text-sm text-muted-foreground py-4">
            Aucune entrée. Les actions sensibles (rôle, sanction, Alliance,
            modération…) apparaîtront ici.
          </p>
        )}
        {rows.map((r) => (
          <div key={r.id} className="py-3 text-sm space-y-1">
            <div className="flex justify-between gap-2">
              <p className="font-semibold">
                {ACTION_LABELS[r.action] || r.action}
              </p>
              <p className="text-[11px] text-muted-foreground shrink-0">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleString("fr-FR")
                  : "—"}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {r.actorEmail || r.actorUserId || "acteur inconnu"}
              {r.targetType ? ` · ${r.targetType}` : ""}
              {r.targetId ? ` · ${r.targetId.slice(0, 8)}…` : ""}
            </p>
            {r.meta && Object.keys(r.meta).length > 0 ? (
              <p className="text-[10px] font-mono text-muted-foreground truncate">
                {JSON.stringify(r.meta)}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
