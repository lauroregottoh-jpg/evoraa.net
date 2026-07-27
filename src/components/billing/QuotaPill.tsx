import Link from "next/link"
import { Crown } from "lucide-react"
import { cn } from "@/utils/cn"
import type { UsageSnapshot } from "@/lib/billing/usage"

type QuotaPillProps = {
  usage: Pick<
    UsageSnapshot,
    | "conversationsRemaining"
    | "conversationsLimit"
    | "messagesPerConversation"
    | "evaQuestionsLimit"
    | "isPaid"
    | "planName"
  >
  compact?: boolean
  className?: string
}

/** Quotas visibles partout — même lecture dashboard / messages / EVA. */
export function QuotaPill({ usage, compact, className }: QuotaPillProps) {
  const pct =
    usage.conversationsLimit > 0
      ? Math.min(
          100,
          Math.round(
            ((usage.conversationsLimit - usage.conversationsRemaining) /
              usage.conversationsLimit) *
              100
          )
        )
      : 0

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 text-primary mb-2">
        <Crown className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {compact ? usage.planName : "Quotas du mois"}
        </span>
      </div>
      <p className="font-serif text-2xl font-bold">
        {usage.conversationsRemaining}
        <span className="text-base font-normal text-muted-foreground">
          /{usage.conversationsLimit}
        </span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">conversations restantes</p>
      <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      {!compact && (
        <p className="text-[11px] text-muted-foreground mt-2">
          {usage.messagesPerConversation} msg/convo · EVA {usage.evaQuestionsLimit}/j
        </p>
      )}
      {!usage.isPaid && (
        <Link href="/billing" className="text-xs font-semibold text-accent mt-2 inline-block">
          Passer Alliance →
        </Link>
      )}
    </div>
  )
}
