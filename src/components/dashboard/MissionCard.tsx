import Link from "next/link"
import { ArrowRight, Compass, ClipboardList, Camera, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

export type Mission = {
  id: string
  title: string
  body: string
  href: string
  cta: string
  kind: "tests" | "discover" | "photo" | "message" | "done"
}

const ICONS = {
  tests: ClipboardList,
  discover: Compass,
  photo: Camera,
  message: MessageCircle,
  done: Compass,
}

/** Une mission claire pour aujourd'hui — Accueil coach. */
export function MissionCard({ mission }: { mission: Mission }) {
  const Icon = ICONS[mission.kind]

  return (
    <section
      className={cn(
        "rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6",
        "flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Mission du jour
          </p>
          <h2 className="font-serif text-xl font-bold mt-0.5 leading-snug">{mission.title}</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{mission.body}</p>
        </div>
      </div>
      <Link href={mission.href} className="shrink-0">
        <Button className="rounded-full h-10 px-5 text-sm font-semibold w-full sm:w-auto">
          {mission.cta} <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </section>
  )
}
