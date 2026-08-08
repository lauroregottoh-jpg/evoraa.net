# 08 --- PROTOCOLE DE VALIDATION, TESTS, QUALITÉ ET GARDE-FOUS

# KELYA COUPLE™

## Référence de contrôle avant mise en production

------------------------------------------------------------------------

# 1. OBJECTIF

Ce document définit comment vérifier que KELYA COUPLE fonctionne
correctement avant son lancement.

Il ne s'agit pas seulement de vérifier que les boutons fonctionnent.

Il faut vérifier simultanément :

-   la logique du couple ;
-   la qualité du questionnaire ;
-   la fiabilité du scoring ;
-   la cohérence du matching ;
-   la qualité des rapports ;
-   la distinction entre les offres ;
-   la sécurité ;
-   la confidentialité ;
-   l'expérience utilisateur ;
-   les téléchargements ;
-   les cas limites.

Le produit ne doit pas être considéré comme terminé parce que « le code
fonctionne ».

Il doit être considéré comme terminé lorsque **le résultat produit est
fiable, compréhensible, cohérent et sécurisé**.

------------------------------------------------------------------------

# 2. PRINCIPE CENTRAL

KELYA COUPLE est un système à plusieurs couches.

Il faut donc tester :

``` text
INTERFACE
↓
PARCOURS
↓
DONNÉES
↓
SCORING
↓
MATCHING
↓
INTERPRÉTATION
↓
RAPPORT
↓
ACTIONS
↓
TÉLÉCHARGEMENT
```

Une erreur dans une couche peut contaminer toutes les suivantes.

------------------------------------------------------------------------

# 3. ENVIRONNEMENTS DE TEST

Prévoir au minimum :

``` text
DEVELOPMENT
STAGING
PRODUCTION
```

Les tests complets doivent être réalisés en staging avant production.

Les données utilisées en développement et staging doivent être fictives.

------------------------------------------------------------------------

# 4. JEU DE DONNÉES DE TEST

Créer un jeu de couples fictifs suffisamment large.

Exemples :

``` text
Couple A — forte convergence
Couple B — convergence moyenne
Couple C — différences importantes
Couple D — score faible
Couple E — profils très différents
Couple F — réponses presque identiques
Couple G — cas limites
Couple H — données incomplètes
```

Ces données deviennent la base de référence du moteur.

------------------------------------------------------------------------

# 5. RÈGLE DE REPRODUCTIBILITÉ

À données identiques :

``` text
mêmes réponses
+
même version questionnaire
+
même version scoring
+
même version contenu
```

doit produire :

> **le même résultat logique.**

Le texte généré peut avoir des variations uniquement si le système
utilise volontairement une génération non déterministe contrôlée.

Même dans ce cas, les décisions fondamentales doivent rester identiques.

------------------------------------------------------------------------

# 6. TEST 01 --- ACHAT

Scénario :

``` text
Utilisateur
↓
Page KELYA COUPLE
↓
Choix offre
↓
Paiement
↓
Confirmation
↓
Création du couple
```

Vérifier :

-   paiement confirmé ;
-   commande enregistrée ;
-   bonne offre ;
-   bon prix ;
-   bonne devise ;
-   couple créé ;
-   utilisateur associé ;
-   accès activé.

------------------------------------------------------------------------

# 7. TEST 02 --- ACHETEUR = PARTICIPANT 1

Exemple :

> Sarah achète.

Vérifier :

``` text
Sarah = participant
Sarah = purchaser
```

Tout doit fonctionner.

------------------------------------------------------------------------

# 8. TEST 03 --- ACHETEUR = PARTICIPANT 2

Exemple :

> Thomas achète.

Vérifier que le système ne suppose jamais que l'acheteur est « la femme
», « l'homme », « A » ou « B ».

------------------------------------------------------------------------

# 9. TEST 04 --- INVITATION PAR LIEN

Scénario :

``` text
Sarah achète
↓
crée invitation
↓
copie lien
↓
Thomas ouvre
↓
Thomas rejoint
```

Vérifier :

-   lien valide ;
-   couple correct ;
-   deuxième place attribuée ;
-   invitation consommée ;
-   statut du couple mis à jour.

------------------------------------------------------------------------

# 10. TEST 05 --- INVITATION PAR CODE

Même scénario avec le code.

Vérifier :

-   code correct accepté ;
-   code incorrect refusé ;
-   code expiré refusé ;
-   code déjà utilisé refusé ;
-   troisième participant refusé.

------------------------------------------------------------------------

# 11. TEST 06 --- TROISIÈME PARTICIPANT

Scénario :

``` text
Sarah
+
Thomas
=
2 participants
```

Puis :

``` text
Laura tente de rejoindre
```

Résultat attendu :

> refus.

Le système ne doit jamais remplacer Thomas automatiquement.

------------------------------------------------------------------------

# 12. TEST 07 --- PARTENAIRE DÉJÀ CONNECTÉ

Tester le cas où l'invité possède déjà un compte KELYA.

Il doit pouvoir rejoindre le bilan sans créer inutilement un deuxième
compte.

------------------------------------------------------------------------

# 13. TEST 08 --- INVITÉ SANS COMPTE

Tester le cas où le partenaire ne possède pas encore de compte.

Le parcours doit permettre :

``` text
Invitation
↓
Création de compte
↓
Association
↓
Questionnaire
```

------------------------------------------------------------------------

# 14. TEST 09 --- INVITATION EXPIRÉE

Après expiration :

> le lien ne doit plus fonctionner.

Le système doit afficher une explication compréhensible.

------------------------------------------------------------------------

# 15. TEST 10 --- QUESTIONNAIRE

Vérifier :

-   affichage ;
-   progression ;
-   réponses ;
-   navigation ;
-   retour ;
-   sauvegarde ;
-   reprise ;
-   validation ;
-   fin.

------------------------------------------------------------------------

# 16. TEST 11 --- FERMETURE DU NAVIGATEUR

Scénario :

``` text
Question 28
↓
fermeture navigateur
↓
retour
```

Résultat attendu :

> reprise au bon endroit avec les réponses sauvegardées.

------------------------------------------------------------------------

# 17. TEST 12 --- PERTE DE CONNEXION

Scénario :

``` text
réponse
↓
coupure réseau
```

L'interface doit informer l'utilisateur.

Elle ne doit pas prétendre qu'une réponse a été enregistrée si elle ne
l'est pas.

------------------------------------------------------------------------

# 18. TEST 13 --- DOUBLE CLIC

Tester :

``` text
Continuer
Continuer
```

rapidement.

Il ne doit pas :

-   doubler une réponse ;
-   créer deux événements ;
-   créer deux rapports ;
-   créer deux exercices.

------------------------------------------------------------------------

# 19. TEST 14 --- QUESTIONNAIRE INCOMPLET

Si une question obligatoire manque :

> empêcher la soumission finale.

Afficher clairement ce qui manque.

------------------------------------------------------------------------

# 20. TEST 15 --- QUESTIONNAIRE COMPLET

Lorsque toutes les réponses obligatoires sont présentes :

``` text
completed = true
```

et seulement à ce moment.

------------------------------------------------------------------------

# 21. TEST 16 --- DEUX QUESTIONNAIRES

Vérifier que l'analyse ne démarre pas lorsque :

``` text
participant 1 = completed
participant 2 = incomplete
```

------------------------------------------------------------------------

# 22. TEST 17 --- DÉCLENCHEMENT DE L'ANALYSE

Lorsque les deux sont terminés :

``` text
A completed
+
B completed
=
analysis eligible
```

Le système lance alors l'analyse.

------------------------------------------------------------------------

# 23. TEST 18 --- SCORE

Tester les calculs avec des données dont le résultat attendu est connu.

Le moteur doit être capable de produire :

-   scores individuels ;
-   scores dimensionnels ;
-   score de convergence ;
-   écarts ;
-   priorités.

------------------------------------------------------------------------

# 24. TEST 19 --- SCORE TRÈS ÉLEVÉ

Créer un couple fictif avec une très forte convergence.

Vérifier que le rapport ne dit pas :

> « Vous n'aurez aucun problème. »

Il doit conserver une interprétation nuancée.

------------------------------------------------------------------------

# 25. TEST 20 --- SCORE MOYEN

Le rapport doit expliquer :

-   ce qui fonctionne ;
-   ce qui demande de l'attention ;
-   pourquoi ;
-   quoi faire.

------------------------------------------------------------------------

# 26. TEST 21 --- SCORE FAIBLE

Créer volontairement un résultat autour de :

> **15 %**

Le système doit impérativement éviter :

> « Vous êtes incompatibles. »

Le résultat doit plutôt dire, selon les données :

> « Vos réponses montrent des différences importantes sur plusieurs
> dimensions. Ce résultat ne constitue pas un verdict sur votre capacité
> à construire une relation. Il indique surtout les sujets qui méritent
> une attention particulière et des conversations approfondies. »

------------------------------------------------------------------------

# 27. TEST 22 --- SCORES IDENTIQUES MAIS PROFILS DIFFÉRENTS

Créer deux couples avec un score global similaire mais des dimensions
différentes.

Les rapports doivent être différents.

Cela vérifie que le système ne génère pas un texte uniquement à partir
du score global.

------------------------------------------------------------------------

# 28. TEST 23 --- MÊME SCORE, DIFFÉRENTES PRIORITÉS

Deux couples ayant :

``` text
72/100
```

ne doivent pas nécessairement recevoir les mêmes recommandations.

Le moteur doit utiliser les dimensions sous-jacentes.

------------------------------------------------------------------------

# 29. TEST 24 --- PROFILS INDIVIDUELS

Vérifier que les rapports distinguent :

``` text
Profil participant 1
Profil participant 2
Dynamique commune
```

------------------------------------------------------------------------

# 30. TEST 25 --- DIFFÉRENCE IMPORTANTE

Lorsqu'une dimension montre une forte divergence :

Le rapport doit :

1.  identifier la dimension ;
2.  expliquer la divergence ;
3.  éviter de blâmer ;
4.  expliquer le risque potentiel ;
5.  proposer une conversation ;
6.  proposer un exercice ;
7.  proposer une action concrète.

------------------------------------------------------------------------

# 31. TEST 26 --- FORTE CONVERGENCE

Une forte convergence doit être valorisée sans être exagérée.

Exemple :

> « Cette convergence constitue une ressource sur laquelle vous pouvez
> vous appuyer. »

Puis :

> « Veillez toutefois à ne pas supposer que vous vous comprenez
> automatiquement sur les autres sujets. »

------------------------------------------------------------------------

# 32. TEST 27 --- CONTRADICTION

Si les données montrent des contradictions importantes, le système doit
les détecter.

Ne pas produire simultanément :

> « Vous communiquez très facilement »

et :

> « Votre communication est votre principale difficulté »

sans explication.

------------------------------------------------------------------------

# 33. TEST 28 --- DONNÉES INSUFFISANTES

Si le système manque d'informations pour tirer une conclusion :

> il doit réduire le niveau de certitude.

Ne pas inventer.

Préférer :

> « Les réponses disponibles suggèrent... »

à :

> « Vous êtes définitivement... »

------------------------------------------------------------------------

# 34. TEST 29 --- RÈGLE DE NON-DIAGNOSTIC

Le système ne doit pas poser :

-   diagnostic psychiatrique ;
-   diagnostic clinique ;
-   diagnostic de personnalité ;
-   diagnostic médical.

Il peut décrire des tendances observées dans le questionnaire.

------------------------------------------------------------------------

# 35. TEST 30 --- RÈGLE DE NON-PRÉDICTION

Ne pas produire :

> « Vous allez divorcer. »

ou :

> « Vous serez heureux pendant 20 ans. »

Le bilan n'est pas un outil de prédiction de l'avenir.

------------------------------------------------------------------------

# 36. TEST 31 --- RELATION ABUSIVE / DANGER

Si les réponses font apparaître des signaux préoccupants, le système
doit éviter de transformer cela en simple exercice de communication.

Le rapport doit pouvoir orienter vers :

-   sécurité ;
-   soutien professionnel ;
-   ressources appropriées ;
-   aide spécialisée lorsque nécessaire.

------------------------------------------------------------------------

# 37. TEST 32 --- CONFIDENTIALITÉ

Participant A ne doit pas pouvoir accéder aux réponses brutes de B.

Tester :

``` text
API
URL
frontend
download
browser storage
```

------------------------------------------------------------------------

# 38. TEST 33 --- ACCÈS À UN AUTRE COUPLE

Modifier artificiellement :

``` text
couple_id
```

dans une requête.

Résultat attendu :

> accès refusé.

------------------------------------------------------------------------

# 39. TEST 34 --- ACCÈS À UN AUTRE RAPPORT

Modifier :

``` text
report_id
```

Résultat attendu :

> accès refusé.

------------------------------------------------------------------------

# 40. TEST 35 --- TOKEN

Tester :

-   token valide ;
-   token invalide ;
-   token expiré ;
-   token réutilisé ;
-   token modifié.

------------------------------------------------------------------------

# 41. TEST 36 --- TÉLÉCHARGEMENT

Vérifier que seuls les participants autorisés peuvent télécharger.

------------------------------------------------------------------------

# 42. TEST 37 --- EXPIRATION

Simuler :

``` text
access_expires_at < now
```

Vérifier :

-   blocage de l'espace interactif ;
-   comportement du rapport ;
-   comportement des téléchargements selon la politique ;
-   message utilisateur ;
-   conservation interne selon les règles.

------------------------------------------------------------------------

# 43. TEST 38 --- ESSENTIEL

Vérifier que l'offre Essentiel reçoit :

-   toutes les sections prévues ;
-   le rapport complet Essentiel ;
-   les exercices prévus ;
-   le plan d'action prévu ;
-   les ressources prévues.

------------------------------------------------------------------------

# 44. TEST 39 --- PREMIUM PLUS

Vérifier que Premium Plus reçoit :

``` text
TOUT ESSENTIEL
+
AJOUTS PREMIUM PLUS
```

Le test doit explicitement comparer les deux structures.

------------------------------------------------------------------------

# 45. TEST 40 --- ABSENCE DE DUPLICATION

Vérifier que Premium Plus ne génère pas deux fois :

-   introduction ;
-   synthèse ;
-   conclusion ;
-   recommandations communes.

Il doit enrichir l'expérience.

------------------------------------------------------------------------

# 46. TEST 41 --- CONCLUSION

Chaque rapport doit contenir une conclusion réellement rédigée.

La conclusion doit :

-   synthétiser ;
-   contextualiser ;
-   redonner de l'espoir sans promettre ;
-   identifier les prochaines étapes ;
-   orienter vers les ressources pertinentes.

------------------------------------------------------------------------

# 47. TEST 42 --- EXERCICES

Chaque exercice doit être complet.

Il doit contenir :

``` text
objectif
durée
consignes
questions
espace de réponse
débrief
prochaine action
```

Une simple ligne :

> « Faites cet exercice »

est insuffisante.

------------------------------------------------------------------------

# 48. TEST 43 --- PLAN D'ACTION

Un plan d'action doit proposer des actions concrètes.

Éviter :

> « Améliorez votre communication. »

Préférer :

> « Cette semaine, consacrez 30 minutes à une conversation structurée
> sur votre manière respective de gérer les désaccords. Utilisez les
> trois questions proposées ci-dessous... »

------------------------------------------------------------------------

# 49. TEST 44 --- RECOMMANDATIONS

Chaque recommandation doit être :

-   personnalisée ;
-   concrète ;
-   réalisable ;
-   bienveillante ;
-   non culpabilisante.

------------------------------------------------------------------------

# 50. TEST 45 --- ESPACES D'ÉCRITURE

Pour les exercices imprimables, vérifier qu'il existe suffisamment
d'espace pour écrire.

Ne pas créer une page saturée de texte.

------------------------------------------------------------------------

# 51. TEST 46 --- RAPPORT LONG

Tester un rapport de grande taille.

Vérifier :

-   pagination ;
-   titres ;
-   sauts de page ;
-   tableaux ;
-   graphiques ;
-   espaces d'écriture ;
-   couverture ;
-   sommaire.

------------------------------------------------------------------------

# 52. TEST 47 --- RAPPORT MOBILE

Vérifier la lecture sur smartphone.

Les paragraphes doivent rester lisibles.

------------------------------------------------------------------------

# 53. TEST 48 --- RAPPORT IMPRIMABLE

Tester l'impression.

Vérifier :

-   marges ;
-   contraste ;
-   coupures ;
-   tableaux ;
-   pagination ;
-   espaces d'écriture.

------------------------------------------------------------------------

# 54. TEST 49 --- TÉLÉCHARGEMENT GLOBAL

Tester :

> Télécharger mon dossier.

Vérifier que tous les documents autorisés sont présents.

------------------------------------------------------------------------

# 55. TEST 50 --- NOM DES FICHIERS

Les noms doivent être :

-   lisibles ;
-   propres ;
-   cohérents ;
-   sans caractères problématiques.

------------------------------------------------------------------------

# 56. TEST 51 --- GOOGLE DRIVE

Si l'intégration est activée :

``` text
connect
↓
authorize
↓
upload
↓
confirm
```

Tester également :

> utilisateur refuse l'autorisation.

Le service doit continuer à fonctionner avec le téléchargement local.

------------------------------------------------------------------------

# 57. TEST 52 --- NOTIFICATIONS

Tester :

-   achat ;
-   invitation ;
-   partenaire rejoint ;
-   questionnaire terminé ;
-   rapport disponible ;
-   expiration.

------------------------------------------------------------------------

# 58. TEST 53 --- NOTIFICATIONS DUPLIQUÉES

Un même événement ne doit pas envoyer plusieurs fois le même message à
cause d'un retry.

------------------------------------------------------------------------

# 59. TEST 54 --- PERFORMANCE

Mesurer :

-   chargement ;
-   sauvegarde ;
-   navigation ;
-   calcul ;
-   génération ;
-   téléchargement.

Les seuils exacts doivent être définis selon l'infrastructure réelle.

------------------------------------------------------------------------

# 60. TEST 55 --- MOBILE

Tester au minimum :

-   petit smartphone ;
-   smartphone standard ;
-   tablette ;
-   desktop.

------------------------------------------------------------------------

# 61. TEST 56 --- ACCESSIBILITÉ

Tester :

-   navigation clavier ;
-   lecteurs d'écran ;
-   contraste ;
-   taille des boutons ;
-   labels ;
-   messages d'erreur ;
-   focus.

------------------------------------------------------------------------

# 62. TEST 57 --- LANGAGE

Le rapport doit être :

-   naturel ;
-   humain ;
-   professionnel ;
-   bienveillant ;
-   clair.

Il ne doit pas ressembler à une fiche technique.

------------------------------------------------------------------------

# 63. TEST 58 --- ANTI-JARGON

Éviter les termes inutiles comme :

> « score multidimensionnel corrélé »

si une formulation simple est possible.

------------------------------------------------------------------------

# 64. TEST 59 --- ANTI-IA

Le contenu ne doit pas être rempli de formulations répétitives telles
que :

> « Il est important de noter que... »

> « Dans un monde où... »

> « Cela souligne l'importance de... »

Le moteur doit varier naturellement les formulations.

------------------------------------------------------------------------

# 65. TEST 60 --- PARAGRAPHES

Le rapport doit privilégier de vrais paragraphes.

Éviter :

``` text
Phrase.

Phrase.

Phrase.

Phrase.
```

à répétition.

Les paragraphes doivent être suffisamment développés.

------------------------------------------------------------------------

# 66. TEST 61 --- AÉRATION

Aérer le document sans transformer chaque phrase en ligne indépendante.

Utiliser :

-   paragraphes ;
-   sous-titres ;
-   encadrés ;
-   tableaux lorsque réellement utiles ;
-   espaces blancs.

------------------------------------------------------------------------

# 67. TEST 62 --- TON

Le système doit éviter :

-   jugement ;
-   culpabilisation ;
-   dramatisation ;
-   promesses absolues ;
-   diagnostic ;
-   injonctions brutales.

Il doit rester :

> clair + humain + direct + respectueux.

------------------------------------------------------------------------

# 68. TEST 63 --- SCORE COMME INDICATEUR

Chaque score doit être accompagné d'une explication.

Un nombre seul est insuffisant.

------------------------------------------------------------------------

# 69. TEST 64 --- FAIBLE COMPATIBILITÉ

Tester plusieurs scores faibles.

Le texte doit rester constructif.

Le système doit identifier :

-   différences ;
-   sujets à clarifier ;
-   ressources ;
-   actions possibles.

------------------------------------------------------------------------

# 70. TEST 65 --- FORTE COMPATIBILITÉ

Tester plusieurs scores élevés.

Le système doit éviter :

> « Vous êtes parfaitement compatibles. »

Il doit rappeler que les habitudes, les événements et les choix futurs
peuvent faire évoluer une relation.

------------------------------------------------------------------------

# 71. TEST 66 --- CONTRAIREMENT AU SCORE GLOBAL

Tester un couple avec :

``` text
score global élevé
mais
une dimension critique
```

Le rapport doit signaler cette dimension.

------------------------------------------------------------------------

# 72. TEST 67 --- DIMENSION FORTE MAIS SCORE GLOBAL MOYEN

Le rapport doit aussi valoriser cette force.

Ne pas laisser le score global écraser toute l'analyse.

------------------------------------------------------------------------

# 73. TEST 68 --- OFFRE PREMIUM PLUS

Vérifier la présence des éléments avancés prévus :

-   analyse approfondie ;
-   scénarios ;
-   protocoles ;
-   charte relationnelle ;
-   plan étendu ;
-   fiches pratiques ;
-   ressources avancées.

Chaque élément doit être développé, pas seulement nommé.

------------------------------------------------------------------------

# 74. TEST 69 --- VERSIONNAGE PREMIUM PLUS

Si la structure Premium Plus évolue, les anciens rapports doivent
conserver leur version.

------------------------------------------------------------------------

# 75. TEST 70 --- CONTENU OBSOLÈTE

Un ancien rapport ne doit pas changer automatiquement lorsqu'un contenu
est modifié.

------------------------------------------------------------------------

# 76. TEST 71 --- GÉNÉRATION PARTIELLE

Si une section ne peut pas être générée correctement :

> ne pas publier silencieusement un rapport incomplet.

Le système doit :

-   signaler l'erreur ;
-   conserver le statut non prêt ;
-   journaliser ;
-   permettre une nouvelle génération.

------------------------------------------------------------------------

# 77. TEST 72 --- ABSENCE DE DONNÉES

Si une donnée manque :

> ne pas inventer.

Le moteur doit utiliser une formulation prudente ou omettre la
conclusion lorsque cela est nécessaire.

------------------------------------------------------------------------

# 78. TEST 73 --- COHÉRENCE INTERNE

Scanner le rapport pour détecter :

-   contradictions ;
-   noms incorrects ;
-   mauvais pronoms ;
-   mauvais plan ;
-   mauvais score ;
-   mauvais partenaire ;
-   sections manquantes.

------------------------------------------------------------------------

# 79. TEST 74 --- IDENTITÉ DES PARTENAIRES

Vérifier que :

``` text
Sarah
```

ne devient jamais :

``` text
Sara
```

ou un autre prénom.

------------------------------------------------------------------------

# 80. TEST 75 --- OFFRE

Vérifier qu'un rapport Essentiel ne contient pas accidentellement des
éléments Premium Plus.

Inversement, vérifier que Premium Plus contient bien tout Essentiel.

------------------------------------------------------------------------

# 81. TEST 76 --- DATES

Vérifier :

-   date d'achat ;
-   date du bilan ;
-   date de génération ;
-   expiration.

Ne pas utiliser une date incorrecte provenant d'un template.

------------------------------------------------------------------------

# 82. TEST 77 --- RÉFÉRENCE DU COUPLE

Vérifier que la bonne référence est utilisée partout.

------------------------------------------------------------------------

# 83. TEST 78 --- MULTI-APPAREILS

Scénario :

``` text
Sarah téléphone
Thomas ordinateur
```

Les deux doivent pouvoir avancer sans conflit.

------------------------------------------------------------------------

# 84. TEST 79 --- CONCURRENCE

Tester :

``` text
Sarah répond
+
Thomas répond
```

simultanément.

Les réponses doivent rester correctement associées.

------------------------------------------------------------------------

# 85. TEST 80 --- DOUBLE SESSION

Tester un même utilisateur connecté sur deux appareils.

Le système doit gérer correctement les sauvegardes et sessions.

------------------------------------------------------------------------

# 86. TEST 81 --- RAPPORT PENDANT UNE ACTUALISATION

Pendant la génération, actualiser la page.

L'état doit rester cohérent.

------------------------------------------------------------------------

# 87. TEST 82 --- RETRY DE GÉNÉRATION

Simuler une erreur temporaire.

Vérifier que le système réessaie sans créer plusieurs rapports
incohérents.

------------------------------------------------------------------------

# 88. TEST 83 --- PAIEMENT EN DOUBLE

Simuler deux notifications de paiement identiques.

Le système doit être idempotent.

Il ne doit pas créer deux couples pour une seule commande.

------------------------------------------------------------------------

# 89. TEST 84 --- WEBHOOK

Les événements de paiement externes doivent être vérifiés et non
acceptés aveuglément.

------------------------------------------------------------------------

# 90. TEST 85 --- AUTORISATION

Toute modification sensible doit être contrôlée côté serveur.

------------------------------------------------------------------------

# 91. TEST 86 --- INJECTION

Tester les champs texte contre les injections pertinentes pour la stack
utilisée.

------------------------------------------------------------------------

# 92. TEST 87 --- XSS

Les noms et autres champs utilisateur doivent être correctement
échappés.

------------------------------------------------------------------------

# 93. TEST 88 --- ACCÈS DIRECT

Tester l'accès direct à toutes les routes privées sans session.

Résultat attendu :

> authentification requise.

------------------------------------------------------------------------

# 94. TEST 89 --- ACCÈS APRÈS EXPIRATION

Tester toutes les routes privées après expiration.

Chaque route doit appliquer la règle correspondante.

------------------------------------------------------------------------

# 95. TEST 90 --- ADMIN

Vérifier que les fonctions administratives ne sont pas accessibles à un
utilisateur standard.

------------------------------------------------------------------------

# 96. TEST 91 --- RAPPORTS SENSIBLES

Tester que les fichiers privés ne sont pas indexables publiquement.

------------------------------------------------------------------------

# 97. TEST 92 --- SUPPRESSION

Tester les scénarios de suppression prévus par la politique.

Vérifier que les éléments supprimables le sont réellement et que les
éléments devant être conservés le restent conformément aux règles
applicables.

------------------------------------------------------------------------

# 98. TEST 93 --- EXPORT

Vérifier que l'export contient uniquement les données auxquelles
l'utilisateur a droit.

------------------------------------------------------------------------

# 99. TEST 94 --- JOURNAUX

Vérifier que les logs ne contiennent pas :

-   réponses brutes ;
-   mots de passe ;
-   tokens ;
-   informations sensibles inutiles.

------------------------------------------------------------------------

# 100. TEST 95 --- RAPPORT DE RÉFÉRENCE

Créer un rapport de référence entièrement validé.

Le conserver comme :

> **Golden Report**

Il servira de comparaison lors des futures modifications du moteur.

------------------------------------------------------------------------

# 101. GOLDEN DATASET

Créer plusieurs datasets de référence.

Chaque dataset doit avoir :

``` text
inputs
expected scoring
expected priorities
expected sections
expected offer
```

------------------------------------------------------------------------

# 102. TEST DE NON-RÉGRESSION

À chaque modification du moteur :

``` text
nouveau résultat
VS
résultat de référence
```

Comparer.

Une variation importante doit être expliquée et validée.

------------------------------------------------------------------------

# 103. TEST DE CONTENU

Vérifier automatiquement la présence de :

-   titre ;
-   introduction ;
-   synthèse ;
-   analyse ;
-   recommandations ;
-   exercices ;
-   conclusion.

------------------------------------------------------------------------

# 104. TEST DE LONGUEUR

La longueur du rapport doit rester dans les fourchettes définies pour
chaque offre.

Une variation importante doit être signalée.

------------------------------------------------------------------------

# 105. TEST DE DENSITÉ

Le rapport ne doit pas être :

> trop court pour être utile ;

ni :

> inutilement long parce que le moteur répète les mêmes idées.

------------------------------------------------------------------------

# 106. TEST DE RÉPÉTITION

Détecter les paragraphes ou formulations fortement similaires dans une
même section.

Le moteur doit éviter la répétition artificielle.

------------------------------------------------------------------------

# 107. TEST DES RECOMMANDATIONS

Chaque recommandation doit être reliée à au moins une observation réelle
issue du bilan.

Éviter les recommandations génériques sans rapport avec les résultats.

------------------------------------------------------------------------

# 108. TEST DES EXERCICES

Chaque exercice doit être relié à :

``` text
une priorité
ou
une dimension
ou
une dynamique identifiée
```

------------------------------------------------------------------------

# 109. TEST DU PLAN D'ACTION

Le plan doit avoir :

-   objectif ;
-   actions ;
-   ordre ;
-   rythme ;
-   indicateur simple de progression.

------------------------------------------------------------------------

# 110. TEST DES RESSOURCES

Les ressources proposées doivent être pertinentes par rapport au besoin
identifié.

------------------------------------------------------------------------

# 111. ORIENTATION VERS PROFESSIONNEL

Lorsque pertinent, le rapport peut proposer :

-   thérapeute ;
-   psychologue ;
-   coach ;
-   conseiller conjugal ;
-   autre professionnel qualifié.

Le système ne doit pas présenter KELYA comme substitut automatique à un
accompagnement clinique.

------------------------------------------------------------------------

# 112. TEST D'ORIENTATION

Une orientation doit être :

-   contextualisée ;
-   non alarmiste ;
-   claire ;
-   proportionnée.

------------------------------------------------------------------------

# 113. TEST DES CONCLUSIONS

Chaque grand chapitre doit pouvoir avoir une conclusion lorsque la
structure le prévoit.

La conclusion doit réellement synthétiser le chapitre.

------------------------------------------------------------------------

# 114. TEST FINAL DU RAPPORT

Avant publication :

``` text
IDENTITÉ
✓

SCORES
✓

COHÉRENCE
✓

STRUCTURE
✓

CONTENU
✓

EXERCICES
✓

ACTIONS
✓

CONCLUSION
✓

OFFRE
✓

SÉCURITÉ
✓
```

------------------------------------------------------------------------

# 115. CHECKLIST QA AUTOMATIQUE

Le moteur doit pouvoir vérifier automatiquement :

``` text
required_sections_present
participant_names_valid
plan_valid
scores_valid
report_version_valid
content_version_valid
no_missing_placeholders
no_internal_debug_text
no_unresolved_variables
no_empty_sections
no_duplicate_sections
```

------------------------------------------------------------------------

# 116. CHECKLIST QA HUMAINE

Une validation humaine doit également vérifier :

-   naturel du texte ;
-   cohérence émotionnelle ;
-   pertinence ;
-   absence de jugement ;
-   qualité des recommandations ;
-   qualité des exercices ;
-   qualité de la conclusion ;
-   lisibilité.

------------------------------------------------------------------------

# 117. VALIDATION DES CAS EXTRÊMES

Tester volontairement :

-   score très faible ;
-   score très élevé ;
-   différences extrêmes ;
-   convergence extrême ;
-   réponses presque toutes identiques ;
-   réponses très dispersées ;
-   questionnaire incomplet ;
-   partenaire absent ;
-   invitation expirée.

------------------------------------------------------------------------

# 118. RÈGLE « NE PAS FAIRE PEUR »

Un résultat difficile ne doit jamais produire une interface
catastrophiste.

Éviter :

> rouge partout ;

> « ALERTE » ;

> « DANGER POUR VOTRE COUPLE ».

Le produit doit rester responsable.

------------------------------------------------------------------------

# 119. RÈGLE « NE PAS RASSURER À TORT »

À l'inverse, un résultat élevé ne doit pas produire :

> « Tout va bien, vous n'avez rien à travailler. »

Le produit doit rester nuancé.

------------------------------------------------------------------------

# 120. RÈGLE « NE PAS DÉCIDER À LA PLACE DU COUPLE »

Le système peut dire :

> « Cette différence mérite d'être discutée. »

Il ne doit pas dire :

> « Vous devez vous séparer. »

ou :

> « Vous devez vous marier. »

------------------------------------------------------------------------

# 121. RÈGLE « NE PAS DIAGNOSTIQUER »

Le moteur peut observer :

> « Vos réponses suggèrent une tendance à éviter les conversations
> difficiles. »

Il ne doit pas écrire :

> « Vous avez un trouble d'évitement. »

------------------------------------------------------------------------

# 122. RÈGLE « NE PAS INVENTER »

Si l'information n'est pas disponible :

> ne pas fabriquer une histoire.

Cette règle est prioritaire.

------------------------------------------------------------------------

# 123. RÈGLE « NE PAS SURINTERPRÉTER »

Une réponse isolée ne doit pas suffire à tirer une conclusion majeure,
sauf règle méthodologique explicitement définie et validée.

------------------------------------------------------------------------

# 124. RÈGLE « CONTEXTUALISER »

Une observation doit être interprétée avec :

-   dimension ;
-   réponses pertinentes ;
-   profil ;
-   dynamique du couple ;
-   autres résultats.

------------------------------------------------------------------------

# 125. RÈGLE « CONSTRUIRE »

Chaque difficulté identifiée doit, lorsque pertinent, déboucher sur :

``` text
COMPRENDRE
↓
NOMMER
↓
DISCUTER
↓
EXPÉRIMENTER
↓
RÉÉVALUER
```

------------------------------------------------------------------------

# 126. RÈGLE « PRIORISER »

Ne pas donner 25 actions simultanément.

Le rapport doit identifier :

> quelques priorités réellement importantes.

------------------------------------------------------------------------

# 127. RÈGLE « FAISABLE »

Les actions doivent être réalisables dans la vraie vie.

Éviter :

> « Faites une transformation complète de votre communication. »

Préférer :

> « Cette semaine, prenez 20 minutes pour répondre séparément à trois
> questions, puis partagez vos réponses sans chercher immédiatement à
> les corriger. »

------------------------------------------------------------------------

# 128. RÈGLE « PROGRESSION »

Le couple doit savoir :

> ce qu'il peut faire maintenant.

Puis :

> ce qu'il pourra faire ensuite.

------------------------------------------------------------------------

# 129. TEST DU PLAN SUR 7 JOURS

Le rapport doit pouvoir produire un premier petit plan d'action
immédiatement applicable.

------------------------------------------------------------------------

# 130. TEST DU PLAN SUR PLUSIEURS SEMAINES

Premium Plus peut proposer un plan plus étendu, mais il doit rester
progressif.

Éviter de donner 12 semaines d'actions sans hiérarchie.

------------------------------------------------------------------------

# 131. TEST DE CHARGE

Tester plusieurs générations simultanées.

Le système doit rester stable lorsque plusieurs couples terminent leur
questionnaire en même temps.

------------------------------------------------------------------------

# 132. TEST DE FILE D'ATTENTE

Vérifier :

``` text
job queued
job processing
job completed
job failed
job retrying
```

------------------------------------------------------------------------

# 133. TEST DE STOCKAGE

Tester :

-   création ;
-   lecture ;
-   téléchargement ;
-   expiration ;
-   suppression selon politique.

------------------------------------------------------------------------

# 134. TEST DE MIGRATION

Avant une migration :

``` text
backup
↓
migration staging
↓
tests
↓
validation
↓
production
```

------------------------------------------------------------------------

# 135. TEST DE RETOUR ARRIÈRE

Pour les changements critiques, définir un plan de rollback.

------------------------------------------------------------------------

# 136. TEST DE COMPATIBILITÉ

Tester les anciennes données avec les nouvelles versions du système
lorsque la compatibilité est prévue.

------------------------------------------------------------------------

# 137. TEST DE VERSIONNAGE

Chaque résultat doit pouvoir indiquer :

``` text
questionnaire version
scoring version
content version
report version
```

------------------------------------------------------------------------

# 138. TEST DE TRAÇABILITÉ

À partir d'un rapport donné, l'équipe doit pouvoir retrouver :

``` text
couple
purchase
questionnaire
responses
scoring run
content version
report version
```

selon les droits d'administration.

------------------------------------------------------------------------

# 139. TEST D'OBSERVABILITÉ

Simuler une erreur et vérifier qu'elle est :

-   détectée ;
-   enregistrée ;
-   visible pour l'équipe ;
-   non exposée à l'utilisateur.

------------------------------------------------------------------------

# 140. TEST D'EXPÉRIENCE

Faire tester le parcours à de vraies personnes dans un cadre contrôlé.

Observer sans expliquer :

-   comprennent-elles comment inviter ?
-   comprennent-elles le code ?
-   savent-elles quoi faire après achat ?
-   comprennent-elles le score ?
-   trouvent-elles le rapport ?
-   trouvent-elles le téléchargement ?

------------------------------------------------------------------------

# 141. TEST DE COMPRÉHENSION

Demander à un testeur :

> « Qu'avez-vous compris de votre score ? »

La réponse doit montrer que le score est compris comme :

> un indicateur de dynamique et de travail,

et non comme :

> une condamnation du couple.

------------------------------------------------------------------------

# 142. TEST DE VALEUR

Demander :

> « Qu'avez-vous appris que vous ne saviez pas avant ? »

Le rapport doit apporter une compréhension nouvelle.

------------------------------------------------------------------------

# 143. TEST D'ACTION

Demander :

> « Qu'allez-vous faire maintenant ? »

Le couple doit pouvoir identifier au moins une action concrète.

------------------------------------------------------------------------

# 144. TEST DE PREMIUM PLUS

Demander aux utilisateurs Premium Plus :

> « Qu'est-ce que cette version vous apporte en plus ? »

La réponse doit être claire.

Si les utilisateurs ne perçoivent aucune différence, l'offre doit être
retravaillée.

------------------------------------------------------------------------

# 145. CRITÈRE DE QUALITÉ PREMIUM

Un rapport Premium doit donner l'impression :

> « On a réellement analysé notre situation. »

et non :

> « On a simplement rempli un questionnaire et reçu un texte
> automatique. »

------------------------------------------------------------------------

# 146. CRITÈRE DE QUALITÉ PREMIUM PLUS

Premium Plus doit donner l'impression :

> « Nous avons reçu non seulement une analyse, mais un véritable
> parcours de travail personnalisé. »

------------------------------------------------------------------------

# 147. GO / NO-GO

Le lancement ne doit être validé que si :

``` text
SCORING VALIDÉ
+
MATCHING VALIDÉ
+
RAPPORT VALIDÉ
+
SÉCURITÉ VALIDÉE
+
UX VALIDÉE
+
TÉLÉCHARGEMENT VALIDÉ
+
OFFRES VALIDÉES
```

------------------------------------------------------------------------

# 148. BLOQUANTS

Les éléments suivants sont des bloqueurs de production :

-   accès à un autre couple ;
-   exposition des réponses du partenaire ;
-   score incorrect ;
-   rapport contradictoire ;
-   mauvais prix ;
-   mauvaise offre ;
-   rapport incomplet ;
-   contenu inventé ;
-   téléchargement non autorisé ;
-   perte des réponses ;
-   troisième participant accepté.

------------------------------------------------------------------------

# 149. NON-BLOQUANTS

Peuvent être corrigés après lancement contrôlé :

-   micro-animation ;
-   détail visuel ;
-   wording secondaire ;
-   ordre d'un petit élément non critique.

------------------------------------------------------------------------

# 150. CHECKLIST FINALE AVANT LANCEMENT

``` text
[ ] Paiement
[ ] Création couple
[ ] Invitation
[ ] Code
[ ] Lien
[ ] Deux participants maximum
[ ] Questionnaire A
[ ] Questionnaire B
[ ] Sauvegarde
[ ] Reprise
[ ] Scoring
[ ] Matching
[ ] Score
[ ] Rapport Essentiel
[ ] Rapport Premium Plus
[ ] Exercices
[ ] Plan d'action
[ ] Conclusion
[ ] Téléchargement
[ ] Expiration
[ ] Confidentialité
[ ] Sécurité
[ ] Notifications
[ ] Analytics
[ ] Mobile
[ ] Desktop
[ ] Accessibilité
[ ] Tests de non-régression
[ ] Golden Reports
[ ] Support
[ ] Monitoring
```

------------------------------------------------------------------------

# 151. SIGN-OFF

Avant mise en production, obtenir une validation explicite des
responsables concernés :

``` text
PRODUIT
UX/UI
TECHNIQUE
CONTENU
MÉTHODOLOGIE
SÉCURITÉ
COMMERCIAL
```

------------------------------------------------------------------------

# 152. RÈGLE FINALE

KELYA COUPLE ne doit jamais être lancé sur la seule base de :

> « Le formulaire fonctionne. »

Il doit être lancé lorsque l'ensemble de la chaîne :

> **questionnaire → données → scoring → matching → interprétation →
> rapport → action**

a été vérifié.

La priorité absolue est la fiabilité du résultat et la sécurité des
personnes.

------------------------------------------------------------------------

# 153. INSTRUCTIONS FINALES POUR CURSOR

Cursor doit utiliser ce document comme protocole de validation avant de
considérer KELYA COUPLE comme terminé.

Il doit :

1.  créer les datasets fictifs ;
2.  créer les Golden Reports ;
3.  automatiser les tests critiques ;
4.  tester les deux sens d'achat ;
5.  tester les invitations ;
6.  tester le maximum de deux participants ;
7.  tester les questionnaires ;
8.  tester les scores ;
9.  tester les scores faibles ;
10. tester les scores élevés ;
11. tester les contradictions ;
12. tester les données insuffisantes ;
13. tester la confidentialité ;
14. tester les accès non autorisés ;
15. tester les téléchargements ;
16. tester l'expiration ;
17. tester Essentiel ;
18. tester Premium Plus ;
19. vérifier que Premium Plus contient tout Essentiel ;
20. vérifier la présence des conclusions ;
21. vérifier les exercices complets ;
22. vérifier les recommandations personnalisées ;
23. vérifier les plans d'action ;
24. vérifier les rapports longs ;
25. vérifier mobile et desktop ;
26. vérifier accessibilité ;
27. vérifier les notifications ;
28. vérifier l'idempotence ;
29. vérifier les retries ;
30. vérifier les logs ;
31. vérifier l'absence de données sensibles dans les logs ;
32. exécuter les tests de non-régression ;
33. effectuer une validation humaine ;
34. produire un rapport de QA ;
35. bloquer le lancement si un critère critique échoue.

------------------------------------------------------------------------

# 154. DOCUMENTS ASSOCIÉS

``` text
01_NAMING_ET_POSITIONNEMENT_KELYA_COUPLE.md
02_ARCHITECTURE_PRODUIT_KELYA_COUPLE.md
03_PARCOURS_UTILISATEUR_KELYA_COUPLE.md
04_MOTEUR_MATCHING_ET_SCORING_KELYA_COUPLE.md
05_MOTEUR_GENERATION_RAPPORTS_KELYA_COUPLE.md
06_INTERFACE_ET_EXPERIENCE_KELYA_COUPLE.md
07_ARCHITECTURE_TECHNIQUE_DONNEES_SECURITE_KELYA_COUPLE.md
08_PROTOCOLE_VALIDATION_TESTS_QUALITE_KELYA_COUPLE.md
```

------------------------------------------------------------------------

# FIN DU DOCUMENT 08
