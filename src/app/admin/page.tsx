import { notFound } from "next/navigation"

/** Ancien chemin /admin — volontairement fermé (sécurité par obscurité + contrôle d'accès). */
export default function LegacyAdminClosedPage() {
  notFound()
}
