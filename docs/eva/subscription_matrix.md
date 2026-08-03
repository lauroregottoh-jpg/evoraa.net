# Matrice d’abonnement — EVA & produit

> Source live : `src/lib/billing/plans.ts`  
> Colonnes Free + Alliance = **réel**.  
> Souverain = **futur stratégique** (pas vendu).

## Niveaux

| | Découverte | Alliance | Souverain (futur) |
|--|------------|----------|-------------------|
| id code | `free` | `premium_plus` | *non créé* |
| Prix | 0 | **5 000 FCFA / mois** (ancrage 7 500) | ~**10 000 FCFA** (stratégie) |
| Public | oui | oui (héros) | non |

Legacy `premium` 2 500 : non public — Eva ne le propose pas aux nouveaux.

## Fonctionnalités & limites

| Fonctionnalité | Découverte | Alliance | Souverain (prévu) |
|----------------|------------|----------|-------------------|
| Profil + questionnaires | Oui | Oui | Oui |
| Suggestions matching / jour | **3** | **15** | *TBD — plus élevé / expert* |
| Nouvelles convos / mois | **5** | **25** | *TBD* |
| Messages / conversation | **5** | **100** | *TBD* |
| Chat Eva / jour | **3** | **20** | *Illimité ou mode expert (TBD)* |
| Score compatibilité détaillé | Basique | Oui | Oui + analyses (TBD) |
| Badge / priorité soft | Non | Oui | Oui |
| Support | Standard | Prioritaire | Prioritaire+ (TBD) |
| Inspiration | Oui | Oui | Oui |
| Académie | Oui (accès membre actuel) | Oui | Pack premium pédagogique (TBD) |
| Coaching humain | Devis email | Devis email | Possible inclusion / priorité (TBD) |

## Messages Eva quand accès limité

### Quota Eva Free

Voir `08_sales_guidance.md` — expliquer Digestion Découverte + Alliance.

### Quota messages

> Sur Découverte, chaque conversation est volontairement courte (5 messages) pour favoriser la qualité. Alliance permet jusqu’à 100 messages par conversation.

### Feature non disponible / non live

> Cette option n’est pas encore proposée. Voici ce que vous pouvez faire dès maintenant : …

## Règles d’upgrade (Eva)

1. Toujours montrer ce que Free **a déjà permis**.
2. Lier l’upgrade au **besoin exprimé**, pas au discours marketing générique.
3. Un seul CTA (`/billing` ou `/premium` / Alliance).
4. Ne jamais inventer les quotas Souverain.

## Évolution future

Quand Souverain sera créé dans `plans.ts` :

1. Mettre à jour ce fichier en premier  
2. Régénérer le résumé injecté dans `10_system_prompt.md`  
3. Eva s’adapte **sans** réécrire toute l’identité  

## Extras (affichage — clarifier M13/M14)

- Packs Alliance 3 mois 12 000 / 6 mois 21 000 (affichage) vs checkout 30 j  
- Boosts 24h / 3j / 7j  

Eva : tant que le checkout réel n’est pas confirmé, parler d’Alliance mensuelle 5 000 comme offre principale.
