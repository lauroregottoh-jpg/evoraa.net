"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Eye, EyeOff, ArrowRight } from "lucide-react";
import type { DomainScore } from "@/lib/matching/types";
import type { AssessmentSlug } from "@/lib/assessments/questionBank";

export interface CompatibilityProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  community: string;
  harmonyScore: number;
  reasons: string[];
  domainScores?: DomainScore[];
  photoUrl?: string;
  isBlurred?: boolean;
  basis?: "demande" | "tests";
  partnerTestsCount?: number;
  missingOnPartner?: AssessmentSlug[];
}

interface CompatibilityCardProps {
  profile: CompatibilityProfile;
  defaultBlurred?: boolean;
  allowReveal?: boolean;
}

function statusDot(status: DomainScore["status"]) {
  if (status === "strong") return "bg-emerald-500";
  if (status === "watch") return "bg-amber-500";
  return "bg-rose-500";
}

export function CompatibilityCard({
  profile,
  defaultBlurred = true,
  allowReveal = true,
}: CompatibilityCardProps) {
  const [isBlurred, setIsBlurred] = React.useState(
    profile.isBlurred !== undefined ? profile.isBlurred : defaultBlurred
  );

  React.useEffect(() => {
    if (profile.isBlurred !== undefined) {
      setIsBlurred(profile.isBlurred);
    }
  }, [profile.isBlurred]);

  const initial = (profile.name?.[0] || "?").toUpperCase();
  const domains = (profile.domainScores ?? []).slice(0, 5);

  return (
    <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="relative h-48 sm:h-56 bg-secondary/80 overflow-hidden border-b border-border/40">
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              isBlurred ? "scale-110 blur-xl" : "scale-100 blur-0"
            }`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/15 to-secondary transition-all duration-500 ${
              isBlurred ? "filter blur-xl scale-110" : ""
            }`}
          >
            <span className="font-serif text-6xl text-primary/40 select-none">{initial}</span>
          </div>
        )}

        {!profile.photoUrl && (
          <div className="absolute inset-x-0 bottom-3 text-center">
            <span className="inline-flex rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground border border-border">
              Photo en attente
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/40 shadow-xs">
          <Sparkles className="h-4 w-4 text-accent fill-accent" />
          <span className="font-serif font-bold text-sm text-foreground">
            {profile.harmonyScore}% d&apos;harmonie
          </span>
        </div>
        {profile.basis === "demande" ? (
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex max-w-full rounded-lg bg-[#641F2B]/85 px-2.5 py-1 text-[10px] font-semibold leading-snug text-[#FFFDF9]">
              Compatibilité à préciser
            </span>
          </div>
        ) : null}

        {allowReveal && profile.photoUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsBlurred(!isBlurred);
            }}
            className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-md hover:bg-background px-2.5 py-1.5 rounded-full border border-border/60 text-xs font-medium text-muted-foreground transition-colors"
            title={isBlurred ? "Afficher la photo" : "Flouter la photo"}
          >
            {isBlurred ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-accent" />
                <span>Floutée</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-emerald-500" />
                <span>Visible</span>
              </>
            )}
          </button>
        )}
      </div>

      <CardHeader className="space-y-1 pb-3 pt-4 px-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-foreground">
            {profile.name}, {profile.age} ans
          </h3>
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-sans border-border/80 text-muted-foreground"
          >
            {profile.community}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {profile.city}
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-4 space-y-3">
        {domains.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Compatibilité par domaine
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {domains.map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot(d.status)}`} />
                  <span className="text-muted-foreground w-[7.5rem] truncate">{d.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        d.status === "strong"
                          ? "bg-emerald-500/80"
                          : d.status === "watch"
                            ? "bg-amber-500/80"
                            : "bg-rose-500/70"
                      }`}
                      style={{ width: `${Math.max(6, Math.min(100, d.score))}%` }}
                    />
                  </div>
                  <span className="font-serif font-semibold w-8 text-right tabular-nums">
                    {d.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Points clés
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.reasons.map((reason, idx) => (
              <span
                key={idx}
                className="text-xs bg-accent/10 text-accent-foreground dark:text-accent font-medium px-2.5 py-1 rounded-lg border border-accent/20 flex items-center gap-1"
              >
                ✓ {reason}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pt-2 pb-5 border-t border-border/30 bg-secondary/20">
        <Link href={`/compatibility/${profile.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full rounded-xl h-10 text-xs font-medium border-border/80 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <span>Consulter le Diagnostic d&apos;EVA</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
