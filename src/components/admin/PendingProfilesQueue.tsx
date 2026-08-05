"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  adminSendMemberFeedback,
  adminUpdateModerationStatus,
} from "@/app/actions/admin"
import { PROFILE_REJECT_REASONS } from "@/lib/admin/moderationCatalog"

type PendingUser = {
  id: string
  userId: string
  name: string
  city: string
  country: string
  completion: number
  hasAvatar: boolean
  verified: boolean
  age: number | null
  denomination: string
  gender: string
}

/**
 * File d’attente claire : clic → détail → valider / rejeter avec motif / feedback.
 */
export function PendingProfilesQueue({
  users,
  busy,
  run,
}: {
  users: PendingUser[]
  busy: string
  run: (
    key: string,
    fn: () => Promise<{ error?: string; success?: boolean; message?: string }>
  ) => Promise<void>
}) {
  const [openId, setOpenId] = React.useState<string | null>(users[0]?.id ?? null)
  const [rejectReason, setRejectReason] = React.useState<string>(PROFILE_REJECT_REASONS[0].id)
  const [feedback, setFeedback] = React.useState(
    "Merci pour votre inscription. Complétez votre photo et votre témoignage pour accélérer la validation."
  )
  const [sentFor, setSentFor] = React.useState<Record<string, string>>({})

  if (users.length === 0) {
    return (
      <p className="p-5 text-sm text-muted-foreground">
        Aucun profil en attente — tout est à jour.
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
      {users.map((u) => {
        const open = openId === u.id
        return (
          <div key={u.id} className="p-4 space-y-3">
            <button
              type="button"
              className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              onClick={() => setOpenId(open ? null : u.id)}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{u.name}</p>
                  <Badge variant="outline" className="text-[10px]">
                    En attente
                  </Badge>
                  {u.hasAvatar ? (
                    <Badge className="text-[10px] bg-emerald-100 text-emerald-800">Photo</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-amber-100 text-amber-900">Sans photo</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {u.city}
                  {u.country ? `, ${u.country}` : ""} · {u.completion}% ·{" "}
                  {u.gender || "—"}
                  {u.age != null ? ` · ${u.age} ans` : ""}
                  {u.denomination ? ` · ${u.denomination}` : ""}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary shrink-0">
                {open ? "Masquer ▲" : "Ouvrir la revue ▼"}
              </span>
            </button>

            {open && (
              <div className="rounded-xl border border-border bg-secondary/40 p-3 space-y-3">
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <Link
                    href={`/compatibility/${u.userId}`}
                    className="underline text-primary font-semibold"
                    target="_blank"
                  >
                    Voir fiche membre
                  </Link>
                  <span className="text-muted-foreground">· id {u.id.slice(0, 8)}…</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    disabled={busy === u.id}
                    onClick={() =>
                      run(u.id, () => adminUpdateModerationStatus(u.id, "approved"))
                    }
                  >
                    Valider le profil
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === `${u.id}-fb`}
                    onClick={() =>
                      run(`${u.id}-fb`, async () => {
                        const res = await adminSendMemberFeedback({
                          profileId: u.id,
                          userId: u.userId,
                          message: feedback,
                        })
                        if (res.error) return res
                        const ok = res.message || "Message envoyé au membre."
                        setSentFor((prev) => ({ ...prev, [u.id]: ok }))
                        return { success: true, message: ok }
                      })
                    }
                  >
                    Envoyer le message / feedback
                  </Button>
                </div>

                {sentFor[u.id] ? (
                  <p className="text-xs rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 px-3 py-2 font-medium">
                    {sentFor[u.id]}
                  </p>
                ) : null}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Message personnalisé (recommandation / feedback)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Motif de refus (si rejet)
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  >
                    {PROFILE_REJECT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy === `${u.id}-rej`}
                  onClick={() =>
                    run(`${u.id}-rej`, () =>
                      adminUpdateModerationStatus(u.id, "rejected", rejectReason, feedback)
                    )
                  }
                >
                  Rejeter avec motif
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
