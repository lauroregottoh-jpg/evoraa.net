# 30_REPORT_TECHNICAL_SPECIFICATIONS.md

# KELIAA ALLIANCE
## Spécifications Techniques du Rapport Personnalisé

**Version :** 1.0

---

# OBJECTIF

Ce document définit les spécifications techniques nécessaires au développement du Rapport Personnalisé Alliance.

Il sert de référence aux développeurs afin que le rapport soit généré de manière fiable, rapide et évolutive.

Il complète les documents fonctionnels précédents.

---

# ARCHITECTURE GÉNÉRALE

Le rapport est généré automatiquement à partir des résultats des évaluations du membre.

Le processus suit toujours les étapes suivantes :

```text
Utilisateur
        │
        ▼
Évaluation réalisée
        │
        ▼
Calcul des scores
        │
        ▼
Enregistrement des résultats
        │
        ▼
LIA génère le rapport
        │
        ▼
Affichage Web
        │
        ▼
Export PDF
```

---

# DONNÉES D'ENTRÉE

Le moteur reçoit uniquement des données structurées.

Exemple :

```json
{
  "member": {
    "firstname": "Sarah",
    "lastname": "Doe",
    "gender": "female",
    "photo": null
  },

  "tests_completed": [
    "communication",
    "values",
    "spirituality"
  ],

  "scores": {
    "communication": 82,
    "values": 76,
    "spirituality": 91
  }
}
```

Aucun texte n'est saisi manuellement.

---

# DONNÉES DE SORTIE

Le moteur produit :

- le rapport Web ;
- le rapport PDF ;
- les statistiques de progression ;
- les recommandations ;
- les cartes d'évaluations restantes.

---

# IDENTIFIANTS DES ÉVALUATIONS

Chaque évaluation possède un identifiant unique.

Exemple :

```text
communication

conflict_management

emotional_intelligence

values

spirituality

marriage_vision

life_project

financial_management

family

personality
```

Ces identifiants ne changent jamais.

---

# VARIABLES UTILISÉES

Toutes les variables suivent le même format.

Exemple :

```text
{{firstname}}

{{completed_tests}}

{{completion_percentage}}

{{relationship_profile}}

{{strengths}}

{{priorities}}

{{recommendations}}

{{next_test}}

{{coaching_booking_url}}
```

Les noms doivent rester cohérents dans toute l'application.

---

# GÉNÉRATION CONDITIONNELLE

Une section est générée uniquement si les données nécessaires existent.

Sinon :

Afficher une carte de découverte.

Exemple :

```text
SI

communication terminée

ALORS

Afficher le chapitre Communication

SINON

Afficher la carte
"Réaliser cette évaluation"
```

---

# RÈGLES DE MISE À JOUR

Chaque nouvelle évaluation déclenche automatiquement :

- recalcul des scores globaux ;
- mise à jour du portrait relationnel ;
- mise à jour des forces ;
- mise à jour des axes de progression ;
- mise à jour des recommandations ;
- mise à jour de la progression ;
- régénération du PDF.

Aucune intervention manuelle.

---

# PERFORMANCE

Objectifs :

Affichage Web :

moins de 2 secondes.

Export PDF :

moins de 5 secondes.

Le rapport doit rester fluide même avec plusieurs milliers de membres.

---

# VERSIONNING

Chaque rapport possède :

- une date ;
- une version ;
- un historique.

Exemple :

```text
Version :

1.0

Date :

07 août 2026
```

À chaque évolution importante de l'algorithme, le numéro de version est incrémenté.

---

# HISTORIQUE

Le système conserve :

- la date de génération ;
- la version utilisée ;
- les évaluations disponibles à cette date.

Cela permet de régénérer un ancien rapport si nécessaire.

---

# EXPORT PDF

Le PDF doit être généré automatiquement à partir de la version Web.

Il ne doit pas exister deux templates différents.

Le HTML constitue la source unique.

---

# RESPONSIVE

Le rapport doit fonctionner sur :

- ordinateur ;
- tablette ;
- smartphone.

Le contenu reste identique.

Seule la mise en page change.

---

# GESTION DES ERREURS

Si une donnée est absente :

Le rapport continue d'être généré.

Seule la section concernée est remplacée par une carte informative.

Le rapport ne doit jamais être bloqué par une seule donnée manquante.

---

# JOURNALISATION

Chaque génération du rapport enregistre :

- l'identifiant du membre ;
- la date ;
- la durée de génération ;
- la version utilisée ;
- les éventuelles erreurs.

Ces informations facilitent le suivi technique.

---

# SÉCURITÉ

Le rapport contient des données personnelles.

Le système doit :

- limiter l'accès au propriétaire du compte ;
- sécuriser les téléchargements ;
- empêcher l'accès direct par URL non autorisée.

---

# ÉVOLUTIVITÉ

L'ajout d'une nouvelle évaluation ne doit pas nécessiter une refonte du moteur.

Le développeur doit uniquement :

1. Ajouter le nouvel identifiant.
2. Ajouter la bibliothèque correspondante.
3. Définir les règles de génération.
4. Créer la carte de découverte.

Le reste du système fonctionne sans modification.

---

# COMPATIBILITÉ

Le moteur doit être indépendant :

- du design ;
- du framework front-end ;
- du générateur PDF.

Les données produites doivent pouvoir être affichées par n'importe quelle interface compatible.

---

# CHECKLIST AVANT MISE EN PRODUCTION

Avant chaque mise en ligne, vérifier :

☐ Les variables sont correctement remplacées.

☐ Les évaluations terminées affichent leurs analyses.

☐ Les évaluations non réalisées affichent une carte de découverte.

☐ Les recommandations utilisent uniquement des ressources disponibles.

☐ Le lien de réservation du coaching fonctionne.

☐ Le PDF est identique à la version Web.

☐ Les performances respectent les objectifs.

☐ Les journaux de génération sont correctement enregistrés.

---

# PRINCIPE FONDAMENTAL

Le Rapport Personnalisé Alliance est un produit stratégique de KELIAA.

Son architecture technique doit être suffisamment robuste pour accompagner l'évolution de la plateforme pendant plusieurs années, tout en garantissant une expérience fluide, fiable et cohérente à chaque membre.