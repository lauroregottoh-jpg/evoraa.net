# Ce que VOUS devez faire (humain) — le reste est automatisable dans le code

Le code KELIA est prêt côté produit. **Sans les actions ci-dessous, le soft launch reste bloqué** car elles nécessitent vos comptes / secrets / identité légale.

## Checklist minimale (copier-coller)

### 1. Compléter `.env.local` (projet local)

```
NEXT_PUBLIC_SUPABASE_URL=...          # déjà présent
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # déjà présent
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
SUPABASE_DB_URL=postgresql://postgres:...@db.xxxx.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=...         # Dashboard Supabase → Settings → API
PAYMENTS_DEMO_MODE=false              # ou true si soft launch sans paiement réel
CINETPAY_API_KEY=...
CINETPAY_SITE_ID=...
CINETPAY_SECRET_KEY=...
RESEND_API_KEY=...                    # optionnel mais active le formulaire Contact
RESEND_FROM_EMAIL=KELIA <noreply@kelia.net>
CONTACT_INBOX_EMAIL=contact@kelia.net
```

Puis dans le dossier du projet :

```powershell
.\run_migration.ps1
```

### 2. Dashboard Supabase (5 min)

1. **Authentication → URL Configuration**
   - Site URL = URL prod
   - Redirect URLs = `https://domaine/auth/callback` + `http://localhost:3000/auth/callback`
2. **Database → Replication** : cocher `messages`
3. **Storage** : vérifier bucket `avatars` (public read)

### 3. Vercel

1. Importer le repo `evoraa.net`
2. Coller les mêmes variables (sauf `SUPABASE_DB_URL`)
3. Deploy

### 4. CinetPay (si paiements réels)

Notify URL (déjà construite par le code si `CINETPAY_SECRET_KEY` est défini) :

`https://domaine/api/payments/cinetpay/notify?token=VOTRE_CINETPAY_SECRET_KEY`

### 5. Domaine DNS

Pointer le domaine vers Vercel (registrar).

### 6. Mentions légales

Remplir raison sociale / SIREN / siège dans `/mentions-legales` (placeholders `[À compléter]`).

---

## Ce que l’agent a déjà automatisé dans le code

- Auth, matching, messaging, billing, reports, photos, settings, admin live
- Dashboard réel (plus de faux “Laure”)
- Contact honnête (Resend ou message d’erreur, pas faux succès)
- Webhook CinetPay sécurisé + `notify_url` avec token
- CGU / confidentialité / mentions légales (brouillon)
- Migrations SQL `000`→`008` prêtes à appliquer
- CI GitHub Actions

## Ce que l’agent NE PEUT PAS faire sans vous

| Action | Pourquoi |
|--------|----------|
| Créer / coller service role, DB password, CinetPay, Resend | Secrets — sécurité |
| Appliquer migrations sans `SUPABASE_DB_URL` | Accès DB |
| Configurer Auth redirects Supabase | Dashboard propriétaire |
| Créer projet Vercel + coller env | Compte Vercel |
| DNS domaine | Registrar |
| Remplir SIREN / société | Identité légale réelle |
| Activer Realtime dans le dashboard | Vérification propriétaire |

Dès que `.env.local` contient `SUPABASE_DB_URL` + service role, redemandez : **« applique migrations + deploy »** — l’agent peut enchaîner.
