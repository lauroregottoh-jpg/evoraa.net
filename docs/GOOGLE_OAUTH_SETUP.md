# Connexion Google (OAuth) — KELIAA

Le bouton **Continuer avec Google** est dans le code (`/register` et `/login`).
Il fonctionne une fois Google activé dans Supabase + Google Cloud.

## 1. Google Cloud Console

1. Ouvrir [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Créer un **OAuth 2.0 Client ID** (type *Web application*).
3. **Authorized JavaScript origins** :
   - `http://localhost:3000`
   - `https://keliaa.org` (et tout domaine de prod / preview Vercel si besoin)
4. **Authorized redirect URIs** — utiliser l’URL de callback **Supabase** :
   - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
   - (remplacer `<PROJECT_REF>` par l’id du projet Supabase)

Copier **Client ID** et **Client Secret**.

## 2. Supabase Dashboard

1. Authentication → Providers → **Google** → Enable.
2. Coller Client ID + Client Secret.
3. Authentication → URL Configuration :
   - **Site URL** : `https://keliaa.org` (ou `http://localhost:3000` en local)
   - **Redirect URLs** (ajouter) :
     - `http://localhost:3000/auth/callback`
     - `https://keliaa.org/auth/callback`
     - éventuels previews : `https://*.vercel.app/auth/callback`

## 3. Comportement produit

| Cas | Résultat |
|---|---|
| Nouvel utilisateur Google | Compte créé → `/onboarding` (infos essentielles) |
| Compte Google déjà existant | Session ouverte → dashboard ou onboarding si profil incomplet |
| Charte acceptée juste avant Google | Cookie `keliaa_charter_accepted` → metadata `charter_accepted` |

Sans config Google, le bouton affiche un message d’erreur clair et l’**inscription e-mail** reste disponible.

## 4. Test local

```bash
npm run dev
```

Ouvrir `/register` → Bienvenue → Charte → Continuer avec Google.
