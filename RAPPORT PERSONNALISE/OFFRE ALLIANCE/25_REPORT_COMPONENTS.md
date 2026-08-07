# 25_REPORT_COMPONENTS.md

# KELIAA ALLIANCE
## Bibliothèque des Composants du Rapport Personnalisé

**Version :** 1.0

---

# OBJECTIF

Ce document définit tous les composants graphiques utilisés dans le Rapport Personnalisé Alliance.

Chaque composant possède :

- un objectif ;
- un contenu précis ;
- des règles d'affichage ;
- des états possibles.

Tous les rapports utilisent ces mêmes composants.

Cela garantit une expérience cohérente sur la version Web et le PDF.

---

# RÈGLES GÉNÉRALES

Chaque composant doit être :

- élégant ;
- aéré ;
- facile à lire ;
- responsive ;
- compatible avec le PDF.

Les composants ne doivent jamais distraire le membre.

Ils servent à mettre en valeur les analyses.

---

# 1. HERO CARD

## Objectif

Présenter le rapport.

## Contenu

- Logo KELIAA
- Logo Alliance
- Nom du membre
- Photo (si disponible)
- Date
- Niveau de complétude
- Bouton Télécharger le PDF

---

# 2. SUMMARY CARD

## Objectif

Afficher le résumé personnalisé.

## Contenu

- titre ;
- résumé rédigé par LIA.

Aucun score.

---

# 3. PROFILE CARD

## Objectif

Présenter le portrait relationnel.

## Contenu

- titre ;
- texte personnalisé ;
- phrase clé.

Une seule grande carte.

---

# 4. STRENGTH CARD

## Objectif

Présenter une force.

## Contenu

- icône ;
- titre ;
- explication ;
- impact positif.

Maximum :

5 cartes.

---

# 5. PRIORITY CARD

## Objectif

Présenter un axe de progression.

## Contenu

- compétence ;
- pourquoi c'est important ;
- premier conseil.

Maximum :

5 cartes.

---

# 6. ANALYSIS CARD

Chaque chapitre utilise cette carte.

## Contenu

Résumé

Analyse

Points forts

Points de vigilance

Conseils

Prochaine étape

---

# 7. ADVICE CARD

Utilisée dans chaque analyse.

Contient :

- un conseil concret ;
- une action simple ;
- un objectif.

Maximum :

5 conseils par chapitre.

---

# 8. COACHING CARD

## Objectif

Inviter le membre à bénéficier d'un accompagnement.

Cette carte n'est affichée que lorsque cela est pertinent.

## Contenu

Titre

Pourquoi un coaching peut être utile.

Bouton

Réserver une séance.

Lien.

```text
{{coaching_booking_url}}
```

---

# 9. DISCOVERY CARD

Carte utilisée pour les évaluations non réalisées.

## Contenu

Illustration

Titre

Description

Ce que cette évaluation permettra de découvrir.

Durée estimée.

Bouton.

Réaliser cette évaluation.

---

# 10. NEXT STEP CARD

## Objectif

Présenter la prochaine étape recommandée.

Exemple.

Votre prochaine étape.

Vision du mariage.

Pourquoi ?

Deux lignes maximum.

Bouton.

Commencer.

---

# 11. PROGRESS CARD

## Objectif

Afficher la progression du rapport.

Contenu.

Pourcentage.

Nombre d'évaluations réalisées.

Nombre restant.

Prochaine étape.

---

# 12. THEME CARD

Carte utilisée dans les recommandations.

Objectif.

Suggérer un sujet à approfondir.

Exemple.

Communication dans le couple.

Description.

Deux ou trois lignes.

---

# 13. ACTION CARD

Utilisée dans le plan d'action.

Contenu.

Objectif.

Action.

Durée.

Résultat attendu.

---

# 14. CTA CARD

Carte d'appel à l'action.

Utilisée uniquement pour :

- coaching ;
- nouvelle évaluation.

Jamais pour vendre de manière agressive.

---

# 15. CONCLUSION CARD

Dernière carte du rapport.

Contient :

- le message personnalisé de LIA ;
- une phrase encourageante ;
- la prochaine étape.

---

# COMPOSANTS CONDITIONNELS

Les composants suivants apparaissent uniquement lorsque les conditions sont réunies.

---

## Carte Coaching

Condition.

Le membre présente un axe de progression important.

---

## Carte Découverte

Condition.

Une évaluation n'a pas encore été réalisée.

---

## Carte Prochaine étape

Condition.

Au moins une évaluation reste disponible.

---

# ÉTATS DES COMPOSANTS

Chaque composant peut être :

Disponible

Complété

À compléter

Mis à jour

Verrouillé

Les styles graphiques changent automatiquement.

---

# RÈGLES D'AFFICHAGE

Une carte ne doit jamais apparaître vide.

Si les données sont absentes :

la carte n'est pas affichée,

ou

elle est remplacée par une Discovery Card.

---

# RESPONSIVE

Desktop

Disposition sur plusieurs colonnes lorsque c'est pertinent.

Tablette

Deux colonnes.

Mobile

Une seule colonne.

Lecture verticale.

---

# EXPORT PDF

Toutes les cartes sont compatibles avec le PDF.

Aucune adaptation de contenu.

Uniquement des ajustements de mise en page.

---

# ACCESSIBILITÉ

Toutes les cartes doivent être :

- lisibles ;
- contrastées ;
- imprimables ;
- compréhensibles sans animation.

---

# ÉVOLUTIVITÉ

De nouveaux composants pourront être ajoutés sans modifier les composants existants.

Cette bibliothèque constitue la référence graphique officielle du Rapport Personnalisé Alliance.

---

# PRINCIPE FONDAMENTAL

Les composants ne sont pas de simples éléments visuels.

Ils structurent la lecture, mettent en valeur les informations importantes et rendent le Rapport Personnalisé Alliance agréable à consulter aussi bien sur écran qu'en version PDF.

Chaque composant doit servir un seul objectif : permettre au membre de comprendre facilement son profil, de retenir les informations essentielles et de savoir quelles sont ses prochaines étapes.