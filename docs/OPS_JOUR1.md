# Tes étapes — dans l’ordre (toi uniquement)

Le code est prêt. Fais **une étape à la fois**. Quand une étape est finie, passe à la suivante.

Tu as déjà dans `.env.local` : Supabase URL/anon, `APP_URL`, `DB_URL`, `SERVICE_ROLE`, `PAYMENTS_DEMO_MODE`.  
Il manque surtout : **migrations appliquées ?**, **réglages Auth/Storage/Realtime**, **Vercel**, **te passer admin**, **inviter H+F**. CinetPay peut attendre (mode démo).

---

## Étape 1 — Appliquer les migrations Supabase

1. Ouvre PowerShell dans le dossier du projet `evoraa.net`.
2. Lance :

```powershell
.\run_migration.ps1
```

3. Si ça réussit → OK.  
   Si ça échoue → ouvre [Supabase](https://supabase.com/dashboard) → ton projet → **SQL Editor** → colle et exécute les fichiers dans l’ordre  
   `supabase/migrations/20240101000000_…` jusqu’à `…00009_…` (un par un).

**Tu as fini quand :** aucune erreur SQL, les tables existent (`profiles`, `messages`, `subscriptions`, etc.).

---

## Étape 2 — Régler l’Auth Supabase

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL** = l’URL **production** Vercel (pas l’URL `git-main-…` preview) :
   - ✅ `https://evoraa-net.vercel.app`
   - ❌ pas `https://evoraa-net-git-main-laurore.vercel.app` (souvent bloquée par Vercel)
3. **Redirect URLs** — ajoute :
   - `https://evoraa-net.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (tests locaux uniquement)

**Tu as fini quand :** Site URL + redirects sauvegardés.

---

## Étape 3 — Storage photos + messages temps réel

1. Supabase → **Storage** → vérifie qu’il existe un bucket **`avatars`** (lecture publique).  
   Sinon : Create bucket → nom `avatars` → Public.
2. Supabase → **Database** → **Replication** (ou Publications) → coche la table **`messages`**.

**Tu as fini quand :** bucket `avatars` OK + `messages` en realtime.

---

## Étape 4 — Mettre le site en ligne (Vercel)

1. Va sur [vercel.com](https://vercel.com) → Import le repo GitHub `evoraa.net`.
2. Dans **Environment Variables**, colle (mêmes valeurs que `.env.local`, **sauf** `SUPABASE_DB_URL`) :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` = **l’URL HTTPS Vercel** (ex. `https://evoraa-net.vercel.app`) — mets à jour après le 1er deploy si besoin
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYMENTS_DEMO_MODE` = `true` (pour commencer **sans** encaisser)
   - `CRON_SECRET` = une chaîne secrète longue (rappels J-7 abonnement — optionnel mais recommandé)
3. Deploy.
4. Si tu as un nom de domaine : DNS chez ton registrar → pointe vers Vercel, puis mets à jour `NEXT_PUBLIC_APP_URL` + Auth Site URL (Étape 2).

**Tu as fini quand :** tu ouvres l’URL Vercel et la page d’accueil charge.

---

## Étape 5 — Créer TON compte + devenir admin

1. Sur le site live (ou local) : **Créer un compte** (ton vrai email).
2. Finis l’**onboarding**.
3. Supabase → **Table Editor** → table **`profiles`**.
4. Trouve ta ligne → colonne **`role`** → écris **`admin`** (à la place de `member`).
5. Ou SQL Editor :

```sql
update profiles
set role = 'admin'
where user_id = (
  select id from auth.users where email = 'TON@EMAIL.com'
);
```

6. Va sur `https://TON-SITE/admin` → tu dois voir la console admin.

**Tu as fini quand :** `/admin` s’ouvre (pas de renvoi vers dashboard).

---

## Étape 6 — Test solo (avant d’inviter qui que ce soit)

Sur le site, avec ton compte :

1. Ajoute une **photo** → dans `/admin` → onglet Photos → **OK**.
2. Va sur **Découvrir / Compatibilité** (pour l’instant peut être vide — normal).
3. Ouvre **/billing** → Alliance → si `PAYMENTS_DEMO_MODE=true`, simule le paiement → abo actif.
4. Ouvre **/help** → pose 1 question EVA.

**Tu as fini quand :** photo approuvée + billing démo compris.

---

## Étape 7 — Inviter les premiers users (hommes ET femmes)

Le matching montre l’**autre genre**. Il faut les deux.

1. Invite **≈ 10–20 personnes** (mélange H et F).
2. Dis-leur exactement :
   - créer un compte  
   - finir l’onboarding  
   - mettre une photo  
3. Toi : `/admin` → Photos → approuver rapidement.  
4. Support : un WhatsApp ou `contact@keliaa.net` pour la cohorte.

**Tu as fini quand :** au moins quelques H et quelques F ont un profil + photo OK, et Découvrir montre des suggestions.

---

## Étape 8 — Paiements réels (plus tard, quand tu veux encaisser)

Pas obligatoire pour la 1re cohorte si démo = true.

1. Crée un compte [cinetpay.com](https://cinetpay.com) (Togo : Moov / TMoney).
2. Sur Vercel, ajoute :
   - `CINETPAY_API_KEY`
   - `CINETPAY_SITE_ID`
   - `CINETPAY_SECRET_KEY`
   - `PAYMENTS_DEMO_MODE` = `false`
3. Notify URL CinetPay :

`https://TON-DOMAINE/api/payments/cinetpay/notify?token=TA_CINETPAY_SECRET_KEY`

4. Fais **1 paiement test** de 5 000 FCFA.

---

## Étape 9 — Optionnel

- **Resend** (formulaire Contact) : `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `CONTACT_INBOX_EMAIL`
- **RCCM / NIF** : envoie-les → on met à jour `/mentions-legales`
- Ne lance **jamais** `seed.sql` (faux profils Laure/Alexandre) en prod

---

## Récap ultra court

| # | Toi | Où |
|---|-----|-----|
| 1 | Migrations | PowerShell ou SQL Editor |
| 2 | Auth URLs | Supabase Auth |
| 3 | Avatars + Realtime messages | Supabase Storage / Replication |
| 4 | Deploy + env | Vercel |
| 5 | Compte + role admin | Site + Supabase profiles |
| 6 | Smoke test | Site + /admin |
| 7 | Inviter H et F | WhatsApp / bouche-à-oreille |
| 8 | CinetPay | Quand tu veux encaisser |

Dis **« étape 1 faite »** (ou le numéro) quand tu bloques — on avance une par une.
