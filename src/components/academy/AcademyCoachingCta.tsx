import Link from "next/link"
import { MessageCircle, Phone } from "lucide-react"

type Props = {
  moduleTitle: string
  moduleId: string
}

export function AcademyCoachingCta({ moduleTitle, moduleId }: Props) {
  const href = `/contact?subject=coaching&module=${encodeURIComponent(moduleId)}&moduleTitle=${encodeURIComponent(moduleTitle)}`

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Coaching humain</p>
        <p className="font-serif text-lg font-bold">Besoin d&apos;aller plus loin ?</p>
        <p className="text-sm text-muted-foreground">
          Demandez un accompagnement personnalisé sur ce thème — un conseiller vous recontacte.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          <Phone className="h-4 w-4" /> Demander un coaching
        </Link>
        <Link
          href="/help"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-border text-sm font-semibold"
        >
          <MessageCircle className="h-4 w-4" /> Question à EVA
        </Link>
      </div>
    </div>
  )
}
