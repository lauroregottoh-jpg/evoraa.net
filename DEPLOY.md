# Ce que VOUS devez faire (humain) — le reste est dans le code

Guide détaillé (admin, pool H+F, Farata/paiement) : **`docs/OPS_JOUR1.md`**

## Checklist minimale

### 1. `.env.local` / Vercel

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://www.keliaa.org
SUPABASE_SERVICE_ROLE_KEY=...
PAYMENTS_DEMO_MODE=false
PAYMENT_PROVIDER=bictorys
BICTORYS_API_KEY=public-...
BICTORYS_WEBHOOK_SECRET=...
BICTORYS_MERCHANT_COUNTRY=TG
# CRON_SECRET=
# RESEND_API_KEY=
# RESEND_FROM_EMAIL=KELIAA <contact@keliaa.org>
```

Guide Bictorys live (débutant) : **`docs/OPS_BICTORYS_LIVE.md`**

```powershell
.\run_migration.ps1
```

### 2. Supabase (5 min)

1. Auth → Site URL + Redirect `…/auth/callback`
2. Replication : table `messages`
3. Storage : bucket `avatars`
4. Devenir admin : `profiles.role = 'admin'` (voir OPS_JOUR1)

### 3. Vercel + DNS

Importer le repo, coller les env, pointer le domaine **keliaa.org**.

### 4. Paiements (Togo) — Bictorys

Keliaa utilise **Bictorys** en primary (Mobile Money UEMOA). CinetPay reste en fallback code.

Webhook URL (sans `?token=`) :

`https://www.keliaa.org/api/payments/bictorys/notify`

Voir **`docs/OPS_BICTORYS_LIVE.md`**.

### 5. Mentions légales

Page adaptée **Togo** (pas de SIREN). Ajoutez RCCM/NIF quand vous les avez.

### 6. Premiers users

Invitez des **hommes et des femmes** (sinon matching vide). Approuvez les photos dans `/admin`.
