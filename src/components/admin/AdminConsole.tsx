"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  adminGrantAlliance,
  adminModeratePhoto,
  adminPingServiceRole,
  adminResolveReport,
  adminSetRole,
  adminSetVerified,
  adminUpdateModerationStatus,
  adminUpdatePlatformSetting,
  type AdminOpsFlags,
  type AdminRetention,
  type PlatformSettingRow,
} from "@/app/actions/admin"
import { ACADEMY_MODULES } from "@/lib/academy/modules"
import { PLANS } from "@/lib/billing/plans"
import {
  AdminShell,
  FunnelBar,
  KpiCard,
  SectionCard,
  type AdminNavId,
} from "@/components/admin/AdminShell"
import { cn } from "@/utils/cn"

type Props = {
  stats: {
    users: number
    activeSubscriptions: number
    openReports: number
    pendingPhotos: number
    revenueXof: number
  }
  retention: AdminRetention
  ops: AdminOpsFlags
  viewerRole: string | null
  settings: PlatformSettingRow[]
  users: Array<{
    id: string
    userId: string
    name: string
    city: string
    gender: string
    completion: number
    role: string
    status: string
    onboarding: string | null
    verified: boolean
    hasAvatar: boolean
    createdAt: string | null
  }>
  reports: Array<{
    id: string
    reason: string
    status: string | null
    created_at: string | null
    reported_user_id: string
  }>
  payments: Array<{
    id: string
    amount: number
    currency: string
    status: string | null
    transaction_reference: string | null
    created_at: string | null
  }>
  photos: Array<{
    id: string
    photo_url: string
    status: string | null
    profile_id: string
  }>
  subscriptions: Array<{
    id: string
    userId: string
    plan: string
    status: string
    startsAt: string | null
    endsAt: string | null
    createdAt: string | null
  }>
  conversations: Array<{
    id: string
    matchId: string
    createdAt: string | null
  }>
}

function planLabel(plan: string) {
  if (plan === "premium_plus") return "Alliance"
  if (plan === "premium") return "Essentiel (legacy)"
  return plan
}

function settingBool(settings: PlatformSettingRow[], key: string, fallback = false) {
  const row = settings.find((s) => s.key === key)
  if (!row) return fallback
  return row.value === true || row.value === "true"
}

function settingNum(settings: PlatformSettingRow[], key: string, fallback: number) {
  const row = settings.find((s) => s.key === key)
  if (row == null || row.value == null) return fallback
  const n = Number(row.value)
  return Number.isFinite(n) ? n : fallback
}

function settingText(settings: PlatformSettingRow[], key: string, fallback = "") {
  const row = settings.find((s) => s.key === key)
  if (row == null || row.value == null) return fallback
  if (typeof row.value === "string") return row.value.replace(/^"|"$/g, "")
  return String(row.value)
}

export function AdminConsole(props: Props) {
  const isFullAdmin = props.viewerRole === "admin"
  const [nav, setNav] = React.useState<AdminNavId>("dashboard")
  const [modTab, setModTab] = React.useState<"photos" | "reports" | "pending">("photos")
  const [search, setSearch] = React.useState("")
  const [busy, setBusy] = React.useState("")
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null)
  const [msg, setMsg] = React.useState<string | null>(null)
  const [threshold, setThreshold] = React.useState(() =>
    settingNum(props.settings, "min_compatibility_threshold", 85)
  )
  const [maintenance, setMaintenance] = React.useState(() =>
    settingBool(props.settings, "maintenance_mode", false)
  )
  const [blur, setBlur] = React.useState(() =>
    settingBool(props.settings, "default_photo_blur", true)
  )
  const [charter, setCharter] = React.useState(() =>
    settingBool(props.settings, "require_charter", true)
  )
  const [notes, setNotes] = React.useState(() =>
    settingText(props.settings, "soft_launch_notes", "Invitez H+F, approuvez les photos vite.")
  )

  const filteredUsers = props.users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()) ||
      u.userId.toLowerCase().includes(search.toLowerCase())
  )

  const selected = props.users.find((u) => u.id === selectedUser) ?? null
  const userSubs = selected
    ? props.subscriptions.filter((s) => s.userId === selected.userId)
    : []
  const pendingUsers = props.users.filter((u) => u.status === "pending")

  const run = async (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => {
    setBusy(key)
    setMsg(null)
    try {
      const res = await fn()
      if (res.error) setMsg(res.error)
      else setMsg("Enregistré.")
    } finally {
      setBusy("")
    }
  }

  const menTotal = props.retention.menCount + props.retention.womenCount
  const menPct = menTotal > 0 ? Math.round((props.retention.menCount / menTotal) * 100) : 50
  const moderationBadge =
    props.stats.pendingPhotos + props.stats.openReports + props.retention.pendingProfiles

  React.useEffect(() => {
    if (search && nav !== "members") setNav("members")
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdminShell
      active={nav}
      onNavigate={setNav}
      badges={{ moderation: moderationBadge, renewals: props.retention.renewalsDue7d }}
      viewerRole={props.viewerRole}
      search={search}
      onSearch={setSearch}
    >
      {msg && (
        <p className="mb-4 text-xs rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
          {msg}
        </p>
      )}

      {/* ——— 1. DASHBOARD ——— */}
      {nav === "dashboard" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Vue d&apos;ensemble ops — style DASHBOARD 1–4, données KELIAA live.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Membres" value={props.stats.users} hint="Profils totaux" />
            <KpiCard
              label="Alliance actives"
              value={props.retention.activeAlliance}
              tone="green"
              hint={`${props.retention.conversionPaidPct}% conversion`}
            />
            <KpiCard
              label="Revenus"
              value={`${props.stats.revenueXof.toLocaleString("fr-FR")} F`}
              tone="gold"
              hint="Paiements completed"
            />
            <KpiCard
              label="À traiter"
              value={moderationBadge}
              tone={moderationBadge > 0 ? "red" : "default"}
              hint={`${props.stats.pendingPhotos} photos · ${props.stats.openReports} signalements`}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <SectionCard title="Équilibre H / F" className="lg:col-span-2">
              <div className="flex h-12 rounded-xl overflow-hidden mb-4">
                <div
                  className="bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold"
                  style={{ width: `${menPct}%` }}
                >
                  H {props.retention.menCount}
                </div>
                <div
                  className="bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold"
                  style={{ width: `${100 - menPct}%` }}
                >
                  F {props.retention.womenCount}
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                {[
                  ["Nouveaux 30j", props.retention.newMembers30d],
                  ["Matches 30j", props.retention.matches30d],
                  ["Convos 30j", props.retention.conversations30d],
                  ["Renouvel. J-7", props.retention.renewalsDue7d],
                ].map(([l, v]) => (
                  <div key={String(l)} className="rounded-xl bg-secondary/60 px-3 py-2.5">
                    <p className="text-[11px] text-muted-foreground">{l}</p>
                    <p className="font-serif text-xl font-bold">{v}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Activité récente">
              <div className="space-y-0 max-h-72 overflow-y-auto">
                {props.photos.slice(0, 4).map((p) => (
                  <ActivityRow
                    key={p.id}
                    title="Photo en attente"
                    meta={p.profile_id.slice(0, 10) + "…"}
                    badge="Photo"
                    tone="gold"
                  />
                ))}
                {props.reports
                  .filter((r) => r.status === "pending")
                  .slice(0, 3)
                  .map((r) => (
                    <ActivityRow
                      key={r.id}
                      title={r.reason}
                      meta={
                        r.created_at
                          ? new Date(r.created_at).toLocaleDateString("fr-FR")
                          : "—"
                      }
                      badge="Alerte"
                      tone="red"
                    />
                  ))}
                {props.payments.slice(0, 3).map((p) => (
                  <ActivityRow
                    key={p.id}
                    title={`${Number(p.amount).toLocaleString("fr-FR")} FCFA`}
                    meta={p.transaction_reference || "paiement"}
                    badge={p.status || "—"}
                    tone={p.status === "completed" ? "green" : "blue"}
                  />
                ))}
                {props.photos.length + props.reports.length + props.payments.length === 0 && (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Pas encore d&apos;activité.
                  </p>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(
              [
                ["members", "Gérer les membres"],
                ["moderation", "Ouvrir la modération"],
                ["alliance", "Alliance & paiements"],
                ["academy", "Académie du mariage"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setNav(id)}
                className="rounded-2xl border border-border bg-card p-4 text-left text-sm font-semibold shadow-sm hover:border-primary/40 transition-colors"
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ——— 2. ANALYTIQUE ——— */}
      {nav === "analytics" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Analytique</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Funnel, engagement social, conversion Free → Alliance.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard title="Funnel conversion">
              <div className="space-y-4">
                <FunnelBar label="Inscriptions" value={props.stats.users} max={props.stats.users} />
                <FunnelBar
                  label="Profil ≥ 70%"
                  value={props.retention.profilesComplete70}
                  max={props.stats.users}
                />
                <FunnelBar
                  label="5 tests (échantillon)"
                  value={props.retention.assessmentsDoneAll}
                  max={Math.max(props.users.length, 1)}
                />
                <FunnelBar
                  label="Conversations 30j"
                  value={props.retention.conversations30d}
                  max={props.stats.users}
                />
                <FunnelBar
                  label="Alliance actives"
                  value={props.retention.activeAlliance}
                  max={props.stats.users}
                />
              </div>
            </SectionCard>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <KpiCard label="Visites profil 30j" value={props.retention.views30d} />
                <KpiCard label="Favoris totaux" value={props.retention.favoritesTotal} />
                <KpiCard
                  label="Conversion payante"
                  value={`${props.retention.conversionPaidPct}%`}
                  tone="green"
                />
                <KpiCard
                  label="Churn proxy 30j"
                  value={props.retention.expiredSubs30d + props.retention.cancelledSubs30d}
                  tone="red"
                  hint="Expirés + annulés"
                />
              </div>
              <SectionCard title="Lecture soft launch">
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                  <li>Visez un pool H/F équilibré sinon matching vide d&apos;un côté.</li>
                  <li>Photos en attente = frein n°1 à la découverte.</li>
                  <li>Renouvellements J-7 : {props.retention.renewalsDue7d} Alliance à rappeler.</li>
                </ul>
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* ——— 3. MEMBRES ——— */}
      {nav === "members" && (
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Membres</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Table + panneau détail (inspiré DASHBOARD 3).
            </p>
          </div>
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="text-left font-semibold px-4 py-3">Membre</th>
                      <th className="text-left font-semibold px-2 py-3">Ville</th>
                      <th className="text-left font-semibold px-2 py-3">%</th>
                      <th className="text-left font-semibold px-2 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedUser(u.id)}
                        className={cn(
                          "cursor-pointer hover:bg-secondary/40",
                          selectedUser === u.id && "bg-primary/5"
                        )}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {u.gender === "M" ? "H" : u.gender === "F" ? "F" : "?"} · {u.role}
                            {u.verified ? " · ✓" : ""}
                          </p>
                        </td>
                        <td className="px-2 py-3 text-muted-foreground">{u.city}</td>
                        <td className="px-2 py-3 font-medium">{u.completion}%</td>
                        <td className="px-2 py-3">
                          <StatusPill status={u.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <MemberDetailPanel
              selected={selected}
              userSubs={userSubs}
              busy={busy}
              isFullAdmin={isFullAdmin}
              run={run}
            />
          </div>
        </div>
      )}

      {/* ——— 4. MODÉRATION ——— */}
      {nav === "moderation" && (
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Modération</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Photos · Signalements · Profils en attente.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                ["photos", `Photos (${props.photos.length})`],
                ["reports", `Signalements (${props.stats.openReports})`],
                ["pending", `Profils (${pendingUsers.length})`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setModTab(id)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold border",
                  modTab === id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {modTab === "photos" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {props.photos.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">Aucune photo en attente.</p>
              )}
              {props.photos.map((ph) => (
                <div
                  key={ph.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ph.photo_url} alt="" className="w-full aspect-square object-cover" />
                  <div className="p-3 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={busy === ph.id}
                      onClick={() => run(ph.id, () => adminModeratePhoto(ph.id, "approved"))}
                    >
                      OK
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      disabled={busy === ph.id}
                      onClick={() => run(ph.id, () => adminModeratePhoto(ph.id, "rejected"))}
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {modTab === "reports" && (
            <div className="space-y-3">
              {props.reports.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun signalement.</p>
              )}
              {props.reports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2"
                >
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-medium">{r.reason}</p>
                    <Badge variant="outline">{r.status || "pending"}</Badge>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {r.reported_user_id}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === r.id}
                      onClick={() => run(r.id, () => adminResolveReport(r.id, "resolved"))}
                    >
                      Résolu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === r.id}
                      onClick={() => run(r.id, () => adminResolveReport(r.id, "dismissed"))}
                    >
                      Ignorer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {modTab === "pending" && (
            <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
              {pendingUsers.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">Aucun profil pending.</p>
              )}
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.city} · {u.completion}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === u.id}
                      onClick={() =>
                        run(u.id, () => adminUpdateModerationStatus(u.id, "approved"))
                      }
                    >
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === u.id}
                      onClick={() =>
                        run(u.id, () => adminUpdateModerationStatus(u.id, "rejected"))
                      }
                    >
                      Rejeter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ——— 5. ALLIANCE ——— */}
      {nav === "alliance" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Alliance & paiements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Abonnements, revenus, renouvellements J-7.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Alliance" value={props.retention.activeAlliance} tone="green" />
            <KpiCard label="Legacy 2 500" value={props.retention.activeLegacyPremium} />
            <KpiCard
              label="Revenus"
              value={`${props.stats.revenueXof.toLocaleString("fr-FR")} F`}
              tone="gold"
            />
            <KpiCard
              label="J-7 à rappeler"
              value={props.retention.renewalsDue7d}
              tone={props.retention.renewalsDue7d > 0 ? "red" : "default"}
            />
          </div>
          <p className="text-xs rounded-xl border border-border bg-card px-3 py-2">
            Paiements démo :{" "}
            <strong>{props.ops.paymentsDemoMode ? "ON" : "OFF"}</strong>
            {" · "}
            CinetPay : <strong>{props.ops.hasCinetPay ? "configuré" : "non"}</strong>
          </p>
          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard title="Abonnements récents">
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {props.subscriptions.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">Aucun.</p>
                )}
                {props.subscriptions.map((s) => (
                  <div key={s.id} className="py-3 flex justify-between gap-2 text-sm">
                    <div>
                      <p className="font-semibold">{planLabel(s.plan)}</p>
                      <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[200px]">
                        {s.userId}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <StatusPill status={s.status} />
                      <p className="mt-1">
                        {s.endsAt ? new Date(s.endsAt).toLocaleDateString("fr-FR") : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Paiements">
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {props.payments.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">Aucun.</p>
                )}
                {props.payments.map((p) => (
                  <div key={p.id} className="py-3 flex justify-between gap-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {Number(p.amount).toLocaleString("fr-FR")} FCFA
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {p.transaction_reference || "—"}
                      </p>
                    </div>
                    <Badge variant="outline">{p.status || "—"}</Badge>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ——— 6. MATCHING ——— */}
      {nav === "matching" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Matching & conversations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Santé du matching · audit conversations.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Matches 30j" value={props.retention.matches30d} />
            <KpiCard label="Conversations 30j" value={props.retention.conversations30d} />
            <KpiCard label="Hommes" value={props.retention.menCount} />
            <KpiCard label="Femmes" value={props.retention.womenCount} />
          </div>
          {Math.abs(props.retention.menCount - props.retention.womenCount) > 5 &&
            menTotal > 0 && (
              <p className="text-sm rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3">
                Alerte matching : déséquilibre H/F important. Invitez le côté minoritaire.
              </p>
            )}
          <SectionCard title="Dernières conversations (ops)">
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {props.conversations.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">Aucune.</p>
              )}
              {props.conversations.map((c) => (
                <div key={c.id} className="py-3 text-xs font-mono space-y-0.5">
                  <p>convo {c.id}</p>
                  <p className="text-muted-foreground">match {c.matchId}</p>
                  <p className="text-muted-foreground">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString("fr-FR") : "—"}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ——— 7. ACADÉMIE ——— */}
      {nav === "academy" && (
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold">Académie</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {ACADEMY_MODULES.length} modules ·{" "}
                {ACADEMY_MODULES.reduce((n, m) => n + m.lessons.length, 0)} leçons
              </p>
            </div>
            <Link href="/academie-mariage" className="text-sm font-semibold text-primary">
              Aperçu membre →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {ACADEMY_MODULES.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2"
              >
                <p className="font-serif text-lg font-bold">{m.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.summary}</p>
                <p className="text-xs font-semibold text-primary">{m.lessons.length} leçons</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {m.lessons.map((l) => (
                    <li key={l.slug}>· {l.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ——— 8. EVA ——— */}
      {nav === "eva" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Coach EVA</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quotas coach local (sans LLM V1) — style Farata Coach.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <KpiCard
              label="Quota Free / jour"
              value={PLANS.free.limits.evaQuestionsPerDay}
              hint="Découverte"
            />
            <KpiCard
              label="Quota Alliance / jour"
              value={PLANS.premium_plus.limits.evaQuestionsPerDay}
              tone="green"
              hint="Alliance"
            />
            <KpiCard label="Mode" value="Local FAQ" hint="Pas de coût API LLM" />
          </div>
          <SectionCard title="Actions">
            <div className="flex flex-wrap gap-3">
              <Link href="/help">
                <Button variant="outline" size="sm">
                  Ouvrir EVA (membre)
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground self-center">
                Les réponses V1 sont locales. LLM éventuel = V2 derrière Alliance.
              </p>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ——— 9. MARKETING ——— */}
      {nav === "marketing" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Contenu & marketing</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Notes soft launch, bannières, messages ops.
            </p>
          </div>
          <SectionCard title="Notes soft launch">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!isFullAdmin}
              rows={4}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            {isFullAdmin && (
              <Button
                size="sm"
                className="mt-3"
                disabled={busy === "notes"}
                onClick={() =>
                  run("notes", () => adminUpdatePlatformSetting("soft_launch_notes", notes))
                }
              >
                Enregistrer
              </Button>
            )}
          </SectionCard>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-accent/40 bg-[#F7F0E0] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">
                Bannière type Farata
              </p>
              <p className="font-semibold text-sm mt-2">Profil sans photo = invisible</p>
              <p className="text-xs text-muted-foreground mt-1">
                Affichée côté membre Accueil si pas d&apos;avatar.
              </p>
            </div>
            <div className="rounded-2xl border border-primary bg-primary text-primary-foreground p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-accent">Alliance</p>
              <p className="font-semibold text-sm mt-2">Passe Alliance — accélère les échanges</p>
              <p className="text-xs text-primary-foreground/75 mt-1">
                Bannière upgrade Free → Alliance sur l&apos;accueil membre.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ——— 10. PARAMÈTRES ——— */}
      {nav === "settings" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Paramètres</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Plateforme · santé système · rôles.
            </p>
          </div>
          {!isFullAdmin && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              Lecture seule pour les modérateurs.
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <SectionCard title="Seuil compatibilité EVA">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={70}
                  max={95}
                  value={threshold}
                  disabled={!isFullAdmin}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="font-serif font-bold w-10 text-right">{threshold}%</span>
              </div>
              {isFullAdmin && (
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={busy === "thr"}
                  onClick={() =>
                    run("thr", () =>
                      adminUpdatePlatformSetting("min_compatibility_threshold", threshold)
                    )
                  }
                >
                  Enregistrer
                </Button>
              )}
            </SectionCard>
            <ToggleRow
              title="Mode maintenance"
              value={maintenance}
              disabled={!isFullAdmin}
              onToggle={() => {
                const next = !maintenance
                setMaintenance(next)
                if (isFullAdmin) {
                  void run("maint", () =>
                    adminUpdatePlatformSetting("maintenance_mode", next)
                  )
                }
              }}
            />
            <ToggleRow
              title="Floutage photos"
              value={blur}
              disabled={!isFullAdmin}
              onToggle={() => {
                const next = !blur
                setBlur(next)
                if (isFullAdmin) {
                  void run("blur", () =>
                    adminUpdatePlatformSetting("default_photo_blur", next)
                  )
                }
              }}
            />
            <ToggleRow
              title="Charte obligatoire"
              value={charter}
              disabled={!isFullAdmin}
              onToggle={() => {
                const next = !charter
                setCharter(next)
                if (isFullAdmin) {
                  void run("charter", () =>
                    adminUpdatePlatformSetting("require_charter", next)
                  )
                }
              }}
            />
          </div>
          <SectionCard title="Santé système">
            <div className="grid sm:grid-cols-2 gap-2">
              <Flag label="URL app" value={props.ops.appUrl || "—"} ok={Boolean(props.ops.appUrl)} />
              <Flag
                label="Paiements démo"
                value={props.ops.paymentsDemoMode ? "ON" : "OFF"}
                ok={!props.ops.paymentsDemoMode}
              />
              <Flag label="CinetPay" value={props.ops.hasCinetPay ? "Oui" : "Non"} ok={props.ops.hasCinetPay} />
              <Flag label="Resend" value={props.ops.hasResend ? "Oui" : "Non"} ok={props.ops.hasResend} />
              <Flag label="CRON" value={props.ops.hasCronSecret ? "Oui" : "Non"} ok={props.ops.hasCronSecret} />
              <Flag
                label="SERVICE_ROLE"
                value={props.ops.hasServiceRole ? "Oui" : "Non"}
                ok={props.ops.hasServiceRole}
              />
            </div>
            {isFullAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                disabled={busy === "ping"}
                onClick={() =>
                  run("ping", async () => {
                    const r = await adminPingServiceRole()
                    if (!r.ok) return { error: r.error || "Échec" }
                    return { success: true }
                  })
                }
              >
                Tester service role
              </Button>
            )}
          </SectionCard>
        </div>
      )}
    </AdminShell>
  )
}

function MemberDetailPanel({
  selected,
  userSubs,
  busy,
  isFullAdmin,
  run,
}: {
  selected: Props["users"][0] | null
  userSubs: Props["subscriptions"]
  busy: string
  isFullAdmin: boolean
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
}) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm h-fit sticky top-24 space-y-4">
      {!selected ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Sélectionnez un membre dans la table.
        </p>
      ) : (
        <>
          <div>
            <h3 className="font-serif text-xl font-bold">{selected.name}</h3>
            <p className="text-[11px] font-mono text-muted-foreground break-all mt-1">
              {selected.userId}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {selected.city} · {selected.completion}% · {selected.role}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busy === selected.id}
              onClick={() =>
                run(selected.id, () => adminUpdateModerationStatus(selected.id, "approved"))
              }
            >
              Approuver
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy === selected.id}
              onClick={() =>
                run(selected.id, () => adminUpdateModerationStatus(selected.id, "rejected"))
              }
            >
              Suspendre
            </Button>
            <Button
              size="sm"
              disabled={busy === `v-${selected.id}`}
              onClick={() =>
                run(`v-${selected.id}`, () =>
                  adminSetVerified(selected.id, !selected.verified)
                )
              }
            >
              {selected.verified ? "Retirer vérif." : "Vérifier"}
            </Button>
            {isFullAdmin && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy === `g-${selected.id}`}
                onClick={() =>
                  run(`g-${selected.id}`, () => adminGrantAlliance(selected.userId, 30))
                }
              >
                +30j Alliance
              </Button>
            )}
          </div>
          {isFullAdmin && (
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Rôle
              </p>
              <div className="flex flex-wrap gap-2">
                {(["member", "moderator", "admin"] as const).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={selected.role === r ? "default" : "outline"}
                    disabled={busy === `role-${selected.id}`}
                    onClick={() =>
                      run(`role-${selected.id}`, () => adminSetRole(selected.id, r))
                    }
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-border pt-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Abonnements
            </p>
            {userSubs.length === 0 && (
              <p className="text-xs text-muted-foreground">Aucun</p>
            )}
            {userSubs.map((s) => (
              <p key={s.id} className="text-xs">
                {planLabel(s.plan)} · {s.status}
                {s.endsAt ? ` · fin ${new Date(s.endsAt).toLocaleDateString("fr-FR")}` : ""}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ActivityRow({
  title,
  meta,
  badge,
  tone,
}: {
  title: string
  meta: string
  badge: string
  tone: "gold" | "red" | "green" | "blue"
}) {
  return (
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-border/50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground">{meta}</p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[10px] font-bold uppercase rounded-full px-2 py-0.5",
          tone === "gold" && "bg-accent/20 text-accent-foreground",
          tone === "red" && "bg-red-100 text-red-700",
          tone === "green" && "bg-emerald-100 text-emerald-800",
          tone === "blue" && "bg-sky-100 text-sky-800"
        )}
      >
        {badge}
      </span>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "approved" || status === "active" || status === "completed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "rejected" || status === "expired" || status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-800"
  return (
    <span className={cn("text-[10px] font-bold uppercase rounded-full px-2 py-0.5", tone)}>
      {status}
    </span>
  )
}

function ToggleRow({
  title,
  value,
  disabled,
  onToggle,
}: {
  title: string
  value: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between gap-3">
      <p className="text-sm font-semibold">{title}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "h-8 px-3 rounded-lg text-xs font-semibold",
          value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
          disabled && "opacity-50"
        )}
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  )
}

function Flag({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-border px-3 py-2.5 flex justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", ok ? "text-emerald-700" : "text-amber-700")}>
        {value}
      </span>
    </div>
  )
}
