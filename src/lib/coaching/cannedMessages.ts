/**
 * Templates de messages coaching (anti-détournement) — pas de chat libre illimité.
 */

export const COACHING_CANNED_TEMPLATES = {
  coach: [
    {
      id: "waiting_room",
      label: "Je suis en salle d’attente",
      body: "Bonjour, je suis en salle d’attente. Rejoignez-moi quand vous êtes prêt(e).",
    },
    {
      id: "in_5",
      label: "Je commence dans 5 min",
      body: "Je commence dans environ 5 minutes. Merci de vous connecter à l’heure.",
    },
    {
      id: "reschedule",
      label: "Report — nouvel horaire bientôt",
      body: "Je dois décaler notre séance. Un nouvel horaire vous sera proposé dans KELIAA.",
    },
  ],
  client: [
    {
      id: "on_my_way",
      label: "J’arrive / je me connecte",
      body: "Bonjour, je me connecte à la salle d’attente.",
    },
    {
      id: "need_2_min",
      label: "J’ai 2 minutes de retard",
      body: "Désolé(e), j’ai environ 2 minutes de retard. Je arrive.",
    },
    {
      id: "ready",
      label: "Je suis prêt(e)",
      body: "Je suis prêt(e) pour démarrer la séance.",
    },
  ],
} as const

export type CannedRole = keyof typeof COACHING_CANNED_TEMPLATES
