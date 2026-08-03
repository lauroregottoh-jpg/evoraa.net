# Resend + emails Kellia — procédure débutant

Les emails « moches » viennent surtout de **Supabase Auth** (confirmation / reset).
Les emails produit (bienvenue, contact, rappels Alliance) passent par **Resend**.

---

## Ce que le code fait déjà

- Template HTML brandé **KELLIA** (accueil, contact, rappel Alliance)
- Callback `/auth/callback` amélioré (`code` **et** `token_hash`) → accès onboarding/dashboard
- Messages d’erreur clairs si le lien email échoue
- `emailRedirectTo` basé sur `NEXT_PUBLIC_APP_URL`

---

## A. Donner accès à Resend (pour autonomie Cursor / toi)

Je **ne peux pas** me connecter à ton compte Resend sans clé.
Pour être autonome à ~99 % côté code + envoi :

### Option 1 (recommandée) — clé dans Vercel

1. Va sur [resend.com](https://resend.com) → **API Keys** → **Create API Key**
2. Copie la clé `re_...`
3. Vercel → projet **evoraa-net** → **Settings** → **Environment Variables**
4. Ajoute (Production + Preview) :

| Nom | Valeur |
|-----|--------|
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM_EMAIL` | `KELLIA <contact@keliaa.org>` *(domaine keliaa.org uniquement — pas Maison du Conseil)* |
| `CONTACT_INBOX_EMAIL` | `lauroregottoh@gmail.com` |
| `NEXT_PUBLIC_APP_URL` | `https://keliaa.org` *(ou ton URL live exacte)* |

5. **Redeploy** le projet Vercel

Tant que le domaine n’est pas vérifié chez Resend, utilise `onboarding@resend.dev` (fonctionne pour tester vers **ton** email).

### Option 2 — me coller la clé ici (temporaire)

Tu peux coller dans le chat (une seule fois) :
- `RESEND_API_KEY=re_...`
- domaine d’envoi souhaité

⚠️ Évite de coller des clés en public long terme ; préfère Vercel Env.

---

## B. Vérifier ton domaine chez Resend (prod)

1. Resend → **Domains** → **Add Domain** → `kellia.org`
2. Ajoute les DNS (SPF / DKIM) chez **Spaceship**
3. Attends le status **Verified**
4. Mets `RESEND_FROM_EMAIL=KELLIA <noreply@kellia.org>`
5. Redeploy

---

## C. Emails de confirmation Supabase (les plus « moches »)

Ces emails ne passent **pas** par notre code tant que Supabase utilise son SMTP par défaut.

### C1 — Brancher Resend comme SMTP Supabase

1. Supabase → projet → **Project Settings** → **Authentication** (ou **Auth** → **SMTP**)
2. Enable **Custom SMTP** :

| Champ | Valeur |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | ta `RESEND_API_KEY` |
| Sender email | `noreply@kellia.org` (domaine vérifié) ou temporairement l’adresse autorisée Resend |
| Sender name | `KELLIA` |

### C2 — Template « Confirm signup » brandé

1. Supabase → **Authentication** → **Email Templates** → **Confirm signup**
2. Subject : `Confirmez votre email — Kellia`
3. Body : colle le HTML de `docs/SUPABASE_CONFIRM_EMAIL.html` (dans ce repo)
4. Sauve

### C3 — Redirect URLs (accès espace membre)

Supabase → **Authentication** → **URL Configuration** :

**Site URL** (une seule, ton domaine principal) :
```
https://kellia.org
```
(ou `https://evoraa-net.vercel.app` tant que le domaine n’est pas branché)

**Redirect URLs** (ajoute toutes) :
```
https://kellia.org/auth/callback
https://www.kellia.org/auth/callback
https://evoraa-net.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Sans ça, le clic sur l’email **échoue** → pas d’accès membre.

---

## D. Test rapide (10 min)

1. Crée un compte test avec un vrai email
2. Tu dois recevoir :
   - email **confirmation** (Supabase, maintenant brandé si C fait)
   - éventuellement email **bienvenue** (Resend, si clé OK)
3. Clique le bouton → tu arrives sur **/onboarding** ou **/dashboard**
4. Si erreur : page login avec message clair

---

## Checklist

- [ ] `RESEND_API_KEY` sur Vercel
- [ ] `RESEND_FROM_EMAIL` correct
- [ ] `NEXT_PUBLIC_APP_URL` = ton vrai domaine live
- [ ] SMTP Resend dans Supabase (emails Auth)
- [ ] Template Confirm signup collé
- [ ] Redirect URLs Auth à jour
- [ ] Redeploy Vercel
- [ ] Test inscription → clic email → espace membre
