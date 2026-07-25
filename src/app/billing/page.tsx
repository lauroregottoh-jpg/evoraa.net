import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { getUsageSnapshot } from "@/lib/billing/usage";
import { getHeroPaidPlan, getPlan } from "@/lib/billing/plans";
import { CheckoutPlanButton } from "@/components/billing/CheckoutPlanButton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const usage = user ? await getUsageSnapshot(user.id) : null;
  const alliance = getHeroPaidPlan();
  const free = getPlan("free");

  if (!usage) {
    return (
      <MemberShell>
        <p className="text-sm text-destructive">Connectez-vous pour gérer votre abonnement.</p>
        <Link href="/login" className="text-sm text-primary underline mt-2 inline-block">
          Connexion
        </Link>
      </MemberShell>
    );
  }

  return (
    <MemberShell planLabel={usage.planName} isPaid={usage.isPaid}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Abonnement</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Votre offre KELIAA</h1>
          <p className="text-sm text-muted-foreground">
            Gratuit pour commencer. Alliance pour accélérer — matching à 3 piliers, sans surprise
            de renouvellement automatique.
          </p>
        </div>

        {usage.renewSoon && (
          <div className="rounded-2xl bg-primary text-primary-foreground p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                Votre Alliance expire dans {usage.daysRemaining} jour(s)
              </p>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Renouvelez pour garder vos quotas et votre badge.
              </p>
            </div>
            <CheckoutPlanButton planId="premium_plus" label="Renouveler Alliance" />
          </div>
        )}

        <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Offre actuelle</p>
              <p className="font-serif text-2xl font-bold flex items-center gap-2 mt-1">
                {usage.isPaid && <Crown className="h-5 w-5 text-accent" />}
                {usage.planName}
              </p>
            </div>
            {usage.endsAt && (
              <p className="text-xs text-muted-foreground text-right">
                Fin le
                <br />
                <span className="font-semibold text-foreground">
                  {new Date(usage.endsAt).toLocaleDateString("fr-FR")}
                </span>
              </p>
            )}
          </div>

          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            <li className="rounded-xl bg-secondary/50 px-3 py-2">
              Conversations : {usage.conversationsUsed}/{usage.conversationsLimit} ce mois
            </li>
            <li className="rounded-xl bg-secondary/50 px-3 py-2">
              Messages / conversation : {usage.messagesPerConversation}
            </li>
            <li className="rounded-xl bg-secondary/50 px-3 py-2">
              Suggestions / jour : {usage.suggestionsLimit}
            </li>
            <li className="rounded-xl bg-secondary/50 px-3 py-2">
              EVA / jour : {usage.evaQuestionsLimit}
            </li>
          </ul>
        </div>

        {!usage.isPaid && (
          <div className="rounded-2xl border-2 border-accent bg-white p-6 sm:p-8 space-y-5 relative overflow-hidden">
            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
              Recommandé
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold">{alliance.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{alliance.description}</p>
              <div className="mt-4 flex items-end gap-2">
                {alliance.compareAtXof && (
                  <span className="text-lg text-muted-foreground line-through">
                    {alliance.compareAtXof.toLocaleString("fr-FR")}
                  </span>
                )}
                <span className="font-serif text-4xl font-bold text-primary">
                  {alliance.amountXof.toLocaleString("fr-FR")}
                </span>
                <span className="text-sm text-muted-foreground mb-1">FCFA / mois</span>
              </div>
              {alliance.compareAtXof && (
                <p className="text-xs text-accent font-semibold mt-1">
                  Tarif de lancement — prix d&apos;ancrage{" "}
                  {alliance.compareAtXof.toLocaleString("fr-FR")} FCFA
                </p>
              )}
            </div>
            <ul className="space-y-2">
              {alliance.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <CheckoutPlanButton planId="premium_plus" label="Passer Alliance" />
          </div>
        )}

        {usage.isPaid && (
          <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
            <h2 className="font-serif text-xl font-bold">Renouveler</h2>
            <p className="text-sm text-muted-foreground">
              Le renouvellement est manuel. Aucun prélèvement surprise.
            </p>
            <CheckoutPlanButton planId="premium_plus" label="Renouveler 30 jours" />
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">Rappel Découverte (gratuit)</p>
          <p>
            {free.limits.conversationsPerMonth} conversations / mois ·{" "}
            {free.limits.messagesPerConversation} messages / conversation ·{" "}
            {free.limits.evaQuestionsPerDay} questions EVA / jour. Vous pouvez toujours répondre aux
            messages reçus.
          </p>
          <Link href="/pricing" className="inline-flex items-center text-primary font-semibold text-xs">
            Voir la page Tarifs <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" className="rounded-xl">
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    </MemberShell>
  );
}
