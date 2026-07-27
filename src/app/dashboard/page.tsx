import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { getDashboardData } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Heart,
  ArrowRight,
  Camera,
  ClipboardList,
  Crown,
  Sparkles,
  ShieldCheck,
  Moon,
} from "lucide-react";
import { SocialInsightsCard } from "@/components/social/SocialInsightsCard";
import { cn } from "@/utils/cn";

export default async function DashboardPage() {
  const { data, error } = await getDashboardData();

  if (error || !data) {
    return (
      <MemberShell>
        <div className="py-10 space-y-4 max-w-lg">
          <p className="text-sm text-destructive">{error || "Espace indisponible."}</p>
          <Link href="/login">
            <Button variant="outline" className="rounded-xl">
              Se connecter
            </Button>
          </Link>
        </div>
      </MemberShell>
    );
  }

  const { usage } = data;
  const convPct =
    usage.conversationsLimit > 0
      ? Math.min(100, Math.round((usage.conversationsUsed / usage.conversationsLimit) * 100))
      : 0;

  return (
    <MemberShell
      firstName={data.firstName}
      planLabel={usage.planName}
      isPaid={usage.isPaid}
    >
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* Next steps / banners */}
        {data.nextSteps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "rounded-2xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between",
              step.tone === "photo" && "bg-[#F5EFE0] border-accent/30",
              step.tone === "upgrade" && "bg-primary text-primary-foreground border-primary",
              step.tone === "renew" && "bg-primary text-primary-foreground border-primary",
              step.tone === "profile" && "bg-primary/90 text-primary-foreground border-primary",
              step.tone === "tests" && "bg-white border-border"
            )}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  step.tone === "photo" && "bg-accent/20 text-accent",
                  (step.tone === "upgrade" || step.tone === "renew" || step.tone === "profile") &&
                    "bg-white/15 text-accent",
                  step.tone === "tests" && "bg-secondary text-primary"
                )}
              >
                {step.tone === "photo" && <Camera className="h-5 w-5" />}
                {step.tone === "tests" && <ClipboardList className="h-5 w-5" />}
                {(step.tone === "upgrade" || step.tone === "renew") && (
                  <Crown className="h-5 w-5" />
                )}
                {step.tone === "profile" && <Sparkles className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base leading-snug">{step.title}</p>
                <p
                  className={cn(
                    "text-xs sm:text-sm mt-0.5 leading-relaxed",
                    step.tone === "photo" || step.tone === "tests"
                      ? "text-muted-foreground"
                      : "text-primary-foreground/80"
                  )}
                >
                  {step.body}
                </p>
                {step.tone === "profile" && (
                  <div className="mt-2 h-1.5 rounded-full bg-white/20 overflow-hidden max-w-xs">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${data.completionPercentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            <Link href={step.href} className="shrink-0">
              <Button
                size="sm"
                className={cn(
                  "rounded-full h-9 px-4 text-xs font-semibold",
                  step.tone === "photo"
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                    : step.tone === "tests"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent hover:bg-accent/90 text-accent-foreground"
                )}
              >
                {step.cta} <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        ))}

        {/* Greeting card */}
        <section className="rounded-2xl bg-primary text-primary-foreground p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                Bonjour, {data.firstName}
              </h1>
              <p className="text-sm text-primary-foreground/75 mt-1 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                {data.isVerified ? "Membre vérifié(e)" : "Profil en maturité"}
                {data.retreatMode ? (
                  <span className="inline-flex items-center gap-1">
                    · <Moon className="h-3.5 w-3.5" /> Mode retraite
                  </span>
                ) : null}
              </p>
            </div>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Mon profil
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm sm:text-base italic text-primary-foreground/90 font-serif leading-relaxed max-w-xl">
            « {data.affirmation} »
          </p>
        </section>

        {/* Quota + stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/messages"
            className="rounded-2xl border border-border bg-white p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Messages</span>
            </div>
            <p className="font-serif text-2xl font-bold">{data.unreadMessages}</p>
            <p className="text-xs text-muted-foreground mt-1">
              non lu(s) · {data.conversationCount} conversation(s)
            </p>
            {data.latestPartnerName && (
              <p className="text-xs text-primary mt-2 truncate">
                Dernier fil : {data.latestPartnerName}
              </p>
            )}
          </Link>

          <Link
            href="/compatibility"
            className="rounded-2xl border border-border bg-white p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Compatibilités</span>
            </div>
            <p className="font-serif text-2xl font-bold">{data.topHarmonyCount}</p>
            <p className="text-xs text-muted-foreground mt-1">
              suggestion(s) · top {data.topHarmonyScore}%
            </p>
          </Link>

          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Crown className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Quotas du mois</span>
            </div>
            <p className="font-serif text-2xl font-bold">
              {usage.conversationsRemaining}
              <span className="text-base font-normal text-muted-foreground">
                /{usage.conversationsLimit}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">conversations restantes</p>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${convPct}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {usage.messagesPerConversation} msg/convo · {usage.suggestionsLimit} sugg./jour · EVA{" "}
              {usage.evaQuestionsLimit}/j
            </p>
            {!usage.isPaid && (
              <Link href="/billing" className="text-xs font-semibold text-accent mt-2 inline-block">
                Passer Alliance →
              </Link>
            )}
          </div>
        </div>

        <SocialInsightsCard insights={data.social} />

        {/* Sélection */}
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> La sélection KELIAA
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Profils choisis pour vous — matching à 3 piliers
              </p>
            </div>
            <Link href="/compatibility" className="text-xs font-semibold text-primary">
              Tout voir
            </Link>
          </div>

          {data.topSuggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Complétez votre profil et vos tests pour recevoir des suggestions.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.topSuggestions.map((s) => (
                <Link
                  key={s.profileId}
                  href={`/compatibility/${s.profileId}`}
                  className="rounded-xl border border-border/80 p-4 hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.city || "Ville non précisée"}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-bold px-2.5 py-1">
                    <Heart className="h-3 w-3" /> {s.score}%
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Tests + Aide */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/assessments"
            className="rounded-2xl border border-border bg-white p-5 hover:border-primary/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Tests</p>
            <p className="font-serif text-lg font-bold mt-1">
              {data.assessmentsDone}/{data.assessmentsTotal} piliers
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Personnalité · Foi & valeurs · Relationnel
            </p>
          </Link>
          <Link
            href="/help"
            className="rounded-2xl border border-border bg-white p-5 hover:border-primary/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">EVA</p>
            <p className="font-serif text-lg font-bold mt-1">Besoin d&apos;un conseil ?</p>
            <p className="text-xs text-muted-foreground mt-1">
              {usage.evaQuestionsLimit} questions / jour sur votre offre
            </p>
          </Link>
        </div>
      </div>
    </MemberShell>
  );
}
