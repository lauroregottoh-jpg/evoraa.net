"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle2, Gauge } from "lucide-react"
import type { PlatformSettingRow } from "@/app/actions/admin"
import {
  CAPACITY_SETTING_KEY,
  parseCapacitySnapshot,
} from "@/lib/ops/capacityThresholds"
import {
  BUG_HUNT_SETTING_KEY,
  parseBugHuntReport,
} from "@/lib/ops/bugHuntTypes"

function settingValue(settings: PlatformSettingRow[], key: string): unknown {
  return settings.find((s) => s.key === key)?.value
}

/** Bandeau ops : capacité Free + dernier bug hunt. */
export function AdminOpsHealthBanner({
  settings,
}: {
  settings: PlatformSettingRow[]
}) {
  const capacity = parseCapacitySnapshot(
    settingValue(settings, CAPACITY_SETTING_KEY)
  )
  const bugs = parseBugHuntReport(settingValue(settings, BUG_HUNT_SETTING_KEY))

  if (!capacity && !bugs) return null

  const worst = capacity?.worst ?? "ok"
  const bugBad = bugs && (!bugs.ok || bugs.needsHuman > 0)

  if (worst === "ok" && !bugBad) {
    return (
      <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 flex items-start gap-3 text-sm text-emerald-950">
        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-700" />
        <div>
          <p className="font-semibold">Ops santé : OK</p>
          <p className="text-[12px] text-emerald-900/80 mt-0.5">
            {capacity
              ? `Capacité vérifiée ${new Date(capacity.checkedAt).toLocaleString("fr-FR")} · ${capacity.profiles} profils`
              : null}
            {capacity && bugs ? " · " : null}
            {bugs
              ? `Bug hunt ${new Date(bugs.checkedAt).toLocaleString("fr-FR")} · ${bugs.fixed} fix(es) auto`
              : null}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 space-y-2">
      {capacity && capacity.worst !== "ok" && (
        <div
          className={
            capacity.worst === "critical"
              ? "rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-950"
              : "rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          }
        >
          <div className="flex items-start gap-3">
            <Gauge className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="min-w-0 space-y-1.5">
              <p className="font-semibold">
                Capacité : passez à un abonnement payant
              </p>
              <ul className="text-[12px] space-y-1 list-disc pl-4">
                {capacity.alerts.map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}</strong> — {a.detail}
                    {a.upgrade === "supabase_pro"
                      ? " → Supabase Pro"
                      : a.upgrade === "vercel_pro"
                        ? " → Vercel Pro"
                        : a.upgrade === "openai"
                          ? " → quota OpenAI"
                          : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {bugBad && bugs && (
        <div className="rounded-2xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="min-w-0 space-y-1">
              <p className="font-semibold">
                Bug hunt : {bugs.fixed} auto-fix · {bugs.needsHuman} à revoir
              </p>
              <ul className="text-[12px] space-y-1 list-disc pl-4">
                {bugs.findings
                  .filter((f) => f.severity !== "info")
                  .slice(0, 6)
                  .map((f) => (
                    <li key={f.id}>
                      [{f.severity}] {f.title}
                      {f.autoFixed ? " (auto)" : ""}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
