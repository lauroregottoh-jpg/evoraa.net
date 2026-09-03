/**
 * Compatibilités démo — aperçu pour Découverte / Alliance.
 */

export type DemoCompatibilityCard = {
  id: string
  name: string
  age: number
  city: string
  score: number
  community: string
  gradient: string
  highlight: string
}

export const DEMO_COMPATIBILITIES: DemoCompatibilityCard[] = [
  {
    id: "demo-comp-david",
    name: "David",
    age: 33,
    city: "Lomé",
    score: 91,
    community: "Assemblées de Dieu",
    gradient: "from-[#641F2B] to-[#D7B866]",
    highlight: "Foi · projet de foyer · communication",
  },
  {
    id: "demo-comp-samuel",
    name: "Samuel",
    age: 31,
    city: "Accra",
    score: 87,
    community: "Église protestante",
    gradient: "from-[#1C3A2A] to-[#D7B866]",
    highlight: "Valeurs · spiritualité · rythme de vie",
  },
  {
    id: "demo-comp-jonathan",
    name: "Jonathan",
    age: 34,
    city: "Abidjan",
    score: 84,
    community: "Communauté évangélique",
    gradient: "from-[#2A1810] to-[#641F2B]",
    highlight: "Vision mariage · famille · respect",
  },
  {
    id: "demo-comp-marc",
    name: "Marc",
    age: 36,
    city: "Cotonou",
    score: 79,
    community: "Baptist",
    gradient: "from-[#1C2840] to-[#D7B866]",
    highlight: "Personnalités · priorités · fiabilité",
  },
]
