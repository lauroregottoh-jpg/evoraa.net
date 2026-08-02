"use client";

import * as React from "react";
import {
  Sparkles,
  Heart,
  Home,
  MessageCircle,
  CheckCircle2,
  Wallet,
  UserRound,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DomainScore, MatchInsight } from "@/lib/matching/types";

interface EvaExplanationBlockProps {
  partnerName: string;
  harmonyScore: number;
  pillars: {
    spirituality: string;
    familyVision: string;
    dialogue: string;
  };
  domainScores?: DomainScore[];
  insights?: MatchInsight[];
  className?: string;
}

function DomainIcon({ id }: { id: DomainScore["id"] }) {
  const cls = "h-3.5 w-3.5 text-accent shrink-0";
  switch (id) {
    case "spiritual":
      return <Heart className={cls} />;
    case "couple_life":
      return <Home className={cls} />;
    case "relationship":
      return <MessageCircle className={cls} />;
    case "finances":
      return <Wallet className={cls} />;
    case "personality":
      return <UserRound className={cls} />;
    default:
      return <Sparkles className={cls} />;
  }
}

function statusLabel(status: DomainScore["status"]) {
  if (status === "strong") return "Point fort";
  if (status === "watch") return "À discuter";
  return "Vigilance";
}

export function EvaExplanationBlock({
  partnerName,
  harmonyScore,
  pillars,
  domainScores = [],
  insights = [],
  className,
}: EvaExplanationBlockProps) {
  return (
    <Card
      className={`rounded-2xl border-accent/50 bg-gradient-to-br from-accent/10 via-background to-primary/5 shadow-sm overflow-hidden ${className || ""}`}
    >
      <CardHeader className="border-b border-border/40 pb-4 bg-background/60 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5 fill-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Transparence EVA
            </span>
          </div>
          <span className="text-xs font-serif font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground">
            {harmonyScore}% d&apos;harmonie constatée
          </span>
        </div>
        <CardTitle className="font-serif text-2xl text-foreground pt-1">
          Pourquoi {partnerName} vous est proposé(e) ?
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Analyse croisée par domaine — interactions à surveiller incluses, pas seulement un score
          global.
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {domainScores.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {domainScores.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-border/60 bg-background/80 p-3 space-y-2"
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <DomainIcon id={d.id} />
                    <span className="truncate">{d.label}</span>
                  </div>
                  <p className="font-serif text-2xl font-bold tabular-nums">{d.score}%</p>
                  <p
                    className={`text-[10px] uppercase tracking-wide font-semibold ${
                      d.status === "strong"
                        ? "text-emerald-600"
                        : d.status === "watch"
                          ? "text-amber-600"
                          : "text-rose-600"
                    }`}
                  >
                    {statusLabel(d.status)}
                  </p>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        d.status === "strong"
                          ? "bg-emerald-500/80"
                          : d.status === "watch"
                            ? "bg-amber-500/80"
                            : "bg-rose-500/70"
                      }`}
                      style={{ width: `${Math.max(6, Math.min(100, d.score))}%` }}
                    />
                  </div>
                </div>
            ))}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2 p-4 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Heart className="h-4 w-4 text-accent shrink-0" />
              <span>Spiritualité & Foi</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{pillars.spirituality}</p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Home className="h-4 w-4 text-accent shrink-0" />
              <span>Projet de Foyer</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{pillars.familyVision}</p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <MessageCircle className="h-4 w-4 text-accent shrink-0" />
              <span>Dialogue & Sincérité</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{pillars.dialogue}</p>
          </div>
        </div>

        {insights.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-semibold text-foreground">
              Interactions à garder en vue
            </h3>
            <div className="space-y-2">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`rounded-xl border p-3.5 flex gap-3 ${
                    insight.severity === "risk"
                      ? "border-rose-500/30 bg-rose-500/5"
                      : insight.severity === "watch"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-border/60 bg-background/70"
                  }`}
                >
                  {insight.severity === "info" ? (
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        insight.severity === "risk" ? "text-rose-600" : "text-amber-600"
                      }`}
                    />
                  )}
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground italic border-t border-border/40">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 not-italic" />
          <span>
            Cet appariement croise similarités, complémentarités et risques d&apos;interaction —
            conformément à la méthode KELIAA.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
