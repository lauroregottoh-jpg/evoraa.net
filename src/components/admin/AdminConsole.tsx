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
import {
  ActivityItem,
  AdminShell,
  KpiCard,
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

export function AdminConsole(props: Props) {
  const isFullAdmin = props.viewerRole === "admin"
  const [nav, setNav] = React.useState<AdminNavId>("overview")
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

  const menPct =
    props.retention.menCount + props.retention.womenCount > 0
      ? Math.round(
          (props.retention.menCount /
            (props.retention.menCount + props.retention.womenCount)) *
            100
        )
      : 50

  return (
    <AdminShell
      active={nav}
      onNavigate={setNav}
      badges={{
        photos: props.stats.pendingPhotos,
        reports: props.stats.openReports,
        renewals: props.retention.renewalsDue7d,
      }}
      viewerRole={props.viewerRole}
      search={search}
      onSearch={setSearch}
    >
      {msg && (
        <p className="mb-4 text-xs rounded-xl border border-border bg-card px-3 py-2">{msg}</p>
      )}

      {nav === "overview" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Vue ops KELIAA — membres, Alliance, modération, croissance.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              value={props.stats.pendingPhotos + props.stats.openReports}
              tone={props.stats.pendingPhotos + props.stats.openReports > 0 ? "red" : "default"}
              hint={`${props.stats.pendingPhotos} photos · ${props.stats.openReports} signalements`}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Équilibre H / F</h2>
                <span className="text-xs text-muted-foreground">Pool matching</span>
              </div>
              <div className="flex gap-1 h-10 rounded-xl overflow-hidden">
                <div
                  className="bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
                  style={{ width: `${menPct}%` }}
                >
                  H {props.retention.menCount}
                </div>
                <div
                  className="bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground"
                  style={{ width: `${100 - menPct}%` }}
                >
                  F {props.retention.womenCount}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <MiniStat label="Nouveaux 30j" value={props.retention.newMembers30d} />
                <MiniStat label="Matches 30j" value={props.retention.matches30d} />
                <MiniStat label="Convos 30j" value={props.retention.conversations30d} />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <MiniStat label="Profils ≥70%" value={props.retention.profilesComplete70} />
                <MiniStat label="Renouvellements J-7" value={props.retention.renewalsDue7d} />
                <MiniStat label="Free estimés" value={props.retention.activeFreeEstimate} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold mb-2">Activité récente</h2>
              <div className="max-h-[320px] overflow-y-auto">
                {props.photos.slice(0, 3).map((p) => (
                  <ActivityItem
                    key={p.id}
                    title="Photo en attente"
                    meta={p.profile_id.slice(0, 8) + "…"}
                    badge="Photo"
                    badgeTone="gold"
                  />
                ))}
                {props.reports
                  .filter((r) => r.status === "pending")
                  .slice(0, 3)
                  .map((r) => (
                    <ActivityItem
                      key={r.id}
                      title={r.reason}
                      meta={
                        r.created_at
                          ? new Date(r.created_at).toLocaleDateString("fr-FR")
                          : "—"
                      }
                      badge="Signalement"
                      badgeTone="red"
                    />
                  ))}
                {props.payments.slice(0, 3).map((p) => (
                  <ActivityItem
                    key={p.id}
                    title={`${Number(p.amount).toLocaleString("fr-FR")} FCFA`}
                    meta={p.transaction_reference || "paiement"}
                    badge={p.status || "—"}
                    badgeTone={p.status === "completed" ? "green" : "blue"}
                  />
                ))}
                {props.photos.length === 0 &&
                  props.reports.length === 0 &&
                  props.payments.length === 0 && (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      Pas encore d&apos;activité.
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(
              [
                ["members", "Gérer les membres"],
                ["photos", "Modérer les photos"],
                ["finance", "Voir la finance"],
                ["academy", "Académie du mariage"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setNav(id)}
                className="rounded-2xl border border-border bg-card p-4 text-left text-sm font-semibold hover:border-primary/40 shadow-sm"
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      )}

      {nav === "members" && (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-3">
            <h1 className="font-serif text-2xl font-bold">Membres</h1>
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUser(u.id)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 hover:bg-secondary/50 transition-colors",
                      selectedUser === u.id && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{u.name}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {u.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {u.gender === "M" ? "H" : u.gender === "F" ? "F" : "?"} · {u.city} ·{" "}
                      {u.completion}%
                      {u.verified ? " · vérifié" : ""}
                      {u.hasAvatar ? "" : " · sans photo"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm h-fit sticky top-24 space-y-4">
            {!selected ? (
              <p className="text-sm text-muted-foreground">
                Sélectionnez un membre pour le panneau détail.
              </p>
            ) : (
              <>
                <div>
                  <h3 className="font-serif text-xl font-bold">{selected.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono break-all mt-1">
                    {selected.userId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selected.city} · rôle {selected.role} · onboarding{" "}
                    {selected.onboarding || "—"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === selected.id}
                    onClick={() =>
                      run(selected.id, () =>
                        adminUpdateModerationStatus(selected.id, "approved")
                      )
                    }
                  >
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === selected.id}
                    onClick={() =>
                      run(selected.id, () =>
                        adminUpdateModerationStatus(selected.id, "rejected")
                      )
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
                        run(`g-${selected.id}`, () =>
                          adminGrantAlliance(selected.userId, 30)
                        )
                      }
                    >
                      +30j Alliance
                    </Button>
                  )}
                </div>
                {isFullAdmin && (
                  <div className="space-y-2 border-t border-border pt-3">
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
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Abonnements
                  </p>
                  {userSubs.length === 0 && (
                    <p className="text-xs text-muted-foreground">Aucun</p>
                  )}
                  {userSubs.map((s) => (
                    <p key={s.id} className="text-xs">
                      {planLabel(s.plan)} · {s.status}
                      {s.endsAt
                        ? ` · fin ${new Date(s.endsAt).toLocaleDateString("fr-FR")}`
                        : ""}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {nav === "photos" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Photos à modérer</h1>
          {props.photos.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune photo en attente.</p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
        </div>
      )}

      {nav === "reports" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Signalements</h1>
          {props.reports.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun signalement.</p>
          )}
          <div className="space-y-3">
            {props.reports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium">{r.reason}</p>
                  <Badge variant="outline">{r.status || "pending"}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
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
        </div>
      )}

      {nav === "subs" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Abonnements</h1>
          <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
            {props.subscriptions.length === 0 && (
              <p className="p-5 text-sm text-muted-foreground">Aucun abonnement.</p>
            )}
            {props.subscriptions.map((s) => (
              <div
                key={s.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div>
                  <p className="font-semibold">{planLabel(s.plan)}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                    {s.userId}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  <Badge variant="outline">{s.status}</Badge>
                  <p className="mt-1">
                    {s.startsAt ? new Date(s.startsAt).toLocaleDateString("fr-FR") : "—"} →{" "}
                    {s.endsAt ? new Date(s.endsAt).toLocaleDateString("fr-FR") : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {nav === "finance" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Finance</h1>
          <KpiCard
            label="Total completed"
            value={`${props.stats.revenueXof.toLocaleString("fr-FR")} FCFA`}
            tone="gold"
          />
          <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
            {props.payments.length === 0 && (
              <p className="p-5 text-sm text-muted-foreground">Aucun paiement.</p>
            )}
            {props.payments.map((p) => (
              <div key={p.id} className="p-4 flex justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">
                    {Number(p.amount).toLocaleString("fr-FR")}{" "}
                    {p.currency === "XOF" ? "FCFA" : p.currency}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {p.transaction_reference || "—"}
                  </p>
                </div>
                <Badge variant="outline">{p.status || "—"}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {nav === "retention" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Rétention & croissance</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ["Nouveaux 30j", props.retention.newMembers30d],
              ["Profils ≥ 70%", props.retention.profilesComplete70],
              ["5 tests (échantillon)", props.retention.assessmentsDoneAll],
              ["Free estimés", props.retention.activeFreeEstimate],
              ["Alliance", props.retention.activeAlliance],
              ["Legacy 2 500", props.retention.activeLegacyPremium],
              ["Expirés 30j", props.retention.expiredSubs30d],
              ["Annulés 30j", props.retention.cancelledSubs30d],
              ["Renouvellements J-7", props.retention.renewalsDue7d],
              ["Conversion %", `${props.retention.conversionPaidPct}%`],
              ["Hommes", props.retention.menCount],
              ["Femmes", props.retention.womenCount],
            ].map(([label, value]) => (
              <KpiCard key={String(label)} label={String(label)} value={value} />
            ))}
          </div>
        </div>
      )}

      {nav === "conversations" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Conversations (ops)</h1>
          <p className="text-xs text-muted-foreground">
            Audit — dernières conversations (IDs). Contenu messages non affiché ici.
          </p>
          <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
            {props.conversations.length === 0 && (
              <p className="p-5 text-sm text-muted-foreground">Aucune conversation.</p>
            )}
            {props.conversations.map((c) => (
              <div key={c.id} className="p-4 text-xs font-mono space-y-1">
                <p>convo {c.id}</p>
                <p className="text-muted-foreground">match {c.matchId}</p>
                <p className="text-muted-foreground">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString("fr-FR") : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {nav === "academy" && (
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl font-bold">Académie du mariage</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {ACADEMY_MODULES.length} modules ·{" "}
                {ACADEMY_MODULES.reduce((n, m) => n + m.lessons.length, 0)} leçons publiées
              </p>
            </div>
            <Link href="/academie-mariage" className="text-sm font-semibold text-primary">
              Voir côté membre →
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
                <p className="text-xs font-semibold text-primary">
                  {m.lessons.length} leçons
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 pt-1">
                  {m.lessons.map((l) => (
                    <li key={l.slug}>· {l.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {nav === "settings" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Paramètres plateforme</h1>
          {!isFullAdmin && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              Lecture seule pour les modérateurs.
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <p className="font-semibold text-sm">Seuil compatibilité EVA</p>
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
            </div>
            <ToggleSetting
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
            <ToggleSetting
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
            <ToggleSetting
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
        </div>
      )}

      {nav === "system" && (
        <div className="space-y-4">
          <h1 className="font-serif text-2xl font-bold">Système</h1>
          <div className="grid sm:grid-cols-2 gap-3">
            <FlagRow label="URL app" value={props.ops.appUrl || "—"} ok={Boolean(props.ops.appUrl)} />
            <FlagRow
              label="Paiements démo"
              value={props.ops.paymentsDemoMode ? "ON" : "OFF"}
              ok={!props.ops.paymentsDemoMode}
            />
            <FlagRow label="CinetPay" value={props.ops.hasCinetPay ? "Oui" : "Non"} ok={props.ops.hasCinetPay} />
            <FlagRow label="Resend" value={props.ops.hasResend ? "Oui" : "Non"} ok={props.ops.hasResend} />
            <FlagRow label="CRON_SECRET" value={props.ops.hasCronSecret ? "Oui" : "Non"} ok={props.ops.hasCronSecret} />
            <FlagRow label="SERVICE_ROLE" value={props.ops.hasServiceRole ? "Oui" : "Non"} ok={props.ops.hasServiceRole} />
          </div>
          {isFullAdmin && (
            <Button
              size="sm"
              variant="outline"
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
        </div>
      )}
    </AdminShell>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary/50 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-serif text-xl font-bold">{value}</p>
    </div>
  )
}

function ToggleSetting({
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

function FlagRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex justify-between gap-2 text-sm shadow-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", ok ? "text-emerald-700" : "text-amber-700")}>{value}</span>
    </div>
  )
}
