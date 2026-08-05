import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

/** Déconnexion fiable (GET) — évite les plantages de Server Actions. */
export async function GET() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
