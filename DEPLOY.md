# Ce que VOUS devez faire (humain) — le reste est dans le code

Guide détaillé (admin, pool H+F, Farata/paiement) : **`docs/OPS_JOUR1.md`**

## Checklist minimale

### 1. `.env.local` / Vercel

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
SUPABASE_SERVICE_ROLE_KEY=...
PAYMENTS_DEMO_MODE=true              # false + CinetPay si encaissement réel
# CRON_SECRET=                         # rappels J-7 Alliance (Vercel Cron)
# CINETPAY_API_KEY=
# CINETPAY_SITE_ID=
# CINETPAY_SECRET_KEY=
# RESEND_API_KEY=
# RESEND_FROM_EMAIL=KELLIA <contact@keliaa.org>
# CONTACT_INBOX_EMAIL=lauroregottoh@gmail.com
# SUPABASE_DB_URL=...                # seulement pour run_migration.ps1
```

```powershell
.\run_migration.ps1
```

### 2. Supabase (5 min)

1. Auth → Site URL + Redirect `…/auth/callback`
2. Replication : table `messages`
3. Storage : bucket `avatars`
4. Devenir admin : `profiles.role = 'admin'` (voir OPS_JOUR1)

### 3. Vercel + DNS

Importer le repo, coller les env, pointer le domaine.

### 4. Paiements (Togo)

KELLIA utilise **CinetPay** (Moov Money + TMoney au Togo ; Wave/Orange ailleurs).  
Compte marchand : [cinetpay.com](https://cinetpay.com) — le code est déjà prêt.

Notify URL :

`https://domaine/api/payments/cinetpay/notify?token=VOTRE_CINETPAY_SECRET_KEY`

### 5. Mentions légales

Page adaptée **Togo** (pas de SIREN). Ajoutez RCCM/NIF quand vous les avez.

### 6. Premiers users

Invitez des **hommes et des femmes** (sinon matching vide). Approuvez les photos dans `/admin`.
