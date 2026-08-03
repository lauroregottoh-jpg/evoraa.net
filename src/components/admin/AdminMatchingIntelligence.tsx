"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DistBars, SparkColumns } from "@/components/admin/AdminCharts"
import { KpiCard, SectionCard } from "@/components/admin/AdminShell"
import {
  DIMENSION_LABELS,
  PILLAR_KEYS,
  PILLAR_LABELS,
  filterSegmentMembers,
  type CampaignSegmentFilter,
  type MatchingIntelligence,
  type PillarKey,
} from "@/lib/admin/matchingIntelligence"
import {
  adminBroadcastSegmentNotification,
  adminSaveCampaignSegments,
  type SavedCampaignSegment,
  type PlatformSettingRow,
} from "@/app/actions/admin"

function parseSavedSegments(settings: PlatformSettingRow[]): SavedCampaignSegment[] {
  const row = settings.find((s) => s.key === "campaign_segments")
  if (!row?.value) return []
  try {
    const raw = typeof row.value === "string" ? JSON.parse(row.value) : row.value
    return Array.isArray(raw) ? (raw as SavedCampaignSegment[]) : []
  } catch {
    return []
  }
}

function dimLabelToKey(label: string): string | null {
  const entry = Object.entries(DIMENSION_LABELS).find(([, v]) => v === label)
  return entry?.[0] ?? null
}

export function MatchingIntelligencePanel({
  intelligence,
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  intelligence: MatchingIntelligence
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
}) {
  const [tab, setTab] = React.useState<"overview" | "members" | "segments">("overview")
  const [saved, setSaved] = React.useState(() => parseSavedSegments(settings))

  const [segName, setSegName] = React.useState("Campagne discernement")
  const [gender, setGender] = React.useState("all")
  const [profileType, setProfileType] = React.useState("")
  const [minPillars, setMinPillars] = React.useState(0)
  const [weakDim, setWeakDim] = React.useState("")
  const [pillarBelow, setPillarBelow] = React.useState<PillarKey | "">("")
  const [pillarBelowMax, setPillarBelowMax] = React.useState(60)
  const [city, setCity] = React.useState("")
  const [draftTitle, setDraftTitle] = React.useState("KELIAA — un pas pour affiner votre matching")
  const [draftBody, setDraftBody] = React.useState(
    "Bonjour, selon votre profil de discernement, nous vous invitons à compléter / retravailler un axe pour des suggestions plus justes. L'équipe Keliaa."
  )
  const [memberQuery, setMemberQuery] = React.useState("")

  const filter: CampaignSegmentFilter = React.useMemo(
    () => ({
      name: segName,
      gender: gender === "all" ? undefined : gender,
      profileType: profileType || undefined,
      minPillarsCompleted: minPillars > 0 ? minPillars : undefined,
      weakDimension: weakDim || undefined,
      pillarBelow: pillarBelow
        ? { pillar: pillarBelow, max: pillarBelowMax }
        : undefined,
      city: city || undefined,
    }),
    [segName, gender, profileType, minPillars, weakDim, pillarBelow, pillarBelowMax, city]
  )

  const segmentMembers = React.useMemo(
    () => filterSegmentMembers(intelligence.members, filter),
    [intelligence.members, filter]
  )

  const filteredTable = React.useMemo(() => {
    const q = memberQuery.trim().toLowerCase()
    if (!q) return intelligence.members
    return intelligence.members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.profileType.toLowerCase().includes(q) ||
        m.denomination.toLowerCase().includes(q)
    )
  }, [intelligence.members, memberQuery])

  const copyIds = async () => {
    const text = segmentMembers.map((m) => m.userId).join("\n")
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
  }

  const saveSegment = async () => {
    const next: SavedCampaignSegment = {
      id: `seg_${Date.now()}`,
      name: segName.trim() || "Segment sans nom",
      createdAt: new Date().toISOString(),
      filter,
      memberCount: segmentMembers.length,
      draftTitle,
      draftBody,
    }
    const merged = [next, ...saved].slice(0, 40)
    await run("save-seg", async () => {
      const res = await adminSaveCampaignSegments(merged)
      if (!("error" in res && res.error)) setSaved(merged)
      return res
    })
  }

  const broadcast = async () => {
    if (!isFullAdmin) return
    await run("broadcast-seg", () =>
      adminBroadcastSegmentNotification({
        userIds: segmentMembers.map((m) => m.userId),
        title: draftTitle,
        body: draftBody,
      })
    )
  }

  const loadSaved = (s: SavedCampaignSegment) => {
    setSegName(s.name)
    setGender(s.filter.gender || "all")
    setProfileType(s.filter.profileType || "")
    setMinPillars(s.filter.minPillarsCompleted || 0)
    setWeakDim(s.filter.weakDimension || "")
    setPillarBelow(s.filter.pillarBelow?.pillar || "")
    setPillarBelowMax(s.filter.pillarBelow?.max ?? 60)
    setCity(s.filter.city || "")
    setDraftTitle(s.draftTitle)
    setDraftBody(s.draftBody)
    setTab("segments")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Matching Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Données piliers, thématiques faibles, tendances de scores et segments campagne —
            pour profiler, relancer et messageer les bons membres.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["overview", "Vue data"],
              ["members", "Membres"],
              ["segments", "Segments campagne"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-colors ${
                tab === id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Questionnaires 5/5" value={intelligence.assessmentsDoneAll} tone="green" />
        <KpiCard label="Partiels" value={intelligence.assessmentsPartial} tone="gold" />
        <KpiCard label="Sans test" value={intelligence.assessmentsNone} />
        <KpiCard
          label="Score match moyen"
          value={intelligence.avgMatchScore != null ? `${intelligence.avgMatchScore}%` : "—"}
          hint={`${intelligence.highScoreMatches} ≥ 85%`}
        />
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <SectionCard title="Matches créés (14 j)">
            <SparkColumns items={intelligence.matchesByDay} />
          </SectionCard>

          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard title="Moyennes des 5 piliers (0–100)">
              <DistBars items={intelligence.avgPillars} accent="emerald" />
              <p className="text-[11px] text-muted-foreground mt-3">
                Moyenne sur les membres ayant complété chaque pilier. Utile pour voir les biais
                collectifs (ex. foi haute / finances basses).
              </p>
            </SectionCard>
            <SectionCard title="Complétion des questionnaires">
              <DistBars items={intelligence.pillarCompletionDist} />
            </SectionCard>
            <SectionCard title="Distribution des scores de match">
              <DistBars items={intelligence.scoreBuckets} accent="gold" />
            </SectionCard>
            <SectionCard title="Typologies de profil (campagnes)">
              <DistBars items={intelligence.profileTypes} />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {intelligence.profileTypes.slice(0, 6).map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className="text-[10px] rounded-lg border border-border px-2 py-1 hover:border-primary"
                    onClick={() => {
                      setProfileType(t.name)
                      setTab("segments")
                    }}
                  >
                    Segmenter · {t.name} ({t.count})
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Thématiques faibles (dimensions &lt; 60)">
              <DistBars items={intelligence.weakThemes} accent="gold" />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {intelligence.weakThemes.slice(0, 8).map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className="text-[10px] rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-2 py-1"
                    onClick={() => {
                      const key = dimLabelToKey(t.name)
                      if (key) setWeakDim(key)
                      setTab("segments")
                    }}
                  >
                    Cibler · {t.name}
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Indicateurs d&apos;accueil">
              <p className="text-xs font-semibold mb-2">Pratique spirituelle</p>
              <DistBars items={intelligence.practiceDist} />
              <p className="text-xs font-semibold mb-2 mt-4">Style de dialogue</p>
              <DistBars items={intelligence.communicationDist} accent="emerald" />
            </SectionCard>
          </div>
        </div>
      )}

      {tab === "members" && (
        <div className="space-y-4">
          <SectionCard title={`Profils matching (${filteredTable.length})`}>
            <input
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
              placeholder="Filtrer nom, ville, typologie, dénomination…"
              className="w-full mb-3 rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
            <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-2 font-medium">Membre</th>
                    <th className="py-2 pr-2 font-medium">Type</th>
                    <th className="py-2 pr-2 font-medium">Piliers</th>
                    <th className="py-2 pr-2 font-medium">Foi</th>
                    <th className="py-2 pr-2 font-medium">Comm.</th>
                    <th className="py-2 pr-2 font-medium">Foyer</th>
                    <th className="py-2 pr-2 font-medium">Argent</th>
                    <th className="py-2 font-medium">Faiblesses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTable.slice(0, 200).map((m) => (
                    <tr key={m.id} className="align-top">
                      <td className="py-2.5 pr-2">
                        <p className="font-semibold text-foreground">{m.name}</p>
                        <p className="text-muted-foreground">
                          {m.city} · {m.age ?? "?"} ans · {m.gender}
                        </p>
                      </td>
                      <td className="py-2.5 pr-2">
                        <Badge variant="outline" className="text-[10px] whitespace-normal">
                          {m.profileType}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-2 font-mono">{m.pillarsCompleted}/5</td>
                      <td className="py-2.5 pr-2 tabular-nums">
                        {m.pillars.spiritual ?? "—"}
                      </td>
                      <td className="py-2.5 pr-2 tabular-nums">
                        {m.pillars.relationship ?? "—"}
                      </td>
                      <td className="py-2.5 pr-2 tabular-nums">
                        {m.pillars.couple_life ?? "—"}
                      </td>
                      <td className="py-2.5 pr-2 tabular-nums">
                        {m.pillars.finances ?? "—"}
                      </td>
                      <td className="py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-[14rem]">
                          {m.weakDimensions.slice(0, 3).map((d) => (
                            <span
                              key={d}
                              className="rounded-md bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 text-[10px]"
                            >
                              {DIMENSION_LABELS[d] ?? d}
                            </span>
                          ))}
                          {m.weakDimensions.length === 0 && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "segments" && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard title="Créateur de segment">
              <div className="space-y-3 text-sm">
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Nom du segment</span>
                  <input
                    value={segName}
                    onChange={(e) => setSegName(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Genre</span>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-xl border border-border px-3 py-2"
                    >
                      <option value="all">Tous</option>
                      <option value="homme">Hommes</option>
                      <option value="femme">Femmes</option>
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Piliers min.</span>
                    <select
                      value={minPillars}
                      onChange={(e) => setMinPillars(Number(e.target.value))}
                      className="w-full rounded-xl border border-border px-3 py-2"
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          ≥ {n}/5
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Typologie</span>
                  <select
                    value={profileType}
                    onChange={(e) => setProfileType(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2"
                  >
                    <option value="">Toutes</option>
                    {intelligence.profileTypes.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} ({t.count})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Dimension faible</span>
                  <select
                    value={weakDim}
                    onChange={(e) => setWeakDim(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2"
                  >
                    <option value="">Aucune</option>
                    {Object.entries(DIMENSION_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Pilier sous seuil</span>
                    <select
                      value={pillarBelow}
                      onChange={(e) => setPillarBelow(e.target.value as PillarKey | "")}
                      className="w-full rounded-xl border border-border px-3 py-2"
                    >
                      <option value="">Aucun</option>
                      {PILLAR_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {PILLAR_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Seuil max</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={pillarBelowMax}
                      onChange={(e) => setPillarBelowMax(Number(e.target.value) || 60)}
                      className="w-full rounded-xl border border-border px-3 py-2"
                    />
                  </label>
                </div>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Ville contient</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2"
                    placeholder="ex. Dakar"
                  />
                </label>

                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-3">
                  <p className="text-2xl font-serif font-bold">{segmentMembers.length}</p>
                  <p className="text-xs text-muted-foreground">
                    destinataires matchent ce filtre (max 200 à l&apos;envoi)
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Message campagne">
              <div className="space-y-3 text-sm">
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Titre notification</span>
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Corps</span>
                  <textarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    rows={6}
                    className="w-full rounded-xl border border-border px-3 py-2 resize-y"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!isFullAdmin || busy === "save-seg"}
                    onClick={() => void saveSegment()}
                  >
                    {busy === "save-seg" ? "Enregistrement…" : "Sauver le segment"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void copyIds()}
                  >
                    Copier les user IDs
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      !isFullAdmin ||
                      segmentMembers.length === 0 ||
                      busy === "broadcast-seg"
                    }
                    onClick={() => void broadcast()}
                  >
                    {busy === "broadcast-seg"
                      ? "Envoi…"
                      : `Notifier in-app (${Math.min(200, segmentMembers.length)})`}
                  </Button>
                </div>
                {!isFullAdmin && (
                  <p className="text-xs text-amber-800">
                    Les envois et sauvegardes sont réservés au rôle admin (pas modérateur).
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  L&apos;envoi crée des notifications dans l&apos;app. Idéal pour relancer un axe
                  (conflits, finances, foi…) avant une campagne email externe.
                </p>
              </div>
            </SectionCard>
          </div>

          <SectionCard title={`Aperçu destinataires (${segmentMembers.length})`}>
            <div className="divide-y divide-border max-h-72 overflow-y-auto">
              {segmentMembers.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">
                  Aucun membre pour ce filtre — élargissez les critères.
                </p>
              )}
              {segmentMembers.slice(0, 80).map((m) => (
                <div key={m.id} className="py-2.5 flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.profileType} · {m.pillarsCompleted}/5 · {m.city}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] text-primary font-semibold shrink-0"
                    onClick={() => {
                      setProfileType(m.profileType)
                    }}
                  >
                    Même type
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          {saved.length > 0 && (
            <SectionCard title="Segments enregistrés">
              <div className="divide-y divide-border">
                {saved.map((s) => (
                  <div key={s.id} className="py-3 flex justify-between gap-3 text-sm">
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.memberCount} membres ·{" "}
                        {new Date(s.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={() => loadSaved(s)}>
                      Recharger
                    </Button>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  )
}
