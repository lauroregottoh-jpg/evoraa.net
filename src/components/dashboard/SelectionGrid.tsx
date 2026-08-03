import Link from "next/link"
import { Heart, MapPin, Briefcase, Crown } from "lucide-react"
import { cn } from "@/utils/cn"

export type SelectionCard = {
  profileId: string
  name: string
  age: number
  score: number
  city: string | null
  photoUrl: string | null
  community: string | null
  isVerified: boolean
}

export function SelectionGrid({ items }: { items: SelectionCard[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Complétez vos tests pour recevoir des suggestions plus précises.{" "}
        <Link href="/assessments" className="text-primary font-semibold underline">
          Voir les questionnaires
        </Link>
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((s) => (
        <Link
          key={s.profileId}
          href={`/compatibility/${s.profileId}`}
          className="group rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-colors"
        >
          <div className="relative aspect-[3/4] bg-secondary">
            {s.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.photoUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-serif text-muted-foreground/40">
                {s.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            {s.isVerified && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-foreground">
                <Crown className="h-2.5 w-2.5" /> Vérifié
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
              <p className="font-semibold text-sm truncate pr-14">
                {s.name}
                {s.age > 0 ? ` · ${s.age}` : ""}
              </p>
              <p className="text-[11px] text-white/80 flex items-center gap-1 truncate mt-0.5 pr-14">
                <MapPin className="h-3 w-3 shrink-0" />
                {s.city || "Ville non précisée"}
              </p>
              <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5">
                <Heart className="h-2.5 w-2.5 fill-current" /> {s.score}%
              </span>
            </div>
          </div>
          <div className="px-2.5 py-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Briefcase className="h-3 w-3 shrink-0" />
            <span className="truncate">{s.community || "Communauté"}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function SelectionHeader({
  title = "La sélection Keliaa",
  subtitle = "Des profils choisis pour vous",
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Heart className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="font-serif text-xl font-bold leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <Link
        href="/compatibility"
        className={cn(
          "text-xs font-semibold text-primary whitespace-nowrap rounded-full",
          "bg-primary/10 px-3 py-1.5 hover:bg-primary/15"
        )}
      >
        Voir tous →
      </Link>
    </div>
  )
}
