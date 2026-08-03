"use client"

import * as React from "react"
import { UsersRound, ShieldCheck } from "lucide-react"
import {
  adminAssignStaffByEmail,
  adminListStaff,
  adminSetRole,
} from "@/app/actions/admin"
import {
  STAFF_ROLE_DESCRIPTION,
  STAFF_ROLE_LABELS,
  type StaffRole,
} from "@/lib/admin/consolePath"
import { SectionCard } from "@/components/admin/AdminShell"

type StaffRow = {
  id: string
  userId: string
  firstName: string
  role: string
}

export function AdminStaffTeamPanel({ canManage }: { canManage: boolean }) {
  const [staff, setStaff] = React.useState<StaffRow[]>([])
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<Exclude<StaffRole, "member">>("moderator")
  const [msg, setMsg] = React.useState("")
  const [err, setErr] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const refresh = React.useCallback(async () => {
    if (!canManage) return
    const res = await adminListStaff()
    if (res.error) setErr(res.error)
    else {
      setErr("")
      setStaff(res.staff)
    }
  }, [canManage])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  if (!canManage) {
    return (
      <SectionCard title="Équipe">
        <p className="text-sm text-muted-foreground">
          Seul l&apos;administrateur principal peut nommer des modérateurs, éditeurs ou coachs.
        </p>
      </SectionCard>
    )
  }

  const assign = async () => {
    setLoading(true)
    setMsg("")
    setErr("")
    const res = await adminAssignStaffByEmail({ email, role })
    setLoading(false)
    if (res.error) {
      setErr(res.error)
      return
    }
    setMsg(`${res.name || email} → ${STAFF_ROLE_LABELS[role]}`)
    setEmail("")
    await refresh()
  }

  const demote = async (id: string) => {
    setLoading(true)
    const res = await adminSetRole(id, "member")
    setLoading(false)
    if (res.error) setErr(res.error)
    else {
      setMsg("Rôle staff retiré.")
      await refresh()
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Nommer un collaborateur">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          La personne doit déjà avoir un compte KELIAA. Vous choisissez ce qu&apos;elle peut faire
          dans le panneau opérationnel.
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Exclude<StaffRole, "member">)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="moderator">Modérateur</option>
            <option value="editor">Éditeur / publications</option>
            <option value="coach">Coach</option>
            <option value="admin">Administrateur</option>
          </select>
          <button
            type="button"
            disabled={loading || !email.trim()}
            onClick={() => void assign()}
            className="h-11 rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold disabled:opacity-50"
          >
            Nommer
          </button>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
          {(["moderator", "editor", "coach", "admin"] as const).map((r) => (
            <li key={r} className="rounded-xl border border-border/70 bg-secondary/40 px-3 py-2">
              <span className="font-semibold text-foreground">{STAFF_ROLE_LABELS[r]}</span>
              <span className="block mt-0.5">{STAFF_ROLE_DESCRIPTION[r]}</span>
            </li>
          ))}
        </ul>
        {msg ? <p className="mt-3 text-xs text-emerald-700 font-medium">{msg}</p> : null}
        {err ? <p className="mt-3 text-xs text-destructive">{err}</p> : null}
      </SectionCard>

      <SectionCard title="Équipe actuelle">
        <div className="space-y-2">
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun collaborateur listé.</p>
          ) : (
            staff.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border px-3 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {s.role === "admin" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <UsersRound className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{s.firstName}</p>
                    <p className="text-xs text-muted-foreground">
                      {STAFF_ROLE_LABELS[(s.role as StaffRole) || "member"] || s.role}
                    </p>
                  </div>
                </div>
                {s.role !== "admin" ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void demote(s.id)}
                    className="text-xs font-semibold text-destructive hover:underline"
                  >
                    Retirer le rôle staff
                  </button>
                ) : (
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
                    Principal
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  )
}
