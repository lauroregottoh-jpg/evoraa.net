---
name: ops-bictorys-live
description: Use when the founder or ops needs to connect Bictorys LIVE keys, webhook secret, Vercel env, or verify Keliaa payments go-live. Beginner French walkthrough.
---

# Ops Bictorys LIVE

Suivre pas à pas : [`docs/OPS_BICTORYS_LIVE.md`](../../../docs/OPS_BICTORYS_LIVE.md)

Rappel critique : webhook =

```text
https://www.keliaa.org/api/payments/bictorys/notify
```

Pas `.net`. Secret webhook = chaîne générée par l’humain, collée **identique** dans Bictorys et Vercel (`BICTORYS_WEBHOOK_SECRET`).
