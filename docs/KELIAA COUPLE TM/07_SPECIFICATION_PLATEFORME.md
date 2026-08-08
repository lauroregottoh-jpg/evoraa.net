# BILAN COUPLE — SPÉCIFICATION FONCTIONNELLE DE LA PLATEFORME

**Version : 1.0**  
**Statut : Document maître — fonctionnement produit et plateforme**  
**Dépendances : `01_CAHIER_DES_CHARGES.md` à `06_OFFRES_TARIFICATION_ET_RESSOURCES.md`**  
**Format : Markdown (.md)**

---

# 1. OBJET

Ce document transforme l'ensemble du projet Bilan Couple en spécification fonctionnelle exploitable pour la conception et le développement de la plateforme.

Il définit :

- la création des comptes ;
- la création d'un couple ;
- le système d'invitation ;
- le `COUPLE_ID` ;
- le code couple ;
- le lien d'invitation ;
- le paiement ;
- l'accès des deux partenaires ;
- le questionnaire individuel ;
- le verrouillage des réponses ;
- le matching ;
- le calcul des résultats ;
- la génération du rapport ;
- les deux niveaux d'offre ;
- la confidentialité ;
- les états du couple ;
- la gestion des erreurs ;
- les ressources ;
- l'administration ;
- les notifications ;
- les règles de sécurité ;
- les critères de complétude.

Ce document doit servir de référence fonctionnelle avant toute implémentation.

---

# 2. PRINCIPLE D'ARCHITECTURE

Le produit fonctionne autour d'une entité centrale :

```text
COUPLE
```

Un couple possède :

```text
Couple_ID
Partner_A
Partner_B
Offer
Payment_Status
Questionnaire_A_Status
Questionnaire_B_Status
Matching_Status
Report_Status
Created_At
Completed_At
```

Le couple constitue le conteneur de toutes les données nécessaires à l'analyse.

---

# 3. LE CONCEPT DE `COUPLE_ID`

Chaque couple reçoit un identifiant unique.

Exemple :

```text
CP-8F4K-29QX
```

Le `COUPLE_ID` est interne au système.

Il ne doit pas être utilisé comme identifiant public facilement devinable.

---

# 4. LE CODE COUPLE

En plus du `COUPLE_ID`, le système génère un **CODE COUPLE** destiné au partage.

Exemple :

```text
K7M4P9
```

Le code :

- appartient à un seul couple ;
- peut être utilisé pour rattacher un deuxième partenaire ;
- ne peut rattacher que deux personnes au total ;
- devient inutilisable après rattachement du deuxième partenaire ;
- ne doit pas permettre à un troisième utilisateur d'entrer dans le couple.

---

# 5. LE LIEN D'INVITATION

Le premier utilisateur dispose de deux moyens d'inviter son partenaire :

### Option A — Lien

```text
https://plateforme.com/invitation/K7M4P9
```

### Option B — Code

Le partenaire saisit :

```text
K7M4P9
```

Les deux méthodes doivent produire exactement le même rattachement.

---

# 6. QUI CRÉE LE COUPLE ?

Peu importe qui commence.

Le système ne doit jamais considérer :

- homme = acheteur ;
- femme = invitée.

Il doit fonctionner selon :

```text
PARTENAIRE A
+
PARTENAIRE B
```

Le premier utilisateur devient simplement :

```text
Partner_A
```

Le second :

```text
Partner_B
```

Le système doit ensuite permettre l'affichage :

```text
Vous
Votre partenaire
```

plutôt que d'imposer une hiérarchie.

---

# 7. CRÉATION DU COMPTE

Le premier utilisateur renseigne au minimum :

- prénom ;
- nom ;
- adresse e-mail ;
- mot de passe ou méthode d'authentification ;
- statut relationnel ;
- consentement ;
- acceptation des conditions.

Informations optionnelles :

- téléphone ;
- âge ;
- pays ;
- ville ;
- date de mariage prévue ;
- durée de relation.

---

# 8. CRÉATION DU COUPLE

Après inscription :

```text
Créer mon bilan couple
```

Le système crée :

```text
Couple_ID
Code_Couple
Invitation_Link
```

Le premier partenaire voit :

> Votre espace couple est prêt.

Puis :

> Invitez votre partenaire pour commencer l'analyse à deux.

---

# 9. INVITATION

L'utilisateur peut :

### Copier le lien

### Copier le code

### Partager directement

Selon les capacités de la plateforme :

- WhatsApp ;
- e-mail ;
- messagerie ;
- copie manuelle.

---

# 10. RATTACHEMENT DU DEUXIÈME PARTENAIRE

Le deuxième utilisateur arrive par :

- lien ;
- code.

Il crée son compte ou se connecte.

Le système vérifie :

```text
Code valide ?
↓
Oui
↓
Couple disponible ?
↓
Oui
↓
Déjà deux partenaires ?
↓
Non
↓
Rattacher l'utilisateur
```

---

# 11. CODE DÉJÀ UTILISÉ

Si le couple possède déjà deux partenaires :

> Ce code de couple n'est plus disponible. Un bilan couple est limité à deux partenaires.

---

# 12. CODE INVALIDE

Message :

> Ce code ne semble pas valide. Vérifiez le code transmis par votre partenaire.

Ne jamais afficher :

- l'identité du propriétaire ;
- son adresse e-mail ;
- son statut ;
- ses réponses.

---

# 13. CODE EXPIRÉ

Le code peut être configuré pour expirer après une période déterminée.

Exemple recommandé :

**30 jours**

Si le code expire :

> Ce lien d'invitation a expiré. Le partenaire qui a créé le bilan peut générer une nouvelle invitation.

Le `Couple_ID` reste inchangé.

---

# 14. RÉGÉNÉRATION DU CODE

Le premier utilisateur peut demander :

> Générer une nouvelle invitation.

Le système :

- invalide l'ancien code ;
- conserve le couple ;
- génère un nouveau code ;
- génère un nouveau lien.

Le partenaire déjà rattaché n'est pas affecté.

---

# 15. ACHAT — PARCOURS A

Le premier partenaire peut acheter immédiatement.

```text
Création du couple
↓
Choix de l'offre
↓
Paiement
↓
Invitation
↓
Partenaire rejoint
↓
Questionnaires
↓
Analyse
↓
Rapport
```

---

# 16. ACHAT — PARCOURS B

Le premier partenaire peut inviter avant de payer.

```text
Création du couple
↓
Invitation
↓
Partenaire rejoint
↓
Choix de l'offre
↓
Paiement
↓
Questionnaires
↓
Analyse
↓
Rapport
```

Le système doit supporter les deux scénarios.

---

# 17. ACHETEUR

Le système ne doit pas avoir une logique métier dépendante du sexe.

Champ :

```text
Buyer_ID
```

Il peut correspondre à :

```text
Partner_A
```

ou :

```text
Partner_B
```

---

# 18. PAIEMENT

Données minimales :

```text
Payment_ID
Couple_ID
Buyer_ID
Offer_ID
Amount
Currency
Payment_Method
Status
Transaction_ID
Created_At
```

États :

```text
PENDING
SUCCESS
FAILED
CANCELLED
REFUNDED
```

---

# 19. OFFRES

```text
PREMIUM
```

Prix couple :

```text
30 000 FCFA
```

Valeur de référence :

```text
40 000 FCFA
```

---

```text
PREMIUM_PLUS
```

Prix couple :

```text
50 000 FCFA
```

Valeur de référence :

```text
60 000 FCFA
```

---

# 20. ACCÈS APRÈS PAIEMENT

Le paiement du couple débloque l'expérience du couple.

Le système doit éviter de facturer automatiquement deux fois.

```text
Couple
↓
Offer = PREMIUM
↓
Access granted = true
```

Le deuxième partenaire reçoit son accès via son rattachement au même `Couple_ID`.

---

# 21. RÈGLE DE CONFIDENTIALITÉ DES RÉPONSES

Le partenaire A ne doit jamais pouvoir voir directement les réponses brutes du partenaire B.

Même chose dans l'autre sens.

Ils voient uniquement :

- leurs propres réponses ;
- les résultats croisés ;
- les interprétations autorisées par le moteur.

---

# 22. QUESTIONNAIRE INDIVIDUEL

Chaque partenaire possède son propre état :

```text
QUESTIONNAIRE_A
QUESTIONNAIRE_B
```

États :

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
LOCKED
```

---

# 23. SAUVEGARDE AUTOMATIQUE

Chaque réponse doit être enregistrée.

Le système doit permettre :

```text
Question 32
↓
Réponse enregistrée
↓
Utilisateur quitte
↓
Retour
↓
Reprise à la question 32
```

---

# 24. PROGRESSION

Afficher :

```text
32 / 126
```

et :

```text
25 % terminé
```

Le calcul de progression doit être basé sur les questions réellement complétées.

---

# 25. NAVIGATION

Le partenaire peut :

- avancer ;
- revenir en arrière ;
- modifier une réponse avant verrouillage.

Le système ne doit pas perdre les réponses précédentes.

---

# 26. VERROUILLAGE

Lorsque toutes les questions sont terminées :

> Vous avez terminé votre questionnaire.

Puis :

> Vérifiez vos réponses avant de les envoyer définitivement.

Bouton :

**Valider mes réponses**

Après validation :

```text
COMPLETED
↓
LOCKED
```

---

# 27. POURQUOI VERROUILLER ?

Le verrouillage garantit que :

- les résultats sont reproductibles ;
- les deux profils sont comparés sur une base stable ;
- le rapport ne change pas silencieusement après génération.

Une modification ultérieure doit nécessiter une action explicite de l'administration ou une procédure de réouverture.

---

# 28. ÉTAT DU COUPLE

Le couple peut avoir les états suivants :

```text
CREATED
INVITATION_SENT
PARTNER_JOINED
PAYMENT_PENDING
PAID
PARTNER_A_IN_PROGRESS
PARTNER_B_IN_PROGRESS
ONE_COMPLETED
BOTH_COMPLETED
ANALYSIS_READY
REPORT_GENERATING
REPORT_READY
ARCHIVED
```

---

# 29. LOGIQUE DE COMPLÉTUDE

Le rapport final ne peut être généré que lorsque :

```text
Partner_A = COMPLETED
AND
Partner_B = COMPLETED
AND
Payment = SUCCESS
```

Puis :

```text
ANALYSIS_READY
```

---

# 30. MATCHING

Le matching ne signifie pas :

> trouver deux personnes compatibles dans une base.

Il signifie :

> comparer les deux profils appartenant au même `Couple_ID`.

Architecture :

```text
Partner_A responses
+
Partner_B responses
↓
Matching Engine
↓
Comparative Matrix
↓
Interpretation Engine
↓
Report Generator
```

---

# 31. MATRICE DE COMPARAISON

Pour chaque dimension :

```text
Score A
Score B
Difference
Convergence
Perception A
Perception B
Perception Gap
Priority
```

Exemple :

```text
FINANCES

A = 78
B = 46
Difference = 32

Convergence = LOW

Perception A = 4/5
Perception B = 2/5

Perception Gap = HIGH

Priority = HIGH
```

---

# 32. RÈGLE DU SCORE GLOBAL

Le score global doit être calculé à partir des dimensions pondérées.

Il ne doit jamais être une simple moyenne aveugle si certaines dimensions sont plus structurantes.

Exemple conceptuel :

```text
Global Compatibility Index
=
Σ (Dimension Score × Weight)
```

Les poids définitifs doivent être définis dans le document de scoring.

---

# 33. RÈGLE DES DIMENSIONS STRUCTURANTES

Certaines dimensions doivent pouvoir être signalées séparément même lorsque le score global est élevé.

Exemples :

- parentalité ;
- valeurs ;
- finances ;
- mariage ;
- sécurité ;
- projet de vie.

---

# 34. SCORE GLOBAL — RÈGLE D'AFFICHAGE

Le score peut être affiché comme :

> **Indice de convergence : 78/100**

Mais immédiatement accompagné de :

> Cet indice ne constitue pas une prédiction de la réussite de votre couple. Il synthétise certaines convergences et différences observées dans vos réponses.

---

# 35. POURCENTAGE BAS

Si le couple obtient :

**15 %**

le système ne doit jamais afficher :

> Très incompatible.

Il doit afficher par exemple :

> **Votre indice de convergence est actuellement faible.**
>
> Vos réponses montrent plusieurs différences importantes. Elles ne constituent pas un verdict sur votre relation. Elles indiquent surtout les domaines dans lesquels vos attentes, perceptions ou façons de fonctionner méritent une exploration approfondie.

---

# 36. POURCENTAGE ÉLEVÉ

Si :

**92 %**

ne pas afficher :

> Couple parfait.

Préférer :

> **Votre indice de convergence est élevé.**
>
> Vos réponses montrent de nombreuses convergences. Quelques différences subsistent néanmoins et peuvent constituer des sujets utiles à clarifier.

---

# 37. ANALYSE DES ÉCARTS

Pour chaque dimension :

```text
ABS(Score_A - Score_B)
```

permet de mesurer une première différence.

Mais la différence ne suffit pas.

Il faut également considérer :

- importance de la dimension ;
- sous-dimensions ;
- perception ;
- sens de la différence ;
- possibilité de négociation.

---

# 38. ÉCART DE PERCEPTION

Une dimension peut être similaire en score mais présenter un écart de perception.

Exemple :

```text
A = 80
B = 78

mais

A pense que la communication est excellente
B pense qu'elle est faible
```

Le système doit alors générer :

```text
PERCEPTION_GAP = HIGH
```

---

# 39. COMPLÉMENTARITÉ

Une différence n'est pas automatiquement une incompatibilité.

Le moteur doit pouvoir identifier :

```text
DIFFERENCE
+
VALUES_COMPATIBLE
+
RESPECT
+
NEGOTIABLE
=
POSSIBLE_COMPLEMENTARITY
```

---

# 40. PRIORISATION

Chaque domaine reçoit un niveau :

```text
LOW
MODERATE
HIGH
CRITICAL
```

La priorité dépend notamment :

```text
Difference
+
Importance
+
Perception Gap
+
Sensitivity
+
Structural Weight
```

---

# 41. GÉNÉRATION DU RAPPORT

Le générateur reçoit :

```text
Couple_ID
Offer_ID
Partner_A
Partner_B
Scores
Differences
Perception_Gaps
Priorities
Interpretation_Rules
Resource_Rules
```

Il produit :

```text
Individual_Report_A
Individual_Report_B
Couple_Report
```

---

# 42. RAPPORT 30 000 FCFA

Le Premium génère :

```text
REPORT_PREMIUM
```

Contenu :

- analyse individuelle A ;
- analyse individuelle B ;
- analyse croisée ;
- forces ;
- convergences ;
- divergences ;
- écarts ;
- priorités ;
- actions ;
- ressources ;
- conclusion.

---

# 43. RAPPORT 50 000 FCFA

Le Premium+ génère :

```text
REPORT_PREMIUM_PLUS
```

avec :

- tout le Premium ;
- analyse approfondie ;
- conversations ;
- exercices ;
- feuille de route ;
- plan d'action ;
- ressources personnalisées.

---

# 44. GÉNÉRATION DYNAMIQUE DES PAGES

Le nombre de pages n'est pas fixe.

Le système doit générer davantage de contenu lorsque :

- les résultats sont complexes ;
- plusieurs dimensions présentent des écarts ;
- des écarts de perception sont importants ;
- plusieurs priorités existent ;
- l'offre Premium+ est utilisée.

Ne jamais ajouter du texte uniquement pour atteindre un nombre de pages.

---

# 45. RAPPORT INDIVIDUEL A

Le partenaire A reçoit :

```text
VOTRE PROFIL
VOS FORCES
VOS BESOINS
VOS POINTS DE VIGILANCE
VOS AXES INDIVIDUELS
```

Il peut également voir certaines analyses du couple, mais pas les réponses brutes de B.

---

# 46. RAPPORT INDIVIDUEL B

Même logique.

Le partenaire B reçoit :

```text
VOTRE PROFIL
VOS FORCES
VOS BESOINS
VOS POINTS DE VIGILANCE
VOS AXES INDIVIDUELS
```

---

# 47. RAPPORT COMMUN

Le rapport commun comprend :

```text
VOTRE DYNAMIQUE
VOS FORCES
VOS CONVERGENCES
VOS DIFFÉRENCES
VOS ÉCARTS
VOS PRIORITÉS
VOS CONVERSATIONS
VOTRE FEUILLE DE ROUTE
```

---

# 48. PROTECTION DES INFORMATIONS INDIVIDUELLES

Le système doit distinguer :

### Données privées

- réponses brutes ;
- commentaires personnels ;
- données sensibles ;
- informations de compte.

### Données partageables

- scores croisés ;
- tendances ;
- analyses communes ;
- recommandations de couple.

---

# 49. COMMENTAIRES LIBRES

Si des commentaires libres sont ajoutés au questionnaire :

Ils doivent être considérés comme **privés par défaut**.

Le moteur ne doit pas automatiquement les afficher au partenaire.

---

# 50. CONSENTEMENT

Avant le début du test :

> Vos réponses sont personnelles. Elles seront utilisées pour produire votre analyse individuelle et, lorsque vous réalisez le bilan à deux, une analyse croisée destinée à votre couple.

Le partenaire doit accepter.

---

# 51. DONNÉES SENSIBLES

Les dimensions sensibles doivent être traitées avec prudence :

- intimité ;
- sécurité ;
- fidélité ;
- finances ;
- santé psychologique éventuelle ;
- situations de violence éventuelles.

Le questionnaire ne doit pas chercher à établir un diagnostic médical.

---

# 52. SITUATIONS DE SÉCURITÉ

Si le système inclut ultérieurement des questions permettant de repérer des situations potentiellement dangereuses, ces réponses doivent faire l'objet d'une logique spécifique.

Le système ne doit pas simplement afficher :

> « Votre couple est toxique. »

Il doit utiliser une orientation prudente vers des ressources professionnelles appropriées.

---

# 53. RESSOURCES

Le moteur associe les résultats à des ressources :

```text
Dimension
↓
Priority
↓
Resource Rule
↓
Resource
```

Exemple :

```text
FINANCES
HIGH
↓
RES-FIN-001
↓
Guide : Construire vos règles financières
```

---

# 54. RESSOURCES GRATUITES

Peuvent être affichées à tous :

- guides ;
- articles ;
- fiches ;
- exercices simples.

---

# 55. RESSOURCES PAYANTES

Peuvent être recommandées :

- sessions ;
- programmes ;
- accompagnements ;
- consultations professionnelles.

La recommandation doit être contextuelle.

---

# 56. ORIENTATION THÉRAPEUTIQUE

Le système peut proposer une catégorie :

> **Vous souhaitez aller plus loin avec un professionnel ?**

Puis afficher des professionnels référencés.

Les professionnels devront être stockés avec :

```text
Professional_ID
Name
Specialty
Country
City
Language
Format
Contact
Verification_Status
```

---

# 57. VÉRIFICATION DES PROFESSIONNELS

Un professionnel ne doit pas être publié comme recommandé sans statut de vérification.

États :

```text
PENDING
VERIFIED
SUSPENDED
ARCHIVED
```

---

# 58. NOTIFICATIONS

Le système doit pouvoir envoyer :

### Après création

> Votre espace couple est prêt.

### Après invitation

> Votre invitation a été envoyée.

### Quand le partenaire rejoint

> Votre partenaire a rejoint votre bilan.

### Quand le partenaire termine

> Votre analyse de couple peut maintenant être générée.

### Quand le rapport est prêt

> Votre rapport est disponible.

---

# 59. RAPPEL D'INVITATION

Si le partenaire n'a pas rejoint :

```text
J+1
J+3
J+7
```

Le système peut proposer un rappel.

Les rappels doivent rester limités et désactivables.

---

# 60. RAPPEL DE QUESTIONNAIRE

Si un partenaire a commencé sans terminer :

```text
Vous avez terminé 62 % de votre bilan.
Reprenez là où vous vous êtes arrêté(e).
```

---

# 61. TABLEAU DE BORD UTILISATEUR

Le partenaire doit pouvoir voir :

```text
MON BILAN COUPLE

Partenaire : connecté / en attente
Mon questionnaire : 78 %
Questionnaire partenaire : terminé
Paiement : validé
Rapport : en préparation
```

---

# 62. ÉTATS D'AFFICHAGE

### Partenaire non invité

> Invitez votre partenaire pour commencer.

### Partenaire invité

> Invitation envoyée.

### Partenaire connecté

> Votre partenaire a rejoint le bilan.

### Un seul questionnaire terminé

> Votre partenaire doit encore terminer son questionnaire.

### Deux questionnaires terminés

> Votre rapport peut être généré.

---

# 63. ADMINISTRATION

L'administrateur doit pouvoir rechercher :

```text
Couple_ID
Email
Payment_ID
Report_ID
```

---

# 64. ADMIN — VUE COUPLE

Afficher :

```text
Couple_ID
Partner_A
Partner_B
Offer
Payment_Status
A_Status
B_Status
Report_Status
Created_At
Updated_At
```

---

# 65. ADMIN — ACTIONS

L'administrateur autorisé peut :

- voir l'état ;
- renvoyer une invitation ;
- régénérer un code ;
- débloquer exceptionnellement un questionnaire ;
- relancer une génération ;
- consulter les erreurs ;
- réattribuer un paiement ;
- archiver le couple.

Toute action sensible doit être journalisée.

---

# 66. JOURNAL D'AUDIT

Structure :

```text
Audit_ID
User_ID
Admin_ID
Couple_ID
Action
Timestamp
Previous_State
New_State
Reason
```

---

# 67. ERREUR DE GÉNÉRATION

Si le rapport échoue :

```text
REPORT_GENERATION_FAILED
```

Le système doit :

- conserver les réponses ;
- conserver les scores ;
- ne pas demander au client de refaire le test ;
- enregistrer l'erreur ;
- permettre une nouvelle tentative.

---

# 68. ERREUR DE PAIEMENT

Si paiement échoué :

> Votre paiement n'a pas pu être confirmé. Vos informations de bilan sont conservées. Vous pouvez réessayer.

Ne pas supprimer le couple.

---

# 69. INTERRUPTION DE SESSION

Si l'utilisateur ferme la page :

Les réponses enregistrées doivent être conservées.

---

# 70. DUPLICATION DE COMPTE

Si un e-mail existe :

> Un compte existe déjà avec cette adresse. Connectez-vous pour continuer.

---

# 71. SÉCURITÉ DU CODE

Le code couple doit être :

- suffisamment aléatoire ;
- non séquentiel ;
- impossible à deviner facilement ;
- limité à deux rattachements.

---

# 72. SÉCURITÉ DU LIEN

Le lien d'invitation ne doit pas exposer directement :

```text
Couple_ID
Email
User_ID
```

Il doit utiliser un token d'invitation.

---

# 73. TOKEN D'INVITATION

Structure conceptuelle :

```text
Invitation_ID
Couple_ID
Token_Hash
Created_At
Expires_At
Used_At
Status
```

---

# 74. STATUT D'INVITATION

```text
ACTIVE
USED
EXPIRED
REVOKED
```

---

# 75. MODÈLE DE DONNÉES — UTILISATEUR

```text
User
-----
User_ID
First_Name
Last_Name
Email
Phone
Password_Hash / Auth_ID
Country
Created_At
Updated_At
Consent_Status
```

---

# 76. MODÈLE DE DONNÉES — COUPLE

```text
Couple
------
Couple_ID
Partner_A_ID
Partner_B_ID
Code
Offer_ID
Status
Created_At
Updated_At
Completed_At
```

---

# 77. MODÈLE DE DONNÉES — QUESTIONNAIRE

```text
Questionnaire
-------------
Questionnaire_ID
Couple_ID
User_ID
Version
Status
Progress
Started_At
Completed_At
Locked_At
```

---

# 78. MODÈLE DE DONNÉES — RÉPONSE

```text
Answer
------
Answer_ID
Questionnaire_ID
Question_ID
Value
Created_At
Updated_At
```

---

# 79. MODÈLE DE DONNÉES — SCORE

```text
Score
-----
Score_ID
Couple_ID
User_ID
Dimension_ID
Raw_Score
Normalized_Score
Weight
Version
```

---

# 80. MODÈLE DE DONNÉES — MATCHING

```text
Match_Result
------------
Match_ID
Couple_ID
Dimension_ID
Score_A
Score_B
Difference
Convergence_Level
Perception_Gap
Priority
Version
```

---

# 81. MODÈLE DE DONNÉES — RAPPORT

```text
Report
------
Report_ID
Couple_ID
Offer_ID
Version
Status
Generated_At
File_Reference
```

---

# 82. MODÈLE DE DONNÉES — RESSOURCE

```text
Resource
--------
Resource_ID
Category
Type
Title
Description
URL / Internal_Link
Target
Priority_Min
Priority_Max
Status
```

---

# 83. VERSIONNAGE DU TEST

Chaque questionnaire doit être associé à une version.

Exemple :

```text
TEST_VERSION = 1.0
```

Si les questions changent de manière significative :

```text
TEST_VERSION = 2.0
```

Les anciens résultats doivent rester interprétables avec leur version originale.

---

# 84. VERSIONNAGE DU SCORING

Même principe :

```text
SCORING_VERSION = 1.0
```

Le rapport doit enregistrer la version utilisée.

---

# 85. VERSIONNAGE DU RAPPORT

```text
REPORT_ENGINE_VERSION = 1.0
```

Cela permet de savoir comment un rapport a été produit.

---

# 86. MOTEUR GLOBAL

Architecture fonctionnelle :

```text
AUTHENTIFICATION
        ↓
CRÉATION COUPLE
        ↓
INVITATION
        ↓
RATTACHEMENT PARTENAIRE
        ↓
PAIEMENT
        ↓
QUESTIONNAIRE A + B
        ↓
VERROUILLAGE
        ↓
SCORING
        ↓
MATCHING
        ↓
INTERPRÉTATION
        ↓
RESSOURCES
        ↓
GÉNÉRATION RAPPORT
        ↓
LIVRAISON
```

---

# 87. RÈGLE ABSOLUE DU MOTEUR

Le moteur ne doit jamais produire une conclusion uniquement à partir du score global.

Il doit combiner :

```text
GLOBAL SCORE
+
DIMENSION SCORES
+
DIFFERENCES
+
PERCEPTION GAPS
+
STRUCTURAL DIMENSIONS
+
INTERPRETATION RULES
```

---

# 88. RÈGLE ABSOLUE SUR LA COMPATIBILITÉ

Le mot « compatibilité » doit être utilisé avec prudence.

Le résultat est un :

> **indice de convergence relationnelle**

et non une prédiction scientifique de la réussite du couple.

---

# 89. LOGIQUE DU SCORE

Le moteur peut produire :

```text
Indice global
```

mais également :

```text
Profil de convergence
```

Exemple :

> **78/100 — Convergence élevée**

Puis :

> Forte convergence sur les valeurs, le projet de vie et la vision du mariage. Différences plus marquées sur les finances et l'autonomie.

Cette lecture est plus informative que le chiffre seul.

---

# 90. ÉTIQUETTES DE RÉSULTAT

Proposition :

```text
90–100
TRÈS FORTE CONVERGENCE

75–89
FORTE CONVERGENCE

60–74
CONVERGENCE MODÉRÉE

40–59
DIFFÉRENCES SIGNIFICATIVES

0–39
FORTE DIVERGENCE
```

Ces seuils devront être validés lors de la phase de scoring.

Ils ne doivent jamais être présentés comme des seuils scientifiques de réussite ou d'échec relationnel.

---

# 91. ÉCRAN FINAL DU TEST

Exemple :

> **Votre questionnaire est terminé.**
>
> Votre partenaire doit également terminer son questionnaire avant que votre analyse croisée puisse être générée.
>
> Vos réponses restent personnelles et ne sont pas visibles directement par votre partenaire.

---

# 92. RAPPORT PRÊT

> **Votre analyse de couple est prête.**
>
> Vous pouvez maintenant découvrir :
>
> - ce qui vous rapproche ;
> - ce qui vous différencie ;
> - vos principaux écarts de perception ;
> - vos priorités ;
> - ce que chacun peut travailler ;
> - ce que vous pouvez construire ensemble.

---

# 93. MOBILE

La plateforme doit être conçue mobile-first.

Le questionnaire doit être confortable sur :

- téléphone ;
- tablette ;
- ordinateur.

Les boutons doivent être suffisamment grands.

---

# 94. PROGRESSION MOBILE

Afficher :

```text
Question 38 sur 126
```

avec une barre de progression.

Éviter les pages surchargées.

---

# 95. ACCESSIBILITÉ

Prévoir :

- contraste suffisant ;
- tailles de texte lisibles ;
- navigation clavier ;
- labels explicites ;
- messages d'erreur compréhensibles.

---

# 96. EXPÉRIENCE ÉMOTIONNELLE

Le test porte sur une relation personnelle.

L'interface doit donc éviter :

- les couleurs alarmistes ;
- les messages de jugement ;
- les animations qui dramatisent les résultats ;
- les formulations culpabilisantes.

---

# 97. RÉSULTAT À 15 %

Si le système produit :

```text
15/100
```

l'interface doit afficher :

> **Plusieurs différences importantes ressortent de votre bilan.**
>
> Ce résultat ne signifie pas que votre couple est condamné ou que vous ne pouvez pas construire ensemble. Il indique que plusieurs domaines méritent probablement d'être clarifiés et travaillés.

---

# 98. RÉSULTAT À 95 %

Afficher :

> **Vous présentez une très forte convergence sur les dimensions évaluées.**
>
> Cela constitue une base favorable, mais aucune relation ne peut être résumée par un seul score. Vos différences restantes peuvent être tout aussi importantes à comprendre.

---

# 99. RÈGLE DE NON-VERDICT

À aucun moment le système ne doit afficher :

```text
COMPATIBLE
INCOMPATIBLE
BON COUPLE
MAUVAIS COUPLE
MARIAGE RECOMMANDÉ
MARIAGE DÉCONSEILLÉ
```

comme verdict automatisé.

---

# 100. RÈGLE DE CONCLUSION

Toute conclusion doit revenir vers :

```text
COMPRENDRE
+
CLARIFIER
+
TRAVAILLER
+
DÉCIDER
```

et non :

```text
JUGER
```

---

# 101. CHECKLIST DE PRODUCTION

Avant lancement, vérifier :

## Produit

- [ ] Deux comptes indépendants
- [ ] Couple_ID unique
- [ ] Code limité à deux personnes
- [ ] Lien d'invitation
- [ ] Reprise du questionnaire
- [ ] Verrouillage
- [ ] Paiement
- [ ] Matching
- [ ] Rapport

## Scoring

- [ ] Questions versionnées
- [ ] Scores normalisés
- [ ] Pondérations validées
- [ ] Écarts calculés
- [ ] Écarts de perception calculés
- [ ] Priorités calculées
- [ ] Règles d'interprétation validées

## Rapport

- [ ] Rapport individuel A
- [ ] Rapport individuel B
- [ ] Rapport couple
- [ ] Ressources
- [ ] Feuille de route Premium+
- [ ] Versioning

## Sécurité

- [ ] Réponses privées
- [ ] Tokens sécurisés
- [ ] Journal d'audit
- [ ] Gestion des droits
- [ ] Suppression/export des données
- [ ] Politique de confidentialité

---

# 102. CHECKLIST ADMINISTRATION

L'administrateur doit pouvoir :

- [ ] voir les couples ;
- [ ] filtrer les statuts ;
- [ ] voir les paiements ;
- [ ] vérifier les questionnaires ;
- [ ] relancer une génération ;
- [ ] régénérer une invitation ;
- [ ] gérer les ressources ;
- [ ] gérer les professionnels ;
- [ ] consulter les erreurs ;
- [ ] archiver un couple.

---

# 103. CHECKLIST RAPPORT

Avant livraison :

- [ ] Les deux questionnaires sont terminés.
- [ ] Le paiement est confirmé.
- [ ] Les réponses sont verrouillées.
- [ ] Les scores sont calculés.
- [ ] Les écarts sont calculés.
- [ ] Les interprétations sont disponibles.
- [ ] Les priorités sont déterminées.
- [ ] Les ressources sont sélectionnées.
- [ ] Le rapport est généré.
- [ ] Le rapport est stocké.
- [ ] Le rapport est accessible au couple.

---

# 104. TESTS CRITIQUES AVANT LANCEMENT

### Test 1

A crée un couple.

B rejoint par code.

→ doit fonctionner.

### Test 2

B rejoint par lien.

→ doit fonctionner.

### Test 3

C tente d'utiliser le même code.

→ refus.

### Test 4

A termine.

B n'a pas terminé.

→ aucun rapport final.

### Test 5

B termine.

→ analyse disponible.

### Test 6

Paiement échoue.

→ couple conservé.

### Test 7

Rapport échoue.

→ nouvelle tentative possible.

### Test 8

A tente de voir les réponses brutes de B.

→ refus.

### Test 9

A obtient un score global très faible.

→ aucun verdict d'incompatibilité.

### Test 10

A et B ont des scores proches mais un fort écart de perception.

→ le rapport doit le signaler.

---

# 105. ARCHITECTURE DES ÉCRANS

Minimum recommandé :

```text
01 — Landing Page
02 — Choix de l'offre
03 — Inscription
04 — Création du couple
05 — Invitation
06 — Rejoindre un couple
07 — Dashboard
08 — Questionnaire
09 — Validation
10 — Attente partenaire
11 — Analyse en cours
12 — Rapport
13 — Ressources
14 — Profil
15 — Administration
```

---

# 106. LANDING PAGE

La page doit expliquer :

- le problème ;
- la valeur ;
- le fonctionnement ;
- les deux offres ;
- la confidentialité ;
- le fonctionnement à deux ;
- le prix ;
- les limites du test.

CTA :

> **Commencer mon Bilan Couple**

---

# 107. CHOIX DE L'OFFRE

Deux cartes :

## PREMIUM

**30 000 FCFA / couple**

## PREMIUM+

**50 000 FCFA / couple**

Le Premium+ peut être marqué :

> **Le plus complet**

---

# 108. CRÉATION DU COUPLE

Après choix :

> **Créons votre espace couple**

Champs :

- prénom ;
- nom ;
- e-mail ;
- statut relationnel.

Puis :

> **Créer mon espace**

---

# 109. INVITATION

Écran :

> **Invitez votre partenaire**

Boutons :

**Copier le lien**

**Copier le code**

**Partager**

---

# 110. DASHBOARD

Le tableau de bord doit être simple.

Exemple :

```text
MON BILAN COUPLE

Vous
✓ Questionnaire terminé

Votre partenaire
⏳ En attente

Paiement
✓ Confirmé

Analyse
🔒 En attente de votre partenaire
```

---

# 111. FIN DU PARCOURS

Une fois le rapport disponible :

> **Votre bilan est prêt.**

Actions :

**Lire le rapport**

**Télécharger le rapport**

**Voir mes ressources**

---

# 112. RÈGLE DE CONTINUITÉ

Après réception du rapport, le couple doit pouvoir continuer son parcours.

Exemple :

```text
Rapport
↓
Priorité 1
↓
Ressource
↓
Session
↓
Programme éventuel
```

---

# 113. ARCHITECTURE GLOBALE FINALE

```text
                    PLATEFORME
                        │
          ┌─────────────┴─────────────┐
          │                           │
       PARTNER A                  PARTNER B
          │                           │
          └────────── COUPLE_ID ──────┘
                       │
                    PAIEMENT
                       │
                 QUESTIONNAIRES
                       │
                 VERROUILLAGE
                       │
                    SCORING
                       │
                   MATCHING
                       │
                INTERPRÉTATION
                       │
             ┌─────────┴─────────┐
             │                   │
       RAPPORT INDIVIDUEL   RAPPORT COUPLE
             │                   │
             └─────────┬─────────┘
                       │
                   RESSOURCES
                       │
                 FEUILLE DE ROUTE
                       │
                  ACCOMPAGNEMENT
```

---

# 114. RÈGLE FINALE DE CONCEPTION

Le produit doit être pensé comme :

> **un système d'analyse relationnelle à deux**, et non comme deux tests individuels simplement réunis.

Le `Couple_ID` constitue le lien logique.

Le questionnaire appartient à chaque personne.

Les réponses restent privées.

Le moteur compare les données.

Le rapport transforme les différences en informations utiles.

Les ressources transforment les informations en actions.

---

# 115. ORDRE D'IMPLÉMENTATION RECOMMANDÉ

Pour éviter de construire dans tous les sens :

### PHASE 1 — Fondations

1. comptes ;
2. couple ;
3. code ;
4. invitation ;
5. rattachement.

### PHASE 2 — Questionnaire

6. banque de questions ;
7. sauvegarde ;
8. progression ;
9. verrouillage.

### PHASE 3 — Paiement

10. offres ;
11. paiement ;
12. droits d'accès.

### PHASE 4 — Moteur

13. scoring ;
14. matching ;
15. interprétation ;
16. priorisation.

### PHASE 5 — Rapports

17. Premium ;
18. Premium+ ;
19. génération ;
20. livraison.

### PHASE 6 — Ressources

21. catalogue ;
22. recommandations ;
23. professionnels.

### PHASE 7 — Administration

24. dashboard ;
25. audit ;
26. erreurs ;
27. gestion.

---

# 116. CRITÈRE DE RÉUSSITE DU MVP

Le MVP peut être considéré comme fonctionnel lorsque :

```text
Une personne
↓
crée un compte
↓
crée un couple
↓
invite son partenaire
↓
le partenaire rejoint
↓
les deux paient / le couple est activé
↓
les deux remplissent le questionnaire
↓
les réponses sont verrouillées
↓
le système calcule les résultats
↓
le système compare les profils
↓
le système génère un rapport cohérent
↓
le couple peut le consulter
```

---

# 117. CE QUI PEUT ATTENDRE UNE VERSION 2

Ne pas surcharger le premier lancement avec :

- application mobile native ;
- messagerie intégrée ;
- visioconférence ;
- suivi automatique complexe ;
- intelligence artificielle conversationnelle ;
- communauté ;
- gamification avancée ;
- système de thérapeutes très complexe.

Ces fonctionnalités pourront être ajoutées plus tard.

---

# 118. PRINCIPLE DE SIMPLICITÉ

Le premier produit doit faire parfaitement peu de choses :

> **Créer un couple → répondre séparément → comparer → comprendre → agir.**

Tout ce qui ne contribue pas directement à cette chaîne peut attendre.

---

# 119. DOCUMENTS MAÎTRES DU PROJET

Le socle documentaire est désormais :

```text
01_CAHIER_DES_CHARGES.md
02_ARCHITECTURE_TEST_SCORING_MATCHING.md
03_BANQUE_QUESTIONS.md
04_BIBLIOTHEQUE_INTERPRETATIONS.md
05_MODELES_RAPPORTS.md
06_OFFRES_TARIFICATION_ET_RESSOURCES.md
07_SPECIFICATION_PLATEFORME.md
```

Ces sept documents constituent le **socle V1 du projet**.

---

# 120. PROCHAINE ÉTAPE APRÈS LE SOCLE

Après ces sept documents, il ne faut pas créer immédiatement quinze nouveaux fichiers.

La prochaine étape doit être une **phase de consolidation** :

1. relire les 126 questions ;
2. vérifier le scoring ;
3. verrouiller les règles de matching ;
4. vérifier les modèles de rapports ;
5. vérifier la logique Premium/Premium+ ;
6. puis transformer ces spécifications en architecture technique de développement.

L'objectif est de construire une machine cohérente, pas une accumulation de documents.

---

# 121. PRINCIPLE DIRECTEUR FINAL

Le Bilan Couple doit toujours respecter cette philosophie :

> **Une différence n'est pas un verdict.**
>
> **Un score n'est pas une prédiction.**
>
> **Une divergence est une information.**
>
> **Un écart de perception est une invitation à comprendre.**
>
> **Une priorité est une occasion d'agir.**

Le produit doit aider deux personnes à mieux comprendre ce qu'elles construisent ensemble.

**Fin du document.**
