# Coaching audio — LiveKit Cloud (gratuit)

Salle **dans** KELIAA. Pas de Google Meet embarqué (impossible). Pas de Daily (carte).

## Compte (0 €, sans CB)

1. https://cloud.livekit.io — créer un projet (plan **Build**).
2. **Settings → Keys** : copier URL (`wss://…`), API Key, API Secret.
3. Vercel → projet `evoraa-net` → Environment Variables (Production) :
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
4. Redeploy prod.
5. Optionnel : retirer `DAILY_API_KEY` (inutilisé).

## Test

Coach + membre sur `/coaching/session` → salle d’attente → **Entrer en séance** → autoriser le micro → chrono KELIAA.
