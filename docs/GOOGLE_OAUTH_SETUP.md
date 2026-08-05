# Connexion Google (OAuth) — KELIAA

Le bouton **Continuer avec Google** est déjà dans le code (`/register` et `/login`).
L’erreur `unsupported provider` / `provider is not enabled` signifie que Google **n’est pas activé** dans Supabase (pas un bug du site).

Projet Supabase KELIAA : `rrjwhrdtokncfrzxtfoa`

> **Différence avec le kit evoora** : evoora utilise son propre OAuth (`GOOGLE_CLIENT_ID` / `SECRET` / `REDIRECT_URI` → `/api/auth/oauth/google/callback`).  
> **KELIAA garde Supabase Auth** : tu crées le même type d’OAuth Client Google Cloud, mais tu branches Client ID + Secret **dans Supabase → Authentication → Providers → Google**, et le Redirect URI Google Cloud pointe vers Supabase (`…supabase.co/auth/v1/callback`), **pas** vers une route Next.js. Ne colle pas les `GOOGLE_*` d’evoora dans Vercel pour KELIAA — ça ne branchera pas le bouton.

---

## 1. Google Cloud Console (~5–10 min)

1. Ouvre [Google Cloud Console](https://console.cloud.google.com/) → crée un projet (ex. `Keliaa`) ou utilise un projet existant.
2. **APIs & Services** → **OAuth consent screen** :
   - Type **External**
   - App name : `KELIAA`
   - User support email + developer contact : ton email
   - Enregistre (tu pourras publier plus tard ; en mode Test, ajoute les emails de test dans *Test users*)
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type : **Web application**
   - Name : `KELIAA Web`
4. **Authorized JavaScript origins** (ajouter) :
   - `http://localhost:3000`
   - `https://www.keliaa.org`
   - `https://keliaa.org`
5. **Authorized redirect URIs** — **uniquement** le callback Supabase (pas ton site) :
   - `https://rrjwhrdtokncfrzxtfoa.supabase.co/auth/v1/callback`
6. Créer → copier **Client ID** et **Client Secret**.

---

## 2. Supabase Dashboard (obligatoire)

1. Ouvre [Supabase](https://supabase.com/dashboard) → projet KELIAA.
2. **Authentication** → **Providers** → **Google** → **Enable**.
3. Coller **Client ID** + **Client Secret** Google → **Save**.
4. **Authentication** → **URL Configuration** :
   - **Site URL** : `https://www.keliaa.org`
   - **Redirect URLs** (ajouter toutes) :
     - `https://www.keliaa.org/auth/callback`
     - `https://keliaa.org/auth/callback`
     - `http://localhost:3000/auth/callback`

Sans l’étape 2 (Enable Google), le bouton affichera toujours *unsupported provider*.

---

## 3. Test

1. Ouvre https://www.keliaa.org/register → Bienvenue → **Continuer avec Google**.
2. Tu dois être redirigé vers le choix de compte Google, puis revenir sur Keliaa (onboarding ou espace membre).

| Cas | Résultat |
|---|---|
| Nouvel utilisateur Google | Compte créé → onboarding |
| Compte déjà existant | Session → dashboard / onboarding si profil incomplet |

L’inscription **e-mail** reste disponible même sans Google.

---

## 5. Nom affiché « rrjwhr….supabase.co » au lieu de KELIAA

Normal avec Supabase : Google affiche le **domaine du callback** (`….supabase.co`), pas toujours le nom de l’app.

Pour améliorer :
1. Google Cloud → **API et services** → **Écran de consentement OAuth** → nom **KELIAA**, logo, lien confidentialité `https://www.keliaa.org/confidentialite`.
2. Publier l’app (passer de **Test** à **En production**) quand tu es prêt.
3. Pour masquer totalement `supabase.co` : domaine Auth personnalisé Supabase (plan payant) — optionnel plus tard.

Le login fonctionne quand même ; c’est uniquement l’affichage Google.
