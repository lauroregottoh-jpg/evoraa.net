"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Bell, MessageSquareHeart } from "lucide-react"
import { NotificationsList } from "@/components/notifications/NotificationsList"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"
import { cn } from "@/utils/cn"

type Notif = {
  id: string
  title: string
  body: string
  is_read: boolean | null
  created_at: string | null
}

const DEMO_ALERTS: Notif[] = [
  {
    id: "demo-1",
    title: "Complétez vos questionnaires",
    body: "Eva · Il vous reste des tests à finir. Des profils compatibles attendent que votre parcours soit complet pour pouvoir avancer avec vous.",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "3 personnes vous attendent",
    body: "Des membres ont vu votre profil. Terminez vos tests pour débloquer le Matching et leurs suggestions.",
    is_read: false,
    created_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "demo-3",
    title: "Bienvenue sur KELIAA",
    body: "Les messages du système apparaîtront ici : rappels, Alliance, questionnaires et alertes importantes.",
    is_read: true,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
]

export function AlertsAndFeedbackHub({
  notifications,
  error,
  defaultName,
  defaultEmail,
  priority,
}: {
  notifications: Notif[]
  error?: string
  defaultName: string
  defaultEmail: string
  priority?: boolean
}) {
  const searchParams = useSearchParams()
  const initialTab =
    searchParams.get("tab") === "avis" || priority ? "avis" : "alertes"
  const [tab, setTab] = React.useState<"alertes" | "avis">(initialTab)

  React.useEffect(() => {
    if (searchParams.get("tab") === "avis" || priority) setTab("avis")
    else if (searchParams.get("tab") === "alertes") setTab("alertes")
  }, [searchParams, priority])

  const items =
    notifications.length > 0
      ? notifications
      : searchParams.get("demo") === "orbs-preview"
        ? DEMO_ALERTS
        : notifications

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      <header className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Centre de messages
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          Alertes & avis
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Les <strong className="text-foreground font-semibold">alertes</strong>{" "}
          sont les messages du système (tests à finir, personnes qui vous
          attendent, Alliance…). Les{" "}
          <strong className="text-foreground font-semibold">avis</strong> vous
          permettent d’écrire à l’équipe.
        </p>
      </header>

      <div className="flex gap-1 rounded-2xl border border-border bg-secondary/40 p-1">
        <button
          type="button"
          onClick={() => setTab("alertes")}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold transition-all",
            tab === "alertes"
              ? "bg-white text-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="h-4 w-4" />
          Alertes
        </button>
        <button
          type="button"
          onClick={() => setTab("avis")}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold transition-all",
            tab === "avis"
              ? "bg-white text-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquareHeart className="h-4 w-4" />
          Avis
        </button>
      </div>

      {tab === "alertes" ? (
        <section className="space-y-4 animate-in fade-in duration-300">
          <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
            Ici : notifications système KELIAA — rappels de questionnaires,
            matching, Alliance, et messages importants envoyés par la plateforme.
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <NotificationsList initial={items} />
        </section>
      ) : (
        <section className="space-y-4 animate-in fade-in duration-300">
          <FeedbackForm
            defaultName={defaultName}
            defaultEmail={defaultEmail}
            defaultCategory={priority ? "complaint" : "suggestion"}
            pagePath="/notifications?tab=avis"
            title="Votre voix compte"
            subtitle="Bugs, plaintes, idées — chaque retour aide l’équipe à améliorer KELIAA."
          />
          {priority ? (
            <p className="text-xs text-accent font-semibold">
              Ticket prioritaire Alliance — votre message sera traité en priorité.
            </p>
          ) : null}
        </section>
      )}

      {tab === "alertes" && items.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          Astuce : les rappels « Continuer les tests » apparaissent aussi en haut
          de l’app.
        </p>
      ) : null}
    </div>
  )
}
