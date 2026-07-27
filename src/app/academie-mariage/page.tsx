import Link from "next/link"
import {
  BookOpen,
  Heart,
  MessageCircle,
  Shield,
  Users,
  Wallet,
  Sparkles,
  Compass,
} from "lucide-react"
import { MemberPage } from "@/components/layout/MemberPage"
import { getMyGrowthAxes } from "@/app/actions/assessments"
import { ACADEMY_MODULES } from "@/lib/academy/modules"
import { cn } from "@/utils/cn"

const ICONS = {
  foi: BookOpen,
  dialogue: MessageCircle,
  conflits: Shield,
  purete: Heart,
  familles: Users,
  finances: Wallet,
  emotions: Sparkles,
  projet: Compass,
} as const

export default async function AcademieMariagePage() {
  const { axes } = await getMyGrowthAxes()
  const recommendedIds = new Set(
    axes.slice(0, 3).map((a) => a.academyHref.replace("/academie-mariage#", ""))
  )

  const recommended = ACADEMY_MODULES.filter((m) => recommendedIds.has(m.id))
  const others = ACADEMY_MODULES.filter((m) => !recommendedIds.has(m.id))

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-8 pb-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Académie du mariage
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Grandir avant (et pour) l&apos;alliance
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Des modules courts pour travailler vos axes d&apos;amélioration issus des
            questionnaires — dialogue, familles, pureté, finances, foi. Sans jugement : avec
            clarté.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/assessments" className="text-sm font-semibold text-primary underline">
              Voir mes axes (tests)
            </Link>
            <Link href="/help" className="text-sm font-semibold text-muted-foreground underline">
              Poser une question à EVA
            </Link>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold">Recommandé pour vous</h2>
            <p className="text-xs text-muted-foreground">
              Basé sur vos questionnaires — commencez par ces modules.
            </p>
            <div className="grid gap-4">
              {recommended.map((mod) => {
                const Icon = ICONS[mod.id]
                return (
                  <section
                    key={mod.id}
                    id={mod.id}
                    className="scroll-mt-24 rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 sm:p-6 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          Pour vous
                        </p>
                        <h3 className="font-serif text-xl font-bold">{mod.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{mod.summary}</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 pl-1">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson} className="text-sm flex gap-2">
                          <span className="text-accent font-bold">·</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {recommended.length > 0 && (
            <h2 className="font-serif text-xl font-bold pt-2">Tous les modules</h2>
          )}
          {(recommended.length > 0 ? others : ACADEMY_MODULES).map((mod) => {
            const Icon = ICONS[mod.id]
            return (
              <section
                key={mod.id}
                id={recommendedIds.has(mod.id) ? undefined : mod.id}
                className={cn(
                  "scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold">{mod.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{mod.summary}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson} className="text-sm flex gap-2">
                      <span className="text-accent font-bold">·</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          L&apos;Académie s&apos;enrichira de contenus vidéo et d&apos;exercices. Pour l&apos;instant :
          repères concrets liés à votre profil KELIAA.
        </p>
      </div>
    </MemberPage>
  )
}
