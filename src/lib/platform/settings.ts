import { createClient } from "@/utils/supabase/server"

/** Lit platform_settings.default_photo_blur (défaut: false — photos visibles). */
export async function getDefaultPhotoBlur(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "default_photo_blur")
      .maybeSingle()

    if (!data) return false
    return data.value === true || data.value === "true"
  } catch {
    return false
  }
}
