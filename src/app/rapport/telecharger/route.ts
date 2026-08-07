import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { buildLivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { renderReportExportHtml } from "@/lib/rapport/personalized/exportReportHtml"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Téléchargement HTML du Rapport Personnalisé Alliance (complet ou en cours).
 * Se met à jour automatiquement : reconstruit depuis psychometric_results à chaque requête.
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Connexion requise", { status: 401 })
  }

  const usage = await getUsageSnapshot(user.id)
  if (!usage?.isPaid) {
    return new Response("Réservé aux membres Alliance", { status: 403 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, psychometric_results")
    .eq("user_id", user.id)
    .maybeSingle()

  const psych = profile?.psychometric_results as {
    personality?: number | null
    spiritual?: number | null
    relationship?: number | null
    couple_life?: number | null
    finances?: number | null
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
  } | null

  const living = buildLivingPersonalizedReport({
    firstName: profile?.first_name,
    psychometric: psych,
    isAlliance: true,
  })

  const generatedAtLabel = new Date(living.generatedAt).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  )

  const html = renderReportExportHtml({
    firstName: profile?.first_name || "Membre",
    living,
    generatedAtLabel,
  })

  const safeName = (profile?.first_name || "membre")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .toLowerCase()
  const mode =
    living.documentMode === "complete" ? "complet" : "en-cours"
  const filename = `keliaa-rapport-alliance-${mode}-${safeName}.html`

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
    },
  })
}
