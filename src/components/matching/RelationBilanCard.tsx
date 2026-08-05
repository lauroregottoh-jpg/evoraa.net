import Link from "next/link"
import { ArrowRight, ClipboardList, Crown, Lock } from "lucide-react"
import type { ProfileReport } from "@/lib/matching/report/types"

export function RelationBilanCard({
  report,
  compact = false,
}: {
  report: ProfileReport | null
  /** Dashboard / Alliance : version un peu plus courte */
  compact?: boolean
}) {
  if (!report) return null

  const isAlliance = report.tier === "alliance" || report.tier === "sovereign"
  const hasContent =
    Boolean(report.summary) ||
    report.highlights.length > 0 ||
    report.lightTips.length > 0

  if (!hasContent && !report.ctaUpgrade) return null

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Matching KELIAA
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary shrink-0" />
            Mon bilan relationnel
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            D&apos;après vos questionnaires — conseils concrets, pas un jugement.
          </p>
        </div>
        {isAlliance ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/30 bg-accent/10 px-2 py-1 rounded-full shrink-0">
            <Crown className="h-3 w-3" /> Alliance
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded-full shrink-0">
            <Lock className="h-3 w-3" /> Aperçu
          </span>
        )}
      </div>

      {isAlliance && report.summary ? (
        <p className="text-sm leading-relaxed text-foreground/90 border-l-2 border-primary/40 pl-3">
          {report.summary}
        </p>
      ) : null}

      {isAlliance && report.highlights.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Points par domaine
          </p>
          {(compact ? report.highlights.slice(0, 3) : report.highlights).map((h) => (
            <div
              key={h.pillar}
              className="rounded-xl border border-border/70 p-3.5 space-y-1.5"
            >
              <p className="text-sm font-semibold">{h.pillarName}</p>
              {h.incomplete ? (
                <p className="text-xs text-muted-foreground">{h.improvement}</p>
              ) : (
                <>
                  {h.strength ? (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">{h.strength}</p>
                  ) : null}
                  {h.improvement ? (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {h.improvement}
                    </p>
                  ) : null}
                  {h.academyHref ? (
                    <Link
                      href={h.academyHref}
                      className="inline-flex items-center text-xs font-semibold text-primary pt-1"
                    >
                      Module Académie <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          ))}
          {compact && report.highlights.length > 3 ? (
            <Link
              href="/assessments"
              className="text-xs font-semibold text-primary inline-flex items-center"
            >
              Voir les 5 domaines →
            </Link>
          ) : null}
        </div>
      ) : null}

      {!isAlliance && report.lightTips.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Conseils Découverte
          </p>
          {report.lightTips.map((t) => (
            <div key={t.title} className="rounded-xl border border-border/70 p-3.5 space-y-1">
              <p className="text-sm font-semibold">{t.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.advice}</p>
              {t.href ? (
                <Link href={t.href} className="text-xs font-semibold text-primary inline-flex items-center">
                  Académie <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

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
