"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, MapPin, Sparkles } from "lucide-react"
import { cn } from "@/utils/cn"
import { DEMO_COMPATIBILITIES } from "@/lib/demo/demoCompatibilities"

/** Aperçu démo des fiches compatibilité. */
export function DemoCompatibilityPanel() {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-[#B8954A]/45 bg-gradient-to-br from-[#FFFBF5] via-[#F2EBE0] to-[#F0E6D4] shadow-card">
      <div className="relative z-10 space-y-4 p-5 sm:p-6">
        <div className="space-y-1.5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A5F28]">
            <span className="rounded bg-[#A07070] px-1.5 py-0.5 text-[9px] tracking-widest text-[#D4AF72]">
              Démo
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#B8954A]" />
            Compatibilités · aperçu
          </p>
          <h2 className="font-serif text-2xl font-bold text-[#A07070]">
            Voici à quoi ressemblent vos suggestions
          </h2>
          <p className="max-w-lg text-sm text-[#A07070]/65 leading-relaxed">
            Exemples simulés pour découvrir le Matching. Ils disparaissent dès
            que vous avez de vraies compatibilités.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DEMO_COMPATIBILITIES.map((c, i) => (
            <article
              key={c.id}
              className="sim-match-card overflow-hidden rounded-2xl border border-[#B8954A]/25 bg-white shadow-sm"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={cn(
                  "relative aspect-[3/4] bg-gradient-to-br",
                  c.gradient
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center font-serif text-5xl font-bold text-white/90">
                  {c.name.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute left-2 top-2 rounded-md border border-dashed border-white/60 bg-[#A07070]/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D4AF72]">
                  Démo
                </span>
                <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Heart className="h-2.5 w-2.5 fill-current" /> {c.score}%
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                  <p className="font-serif text-base font-bold">
                    {c.name} · {c.age}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-white/80">
                    <MapPin className="h-3 w-3" />
                    {c.city}
                  </p>
                </div>
              </div>
              <div className="space-y-2 p-2.5">
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {c.highlight}
                </p>
                <Link
                  href={`/messages/demo/${
                    c.id === "demo-comp-david"
                      ? "david-mensah"
                      : c.id === "demo-comp-samuel"
                        ? "samuel-koffi"
                        : c.id === "demo-comp-jonathan"
                          ? "jonathan-ade"
                          : "marc-toure"
                  }`}
                  className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-[#A07070] text-[11px] font-bold text-[#F2EBE0]"
                >
                  Voir l’échange démo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
