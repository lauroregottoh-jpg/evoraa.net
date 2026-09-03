"use client"

import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import { CoupleScoreChart } from "@/components/couple/CoupleScoreChart"
import { cn } from "@/utils/cn"

export function CoupleReportBlocks({
  blocks,
  className,
}: {
  blocks: CoupleReportBlock[]
  className?: string
}) {
  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`
        switch (block.type) {
          case "h2":
            return (
              <h3
                key={key}
                className="font-serif text-[18pt] sm:text-[20pt] font-bold text-[#641F2B] pt-2 leading-snug"
              >
                {block.text}
              </h3>
            )
          case "paragraph":
            return (
              <p
                key={key}
                className="text-[14pt] leading-[1.65] text-[#2B2421]"
              >
                {block.text}
              </p>
            )
          case "ol":
            return (
              <ol
                key={key}
                className="list-decimal pl-6 space-y-3 text-[14pt] leading-[1.65]"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )
          case "ul":
            return (
              <ul
                key={key}
                className="list-disc pl-6 space-y-3 text-[14pt] leading-[1.65]"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case "callout": {
            const tone =
              block.tone === "alert"
                ? "border-[#641F2B]/35 bg-[#641F2B]/08"
                : block.tone === "info"
                  ? "border-[#2B2421]/15 bg-[#FFFDF9]"
                  : "border-[#D7B866]/40 bg-[#D7B866]/10"
            return (
              <aside
                key={key}
                className={cn(
                  "rounded-2xl border px-5 py-4 text-[14pt] leading-[1.65]",
                  tone
                )}
              >
                {block.text}
              </aside>
            )
          }
          case "scoreChart":
            return (
              <CoupleScoreChart
                key={key}
                label={block.label}
                scoreA={block.scoreA}
                scoreB={block.scoreB}
                nameA={block.nameA}
                nameB={block.nameB}
                convergence={block.convergence}
              />
            )
          case "fillBlank":
            return (
              <div
                key={key}
                className="rounded-2xl border border-dashed border-[#D7B866]/45 bg-white/70 p-4 sm:p-5"
              >
                <p className="text-sm font-semibold text-[#641F2B] mb-3">
                  {block.prompt}
                </p>
                <div
                  className="space-y-3"
                  style={{ minHeight: `${(block.lines ?? 2) * 2.25}rem` }}
                >
                  {Array.from({ length: block.lines ?? 2 }).map((_, li) => (
                    <div
                      key={li}
                      className="border-b border-[#2B2421]/20 h-8"
                    />
                  ))}
                </div>
              </div>
            )
          case "rolePlay":
            return (
              <div
                key={key}
                className="rounded-2xl border border-[#641F2B]/20 bg-[#FCFAF6] p-5 space-y-3"
              >
                <p className="text-[12pt] font-bold uppercase tracking-[0.18em] text-[#D7B866]">
                  Jeu de rôle
                </p>
                <p className="font-serif text-[18pt] font-bold">{block.title}</p>
                <p className="text-[14pt] leading-[1.65] text-[#2B2421]">
                  {block.scene}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#641F2B]/08 p-4">
                    <p className="text-[12pt] font-bold uppercase tracking-wider text-[#641F2B]">
                      Rôle A
                    </p>
                    <p className="mt-1 text-[14pt] leading-[1.65]">{block.roleA}</p>
                  </div>
                  <div className="rounded-xl bg-[#D7B866]/15 p-4">
                    <p className="text-[12pt] font-bold uppercase tracking-wider text-[#8A6A2E]">
                      Rôle B
                    </p>
                    <p className="mt-1 text-[14pt] leading-[1.65]">{block.roleB}</p>
                  </div>
                </div>
              </div>
            )
          case "cycleFlow":
            return (
              <div
                key={key}
                className="rounded-2xl border border-[#641F2B]/20 bg-[#FFFDF9] p-5 sm:p-6"
              >
                <p className="text-[12pt] font-bold uppercase tracking-[0.16em] text-[#D7B866]">
                  Schéma
                </p>
                <p className="font-serif text-[18pt] font-bold text-[#641F2B] mt-1">
                  {block.title}
                </p>
                <ol className="mt-4 space-y-0">
                  {block.steps.map((step, si) => (
                    <li key={step} className="flex flex-col items-stretch">
                      <div className="rounded-xl border border-[#641F2B]/15 bg-white px-4 py-3 text-[14pt] leading-[1.5]">
                        <span className="font-bold text-[#D7B866] mr-2">
                          {si + 1}.
                        </span>
                        {step}
                      </div>
                      {si < block.steps.length - 1 ? (
                        <div className="flex justify-center py-1 text-[#641F2B] text-[18pt] leading-none">
                          ↓
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            )
          case "visualCards":
            return (
              <div key={key} className="space-y-3">
                <p className="font-serif text-[18pt] font-bold text-[#641F2B]">
                  {block.title}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {block.cards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-[#D7B866]/35 bg-gradient-to-br from-white to-[#FFFDF9] p-4"
                    >
                      <p className="text-[12pt] font-bold uppercase tracking-wider text-[#D7B866]">
                        {card.label}
                      </p>
                      <p className="mt-2 text-[14pt] leading-[1.55]">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
