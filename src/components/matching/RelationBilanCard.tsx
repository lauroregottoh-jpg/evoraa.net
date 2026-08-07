import Link from "next/link"
import { ArrowRight, ClipboardList, Crown, Lock } from "lucide-react"
import type { ProfileReport } from "@/lib/matching/report/types"

export function RelationBilanCard({
  report,
  compact = false,
}: {
  report: ProfileReport | null
  compact?: boolean
}) {
  if (!report) return null

  const isAlliance = report.tier === "alliance" || report.tier === "sovereign"
  if (report.lightTips.length === 0 && !report.ctaUpgrade && !report.overview) {
    return (
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2">
        <h2 className="font-serif text-xl font-bold">Rapport personnalisé</h2>
        <p className="text-sm text-muted-foreground">
          Pour l&apos;instant, vos réponses ne mettent pas en évidence de zone prioritaire.
          Continuez via l&apos;
          <Link href="/academie-mariage" className="text-primary font-semibold underline">
            Académie du mariage
          </Link>
          .
        </p>
      </section>
    )
  }

  const tips = compact ? report.lightTips.slice(0, isAlliance ? 4 : 2) : report.lightTips

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {report.offerLabel} · KELIAA
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary shrink-0" />
            Rapport personnalisé
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Lecture des 5 piliers du dossier — forces, vigilances et recommandations
            concrètes.
          </p>
        </div>
        {isAlliance ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/30 bg-accent/10 px-2 py-1 rounded-full shrink-0">
            <Crown className="h-3 w-3" /> {report.offerLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded-full shrink-0">
            <Lock className="h-3 w-3" /> Aperçu
          </span>
        )}
      </div>

      {isAlliance && report.overview && !compact ? (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {report.overview.body}
        </p>
      ) : null}

      <div className="space-y-3">
        {tips.map((t) => (
          <div
            key={t.id ?? `${t.title}-${t.dimensionLabel || ""}`}
            className="rounded-xl border border-border/70 p-3.5 space-y-1.5"
          >
            {(t.pillarName || t.dimensionLabel || t.scoreBandLabel) && (
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {[
                  t.id,
                  t.pillarName,
                  t.dimensionLabel,
                  t.score != null ? `${t.score}%` : null,
                  t.scoreBandLabel,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <p className="text-sm font-semibold">{t.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {t.advice}
            </p>
            {t.why ? (
              <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                {t.why}
              </p>
            ) : null}
            {t.href ? (
              <Link
                href={t.href}
                className="inline-flex items-center text-xs font-semibold text-primary pt-0.5"
              >
                Travailler en Académie <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      <Link
        href="/rapport"
        className="text-xs font-semibold text-primary inline-flex items-center"
      >
        {compact ? "Ouvrir le rapport complet →" : "Voir le rapport détaillé →"}
      </Link>

      {report.ctaUpgrade ? (
        <Link
          href={report.ctaUpgrade.href}
          className="flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground h-11 text-sm font-semibold"
        >
          {report.ctaUpgrade.label}
        </Link>
      ) : null}
    </section>
  )
}
