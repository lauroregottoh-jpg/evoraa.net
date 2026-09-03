"use client"

import * as React from "react"
import Link from "next/link"
import { Crown, Heart, MapPin, MessageCircle, Sparkles } from "lucide-react"
import { cn } from "@/utils/cn"
import {
  DEMO_MATCH_THREADS,
  type DemoMatchThread,
} from "@/lib/demo/sarahGandeSimulations"

function MatchCard({
  thread,
  index,
}: {
  thread: DemoMatchThread
  index: number
}) {
  return (
    <article
      className="sim-match-card group relative overflow-hidden rounded-2xl border border-[#B8954A]/30 bg-white shadow-card"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={cn(
          "relative aspect-[4/5] bg-gradient-to-br",
          thread.photoGradient
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-6xl font-bold text-white/90 drop-shadow-md">
            {thread.partnerFirstName.charAt(0)}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        {thread.verified ? (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-[#F3D9A4] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#2B2421]">
            <Crown className="h-2.5 w-2.5" /> Vérifié
          </span>
        ) : null}
        <span className="absolute left-2.5 bottom-14 z-10 rounded-md border border-dashed border-white/70 bg-[#5C1F28]/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#F3D9A4]">
          Démo
        </span>
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
          <Heart className="h-2.5 w-2.5 fill-current" /> {thread.score}%
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="font-serif text-lg font-bold leading-tight">
            {thread.partnerFirstName} · {thread.partnerAge}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/85">
            <MapPin className="h-3 w-3 shrink-0" />
            {thread.city}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#F3D9A4]">
            {thread.matchedLabel}
          </p>
        </div>
      </div>

      <div className="space-y-3 p-3.5">
        <p className="line-clamp-2 text-xs leading-relaxed text-[#2B2421]/70">
          {thread.preview}
        </p>
        <Link
          href={`/messages/demo/${thread.id}`}
          className="sim-open-msg inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5C1F28] text-xs font-bold text-[#F8F4EE] transition hover:bg-[#5C1F28]/90"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Ouvrir le message
        </Link>
      </div>
    </article>
  )
}

/**
 * Matchs & messages démo — visibles tant que l’engagement réel < 5.
 */
export function SimulatedMatchesPanel({
  variant = "discovery",
}: {
  variant?: "discovery" | "alliance"
}) {
  const threads = DEMO_MATCH_THREADS
  const unread = threads.filter((t) => t.unread).length

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border shadow-card",
        variant === "alliance"
          ? "border-dashed border-[#B8954A]/50 bg-gradient-to-br from-[#FFFBF5] via-[#F8F4EE] to-[#F0E6D4]"
          : "border-dashed border-[#B8954A]/40 bg-gradient-to-br from-[#FFFBF5] via-[#F8F4EE] to-[#F3E8D0]"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#B8954A]/15 blur-3xl"
      />

      <div className="relative z-10 space-y-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A5F28]">
              <span className="rounded bg-[#5C1F28] px-1.5 py-0.5 text-[9px] tracking-widest text-[#F3D9A4]">
                Démo
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#B8954A] discovery-spark" />
              Aperçu matchs & messages
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2421] leading-tight">
              Exemples pour vous guider
            </h2>
            <p className="max-w-lg text-sm text-[#2B2421]/65 leading-relaxed">
              Ces conversations sont{" "}
              <span className="font-semibold text-[#5C1F28]">simulées</span>. Elles
              disparaissent dès que vous avez 5 matchs, compatibilités ou
              conversations réels.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 ? (
              <span className="rounded-full bg-[#5C1F28] px-3 py-1 text-[11px] font-bold text-[#F8F4EE]">
                {unread} non lu{unread > 1 ? "s" : ""}
              </span>
            ) : null}
            <Link
              href="/messages"
              className="rounded-full border border-[#B8954A]/40 bg-white px-3 py-1 text-[11px] font-bold text-[#5C1F28] hover:bg-[#F7F0E0]"
            >
              Messages →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {threads.map((thread, i) => (
            <MatchCard key={thread.id} thread={thread} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
