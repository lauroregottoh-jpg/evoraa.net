"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, MessageCircle, Sparkles } from "lucide-react"
import type { ConversationListItem } from "@/app/actions/messaging"
import type { DemoMatchThread } from "@/lib/demo/sarahGandeSimulations"
import { cn } from "@/utils/cn"

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
  const hasReal = conversations.length > 0

  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-6">
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
          {conversations.length + demoThreads.length} conversation
          {conversations.length + demoThreads.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && !hasReal && !hasDemo && (
        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-8 text-center space-y-4">
          <p className="font-serif text-xl text-foreground">
            Aucun message pour le moment
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            C&apos;est normal au début. En attendant une conversation, invitez un
            ami sérieux ou avancez dans l&apos;Académie du mariage.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
            <Link
              href="/dashboard#invite"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Inviter un ami
            </Link>
            <Link
              href="/academie-mariage"
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-border text-sm font-semibold"
            >
              Académie du mariage
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

      {hasDemo ? (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B6914] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#B8954A]" />
            Matchs & messages · aperçu
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
                  "rounded-2xl border transition-all duration-300",
                  t.unread
                    ? "border-[#B8954A]/50 bg-[#F7F0E0]/80 shadow-sm"
                    : "border-border/60 bg-background/90 hover:border-[#B8954A]/35"
                )}
              >
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center font-serif text-xl font-bold text-white shadow-inner",
                          t.photoGradient
                        )}
                      >
                        {t.partnerFirstName[0]}
                      </div>
                      {t.unread && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-foreground truncate">
                          {t.partnerFirstName}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/30 shrink-0">
                          <Sparkles className="h-3 w-3 fill-accent" /> {t.score}%
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs sm:text-sm truncate",
                          t.unread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {t.preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground font-sans">
                      {t.timeLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#5C1F28] px-2.5 py-1 text-[10px] font-bold text-[#F8F4EE] group-hover:bg-[#5C1F28]/90">
                      <MessageCircle className="h-3 w-3" />
                      Ouvrir
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}

      {hasReal ? (
        <div className="space-y-3">
          {hasDemo ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Conversations
            </p>
          ) : null}
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="block group"
            >
              <Card
                className={`rounded-2xl border transition-all duration-300 ${
                  conv.unread
                    ? "border-accent/60 bg-accent/5 shadow-sm"
                    : "border-border/60 bg-background/90 hover:border-border"
                }`}
              >
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center font-serif text-xl font-bold text-primary dark:text-accent shadow-inner">
                        {conv.partnerName[0]}
                      </div>
                      {conv.unread && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-foreground truncate">
                          {conv.partnerName}
                        </h3>
                        {conv.harmonyScore > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/30 shrink-0">
                            <Sparkles className="h-3 w-3 fill-accent" />{" "}
                            {conv.harmonyScore}%
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs sm:text-sm truncate ${
                          conv.unread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-xs text-muted-foreground font-sans">
                      {conv.timestamp}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
