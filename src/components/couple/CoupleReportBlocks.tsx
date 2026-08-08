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
                className="font-serif text-xl sm:text-2xl font-bold text-[#5C1F28] pt-1"
              >
                {block.text}
              </h3>
            )
          case "paragraph":
            return (
              <p
                key={key}
                className="text-base sm:text-[17px] leading-[1.75] text-[#1C1412]/92"
              >
                {block.text}
              </p>
            )
          case "ol":
            return (
              <ol
                key={key}
                className="list-decimal pl-6 space-y-2.5 text-base sm:text-[17px] leading-relaxed"
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
                className="list-disc pl-6 space-y-2.5 text-base sm:text-[17px] leading-relaxed"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case "callout": {
            const tone =
              block.tone === "alert"
                ? "border-[#5C1F28]/35 bg-[#5C1F28]/08"
                : block.tone === "info"
                  ? "border-[#1C1412]/15 bg-[#F8F4EE]"
                  : "border-[#B8954A]/40 bg-[#B8954A]/10"
            return (
              <aside
                key={key}
                className={cn(
                  "rounded-2xl border px-5 py-4 text-base leading-relaxed",
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
                className="rounded-2xl border border-dashed border-[#B8954A]/45 bg-white/70 p-4 sm:p-5"
              >
                <p className="text-sm font-semibold text-[#5C1F28] mb-3">
                  {block.prompt}
                </p>
                <div
                  className="space-y-3"
                  style={{ minHeight: `${(block.lines ?? 2) * 2.25}rem` }}
                >
                  {Array.from({ length: block.lines ?? 2 }).map((_, li) => (
                    <div
                      key={li}
                      className="border-b border-[#1C1412]/20 h-8"
                    />
                  ))}
                </div>
              </div>
            )
          case "rolePlay":
            return (
              <div
                key={key}
                className="rounded-2xl border border-[#5C1F28]/20 bg-[#FBF9F6] p-5 space-y-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
                  Jeu de rôle
                </p>
                <p className="font-serif text-xl font-bold">{block.title}</p>
                <p className="text-base leading-relaxed text-[#1C1412]/85">
                  {block.scene}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#5C1F28]/08 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5C1F28]">
                      Rôle A
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{block.roleA}</p>
                  </div>
                  <div className="rounded-xl bg-[#B8954A]/15 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A2E]">
                      Rôle B
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{block.roleB}</p>
                  </div>
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
