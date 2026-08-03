"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { resolveAppUrl } from "@/lib/auth/appUrl"
import { passwordResetEmailHtml } from "@/lib/email/templates"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (!email) return { error: "Email requis." }

  const rl = await enforceRateLimit({ ...RL.passwordReset, subject: email })
  if (!rl.ok) return { error: rl.error }

  const appUrl = await resolveAppUrl()
  const redirectTo = `${appUrl}/reset-password`

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    })

    if (!error) {
      const actionLink = data.properties?.action_link
      if (actionLink) {
        const { sendResendEmail } = await import("@/lib/email/send")
        await sendResendEmail({
          to: email,
          subject: "Réinitialisez votre mot de passe — KELIAA",
          html: passwordResetEmailHtml({ appUrl, resetHref: actionLink }),
        })
      }
    } else {
      console.error("[password-reset]", error.message)
    }
  } catch (e) {
    console.error("[password-reset] admin", e)
    // Dernier recours : mail Auth Supabase (moins idéal)
    const supabase = await createClient()
    await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  }

  return {
    success: true,
    message:
      "Si un compte existe pour cet email, un lien KELIAA vient d’être envoyé. Vérifiez aussi les spams.",
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      error:
        "Session expirée. Rouvrez le lien reçu par email, puis choisissez un nouveau mot de passe.",
    }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  redirect("/login?reset=1")
}
