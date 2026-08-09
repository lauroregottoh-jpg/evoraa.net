# Questionnaire Couple — Spec V1.1

Objectif : mieux alimenter la trame des docs maîtres  
[`KELIAA COUPLE™.md`](../KELIAA%20COUPLE%20TM/KELIAA%20COUPLE™.md) et  
[`KELIAA COUPLE™ — PREMIUM PLUS.md`](../KELIAA%20COUPLE%20TM/KELIAA%20COUPLE™%20—%20PREMIUM%20PLUS.md).

## État actuel (V1.0)

- **54 questions** Likert (18 dimensions × 3)
- Suffisant pour scores / écarts / convergences / priorités
- Insuffisant pour l’accueil contextualisé et certains exercices « style » du maître

## A. Contexte couple (onboarding — hors score Likert)

| Champ | Type | Usage rapport |
|-------|------|----------------|
| `relationship_status` | enum intérêt / cheminement / fiançailles / mariage_recent / mariage_etabli | Accueil, ton |
| `relationship_duration` | texte court (ex. « 6 ans ») | Accueil |
| `marriage_horizon` | oui / non / horizon | Mariage / projet |
| `recurring_topic` | 1 phrase | Dynamique |
| `clarify_goal` | 1 phrase | Conclusion / plan |

## B. +2 items sur dimensions critiques (+16)

Passer de 3 à 5 items sur :  
`finances`, `projet_vie`, `carriere`, `communication`, `conflits`, `affection`, `famille`, `decision`.

Total Likert ≈ **70**.

## C. 4 questions « style » (scorées à part ou hors global)

1. Quand un sujet est important, j’ai surtout besoin de **temps pour réfléchir** / **une clarification rapide**.
2. Avant d’avancer sur un projet, j’ai surtout besoin de **sécurité** / **de voir un premier pas concret**.
3. Je me sens aimé(e) surtout par… (geste / mots / temps / aide concrète).
4. Face aux familles, notre couple a surtout besoin de… (frontières claires / souplesse / règles à deux).

## Déploiement

1. Valider cette liste
2. Ajouter à [`questionBank.ts`](../../src/lib/couple/questionBank.ts) + bump `COUPLE_QUESTIONNAIRE_VERSION`
3. Brancher le formulaire onboarding contexte → `CoupleContext` / meta couple
4. Régénérer démo Daniel & Naomi avec contexte fiançailles déjà en place
