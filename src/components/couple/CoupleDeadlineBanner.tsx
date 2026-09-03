"use client"

import Link from "next/link"
import {
  COUPLE_GRACE_DAYS,
  COUPLE_QUESTIONNAIRE_DEADLINE_DAYS,
} from "@/lib/couple/config"
import { cn } from "@/utils/cn"

type Props = {
  createdAt?: string | Date | null
  className?: string
  /** Soft = rappel ; hard = après J+40 */
  variant?: "info" | "warning" | "hard"
}

export function CoupleDeadlineBanner({
  createdAt,
  className,
  variant = "info",
}: Props) {
  let daysLeft: number | null = null
  let hardCloseLeft: number | null = null
  if (createdAt) {
    const start = new Date(createdAt).getTime()
    const now = Date.now()
    const deadline =
      start + COUPLE_QUESTIONNAIRE_DEADLINE_DAYS * 24 * 60 * 60 * 1000
    const hard =
      start +
      (COUPLE_QUESTIONNAIRE_DEADLINE_DAYS + COUPLE_GRACE_DAYS) *
        24 *
        60 *
        60 *
        1000
    daysLeft = Math.ceil((deadline - now) / (24 * 60 * 60 * 1000))
    hardCloseLeft = Math.ceil((hard - now) / (24 * 60 * 60 * 1000))
  }

  const tone =
    variant === "hard"
      ? "border-[#2D1020]/40 bg-[#2D1020]/10"
      : variant === "warning"
        ? "border-[#B8954A]/50 bg-[#B8954A]/12"
        : "border-[#2D1020]/12 bg-[#F2EBE0]"

  return (
    <aside
      className={cn(
        "rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 text-sm leading-relaxed text-[#2D1020]",
        tone,
        className
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2D1020]">
        Délais du bilan
      </p>
      <p className="mt-1.5">
        Remplissez les questionnaires et téléchargez vos livrables sous{" "}
        <strong>{COUPLE_QUESTIONNAIRE_DEADLINE_DAYS} jours</strong>. Une marge
        opérationnelle de <strong>{COUPLE_GRACE_DAYS} jours</strong> suit
        ensuite (fermeture du questionnaire après J+
        {COUPLE_QUESTIONNAIRE_DEADLINE_DAYS + COUPLE_GRACE_DAYS}).
      </p>
      {daysLeft != null ? (
        <p className="mt-2 text-xs text-[#2D1020]/65">
          {daysLeft > 0
            ? `Il reste environ ${daysLeft} jour${daysLeft > 1 ? "s" : ""} avant l’échéance principale.`
            : hardCloseLeft != null && hardCloseLeft > 0
              ? `Échéance dépassée — marge restante ≈ ${hardCloseLeft} jour${hardCloseLeft > 1 ? "s" : ""}.`
              : "Délai dépassé — le questionnaire peut être fermé."}
        </p>
      ) : null}
      <p className="mt-2 text-xs">
        <Link href="/couple/dossier" className="font-semibold text-[#2D1020] underline">
          Voir le dossier livrables →
        </Link>
      </p>
    </aside>
  )
}

export function coupleIsQuestionnaireHardClosed(
  createdAt: string | Date | null | undefined
): boolean {
  if (!createdAt) return false
  const hard =
    new Date(createdAt).getTime() +
    (COUPLE_QUESTIONNAIRE_DEADLINE_DAYS + COUPLE_GRACE_DAYS) *
      24 *
      60 *
      60 *
      1000
  return Date.now() > hard
}
