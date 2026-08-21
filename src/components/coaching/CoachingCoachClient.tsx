"use client"

import * as React from "react"
import Link from "next/link"
import { CoachingSessionLobby } from "@/components/coaching/CoachingSessionLobby"
import { createClient } from "@/utils/supabase/client"

/**
 * Entrée coach : rejoindre la salle d’attente (test Sarah Gandee ↔ admin).
 */
export function CoachingCoachClient() {
  const [state, setState] = React.useState<"loading" | "not_coach" | "ready">(
    "loading"
  )
  const [coachName, setCoachName] = React.useState("")
  const [sessionStatus, setSessionStatus] = React.useState<
    "WAITING" | "PREP" | "ACTIVE"
  >("WAITING")

  React.useEffect(() => {
    void (async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setState("not_coach")
        return
      }
      const { data: coach } = await supabase
        .from("coaches")
        .select("id, display_name")
        .eq("user_id", user.id)
        .maybeSingle()
      if (!coach) {
        setState("not_coach")
        return
      }
      setCoachName(coach.display_name)
      const { data: session } = await supabase
        .from("coaching_sessions")
        .select("status")
        .eq("coach_id", coach.id)
        .in("status", ["WAITING", "PREP", "ACTIVE", "CONNECTING"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (session?.status === "PREP") setSessionStatus("PREP")
      else if (session?.status === "ACTIVE") setSessionStatus("ACTIVE")
      else setSessionStatus("WAITING")
      setState("ready")
    })()
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <header className="rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#1C1412] p-7 text-[#FBF9F6]">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
          Espace coach
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold">
          {coachName || "Salle coach"}
        </h1>
        <p className="mt-2 text-sm text-white/75">
          Rejoignez la salle d’attente avec votre client pour démarrer la
          session.
        </p>
      </header>

      {state === "loading" ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : null}
      {state === "not_coach" ? (
        <div className="rounded-2xl border p-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Ce compte n’est pas lié à un profil coach. Demandez à l’ops de
            l’activer.
          </p>
          <Link href="/coaching" className="text-sm font-semibold underline">
            Retour coaching
          </Link>
        </div>
      ) : null}
      {state === "ready" ? (
        <>
          <CoachingSessionLobby
            role="coach"
            clientJoined={false}
            coachJoined={true}
            peerReady={false}
          />
          <p className="text-center text-xs text-muted-foreground">
            Test : compte client sur{" "}
            <Link href="/coaching/session" className="underline">
              /coaching/session
            </Link>
            .
          </p>
        </>
      ) : null}
    </div>
  )
}
