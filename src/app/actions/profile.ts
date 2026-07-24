"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_BYTES = 5 * 1024 * 1024

export type ProfileEditorData = {
  profileId: string
  firstName: string
  testimony: string
  favoriteVerses: string
  completionPercentage: number
  photos: Array<{
    id: string
    photoUrl: string
    status: string
    isPrimary: boolean
  }>
}

export async function getMyProfileEditorData(): Promise<{
  data?: ProfileEditorData
  error?: string
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, first_name, testimony, matching_indicators, completion_percentage")
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !profile) {
    return { error: error?.message || "Profil introuvable" }
  }

  const indicators =
    profile.matching_indicators && typeof profile.matching_indicators === "object"
      ? (profile.matching_indicators as Record<string, unknown>)
      : {}

  const { data: photos } = await supabase
    .from("user_photos")
    .select("id, photo_url, status, is_primary")
    .eq("profile_id", profile.id)
    .is("deleted_at", null)
    .order("display_order", { ascending: true })

  return {
    data: {
      profileId: profile.id,
      firstName: profile.first_name || "Membre",
      testimony: profile.testimony || "",
      favoriteVerses: String(indicators.favorite_verses || ""),
      completionPercentage: profile.completion_percentage ?? 0,
      photos: (photos ?? []).map((p) => ({
        id: p.id,
        photoUrl: p.photo_url,
        status: p.status || "pending",
        isPrimary: Boolean(p.is_primary),
      })),
    },
  }
}

export async function saveProfileAction(payload: {
  testimony: string
  favoriteVerses: string
}): Promise<{ error?: string; success?: boolean; completionPercentage?: number }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const testimony = payload.testimony.trim()
  const favoriteVerses = payload.favoriteVerses.trim()
  if (testimony.length < 40) {
    return { error: "Votre témoignage doit faire au moins 40 caractères." }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, matching_indicators, completion_percentage")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const prev =
    profile.matching_indicators && typeof profile.matching_indicators === "object"
      ? (profile.matching_indicators as Record<string, unknown>)
      : {}

  const { count: photoCount } = await supabase
    .from("user_photos")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profile.id)
    .is("deleted_at", null)

  const hasPhoto = (photoCount ?? 0) > 0
  const completion = hasPhoto && testimony.length >= 40 ? 100 : hasPhoto ? 90 : 85

  const { error } = await supabase
    .from("profiles")
    .update({
      testimony,
      matching_indicators: {
        ...prev,
        favorite_verses: favoriteVerses,
      },
      completion_percentage: completion,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/profile")
  revalidatePath("/compatibility")
  return { success: true, completionPercentage: completion }
}

function moderatePhotoMeta(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Formats acceptés : JPEG, PNG ou WebP."
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return "La photo doit faire moins de 5 Mo."
  }
  const name = file.name.toLowerCase()
  if (name.includes("nude") || name.includes("xxx") || name.includes("porn")) {
    return "Cette image a été refusée par la modération minimale."
  }
  return null
}

export async function uploadProfilePhotoAction(
  formData: FormData
): Promise<{ error?: string; success?: boolean; photoUrl?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const file = formData.get("photo")
  if (!(file instanceof File)) {
    return { error: "Aucun fichier reçu." }
  }

  const moderationError = moderatePhotoMeta(file)
  if (moderationError) return { error: moderationError }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
  const path = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path)

  await supabase
    .from("user_photos")
    .update({ is_primary: false, updated_at: new Date().toISOString() })
    .eq("profile_id", profile.id)
    .is("deleted_at", null)

  const { error: insertError } = await supabase.from("user_photos").insert({
    profile_id: profile.id,
    photo_url: publicUrl,
    is_primary: true,
    status: "pending",
    created_by: user.id,
    updated_by: user.id,
  })

  if (insertError) {
    return { error: insertError.message }
  }

  await supabase
    .from("profiles")
    .update({
      // Keep avatar pending moderation — do not publish avatar_url until approved
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", profile.id)

  revalidatePath("/profile")
  revalidatePath("/admin")
  return { success: true, photoUrl: publicUrl }
}
