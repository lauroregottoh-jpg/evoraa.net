"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getUserEntitlements } from "@/lib/billing/entitlements"

async function getMyProfileId() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const, profileId: null, supabase, userId: null }

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!data?.id) {
    return { error: "Profil introuvable." as const, profileId: null, supabase, userId: user.id }
  }
  return { error: null, profileId: data.id as string, supabase, userId: user.id }
}

/** Enregistre une visite de profil (appelé à l'ouverture d'une fiche compatibilité). */
export async function recordProfileViewAction(targetProfileId: string) {
  const ctx = await getMyProfileId()
  if (ctx.error || !ctx.profileId) return { error: ctx.error }
  if (ctx.profileId === targetProfileId) return { success: true }

  await ctx.supabase.from("profile_views").upsert(
    {
      viewer_profile_id: ctx.profileId,
      viewed_profile_id: targetProfileId,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "viewer_profile_id,viewed_profile_id" }
  )

  return { success: true }
}

export async function toggleFavoriteAction(targetProfileId: string) {
  const ctx = await getMyProfileId()
  if (ctx.error || !ctx.profileId) return { error: ctx.error }
  if (ctx.profileId === targetProfileId) return { error: "Action impossible sur votre propre profil." }

  const { data: existing } = await ctx.supabase
    .from("profile_favorites")
    .select("id")
    .eq("owner_profile_id", ctx.profileId)
    .eq("target_profile_id", targetProfileId)
    .maybeSingle()

  if (existing?.id) {
    await ctx.supabase.from("profile_favorites").delete().eq("id", existing.id)
    revalidatePath("/dashboard")
    return { success: true, favorited: false }
  }

  const { error } = await ctx.supabase.from("profile_favorites").insert({
    owner_profile_id: ctx.profileId,
    target_profile_id: targetProfileId,
  })

  if (error) return { error: error.message }
  revalidatePath("/dashboard")
  return { success: true, favorited: true }
}

export async function getFavoriteStatusAction(targetProfileId: string) {
  const ctx = await getMyProfileId()
  if (ctx.error || !ctx.profileId) return { favorited: false }

  const { data } = await ctx.supabase
    .from("profile_favorites")
    .select("id")
    .eq("owner_profile_id", ctx.profileId)
    .eq("target_profile_id", targetProfileId)
    .maybeSingle()

  return { favorited: Boolean(data?.id) }
}

export type SocialPerson = {
  profileId: string
  name: string
  city: string | null
  at: string
}

export type SocialInsights = {
  visitorCount: number
  favoriteCount: number
  visitors: SocialPerson[]
  favorites: SocialPerson[]
  locked: boolean
}

export async function getSocialInsights(): Promise<SocialInsights> {
  const empty: SocialInsights = {
    visitorCount: 0,
    favoriteCount: 0,
    visitors: [],
    favorites: [],
    locked: true,
  }

  const ctx = await getMyProfileId()
  if (ctx.error || !ctx.profileId) return empty

  const entitlements = await getUserEntitlements(ctx.userId ?? undefined)
  const locked = !entitlements.isPaid

  const [{ data: views }, { data: favs }] = await Promise.all([
    ctx.supabase
      .from("profile_views")
      .select("viewed_at, viewer_profile_id")
      .eq("viewed_profile_id", ctx.profileId)
      .order("viewed_at", { ascending: false })
      .limit(20),
    ctx.supabase
      .from("profile_favorites")
      .select("created_at, owner_profile_id")
      .eq("target_profile_id", ctx.profileId)
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  const profileIds = [
    ...new Set([
      ...(views ?? []).map((v) => v.viewer_profile_id as string),
      ...(favs ?? []).map((f) => f.owner_profile_id as string),
    ]),
  ]

  let nameById = new Map<string, { name: string; city: string | null }>()
  if (profileIds.length > 0) {
    const { data: profiles } = await ctx.supabase
      .from("profiles")
      .select("id, first_name, city")
      .in("id", profileIds)
    nameById = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        { name: (p.first_name as string) || "Membre", city: (p.city as string | null) ?? null },
      ])
    )
  }

  const visitors: SocialPerson[] = (views ?? []).map((v) => {
    const meta = nameById.get(v.viewer_profile_id as string)
    return {
      profileId: v.viewer_profile_id as string,
      name: locked ? "Membre Alliance" : meta?.name ?? "Membre",
      city: locked ? null : meta?.city ?? null,
      at: v.viewed_at as string,
    }
  })

  const favorites: SocialPerson[] = (favs ?? []).map((f) => {
    const meta = nameById.get(f.owner_profile_id as string)
    return {
      profileId: f.owner_profile_id as string,
      name: locked ? "Membre Alliance" : meta?.name ?? "Membre",
      city: locked ? null : meta?.city ?? null,
      at: f.created_at as string,
    }
  })

  return {
    visitorCount: views?.length ?? 0,
    favoriteCount: favs?.length ?? 0,
    visitors,
    favorites,
    locked,
  }
}
