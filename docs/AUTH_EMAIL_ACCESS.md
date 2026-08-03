# Auth email — réglages Supabase (accès espace membre)

Si le mail arrive mais le clic n’ouvre pas l’espace :

## 1. URLs Auth (Supabase → Authentication → URL Configuration)

- **Site URL** : `https://evoraa-net.vercel.app` *(ou `https://keliaa.org` si le domaine pointe déjà vers Vercel)*
- **Redirect URLs** (ajouter toutes) :
  - `https://evoraa-net.vercel.app/auth/callback`
  - `https://evoraa-net.vercel.app/auth/finish`
  - `https://keliaa.org/auth/callback`
  - `https://keliaa.org/auth/finish`
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/finish`

## 2. Template Confirm signup

Coller le HTML de `docs/SUPABASE_CONFIRM_EMAIL.html`.

Le bouton doit utiliser :

`{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`

Pas seulement `{{ .ConfirmationURL }}` (souvent la session cookie n’est pas posée).

## 3. Contournement immédiat

Même sans cliquer le lien : aller sur **/login**, taper email + mot de passe.
L’app active le compte et ouvre l’onboarding / dashboard.
