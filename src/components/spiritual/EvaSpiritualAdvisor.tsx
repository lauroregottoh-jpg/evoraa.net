"use client";

import * as React from "react";
import { Sparkles, Send, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { askEvaAction, getEvaQuotaAction } from "@/app/actions/eva";

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const STARTERS = [
  "C’est quoi KELIAA, concrètement ?",
  "Combien coûte Alliance ?",
  "Comment fonctionne le matching ?",
  "Par où commencer mes questionnaires ?",
  "Que propose l’Académie du mariage ?",
];

type Props = {
  dailyLimit?: number;
  /** Masque le compteur quota (pages marketing contact) */
  showQuota?: boolean;
  topicsLabel?: string;
};

export function EvaSpiritualAdvisor({
  dailyLimit = 3,
  showQuota = true,
  topicsLabel = "Suggestions",
}: Props) {
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [limit, setLimit] = React.useState(dailyLimit);
  const [remaining, setRemaining] = React.useState(dailyLimit);
  const [quotaError, setQuotaError] = React.useState("");
  const [turns, setTurns] = React.useState<ChatTurn[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour, je suis Eva. Je peux vous éclairer sur KELIAA, le Matching, l’Académie, Alliance, ou un point relationnel. Que souhaitez-vous clarifier ?",
    },
  ]);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    getEvaQuotaAction().then((q) => {
      if (!q.error) {
        setLimit(q.limit);
        setRemaining(q.remaining);
      }
    });
  }, [dailyLimit]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns, busy]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    if (remaining <= 0) {
      setQuotaError("Quota EVA du jour atteint. Revenez demain ou passez Alliance.");
      return;
    }

    setBusy(true);
    setQuotaError("");
    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
    };
    setTurns((prev) => [...prev, userTurn]);
    setInput("");

    const history = turns
      .filter((t) => t.id !== "welcome")
      .concat(userTurn)
      .map((t) => ({ role: t.role, content: t.content }));

    const result = await askEvaAction({ question: q, history: history.slice(0, -1) });

    if (!result.ok) {
      setQuotaError(result.error);
      if (typeof result.remaining === "number") setRemaining(result.remaining);
      if (typeof result.limit === "number") setLimit(result.limit);
      setBusy(false);
      return;
    }

    setRemaining(result.remaining);
    setLimit(result.limit);
    setTurns((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: result.answer,
        ctaHref: result.ctaHref,
        ctaLabel: result.ctaLabel,
      },
    ]);
    setBusy(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await ask(input);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" />
            {topicsLabel}
          </h3>
          {showQuota ? (
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {remaining}/{limit} aujourd&apos;hui
            </span>
          ) : null}
        </div>

        {quotaError && (
          <div className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-xs space-y-2">
            <p>{quotaError}</p>
            <Link href="/billing" className="font-semibold text-primary underline">
              Voir Alliance
            </Link>
          </div>
        )}

        <div className="space-y-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              disabled={busy || remaining <= 0}
              className="w-full text-left p-3.5 rounded-2xl border border-border/60 bg-background/80 hover:border-border transition-all disabled:opacity-50"
            >
              <span className="font-serif font-semibold text-sm text-foreground block leading-snug">
                {s}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-background via-secondary/40 to-primary/5 shadow-sm flex flex-col min-h-[420px] max-h-[640px]">
          <div className="px-5 pt-5 pb-3 border-b border-border/40 space-y-1">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4 fill-accent" />
              <span className="text-xs uppercase tracking-wider font-semibold">
                EVA — conseillère KELIAA
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Mémoire de cette session active. Eva ne remplace ni pasteur, ni thérapeute.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {turns.map((t) => (
              <div
                key={t.id}
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[95%] ${
                  t.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-background/90 border border-border/50 text-foreground/90"
                }`}
              >
                <p className="whitespace-pre-wrap">{t.content}</p>
                {t.role === "assistant" && t.ctaHref && t.ctaLabel ? (
                  <Link
                    href={t.ctaHref}
                    className="inline-block mt-2 text-xs font-semibold text-accent underline"
                  >
                    {t.ctaLabel} →
                  </Link>
                ) : null}
              </div>
            ))}
            {busy ? (
              <div className="mr-auto flex items-center gap-2 text-muted-foreground text-sm italic">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Eva réfléchit…
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={onSubmit}
            className="p-4 border-t border-border/40 flex gap-2"
          >
            <Input
              type="text"
              placeholder="Écrire à Eva…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy || remaining <= 0}
              className="h-11 rounded-xl bg-background text-sm"
              maxLength={1200}
            />
            <Button
              type="submit"
              disabled={busy || remaining <= 0 || !input.trim()}
              className="h-11 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
