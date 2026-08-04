"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { resolveAppUrl } from "@/lib/auth/appUrl"
import { passwordResetEmailHtml } from "@/lib/email/templates"
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"
import {
  firstZodError,
  passwordResetRequestSchema,
  passwordUpdateSchema,
} from "@/lib/security/schemas"

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = passwordResetRequestSchema.safeParse({
    email: String(formData.get("email") ?? ""),
  })
  if (!parsed.success) return { error: firstZodError(parsed.error) }
  const { email } = parsed.data

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
        const { sendEmailWithRetry } = await import("@/lib/email/outbox")
        await sendEmailWithRetry({
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
  const parsed = passwordUpdateSchema.safeParse({
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  })
  if (!parsed.success) return { error: firstZodError(parsed.error) }
  const { password } = parsed.data

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
  if (error) return { error: "Impossible de mettre à jour le mot de passe." }

  redirect("/login?reset=1")
}
