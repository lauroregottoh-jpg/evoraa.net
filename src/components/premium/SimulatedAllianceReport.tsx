"use client"

import { FileText, ShieldCheck, Zap } from "lucide-react"

/** Aperçu figé — montre le type de rapport Alliance, indépendamment des tests du membre. */
export function SimulatedAllianceReport() {
  return (
    <section className="rounded-2xl border border-dashed border-accent/40 bg-background p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Exemple simulé
        </p>
        <h2 className="font-serif text-xl font-bold">À quoi ressemble votre rapport</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Après paiement, KELIAA s’appuie sur vos questionnaires déjà remplis (pas un nouveau
          test obligatoire) et génère un bilan de ce type — avec vos données réelles.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Profil relationnel — ex. « Chloé, 29 ans »
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between gap-3 border-b border-border/60 pb-2">
            <span>Dialogue & conflits</span>
            <span className="font-semibold text-primary">Axe prioritaire</span>
          </li>
          <li className="flex justify-between gap-3 border-b border-border/60 pb-2">
            <span>Foi & rythme de vie</span>
            <span className="font-semibold">Aligné</span>
          </li>
          <li className="flex justify-between gap-3 border-b border-border/60 pb-2">
            <span>Vision mariage / Timing</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              À clarifier
            </span>
          </li>
          <li className="flex justify-between gap-3">
            <span>Finances & projet</span>
            <span className="font-semibold">Solide</span>
          </li>
        </ul>
        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          Suggestion du jour (ex.) : « Préparer une conversation calme sur les attentes de
          rythme avant d’engager une sérieuse relation. » Module Académie lié : Dialogue.
        </p>
      </div>

      <ul className="grid sm:grid-cols-3 gap-2 text-xs">
        {[
          { icon: FileText, t: "Bilan à partir de vos tests existants" },
          { icon: ShieldCheck, t: "Badge Alliance + priorité de visibilité" },
          { icon: Zap, t: "Boost optionnel pour encore plus de portée" },
        ].map((x) => (
          <li
            key={x.t}
            className="flex items-start gap-2 rounded-xl border border-border px-3 py-2.5"
          >
            <x.icon className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
            <span className="text-muted-foreground leading-snug">{x.t}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
