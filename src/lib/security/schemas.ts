import { z } from "zod"

const emailSchema = z
  .email({ error: "Email invalide." })
  .max(200)
  .transform((v) => v.trim().toLowerCase())

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
    .regex(/[A-Za-z]/, "Ajoutez au moins une lettre.")
    .regex(/[0-9]/, "Ajoutez au moins un chiffre."),
  /** Collected in post-signup onboarding essentials — optional at account creation. */
  firstName: z.string().trim().max(80).optional().default(""),
  lastName: z.string().trim().max(80).optional().default(""),
  city: z.string().trim().max(120).optional().default(""),
  address: z.string().trim().max(240).optional().default(""),
  /** Charte signée à l’étape suivante (onboarding), pas à la création du compte. */
  charterAccepted: z.boolean().optional().default(false),
  referredByCode: z.string().trim().max(32).optional().default(""),
  utmSource: z.string().trim().max(64).optional().default(""),
  utmMedium: z.string().trim().max(64).optional().default(""),
  utmCampaign: z.string().trim().max(64).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Email et mot de passe requis."),
  nextRaw: z.string().max(500).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
})

export const passwordUpdateSchema = z
  .object({
    password: z
      .string()
      .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
      .regex(/[A-Za-z]/, "Ajoutez au moins une lettre.")
      .regex(/[0-9]/, "Ajoutez au moins un chiffre."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirm"],
  })

export const resendConfirmationSchema = z.object({
  email: emailSchema,
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

const CONTACT_SUBJECTS = [
  "question",
  "coaching",
  "report",
  "billing",
  "other",
] as const

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Nom, email et message sont requis.").max(120),
  email: emailSchema,
  subject: z.string().trim().transform((v) => {
    if ((CONTACT_SUBJECTS as readonly string[]).includes(v)) {
      return v as (typeof CONTACT_SUBJECTS)[number]
    }
    return "other" as const
  }),
  message: z
    .string()
    .trim()
    .min(20, "Votre message doit faire au moins 20 caractères.")
    .max(5000),
})

const FEEDBACK_CATEGORIES = [
  "signup_help",
  "complaint",
  "suggestion",
  "ux",
  "other",
] as const

export const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Nom requis.").max(120),
  email: emailSchema,
  category: z.string().trim().transform((v) => {
    if ((FEEDBACK_CATEGORIES as readonly string[]).includes(v)) {
      return v as (typeof FEEDBACK_CATEGORIES)[number]
    }
    return "other" as const
  }),
  message: z
    .string()
    .trim()
    .min(8, "Décrivez brièvement le problème.")
    .max(4000),
  pagePath: z.string().trim().max(200).optional().default(""),
})

export const askEvaSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question vide.")
    .max(1200),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1500),
      })
    )
    .max(8)
    .optional()
    .default([]),
})

export function firstZodError(error: z.ZodError): string {
  return error.issues[0]?.message || "Données invalides."
}
