"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronRight,
  Clock,
  Inbox,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import type { ConversationListItem } from "@/app/actions/messaging"
import type { DemoMatchThread } from "@/lib/demo/sarahGandeSimulations"
import { cn } from "@/utils/cn"

function ConvRow({ conv }: { conv: ConversationListItem }) {
  return (
    <Link key={conv.id} href={`/messages/${conv.id}`} className="block group">
      <Card
        className={`rounded-2xl border transition-all duration-300 ${
          conv.unread
            ? "border-accent/60 bg-accent/5 shadow-sm"
            : "border-border/60 bg-background/90 hover:border-border"
        }`}
      >
        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center font-serif text-lg font-bold text-primary dark:text-accent shadow-inner">
                {conv.partnerName[0]}
              </div>
              {conv.unread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-background" />
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-foreground truncate">
                  {conv.partnerName}
                </h3>
                {conv.harmonyScore > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full border border-accent/30 shrink-0">
                    <Sparkles className="h-2.5 w-2.5 fill-accent" />{" "}
                    {conv.harmonyScore}%
                  </span>
                )}
              </div>
              <p
                className={`text-xs truncate ${
                  conv.unread
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {conv.lastMessage}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-right">
            <span className="text-[10px] text-muted-foreground font-sans">
              {conv.timestamp}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function SectionTitle({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  count: number
}) {
  if (count === 0) return null
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pt-1">
      <Icon className="h-3.5 w-3.5" />
      {label}
      <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] normal-case tracking-normal">
        {count}
      </span>
    </p>
  )
}

export function ConversationsList({
  conversations,
  error,
  demoThreads = [],
}: {
  conversations: ConversationListItem[]
  error?: string
  demoThreads?: DemoMatchThread[]
}) {
  const hasDemo = demoThreads.length > 0
  const unread = conversations.filter((c) => c.unread)
  const read = conversations.filter((c) => !c.unread)
  const recent = read.slice(0, 4)
  const older = read.slice(4)

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-5">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
          >
            Messages
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Vos messages
          </h1>
        </div>
        <Badge className="bg-primary/10 text-primary dark:text-accent border border-primary/20 rounded-full px-3 py-1">
          {conversations.length + demoThreads.length}
        </Badge>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && conversations.length === 0 && !hasDemo && (
        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-8 text-center space-y-4">
          <p className="font-serif text-xl text-foreground">
            Aucun message pour le moment
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Likez dans la Communauté KELIAA — un like mutuel ouvre les messages.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
            <Link
              href="/communaute"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Découvrir la communauté
            </Link>
            <Link
              href="/compatibility"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-border text-sm font-semibold"
            >
              Voir mes compatibilités
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {unread.length > 0 ? (
          <div className="space-y-2">
            <SectionTitle icon={Inbox} label="Non lus" count={unread.length} />
            <div className="space-y-2">
              {unread.map((c) => (
                <ConvRow key={c.id} conv={c} />
              ))}
            </div>
          </div>
        ) : null}

        {recent.length > 0 ? (
          <div className="space-y-2">
            <SectionTitle
              icon={MessageCircle}
              label="Récents"
              count={recent.length}
            />
            <div className="space-y-2">
              {recent.map((c) => (
                <ConvRow key={c.id} conv={c} />
              ))}
            </div>
          </div>
        ) : null}

        {older.length > 0 ? (
          <details className="group rounded-2xl border border-border/50 bg-secondary/20 open:bg-secondary/30">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Plus anciens ({older.length})
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" />
            </summary>
            <div className="space-y-2 px-3 pb-3">
              {older.map((c) => (
                <ConvRow key={c.id} conv={c} />
              ))}
            </div>
          </details>
        ) : null}

        {hasDemo ? (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6914]">
              <span className="rounded bg-[#5C1F28] px-1.5 py-0.5 text-[9px] tracking-widest text-[#F3D9A4]">
                Démo
              </span>
              Aperçu (disparaît à 5 vrais échanges)
            </p>
            {demoThreads.map((t, i) => (
              <Link
                key={t.id}
                href={`/messages/demo/${t.id}`}
                className="block group sim-inbox-row"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <Card
                  className={cn(
                    "rounded-2xl border border-dashed transition-all duration-300",
                    t.unread
                      ? "border-[#B8954A]/50 bg-[#F7F0E0]/80"
                      : "border-[#B8954A]/30 bg-background/90 hover:border-[#B8954A]/45"
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center font-serif text-lg font-bold text-white",
                          t.photoGradient
                        )}
                      >
                        {t.partnerFirstName[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base truncate">
                            {t.partnerFirstName}
                          </h3>
                          <span className="text-[9px] font-bold uppercase text-[#8B6914]">
                            Démo
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {t.preview}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#5C1F28] px-2.5 py-1 text-[10px] font-bold text-[#F8F4EE]">
                      Ouvrir
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
