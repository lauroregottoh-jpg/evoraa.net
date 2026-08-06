import Link from "next/link";
import { MemberPage } from "@/components/layout/MemberPage";
import { EvaSpiritualAdvisor } from "@/components/spiritual/EvaSpiritualAdvisor";
import { MemberHelpFaqs } from "@/components/help/MemberHelpFaqs";
import { getUsageSnapshot } from "@/lib/billing/usage";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { QuotaPill } from "@/components/billing/QuotaPill";

export default async function HelpPage() {
  const usage = await getUsageSnapshot();

  return (
    <MemberPage>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Aide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Questions & EVA</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            FAQ classées ci-dessous, puis barre de questions EVA pour un conseil personnalisé (
            <strong className="text-foreground">
              {usage?.evaQuestionsLimit ?? 3} questions / jour
            </strong>
            ).
          </p>
        </div>

        <MemberHelpFaqs />

        <div className="space-y-3 pt-2 border-t border-border">
          <h2 className="font-serif text-2xl font-bold">Poser une question à EVA</h2>
          {usage && <QuotaPill usage={usage} compact className="max-w-sm" />}
          {!usage?.isPaid && (
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm">
                Besoin de plus de questions EVA ? Alliance élargit le quota quotidien.
              </p>
              <MagneticButton href="/billing" variant="primary" size="md">
                Voir Alliance
              </MagneticButton>
            </div>
          )}
          <EvaSpiritualAdvisor dailyLimit={usage?.evaQuestionsLimit ?? 3} />
        </div>

        <div className="text-center pt-2">
          <Link href="/contact" className="text-sm font-semibold text-primary underline">
            Contacter un coach / conseiller
          </Link>
        </div>
      </div>
    </MemberPage>
  );
}
