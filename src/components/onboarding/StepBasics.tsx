"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, User } from "lucide-react"

export type BasicsPayload = {
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  city: string
  country: string
}

interface StepBasicsProps {
  onNext: (data: BasicsPayload) => void | Promise<void>
  defaultValues?: Partial<BasicsPayload>
  isSubmitting?: boolean
}

const COUNTRIES = [
  "Togo",
  "Bénin",
  "Côte d'Ivoire",
  "Sénégal",
  "Ghana",
  "Burkina Faso",
  "Mali",
  "Niger",
  "Guinée",
  "Cameroun",
  "France",
  "Belgique",
  "Canada",
  "Autre",
] as const

export function StepBasics({
  onNext,
  defaultValues,
  isSubmitting = false,
}: StepBasicsProps) {
  const [firstName, setFirstName] = React.useState(
    String(defaultValues?.firstName || "")
  )
  const [lastName, setLastName] = React.useState(
    String(defaultValues?.lastName || "")
  )
  const [gender, setGender] = React.useState(
    String(defaultValues?.gender || "")
  )
  const [birthDate, setBirthDate] = React.useState(
    String(defaultValues?.birthDate || "")
  )
  const [country, setCountry] = React.useState(
    String(defaultValues?.country || "Togo")
  )
  const [city, setCity] = React.useState(String(defaultValues?.city || ""))

  const maxBirth = React.useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d.toISOString().slice(0, 10)
  }, [])
  const minBirth = React.useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 99)
    return d.toISOString().slice(0, 10)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({
      firstName,
      lastName,
      gender,
      birthDate,
      city: city.trim() || country,
      country,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
          Qui êtes-vous ?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Prénom, nom, sexe, date de naissance, pays et ville — nécessaires avant
          l’accès à l’espace membre.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Prénom
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            maxLength={80}
            placeholder="Votre prénom"
            className="h-12 rounded-xl text-base"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            maxLength={80}
            placeholder="Votre nom"
            className="h-12 rounded-xl text-base"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sexe</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full h-12 px-3.5 rounded-xl bg-background border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>
              Choisir…
            </option>
            <option value="F">Femme</option>
            <option value="M">Homme</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date de naissance</label>
          <Input
            type="date"
            value={birthDate}
            min={minBirth}
            max={maxBirth}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="h-12 rounded-xl"
          />
          <p className="text-[11px] text-muted-foreground">
            Requis pour confirmer que vous avez 18 ans ou plus.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Pays
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full h-12 px-3.5 rounded-xl bg-background border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ville</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            maxLength={120}
            placeholder="Ex. Lomé, Abidjan…"
            className="h-12 rounded-xl text-base"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-primary text-primary-foreground"
      >
        Continuer
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
