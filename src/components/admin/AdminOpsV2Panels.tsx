"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  adminAnalyzePendingPhotos,
  adminApplyPhotoVerdict,
  adminApplySanction,
  adminReviewChurchRecommendation,
  adminScanRecentMessages,
  adminUpdatePlatformSetting,
  type AdminBreakdowns,
  type PlatformSettingRow,
} from "@/app/actions/admin"
import { DistBars, SparkColumns } from "@/components/admin/AdminCharts"
import { KpiCard, SectionCard } from "@/components/admin/AdminShell"
import {
  DEFAULT_EVA_CONFIG,
  DEFAULT_PHOTO_RULES,
  DEFAULT_SANCTION_RULES,
  DEFAULT_YOUTUBE,
  parseEvaConfig,
  parseIntegrations,
  parsePhotoRules,
  parseSanctionRules,
  parseYoutubeConfig,
  type EvaConfig,
  type PhotoRules,
  type SanctionRules,
  type YoutubeConfig,
} from "@/lib/admin/opsRules"
import { cn } from "@/utils/cn"

type UserRow = {
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
  verified: boolean
  hasAvatar: boolean
  createdAt: string | null
  trustScore: number
  warningCount: number
  sanctionStatus: string
}

function settingRaw(settings: PlatformSettingRow[], key: string): unknown {
  return settings.find((s) => s.key === key)?.value
}

type Run = (
  key: string,
  fn: () => Promise<{ error?: string; success?: boolean }>
) => Promise<void>

export function MembersAdvancedPanel({
  users,
  subscriptions,
  breakdowns,
  isFullAdmin,
  busy,
  run,
  selectedUser,
  setSelectedUser,
  children,
}: {
  users: UserRow[]
  subscriptions: Array<{ userId: string; plan: string; status: string }>
  breakdowns: AdminBreakdowns
  isFullAdmin: boolean
  busy: string
  run: Run
  selectedUser: string | null
  setSelectedUser: (id: string | null) => void
  children: React.ReactNode
}) {
  const [city, setCity] = React.useState("")
  const [country, setCountry] = React.useState("")
  const [gender, setGender] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [plan, setPlan] = React.useState("")
  const [q, setQ] = React.useState("")

  const subByUser = React.useMemo(() => {
    const m = new Map<string, string>()
    for (const s of subscriptions) {
      if (s.status === "active") m.set(s.userId, s.plan)
    }
    return m
  }, [subscriptions])

  const filtered = users.filter((u) => {
    if (city && !u.city.toLowerCase().includes(city.toLowerCase())) return false
    if (country && !u.country.toLowerCase().includes(country.toLowerCase())) return false
    if (gender && u.gender !== gender) return false
    if (status && u.status !== status) return false
    if (plan) {
      const p = subByUser.get(u.userId) || "free"
      if (plan === "free" && p !== "free" && subByUser.has(u.userId)) return false
      if (plan === "alliance" && p !== "premium_plus") return false
      if (plan === "premium" && p !== "premium") return false
      if (plan === "free" && subByUser.has(u.userId)) return false
    }
    if (
      q &&
      !`${u.name} ${u.city} ${u.userId} ${u.denomination} ${u.church}`
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total (filtre)" value={filtered.length} hint={`${users.length} chargés`} />
        <KpiCard label="Confiance moy." value={breakdowns.avgTrust} tone="green" />
        <KpiCard label="Sanctionnés" value={breakdowns.sanctioned} tone="red" />
        <KpiCard label="Recos pasteur" value={breakdowns.pendingRecos} tone="gold" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Par ville">
          <DistBars items={breakdowns.byCity} />
        </SectionCard>
        <SectionCard title="Par pays">
          <DistBars items={breakdowns.byCountry} accent="gold" />
        </SectionCard>
      </div>

      <SectionCard title="Filtres">
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <input
            placeholder="Recherche"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            placeholder="Pays"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Genre</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Statut profil</option>
            <option value="pending">Pending</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Abonnement</option>
            <option value="free">Gratuit</option>
            <option value="alliance">Alliance</option>
            <option value="premium">Legacy</option>
          </select>
        </div>
      </SectionCard>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2">Membre</th>
                  <th className="text-left px-2 py-2">Lieu</th>
                  <th className="text-left px-2 py-2">Foi</th>
                  <th className="text-left px-2 py-2">Conf.</th>
                  <th className="text-left px-2 py-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u.id)}
                    className={cn(
                      "cursor-pointer hover:bg-secondary/40",
                      selectedUser === u.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-3 py-2">
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {u.gender} · {u.age ?? "?"} ans · {u.completion}%
                      </p>
                    </td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">
                      {u.city}
                      <br />
                      {u.country}
                    </td>
                    <td className="px-2 py-2 text-xs text-muted-foreground max-w-[120px] truncate">
                      {u.denomination || "—"}
                    </td>
                    <td className="px-2 py-2 font-semibold">{u.trustScore}</td>
                    <td className="px-2 py-2">
                      <Badge variant="outline" className="text-[10px]">
                        {u.sanctionStatus !== "none" ? u.sanctionStatus : u.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-2">{children}</div>
      </div>
    </div>
  )
}

export function ProfilesHubPanel({
  users,
  recommendations,
  busy,
  run,
}: {
  users: UserRow[]
  recommendations: Array<{
    id: string
    profileId: string
    recommenderName: string
    recommenderRole: string | null
    churchName: string | null
    status: string
    message: string | null
  }>
  busy: string
  run: Run
}) {
  const pending = users.filter((u) => u.status === "pending")
  const sanctioned = users.filter((u) => u.sanctionStatus && u.sanctionStatus !== "none")
  const reported = users.filter((u) => u.warningCount > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Profils</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Attente de validation · signalés / avertis · pénalisés · recommandations pasteur.
          Score de confiance (0–100) : vérif, reco Église, sanctions.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="En attente" value={pending.length} tone="gold" />
        <KpiCard label="Avec avertissements" value={reported.length} />
        <KpiCard label="Pénalisés" value={sanctioned.length} tone="red" />
        <KpiCard
          label="Recos à valider"
          value={recommendations.filter((r) => r.status === "pending").length}
          tone="green"
        />
      </div>

      <SectionCard title="Recommandations pasteur / responsable">
        <div className="space-y-3">
          {recommendations.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucune recommandation. Les membres peuvent en ajouter depuis leur profil.
            </p>
          )}
          {recommendations.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="font-semibold text-sm">
                  {r.recommenderName}
                  {r.recommenderRole ? ` · ${r.recommenderRole}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.churchName || "Église"} · profil {r.profileId.slice(0, 8)}…
                </p>
                {r.message && <p className="text-xs mt-1">{r.message}</p>}
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {r.status}
                </Badge>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() =>
                      run(r.id, () => adminReviewChurchRecommendation(r.id, "verified"))
                    }
                  >
                    Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === r.id}
                    onClick={() =>
                      run(r.id, () => adminReviewChurchRecommendation(r.id, "rejected"))
                    }
                  >
                    Refuser
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Profils pénalisés">
        <div className="divide-y divide-border">
          {sanctioned.length === 0 && (
            <p className="text-sm text-muted-foreground py-3">Aucun.</p>
          )}
          {sanctioned.map((u) => (
            <div key={u.id} className="py-3 flex justify-between gap-2 text-sm">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-xs text-muted-foreground">
                  {u.sanctionStatus} · {u.warningCount} avert. · confiance {u.trustScore}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={busy === `clr-${u.id}`}
                onClick={() =>
                  run(`clr-${u.id}`, () => adminApplySanction(u.id, "clear"))
                }
              >
                Lever
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export function PhotoRulesEditor({
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: Run
}) {
  const [rules, setRules] = React.useState<PhotoRules>(() =>
    parsePhotoRules(settingRaw(settings, "photo_rules") ?? DEFAULT_PHOTO_RULES)
  )
  const [analysis, setAnalysis] = React.useState<
    Array<{ id: string; decision: string; message: string; reasons: string[] }>
  >([])

  return (
    <div className="space-y-4">
      <SectionCard title="Règles IA photo (discernement automatique)">
        <p className="text-xs text-muted-foreground mb-3">
          Analyse chaque photo (nom, type, taille, motifs). Vision LLM = V2 si clé OpenAI.
        </p>
        <label className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={rules.enabled}
            disabled={!isFullAdmin}
            onChange={(e) => setRules((r) => ({ ...r, enabled: e.target.checked }))}
          />
          Activer l&apos;analyse auto
        </label>
        <label className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={rules.autoApproveClean}
            disabled={!isFullAdmin}
            onChange={(e) => setRules((r) => ({ ...r, autoApproveClean: e.target.checked }))}
          />
          Auto-accepter si score élevé
        </label>
        <label className="block text-[11px] font-semibold uppercase text-muted-foreground">
          Motifs de refus (séparés par virgule)
        </label>
        <input
          disabled={!isFullAdmin}
          value={rules.rejectNamePatterns.join(", ")}
          onChange={(e) =>
            setRules((r) => ({
              ...r,
              rejectNamePatterns: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            }))
          }
          className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <div className="grid sm:grid-cols-3 gap-2 mt-3">
          {(
            [
              ["msgApprove", "Message acceptation"],
              ["msgReject", "Message refus"],
              ["msgRetry", "Message nouvelle photo"],
            ] as const
          ).map(([k, label]) => (
            <div key={k}>
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                {label}
              </label>
              <textarea
                disabled={!isFullAdmin}
                rows={2}
                value={rules[k]}
                onChange={(e) => setRules((r) => ({ ...r, [k]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        {isFullAdmin && (
          <Button
            size="sm"
            className="mt-3"
            disabled={busy === "photo-rules"}
            onClick={() =>
              run("photo-rules", () => adminUpdatePlatformSetting("photo_rules", rules))
            }
          >
            Enregistrer règles photo
          </Button>
        )}
      </SectionCard>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={busy === "photo-analyze"}
          onClick={() =>
            run("photo-analyze", async () => {
              const r = await adminAnalyzePendingPhotos()
              if (r.error) return { error: r.error }
              setAnalysis(r.results)
              return { success: true }
            })
          }
        >
          Analyser la file
        </Button>
      </div>

      {analysis.length > 0 && (
        <div className="rounded-2xl border border-border divide-y">
          {analysis.map((a) => (
            <div key={a.id} className="p-3 flex justify-between gap-3 text-sm">
              <div>
                <Badge variant="outline">{a.decision}</Badge>
                <p className="text-xs mt-1">{a.message}</p>
                <p className="text-[11px] text-muted-foreground">{a.reasons.join(" · ")}</p>
              </div>
              <Button
                size="sm"
                disabled={busy === `pv-${a.id}`}
                onClick={() =>
                  run(`pv-${a.id}`, () => adminApplyPhotoVerdict(a.id))
                }
              >
                Appliquer
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SanctionRulesEditor({
  settings,
  isFullAdmin,
  busy,
  run,
  setMsg,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: Run
  setMsg: (m: string | null) => void
}) {
  const [rules, setRules] = React.useState<SanctionRules>(() =>
    parseSanctionRules(settingRaw(settings, "sanction_rules") ?? DEFAULT_SANCTION_RULES)
  )

  return (
    <SectionCard title="Processus signalements & langage">
      <p className="text-xs text-muted-foreground mb-3">
        Avertissement → 2e avertissement → suspension → blocage. Analyse auto des messages
        (mots interdits).
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={rules.enabled}
            disabled={!isFullAdmin}
            onChange={(e) => setRules((r) => ({ ...r, enabled: e.target.checked }))}
          />
          Activer les sanctions auto
        </label>
        <div>
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Jours de suspension
          </label>
          <input
            type="number"
            disabled={!isFullAdmin}
            value={rules.suspendDays}
            onChange={(e) =>
              setRules((r) => ({ ...r, suspendDays: Number(e.target.value) || 7 }))
            }
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Mots interdits (virgules)
          </label>
          <textarea
            disabled={!isFullAdmin}
            rows={2}
            value={rules.bannedWords.join(", ")}
            onChange={(e) =>
              setRules((r) => ({
                ...r,
                bannedWords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              }))
            }
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
      {isFullAdmin && (
        <Button
          size="sm"
          className="mt-3"
          disabled={busy === "sanctions"}
          onClick={() =>
            run("sanctions", () => adminUpdatePlatformSetting("sanction_rules", rules))
          }
        >
          Enregistrer
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="mt-3 ml-2"
        disabled={busy === "scan-msg"}
        onClick={() =>
          run("scan-msg", async () => {
            const r = await adminScanRecentMessages()
            if (r.error) return { error: r.error }
            setMsg(
              `Scan messages : ${r.flags.length} alerte(s) / ${r.scanned} scannés.`
            )
            return { success: true }
          })
        }
      >
        Scanner les conversations
      </Button>
    </SectionCard>
  )
}

export function EvaConfigEditor({
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: Run
}) {
  const [cfg, setCfg] = React.useState<EvaConfig>(() =>
    parseEvaConfig(settingRaw(settings, "eva_config") ?? DEFAULT_EVA_CONFIG)
  )

  return (
    <SectionCard title="Consignes Coach EVA">
      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Prompt système
          </label>
          <textarea
            disabled={!isFullAdmin}
            rows={4}
            value={cfg.systemPrompt}
            onChange={(e) => setCfg((c) => ({ ...c, systemPrompt: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Base de connaissances
          </label>
          <textarea
            disabled={!isFullAdmin}
            rows={3}
            value={cfg.knowledgeNotes}
            onChange={(e) => setCfg((c) => ({ ...c, knowledgeNotes: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-muted-foreground">
            Sujets interdits (virgules)
          </label>
          <input
            disabled={!isFullAdmin}
            value={cfg.forbiddenTopics.join(", ")}
            onChange={(e) =>
              setCfg((c) => ({
                ...c,
                forbiddenTopics: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              }))
            }
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cfg.analyzeConversations}
            disabled={!isFullAdmin}
            onChange={(e) =>
              setCfg((c) => ({ ...c, analyzeConversations: e.target.checked }))
            }
          />
          Analyser les conversations (rapports)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cfg.dailyReportEnabled}
            disabled={!isFullAdmin}
            onChange={(e) =>
              setCfg((c) => ({ ...c, dailyReportEnabled: e.target.checked }))
            }
          />
          Rapport quotidien admin
        </label>
        {isFullAdmin && (
          <Button
            size="sm"
            disabled={busy === "eva-cfg"}
            onClick={() =>
              run("eva-cfg", () => adminUpdatePlatformSetting("eva_config", cfg))
            }
          >
            Enregistrer EVA
          </Button>
        )}
      </div>
    </SectionCard>
  )
}

export function YoutubeConfigEditor({
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: Run
}) {
  const [yt, setYt] = React.useState<YoutubeConfig>(() =>
    parseYoutubeConfig(settingRaw(settings, "youtube_config") ?? DEFAULT_YOUTUBE)
  )
  return (
    <SectionCard title="YouTube Académie">
      <p className="text-xs text-muted-foreground mb-3">
        Branchez une chaîne / playlist pour diffuser et suivre les vues (stats via API YouTube).
      </p>
      <label className="flex items-center gap-2 text-sm mb-2">
        <input
          type="checkbox"
          checked={yt.enabled}
          disabled={!isFullAdmin}
          onChange={(e) => setYt((y) => ({ ...y, enabled: e.target.checked }))}
        />
        Activer l&apos;intégration
      </label>
      <div className="grid sm:grid-cols-2 gap-2">
        <input
          placeholder="Channel ID"
          disabled={!isFullAdmin}
          value={yt.channelId}
          onChange={(e) => setYt((y) => ({ ...y, channelId: e.target.value }))}
          className="rounded-xl border border-border px-3 py-2 text-sm"
        />
        <input
          placeholder="Playlist ID"
          disabled={!isFullAdmin}
          value={yt.defaultPlaylistId}
          onChange={(e) => setYt((y) => ({ ...y, defaultPlaylistId: e.target.value }))}
          className="rounded-xl border border-border px-3 py-2 text-sm"
        />
      </div>
      {isFullAdmin && (
        <Button
          size="sm"
          className="mt-3"
          disabled={busy === "yt"}
          onClick={() =>
            run("yt", () => adminUpdatePlatformSetting("youtube_config", yt))
          }
        >
          Enregistrer YouTube
        </Button>
      )}
    </SectionCard>
  )
}

export function IntegrationsEditor({
  settings,
  ops,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  ops: {
    hasStripe: boolean
    hasCinetPay: boolean
    hasResend: boolean
    hasOpenAI: boolean
    hasYoutube: boolean
    appUrl: string
  }
  isFullAdmin: boolean
  busy: string
  run: Run
}) {
  const [cfg, setCfg] = React.useState(() =>
    parseIntegrations(settingRaw(settings, "integrations"))
  )
  return (
    <SectionCard title="API & connecteurs">
      <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
        <p>Stripe env : <strong>{ops.hasStripe ? "oui" : "non"}</strong></p>
        <p>CinetPay : <strong>{ops.hasCinetPay ? "oui" : "non"}</strong></p>
        <p>Resend : <strong>{ops.hasResend ? "oui" : "non"}</strong></p>
        <p>OpenAI : <strong>{ops.hasOpenAI ? "oui" : "non"}</strong></p>
        <p>YouTube API : <strong>{ops.hasYoutube ? "oui" : "non"}</strong></p>
        <p className="truncate">App URL : {ops.appUrl || "—"}</p>
      </div>
      <textarea
        disabled={!isFullAdmin}
        rows={2}
        value={cfg.stripeNotes}
        onChange={(e) => setCfg((c) => ({ ...c, stripeNotes: e.target.value }))}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm mb-2"
        placeholder="Notes Stripe"
      />
      <textarea
        disabled={!isFullAdmin}
        rows={2}
        value={cfg.openaiNotes}
        onChange={(e) => setCfg((c) => ({ ...c, openaiNotes: e.target.value }))}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm mb-2"
        placeholder="Notes OpenAI / vision"
      />
      <input
        disabled={!isFullAdmin}
        value={cfg.webhookUrl}
        onChange={(e) => setCfg((c) => ({ ...c, webhookUrl: e.target.value }))}
        placeholder="Webhook URL"
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      />
      {isFullAdmin && (
        <Button
          size="sm"
          className="mt-3"
          disabled={busy === "integ"}
          onClick={() =>
            run("integ", () => adminUpdatePlatformSetting("integrations", cfg))
          }
        >
          Enregistrer connecteurs
        </Button>
      )}
    </SectionCard>
  )
}

export function AnalyticsRichPanel({
  breakdowns,
  retention,
  stats,
}: {
  breakdowns: AdminBreakdowns
  retention: {
    menCount: number
    womenCount: number
    activeFreeEstimate: number
    activeAlliance: number
    activeLegacyPremium: number
    matches30d: number
    conversations30d: number
    views30d: number
    newMembers30d: number
    conversionPaidPct: number
  }
  stats: { users: number; revenueXof: number }
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Analytique</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vision complète — géographie, démographie, abonnements, matching, activité.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Membres" value={stats.users} />
        <KpiCard label="Nouveaux 14j (chart)" value={breakdowns.signups14d.reduce((s, x) => s + x.count, 0)} />
        <KpiCard label="Taux matching" value={`${breakdowns.matchingRatePct}%`} tone="green" />
        <KpiCard label="Revenus" value={`${stats.revenueXof.toLocaleString("fr-FR")} F`} tone="gold" />
      </div>
      <SectionCard title="Évolution des inscriptions (14 j)">
        <SparkColumns items={breakdowns.signups14d} />
      </SectionCard>
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Villes">
          <DistBars items={breakdowns.byCity} />
        </SectionCard>
        <SectionCard title="Pays">
          <DistBars items={breakdowns.byCountry} accent="gold" />
        </SectionCard>
        <SectionCard title="Âges">
          <DistBars items={breakdowns.byAge} accent="emerald" />
        </SectionCard>
        <SectionCard title="Dénominations">
          <DistBars items={breakdowns.byDenomination} />
        </SectionCard>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Hommes" value={retention.menCount} />
        <KpiCard label="Femmes" value={retention.womenCount} />
        <KpiCard label="Free estimé" value={retention.activeFreeEstimate} />
        <KpiCard label="Alliance" value={retention.activeAlliance} tone="green" />
        <KpiCard label="Legacy premium" value={retention.activeLegacyPremium} />
        <KpiCard label="Matches 30j" value={retention.matches30d} />
        <KpiCard label="Convos 30j" value={retention.conversations30d} />
        <KpiCard label="Vues 30j" value={retention.views30d} />
      </div>
    </div>
  )
}
