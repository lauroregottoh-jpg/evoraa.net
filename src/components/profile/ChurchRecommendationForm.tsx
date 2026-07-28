"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitChurchRecommendationAction } from "@/app/actions/profile"
import { Church } from "lucide-react"

export function ChurchRecommendationForm() {
  const [name, setName] = React.useState("")
  const [role, setRole] = React.useState("Pasteur")
  const [church, setChurch] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "saving" | "ok">("idle")
  const [error, setError] = React.useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("saving")
    setError("")
    const r = await submitChurchRecommendationAction({
      recommenderName: name,
      recommenderRole: role,
      churchName: church,
      contactEmail: email,
      contactPhone: phone,
      message,
    })
    if (r.error) {
      setError(r.error)
      setStatus("idle")
      return
    }
    setStatus("ok")
    setName("")
    setMessage("")
  }

  return (
    <Card className="rounded-2xl border-border/60 bg-background/90 shadow-sm">
      <CardHeader className="border-b border-border/40 pb-4">
        <CardTitle className="font-serif text-xl flex items-center gap-2">
          <Church className="h-5 w-5 text-accent" />
          Recommandation pasteur / responsable
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-xs text-muted-foreground mb-4">
          Demandez à un pasteur ou responsable d&apos;Église d&apos;attester de votre sérieux et de
          votre témoignage. La validation augmente votre score de confiance.
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du recommandant *"
            required
            className="rounded-xl"
          />
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Rôle (Pasteur, Ancien…)"
            className="rounded-xl"
          />
          <Input
            value={church}
            onChange={(e) => setChurch(e.target.value)}
            placeholder="Nom de l'Église"
            className="rounded-xl"
          />
          <div className="grid sm:grid-cols-2 gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="rounded-xl"
            />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Téléphone"
              className="rounded-xl"
            />
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message / attestation"
            className="rounded-xl min-h-20"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {status === "ok" && (
            <p className="text-sm text-emerald-600">Demande envoyée — en attente de validation admin.</p>
          )}
          <Button type="submit" disabled={status === "saving"} className="rounded-xl">
            {status === "saving" ? "Envoi…" : "Envoyer la recommandation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
