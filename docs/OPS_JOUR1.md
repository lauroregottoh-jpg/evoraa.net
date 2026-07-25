# Ops jour 1 — ce que VOUS faites vs ce que le code fait

## En 3 phrases

1. **Compte admin** = votre compte KELIAA (email + mot de passe), puis dans Supabase vous passez le champ `role` de votre profil à `admin`. Sans ça, `/admin` vous renvoie au dashboard.
2. **Pool H + F** = il faut des **hommes et des femmes** inscrits (onboarding fini + photo). Le matching cherche l’autre genre : si tout le monde est du même genre, la liste est vide.
3. **Paiement** = on reste sur **CinetPay** (comme la plupart des apps AF Ouest pour Wave / Orange / Moov / TMoney). Farata Pointe n’affiche pas publiquement son agrégateur ; pour le **Togo**, CinetPay couvre **Moov Money** et **TMoney**. Créez un compte marchand sur [cinetpay.com](https://cinetpay.com) et collez les clés — le code est déjà branché.

---

## Checklist minimale (humain)

### A. Supabase
1. Migrations `000` → `008` appliquées (`.\run_migration.ps1` si `SUPABASE_DB_URL` est dans `.env.local`)
2. Auth → Site URL = votre domaine prod
3. Redirect URLs = `https://VOTRE-DOMAINE/auth/callback` (+ localhost si besoin)
4. Storage : bucket `avatars` (lecture publique)
5. Database → Replication : cocher `messages`

### B. Devenir admin (explication simple)

1. Créez un compte normal sur le site (Register).
2. Ouvrez Supabase → Table Editor → `profiles`.
3. Trouvez la ligne avec votre `user_id` / email.
4. Colonne `role` → mettez **`admin`** (au lieu de `member`).
5. Rechargez `/admin` : vous voyez la console.

SQL équivalent (SQL Editor Supabase) — remplacez l’email :

```sql
update profiles
set role = 'admin'
where user_id = (
  select id from auth.users where email = 'VOTRE@EMAIL.com'
);
```

### C. Vercel
- Importer le repo, coller les variables de `.env.local.example` (sauf `SUPABASE_DB_URL`)
- `NEXT_PUBLIC_APP_URL` = URL prod HTTPS
- Soft launch **sans** encaisser : `PAYMENTS_DEMO_MODE=true`
- Soft launch **avec** Mobile Money : `PAYMENTS_DEMO_MODE=false` + clés CinetPay + `SUPABASE_SERVICE_ROLE_KEY`

### D. Premiers utilisateurs (pool H+F)
Invitez ~10–20 personnes **des deux genres**, dites-leur de :
1. Créer un compte
2. Finir l’onboarding
3. Ajouter une photo

Vous approuvez les photos dans `/admin` (onglet Photos).

**Ne pas** lancer `seed.sql` (Laure / Alexandre) en production.

### E. Mentions légales
Page adaptée **Togo** (pas de SIREN). Quand vous avez RCCM / NIF / raison sociale, envoyez-les pour mise à jour.

---

## Farata & paiement — décision produit

| Question | Réponse KELIAA |
|----------|----------------|
| Que paient les users Farata-like ? | Mobile Money (Wave, Orange…) via un **agrégateur** |
| Que fait KELIAA déjà ? | **CinetPay** (`channels: ALL`) |
| Togo | Moov Money + TMoney via CinetPay |
| Faut-il changer de PSP ? | **Non** pour le soft launch — créer le compte CinetPay suffit |

---

## Ce que le code fait déjà (agent)

- Auth, onboarding, matching, messages, Free + Alliance, admin, webhooks CinetPay, mode démo
- Mentions légales Togo
- Gate onboarding sur les routes produit
- Réponses illimitées aux messages reçus (Free)
- Filtrage matching (pas de profils rejetés)
- Quota EVA / jour côté interface
- Page succès paiement honnête (activé vs en attente)
