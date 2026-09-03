"use client"

import { waitingCopy } from "@/lib/coaching/videoSessionProvider"

/**
 * Salle d’attente — en attente du pair, puis CTA « Entrer en séance » (Jitsi).
 */
export function CoachingSessionLobby({
  role,
  clientJoined,
  coachJoined,
  peerReady,
  onEnter,
  entering,
}: {
  role: "client" | "coach"
  clientJoined: boolean
  coachJoined: boolean
  /** L’autre personne est bien en ligne. */
  peerReady: boolean
  onEnter?: () => void
  entering?: boolean
}) {
  const waitingPeer = !peerReady

  return (
    <div className="rounded-2xl border border-[#A07070]/20 bg-gradient-to-br from-[#A07070] to-[#3D2A14] text-[#F2EBE0] p-6 sm:p-8 space-y-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF72]">
        Salle d’attente · coaching
      </p>

      {waitingPeer ? (
        <>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            {waitingCopy(role)}
          </h2>
          <p className="text-sm text-white/75 leading-relaxed max-w-md">
            Vous êtes en salle d’attente. Aucun crédit n’est consommé ici.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            {role === "client"
              ? "Votre coach est prêt"
              : "Le membre est prêt"}
          </h2>
          <p className="text-sm text-white/75 leading-relaxed max-w-md">
            Les deux personnes sont présentes. Entrez en séance : le micro
            s’ouvre dans KELIAA (temps restant visible, fin automatique). Aucun
            compte Google ou GitHub n’est demandé.
          </p>
        </>
      )}

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <PresenceCard
          label={role === "client" ? "Vous" : "Membre"}
          ready={clientJoined}
        />
        <PresenceCard
          label={role === "coach" ? "Vous" : "Coach"}
          ready={coachJoined}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
        {waitingPeer ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF72] animate-pulse" />
            En attente de connexion…
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-emerald-200">
            Les deux sont connectés
          </span>
        )}
      </div>

      {!waitingPeer && onEnter ? (
        <button
          type="button"
          onClick={onEnter}
          disabled={entering}
          className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-[#D4AF72] px-5 text-sm font-bold text-[#A07070] disabled:opacity-60"
        >
          {entering ? "Ouverture…" : "Entrer en séance"}
        </button>
      ) : null}
    </div>
  )
}

function PresenceCard({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/55">{label}</p>
      <p className="mt-1 text-sm font-semibold">
        {ready ? "Connecté" : "En attente"}
      </p>
      <div
        className={`mt-2 h-1.5 rounded-full ${
          ready ? "bg-emerald-400" : "bg-white/20"
        }`}
      />
    </div>
  )
}
