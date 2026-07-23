"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { error: "Email requis." }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appBaseUrl()}/auth/callback?next=/reset-password`,
  })

  if (error) return { error: error.message }

  return {
    success: true,
    message: "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.",
  }
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." }
  }
  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  redirect("/login?reset=1")
}
