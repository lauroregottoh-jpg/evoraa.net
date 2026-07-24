"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

async function resolvePostAuthPath(
  userId: string
): Promise<"/onboarding" | "/dashboard"> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("completion_percentage, onboarding_status")
    .eq("user_id", userId)
    .maybeSingle()

  const completion = profile?.completion_percentage ?? 0
  const status = profile?.onboarding_status

  if (
    completion < 70 ||
    !status ||
    status === "step1_account" ||
    status === "step2_profile"
  ) {
    return "/onboarding"
  }

  return "/dashboard"
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: "Impossible de démarrer la session." }
  }

  const nextPath = await resolvePostAuthPath(data.user.id)
  revalidatePath("/", "layout")
  redirect(nextPath)
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const firstName = String(formData.get("first_name") ?? "").trim()
  const lastName = String(formData.get("last_name") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()
  const charterAccepted = formData.get("charter_accepted") === "true"

  if (!email || !password || !firstName) {
    return { error: "Prénom, email et mot de passe sont requis." }
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." }
  }

  if (!charterAccepted) {
    return {
      error:
        "Vous devez accepter la Charte de Bienveillance avant de créer votre espace.",
    }
  }

  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName || null,
        city: city || null,
        address: address || null,
        charter_accepted: true,
        charter_accepted_at: new Date().toISOString(),
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName || null,
        city: city || null,
        onboarding_status: "step1_account",
        completion_percentage: 10,
        email_verified: Boolean(data.user.email_confirmed_at),
      })
      .eq("user_id", data.user.id)
  }

  // Confirmation email activée : pas de session immédiate
  if (data.user && !data.session) {
    return {
      error: null,
      needsEmailConfirmation: true,
      message:
        "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse avant de vous connecter.",
    }
  }

  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
