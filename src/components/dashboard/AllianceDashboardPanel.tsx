import Link from "next/link"
import {
  BadgeCheck,
  ClipboardList,
  Crown,
  Library,
  Sparkles,
} from "lucide-react"
import {
  COFFRE_INITIAL_UNLOCKS,
  COFFRE_UNLOCKS_PER_MONTH,
} from "@/lib/coffre/unlock"
import type { UsageSnapshot } from "@/lib/billing/usage"

/** Accueil Alliance — ce qui change vraiment pour un membre payant. */
export function AllianceDashboardPanel({
  firstName,
  usage,
  assessmentsDone,
}: {
  firstName?: string
  usage: UsageSnapshot
  assessmentsDone: number
}) {
  const name = firstName?.trim() || "Membre"

  return (
    <section className="rounded-[1.5rem] border border-accent/35 bg-gradient-to-br from-accent/15 via-white to-primary/[0.06] p-5 sm:p-6 space-y-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/25 text-accent">
          <Crown className="h-5 w-5" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Espace Alliance
          </p>
          <h2 className="font-serif text-2xl font-bold leading-tight">
            {name}, votre parcours Alliance est actif
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Voici ce qui change par rapport à Découverte : plus de suggestions,
            bilan relationnel, Coffre Premium, et badge Alliance.
          </p>
        </div>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        {[
          {
            icon: Sparkles,
            title: "Matching enrichi",
            body: `${usage.suggestionsLimit} suggestions / jour · ${usage.conversationsLimit} conversations / mois · ${usage.messagesPerConversation} messages / conversation`,
          },
          {
            icon: ClipboardList,
            title: "Mon bilan relationnel",
            body:
              assessmentsDone >= 5
                ? "Bilan complet débloqué à partir de vos tests."
                : `Terminez vos tests (${assessmentsDone}/5) pour affiner le bilan.`,
            href: assessmentsDone >= 5 ? "/premium" : "/assessments",
          },
          {
            icon: Library,
            title: "Coffre Premium",
            body: `${COFFRE_INITIAL_UNLOCKS} ressources au choix, puis +${COFFRE_UNLOCKS_PER_MONTH} / mois — inclus Alliance.`,
            href: "/coffre-premium",
          },
          {
            icon: BadgeCheck,
            title: "Badge & priorité",
            body: "Badge Alliance sur le profil + priorité soft dans les suggestions.",
            href: "/profile",
          },
        ].map((item) => {
          const Icon = item.icon
          const inner = (
            <>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </>
          )
          return (
            <li
              key={item.title}
              className="rounded-xl border border-border/70 bg-white/90 p-4 space-y-2"
            >
              {"href" in item && item.href ? (
                <Link href={item.href} className="block space-y-2 hover:opacity-90">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/coffre-premium"
          className="inline-flex h-10 items-center rounded-xl bg-primary text-primary-foreground px-4 text-xs font-bold"
        >
          Ouvrir le Coffre Premium
        </Link>
        <Link
          href="/premium"
          className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-xs font-semibold"
        >
          Gérer Alliance
        </Link>
      </div>
    </section>
  )
}
