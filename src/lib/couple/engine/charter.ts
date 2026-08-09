/**
 * Charte de rédaction — doc 41 (anti-IA, O→I→C→A).
 */

const FORBIDDEN = [
  /il est important de noter/i,
  /il convient de souligner/i,
  /il est essentiel de comprendre/i,
  /chaque couple est unique/i,
  /la communication est la clé/i,
  /belle opportunité de croissance/i,
  /vous êtes incompatibles/i,
  /faits l['']un pour l['']autre/i,
  /va transformer votre couple/i,
  /dans un premier temps[\s,]+dans un deuxième/i,
]

export function scrubAiFiller(text: string): string {
  let t = text.trim()
  for (const re of FORBIDDEN) {
    if (re.test(t)) {
      t = t.replace(re, "").replace(/\s{2,}/g, " ").trim()
    }
  }
  // Éviter démarrage mécanique répété
  t = t.replace(/^vos réponses montrent que\s+/i, "Le bilan suggère que ")
  return t
}

export function writeOICA(args: {
  observation: string
  interpretation: string
  consequence: string
  action: string
}): string[] {
  return [
    scrubAiFiller(args.observation),
    scrubAiFiller(args.interpretation),
    scrubAiFiller(args.consequence),
    scrubAiFiller(args.action),
  ].filter(Boolean)
}

export function forceVigilancePossibilite(args: {
  force: string
  vigilance: string
  possibilite: string
}): string {
  return scrubAiFiller(
    `Force : ${args.force} Vigilance : ${args.vigilance} Possibilité : ${args.possibilite}`
  )
}

export function voirChoisirAgir(args: {
  voir: string
  choisir: string
  agir: string
}): string[] {
  return [
    `Voir — ${scrubAiFiller(args.voir)}`,
    `Choisir — ${scrubAiFiller(args.choisir)}`,
    `Agir — ${scrubAiFiller(args.agir)}`,
  ]
}

export function textHasForbidden(text: string): string[] {
  const hits: string[] = []
  for (const re of FORBIDDEN) {
    if (re.test(text)) hits.push(re.source)
  }
  return hits
}
