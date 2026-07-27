/**
 * URL publique Supabase du projet KELIAA.
 * Utilisée en secours si Vercel a une mauvaise variable d'environnement
 * (ex. URL preview vercel.app au lieu de *.supabase.co).
 */
export const KELIAA_SUPABASE_URL = "https://rrjwhrdtokncfrzxtfoa.supabase.co"

export function resolveSupabaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!configured) return KELIAA_SUPABASE_URL
  // Mauvaise config fréquente : URL Vercel preview/prod à la place de Supabase
  if (configured.includes("vercel.app") || !configured.includes("supabase.co")) {
    return KELIAA_SUPABASE_URL
  }
  return configured
}

export function resolveSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY manquant")
  }
  return key
}
