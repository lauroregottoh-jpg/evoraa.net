import Image from "next/image"
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
  ChevronRight,
  Clock,
} from "lucide-react"
import { MemberPage } from "@/components/layout/MemberPage"
import { getMyGrowthAxes } from "@/app/actions/assessments"
import { AcademyCoachingCta } from "@/components/academy/AcademyCoachingCta"
import { ModuleProgressBar } from "@/components/academy/AcademyProgress"
import {
  academyLessonPath,
  academyModulePath,
  type AcademyModule,
} from "@/lib/academy/modules"
import { applyAcademyOverrides } from "@/lib/academy/published"
import { loadPublicCms } from "@/lib/admin/loadCms"
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
  const [{ axes }, cms] = await Promise.all([getMyGrowthAxes(), loadPublicCms()])
  const ACADEMY_MODULES = applyAcademyOverrides(cms.academyOverrides)
  const recommendedIds = new Set(
    axes.slice(0, 3).map((a) => {
      const parts = a.academyHref.split("/").filter(Boolean)
      return parts[parts.length - 1] || ""
    })
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
            Huit modules, une leçon profonde chacun. Lis à ton rythme — une partie
            accessible gratuitement ; le parcours premium arrivera ensuite.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Version gratuite
              </p>
              <p className="text-sm font-semibold">Accès de base aux modules</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lire les leçons essentielles, progresser à votre rythme. Contenu en
                consolidation.
              </p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-accent/5 px-4 py-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Version premium
              </p>
              <p className="text-sm font-semibold">Parcours enrichi (bientôt)</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Modules avancés, exercices guidés et suivi — le détail du contenu arrive
                prochainement.
              </p>
            </div>
          </div>
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
              {recommended.map((mod) => (
                <ModuleCard key={mod.id} mod={mod} highlight />
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {recommended.length > 0 && (
            <h2 className="font-serif text-xl font-bold pt-2">Tous les modules</h2>
          )}
          {(recommended.length > 0 ? others : ACADEMY_MODULES).map((mod) => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </div>

        <AcademyCoachingCta moduleId="dialogue" moduleTitle="Académie du mariage" />

        <p className="text-xs text-muted-foreground text-center">
          {ACADEMY_MODULES.length} modules ·{" "}
          {ACADEMY_MODULES.reduce((n, m) => n + m.lessons.length, 0)} leçons
        </p>
      </div>
    </MemberPage>
  )
}

function ModuleCard({
  mod,
  highlight,
}: {
  mod: AcademyModule
  highlight?: boolean
}) {
  const Icon = ICONS[mod.id]
  const first = mod.lessons[0]
  const cover = first?.coverImage

  return (
    <section
      id={mod.id}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-2xl border",
        highlight ? "border-2 border-primary/30 bg-primary/5" : "border-border bg-card"
      )}
    >
      {cover ? (
        <div className="relative h-36 sm:h-44 w-full overflow-hidden">
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white">
            <Icon className="h-4 w-4 opacity-90" />
            {highlight && (
              <span className="text-[10px] font-bold uppercase tracking-widest">Pour vous</span>
            )}
          </div>
        </div>
      ) : null}

      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          {!cover ? (
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-xl font-bold">{mod.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-3">
              {mod.summary}
            </p>
            {first ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Clock className="h-3.5 w-3.5" />~{first.durationMin} min de lecture
              </p>
            ) : null}
          </div>
        </div>

        <ModuleProgressBar
          moduleId={mod.id}
          lessonSlugs={mod.lessons.map((l) => l.slug)}
        />

        <ul className="space-y-1">
          {mod.lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={academyLessonPath(mod.id, lesson.slug)}
                className="text-sm flex items-center gap-2 py-1.5 hover:text-primary"
              >
                <span className="text-accent font-bold">{i + 1}.</span>
                <span className="flex-1">{lesson.title}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={academyModulePath(mod.id)}
            className="inline-flex h-9 items-center px-4 rounded-xl border border-border text-xs font-semibold"
          >
            Voir le module
          </Link>
          {first && (
            <Link
              href={academyLessonPath(mod.id, first.slug)}
              className="inline-flex h-9 items-center px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
            >
              Commencer
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
