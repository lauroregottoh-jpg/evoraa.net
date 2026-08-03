# Auth email — réglages Supabase (keliaa.org)

## URLs (Authentication → URL Configuration)

**Site URL** : `https://keliaa.org`

**Redirect URLs** (toutes) :

- `https://keliaa.org/auth/callback`
- `https://keliaa.org/auth/finish`
- `https://keliaa.org/reset-password`
- `https://evoraa-net.vercel.app/auth/callback`
- `https://evoraa-net.vercel.app/auth/finish`
- `https://evoraa-net.vercel.app/reset-password`

## Template Confirm signup

Coller `docs/SUPABASE_CONFIRM_EMAIL.html`.

Bouton :

`{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`

## Mot de passe oublié

L’app envoie maintenant l’email **via Resend au nom de KELIAA** (plus le mail générique « Supabase »).

## Compte déjà existant

Si tu te réinscris avec le même email, Supabase **ne change pas** le mot de passe.
→ Utiliser **Mot de passe oublié**, puis te connecter.
