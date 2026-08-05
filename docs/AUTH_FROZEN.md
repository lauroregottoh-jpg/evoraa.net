# Auth gelée — contrat KELIAA

> **But :** les gens doivent pouvoir s’inscrire et se connecter **quoi qu’il arrive** ailleurs (paiements, console ops, design…).
>
> Pour modifier le code listé ici, l’humain doit écrire **`AUTH UNLOCK`** dans la demande.

## Canonique prod

| Élément | Valeur verrouillée |
|---|---|
| Site public | `https://www.keliaa.org` |
| Redirection apex | `keliaa.org` → `www.keliaa.org` (308) |
| Cookie domain | `.keliaa.org` |
| Cookies Secure | oui en HTTPS / prod |
| Google OAuth return | `/auth/callback` |
| Soft email confirm | **off** en `VERCEL_ENV=production` sauf `ALLOW_SOFT_EMAIL_CONFIRM=true` |
| Mot de passe | ≥10 car. + lettre + chiffre + HIBP (fail-open) |
| Lockout login | 5 échecs / 15 min |
| Turnstile | optionnel (si clés Cloudflare) |
| Secours | inscription / login **email + mot de passe** |

## Supabase Dashboard (hors repo)

- Site URL : `https://www.keliaa.org`
- Redirect URLs : au moins `https://www.keliaa.org/auth/callback` et `…/auth/finish`
- Provider Google activé

## Garde-fous automatiques

```bash
npm run test:smoke
```

Le fichier `tests/auth-frozen-invariants.test.mjs` **échoue en CI** si quelqu’un retire :

- le domaine cookie `.keliaa.org`
- le redirect www
- le callback `/auth/callback` pour Google
- le fail-open rate-limit login/register
- le drapeau `AUTH_CRITICAL.rateLimitFailOpen`

## Fichiers gelés

Voir `.cursor/rules/auth-critical.mdc` (liste complète).

## Expérience membre minimale (ne pas casser)

1. `/register` → Google **ou** email  
2. Après Auth → onboarding si profil incomplet  
3. `/login` → session → dashboard ou onboarding  

Les features payantes / matching peuvent évoluer **après** cette porte d’entrée, jamais avant.
