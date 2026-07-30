# KELIAA — Matching Engine

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026
**Référence :** `src/lib/matching/score.ts`

## Éligibilité

Un candidat est exclu si :

- il s’agit du membre lui-même ;
- le profil est supprimé, banni ou rejeté ;
- la complétion est inférieure à 50 % ;
- l’onboarding est encore aux étapes compte/profil ;
- le genre est identique lorsque les deux genres binaires sont connus ;
- l’écart d’âge dépasse 15 ans.

Le mode soft launch autorise les profils `pending` suffisamment complets ; les profils `rejected` sont toujours exclus.

## Données utilisées

### Profil

- dénomination ;
- ville et pays ;
- âge ;
- fréquence de pratique ;
- pratique spirituelle ;
- style de communication ;
- vision du mariage ;
- projet familial.

### Cinq piliers

- personnalité et stress ;
- foi et vie spirituelle ;
- relation et communication ;
- vie de couple ;
- finances et projet de foyer.

Le moteur compare les dimensions communes, pas uniquement un score total.

## Calcul

1. Calculer un score de profil de 0 à 100.
2. Calculer l’alignement dimensionnel des piliers communs.
3. Pondérer progressivement le psychométrique : `min(0,85 ; 0,40 + piliers_communs × 0,09)`.
4. Appliquer des plafonds de confiance selon la couverture et le ratio d’alignement.
5. Sans données psychométriques communes, plafonner le score à 72.
6. Exclure les scores inférieurs au minimum recommandé.

## Explicabilité

Jusqu’à quatre raisons sont affichées :

- dimensions alignées et couverture des cinq questionnaires ;
- communauté de foi proche ;
- proximité géographique ;
- écart d’âge compatible ;
- rythme spirituel ;
- style de dialogue ;
- vision du mariage ;
- projet de foyer ;
- profil vérifié.

## Niveaux

- 90–100 : excellent.
- 75–89 : élevé.
- 60–74 : modéré.
- inférieur à 60 : faible.

## Quotas

- Découverte : 3 suggestions par jour.
- Alliance : 15 suggestions par jour.
- Essentiel legacy : 10 suggestions par jour.

## Persistance

Les suggestions calculées sont insérées ou mises à jour dans `matches` avec :

- les deux utilisateurs ;
- le score ;
- le statut ;
- la date.

## Recalcul

Recalcul recommandé lorsque :

- un questionnaire change ;
- les préférences d’âge changent ;
- les informations de foi, localisation ou projet changent ;
- le statut de modération change.

## Limites

- Pas de machine learning autonome.
- Pas d’analyse comportementale secrète.
- Pas de décision sentimentale par EVA.
- Les scores orientent le discernement sans prédire la réussite d’un couple.
