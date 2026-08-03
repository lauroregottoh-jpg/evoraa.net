import Link from "next/link"
import {
  BookOpen,
  Lightbulb,
  MessageCircle,
  Heart,
  Eye,
  Star,
  Lock,
  Send,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Target,
  AlertTriangle,
  Quote,
  MessageSquareHeart,
} from "lucide-react"
import { cn } from "@/utils/cn"
import type { UsageSnapshot } from "@/lib/billing/usage"
import type { SocialInsights } from "@/app/actions/social"
import type { EditorialItem } from "@/lib/editorial/library"

function EditorialIcon({ category }: { category: EditorialItem["category"] }) {
  const common = "h-3.5 w-3.5"
  switch (category) {
    case "defi":
      return <Target className={common} />
    case "question":
    case "conversation":
      return <HelpCircle className={common} />
    case "verset":
    case "verset_explique":
      return <BookOpen className={common} />
    case "erreur":
      return <AlertTriangle className={common} />
    case "conseil":
    case "conseil_coach":
    case "astuce":
      return <Lightbulb className={common} />
    case "citation":
      return <Quote className={common} />
    case "encouragement":
      return <Heart className={common} />
    default:
      return <Sparkles className={common} />
  }
}

export function DailyEditorialCard({
  item,
  featured = false,
}: {
  item: EditorialItem
  featured?: boolean
}) {
  const quoteStyle =
    item.category === "verset" ||
    item.category === "citation" ||
    item.category === "pensee"

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 space-y-2",
        featured && "border-primary/25 bg-gradient-to-br from-secondary/50 to-card"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
        <EditorialIcon category={item.category} />
        {item.label}
      </p>
      {item.title ? (
        <p className="font-semibold text-sm text-foreground">{item.title}</p>
      ) : null}
      <p
        className={cn(
          "leading-relaxed text-foreground",
          featured ? "font-serif text-base sm:text-lg" : "text-sm",
          quoteStyle && "italic"
        )}
      >
        {quoteStyle ? `« ${item.body} »` : item.body}
      </p>
      {item.source ? (
        <p className="text-xs text-primary font-medium">{item.source}</p>
      ) : null}
    </section>
  )
}

/** Legacy — prefer DailyEditorialCard */
export function DailyReminderCard({
  text,
  source,
}: {
  text: string
  source: string
}) {
  return (
    <DailyEditorialCard
      featured
      item={{
        id: "legacy-reminder",
        category: "pensee",
        label: "Pensée du jour",
        body: text,
        source,
      }}
    />
  )
}

export function DailyTipCard({ title, body }: { title: string; body: string }) {
  return (
    <DailyEditorialCard
      item={{
        id: "legacy-tip",
        category: "conseil",
        label: "Conseil du jour",
        title,
        body,
      }}
    />
  )
}

export function QuickAccessGrid({
  unreadMessages,
  social,
  isPaid,
}: {
  unreadMessages: number
  social: SocialInsights
  isPaid: boolean
}) {
  const items = [
    {
      href: "/messages",
      label: "Messages",
      sub: unreadMessages > 0 ? `${unreadMessages} non lu(s)` : "Conversations",
      icon: MessageCircle,
      tone: "bg-emerald-500/15 text-emerald-700",
      lock: false,
    },
    {
      href: "/compatibility",
      label: "Compatibilités",
      sub: "Suggestions",
      icon: Heart,
      tone: "bg-rose-500/15 text-rose-700",
      lock: false,
    },
    {
      href: "/inspiration",
      label: "Inspiration",
      sub: "Bibliothèque",
      icon: MessageSquareHeart,
      tone: "bg-teal-500/15 text-teal-800",
      lock: false,
    },
    {
      href: isPaid ? "/compatibility" : "/billing",
      label: "Visiteurs",
      sub: isPaid ? `${social.visitorCount}` : "Alliance",
      icon: Eye,
      tone: "bg-violet-500/15 text-violet-700",
      lock: !isPaid,
    },
    {
      href: isPaid ? "/compatibility" : "/billing",
      label: "Favoris",
      sub: isPaid ? `${social.favoriteCount}` : "Mes coups de ♥",
      icon: Star,
      tone: "bg-amber-500/15 text-amber-700",
      lock: !isPaid,
    },
  ] as const

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.label}
            href={item.href}
            className="relative rounded-2xl border border-border bg-card p-4 text-center hover:border-primary/30 transition-colors"
          >
            {item.lock && (
              <Lock className="absolute top-2 right-2 h-3.5 w-3.5 text-accent" />
            )}
            <div
              className={cn(
                "mx-auto h-11 w-11 rounded-full flex items-center justify-center",
                item.tone
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold mt-2.5">{item.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
          </Link>
        )
      })}
    </div>
  )
}

export function DailyQuotaCard({ usage }: { usage: UsageSnapshot }) {
  const used = usage.conversationsUsed
  const limit = usage.conversationsLimit
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Send className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">Initiatives ce mois</p>
            <p className="text-xs text-muted-foreground">
              {usage.conversationsRemaining} conversation(s) restante(s) · {usage.planName}
            </p>
          </div>
        </div>
        <p className="font-serif text-xl font-bold text-primary shrink-0">
          {used}/{limit}
        </p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(pct, used > 0 ? 4 : 0)}%` }}
        />
      </div>
    </section>
  )
}

export function AcademyTeaser() {
  return (
    <Link
      href="/academie-mariage"
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-primary/30 transition-colors"
    >
      <div className="h-11 w-11 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h2 className="font-serif text-lg font-bold">Académie du mariage</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Apprenez et préparez-vous — modules pratiques pour célibataires chrétiens
        </p>
      </div>
    </Link>
  )
}

export function CoachFab() {
  return (
    <Link
      href="/help"
      className="fixed bottom-20 sm:bottom-6 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-1.5 pr-4 py-1.5 shadow-lg hover:brightness-110 transition"
    >
      <span className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
        EVA
      </span>
      <span className="text-sm font-semibold">Coach</span>
    </Link>
  )
}
