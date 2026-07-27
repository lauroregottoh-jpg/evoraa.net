# URL Vercel — IMPORTANT

## Utilisez cette URL (production)

**https://evoraa-net.vercel.app**

- Connexion : https://evoraa-net.vercel.app/login
- Admin : https://evoraa-net.vercel.app/admin

## N'utilisez PAS l'URL preview

Les URLs du type `evoraa-net-git-main-laurore.vercel.app` sont des **déploiements preview**.
Sur le plan gratuit Vercel, elles sont souvent **protégées** (« Protected deployment », « Log in to Vercel »).
Vercel propose parfois de **payer / upgrader** pour changer cette protection — ce n'est pas obligatoire.

**Solution :** utilisez toujours `evoraa-net.vercel.app` (production).

## Supabase Auth

Dans Supabase → Authentication → URL Configuration :

| Champ | Valeur |
|-------|--------|
| Site URL | `https://evoraa-net.vercel.app` |
| Redirect URLs | `https://evoraa-net.vercel.app/auth/callback` |

## Vercel — variable d'environnement

Dans Vercel → Project → Settings → Environment Variables :

```
NEXT_PUBLIC_APP_URL=https://evoraa-net.vercel.app
```

Puis **Redeploy**.

## Identifiants admin (Laurore)

- Email : `lauroregottoh@gmail.com`
- Mot de passe : celui communiqué lors de la création du compte
