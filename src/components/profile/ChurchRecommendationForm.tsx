"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitChurchRecommendationAction } from "@/app/actions/profile"
import { Church, FileImage, Upload } from "lucide-react"

const ACCEPT =
  "application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp"

export function ChurchRecommendationForm() {
  const [name, setName] = React.useState("")
  const [role, setRole] = React.useState("Pasteur")
  const [church, setChurch] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [status, setStatus] = React.useState<"idle" | "saving" | "ok">("idle")
  const [error, setError] = React.useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Joignez un PDF ou une image de la recommandation (obligatoire).")
      return
    }
    setStatus("saving")
    setError("")
    const fd = new FormData()
    fd.set("recommenderName", name)
    fd.set("recommenderRole", role)
    fd.set("churchName", church)
    fd.set("contactEmail", email)
    fd.set("contactPhone", phone)
    fd.set("attachment", file)
    const r = await submitChurchRecommendationAction(fd)
    if (r.error) {
      setError(r.error)
      setStatus("idle")
      return
    }
    setStatus("ok")
    setName("")
    setFile(null)
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
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Joignez uniquement un <strong>PDF</strong> ou une{" "}
          <strong>image</strong> de l&apos;attestation (pas de texte libre —
          pour un contrôle fiable). La validation augmente votre score de
          confiance.
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

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#B8954A]/40 bg-[#F7F0E0]/40 px-4 py-6 text-center hover:bg-[#F7F0E0]/70">
            <FileImage className="h-7 w-7 text-[#B8954A]" />
            <span className="text-sm font-semibold text-foreground">
              {file ? file.name : "PDF ou image de la recommandation *"}
            </span>
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Formats : PDF, JPG, PNG, WebP · max 8 Mo
            </span>
            <input
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {status === "ok" && (
            <p className="text-sm text-emerald-600">
              Document envoyé — en attente de validation admin.
            </p>
          )}
          <Button type="submit" disabled={status === "saving"} className="rounded-xl">
            {status === "saving" ? "Envoi…" : "Envoyer la recommandation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
