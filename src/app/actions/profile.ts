"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import {
  detectImageMime,
  extensionForMime,
} from "@/lib/security/imageMagic"

const MAX_BYTES = 5 * 1024 * 1024

export type ProfileEditorData = {
  profileId: string
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  city: string
  country: string
  denomination: string
  churchAttended: string
  testimony: string
  favoriteVerses: string
  completionPercentage: number
  assessmentsDone: number
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
    .select(
      "id, first_name, last_name, gender, birth_date, city, country, denomination, church_attended, testimony, matching_indicators, completion_percentage, psychometric_results"
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !profile) {
    return { error: error?.message || "Profil introuvable" }
  }

  const indicators =
    profile.matching_indicators && typeof profile.matching_indicators === "object"
      ? (profile.matching_indicators as Record<string, unknown>)
      : {}

  const psy =
    profile.psychometric_results && typeof profile.psychometric_results === "object"
      ? (profile.psychometric_results as Record<string, unknown>)
      : {}
  const assessmentsDone = [
    "personality",
    "spiritual",
    "relationship",
    "couple_life",
    "finances",
  ].filter((k) => psy[k] != null).length

  const { data: photos } = await supabase
    .from("user_photos")
    .select("id, photo_url, status, is_primary")
    .eq("profile_id", profile.id)
    .is("deleted_at", null)
    .order("display_order", { ascending: true })

  return {
    data: {
      profileId: profile.id,
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      gender: profile.gender || "",
      birthDate: profile.birth_date
        ? String(profile.birth_date).slice(0, 10)
        : "",
      city: profile.city || "",
      country: profile.country || "",
      denomination: profile.denomination || "",
      churchAttended: profile.church_attended || "",
      testimony: profile.testimony || "",
      favoriteVerses: String(indicators.favorite_verses || ""),
      completionPercentage: profile.completion_percentage ?? 0,
      assessmentsDone,
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
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  city: string
  country: string
  denomination: string
  churchAttended: string
  testimony: string
  favoriteVerses: string
}): Promise<{ error?: string; success?: boolean; completionPercentage?: number }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const firstName = payload.firstName.trim().slice(0, 80)
  const lastName = payload.lastName.trim().slice(0, 80)
  const city = payload.city.trim().slice(0, 120)
  const country = payload.country.trim().slice(0, 80)
  const denomination = payload.denomination.trim().slice(0, 120)
  const churchAttended = payload.churchAttended.trim().slice(0, 160)
  const testimony = payload.testimony.trim()
  const favoriteVerses = payload.favoriteVerses.trim().slice(0, 300)
  const genderRaw = payload.gender.trim().toUpperCase()
  const gender =
    genderRaw === "M" || genderRaw === "F" ? genderRaw : null
  const birthDate = payload.birthDate.trim().slice(0, 10)

  if (!firstName) return { error: "Le prénom est requis." }
  if (!city) return { error: "La ville est requise." }
  if (testimony && testimony.length < 40) {
    return { error: "Le témoignage doit faire au moins 40 caractères (ou laissez-le vide)." }
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
  const hasTestimony = testimony.length >= 40
  let completion = 40
  if (firstName && city) completion = 55
  if (gender && birthDate) completion = 70
  if (hasTestimony) completion = Math.max(completion, 85)
  if (hasPhoto) completion = Math.max(completion, hasTestimony ? 100 : 90)

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName || null,
      gender,
      birth_date: birthDate || null,
      city,
      country: country || null,
      denomination: denomination || null,
      church_attended: churchAttended || null,
      testimony: testimony || null,
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
  revalidatePath("/dashboard")
  return { success: true, completionPercentage: completion }
}

function moderatePhotoMeta(file: File): string | null {
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

  // Trust file contents, not browser Content-Type.
  const header = await file.slice(0, 32).arrayBuffer()
  const detected = detectImageMime(header)
  if (!detected) {
    return { error: "Formats acceptés : JPEG, PNG ou WebP." }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "Profil introuvable" }

  const ext = extensionForMime(detected)
  const path = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: detected,
    })

  if (uploadError) {
    return { error: "Impossible d’envoyer la photo pour le moment." }
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

export async function submitChurchRecommendationAction(payload: {
  recommenderName: string
  recommenderRole?: string
  churchName?: string
  contactEmail?: string
  contactPhone?: string
  message?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié" }

  const name = payload.recommenderName.trim()
  if (name.length < 2) return { error: "Nom du recommandant requis." }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()
  if (!profile) return { error: "Profil introuvable" }

  const { error } = await supabase.from("church_recommendations").insert({
    profile_id: profile.id,
    recommender_name: name,
    recommender_role: payload.recommenderRole?.trim() || null,
    church_name: payload.churchName?.trim() || null,
    contact_email: payload.contactEmail?.trim() || null,
    contact_phone: payload.contactPhone?.trim() || null,
    message: payload.message?.trim() || null,
    status: "pending",
  })
  if (error) return { error: error.message }
  revalidatePath("/profile")
  revalidatePath("/admin")
  return { success: true }
}
