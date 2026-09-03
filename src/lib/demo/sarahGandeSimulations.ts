/**
 * Données démo matchs/messages — visibles tant que l’engagement réel < 5.
 */

export type DemoChatMessage = {
  id: string
  fromMe: boolean
  text: string
  at: string
}

export type DemoMatchThread = {
  id: string
  partnerFirstName: string
  partnerAge: number
  city: string
  community: string
  score: number
  verified: boolean
  photoGradient: string
  preview: string
  unread: boolean
  matchedLabel: string
  timeLabel: string
  messages: DemoChatMessage[]
}

/** @deprecated use shouldShowDemoMatches */
export function isSarahGande(firstName?: string | null, lastName?: string | null) {
  const f = (firstName || "").trim().toLowerCase()
  const l = (lastName || "").trim().toLowerCase()
  return f === "sarah" && (l === "gande" || l.startsWith("gande"))
}

/** Afficher la démo tant qu’il y a moins de 5 matchs / convos / compatibilités réels. */
export function shouldShowDemoMatches(counts: {
  conversations?: number
  matches?: number
  compatibilities?: number
}) {
  const n = Math.max(
    counts.conversations ?? 0,
    counts.matches ?? 0,
    counts.compatibilities ?? 0
  )
  return n < 5
}

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()
const daysAgo = (d: number) => new Date(now - d * 86400_000).toISOString()

export const DEMO_MATCH_THREADS: DemoMatchThread[] = [
  {
    id: "david-mensah",
    partnerFirstName: "David",
    partnerAge: 33,
    city: "Lomé",
    community: "Assemblées de Dieu",
    score: 91,
    verified: true,
    photoGradient: "from-[#7F5557] to-[#B8954A]",
    preview: "Bonjour, j’ai beaucoup apprécié votre vision du mariage…",
    unread: true,
    matchedLabel: "Match · hier",
    timeLabel: "Il y a 2 h",
    messages: [
      {
        id: "dm1",
        fromMe: false,
        text: "Bonjour, j’ai beaucoup apprécié votre vision du mariage et de la foi sur votre profil. Merci pour votre authenticité.",
        at: daysAgo(1),
      },
      {
        id: "dm2",
        fromMe: true,
        text: "Bonjour David, merci pour votre message. Qu’est-ce qui vous a particulièrement parlé ?",
        at: hoursAgo(20),
      },
      {
        id: "dm3",
        fromMe: false,
        text: "Votre façon de parler du foyer comme un projet spirituel commun. C’est rare et précieux.",
        at: hoursAgo(4),
      },
      {
        id: "dm4",
        fromMe: false,
        text: "Si vous êtes d’accord, on pourrait échanger tranquillement — sans précipitation.",
        at: hoursAgo(2),
      },
    ],
  },
  {
    id: "samuel-koffi",
    partnerFirstName: "Samuel",
    partnerAge: 31,
    city: "Accra",
    community: "Église protestante",
    score: 87,
    verified: true,
    photoGradient: "from-[#1C3A2A] to-[#B8954A]",
    preview: "Paix du Seigneur. Votre témoignage m’a touché…",
    unread: false,
    matchedLabel: "Match · il y a 3 j",
    timeLabel: "Hier",
    messages: [
      {
        id: "sk1",
        fromMe: false,
        text: "Paix du Seigneur. Votre témoignage m’a touché — surtout votre désir de construire sur Christ.",
        at: daysAgo(3),
      },
      {
        id: "sk2",
        fromMe: true,
        text: "Paix à vous aussi. Merci. Qu’est-ce qui compte le plus pour vous dans une relation ?",
        at: daysAgo(2),
      },
      {
        id: "sk3",
        fromMe: false,
        text: "La prière commune, l’honnêteté, et une vision claire du mariage.",
        at: daysAgo(1),
      },
    ],
  },
  {
    id: "jonathan-ade",
    partnerFirstName: "Jonathan",
    partnerAge: 34,
    city: "Abidjan",
    community: "Communauté évangélique",
    score: 84,
    verified: false,
    photoGradient: "from-[#7F5557] to-[#7F5557]",
    preview: "Enchanté. J’ai vu notre compatibilité spirituelle…",
    unread: true,
    matchedLabel: "Match · aujourd’hui",
    timeLabel: "À l’instant",
    messages: [
      {
        id: "ja1",
        fromMe: false,
        text: "Enchanté. J’ai vu notre compatibilité spirituelle et j’aimerais simplement faire connaissance avec respect.",
        at: hoursAgo(1),
      },
      {
        id: "ja2",
        fromMe: false,
        text: "Pas de pression — juste un échange sincère si vous le souhaitez.",
        at: hoursAgo(0.5),
      },
    ],
  },
  {
    id: "marc-toure",
    partnerFirstName: "Marc",
    partnerAge: 36,
    city: "Cotonou",
    community: "Baptist",
    score: 79,
    verified: true,
    photoGradient: "from-[#1C2840] to-[#B8954A]",
    preview: "Vous : Merci, bonne semaine à vous aussi.",
    unread: false,
    matchedLabel: "Match · il y a 1 sem",
    timeLabel: "Il y a 5 j",
    messages: [
      {
        id: "mt1",
        fromMe: false,
        text: "Bonjour, j’espère que vous allez bien. Comment se passe votre semaine ?",
        at: daysAgo(7),
      },
      {
        id: "mt2",
        fromMe: true,
        text: "Bonjour, elle se passe bien, merci. Et la vôtre ?",
        at: daysAgo(6),
      },
      {
        id: "mt3",
        fromMe: false,
        text: "Très bien aussi. Que le Seigneur vous bénisse cette semaine.",
        at: daysAgo(5),
      },
      {
        id: "mt4",
        fromMe: true,
        text: "Merci, bonne semaine à vous aussi.",
        at: daysAgo(5),
      },
    ],
  },
]

/** Alias rétrocompat */
export const SARAH_GANDE_DEMO_THREADS = DEMO_MATCH_THREADS

export function getDemoThread(id: string) {
  return DEMO_MATCH_THREADS.find((t) => t.id === id) ?? null
}
