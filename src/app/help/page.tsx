import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { EvaSpiritualAdvisor } from "@/components/spiritual/EvaSpiritualAdvisor";
import { getUsageSnapshot } from "@/lib/billing/usage";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default async function HelpPage() {
  const usage = await getUsageSnapshot();

  return (
    <MemberShell
      planLabel={usage?.planName}
      isPaid={usage?.isPaid}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Aide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">EVA & conseils</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Posez une question de discernement. Sur votre offre, vous disposez de{" "}
            <strong className="text-foreground">{usage?.evaQuestionsLimit ?? 3} questions / jour</strong>
            . Pour un échange humain, contactez nos coachs.
          </p>
        </div>

        {!usage?.isPaid && (
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm">
              Besoin de plus de questions EVA et de conversations ? Alliance débloque un usage
              sérieux du matching.
            </p>
            <MagneticButton href="/billing" variant="primary" size="md">
              Voir Alliance
            </MagneticButton>
          </div>
        )}

        <EvaSpiritualAdvisor dailyLimit={usage?.evaQuestionsLimit ?? 3} />

        <div className="text-center pt-4">
          <Link href="/contact" className="text-sm font-semibold text-primary underline">
            Contacter un coach / conseiller
          </Link>
        </div>
      </div>
    </MemberShell>
  );
}
