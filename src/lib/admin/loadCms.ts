import { createClient } from "@/utils/supabase/server"
import {
  parseAcademyOverrides,
  parseAds,
  parseAppTexts,
  parseAutoMod,
  type AcademyOverrides,
  type AdSlot,
  type AppTexts,
  type AutoModerationConfig,
  DEFAULT_APP_TEXTS,
  DEFAULT_AUTO_MOD,
} from "@/lib/admin/cms"

export async function loadPublicCms(): Promise<{
  texts: AppTexts
  ads: AdSlot[]
  autoMod: AutoModerationConfig
  academyOverrides: AcademyOverrides
}> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("platform_settings")
      .select("key, value")
      .in("key", ["app_texts", "ads", "auto_moderation", "academy_overrides"])

    const map = new Map((data || []).map((r) => [r.key, r.value]))
    return {
      texts: parseAppTexts(map.get("app_texts") ?? DEFAULT_APP_TEXTS),
      ads: parseAds(map.get("ads")),
      autoMod: parseAutoMod(map.get("auto_moderation") ?? DEFAULT_AUTO_MOD),
      academyOverrides: parseAcademyOverrides(map.get("academy_overrides")),
    }
  } catch {
    return {
      texts: DEFAULT_APP_TEXTS,
      ads: [],
      autoMod: DEFAULT_AUTO_MOD,
      academyOverrides: {},
    }
  }
}
