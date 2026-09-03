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

/* ─── Palette Farata — rosâtre & pastel ─── */
const F = {
  bg: "#F5EDE0",          /* ivoire chaud */
  primary: "#7F5557",     /* prune rosée — boutons CTA, avatars */
  sidebar: "#AC7D79",     /* rose mauve — accent interface */
  gold: "#B8954A",        /* or — ornements */
  goldLight: "#D4AF72",
  border: "#D4C5BC",      /* border pastel */
  borderGold: "rgba(184,149,74,0.4)",
  muted: "#AC7D79",       /* rose mauve — texte secondaire */
  text: "#3E222D",        /* texte principal lisible */
  white: "#FFFFFF",
}

function EditorialIcon({ category }: { category: EditorialItem["category"] }) {
  const common = "h-3.5 w-3.5"
  switch (category) {
    case "defi":       return <Target className={common} />
    case "question":
    case "conversation": return <HelpCircle className={common} />
    case "verset":
    case "verset_explique": return <BookOpen className={common} />
    case "erreur":     return <AlertTriangle className={common} />
    case "conseil":
    case "conseil_coach":
    case "astuce":     return <Lightbulb className={common} />
    case "citation":   return <Quote className={common} />
    case "encouragement": return <Heart className={common} />
    default:           return <Sparkles className={common} />
  }
}

/* ─── Carte éditoriale du jour ─── */
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
      className="rounded-2xl p-5 space-y-3"
      style={{
        background: featured ? F.primary : F.white,
        border: `1px solid ${featured ? F.borderGold : F.border}`,
        boxShadow: "0 2px 12px -4px rgba(122, 79, 85,0.08)",
      }}
    >
      {/* Label */}
      <p
        className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
        style={{ color: featured ? F.gold : F.gold }}
      >
        <EditorialIcon category={item.category} />
        {item.label}
      </p>

      {/* Divider or */}
      <div className="h-px w-8 rounded-full" style={{ background: F.gold, opacity: 0.5 }} />

      {item.title ? (
        <p
          className="font-semibold text-sm"
          style={{ color: featured ? F.bg : F.primary }}
        >
          {item.title}
        </p>
      ) : null}

      <p
        className={cn(
          "leading-relaxed",
          featured ? "font-serif text-base sm:text-lg" : "text-sm",
          quoteStyle && "italic"
        )}
        style={{ color: featured ? "rgba(242,235,224,0.88)" : F.primary }}
      >
        {quoteStyle ? `« ${item.body} »` : item.body}
      </p>

      {item.source ? (
        <p className="text-xs font-semibold" style={{ color: F.gold }}>
          {item.source}
        </p>
      ) : null}
    </section>
  )
}

/** Legacy */
export function DailyReminderCard({ text, source }: { text: string; source: string }) {
  return (
    <DailyEditorialCard
      featured
      item={{ id: "legacy-reminder", category: "pensee", label: "Pensée du jour", body: text, source }}
    />
  )
}

export function DailyTipCard({ title, body }: { title: string; body: string }) {
  return (
    <DailyEditorialCard
      item={{ id: "legacy-tip", category: "conseil", label: "Conseil du jour", title, body }}
    />
  )
}

/* ─── Grille d'accès rapide ─── */
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
      iconBg: "#AC7D79",
      iconColor: "#F5EDE0",
      lock: false,
    },
    {
      href: "/compatibility",
      label: "Compatibilités",
      sub: "Suggestions",
      icon: Heart,
      iconBg: "#7F5557",
      iconColor: "#F5EDE0",
      lock: false,
    },
    {
      href: "/inspiration",
      label: "Inspiration",
      sub: "Bibliothèque",
      icon: MessageSquareHeart,
      iconBg: "#B8954A",
      iconColor: "#AC7D79",
      lock: false,
    },
    {
      href: isPaid ? "/compatibility" : "/billing",
      label: "Visiteurs",
      sub: isPaid ? `${social.visitorCount}` : "Alliance",
      icon: Eye,
      iconBg: isPaid ? "#AC7D79" : "#DED1C4",
      iconColor: isPaid ? "#F5EDE0" : "#7F5557",
      lock: !isPaid,
    },
    {
      href: isPaid ? "/compatibility" : "/billing",
      label: "Favoris",
      sub: isPaid ? `${social.favoriteCount}` : "Mes coups de ♥",
      icon: Star,
      iconBg: isPaid ? "#B8954A" : "#DED1C4",
      iconColor: isPaid ? "#AC7D79" : "#7F5557",
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
            className="relative rounded-2xl p-4 text-center transition-all hover:scale-[1.02] hover:shadow-md"
            style={{
              background: F.white,
              border: `1px solid ${F.border}`,
              boxShadow: "0 2px 10px -4px rgba(122, 79, 85,0.07)",
            }}
          >
            {item.lock && (
              <Lock
                className="absolute top-2 right-2 h-3.5 w-3.5"
                style={{ color: F.gold }}
              />
            )}
            <div
              className="mx-auto h-11 w-11 rounded-full flex items-center justify-center"
              style={{ background: item.iconBg }}
            >
              <Icon className="h-5 w-5" style={{ color: item.iconColor }} />
            </div>
            <p className="text-sm font-semibold mt-2.5" style={{ color: F.primary }}>
              {item.label}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: F.muted }}>
              {item.sub}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Quota conversations ─── */
export function DailyQuotaCard({ usage }: { usage: UsageSnapshot }) {
  const used = usage.conversationsUsed
  const limit = usage.conversationsLimit
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return (
    <section
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: F.white,
        border: `1px solid ${F.border}`,
        boxShadow: "0 2px 10px -4px rgba(122, 79, 85,0.07)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#F5EDE0" }}
          >
            <Send className="h-4 w-4" style={{ color: F.primary }} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm" style={{ color: F.primary }}>
              Initiatives ce mois
            </p>
            <p className="text-xs" style={{ color: F.muted }}>
              {usage.conversationsRemaining} conversation(s) restante(s) · {usage.planName}
            </p>
          </div>
        </div>
        <p className="font-serif text-xl font-bold shrink-0" style={{ color: F.gold }}>
          {used}/{limit}
        </p>
      </div>

      {/* Barre de progression */}
      <div
        className="mt-3 h-2 rounded-full overflow-hidden"
        style={{ background: "#F5EDE0" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.max(pct, used > 0 ? 4 : 0)}%`,
            background: `linear-gradient(90deg, ${F.primary}, ${F.gold})`,
          }}
        />
      </div>
    </section>
  )
}

/* ─── Teaser académie ─── */
export function AcademyTeaser() {
  return (
    <Link
      href="/academie-mariage"
      className="flex items-center gap-3 rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.01] hover:shadow-md"
      style={{
        background: F.white,
        border: `1px solid ${F.borderGold}`,
        boxShadow: "0 2px 10px -4px rgba(122, 79, 85,0.07)",
      }}
    >
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "#F5EDE0" }}
      >
        <GraduationCap className="h-5 w-5" style={{ color: F.primary }} />
      </div>
      <div className="min-w-0">
        <h2 className="font-serif text-lg font-bold" style={{ color: F.primary }}>
          Académie du mariage
        </h2>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: F.muted }}>
          Modules pratiques pour célibataires chrétiens
        </p>
      </div>
      <span className="ml-auto text-xs font-bold shrink-0" style={{ color: F.gold }}>
        →
      </span>
    </Link>
  )
}

/* ─── FAB Coach ─── */
export function CoachFab() {
  return (
    <Link
      href="/help"
      className="fixed bottom-20 sm:bottom-6 right-4 z-40 inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full shadow-lg transition hover:brightness-110"
      style={{ background: F.primary, color: F.bg }}
    >
      <span
        className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: F.gold, color: F.primary }}
      >
        EVA
      </span>
      <span className="text-sm font-semibold">Coach</span>
    </Link>
  )
}
