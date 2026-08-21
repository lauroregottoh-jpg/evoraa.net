"use client"

/**
 * @deprecated Ancien WebRTC maison — le live coaching utilise CoachingSessionRoom + Jitsi.
 * Conservé uniquement pour éviter des imports cassés ; ne plus brancher.
 */
export function CoachingAudioRoom(_props: {
  sessionId: string
  role: "client" | "coach"
}) {
  return (
    <p className="text-sm text-muted-foreground">
      La salle audio a été remplacée par Jitsi dans l’espace de coaching.
    </p>
  )
}
