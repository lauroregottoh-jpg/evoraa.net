"use client"

import {
  Compass,
  HeartHandshake,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"

const WHY = [
  {
    icon: Compass,
    title: "Quand le matching seul ne suffit pas",
    body: "Vous avez des suggestions, mais un doute précis bloque : timing du mariage, famille, pureté, argent. Un coach humain aide à trancher sans juger.",
  },
  {
    icon: MessageCircle,
    title: "Parler vrai, en 30 minutes",
    body: "Séance courte et ciblée : vous arrivez avec un sujet, vous repartez avec des prochaines étapes concrètes — pas un monologue interminable.",
  },
  {
    icon: Shield,
    title: "Cadre chrétien, confidentiel",
    body: "Accompagnement aligné avec l’esprit KELIAA : respect, discernement, sérieux — hors du bruit des réseaux.",
  },
  {
    icon: HeartHandshake,
    title: "Complément d’Alliance & de l’Académie",
    body: "Alliance ouvre le rapport et les axes ; l’Académie forme ; le coaching accélère un point précis quand vous êtes bloqué(e).",
  },
  {
    icon: Users,
    title: "Avant un engagement sérieux",
    body: "Idéal avant de présenter quelqu’un à la famille, avant un voyage à deux, ou quand la communication tourne en rond.",
  },
  {
    icon: Sparkles,
    title: "Packs flexibles",
    body: "De 1 à 12 séances de 30 min : commencez par une seule pour tester, puis enchaînez si le besoin est clair.",
  },
] as const

export function CoachingWhyGrid() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Pourquoi le coaching relationnel
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
          Pas pour « consommer » des séances — pour débloquer un vrai point
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          EVA guide. L’Académie forme. Le coaching relationnel intervient quand
          vous avez besoin d’une oreille formée et d’un plan d’action personnel.
        </p>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        {WHY.map((item, i) => {
          const Icon = item.icon
          return (
            <li
              key={item.title}
              className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
