# KELIAA — Payments & Subscriptions

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026

## Offres

### Découverte

- 0 FCFA.
- 3 suggestions par jour.
- 5 conversations initiées par mois.
- 5 messages envoyés par conversation.
- EVA : 3 questions par jour.

### Alliance

- 5 000 FCFA pour 30 jours.
- Prix d’ancrage : 7 500 FCFA.
- 15 suggestions par jour.
- 25 conversations initiées par mois.
- 100 messages par conversation.
- EVA : 20 questions par jour.
- Score détaillé, badge et priorité douce.

### Essentiel (legacy)

Plan technique non public à 2 500 FCFA, conservé pour les abonnements historiques.

## Providers

### Bictorys

Provider prioritaire. Checkout hébergé, Mobile Money et carte.

- Sandbox si la clé commence par `test_`.
- Production sinon.
- Mobile Money préselectionné pour l’UEMOA.
- Carte préselectionnée pour la diaspora.
- Choix manuel autorisé.
- Les requêtes serveur utilisent `curl` à cause du WAF Bictorys.

### CinetPay

Provider complémentaire déjà supporté.

### Stripe

Prévu ultérieurement, non actif dans le parcours public.

## Flux

1. Créer une souscription `pending`.
2. Créer un paiement `pending`.
3. Initier la charge chez le provider.
4. Stocker la référence provider et les métadonnées.
5. Rediriger vers le checkout hébergé.
6. Recevoir et vérifier le webhook.
7. Appliquer un statut terminal `completed` ou `failed`.
8. Activer Alliance pendant 30 jours si le paiement est confirmé.
9. Journaliser l’événement.

## Webhooks

- Bictorys : `/api/payments/bictorys/notify`
- CinetPay : `/api/payments/cinetpay/notify`

Exigences :

- signature ou secret obligatoire ;
- traitement serveur uniquement ;
- idempotence ;
- aucune confiance dans le retour navigateur ;
- service role jamais exposé au client ;
- statut `pending` ignoré jusqu’à l’état terminal.

## Audit

`payment_events` stocke :

- paiement ;
- provider ;
- type d’événement ;
- statut ;
- message ;
- payload utile ;
- horodatage.

L’admin Alliance affiche le journal, les paiements détaillés et les outils sandbox Bictorys.

## Renouvellement

- Manuel uniquement.
- Durée : 30 jours.
- Rappels avant échéance.
- Aucun prélèvement automatique en V1.

## Variables

- `PAYMENT_PROVIDER`
- `PAYMENTS_DEMO_MODE`
- `NEXT_PUBLIC_APP_URL`
- `BICTORYS_API_KEY`
- `BICTORYS_WEBHOOK_SECRET`
- `BICTORYS_MERCHANT_COUNTRY`
- `CINETPAY_API_KEY`
- `CINETPAY_SITE_ID`
- `CINETPAY_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Sécurité

- HTTPS.
- Validation des modes `mobile_money` et `card`.
- URLs publiques, jamais `localhost`, pour une charge Bictorys.
- Pas de clé dans les logs.
- Données personnelles expurgées des traces techniques.
- RLS et autorisation admin pour la consultation.
