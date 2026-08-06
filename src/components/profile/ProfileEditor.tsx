"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProfileProgress } from "@/components/evoraa/ProfileProgress"
import {
  Camera,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  User,
} from "lucide-react"
import {
  saveProfileAction,
  uploadProfilePhotoAction,
  type ProfileEditorData,
} from "@/app/actions/profile"
import { ChurchRecommendationForm } from "@/components/profile/ChurchRecommendationForm"

export function ProfileEditor({ initial }: { initial: ProfileEditorData }) {
  const [firstName, setFirstName] = React.useState(initial.firstName)
  const [lastName, setLastName] = React.useState(initial.lastName)
  const [gender, setGender] = React.useState(initial.gender)
  const [birthDate, setBirthDate] = React.useState(initial.birthDate)
  const [city, setCity] = React.useState(initial.city)
  const [country, setCountry] = React.useState(initial.country)
  const [denomination, setDenomination] = React.useState(initial.denomination)
  const [churchAttended, setChurchAttended] = React.useState(
    initial.churchAttended
  )
  const [testimony, setTestimony] = React.useState(initial.testimony)
  const [favoriteVerses, setFavoriteVerses] = React.useState(
    initial.favoriteVerses
  )
  const [photos, setPhotos] = React.useState(initial.photos)
  const [completion, setCompletion] = React.useState(
    initial.completionPercentage
  )
  const [status, setStatus] = React.useState<
    "idle" | "saving" | "uploading" | "saved"
  >("idle")
  const [error, setError] = React.useState("")
  const fileRef = React.useRef<HTMLInputElement>(null)

  const primary = photos.find((p) => p.isPrimary) || photos[0]
  const displayInitial =
    (firstName || initial.firstName || "?").trim().charAt(0).toUpperCase() || "?"

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("saving")
    setError("")
    const result = await saveProfileAction({
      firstName,
      lastName,
      gender,
      birthDate,
      city,
      country,
      denomination,
      churchAttended,
      testimony,
      favoriteVerses,
    })
    if (result.error) {
      setError(result.error)
      setStatus("idle")
      return
    }
    if (result.completionPercentage != null) {
      setCompletion(result.completionPercentage)
    }
    setStatus("saved")
  }

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus("uploading")
    setError("")
    const formData = new FormData()
    formData.set("photo", file)
    const result = await uploadProfilePhotoAction(formData)
    if (result.error) {
      setError(result.error)
      setStatus("idle")
      return
    }
    if (result.photoUrl) {
      setPhotos((prev) => [
        {
          id: `local-${Date.now()}`,
          photoUrl: result.photoUrl!,
          status: "pending",
          isPrimary: true,
        },
        ...prev.map((p) => ({ ...p, isPrimary: false })),
      ])
    }
    setStatus("saved")
    if (fileRef.current) fileRef.current.value = ""
  }

  const field =
    "w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"

  return (
    <div className="space-y-6">
      <ProfileProgress percentage={completion} />

      <Link
        href="/assessments"
        className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 hover:border-primary/30 transition-colors"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <ClipboardList className="h-4 w-4 text-primary" />
          Questionnaires Matching
        </span>
        <span className="text-xs text-muted-foreground">
          {initial.assessmentsDone}/5 →
        </span>
      </Link>

      <form onSubmit={handleSave} className="space-y-5">
        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Identité
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium">Prénom</span>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={field}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Nom</span>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={field}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Sexe</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={field}
              >
                <option value="">—</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Date de naissance</span>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={field}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Ville</span>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={field}
                required
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium">Pays</span>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={field}
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Communauté / dénomination</span>
              <Input
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className={field}
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="font-medium">Église fréquentée</span>
              <Input
                value={churchAttended}
                onChange={(e) => setChurchAttended(e.target.value)}
                className={field}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <Camera className="h-5 w-5 text-accent" />
            Photo
          </h2>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center font-serif text-lg font-bold">
                {primary?.photoUrl ? (
                  <Image
                    src={primary.photoUrl}
                    alt="Portrait"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  displayInitial
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {[firstName, lastName].filter(Boolean).join(" ") || "Votre portrait"}
                </p>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {primary
                    ? primary.status === "approved"
                      ? "Photo approuvée"
                      : "En attente de validation"
                    : "Ajoutez une photo claire"}
                </p>
              </div>
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoPick}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={status === "uploading"}
                onClick={() => fileRef.current?.click()}
                className="rounded-xl"
              >
                {status === "uploading"
                  ? "Envoi…"
                  : primary
                    ? "Modifier"
                    : "Ajouter"}
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-serif text-xl font-bold">Parcours de foi</h2>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Témoignage (optionnel, min. 40 car. si rempli)</span>
            <Textarea
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              placeholder="Comment votre foi s’exprime dans votre vie…"
              className="rounded-xl min-h-24 text-sm"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Versets / inspirations</span>
            <Input
              value={favoriteVerses}
              onChange={(e) => setFavoriteVerses(e.target.value)}
              placeholder="Ex. Psaume 23…"
              className={field}
            />
          </label>
        </section>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {status === "saved" && !error ? (
          <p className="text-sm text-emerald-600 inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Enregistré.
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={status === "saving"}
          className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold"
        >
          {status === "saving" ? "Enregistrement…" : "Enregistrer mon profil"}
        </Button>
      </form>

      <ChurchRecommendationForm />
    </div>
  )
}
