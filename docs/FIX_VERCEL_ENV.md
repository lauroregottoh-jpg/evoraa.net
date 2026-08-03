# Corriger la connexion sur Vercel (erreur Protected deployment)

## Ce qui se passe

Quand vous cliquez « Se connecter », le site envoie parfois la requête vers une **mauvaise adresse** :
`evoraa-net-git-main-laurore.vercel.app` au lieu de `rrjwhrdtokncfrzxtfoa.supabase.co`.

Vercel bloque alors avec `Protected deployment`.

## Solution 1 — Corriger les variables sur Vercel (5 min)

1. Allez sur **vercel.com** → connectez-vous
2. Cliquez sur le projet **evoraa-net**
3. En haut : **Settings** (pas Deployments)
4. Menu gauche : **Environment Variables**
5. Vérifiez / modifiez ces 3 variables (Production + Preview + Development) :

| Nom | Valeur exacte |
|-----|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rrjwhrdtokncfrzxtfoa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (copiez depuis votre `.env.local`) |
| `NEXT_PUBLIC_APP_URL` | `https://evoraa-net.vercel.app` |

⚠️ `NEXT_PUBLIC_SUPABASE_URL` ne doit **jamais** contenir `vercel.app`.

6. Onglet **Deployments** → dernier déploiement → **⋯** → **Redeploy**

## Solution 2 — Connexion immédiate en local (en attendant)

```powershell
cd Kellia.net
npm run dev
```

Puis : http://localhost:3000/login  
Email : `lauroregottoh@gmail.com`  
Mot de passe : `KELLIA-32fa2984!`

## URL à utiliser en ligne

✅ https://evoraa-net.vercel.app/login  
❌ pas `git-main-laurore`

## Vérifier après redeploy

Ouvrez : https://evoraa-net.vercel.app/api/health/config  

Vous devez voir `"ok": true` et `"misconfigured": false`.
