import Link from "next/link"
import { Headphones, MessageCircle } from "lucide-react"
import { getAllianceWhatsappHref } from "@/lib/support/allianceWhatsapp"

/**
 * Support prioritaire Alliance :
 * - Ligne WhatsApp VIP
 * - Ticket in-app prioritaire (/notifications?tab=avis&priority=1)
 */
export function AlliancePrioritySupport({ isPaid }: { isPaid: boolean }) {
  const waHref = getAllianceWhatsappHref()

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Support prioritaire
        </p>
        <h2 className="font-serif text-xl font-bold">Deux portes d’entrée pour Alliance</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Les membres Alliance passent devant la file générale : WhatsApp VIP + ticket dans
          l’app. {!isPaid ? "Actif dès souscription Alliance." : "Votre accès est ouvert."}
        </p>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        <li className="rounded-xl border border-border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="h-4 w-4 text-accent" />
            WhatsApp VIP
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Une ligne dédiée pour les urgences compte / paiement / matching.
          </p>
          {isPaid ? (
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white hover:bg-[#1ebe57] transition-colors"
            >
              Ouvrir WhatsApp
            </a>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Disponible après activation Alliance.
            </p>
          )}
        </li>
        <li className="rounded-xl border border-border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Headphones className="h-4 w-4 text-accent" />
            Ticket prioritaire
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Message via Avis / Contact : file prioritaire côté équipe.
          </p>
          <Link
            href={isPaid ? "/notifications?tab=avis&priority=1" : "/premium"}
            className="inline-flex text-xs font-bold text-primary underline"
          >
            {isPaid ? "Ouvrir un ticket" : "Voir Alliance"}
          </Link>
        </li>
      </ul>
    </section>
  )
}
