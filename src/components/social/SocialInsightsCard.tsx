import Link from "next/link";
import { Eye, Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SocialInsights } from "@/app/actions/social";

type Props = {
  insights: SocialInsights;
};

export function SocialInsightsCard({ insights }: Props) {
  if (insights.visitorCount === 0 && insights.favoriteCount === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold">Curiosité & intérêt</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Qui a visité ou mis votre profil en favori
          </p>
        </div>
        {insights.locked && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-accent bg-accent/10 px-2 py-1 rounded-full">
            <Lock className="h-3 w-3" /> Alliance
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/80 p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Visiteurs</span>
          </div>
          <p className="font-serif text-2xl font-bold">{insights.visitorCount}</p>
          <ul className="mt-3 space-y-1.5">
            {insights.visitors.slice(0, 3).map((v) => (
              <li key={`${v.profileId}-${v.at}`} className="text-xs text-muted-foreground truncate">
                {insights.locked ? (
                  <span className="blur-[3px] select-none">{v.name}</span>
                ) : (
                  <Link href={`/compatibility/${v.profileId}`} className="text-primary hover:underline">
                    {v.name}
                    {v.city ? ` · ${v.city}` : ""}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/80 p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Favoris reçus</span>
          </div>
          <p className="font-serif text-2xl font-bold">{insights.favoriteCount}</p>
          <ul className="mt-3 space-y-1.5">
            {insights.favorites.slice(0, 3).map((f) => (
              <li key={`${f.profileId}-${f.at}`} className="text-xs text-muted-foreground truncate">
                {insights.locked ? (
                  <span className="blur-[3px] select-none">{f.name}</span>
                ) : (
                  <Link href={`/compatibility/${f.profileId}`} className="text-primary hover:underline">
                    {f.name}
                    {f.city ? ` · ${f.city}` : ""}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {insights.locked && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm">
            Passez <strong>Alliance</strong> pour voir qui s&apos;intéresse à votre profil.
          </p>
          <Link href="/billing">
            <Button size="sm" className="rounded-full bg-accent text-accent-foreground">
              Débloquer
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
