"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  adminApplySanction,
  adminGrantAlliance,
  adminModeratePhoto,
  adminPingServiceRole,
  adminResolveReport,
  adminSetRole,
  adminSetVerified,
  adminUpdateModerationStatus,
  adminUpdatePlatformSetting,
  type AdminBreakdowns,
  type AdminOpsFlags,
  type AdminRetention,
  type PlatformSettingRow,
} from "@/app/actions/admin"
import { ACADEMY_MODULES } from "@/lib/academy/modules"
import { PLANS } from "@/lib/billing/plans"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import { AdminCouplePanel } from "@/components/admin/AdminCouplePanel"
import {
  AdminCoachingPanel,
  AdminProductsHub,
} from "@/components/admin/AdminCoachingPanel"
import {
  AdminShell,
  FunnelBar,
  KpiCard,
  SectionCard,
  type AdminNavId,
} from "@/components/admin/AdminShell"
import {
  AcademyEditor,
  AdsEditor,
  AppTextsEditor,
  AutoModerationPanel,
  CreateMemberForm,
} from "@/components/admin/AdminOpsEditors"
import {
  AnalyticsRichPanel,
  EvaConfigEditor,
  IntegrationsEditor,
  MembersAdvancedPanel,
  PhotoRulesEditor,
  ProfilesHubPanel,
  SanctionRulesEditor,
  YoutubeConfigEditor,
} from "@/components/admin/AdminOpsV2Panels"
import { MatchingIntelligencePanel } from "@/components/admin/AdminMatchingIntelligence"
import { AdminEngagementBriefing } from "@/components/admin/AdminEngagementBriefing"
import { AdminLoyaltyPanel, AdminLoyaltyAllianceNote } from "@/components/admin/AdminLoyaltyPanel"
import { AdminMemberMessagesPanel } from "@/components/admin/AdminMemberMessagesPanel"
import { AdminStaffTeamPanel } from "@/components/admin/AdminStaffTeamPanel"
import { PendingProfilesQueue } from "@/components/admin/PendingProfilesQueue"
import { AdminFeedbackPanel } from "@/components/admin/AdminFeedbackPanel"
import { AdminUsersValidationTable } from "@/components/admin/AdminUsersValidationTable"
import { PHOTO_REJECT_REASONS } from "@/lib/admin/moderationCatalog"
import {
  BictorysSandboxPanel,
  PaymentsAuditPanel,
} from "@/components/admin/AdminPaymentsPanels"
import { AdminOpsAuditPanel } from "@/components/admin/AdminOpsAuditPanel"
import { AdminOpsHealthBanner } from "@/components/admin/AdminOpsHealthBanner"
import {
  AdminIndependentPaymentsDashboardCard,
  AdminPaymentLinksPanel,
} from "@/components/admin/AdminPaymentLinksPanel"
import { DistBars, SparkColumns } from "@/components/admin/AdminCharts"
import { isIndependentPaymentMetadata } from "@/lib/billing/adminPaymentLinks"
import { cn } from "@/utils/cn"
import type { MatchingIntelligence } from "@/lib/admin/matchingIntelligence"
import type { FeedbackRow } from "@/app/actions/feedback"

type Props = {
  stats: {
    users: number
    activeSubscriptions: number
    openReports: number
    pendingPhotos: number
    revenueXof: number
    independentRevenueXof: number
  }
  retention: AdminRetention
  breakdowns: AdminBreakdowns
  ops: AdminOpsFlags
  viewerRole: string | null
  settings: PlatformSettingRow[]
  users: Array<{
    id: string
    userId: string
    name: string
    city: string
    country: string
    gender: string
    age: number | null
    denomination: string
    church: string
    pastorName: string
    completion: number
    role: string
    status: string
    onboarding: string | null
    verified: boolean
    hasAvatar: boolean
    createdAt: string | null
    trustScore: number
    warningCount: number
    sanctionStatus: string
    hasBiography?: boolean
    hasTestimony?: boolean
    hasMaritalStatus?: boolean
    missing?: string[]
    email?: string | null
    firstName?: string
    lastName?: string
    pillarsCompleted?: number
    pillars?: Partial<
      Record<
        "personality" | "spiritual" | "relationship" | "couple_life" | "finances",
        number | null
      >
    >
    profileType?: string
    weakDimensions?: string[]
    spiritualPractice?: string | null
    communicationStyle?: string | null
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
    provider: string | null
    transaction_reference: string | null
    created_at: string | null
    metadata?: unknown
  }>
  paymentEvents: Array<{
    id: string
    paymentId: string | null
    provider: string | null
    eventType: string
    status: string | null
    message: string | null
    createdAt: string | null
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
  matches: Array<{
    id: string
    score: number | null
    status: string | null
    createdAt: string | null
    userOne: string
    userTwo: string
    nameOne?: string
    nameTwo?: string
  }>
  recommendations: Array<{
    id: string
    profileId: string
    recommenderName: string
    recommenderRole: string | null
    churchName: string | null
    status: string
    message: string | null
    createdAt: string | null
  }>
  moderationEvents: Array<{
    id: string
    profileId: string | null
    kind: string
    reason: string | null
    createdAt: string | null
  }>
  feedbackItems: FeedbackRow[]
  matchingIntelligence: MatchingIntelligence
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
  const [paymentsPaused, setPaymentsPaused] = React.useState(() =>
    settingBool(props.settings, "payments_paused", false)
  )
  const [registrationsPaused, setRegistrationsPaused] = React.useState(() =>
    settingBool(props.settings, "registrations_paused", false)
  )
  const [blur, setBlur] = React.useState(() =>
    settingBool(props.settings, "default_photo_blur", false)
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

  const run = async (
    key: string,
    fn: () => Promise<{ error?: string; success?: boolean; message?: string }>
  ) => {
    setBusy(key)
    setMsg(null)
    try {
      const res = await fn()
      if (res.error) setMsg(res.error)
      else setMsg(res.message || "Enregistré.")
    } finally {
      setBusy("")
    }
  }

  const menTotal = props.retention.menCount + props.retention.womenCount
  const menPct = menTotal > 0 ? Math.round((props.retention.menCount / menTotal) * 100) : 50
  const moderationBadge =
    props.stats.pendingPhotos + props.stats.openReports + props.retention.pendingProfiles
  const feedbackBadge = props.feedbackItems.filter((f) => f.status === "new").length

  React.useEffect(() => {
    if (search && nav !== "members") setNav("members")
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdminShell
      active={nav}
      onNavigate={setNav}
      badges={{
        moderation: moderationBadge,
        renewals: props.retention.renewalsDue7d,
        pendingProfiles: props.retention.pendingProfiles,
        feedback: feedbackBadge,
      }}
      viewerRole={props.viewerRole}
      search={search}
      onSearch={setSearch}
    >
      {msg && (
        <p className="mb-4 text-xs rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
          {msg}
        </p>
      )}

      <AdminOpsHealthBanner settings={props.settings} />

      {/* ——— 1. DASHBOARD ——— */}
      {nav === "dashboard" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#7A5F28] mb-1">
                Console ops — pas le dashboard membre
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight">
                Bienvenue Admin
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pilotage KELIAA : membres, Alliance, Couple, Coaching, matching.
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

          {isFullAdmin && (
            <AdminIndependentPaymentsDashboardCard
              totalXof={props.stats.independentRevenueXof}
              onOpen={() => setNav("encaissements")}
            />
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Inscriptions" value={props.stats.users} hint="Profils totaux" />
            <KpiCard
              label="Alliance (premium)"
              value={props.retention.activeAlliance}
              tone="green"
              hint={`${props.retention.conversionPaidPct}% · membres uniques non expirés`}
            />
            <KpiCard
              label="Revenus plateforme"
              value={`${props.stats.revenueXof.toLocaleString("fr-FR")} F`}
              tone="gold"
              hint="Alliance & produits membre — hors encaissements indépendants"
            />
            <KpiCard
              label="À traiter"
              value={moderationBadge}
              tone={moderationBadge > 0 ? "red" : "default"}
              hint={`${props.stats.pendingPhotos} photos · ${props.stats.openReports} signalements`}
            />
          </div>

          <AdminProductsHub
            allianceActive={props.retention.activeAlliance}
            registrations={props.stats.users}
            reportsOpen={props.stats.openReports}
            independentRevenueXof={props.stats.independentRevenueXof}
            showIndependentPayments={isFullAdmin}
            onOpen={(id) => setNav(id)}
          />

          <SectionCard title="Briefing Eva — engagement">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Point du jour : likes (qui like qui), réciproques, scan des discussions et
              lecture des messages. Mis à jour à chaque ouverture, archivé jour par jour.
            </p>
            <Button type="button" onClick={() => setNav("engagement")}>
              Ouvrir le Briefing Eva →
            </Button>
          </SectionCard>

          <SectionCard title="Matching Intelligence — aperçu">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
              <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">Tests 5/5</p>
                <p className="font-serif text-xl font-bold">
                  {props.matchingIntelligence.assessmentsDoneAll}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">Sans test</p>
                <p className="font-serif text-xl font-bold">
                  {props.matchingIntelligence.assessmentsNone}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">Score moyen</p>
                <p className="font-serif text-xl font-bold">
                  {props.matchingIntelligence.avgMatchScore != null
                    ? `${props.matchingIntelligence.avgMatchScore}%`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">Matches ≥85%</p>
                <p className="font-serif text-xl font-bold">
                  {props.matchingIntelligence.highScoreMatches}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">Thème faible #1</p>
                <p className="font-serif text-sm font-bold truncate">
                  {props.matchingIntelligence.weakThemes[0]?.name ?? "—"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNav("matching")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ouvrir Matching Intelligence + segments campagne →
            </button>
          </SectionCard>

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

          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard title="Inscriptions 14 j">
              <SparkColumns items={props.breakdowns.signups14d} />
            </SectionCard>
            <SectionCard title="Top villes">
              <DistBars items={props.breakdowns.byCity.slice(0, 6)} />
            </SectionCard>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {(
              [
                ["members", "Gérer les membres"],
                ["moderation", "Ouvrir la modération"],
                ["alliance", "Alliance & paiements"],
                ["couple", "KELYA Couple"],
                ["coaching", "Coaching"],
                ["vocals", "Vocaux & transcriptions"],
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
        <AnalyticsRichPanel
          breakdowns={props.breakdowns}
          retention={props.retention}
          stats={props.stats}
        />
      )}

      {/* ——— UTILISATEURS (validation type Excel) ——— */}
      {nav === "members" && (
        <div className="space-y-6">
          <AdminUsersValidationTable
            users={props.users.map((u) => ({
              ...u,
              firstName: u.firstName ?? "",
              lastName: u.lastName ?? "",
              email: u.email ?? null,
              hasBiography: u.hasBiography ?? false,
              hasTestimony: u.hasTestimony ?? false,
              hasMaritalStatus: u.hasMaritalStatus ?? false,
              missing: u.missing ?? [],
              pillarsCompleted: u.pillarsCompleted ?? 0,
              pillars: u.pillars ?? {},
              profileType: u.profileType ?? "Sans questionnaire",
              weakDimensions: u.weakDimensions ?? [],
              spiritualPractice: u.spiritualPractice ?? null,
              communicationStyle: u.communicationStyle ?? null,
            }))}
            matches={props.matches}
            busy={busy}
            run={run}
          />
          {isFullAdmin && (
            <details className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm font-semibold text-muted-foreground">
                Options avancées (créer un membre, stats)
              </summary>
              <div className="mt-4 space-y-4">
                <CreateMemberForm isFullAdmin={isFullAdmin} busy={busy} run={run} />
                <MembersAdvancedPanel
                  users={props.users}
                  subscriptions={props.subscriptions}
                  breakdowns={props.breakdowns}
                  isFullAdmin={isFullAdmin}
                  busy={busy}
                  run={run}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                >
                  <MemberDetailPanel
                    selected={selected}
                    userSubs={userSubs}
                    busy={busy}
                    isFullAdmin={isFullAdmin}
                    run={run}
                  />
                </MembersAdvancedPanel>
              </div>
            </details>
          )}
        </div>
      )}

      {/* ——— PROFILS ——— */}
      {nav === "profiles" && (
        <ProfilesHubPanel
          users={props.users}
          recommendations={props.recommendations}
          busy={busy}
          run={run}
        />
      )}

      {/* ——— 4. MODÉRATION ——— */}
      {nav === "moderation" && (
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Modération</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Photos · Signalements · Profils · auto-discernement.
            </p>
          </div>
          <AutoModerationPanel
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
            setMsg={setMsg}
          />
          <PhotoRulesEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <SanctionRulesEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
            setMsg={setMsg}
          />
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
                  <div className="p-3 space-y-2">
                    <select
                      id={`photo-reason-${ph.id}`}
                      className="w-full rounded-xl border border-border bg-background px-2 py-1.5 text-[11px]"
                      defaultValue={PHOTO_REJECT_REASONS[0].id}
                    >
                      {PHOTO_REJECT_REASONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
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
                        onClick={() => {
                          const sel = document.getElementById(
                            `photo-reason-${ph.id}`
                          ) as HTMLSelectElement | null
                          const code = sel?.value || PHOTO_REJECT_REASONS[0].id
                          const label =
                            PHOTO_REJECT_REASONS.find((r) => r.id === code)?.label || code
                          return run(ph.id, () =>
                            adminModeratePhoto(ph.id, "rejected", label)
                          )
                        }}
                      >
                        Refuser
                      </Button>
                    </div>
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
                      onClick={() =>
                        run(r.id, async () => {
                          const resolve = await adminResolveReport(r.id, "resolved")
                          if (resolve.error) return resolve
                          const profile = props.users.find(
                            (u) => u.userId === r.reported_user_id
                          )
                          if (profile) {
                            return adminApplySanction(profile.id, "warn")
                          }
                          return { success: true }
                        })
                      }
                    >
                      Résolu + avertir
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
            <PendingProfilesQueue users={pendingUsers} busy={busy} run={run} />
          )}
        </div>
      )}

      {nav === "feedback" && <AdminFeedbackPanel items={props.feedbackItems} />}

      {nav === "messages" && (
        <AdminMemberMessagesPanel
          isFullAdmin={isFullAdmin}
          selectedUserId={selected?.userId}
          selectedName={selected?.name}
        />
      )}

      {/* ——— 5. ALLIANCE ——— */}
      {nav === "alliance" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Alliance, Boosts & paiements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Abonnements Alliance, packs Boost (visibilite), revenus et renouvellements.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Alliance actives" value={props.retention.activeAlliance} tone="green" />
            <KpiCard
              label="Anciens Essentiel"
              value={props.retention.activeLegacyPremium}
              hint="Plan 2 500 legacy — non vendu aux nouveaux"
            />
            <KpiCard
              label="Revenus Alliance (estim.)"
              value={`${props.stats.revenueXof.toLocaleString("fr-FR")} F`}
              tone="gold"
              hint="Paiements completed — produits membre uniquement"
            />
            <KpiCard
              label="Paiements abandonnés"
              value={props.retention.renewalsDue7d}
              hint="Relances auto (cron) — voir aussi paiements pending"
            />
          </div>
          <div className="rounded-2xl border-2 border-accent/40 bg-accent/10 px-5 py-4 space-y-3">
            <p className="text-sm font-bold text-foreground">Démo paiement Alliance — 17 FCFA</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Validez le parcours live (Bictorys → webhook → Alliance active) avec un micro-montant
              sur ce compte admin.
            </p>
            <a
              href={`${OPS_CONSOLE_PATH}/test-pay`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-accent text-accent-foreground px-5 text-sm font-bold"
            >
              Ouvrir la démo 17 FCFA →
            </a>
            <a
              href={`${OPS_CONSOLE_PATH}/rapport-demo`}
              className="ml-2 inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold"
            >
              Aperçu rapport personnalisé
            </a>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground space-y-1.5">
            <p>
              <strong className="text-foreground">Offre membre :</strong> Alliance ={" "}
              {PLANS.premium_plus.amountXof.toLocaleString("fr-FR")} FCFA / mois (seul plan
              payant public). Le plan 2 500 n’est plus proposé.
            </p>
            <p>
              J-7 à rappeler : <strong>{props.retention.renewalsDue7d}</strong>
            </p>
          </div>
          <AdminLoyaltyAllianceNote />
          <p className="text-xs rounded-xl border border-border bg-card px-3 py-2">
            Paiements démo :{" "}
            <strong>{props.ops.paymentsDemoMode ? "ON" : "OFF"}</strong>
            {" · "}
            Provider : <strong>{props.ops.paymentProvider}</strong>
            {" · "}
            Bictorys : <strong>{props.ops.hasBictorys ? "configuré" : "non"}</strong>
            {props.ops.hasBictorys && (
              <>
                {" · "}
                Mode : <strong>{props.ops.bictorysSandbox ? "sandbox" : "production"}</strong>
              </>
            )}
            {" · "}
            Moneroo : <strong>{props.ops.hasMoneroo ? "configuré" : "non"}</strong>
          </p>
          <BictorysSandboxPanel
            ops={props.ops}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
            setMsg={setMsg}
          />
          <PaymentsAuditPanel
            payments={props.payments.filter((p) => !isIndependentPaymentMetadata(p.metadata))}
            paymentEvents={props.paymentEvents.filter(
              (e) => e.eventType !== "admin_link_checkout"
            )}
          />
          <AdminOpsAuditPanel />
          <div className="grid lg:grid-cols-1 gap-4 max-w-2xl">
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
          </div>
        </div>
      )}

      {nav === "encaissements" && (
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 mb-1">
              Hors plateforme — pas un produit KELIAA
            </p>
            <h1 className="font-serif text-3xl font-bold">Encaissements indépendants</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Coaching, formations, prestations externes : créez un lien de paiement au montant
              libre. L&apos;argent arrive sur votre compte marchand — sans activer Alliance ni
              aucun produit membre. Ces montants ne sont pas comptés dans les revenus plateforme.
            </p>
          </div>
          <KpiCard
            label="Encaissements indépendants (total)"
            value={`${props.stats.independentRevenueXof.toLocaleString("fr-FR")} F`}
            tone="green"
            hint="Coaching & prestations hors app — séparé des revenus Alliance"
          />
          <AdminPaymentLinksPanel
            hasBictorys={Boolean(props.ops.hasBictorys)}
            hasMoneroo={Boolean(props.ops.hasMoneroo)}
            paymentProvider={props.ops.paymentProvider}
            bictorysPaymentModes={props.ops.bictorysPaymentModes}
            embedded
          />
        </div>
      )}

      {nav === "couple" && <AdminCouplePanel />}
      {nav === "coaching" && <AdminCoachingPanel />}

      {nav === "engagement" && <AdminEngagementBriefing isFullAdmin={isFullAdmin} />}
      {nav === "vocals" && (
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Vocaux & retranscriptions</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Onglet Discussions : écoutez les vocaux membres et relancez la
              retranscription. Le texte n’est jamais montré à l’autre personne.
              Les séances coaching (LiveKit) remplissent aussi l’onglet
              Transcriptions du menu Coaching.
            </p>
          </div>
          <AdminEngagementBriefing
            isFullAdmin={isFullAdmin}
            defaultTab="conversations"
          />
        </div>
      )}

      {/* ——— 6. MATCHING INTELLIGENCE ——— */}
      {nav === "matching" && (
        <div className="space-y-8">
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Matching Intelligence</strong> = où le moteur
            peine (tests incomplets, axes faibles, équilibre H/F, âge). Utilisez les campagnes /
            messages pour relancer les membres concernés. Les KPI ci-dessous mesurent
            l’activité réelle (matches, conversations).
          </div>
          <MatchingIntelligencePanel
            intelligence={props.matchingIntelligence}
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />

          <div className="border-t border-border pt-6 space-y-4">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Qui a été matché avec qui
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Paires enregistrées (noms + % d’harmonie). Les scores des tests
                sont dans l’onglet Membres ci-dessus. Cliquez « Calculer les
                matchs maintenant » pour relancer tout le bassin et envoyer
                notifications + mails.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard label="Matches 30j" value={props.retention.matches30d} />
              <KpiCard label="Conversations 30j" value={props.retention.conversations30d} />
              <KpiCard
                label="Taux matching"
                value={`${props.breakdowns.matchingRatePct}%`}
                tone="green"
              />
              <KpiCard
                label="Hommes / Femmes"
                value={`${props.retention.menCount}/${props.retention.womenCount}`}
              />
            </div>
            {Math.abs(props.retention.menCount - props.retention.womenCount) > 5 &&
              menTotal > 0 && (
                <p className="text-sm rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3">
                  Alerte matching : déséquilibre H/F important. Invitez le côté minoritaire.
                </p>
              )}
            <div className="grid lg:grid-cols-2 gap-4">
              <SectionCard title="Paires · nom ↔ nom · score %">
                <div className="divide-y divide-border max-h-[28rem] overflow-y-auto">
                  {props.matches.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4">
                      Aucun match en base. Lancez « Calculer les matchs
                      maintenant » plus haut.
                    </p>
                  )}
                  {props.matches.map((m) => (
                    <div key={m.id} className="py-3 text-sm space-y-1">
                      <div className="flex justify-between gap-2 items-start">
                        <p className="font-semibold text-foreground">
                          {m.nameOne || "Membre"} ↔ {m.nameTwo || "Membre"}
                        </p>
                        <span className="shrink-0 rounded-full bg-[#7F5557] text-[#F2EBE0] text-xs font-bold px-2.5 py-1">
                          {m.score != null ? `${Math.round(m.score)}%` : "—"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <Badge variant="outline">{m.status || "—"}</Badge>
                        <span>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleString("fr-FR")
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="Conversations (ops)">
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
          </div>
        </div>
      )}

      {/* ——— 7. ACADÉMIE ——— */}
      {nav === "academy" && (
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold">Académie</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Éditer titres, sous-titres, résumés, URL vidéo, exercices, points clés ·{" "}
                {ACADEMY_MODULES.length} modules ·{" "}
                {ACADEMY_MODULES.reduce((n, m) => n + m.lessons.length, 0)} leçons. Les contenus
                de base vivent aussi dans <code className="text-xs">docs/ACADEMIE…</code> /
                `src/lib/academy`.
              </p>
            </div>
            <Link href="/academie-mariage" className="text-sm font-semibold text-primary">
              Aperçu membre →
            </Link>
          </div>
          <AcademyEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <YoutubeConfigEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <p className="text-xs text-muted-foreground">
            Module indépendant : éditez titres/vidéos/exercices ici. Drag &amp; drop parcours et
            stats de visionnage YouTube = prochain niveau (playlist branchée ci-dessus).
          </p>
        </div>
      )}

      {/* ——— 8. EVA ——— */}
      {nav === "eva" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Coach EVA</h1>
            <p className="text-sm text-muted-foreground mt-1">
              État réel du coach — pas de survente.
            </p>
          </div>
          <SectionCard title="Niveau opérationnel (audit)">
            <ul className="text-sm space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Aujourd&apos;hui :</strong> chat membre
                branché (`askEvaAction`) — lit <code className="text-xs">docs/eva/</code> + notes
                ops. Sans OpenAI = moteur local ; avec clé = LLM.
              </li>
              <li>
                <strong className="text-foreground">Sujets interdits ops :</strong> fusionnés dans
                les garde-fous Eva.
              </li>
              <li>
                <strong className="text-foreground">Quota :</strong> Free 3/j · Alliance{" "}
                {PLANS.premium_plus.limits.evaQuestionsPerDay}/j.
              </li>
              <li>
                OpenAI :{" "}
                <strong className="text-foreground">
                  {props.ops.hasOpenAI
                    ? "clé détectée — utilisable par Eva"
                    : "absente — mode knowledge docs local"}
                </strong>
              </li>
            </ul>
          </SectionCard>
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
            <KpiCard
              label="Moteur"
              value={props.ops.hasOpenAI ? "Prêt API" : "Local FAQ"}
              hint="Chat membre = FAQ V1"
            />
          </div>
          <EvaConfigEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <SectionCard title="Actions">
            <div className="flex flex-wrap gap-3">
              <Link href="/help">
                <Button variant="outline" size="sm">
                  Ouvrir EVA (membre)
                </Button>
              </Link>
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
              Textes app, publicités, notes soft launch.
            </p>
          </div>
          <AppTextsEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <AdsEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <SectionCard title="Prévisualisation & dimensions conseillées">
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Dashboard / global : 1200×400 (ratio ~3:1), JPG/WebP &lt; 300 Ko</li>
              <li>Discover : 800×1000 (portrait), visage ou produit centré</li>
              <li>Messages : 1080×360, contraste élevé sur texte CTA</li>
              <li>Uploadez une URL image dans chaque pub, activez, enregistrez — aperçu côté membre Accueil.</li>
            </ul>
          </SectionCard>
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
        </div>
      )}

      {/* ——— 9b. ÉQUIPE ——— */}
      {nav === "team" && (
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Équipe & rôles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Nommez des modérateurs, éditeurs de contenu ou coachs — sans exposer de lien public.
            </p>
          </div>
          <AdminStaffTeamPanel canManage={isFullAdmin} />
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
              title="Pause paiements (Alliance)"
              value={paymentsPaused}
              disabled={!isFullAdmin}
              onToggle={() => {
                const next = !paymentsPaused
                setPaymentsPaused(next)
                if (isFullAdmin) {
                  void run("paypause", () =>
                    adminUpdatePlatformSetting("payments_paused", next)
                  )
                }
              }}
            />
            <ToggleRow
              title="Pause inscriptions (flag — enforcement AUTH UNLOCK)"
              value={registrationsPaused}
              disabled={!isFullAdmin}
              onToggle={() => {
                const next = !registrationsPaused
                setRegistrationsPaused(next)
                if (isFullAdmin) {
                  void run("regpause", () =>
                    adminUpdatePlatformSetting("registrations_paused", next)
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
          <p className="text-xs text-muted-foreground">
            Auto-discernement → <strong>Modération</strong>. Textes &amp; pubs →{" "}
            <strong>Contenu &amp; marketing</strong>. Académie → <strong>Académie</strong>.
            Profils / pasteurs → <strong>Profils</strong>.
          </p>
          <IntegrationsEditor
            settings={props.settings}
            ops={props.ops}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <YoutubeConfigEditor
            settings={props.settings}
            isFullAdmin={isFullAdmin}
            busy={busy}
            run={run}
          />
          <SectionCard title="Santé système">
            <div className="grid sm:grid-cols-2 gap-2">
              <Flag label="URL app" value={props.ops.appUrl || "—"} ok={Boolean(props.ops.appUrl)} />
              <Flag
                label="Paiements démo"
                value={props.ops.paymentsDemoMode ? "ON" : "OFF"}
                ok={!props.ops.paymentsDemoMode}
              />
              <Flag label="Moneroo" value={props.ops.hasMoneroo ? "Oui" : "Non"} ok={props.ops.hasMoneroo} />
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
              {selected.city} · {selected.country} · {selected.completion}% · {selected.role}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Foi : {selected.denomination || "—"}
              {selected.church ? ` · ${selected.church}` : ""}
              {selected.pastorName ? ` · pasteur ${selected.pastorName}` : ""}
            </p>
            <p className="text-xs mt-1">
              Confiance <strong>{selected.trustScore}</strong> · avert.{" "}
              <strong>{selected.warningCount}</strong> · sanction{" "}
              <strong>{selected.sanctionStatus}</strong>
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
              Suspendre profil
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
            <Button
              size="sm"
              variant="outline"
              disabled={busy === `w-${selected.id}`}
              onClick={() =>
                run(`w-${selected.id}`, () => adminApplySanction(selected.id, "warn"))
              }
            >
              Avertir
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy === `s-${selected.id}`}
              onClick={() =>
                run(`s-${selected.id}`, () => adminApplySanction(selected.id, "suspend"))
              }
            >
              Suspension
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy === `b-${selected.id}`}
              onClick={() =>
                run(`b-${selected.id}`, () => adminApplySanction(selected.id, "block"))
              }
            >
              Bloquer
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
          <AdminLoyaltyPanel userId={selected.userId} isFullAdmin={isFullAdmin} />
          {isFullAdmin && (
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Rôle
              </p>
              <div className="flex flex-wrap gap-2">
                {(["member", "moderator", "editor", "coach", "admin"] as const).map((r) => (
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
