# BILAN COUPLE — PLAN DE CONSOLIDATION ET DE VALIDATION V1

**Version : 1.0**  
**Statut : Document maître — contrôle qualité avant développement**  
**Dépendances : `01_CAHIER_DES_CHARGES.md` à `07_SPECIFICATION_PLATEFORME.md`**  
**Format : Markdown (.md)**

---

# 1. OBJET

Ce document constitue la phase de consolidation du socle V1.

Les sept premiers documents décrivent :

- le produit ;
- le questionnaire ;
- le scoring ;
- le matching ;
- les interprétations ;
- les modèles de rapports ;
- les offres ;
- la plateforme.

Le présent document sert à vérifier que ces éléments sont cohérents entre eux avant de commencer le développement.

L'objectif n'est pas de créer davantage de documentation.

L'objectif est de répondre à une seule question :

> **Avons-nous suffisamment verrouillé le produit pour que le développement puisse être réalisé sans devoir réinventer les règles en cours de route ?**

---

# 2. PRINCIPE DE CONSOLIDATION

La consolidation doit suivre cette chaîne :

```text
QUESTIONS
↓
DIMENSIONS
↓
SCORING
↓
MATCHING
↓
INTERPRÉTATION
↓
PRIORISATION
↓
RAPPORT
↓
RESSOURCE
↓
ACTION
```

Chaque élément doit avoir une relation claire avec le précédent et le suivant.

---

# 3. LES 7 DOCUMENTS DU SOCLE

| Document | Fonction | Statut |
|---|---|---|
| 01 | Cahier des charges | À verrouiller |
| 02 | Scoring / matching | **Priorité critique** |
| 03 | Banque de questions | **Priorité critique** |
| 04 | Interprétations | À valider après scoring |
| 05 | Modèles de rapports | À valider après interprétations |
| 06 | Offres / ressources | À verrouiller |
| 07 | Plateforme | À aligner sur les décisions finales |

---

# 4. PRIORITÉ ABSOLUE

Avant de développer, les trois éléments suivants doivent être définitifs :

1. **La structure du questionnaire**
2. **Le système de scoring**
3. **Le système de matching**

Pourquoi ?

Parce qu'une modification du scoring peut modifier :

- les résultats ;
- les interprétations ;
- les priorités ;
- les rapports ;
- les ressources ;
- la présentation du produit.

Il faut donc éviter de développer le moteur avant de stabiliser ces trois éléments.

---

# 5. MATRICE DE TRAÇABILITÉ

Chaque question doit pouvoir être suivie jusqu'au rapport.

Structure :

```text
QUESTION_ID
↓
SUBDIMENSION_ID
↓
DIMENSION_ID
↓
SCORE_TYPE
↓
WEIGHT
↓
MATCH_RULE
↓
INTERPRETATION_RULE
↓
PRIORITY_RULE
↓
REPORT_SECTION
↓
RESOURCE_RULE
```

Si une question ne peut pas être reliée à cette chaîne, elle doit être réexaminée.

---

# 6. CONTRÔLE DE LA BANQUE DE QUESTIONS

Pour chaque question, vérifier :

- [ ] identifiant unique ;
- [ ] dimension ;
- [ ] sous-dimension ;
- [ ] formulation claire ;
- [ ] réponse attendue ;
- [ ] sens du score ;
- [ ] éventuel reverse scoring ;
- [ ] poids ;
- [ ] rôle dans le profil individuel ;
- [ ] rôle dans le matching ;
- [ ] sensibilité éventuelle ;
- [ ] version.

---

# 7. CONTRÔLE DES QUESTIONS REDONDANTES

Deux questions ne doivent pas mesurer exactement la même chose sans raison.

Pour chaque groupe de questions :

```text
Question A
Question B
Question C
```

vérifier :

> Est-ce que chacune apporte une information distincte ?

Si non :

- fusionner ;
- supprimer ;
- ou justifier la redondance.

---

# 8. CONTRÔLE DE L'ÉQUILIBRE

Le questionnaire doit éviter qu'une seule dimension domine artificiellement le résultat.

Vérifier :

```text
Nombre de questions / dimension
+
Poids / dimension
+
Importance structurante
```

Le nombre de questions et le poids ne doivent pas automatiquement produire deux fois le même avantage.

---

# 9. CONTRÔLE DU SENS DES SCORES

Chaque score doit avoir un sens explicite.

Exemple :

```text
Score élevé = plus de convergence avec le construit évalué
```

ou :

```text
Score élevé = plus forte présence d'une caractéristique
```

Le moteur ne doit jamais interpréter un score sans connaître son orientation.

---

# 10. REVERSE SCORING

Toute question inversée doit être identifiée explicitement.

Exemple :

```text
QUESTION_ID: Q034
REVERSE: TRUE
```

La transformation doit être effectuée avant le calcul du score final.

Aucune question inversée ne doit être interprétée directement comme si elle était orientée normalement.

---

# 11. NORMALISATION

Les dimensions doivent être comparables même si elles ne contiennent pas le même nombre de questions.

Le moteur doit donc utiliser des scores normalisés.

Format recommandé :

```text
RAW_SCORE
↓
NORMALIZED_SCORE
↓
0–100
```

---

# 12. SCORE INDIVIDUEL

Le profil de chaque partenaire doit être calculé séparément.

```text
Partner_A
↓
Scores individuels

Partner_B
↓
Scores individuels
```

Le score de couple ne doit jamais remplacer les deux profils individuels.

---

# 13. SCORE DE COUPLE

Le score de couple doit être calculé après les deux profils.

Il doit intégrer :

- convergence ;
- différence ;
- perception ;
- importance de la dimension ;
- éventuellement complémentarité.

---

# 14. RÈGLE IMPORTANTE SUR LE SCORE GLOBAL

Le score global ne doit pas être considéré comme une moyenne parfaite de la relation.

Il représente uniquement :

> **un indicateur synthétique des convergences et différences mesurées par le bilan.**

---

# 15. DIMENSIONS STRUCTURANTES

Les dimensions structurantes doivent être signalées séparément.

Liste de référence :

- vision du couple ;
- valeurs ;
- mariage ;
- finances ;
- parentalité ;
- projet de vie ;
- famille ;
- conflits ;
- sécurité relationnelle.

Cette liste peut être ajustée après validation du scoring.

---

# 16. RÈGLE DU « MASQUAGE »

Aucune dimension critique ne doit disparaître derrière un score global.

Exemple :

```text
Global = 88
Parentalité = divergence majeure
```

Le rapport doit afficher explicitement la divergence.

---

# 17. MATCHING — DÉFINITION EXACTE

Le matching est la comparaison des deux profils.

Il ne consiste pas à rechercher un partenaire dans une base.

Le système doit toujours faire :

```text
Couple_ID
+
Partner_A
+
Partner_B
```

---

# 18. MATRICE DE MATCHING

Pour chaque dimension :

```text
Dimension
Score_A
Score_B
Absolute_Difference
Relative_Difference
Perception_A
Perception_B
Perception_Gap
Sensitivity
Priority
Interpretation_ID
```

---

# 19. DIFFÉRENCE DE SCORE

La différence brute peut être calculée comme :

```text
ABS(Score_A - Score_B)
```

Mais elle ne doit pas être interprétée seule.

Une différence de 20 points sur une préférence quotidienne n'a pas nécessairement la même importance qu'une différence de 20 points sur la parentalité.

---

# 20. ÉCART DE PERCEPTION

Le système doit calculer séparément :

```text
ABS(Perception_A - Perception_B)
```

Cela permet de détecter :

- une divergence réelle ;
- une perception différente d'une même situation ;
- une combinaison des deux.

---

# 21. QUATRE CAS FONDAMENTAUX

Le moteur doit distinguer au minimum :

### CAS A — Scores proches + perceptions proches

> Forte convergence.

### CAS B — Scores différents + perceptions proches

> Différence de fonctionnement.

### CAS C — Scores proches + perceptions différentes

> Écart de perception.

### CAS D — Scores différents + perceptions différentes

> Divergence + écart de perception.

---

# 22. COMPLÉMENTARITÉ

Le moteur peut identifier une complémentarité lorsque :

```text
Différence
+
Respect
+
Valeurs compatibles
+
Capacité de négociation
```

Mais la complémentarité ne doit pas être automatiquement attribuée.

Elle doit être considérée comme une interprétation possible.

---

# 23. PRIORISATION

Chaque dimension doit recevoir un niveau de priorité.

Proposition :

```text
LOW
MODERATE
HIGH
CRITICAL
```

Le calcul doit combiner :

```text
Difference
+
Perception_Gap
+
Structural_Importance
+
Sensitivity
+
Potential_Impact
```

---

# 24. PRIORITÉ CRITICAL

Une priorité critique ne doit être utilisée que lorsque cela est justifié.

Exemples possibles :

- divergence majeure sur parentalité ;
- divergence majeure sur vision fondamentale du mariage ;
- problème important autour de sécurité ou de limites ;
- divergence structurante non négociée.

---

# 25. NOMBRE DE PRIORITÉS

Le rapport ne doit pas afficher 15 priorités.

Maximum recommandé :

**3 à 5 priorités principales.**

Les autres sujets peuvent apparaître dans les sections secondaires.

---

# 26. FORCES

Le système doit également rechercher les convergences.

Un rapport ne doit pas être uniquement une liste de problèmes.

Maximum recommandé :

**5 forces principales.**

---

# 27. ÉQUILIBRE DU RAPPORT

Le rapport doit chercher un équilibre :

```text
FORCES
+
CONVERGENCES
+
DIFFÉRENCES
+
PRIORITÉS
+
ACTIONS
```

Éviter :

```text
PROBLÈMES
PROBLÈMES
PROBLÈMES
PROBLÈMES
```

---

# 28. RÈGLE D'INTERPRÉTATION

Chaque résultat doit être formulé avec prudence.

Structure :

```text
OBSERVATION
↓
INTERPRÉTATION
↓
LIMITATION
↓
ACTION
```

---

# 29. RÈGLE DE NON-DIAGNOSTIC

Le système ne doit pas diagnostiquer :

- trouble psychologique ;
- trouble de personnalité ;
- attachement clinique ;
- dépendance clinique ;
- violence sur la base d'un simple score.

Il peut identifier :

> un signal à explorer.

---

# 30. RÈGLE DE NON-VERDICT

Interdiction de générer automatiquement :

- « vous êtes incompatibles » ;
- « vous ne devez pas vous marier » ;
- « votre couple est condamné » ;
- « vous êtes faits l'un pour l'autre ».

---

# 31. RÈGLE DU SCORE DE 15 %

Un score faible doit conduire à davantage de nuance, pas à davantage de dramatisation.

Formulation de référence :

> Votre indice de convergence est faible sur les dimensions évaluées. Plusieurs différences importantes ressortent de vos réponses. Ce résultat ne constitue pas un verdict sur votre relation ; il indique surtout les domaines qui méritent une clarification approfondie.

---

# 32. RÈGLE DU SCORE DE 95 %

Un score élevé ne doit pas produire une garantie.

Formulation :

> Votre indice de convergence est élevé. Vous présentez de nombreuses similitudes sur les dimensions évaluées. Comme pour tout couple, certaines différences restent à comprendre et à gérer.

---

# 33. MODÈLE DE SORTIE DU MOTEUR

Le moteur doit produire une structure intermédiaire avant de générer le rapport.

Exemple :

```json
{
  "couple_id": "CP-XXXX",
  "global_index": 78,
  "global_label": "FORTE_CONVERGENCE",
  "strengths": [],
  "divergences": [],
  "perception_gaps": [],
  "priorities": [],
  "individual_actions": {
    "partner_a": [],
    "partner_b": []
  },
  "couple_actions": [],
  "conversations": [],
  "resources": []
}
```

Cette structure est un modèle logique et devra être adaptée au système technique choisi.

---

# 34. STRUCTURE DE DONNÉES DES RÈGLES

Chaque règle doit posséder un identifiant.

```text
RULE_ID
DIMENSION
SUBDIMENSION
CONDITION
PRIORITY
INTERPRETATION
WHAT_IT_DOES_NOT_MEAN
INDIVIDUAL_ACTION
COUPLE_ACTION
CONVERSATION
RESOURCE_ID
VERSION
```

---

# 35. RÈGLE DE VERSIONNAGE

Toute modification importante doit produire une nouvelle version.

Exemple :

```text
INTERPRETATION_VERSION = 1.1
```

Le système doit conserver la version utilisée pour générer chaque rapport.

---

# 36. CONTRÔLE DES MODÈLES DE RAPPORT

Chaque modèle du document 05 doit être vérifié contre les règles du document 04.

Pour chaque section :

- [ ] formulation conforme ;
- [ ] pas de verdict ;
- [ ] pas de diagnostic ;
- [ ] action présente ;
- [ ] logique cohérente avec les résultats ;
- [ ] niveau de détail adapté à l'offre.

---

# 37. RAPPORT PREMIUM

Le rapport Premium doit fournir une forte valeur sans devenir un simple aperçu du Premium+.

Il doit répondre à :

> **Qu'est-ce que nous avons découvert sur notre dynamique ?**

---

# 38. RAPPORT PREMIUM+

Le Premium+ doit répondre à une question supplémentaire :

> **Maintenant que nous savons cela, comment pouvons-nous travailler dessus ?**

---

# 39. TEST DE DIFFÉRENCIATION DES OFFRES

Si une personne lit les deux rapports, elle doit constater une différence nette.

### Premium

Analyse.

### Premium+

Analyse + outils d'action.

Si la différence n'est pas perceptible, le Premium+ doit être enrichi.

---

# 40. CONTRÔLE DE LONGUEUR

Les pages sont un résultat, pas un objectif.

Vérifier :

```text
Information utile / page
```

et non :

```text
Nombre de pages
```

---

# 41. CONTRÔLE DES RESSOURCES

Une ressource doit être associée à un résultat.

Test :

> Pourquoi cette ressource apparaît-elle ?

Si la réponse n'est pas identifiable :

> retirer la recommandation.

---

# 42. CONTRÔLE COMMERCIAL

Le rapport doit pouvoir être utile sans achat supplémentaire.

L'offre suivante doit être présentée comme une possibilité.

---

# 43. CONTRÔLE DU PARCOURS UTILISATEUR

Le parcours cible doit être :

```text
Découvrir
↓
Choisir
↓
Créer
↓
Inviter
↓
Répondre
↓
Attendre
↓
Découvrir
↓
Agir
```

---

# 44. RÉDUCTION DU NOMBRE D'ÉCRANS

Le MVP ne doit pas multiplier les étapes inutiles.

L'utilisateur doit comprendre à chaque étape :

> Où suis-je ?

> Qu'est-ce que je dois faire ?

> Que se passe-t-il ensuite ?

---

# 45. CHECKLIST DE CONFIDENTIALITÉ

- [ ] Réponses A privées
- [ ] Réponses B privées
- [ ] Commentaires libres privés
- [ ] Aucun partage brut
- [ ] Rapport commun contrôlé
- [ ] Accès authentifié
- [ ] Tokens sécurisés
- [ ] Suppression des données prévue
- [ ] Politique de confidentialité publiée

---

# 46. CHECKLIST DE SÉCURITÉ

- [ ] Mots de passe sécurisés
- [ ] Sessions protégées
- [ ] Codes non devinables
- [ ] Tokens d'invitation sécurisés
- [ ] Autorisations par rôle
- [ ] Journal d'audit
- [ ] Protection contre les rattachements multiples
- [ ] Protection contre les accès croisés

---

# 47. TEST DU COUPLE À DEUX

Scénario nominal :

```text
A crée
↓
A invite
↓
B rejoint
↓
A répond
↓
B répond
↓
A valide
↓
B valide
↓
Scoring
↓
Matching
↓
Rapport
```

Ce scénario doit fonctionner sans intervention manuelle.

---

# 48. TEST DU COUPLE AVEC A ACHETEUR

```text
A crée
↓
A paie
↓
A invite B
↓
B rejoint
↓
Questionnaires
↓
Rapport
```

Doit fonctionner.

---

# 49. TEST DU COUPLE AVEC B ACHETEUR

```text
A crée
↓
A invite B
↓
B rejoint
↓
B paie
↓
Questionnaires
↓
Rapport
```

Doit fonctionner.

---

# 50. TEST DU CODE À TROIS

```text
A
+
B
+
C
```

Résultat :

```text
A + B = couple
C = refus
```

---

# 51. TEST DU LIEN PARTAGÉ

Si le lien est transmis plusieurs fois :

- première utilisation valide ;
- deuxième partenaire déjà rattaché ;
- toute utilisation supplémentaire refusée.

---

# 52. TEST DU PARTENAIRE QUI ABANDONNE

A termine.

B quitte à 61 %.

Le système conserve :

```text
A = COMPLETED
B = IN_PROGRESS
```

A peut revenir consulter l'état.

---

# 53. TEST DU RETOUR

B revient.

Il retrouve :

```text
Question 77 / 126
```

avec toutes ses réponses précédentes.

---

# 54. TEST DE MODIFICATION AVANT VALIDATION

B peut modifier une réponse.

Le score n'est pas calculé définitivement avant verrouillage.

---

# 55. TEST APRÈS VERROUILLAGE

Une réponse verrouillée ne doit plus être modifiée normalement.

Toute réouverture doit être contrôlée.

---

# 56. TEST DU PAIEMENT ÉCHOUÉ

Le couple ne doit pas être supprimé.

Les questionnaires éventuels restent sauvegardés.

---

# 57. TEST DE RAPPORT

Si le moteur rencontre une erreur :

```text
REPORT_GENERATION_FAILED
```

Il doit être possible de relancer.

---

# 58. TEST DE CONFIDENTIALITÉ

A tente d'accéder à une ressource appartenant à B.

Résultat :

```text
403 / ACCESS_DENIED
```

---

# 59. TEST DU SCORE FAIBLE

Créer un scénario artificiel avec :

```text
Global = 15
```

Vérifier :

- aucune formulation catastrophiste ;
- présence des divergences ;
- présence des priorités ;
- recommandations cohérentes.

---

# 60. TEST DU SCORE ÉLEVÉ

Créer :

```text
Global = 95
```

Vérifier :

- aucune promesse ;
- présence des différences restantes ;
- aucune formulation de couple parfait.

---

# 61. TEST D'UNE ZONE CRITIQUE

Créer :

```text
Global = 90
Parentalité = divergence majeure
```

Le rapport doit mettre la parentalité en évidence.

---

# 62. TEST D'UN ÉCART DE PERCEPTION

Créer :

```text
Score_A = 82
Score_B = 81
Perception_A = 5
Perception_B = 2
```

Le rapport doit détecter l'écart.

---

# 63. TEST D'UNE COMPLÉMENTARITÉ

Créer :

```text
A = très planificateur
B = très adaptable
```

Vérifier que le moteur peut identifier une différence potentiellement complémentaire sans la déclarer automatiquement positive.

---

# 64. TEST DES RESSOURCES

Chaque priorité doit pouvoir produire une recommandation valide.

Exemple :

```text
Priority = FINANCE/HIGH
↓
Resource_ID existant
```

---

# 65. TEST D'UNE ABSENCE DE RESSOURCE

Si aucune ressource pertinente n'existe :

> ne rien recommander artificiellement.

---

# 66. TEST DE PROFESSIONNEL

Un professionnel non vérifié ne doit pas apparaître comme recommandé.

---

# 67. TEST DES VERSIONS

Créer un rapport avec :

```text
TEST_VERSION 1.0
SCORING_VERSION 1.0
REPORT_ENGINE 1.0
```

Puis faire évoluer le moteur.

L'ancien rapport doit rester identifiable avec ses versions originales.

---

# 68. CRITÈRES DE VALIDATION DU SCORING

Le scoring doit être considéré comme prêt lorsque :

- [ ] toutes les questions ont une dimension ;
- [ ] toutes les dimensions ont un poids ;
- [ ] toutes les questions inversées sont identifiées ;
- [ ] toutes les dimensions sont normalisées ;
- [ ] le calcul est reproductible ;
- [ ] les scores extrêmes ont été testés ;
- [ ] les scores intermédiaires ont été testés ;
- [ ] les dimensions structurantes sont protégées.

---

# 69. CRITÈRES DE VALIDATION DU MATCHING

Le matching est prêt lorsque :

- [ ] chaque dimension peut être comparée ;
- [ ] les différences sont calculées ;
- [ ] les écarts de perception sont calculés ;
- [ ] les priorités sont calculées ;
- [ ] les cas particuliers sont gérés ;
- [ ] la complémentarité n'est pas confondue avec la compatibilité ;
- [ ] le score global ne masque pas les sujets critiques.

---

# 70. CRITÈRES DE VALIDATION DU RAPPORT

Le rapport est prêt lorsque :

- [ ] il utilise les résultats réels ;
- [ ] il ne répète pas les mêmes phrases ;
- [ ] il explique les différences ;
- [ ] il donne des actions ;
- [ ] il présente les forces ;
- [ ] il présente les priorités ;
- [ ] il respecte la confidentialité ;
- [ ] il n'établit aucun diagnostic ;
- [ ] il ne rend aucun verdict.

---

# 71. CRITÈRES DE VALIDATION COMMERCIALE

Les offres sont prêtes lorsque :

- [ ] Premium = 30 000 FCFA couple ;
- [ ] valeur Premium = 40 000 FCFA ;
- [ ] économie = 10 000 FCFA ;
- [ ] Premium+ = 50 000 FCFA couple ;
- [ ] valeur Premium+ = 60 000 FCFA ;
- [ ] économie = 10 000 FCFA ;
- [ ] la différence de valeur est claire ;
- [ ] les pages ne sont pas artificiellement gonflées.

---

# 72. CRITÈRES DE VALIDATION TECHNIQUE

Le MVP est prêt lorsque :

- [ ] création de compte ;
- [ ] création couple ;
- [ ] invitation ;
- [ ] rattachement ;
- [ ] paiement ;
- [ ] questionnaire ;
- [ ] sauvegarde ;
- [ ] verrouillage ;
- [ ] scoring ;
- [ ] matching ;
- [ ] génération ;
- [ ] livraison ;
- [ ] confidentialité.

---

# 73. CE QUI NE DOIT PAS ÊTRE DÉVELOPPÉ MAINTENANT

Pour éviter la dispersion, ne pas intégrer dans le MVP :

- application native ;
- réseau social ;
- chat couple ;
- visioconférence ;
- calendrier complexe ;
- abonnement ;
- marketplace complète ;
- intelligence artificielle conversationnelle ;
- gamification avancée ;
- programme thérapeutique automatisé.

Ces éléments pourront être envisagés après validation du produit principal.

---

# 74. ORDRE FINAL DE TRAVAIL

La construction doit maintenant suivre :

```text
ÉTAPE 1
Audit des questions

↓
ÉTAPE 2
Verrouillage scoring

↓
ÉTAPE 3
Verrouillage matching

↓
ÉTAPE 4
Validation des règles d'interprétation

↓
ÉTAPE 5
Validation des modèles de rapports

↓
ÉTAPE 6
Validation Premium / Premium+

↓
ÉTAPE 7
Développement du MVP

↓
ÉTAPE 8
Tests

↓
ÉTAPE 9
Rapports pilotes

↓
ÉTAPE 10
Ajustements

↓
LANCEMENT
```

---

# 75. LOT DE TESTS PILOTES

Avant lancement commercial, créer au minimum :

### Profil test 01

Couple très convergent.

### Profil test 02

Couple très divergent.

### Profil test 03

Couple avec fort écart de perception.

### Profil test 04

Couple avec score global élevé mais zone critique.

### Profil test 05

Couple avec différences complémentaires.

### Profil test 06

Couple fiancé.

### Profil test 07

Couple avec plusieurs priorités.

Ces sept cas doivent être utilisés comme jeux de données de référence.

---

# 76. COMPARAISON DES RAPPORTS PILOTES

Pour chaque cas, vérifier :

| Critère | Test |
|---|---|
| Personnalisation | Oui / Non |
| Cohérence avec scores | Oui / Non |
| Priorités pertinentes | Oui / Non |
| Ton neutre | Oui / Non |
| Actions utiles | Oui / Non |
| Ressources pertinentes | Oui / Non |
| Absence de verdict | Oui / Non |
| Absence de diagnostic | Oui / Non |
| Confidentialité | Oui / Non |
| Différenciation Premium/Premium+ | Oui / Non |

---

# 77. TEST HUMAIN

Le rapport ne doit pas être validé uniquement techniquement.

Au moins quelques lecteurs humains doivent pouvoir répondre :

> « Est-ce que cette analyse ressemble à quelque chose qui a réellement été produit à partir de mes réponses ? »

Si la réponse est non :

> le moteur doit être amélioré.

---

# 78. TEST DE COMPRÉHENSION

Une personne qui découvre le rapport doit comprendre :

- son score ;
- sa signification ;
- ses forces ;
- ses différences ;
- ses priorités ;
- ses prochaines actions.

Sans devoir lire une documentation technique.

---

# 79. TEST DE NON-ANXIÉTÉ

Après lecture, le rapport ne doit pas créer inutilement :

- peur ;
- honte ;
- culpabilité ;
- impression de condamnation.

Il doit favoriser :

- compréhension ;
- discussion ;
- préparation ;
- action.

---

# 80. TEST DE VALEUR

Question à poser :

> « Après avoir lu le rapport, avez-vous appris quelque chose d'utile sur votre couple que vous n'aviez pas clairement identifié auparavant ? »

Si la réponse est souvent non :

> le produit doit être retravaillé.

---

# 81. TEST DE VALEUR PREMIUM+

Question :

> « Le rapport vous donne-t-il réellement quelque chose à faire, et pas seulement quelque chose à savoir ? »

Si non :

> renforcer les exercices et la feuille de route.

---

# 82. RÈGLE DE QUALITÉ RÉDACTIONNELLE

Chaque paragraphe doit avoir une fonction.

Il doit :

- expliquer ;
- nuancer ;
- comparer ;
- prioriser ;
- proposer ;
- orienter.

Éviter les paragraphes qui répètent simplement le score.

---

# 83. RÈGLE DE PERSONNALISATION

Éviter :

> « La communication est importante dans un couple. »

Préférer :

> « Vos réponses indiquent que votre communication fonctionne plutôt bien dans les échanges ordinaires, mais que vos perceptions divergent lorsque les sujets deviennent conflictuels. »

---

# 84. RÈGLE DE CONCRET

Chaque priorité importante doit conduire à une action concrète.

Exemple :

```text
FINANCES
↓
Divergence importante
↓
Conversation
↓
3 règles financières
```

---

# 85. RÈGLE DE SOBRIÉTÉ

Si un couple n'a que deux priorités importantes :

> afficher deux priorités.

Ne pas en inventer cinq.

---

# 86. RÈGLE DE FORCE

Si un couple présente de nombreuses forces :

> les montrer.

Le rapport ne doit pas chercher artificiellement des problèmes pour justifier une vente.

---

# 87. RÈGLE COMMERCIALE FINALE

Le produit doit rester crédible même si le client n'achète aucune ressource complémentaire.

La recommandation commerciale vient :

```text
APRÈS LA VALEUR
```

et non :

```text
À LA PLACE DE LA VALEUR
```

---

# 88. DÉFINITION DU MVP FINAL

Le MVP doit permettre :

```text
A
↓
Compte
↓
Couple
↓
Code / lien
↓
B
↓
Compte
↓
Questionnaire A
+
Questionnaire B
↓
Paiement
↓
Scoring
↓
Matching
↓
Rapport
↓
Ressources
```

C'est suffisant pour une première version.

---

# 89. DÉFINITION DU PRODUIT V1 COMPLET

La V1 complète pourra ensuite ajouter :

- feuille de route Premium+ ;
- catalogue de sessions ;
- professionnels ;
- notifications ;
- tableau de bord avancé ;
- statistiques anonymisées ;
- amélioration continue du moteur.

---

# 90. RÈGLE D'ANALYSE DES DONNÉES APRÈS LANCEMENT

Les données agrégées pourront servir à observer :

- dimensions les plus divergentes ;
- questions peu discriminantes ;
- ressources les plus consultées ;
- taux de complétion ;
- taux d'abandon ;
- différence de satisfaction entre Premium et Premium+.

Toute analyse doit respecter la confidentialité et les règles applicables aux données personnelles.

---

# 91. INDICATEURS PRODUIT

Les premiers indicateurs utiles :

### Acquisition

- visites ;
- créations de compte ;
- couples créés.

### Activation

- partenaire invité ;
- partenaire rejoint ;
- questionnaire commencé.

### Complétion

- questionnaire A terminé ;
- questionnaire B terminé ;
- couple terminé.

### Conversion

- achat Premium ;
- achat Premium+.

### Valeur

- rapport consulté ;
- rapport téléchargé ;
- ressources consultées.

### Satisfaction

- satisfaction du rapport ;
- utilité perçue ;
- recommandation.

---

# 92. INDICATEURS DE QUALITÉ DU MOTEUR

À surveiller :

- nombre de rapports générés sans erreur ;
- nombre d'interprétations manquantes ;
- nombre de ressources sans correspondance ;
- nombre de priorités incohérentes ;
- nombre de rapports nécessitant correction manuelle.

---

# 93. INDICATEUR CRITIQUE

Un indicateur particulièrement important :

> **Pourcentage de rapports nécessitant une intervention humaine avant livraison.**

Objectif :

```text
MVP
↓
intervention humaine possible
↓
amélioration progressive
↓
automatisation croissante
```

Il ne faut pas chercher une automatisation parfaite avant d'avoir validé la qualité.

---

# 94. STRATÉGIE DE LANCEMENT

Phase pilote :

- petit nombre de couples ;
- observation des parcours ;
- contrôle manuel des rapports ;
- correction des règles.

Puis :

```text
PILOTE
↓
CORRECTION
↓
VERSION 1
↓
OPTIMISATION
```

---

# 95. CE QUI DOIT ÊTRE MANUEL AU DÉBUT

Il est acceptable de conserver temporairement :

- validation des rapports sensibles ;
- vérification des professionnels ;
- gestion des cas exceptionnels ;
- correction de certaines ressources ;
- contrôle qualité.

L'objectif initial est la qualité.

---

# 96. CE QUI DOIT ÊTRE AUTOMATISÉ DÈS LE DÉPART

Automatiser en priorité :

- création du couple ;
- invitation ;
- rattachement ;
- sauvegarde ;
- progression ;
- calcul ;
- matching ;
- génération standard ;
- notifications simples.

---

# 97. CE QUI DOIT ÊTRE PROTÉGÉ CONTRE L'AUTOMATISATION AVEUGLE

Ne pas laisser un moteur produire sans garde-fou :

- diagnostics ;
- conclusions de séparation ;
- conclusions de mariage ;
- accusations ;
- interprétations cliniques ;
- recommandations thérapeutiques spécifiques non validées.

---

# 98. VALIDATION FINALE AVANT DÉVELOPPEMENT

Le développement peut commencer lorsque les responsables ont validé :

```text
[ ] Questions
[ ] Dimensions
[ ] Scoring
[ ] Matching
[ ] Priorités
[ ] Interprétations
[ ] Rapports
[ ] Offres
[ ] Ressources
[ ] Parcours
[ ] Confidentialité
```

---

# 99. VERSION V1 À GELER

Une fois validée :

```text
PRODUCT_SPEC_VERSION = 1.0
```

Le développement doit utiliser cette version comme référence.

Toute modification importante doit être enregistrée comme :

```text
CHANGE_REQUEST
```

et non directement injectée dans le système sans traçabilité.

---

# 100. JOURNAL DES CHANGEMENTS

Structure recommandée :

```text
CHANGE_ID
DATE
DOCUMENT
SECTION
OLD_RULE
NEW_RULE
REASON
IMPACT
APPROVED_BY
VERSION
```

---

# 101. RÈGLE ANTI-DISPERSION

À partir de ce point :

> **Ne pas créer un nouveau document simplement parce qu'une nouvelle idée apparaît.**

Avant de créer un document :

1. vérifier si l'information appartient à l'un des sept documents ;
2. vérifier si elle appartient à ce document de consolidation ;
3. si oui, mettre à jour le document concerné ;
4. ne créer un nouveau document que si le nouveau sujet constitue réellement un module autonome.

---

# 102. DOCUMENTS QUI PEUVENT ÊTRE CRÉÉS PLUS TARD

Après validation, seuls quelques documents supplémentaires pourraient devenir nécessaires :

### 09 — Spécification technique

Lorsque la stack technique est définitivement choisie.

### 10 — Cahier de tests

Lorsque le développement commence.

### 11 — Guide d'administration

Si l'administration devient suffisamment complexe.

Ces documents ne sont pas nécessaires avant la consolidation du produit.

---

# 103. NE PAS CRÉER MAINTENANT

Il n'est pas nécessaire de créer séparément :

- un document sur le code ;
- un document sur les invitations ;
- un document sur les paiements ;
- un document sur les rapports ;
- un document sur les notifications.

Ces éléments sont déjà couverts par les documents existants.

---

# 104. ARCHITECTURE DOCUMENTAIRE RECOMMANDÉE

Le socle doit rester compact :

```text
01 — Cahier des charges
02 — Scoring / Matching
03 — Questions
04 — Interprétations
05 — Rapports
06 — Offres / Ressources
07 — Plateforme
08 — Consolidation / Validation
```

Puis seulement, si nécessaire :

```text
09 — Technique
10 — Tests
11 — Administration
```

---

# 105. CRITÈRE FINAL DE COHÉRENCE

Les huit documents doivent raconter la même histoire.

Si le document 03 dit :

> 120 questions

et le document 07 dit :

> 126 questions

il faut corriger.

Si le document 06 dit :

> Premium+ = 50 000 FCFA

et un autre document indique :

> 40 000 FCFA

il faut corriger.

Si le document 04 propose une interprétation que le scoring ne peut jamais produire :

> il faut corriger.

---

# 106. MATRICE DE COHÉRENCE

Avant développement, réaliser un contrôle :

| Élément | Doc. source | Docs. dépendants | Cohérent |
|---|---|---|---|
| Nombre de questions | 03 | 02, 07 | À vérifier |
| Dimensions | 02/03 | 04/05/07 | À vérifier |
| Scoring | 02 | 04/05/07 | À vérifier |
| Matching | 02 | 04/05/07 | À vérifier |
| Rapport Premium | 05/06 | 07 | À vérifier |
| Rapport Premium+ | 05/06 | 07 | À vérifier |
| Prix | 06 | 07 | À vérifier |
| Code couple | 07 | 01 | À vérifier |
| Ressources | 06 | 07 | À vérifier |

---

# 107. TEST DE CONSISTANCE DES PRIX

Valeurs de référence :

```text
PREMIUM
2 × 20 000 = 40 000
Prix couple = 30 000
Économie = 10 000

PREMIUM+
2 × 30 000 = 60 000
Prix couple = 50 000
Économie = 10 000
```

Ces valeurs doivent être identiques partout.

---

# 108. TEST DE CONSISTANCE DU COUPLE

Un couple possède exactement :

```text
1 Couple_ID
2 partenaires maximum
```

Jamais :

```text
3 partenaires
```

---

# 109. TEST DE CONSISTANCE DES RAPPORTS

Le système doit générer :

### Premium

```text
Analyse
```

### Premium+

```text
Analyse
+
Action
```

---

# 110. TEST DE CONSISTANCE DE LA PHILOSOPHIE

Tous les documents doivent respecter :

> **Le test aide à comprendre une dynamique ; il ne prédit pas l'avenir du couple.**

---

# 111. TEST DE CONSISTANCE ÉTHIQUE

Toutes les interfaces et tous les rapports doivent respecter :

- respect ;
- neutralité ;
- confidentialité ;
- prudence ;
- absence de diagnostic ;
- absence de verdict.

---

# 112. TEST DE CONSISTANCE COMMERCIALE

Toutes les communications doivent présenter :

```text
VALEUR
↓
PRIX
↓
ÉCONOMIE
↓
CONTENU
```

et non :

```text
PEUR
↓
PRESSION
↓
ACHAT
```

---

# 113. PHILOSOPHIE DU PRODUIT

Le Bilan Couple n'est pas conçu pour répondre :

> « Êtes-vous compatibles ? »

Il est conçu pour répondre à des questions plus utiles :

> « Sur quoi êtes-vous alignés ? »

> « Sur quoi êtes-vous différents ? »

> « Où ne vivez-vous pas la relation de la même manière ? »

> « Qu'est-ce qui mérite une conversation ? »

> « Qu'est-ce que chacun peut travailler ? »

> « Que pouvez-vous construire ensemble ? »

---

# 114. DÉFINITION FINALE DU PRODUIT

Le produit peut être défini ainsi :

> **Le Bilan Couple est une expérience d'analyse relationnelle à deux qui recueille séparément les perceptions et attentes de chaque partenaire, compare leurs profils, identifie leurs convergences, leurs différences et leurs écarts de perception, puis transforme ces résultats en recommandations concrètes et personnalisées.**

---

# 115. CRITÈRE DE RÉUSSITE ULTIME

Le produit est réussi si, après lecture, les deux partenaires peuvent dire :

> « Nous comprenons mieux ce qui nous rapproche. »

et :

> « Nous savons maintenant quels sujets nous devons vraiment travailler. »

---

# 116. FIN DU SOCLE V1

Les documents :

```text
01
02
03
04
05
06
07
08
```

constituent désormais le **socle documentaire V1 complet**.

La prochaine action logique n'est pas de créer encore une longue série de documents.

La prochaine action logique est de **reprendre les éléments critiques et de les verrouiller**, en priorité :

```text
QUESTIONS
↓
SCORING
↓
MATCHING
↓
INTERPRÉTATIONS
↓
RAPPORTS
```

Une fois cette chaîne validée, le projet pourra passer à la spécification technique puis au développement.

---

# 117. PRINCIPE DIRECTEUR FINAL

> **Construire moins de documents, mais faire en sorte que chaque document soit réellement exploitable.**

Le système doit rester :

**simple dans son parcours,**

**profond dans son analyse,**

**prudent dans ses conclusions,**

**personnalisé dans ses rapports,**

**et cohérent dans toute son architecture.**

**Fin du document.**
