import Link from "next/link"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"

/**
 * Ancien chemin /admin — volontairement fermé.
 * Affiche une page claire (plus de 404 brut) + lien vers la vraie console.
 */
export default function LegacyAdminClosedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F6F5]">
      <div className="max-w-md text-center space-y-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Accès réservé
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cette adresse n’est pas la console d’administration. Connectez-vous
          avec le compte admin, puis ouvrez le panneau opérationnel.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/login?next=${encodeURIComponent(OPS_CONSOLE_PATH)}`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Connexion admin
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-primary underline underline-offset-2"
          >
            Espace membre
          </Link>
        </div>
      </div>
    </div>
  )
}
