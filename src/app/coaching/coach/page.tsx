import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

/** Espace coach unifié dans /coaching/session (choix Je suis coach). */
export default function CoachingCoachPage() {
  redirect("/coaching/session")
}
