# 23-1_REPORT_TEMPLATE_STRUCTURE.md

# KELIAA ALLIANCE
## Template Officiel du Rapport Personnalisé

**Version :** 1.0

---

# OBJECTIF

Ce document définit la structure officielle du Rapport Personnalisé KELIAA Alliance.

Le rapport est généré automatiquement après chaque évaluation réalisée par le membre.

Il est consultable :

- depuis le tableau de bord Alliance ;
- en version Web ;
- en version PDF téléchargeable.

Le rapport évolue automatiquement à mesure que le membre complète de nouvelles évaluations.

---

# PHILOSOPHIE DU RAPPORT

Le rapport n'est pas un relevé de notes.

C'est un document de progression.

Son objectif est d'aider le membre à :

- mieux se connaître ;
- comprendre ses forces ;
- identifier ses axes de progression ;
- préparer un mariage solide ;
- savoir quelles sont les prochaines étapes de son parcours.

Le ton reste toujours :

- bienveillant ;
- encourageant ;
- professionnel ;
- objectif ;
- concret.

---

# STRUCTURE GÉNÉRALE

Le rapport est composé de 10 grandes sections.

Chaque section possède des règles d'affichage spécifiques.

---

# SECTION 1 — COUVERTURE

## Objectif

Présenter le rapport.

## Contenu

- Logo KELIAA
- Logo Alliance
- Nom et prénom
- Photo (si disponible)
- Date de génération
- Version du rapport
- Niveau de complétude du rapport
- Nombre d'évaluations réalisées
- Bouton « Télécharger le PDF »

### Variables

```text
{{firstname}}
{{lastname}}
{{photo}}
{{report_date}}
{{completion_percentage}}
{{completed_tests}}
{{total_tests}}
```

---

# SECTION 2 — RÉSUMÉ PERSONNALISÉ

## Objectif

Donner une vue d'ensemble du profil.

Cette partie est entièrement rédigée par LIA.

Elle ne présente aucun score.

Elle résume :

- le fonctionnement général ;
- les principales qualités ;
- les principaux axes de progression ;
- la prochaine étape recommandée.

### Variable

```text
{{executive_summary}}
```

---

# SECTION 3 — VOTRE PORTRAIT RELATIONNEL

Cette section est la plus importante du rapport.

Elle est alimentée par plusieurs évaluations.

Elle décrit :

- la manière d'entrer en relation ;
- les comportements dominants ;
- les ressources naturelles ;
- les points de vigilance.

Si certaines évaluations sont absentes, LIA adapte simplement son niveau de précision.

### Variable

```text
{{relationship_profile}}
```

---

# SECTION 4 — VOS PRINCIPALES FORCES

Présentation sous forme de cartes.

Chaque carte contient :

- le nom de la force ;
- une explication ;
- l'impact positif dans une relation.

Maximum :

5 cartes.

Variables

```text
{{strength_1}}
{{strength_2}}
{{strength_3}}
{{strength_4}}
{{strength_5}}
```

---

# SECTION 5 — VOS AXES DE PROGRESSION

Même présentation.

Chaque carte contient :

- la compétence concernée ;
- pourquoi elle est importante ;
- un premier conseil pratique.

Maximum :

5 cartes.

Variables

```text
{{priority_1}}
{{priority_2}}
{{priority_3}}
{{priority_4}}
{{priority_5}}
```

---

# SECTION 6 — ANALYSES DÉTAILLÉES

Le rapport contient une analyse pour chaque évaluation réalisée.

Chaque chapitre suit exactement la même structure.

## Structure

### Résumé

### Analyse

### Ce que cela signifie concrètement

### Vos points forts

### Vos points de vigilance

### Conseils pratiques

### Prochaine étape

Chaque chapitre est indépendant.

---

## Chapitres possibles

- Personnalité relationnelle
- Communication
- Gestion des conflits
- Intelligence émotionnelle
- Valeurs
- Spiritualité
- Vision du mariage
- Projet de vie
- Gestion financière
- Famille

Une section n'apparaît que si le test correspondant a été réalisé.

---

# SECTION 7 — ANALYSES À DÉBLOQUER

Cette section est toujours visible.

Elle présente les évaluations non réalisées.

Chaque carte contient :

- une illustration ;
- le titre de l'évaluation ;
- ce qu'elle permettra de découvrir ;
- la durée estimée ;
- le bénéfice pour le rapport ;
- un bouton pour lancer l'évaluation.

Exemple :

---

🔒 Gestion financière

Découvrez votre manière de gérer :

- l'argent ;
- le budget ;
- les dépenses ;
- l'épargne ;
- les projets financiers du couple.

Durée estimée :

8 minutes.

Cette évaluation enrichira votre Rapport Personnalisé.

Bouton :

**Réaliser cette évaluation**

---

# SECTION 8 — VOS PROCHAINES ÉTAPES

Cette partie ne recommande jamais une ressource inexistante.

Elle peut proposer uniquement :

- approfondir une thématique ;
- réserver une séance de coaching personnalisé ;
- réaliser une nouvelle évaluation ;
- poursuivre son parcours de découverte.

Exemple :

**Communication**

Approfondissez les principes d'une communication constructive dans le couple.

---

**Coaching personnalisé**

Vous souhaitez aller plus loin ?

Réservez une séance de coaching afin d'échanger avec un accompagnateur sur votre situation personnelle.

Bouton :

**Réserver une séance**

Variable

```text
{{coaching_booking_url}}
```

---

# SECTION 9 — PROGRESSION DU RAPPORT

Cette partie montre au membre où il en est.

Afficher :

- pourcentage du rapport complété ;
- nombre d'évaluations réalisées ;
- nombre d'évaluations restantes ;
- prochaine évaluation recommandée.

Variables

```text
{{completion_percentage}}

{{completed_tests}}

{{remaining_tests}}

{{next_test}}
```

---

# SECTION 10 — MESSAGE DE CONCLUSION

Le rapport se termine par un message personnalisé.

Ce message :

- valorise les progrès réalisés ;
- encourage le membre ;
- rappelle que la préparation est un processus ;
- invite à poursuivre les évaluations restantes.

Il ne doit jamais culpabiliser.

Variable

```text
{{lia_conclusion}}
```

---

# RÈGLES D'AFFICHAGE

Une section est affichée uniquement lorsque les données nécessaires existent.

Les évaluations non réalisées apparaissent dans la section « Analyses à débloquer ».

Le rapport ne laisse jamais un espace vide.

Chaque nouvelle évaluation met automatiquement à jour :

- le résumé ;
- le portrait relationnel ;
- les forces ;
- les axes de progression ;
- les analyses ;
- la progression globale.

---

# EXPORT PDF

Le PDF reprend exactement :

- les mêmes sections ;
- les mêmes textes ;
- les mêmes illustrations ;
- les mêmes cartes ;
- le même ordre.

Le PDF est une copie fidèle de la version Web.

---

# PRINCIPE FONDAMENTAL

Le Rapport Personnalisé Alliance est un document évolutif.

Chaque évaluation complète une nouvelle partie du rapport.

Le membre ne consulte pas une simple série de résultats.

Il construit progressivement un dossier personnel qui l'aide à mieux se connaître, à grandir et à se préparer sereinement à son futur mariage.