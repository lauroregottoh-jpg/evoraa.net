"use client"

import * as React from "react"
import Link from "next/link"
import { Gift, Sparkles, Zap, Crown } from "lucide-react"
import { cn } from "@/utils/cn"
import type { LoyaltyAccountDTO } from "@/lib/loyalty/account"

export function LoyaltyProgramCard({
  loyalty,
  compact = false,
}: {
  loyalty: LoyaltyAccountDTO
  compact?: boolean
}) {
  const progress = Math.min(100, (loyalty.consecutiveMonths / 12) * 100)

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/40 bg-gradient-to-br from-[#FFFBF5] via-[#F2EBE0] to-[#F0E6D4] shadow-card",
        compact ? "p-5" : "p-5 sm:p-7"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#B8954A]/20 blur-3xl"
      />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A5F28]">
              <Gift className="h-3.5 w-3.5 text-[#B8954A]" />
              Programme Fidélité Alliance
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#A07070]">
              Votre fidélité est récompensée
            </h2>
            <p className="max-w-lg text-sm text-[#A07070]/65 leading-relaxed">
              Chaque renouvellement vous offre des avantages supplémentaires pour
              poursuivre vos échanges et préparer votre projet de mariage avec
              sérénité.
            </p>
          </div>
          <span className="rounded-full border border-[#B8954A]/40 bg-white px-3 py-1 text-[11px] font-bold text-[#A07070]">
            Carte · {loyalty.fidelityCardLabel}
          </span>
        </div>

        <div className="rounded-2xl border border-[#B8954A]/25 bg-white/80 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#A07070]">
              Mois {Math.min(loyalty.consecutiveMonths, 12)} sur 12
              {loyalty.consecutiveMonths > 12
                ? ` · total ${loyalty.consecutiveMonths}`
                : ""}
            </span>
            <span className="text-xs text-[#7A5F28] font-bold">
              {loyalty.bonusActive
                ? `+${loyalty.bonusMessagesBalance} msgs bonus`
                : `${loyalty.bonusMessagesBalance} msgs (inactifs)`}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#E8D5B5]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B8954A] to-[#A07070] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-[#B8954A]/20 bg-[#F7F0E0]/60 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7A5F28]">
                Prochaine récompense
              </p>
              <p className="mt-1 font-semibold text-[#A07070]">
                +{loyalty.nextBonusMessages} messages
                {loyalty.nextBoosts > 0 ? " + Boost 24 h" : ""}
              </p>
            </div>
            <div className="rounded-xl border border-[#B8954A]/20 bg-[#F7F0E0]/60 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7A5F28]">
                Boosts dispo
              </p>
              <p className="mt-1 font-semibold text-[#A07070] inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-[#B8954A]" />
                {loyalty.profileBoostsAvailable}
              </p>
            </div>
          </div>
          {loyalty.vipSessionEligible ? (
            <p className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
              <Crown className="h-3.5 w-3.5" />
              Éligible Session VIP Alliance (12 mois)
            </p>
          ) : null}
        </div>

        {!compact ? (
          <details className="rounded-xl border border-[#B8954A]/25 bg-white/70 px-4 py-3 text-sm">
            <summary className="cursor-pointer font-semibold text-[#A07070]">
              En savoir plus
            </summary>
            <ul className="mt-2 space-y-1.5 text-xs text-[#A07070]/70 list-disc pl-4">
              <li>+15 messages à chaque renouvellement mensuel</li>
              <li>
                Tous les 3 mois : +30 messages + 1 Boost Profil 24 h
              </li>
              <li>À 12 mois : Session VIP Alliance</li>
              <li>
                Les bonus sont définitifs ; inactifs en Découverte, réactivés
                avec Alliance
              </li>
            </ul>
          </details>
        ) : (
          <Link
            href="/premium#fidelite"
            className="inline-flex text-xs font-bold text-[#A07070] underline"
          >
            Voir le programme →
          </Link>
        )}
      </div>
    </section>
  )
}

/** Carte affichée après paiement / renouvellement */
export function LoyaltyRewardReveal({
  bonusMessages,
  boosts,
  vip,
  onContinue,
}: {
  bonusMessages: number
  boosts: number
  vip?: boolean
  onContinue?: () => void
}) {
  const milestone = boosts > 0
  return (
    <div className="loyalty-reward-reveal fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/50 bg-gradient-to-br from-[#FFFBF5] to-[#F0E6D4] p-6 shadow-elevated text-center space-y-4">
        <div className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-40" />
        <p className="relative text-4xl">{milestone ? "🎉" : "🎁"}</p>
        <h2 className="relative font-serif text-2xl font-bold text-[#A07070]">
          {milestone
            ? "Félicitations ! Nouveau palier"
            : "Merci pour votre fidélité !"}
        </h2>
        <p className="relative text-sm text-[#A07070]/70">
          Vous venez de recevoir :
        </p>
        <ul className="relative space-y-2 text-sm font-semibold text-[#A07070]">
          <li className="rounded-xl bg-white/80 px-3 py-2">
            ✓ +{bonusMessages} messages bonus
          </li>
          {boosts > 0 ? (
            <li className="rounded-xl bg-white/80 px-3 py-2">
              ✓ {boosts} Boost Profil de 24 heures
            </li>
          ) : null}
          {vip ? (
            <li className="rounded-xl bg-white/80 px-3 py-2">
              ✓ Invitation Session VIP Alliance
            </li>
          ) : null}
        </ul>
        <button
          type="button"
          onClick={onContinue}
          className="relative inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#A07070] text-sm font-bold text-[#F2EBE0]"
        >
          Continuer
        </button>
      </div>
    </div>
  )
}

export function PricingLoyaltyTeaser() {
  return (
    <section className="rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#FFFBF5] via-white to-[#F2EBE0] p-6 sm:p-8 shadow-card space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A5F28] inline-flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-[#B8954A]" />
        Votre fidélité est récompensée
      </p>
      <h2 className="font-serif text-2xl font-bold text-[#A07070]">
        Programme Fidélité Alliance
      </h2>
      <p className="text-sm text-[#A07070]/70 leading-relaxed max-w-2xl">
        Chaque renouvellement Alliance vous permet de débloquer progressivement
        des récompenses exclusives (+15 messages, paliers +30 + Boost, Session
        VIP à 12 mois) et de faire évoluer votre Carte de Fidélité.
      </p>
      <ul className="grid sm:grid-cols-2 gap-2 text-xs text-[#A07070]/75">
        <li className="rounded-xl border border-[#B8954A]/20 bg-white/80 px-3 py-2">
          +15 messages après chaque renouvellement mensuel
        </li>
        <li className="rounded-xl border border-[#B8954A]/20 bg-white/80 px-3 py-2">
          Tous les 3 mois : +30 messages + Boost 24 h
        </li>
        <li className="rounded-xl border border-[#B8954A]/20 bg-white/80 px-3 py-2">
          Bonus définitifs, jamais retirés
        </li>
        <li className="rounded-xl border border-[#B8954A]/20 bg-white/80 px-3 py-2">
          Attribution automatique — sans code promo
        </li>
      </ul>
    </section>
  )
}
