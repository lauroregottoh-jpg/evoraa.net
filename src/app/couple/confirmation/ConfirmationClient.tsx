"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleUnlockReveal } from "@/components/couple/CoupleUnlockReveal"
import { COUPLE_BRAND } from "@/lib/couple/config"
import {
  couplePartnerJoinPath,
  coupleSpacePath,
} from "@/lib/couple/inviteLinks"

export default function CoupleConfirmationClient() {
  const search = useSearchParams()
  const inviteToken = search.get("inviteToken")
  const inviteCode = (search.get("inviteCode") || "").toUpperCase()
  const [copied, setCopied] = React.useState("")

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://www.keliaa.org"
  const spaceUrl = `${origin}${coupleSpacePath()}`
  const partnerUrl = inviteCode
    ? `${origin}${couplePartnerJoinPath(inviteCode)}`
    : inviteToken
      ? `${origin}/couple/join?token=${inviteToken}`
      : `${origin}/couple/rejoindre`
  const tokenPath = inviteToken ? `/couple/join?token=${inviteToken}` : null

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
    } catch {
      setCopied("")
    }
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(
    `Voici notre espace couple KELYA et le code pour te relier : ${inviteCode || "—"}\n${partnerUrl}`
  )}`

  return (
    <CouplePageFrame>
      <div className="max-w-2xl mx-auto space-y-8 py-6 px-1">
        <CoupleUnlockReveal onContinueHref="/couple/onboarding" />

        <div className="space-y-4 rounded-2xl border border-[#2B2421]/10 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-[#2B2421]">
            Partagez l’accès — {COUPLE_BRAND}
          </h2>
          <p className="text-sm text-[#2B2421]/80 leading-relaxed">
            Envoyez le lien et le code à l’autre. S’il/elle n’a pas de compte, le
            lien demande l’inscription. Après inscription, un nouveau clic ouvre
            l’espace. S’il/elle est déjà inscrit(e), on lui demande le code.
          </p>

          {inviteCode ? (
            <div className="rounded-xl border border-[#B8954A]/40 bg-[#F8F4EE] p-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Code à communiquer
              </p>
              <p className="font-mono text-2xl font-bold tracking-widest text-[#5C1F28]">
                {inviteCode}
              </p>
              <button
                type="button"
                className="text-xs font-semibold underline"
                onClick={() => void copy("code", inviteCode)}
              >
                {copied === "code" ? "Copié" : "Copier le code"}
              </button>
            </div>
          ) : null}

          <div className="rounded-xl border p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Lien de l’espace (vous deux)
            </p>
            <p className="text-xs break-all font-mono">{spaceUrl}</p>
            <button
              type="button"
              className="text-xs font-semibold underline"
              onClick={() => void copy("space", spaceUrl)}
            >
              {copied === "space" ? "Copié" : "Copier ce lien"}
            </button>
          </div>

          <div className="rounded-xl border p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Lien à envoyer à l’autre
            </p>
            <p className="text-xs break-all font-mono">{partnerUrl}</p>
            <button
              type="button"
              className="text-xs font-semibold underline"
              onClick={() => void copy("partner", partnerUrl)}
            >
              {copied === "partner" ? "Copié" : "Copier ce lien"}
            </button>
          </div>

          {tokenPath && !inviteCode ? (
            <p className="text-xs rounded-xl border bg-[#F8F4EE] px-3 py-2 break-all">
              Lien d’invitation : <span className="font-mono">{tokenPath}</span>
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white"
            >
              Envoyer sur WhatsApp
            </a>
            <Link
              href="/couple/espace"
              className="inline-flex h-11 items-center rounded-xl bg-[#5C1F28] text-white px-5 text-sm font-semibold"
            >
              Ouvrir notre espace
            </Link>
            <Link
              href="/couple/inviter"
              className="inline-flex h-11 items-center rounded-xl border border-[#2B2421]/15 px-5 text-sm font-semibold"
            >
              Voir / régénérer
            </Link>
          </div>
        </div>
      </div>
    </CouplePageFrame>
  )
}
