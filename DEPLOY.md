# KELIA — Checklist Ops (P0)

## 1. Migrations Supabase

Dans le dossier du projet :

```powershell
# Option A — script existant (nécessite SUPABASE_DB_URL dans .env.local)
.\run_migration.ps1

# Option B — CLI liée au projet
npx supabase db push
```

Appliquer **toutes** les migrations `20240101000000` → `…008`.

## 2. Realtime

La migration `…008` tente d’ajouter `public.messages` à `supabase_realtime`.  
Vérifier dans le dashboard Supabase → **Database → Replication** que `messages` est coché.

## 3. Auth redirects

Supabase → Authentication → URL Configuration :

- Site URL = `https://votre-domaine.com`
- Redirect URLs :
  - `https://votre-domaine.com/auth/callback`
  - `http://localhost:3000/auth/callback`

## 4. Vercel

1. Import du repo `evoraa.net`
2. Framework : Next.js
3. Variables d’environnement (Production) :

| Variable | Obligatoire |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | oui |
| `NEXT_PUBLIC_APP_URL` | oui (URL Vercel) |
| `SUPABASE_SERVICE_ROLE_KEY` | oui (webhook) |
| `PAYMENTS_DEMO_MODE` | `false` |
| `CINETPAY_API_KEY` | oui prod |
| `CINETPAY_SITE_ID` | oui prod |
| `CINETPAY_SECRET_KEY` | oui (auth webhook) |
| `RESEND_API_KEY` | optionnel |

4. Deploy → tester `/login`, `/pricing`, `/messages`

## 5. Storage photos

Bucket `avatars` (créé en SQL). Vérifier qu’il existe et est public en lecture.
