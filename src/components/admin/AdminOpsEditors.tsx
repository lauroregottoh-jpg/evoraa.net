"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  adminCreateMember,
  adminPreviewAutoModeration,
  adminRunAutoModeration,
  adminUpdatePlatformSetting,
  type PlatformSettingRow,
} from "@/app/actions/admin"
import { ACADEMY_MODULES } from "@/lib/academy/modules"
import {
  DEFAULT_APP_TEXTS,
  DEFAULT_AUTO_MOD,
  parseAds,
  parseAppTexts,
  parseAutoMod,
  parseAcademyOverrides,
  type AdSlot,
  type AcademyOverrides,
  type AppTexts,
  type AutoModerationConfig,
} from "@/lib/admin/cms"
import { AD_PLACEMENTS } from "@/lib/admin/moderationCatalog"
import { SectionCard } from "@/components/admin/AdminShell"
import { cn } from "@/utils/cn"

function settingRaw(settings: PlatformSettingRow[], key: string): unknown {
  return settings.find((s) => s.key === key)?.value
}

export function CreateMemberForm({
  isFullAdmin,
  busy,
  run,
}: {
  isFullAdmin: boolean
  busy: string
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
}) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [gender, setGender] = React.useState<"M" | "F" | "">("")
  const [city, setCity] = React.useState("")
  const [approve, setApprove] = React.useState(true)

  if (!isFullAdmin) return null

  return (
    <SectionCard title="Créer un membre">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Prénom *" value={firstName} onChange={setFirstName} />
        <Field label="Nom" value={lastName} onChange={setLastName} />
        <Field label="Email *" value={email} onChange={setEmail} type="email" />
        <Field
          label="Mot de passe temporaire *"
          value={password}
          onChange={setPassword}
          type="password"
        />
        <Field label="Ville" value={city} onChange={setCity} />
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">
            Genre
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "M" | "F" | "")}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">—</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={approve}
          onChange={(e) => setApprove(e.target.checked)}
        />
        Approuver le profil immédiatement
      </label>
      <Button
        size="sm"
        className="mt-3"
        disabled={busy === "create-member"}
        onClick={() =>
          run("create-member", async () => {
            const r = await adminCreateMember({
              email,
              password,
              firstName,
              lastName: lastName || undefined,
              gender: gender || undefined,
              city: city || undefined,
              approve,
            })
            if (r.error) return { error: r.error }
            setEmail("")
            setPassword("")
            setFirstName("")
            setLastName("")
            return { success: true }
          })
        }
      >
        Créer le compte
      </Button>
    </SectionCard>
  )
}

export function AcademyEditor({
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
}) {
  const [overrides, setOverrides] = React.useState<AcademyOverrides>(() =>
    parseAcademyOverrides(settingRaw(settings, "academy_overrides"))
  )
  const [modId, setModId] = React.useState(ACADEMY_MODULES[0]?.id || "foi")
  const mod = ACADEMY_MODULES.find((m) => m.id === modId)!
  const [lessonSlug, setLessonSlug] = React.useState(mod.lessons[0]?.slug || "")
  const lesson = mod.lessons.find((l) => l.slug === lessonSlug) || mod.lessons[0]

  React.useEffect(() => {
    const m = ACADEMY_MODULES.find((x) => x.id === modId)
    if (m?.lessons[0]) setLessonSlug(m.lessons[0].slug)
  }, [modId])

  const ovMod = overrides[modId] || {}
  const ovLesson = ovMod.lessons?.[lesson.slug] || {}

  const setModField = (field: "title" | "summary", value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [modId]: { ...prev[modId], [field]: value || undefined },
    }))
  }

  const setLessonField = (
    field: "title" | "subtitle" | "exercise" | "videoUrl" | "durationMin",
    value: string | number | null
  ) => {
    setOverrides((prev) => {
      const cur = prev[modId] || {}
      const lessons = { ...(cur.lessons || {}) }
      const curL = { ...(lessons[lesson.slug] || {}) }
      if (field === "durationMin") {
        curL.durationMin = Number(value) || undefined
      } else if (field === "videoUrl") {
        curL.videoUrl = value === "" || value == null ? null : String(value)
      } else if (field === "title") {
        curL.title = value ? String(value) : undefined
      } else if (field === "subtitle") {
        curL.subtitle = value ? String(value) : undefined
      } else {
        curL.exercise = value ? String(value) : undefined
      }
      lessons[lesson.slug] = curL
      return { ...prev, [modId]: { ...cur, lessons } }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ACADEMY_MODULES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setModId(m.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold border",
              modId === m.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground"
            )}
          >
            {m.title}
          </button>
        ))}
      </div>

      <SectionCard title="Module">
        <Field
          label="Titre module"
          value={ovMod.title ?? mod.title}
          onChange={(v) => setModField("title", v)}
          disabled={!isFullAdmin}
        />
        <label className="block mt-3 text-[11px] font-semibold text-muted-foreground uppercase">
          Résumé
        </label>
        <textarea
          value={ovMod.summary ?? mod.summary}
          disabled={!isFullAdmin}
          onChange={(e) => setModField("summary", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm"
        />
      </SectionCard>

      <SectionCard title="Leçon">
        <select
          value={lesson.slug}
          onChange={(e) => setLessonSlug(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm mb-3"
        >
          {mod.lessons.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.title}
            </option>
          ))}
        </select>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Titre leçon"
            value={ovLesson.title ?? lesson.title}
            onChange={(v) => setLessonField("title", v)}
            disabled={!isFullAdmin}
          />
          <Field
            label="Durée (min)"
            value={String(ovLesson.durationMin ?? lesson.durationMin)}
            onChange={(v) => setLessonField("durationMin", Number(v))}
            disabled={!isFullAdmin}
          />
        </div>
        <Field
          label="Sous-titre"
          value={ovLesson.subtitle ?? lesson.subtitle}
          onChange={(v) => setLessonField("subtitle", v)}
          disabled={!isFullAdmin}
          className="mt-3"
        />
        <Field
          label="URL vidéo (YouTube / Vimeo)"
          value={ovLesson.videoUrl ?? lesson.videoUrl ?? ""}
          onChange={(v) => setLessonField("videoUrl", v)}
          disabled={!isFullAdmin}
          className="mt-3"
        />
        <label className="block mt-3 text-[11px] font-semibold text-muted-foreground uppercase">
          Exercice
        </label>
        <textarea
          value={ovLesson.exercise ?? lesson.exercise}
          disabled={!isFullAdmin}
          onChange={(e) => setLessonField("exercise", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm"
        />
      </SectionCard>

      {isFullAdmin && (
        <Button
          disabled={busy === "academy"}
          onClick={() =>
            run("academy", () => adminUpdatePlatformSetting("academy_overrides", overrides))
          }
        >
          Enregistrer les textes Académie
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        Les contenus de base restent dans le code. Ici vous surchargez titres, résumés, vidéos
        et exercices — visibles côté membres après enregistrement.
      </p>
    </div>
  )
}

export function AppTextsEditor({
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
}) {
  const [texts, setTexts] = React.useState<AppTexts>(() =>
    parseAppTexts(settingRaw(settings, "app_texts") ?? DEFAULT_APP_TEXTS)
  )

  const set = (k: keyof AppTexts, v: string) => setTexts((t) => ({ ...t, [k]: v }))

  return (
    <SectionCard title="Textes de l’application">
      <div className="grid sm:grid-cols-2 gap-3">
        {(
          [
            ["banner_photo_title", "Bannière photo — titre"],
            ["banner_photo_body", "Bannière photo — texte"],
            ["banner_alliance_title", "Bannière Alliance — titre"],
            ["banner_alliance_body", "Bannière Alliance — texte"],
            ["home_greeting_prefix", "Préfixe salutation"],
            ["selection_title", "Titre sélection"],
            ["selection_subtitle", "Sous-titre sélection"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={texts[key]}
            onChange={(v) => set(key, v)}
            disabled={!isFullAdmin}
          />
        ))}
      </div>
      {isFullAdmin && (
        <Button
          size="sm"
          className="mt-3"
          disabled={busy === "texts"}
          onClick={() => run("texts", () => adminUpdatePlatformSetting("app_texts", texts))}
        >
          Enregistrer les textes
        </Button>
      )}
    </SectionCard>
  )
}

export function AdsEditor({
  settings,
  isFullAdmin,
  busy,
  run,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
}) {
  const [ads, setAds] = React.useState<AdSlot[]>(() =>
    parseAds(settingRaw(settings, "ads"))
  )

  const addAd = () => {
    setAds((prev) => [
      ...prev,
      {
        id: `ad-${Date.now()}`,
        slot: "dashboard",
        title: "Nouvelle pub",
        body: "",
        ctaLabel: "En savoir plus",
        href: "#",
        active: true,
      },
    ])
  }

  const update = (id: string, patch: Partial<AdSlot>) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  return (
    <SectionCard title="Publicités / bannières sponsorisées">
      <div className="rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-xs text-muted-foreground mb-4 space-y-2">
        <p className="font-semibold text-foreground text-sm">Où placer une pub ?</p>
        <ul className="space-y-1.5 list-disc pl-4">
          {AD_PLACEMENTS.map((p) => (
            <li key={p.id}>
              <strong>{p.label}</strong> — {p.where}
              <span className="block text-[11px]">{p.format}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        {ads.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune pub. Ajoutez un emplacement.</p>
        )}
        {ads.map((ad) => {
          const meta = AD_PLACEMENTS.find((p) => p.id === ad.slot)
          return (
          <div key={ad.id} className="rounded-xl border border-border p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline">{meta?.label || ad.slot}</Badge>
              <label className="text-xs flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={ad.active}
                  disabled={!isFullAdmin}
                  onChange={(e) => update(ad.id, { active: e.target.checked })}
                />
                Active
              </label>
            </div>
            {meta && (
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {meta.where} · {meta.format}
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Emplacement sur le site membre
                </label>
                <select
                  value={ad.slot}
                  disabled={!isFullAdmin}
                  onChange={(e) =>
                    update(ad.id, { slot: e.target.value as AdSlot["slot"] })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {AD_PLACEMENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Titre"
                value={ad.title}
                onChange={(v) => update(ad.id, { title: v })}
                disabled={!isFullAdmin}
              />
              <Field
                label="Texte"
                value={ad.body}
                onChange={(v) => update(ad.id, { body: v })}
                disabled={!isFullAdmin}
              />
              <Field
                label="CTA"
                value={ad.ctaLabel}
                onChange={(v) => update(ad.id, { ctaLabel: v })}
                disabled={!isFullAdmin}
              />
              <Field
                label="Lien"
                value={ad.href}
                onChange={(v) => update(ad.id, { href: v })}
                disabled={!isFullAdmin}
              />
              <Field
                label="Image URL (optionnel)"
                value={ad.imageUrl || ""}
                onChange={(v) => update(ad.id, { imageUrl: v || undefined })}
                disabled={!isFullAdmin}
              />
            </div>
            {isFullAdmin && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAds((prev) => prev.filter((a) => a.id !== ad.id))}
              >
                Supprimer
              </Button>
            )}
          </div>
          )
        })}
      </div>
      {isFullAdmin && (
        <div className="flex flex-wrap gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={addAd}>
            + Ajouter une pub
          </Button>
          <Button
            size="sm"
            disabled={busy === "ads"}
            onClick={() => run("ads", () => adminUpdatePlatformSetting("ads", ads))}
          >
            Enregistrer les pubs
          </Button>
        </div>
      )}
    </SectionCard>
  )
}

export function AutoModerationPanel({
  settings,
  isFullAdmin,
  busy,
  run,
  setMsg,
}: {
  settings: PlatformSettingRow[]
  isFullAdmin: boolean
  busy: string
  run: (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => Promise<void>
  setMsg: (m: string | null) => void
}) {
  const [cfg, setCfg] = React.useState<AutoModerationConfig>(() =>
    parseAutoMod(settingRaw(settings, "auto_moderation") ?? DEFAULT_AUTO_MOD)
  )
  const [preview, setPreview] = React.useState<
    Array<{ id: string; name: string; score: number; recommend: string; reasons: string[] }>
  >([])

  return (
    <div className="space-y-4">
      <SectionCard title="IA de discernement (règles automatiques)">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-950 mb-3 space-y-1.5 leading-relaxed">
          <p>
            <strong>Auto-acceptation</strong> = si un profil en attente atteint vos seuils
            (complétion %, photo, nom…), le système peut le passer en « approuvé » sans clic
            manuel — <em>quand vous lancez</em> l’analyse / l’application, ou si la règle est
            active. Ce n’est <strong>pas</strong> un LLM payant.
          </p>
          <p>
            <strong>Auto-OK photos principales</strong> = si la photo principale passe les
            règles techniques (poids, nom de fichier…), elle peut être validée sans revue
            visuelle humaine.
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Analyse les profils en attente (photo, complétion, nom) et peut les accepter
          automatiquement selon les curseurs ci-dessous.
        </p>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <input
            type="checkbox"
            checked={cfg.enabled}
            disabled={!isFullAdmin}
            onChange={(e) => setCfg((c) => ({ ...c, enabled: e.target.checked }))}
          />
          Activer l’auto-acceptation des profils
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Complétion mini pour auto-valider ({cfg.minCompletion}%)
            </label>
            <input
              type="range"
              min={40}
              max={95}
              value={cfg.minCompletion}
              disabled={!isFullAdmin}
              onChange={(e) =>
                setCfg((c) => ({ ...c, minCompletion: Number(e.target.value) }))
              }
              className="w-full accent-primary mt-2"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Ex. 70 % = le profil doit être bien rempli avant acceptation auto.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm self-end pb-2">
            <input
              type="checkbox"
              checked={cfg.requirePhoto}
              disabled={!isFullAdmin}
              onChange={(e) => setCfg((c) => ({ ...c, requirePhoto: e.target.checked }))}
            />
            Photo obligatoire pour auto-valider
          </label>
          <label className="flex items-start gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={cfg.autoApprovePhotosIfPrimary}
              disabled={!isFullAdmin}
              onChange={(e) =>
                setCfg((c) => ({ ...c, autoApprovePhotosIfPrimary: e.target.checked }))
              }
            />
            <span>
              Auto-OK des photos principales (si conformes aux règles techniques)
              <span className="block text-[11px] text-muted-foreground mt-0.5">
                Utile en soft launch — désactivez si vous voulez tout valider à l’œil.
              </span>
            </span>
          </label>
        </div>
        {isFullAdmin && (
          <Button
            size="sm"
            className="mt-3"
            disabled={busy === "automod-save"}
            onClick={() =>
              run("automod-save", () =>
                adminUpdatePlatformSetting("auto_moderation", cfg)
              )
            }
          >
            Enregistrer les règles
          </Button>
        )}
      </SectionCard>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={busy === "automod-preview"}
          onClick={() =>
            run("automod-preview", async () => {
              const r = await adminPreviewAutoModeration()
              if (r.error) return { error: r.error }
              setPreview(r.items)
              setMsg(`${r.items.length} profil(s) analysés.`)
              return { success: true }
            })
          }
        >
          Prévisualiser l’analyse
        </Button>
        <Button
          size="sm"
          disabled={busy === "automod-run" || !cfg.enabled}
          onClick={() =>
            run("automod-run", async () => {
              const r = await adminRunAutoModeration()
              if (r.error) return { error: r.error }
              setMsg(
                `Auto-modo : ${r.approved} approuvé(s), ${r.reviewed} à revoir (${r.scanned} scannés).`
              )
              return { success: true }
            })
          }
        >
          Lancer l’auto-acceptation
        </Button>
      </div>

      {preview.length > 0 && (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {preview.map((p) => (
            <div key={p.id} className="p-3 flex justify-between gap-3 text-sm">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.reasons.join(" · ")}</p>
              </div>
              <div className="text-right shrink-0">
                <Badge
                  variant="outline"
                  className={
                    p.recommend === "approve"
                      ? "border-emerald-500 text-emerald-700"
                      : p.recommend === "reject"
                        ? "border-red-400 text-red-700"
                        : ""
                  }
                >
                  {p.recommend} · {p.score}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}
