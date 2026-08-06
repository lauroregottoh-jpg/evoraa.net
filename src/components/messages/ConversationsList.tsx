"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ChevronRight } from "lucide-react";
import type { ConversationListItem } from "@/app/actions/messaging";

export function ConversationsList({
  conversations,
  error,
}: {
  conversations: ConversationListItem[];
  error?: string;
}) {
  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Messages
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Vos messages
          </h1>
        </div>
        <Badge className="bg-primary/10 text-primary dark:text-accent border border-primary/20 rounded-full px-3 py-1">
          {conversations.length} conversation{conversations.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && conversations.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-8 text-center space-y-4">
          <p className="font-serif text-xl text-foreground">Aucun message pour le moment</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            C&apos;est normal au début. En attendant une conversation, invitez un ami sérieux
            ou avancez dans l&apos;Académie du mariage.
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

      <div className="space-y-3">
        {conversations.map((conv) => (
          <Link key={conv.id} href={`/messages/${conv.id}`} className="block group">
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
                          <Sparkles className="h-3 w-3 fill-accent" /> {conv.harmonyScore}%
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs sm:text-sm truncate ${
                        conv.unread ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <span className="text-xs text-muted-foreground font-sans">{conv.timestamp}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
