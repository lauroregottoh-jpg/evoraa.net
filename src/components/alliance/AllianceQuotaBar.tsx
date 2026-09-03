import Link from "next/link"
import { Crown } from "lucide-react"

/** Barre permanente — valeur Alliance visible au quotidien. */
export function AllianceQuotaBar({
  suggestionsLimit,
  evaQuestionsLimit,
  coffreUnlocked,
  coffreQuota = 3,
}: {
  suggestionsLimit: number
  evaQuestionsLimit: number
  coffreUnlocked: number
  coffreQuota?: number
}) {
  return (
    <div className="border-b border-[#B8954A]/25 bg-gradient-to-r from-[#7F5557] via-[#7F5557] to-[#7F5557] text-[#F2EBE0]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        <Link
          href="/alliance/parcours"
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#D4AF72]"
        >
          <Crown className="h-3.5 w-3.5" />
          Alliance
        </Link>
        <span className="text-white/35 hidden sm:inline">·</span>
        <span className="text-white/75">
          Aujourd’hui · jusqu’à <strong className="text-white">{suggestionsLimit}</strong>{" "}
          suggestions
        </span>
        <span className="text-white/75">
          <strong className="text-white">{evaQuestionsLimit}</strong> questions Eva / j
        </span>
        <span className="text-white/75">
          <strong className="text-white">
            {Math.max(0, coffreQuota - coffreUnlocked)}
          </strong>{" "}
          PDF à choisir
        </span>
        <span className="ml-auto text-[#D4AF72]/90 font-semibold">Badge actif</span>
      </div>
    </div>
  )
}
