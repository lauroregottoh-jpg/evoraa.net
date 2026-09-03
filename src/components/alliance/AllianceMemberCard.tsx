import Link from "next/link"
import { BadgeCheck, Crown } from "lucide-react"

/** Carte membre Alliance — élégante, noir & or. */
export function AllianceMemberCard({
  firstName,
  memberSinceLabel,
}: {
  firstName: string
  memberSinceLabel: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[#B8954A]/40 bg-[#2D1020] text-[#F2EBE0] p-5 sm:p-6 shadow-elevated">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#B8954A]/20 blur-3xl"
      />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
            Alliance
          </p>
          <p className="font-serif text-2xl font-bold">{firstName}</p>
          <p className="text-xs text-white/65">Membre Premium</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#B8954A]/45 bg-[#B8954A]/15">
          <Crown className="h-5 w-5 text-[#D4AF72]" />
        </span>
      </div>
      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1">
          Depuis {memberSinceLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B8954A]/35 bg-[#B8954A]/10 px-3 py-1 text-[#D4AF72]">
          <BadgeCheck className="h-3.5 w-3.5" /> Badge Alliance
        </span>
      </div>
      <Link
        href="/billing"
        className="relative z-10 mt-4 inline-block text-[11px] font-semibold text-[#D4AF72]/90 underline underline-offset-2"
      >
        Gérer mon abonnement
      </Link>
    </div>
  )
}
