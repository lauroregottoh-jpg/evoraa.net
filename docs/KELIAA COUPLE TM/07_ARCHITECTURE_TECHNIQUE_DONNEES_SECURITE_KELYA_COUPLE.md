# 07 --- ARCHITECTURE TECHNIQUE, DONNÉES, COMPTES, COUPLES ET SÉCURITÉ

# KELYA COUPLE™

## Spécification technique fonctionnelle pour l'implémentation dans KELYA

**Document maître pour transformer la méthodologie KELYA COUPLE en
architecture technique robuste, sécurisée et maintenable.**

------------------------------------------------------------------------

# 1. OBJECTIF DU DOCUMENT

Ce document définit l'architecture technique nécessaire pour faire
fonctionner KELYA COUPLE dans l'écosystème KELYA.

Il précise :

-   la logique des comptes ;
-   la création du couple ;
-   l'association des deux participants ;
-   le paiement ;
-   les invitations ;
-   les questionnaires ;
-   la sauvegarde des réponses ;
-   le scoring ;
-   la génération du rapport ;
-   les droits d'accès ;
-   la confidentialité ;
-   l'expiration ;
-   les téléchargements ;
-   le versionnage ;
-   les journaux techniques ;
-   les contrôles de sécurité.

L'objectif est de donner à Cursor une architecture suffisamment précise
pour construire le service sans improviser la logique centrale.

------------------------------------------------------------------------

# 2. PRINCIPE ARCHITECTURAL

KELYA COUPLE doit être conçu comme un module spécialisé de KELYA.

Architecture logique :

``` text
KELYA
│
├── AUTHENTIFICATION
├── UTILISATEURS
├── PAIEMENTS
├── NOTIFICATIONS
├── STOCKAGE
│
└── KELYA COUPLE
      │
      ├── COUPLES
      ├── INVITATIONS
      ├── QUESTIONNAIRES
      ├── RÉPONSES
      ├── SCORING
      ├── MATCHING
      ├── RAPPORTS
      ├── EXERCICES
      ├── PLANS D'ACTION
      └── ACCÈS
```

Le module KELYA COUPLE doit pouvoir évoluer sans casser les autres
modules KELYA.

------------------------------------------------------------------------

# 3. PRINCIPE DE SÉPARATION

Séparer clairement :

``` text
USER DATA
COUPLE DATA
QUESTIONNAIRE DATA
SCORING DATA
REPORT DATA
ACCESS DATA
PAYMENT DATA
```

Ne pas stocker toutes les informations dans une seule table ou
collection géante.

Cette séparation facilite :

-   la sécurité ;
-   les mises à jour ;
-   le debugging ;
-   le versionnage ;
-   l'export ;
-   la suppression ;
-   les droits d'accès.

------------------------------------------------------------------------

# 4. ENTITÉ UTILISATEUR

Un utilisateur KELYA existe indépendamment du service KELYA COUPLE.

Données minimales possibles :

``` text
user_id
first_name
last_name
email
phone
password/auth_provider
created_at
updated_at
```

Ne demander que les informations réellement nécessaires.

------------------------------------------------------------------------

# 5. ENTITÉ COUPLE

Le couple est une entité distincte des utilisateurs.

Structure conceptuelle :

``` text
couple_id
purchase_id
participant_a_id
participant_b_id
relationship_status
offer_plan
status
created_at
completed_at
access_expires_at
```

Le couple doit pouvoir être identifié sans exposer inutilement les
informations personnelles des participants.

------------------------------------------------------------------------

# 6. STATUT DU COUPLE

Prévoir les états :

``` text
CREATED
INVITATION_PENDING
PARTNER_JOINED
QUESTIONNAIRES_IN_PROGRESS
BOTH_COMPLETED
ANALYSIS_RUNNING
RESULTS_READY
REPORT_READY
ACCESS_EXPIRING
ACCESS_EXPIRED
CANCELLED
```

Chaque transition doit être contrôlée.

------------------------------------------------------------------------

# 7. RÈGLE FONDAMENTALE : DEUX PARTICIPANTS MAXIMUM

Un achat KELYA COUPLE correspond à :

``` text
1 couple
2 participants maximum
```

Le système ne doit jamais permettre :

``` text
participant_3
participant_4
...
```

sur le même bilan.

------------------------------------------------------------------------

# 8. PARTICIPANT A ET PARTICIPANT B

Ne jamais considérer que :

> l'acheteur = participant A obligatoire.

La personne qui achète peut être :

-   partenaire A ;
-   partenaire B.

Le système doit donc utiliser :

``` text
participant_1
participant_2
```

plutôt que des rôles émotionnels du type :

``` text
HOMME
FEMME
```

------------------------------------------------------------------------

# 9. STATUT D'ACHETEUR

Le système peut conserver :

``` text
purchaser_user_id
```

Mais ce champ ne doit pas déterminer le rôle relationnel.

Exemple :

``` text
purchaser = Sarah
participant_1 = Sarah
participant_2 = Thomas
```

ou :

``` text
purchaser = Thomas
participant_1 = Sarah
participant_2 = Thomas
```

Les deux configurations doivent fonctionner.

------------------------------------------------------------------------

# 10. IDENTIFIANT DU COUPLE

Chaque couple doit recevoir un identifiant unique.

Exemple :

``` text
KLY-CPL-8F42Q
```

Cet identifiant est interne et peut être affiché à l'utilisateur
lorsqu'il est utile.

Il ne doit pas contenir :

-   nom ;
-   email ;
-   téléphone ;
-   information sensible.

------------------------------------------------------------------------

# 11. CODE D'INVITATION

Le code d'invitation doit être distinct du couple_id interne si
possible.

Exemple :

``` text
KLY-7Q4X9
```

Il doit être :

-   suffisamment aléatoire ;
-   difficile à deviner ;
-   temporaire ;
-   lié à un couple précis ;
-   limité à une seule association de partenaire.

------------------------------------------------------------------------

# 12. INVITATION PAR LIEN

Le lien doit contenir un token sécurisé.

Exemple conceptuel :

``` text
/couple/join?token=RANDOM_SECURE_TOKEN
```

Le token ne doit pas contenir directement :

``` text
email
couple_id lisible
nom
```

------------------------------------------------------------------------

# 13. EXPIRATION DES INVITATIONS

Une invitation doit avoir :

``` text
created_at
expires_at
used_at
status
```

États :

``` text
ACTIVE
USED
EXPIRED
REVOKED
```

------------------------------------------------------------------------

# 14. UTILISATION UNIQUE

Une invitation partenaire doit être utilisable une seule fois.

Après association :

``` text
status = USED
```

Toute tentative ultérieure doit être rejetée.

------------------------------------------------------------------------

# 15. RÈGLE DE VÉRIFICATION

Lorsqu'un utilisateur utilise un lien :

1.  vérifier le token ;
2.  vérifier qu'il n'est pas expiré ;
3.  vérifier qu'il n'est pas déjà utilisé ;
4.  vérifier que le couple existe ;
5.  vérifier qu'il reste une place ;
6.  authentifier ou créer le participant ;
7.  associer le participant ;
8.  invalider l'invitation.

------------------------------------------------------------------------

# 16. ÉVITER LE TRANSFERT SILENCIEUX

Si un utilisateur est déjà associé à un couple et tente de rejoindre un
autre couple, ne pas modifier silencieusement son association.

Afficher une confirmation explicite et appliquer les règles prévues.

------------------------------------------------------------------------

# 17. PAIEMENT

Le paiement doit créer ou activer le service.

Flux :

``` text
PAGE DE VENTE
↓
OFFRE
↓
CHECKOUT
↓
PAIEMENT
↓
PAYMENT_CONFIRMED
↓
COUPLE_CREATED
↓
ONBOARDING
```

Ne pas créer un service payant simplement parce qu'un utilisateur a
ouvert la page de checkout.

------------------------------------------------------------------------

# 18. ID DE COMMANDE

Chaque achat doit avoir :

``` text
purchase_id
payment_provider
transaction_id
amount
currency
plan
status
created_at
```

------------------------------------------------------------------------

# 19. OFFRES

Les offres doivent être configurées et non codées en dur partout.

Exemple :

``` text
ESSENTIAL
price = 30000
currency = XOF

PREMIUM_PLUS
price = 50000
currency = XOF
```

Les prix peuvent évoluer sans réécrire le moteur.

------------------------------------------------------------------------

# 20. SNAPSHOT DE L'OFFRE

Au moment de l'achat, conserver un snapshot :

``` text
plan_name
price_paid
currency
features_version
content_version
```

Cela permet de savoir exactement ce que le client a acheté même si les
prix changent plus tard.

------------------------------------------------------------------------

# 21. RÈGLE DU PREMIUM PLUS

Le système doit considérer :

``` text
PREMIUM_PLUS
=
ESSENTIAL
+
PREMIUM_PLUS_ADDITIONS
```

Ne jamais implémenter :

``` text
PREMIUM_PLUS = autre rapport indépendant
```

------------------------------------------------------------------------

# 22. DROITS PAR OFFRE

Exemple conceptuel :

``` text
ESSENTIAL
├── basic_results
├── full_report
├── core_exercises
├── core_action_plan
└── resources

PREMIUM_PLUS
├── tout ESSENTIAL
├── advanced_analysis
├── advanced_exercises
├── scenarios
├── protocols
├── relationship_charter
├── extended_action_plan
└── advanced_resources
```

------------------------------------------------------------------------

# 23. QUESTIONNAIRE

Le questionnaire doit être versionné.

Structure :

``` text
questionnaire_id
version
status
created_at
```

Les questions doivent être liées à une version précise.

------------------------------------------------------------------------

# 24. QUESTION

Chaque question doit posséder un identifiant stable.

Exemple :

``` text
COMM_001
FIN_014
CONFLICT_007
FAMILY_005
```

Ne pas dépendre du numéro visuel de la question.

------------------------------------------------------------------------

# 25. MÉTADONNÉES DE QUESTION

Une question peut contenir :

``` text
question_id
dimension
text
type
scale
reverse_scored
weight
required
order
version
```

------------------------------------------------------------------------

# 26. NE PAS MODIFIER UNE QUESTION EN PRODUCTION

Si une question importante change, créer une nouvelle version du
questionnaire.

Exemple :

``` text
QUESTIONNAIRE v1.0
QUESTIONNAIRE v1.1
QUESTIONNAIRE v2.0
```

Cela protège la reproductibilité des anciens rapports.

------------------------------------------------------------------------

# 27. RÉPONSE

Chaque réponse doit être liée à :

``` text
response_id
couple_id
participant_id
question_id
questionnaire_version
value
answered_at
```

------------------------------------------------------------------------

# 28. SÉPARATION DES RÉPONSES

Les réponses du participant 1 et du participant 2 doivent être stockées
séparément.

Ne pas fusionner les réponses avant le moteur de scoring.

------------------------------------------------------------------------

# 29. SAUVEGARDE

Chaque réponse doit être enregistrée automatiquement ou par lot
sécurisé.

L'utilisateur ne doit pas perdre son questionnaire à cause d'une
fermeture du navigateur.

------------------------------------------------------------------------

# 30. REPRISE

Conserver :

``` text
last_question_index
completion_percentage
last_saved_at
```

L'utilisateur doit pouvoir reprendre.

------------------------------------------------------------------------

# 31. QUESTIONNAIRE TERMINÉ

Un questionnaire n'est considéré comme terminé que lorsque :

``` text
required_questions_completed = true
```

Il ne suffit pas que l'utilisateur ait atteint la dernière page.

------------------------------------------------------------------------

# 32. CONTRÔLE AVANT ANALYSE

Avant de lancer le scoring :

``` text
participant_1_completed = true
participant_2_completed = true
questionnaire_versions_compatible = true
data_quality_ok = true
```

Si une condition échoue :

``` text
DO NOT START ANALYSIS
```

------------------------------------------------------------------------

# 33. MOTEUR DE SCORING

Le scoring doit être un service logique séparé.

Entrées :

``` text
participant_1_answers
participant_2_answers
questionnaire_version
scoring_engine_version
```

Sortie :

``` text
structured_scoring_result
```

------------------------------------------------------------------------

# 34. RÉSULTATS INTERMÉDIAIRES

Le système peut conserver :

``` text
individual_scores
dimension_scores
gaps
convergences
divergences
priorities
safety_flags
```

Ces données ne doivent pas être modifiées manuellement sans mécanisme
d'administration sécurisé.

------------------------------------------------------------------------

# 35. SNAPSHOT DU SCORING

Au moment de la génération du rapport, conserver :

``` text
scoring_engine_version
scoring_parameters_version
questionnaire_version
scoring_result_snapshot
```

Cela permet de reproduire le résultat.

------------------------------------------------------------------------

# 36. GÉNÉRATION DU RAPPORT

Flux :

``` text
SCORING RESULT
↓
REPORT ENGINE
↓
CONTENT LIBRARY
↓
QUALITY CHECK
↓
REPORT SNAPSHOT
↓
RENDER
```

------------------------------------------------------------------------

# 37. SNAPSHOT DU RAPPORT

Un rapport publié doit devenir un snapshot.

Pourquoi ?

Parce que la bibliothèque de contenus pourra changer.

Un ancien rapport ne doit pas changer simplement parce qu'un texte a été
modifié dans la bibliothèque.

------------------------------------------------------------------------

# 38. VERSION DU RAPPORT

Conserver :

``` text
report_id
report_version
engine_version
content_version
plan
generated_at
```

------------------------------------------------------------------------

# 39. STATUT DU RAPPORT

``` text
QUEUED
GENERATING
QUALITY_CHECK
READY
FAILED
ARCHIVED
```

------------------------------------------------------------------------

# 40. QUALITÉ AVANT PUBLICATION

Le rapport ne doit être marqué :

``` text
READY
```

qu'après :

``` text
completeness_check
consistency_check
safety_check
language_check
plan_check
```

------------------------------------------------------------------------

# 41. ÉCHEC DE GÉNÉRATION

Si le moteur échoue :

``` text
status = FAILED
```

L'utilisateur doit recevoir un message simple.

Les erreurs techniques détaillées restent dans les logs.

------------------------------------------------------------------------

# 42. RÈGLE DE NON-EXPOSITION

Ne jamais afficher à l'utilisateur :

-   stack trace ;
-   erreur SQL ;
-   exception ;
-   clé interne ;
-   nom d'une table ;
-   token ;
-   données de debug.

------------------------------------------------------------------------

# 43. STOCKAGE DES FICHIERS

Les fichiers générés doivent être stockés dans un stockage privé.

Le téléchargement doit passer par :

-   vérification d'autorisation ;
-   URL temporaire ou mécanisme équivalent ;
-   expiration du lien si nécessaire.

------------------------------------------------------------------------

# 44. RAPPORT PDF / FICHIER

Le fichier généré doit être associé à :

``` text
report_id
file_id
file_type
created_at
```

Ne pas dépendre uniquement du nom du fichier.

------------------------------------------------------------------------

# 45. NOM DU FICHIER

Exemple :

``` text
KELYA_COUPLE_Sarah_Thomas_2026-08-08.pdf
```

Éviter d'inclure :

-   email ;
-   téléphone ;
-   données sensibles.

------------------------------------------------------------------------

# 46. TÉLÉCHARGEMENT GLOBAL

Le système peut générer un dossier global :

``` text
KELYA_COUPLE_DOSSIER/
├── Rapport_complet
├── Exercices
├── Plan_action
├── Fiches
└── Charte_relationnelle
```

Le téléchargement doit respecter les droits de l'offre.

------------------------------------------------------------------------

# 47. ACCÈS AUX DOCUMENTS

Avant chaque téléchargement :

``` text
authenticated_user?
↓
belongs_to_couple?
↓
authorized_for_file?
↓
file_exists?
↓
download
```

------------------------------------------------------------------------

# 48. PROTECTION DES URL

Ne pas exposer des chemins de fichiers permanents publiquement.

Éviter :

``` text
/files/reports/12345.pdf
```

Préférer un mécanisme d'accès sécurisé.

------------------------------------------------------------------------

# 49. DONNÉES INDIVIDUELLES

Les réponses individuelles sont particulièrement sensibles.

Le système doit appliquer des règles plus strictes que pour :

``` text
nom
email
statut
```

------------------------------------------------------------------------

# 50. MATRICE DES DROITS

Conceptuellement :

  Ressource                      Participant A   Participant B   Admin autorisé
  ------------------------------ --------------- --------------- ----------------
  Son questionnaire              Oui             Oui             Selon droits
  Réponses brutes personnelles   Oui             Oui             Selon droits
  Réponses brutes partenaire     Non             Non             Selon droits
  Résultats communs              Oui             Oui             Oui
  Rapport commun                 Oui             Oui             Oui
  Plan commun                    Oui             Oui             Oui
  Paiement                       Selon rôle      Selon rôle      Selon droits

Cette matrice doit être appliquée au niveau serveur.

------------------------------------------------------------------------

# 51. NE JAMAIS FAIRE CONFIANCE AU FRONTEND

Un utilisateur ne doit pas pouvoir obtenir les données d'un autre
simplement en modifiant :

``` text
couple_id
user_id
report_id
```

Toutes les autorisations doivent être vérifiées côté serveur.

------------------------------------------------------------------------

# 52. ISOLATION DES COUPLES

Un utilisateur appartenant au couple A ne doit jamais pouvoir accéder au
couple B.

Même si l'identifiant est connu.

------------------------------------------------------------------------

# 53. ADMINISTRATION

Prévoir un espace administratif séparé.

L'administrateur autorisé peut voir :

-   statut du couple ;
-   statut du paiement ;
-   progression ;
-   statut du rapport ;
-   erreurs techniques.

L'accès aux réponses sensibles doit être strictement limité.

------------------------------------------------------------------------

# 54. JOURNALISATION

Conserver des logs techniques pour :

-   paiement confirmé ;
-   invitation créée ;
-   partenaire rejoint ;
-   questionnaire commencé ;
-   questionnaire terminé ;
-   scoring lancé ;
-   rapport généré ;
-   téléchargement ;
-   erreur.

------------------------------------------------------------------------

# 55. NE PAS LOGGER LES RÉPONSES

Les logs ne doivent pas contenir les réponses brutes du questionnaire
sauf nécessité technique exceptionnelle et sécurisée.

Éviter :

``` text
user answered question FIN_014 = 5
```

dans des logs ordinaires.

------------------------------------------------------------------------

# 56. AUDIT

Pour les opérations sensibles, conserver :

``` text
actor
action
resource
timestamp
result
```

Exemple :

``` text
user_123
DOWNLOAD_REPORT
report_456
2026-08-08T10:32:00Z
SUCCESS
```

------------------------------------------------------------------------

# 57. SUPPRESSION

Prévoir une logique de suppression conforme à la politique de
conservation.

La suppression doit pouvoir distinguer :

``` text
user account
couple
responses
scores
report
files
logs
payment records
```

Certains éléments peuvent devoir être conservés selon les obligations
applicables.

------------------------------------------------------------------------

# 58. ANONYMISATION

Lorsque les données ne sont plus nécessaires sous forme identifiante,
prévoir si pertinent :

``` text
anonymization
aggregation
deletion
```

------------------------------------------------------------------------

# 59. EXPORT DES DONNÉES

Prévoir si nécessaire une fonctionnalité permettant à l'utilisateur de
demander ses données personnelles selon les règles applicables.

L'export doit être lisible.

------------------------------------------------------------------------

# 60. CONSENTEMENT

Avant le questionnaire, présenter les informations nécessaires sur :

-   traitement des données ;
-   finalité ;
-   confidentialité ;
-   utilisation des réponses ;
-   conservation ;
-   droits.

Le texte juridique définitif doit être validé séparément.

------------------------------------------------------------------------

# 61. CONFIDENTIALITÉ DU PARTENAIRE

Un partenaire ne doit pas pouvoir consulter automatiquement :

> « Voici exactement ce que votre partenaire a répondu à la question 42.
> »

Le rapport doit privilégier l'analyse relationnelle.

------------------------------------------------------------------------

# 62. CAS SENSIBLE

Si une réponse peut révéler :

-   violence ;
-   peur ;
-   contrôle ;
-   menace ;
-   contrainte ;

ne pas la reproduire inutilement dans le rapport commun.

Le moteur doit appliquer les règles de sécurité prévues.

------------------------------------------------------------------------

# 63. SÉCURITÉ DU CODE

Le code doit être généré avec suffisamment d'entropie.

Éviter des codes simples :

``` text
123456
COUPLE01
SARAH2026
```

------------------------------------------------------------------------

# 64. LIMITATION DES TENTATIVES

Prévoir une limitation des tentatives pour :

-   codes ;
-   tokens ;
-   authentification ;
-   endpoints sensibles.

Cela réduit les risques de brute force.

------------------------------------------------------------------------

# 65. RATE LIMITING

Appliquer un rate limiting aux endpoints :

``` text
/join
/login
/invite
/report/download
/questionnaire
```

selon leur sensibilité.

------------------------------------------------------------------------

# 66. EXPIRATION DE SESSION

Les sessions doivent respecter les standards de sécurité de KELYA.

Les pages sensibles doivent vérifier l'authentification.

------------------------------------------------------------------------

# 67. CHANGEMENT D'EMAIL

Si l'utilisateur modifie son email pendant un bilan actif, appliquer les
règles d'authentification et de vérification KELYA.

Ne pas casser silencieusement les invitations existantes.

------------------------------------------------------------------------

# 68. CHANGEMENT DE PARTENAIRE

Ce cas doit être traité avec prudence.

Un couple ayant déjà commencé son questionnaire ne doit pas permettre un
changement libre de partenaire sans procédure explicite.

Prévoir un processus administratif ou support.

------------------------------------------------------------------------

# 69. ANNULATION

Si l'achat est annulé selon les règles commerciales :

``` text
purchase.status = CANCELLED
```

Puis appliquer les règles d'accès correspondantes.

------------------------------------------------------------------------

# 70. REMBOURSEMENT

Un remboursement ne doit pas être traité comme une simple suppression.

Conserver le statut financier requis et appliquer séparément :

-   accès ;
-   rapport ;
-   données ;
-   invitations.

------------------------------------------------------------------------

# 71. EXPIRATION DU SERVICE

Le service doit distinguer :

``` text
ACCESS_EXPIRED
```

de :

``` text
DATA_DELETED
```

L'expiration de l'accès interactif ne signifie pas nécessairement
suppression immédiate des données.

------------------------------------------------------------------------

# 72. DURÉE D'ACCÈS

La durée exacte doit être configurable.

Exemple de paramètre :

``` text
ACCESS_DURATION_DAYS
```

Le produit pourra ainsi changer la durée sans modification du code
principal.

------------------------------------------------------------------------

# 73. RAPPEL D'EXPIRATION

Le système peut envoyer :

``` text
J-14
J-3
J-1
```

selon les règles commerciales.

Ces rappels doivent être désactivables si nécessaire.

------------------------------------------------------------------------

# 74. EXPORT AVANT EXPIRATION

L'utilisateur doit être encouragé à télécharger son dossier avant la fin
d'accès.

CTA :

> **Télécharger mon dossier**

------------------------------------------------------------------------

# 75. GOOGLE DRIVE

Si Google Drive est intégré :

``` text
USER AUTHORIZATION
↓
GOOGLE DRIVE CONNECTION
↓
CREATE FOLDER
↓
UPLOAD FILES
↓
CONFIRM
```

Le système doit toujours proposer une alternative locale :

> **Télécharger sur mon appareil**

------------------------------------------------------------------------

# 76. PAS DE DÉPENDANCE À GOOGLE DRIVE

Le service doit fonctionner intégralement sans Google Drive.

Cette intégration est une fonctionnalité complémentaire.

------------------------------------------------------------------------

# 77. NOTIFICATIONS TECHNIQUES

Prévoir un système centralisé.

Types :

``` text
EMAIL
IN_APP
OPTIONAL_WHATSAPP
```

Les messages doivent être déclenchés par événements.

------------------------------------------------------------------------

# 78. FILE D'ÉVÉNEMENTS

Exemple :

``` text
PurchaseConfirmed
InvitationCreated
PartnerJoined
QuestionnaireCompleted
BothQuestionnairesCompleted
AnalysisCompleted
ReportReady
AccessExpiring
```

------------------------------------------------------------------------

# 79. ARCHITECTURE ÉVÉNEMENTIELLE

Conceptuellement :

``` text
EVENT
↓
EVENT HANDLER
↓
ACTION
```

Exemple :

``` text
BothQuestionnairesCompleted
↓
StartAnalysis
```

Puis :

``` text
ReportReady
↓
NotifyParticipants
```

------------------------------------------------------------------------

# 80. GÉNÉRATION ASYNCHRONE

La génération du rapport peut être asynchrone.

Flux :

``` text
QUESTIONNAIRE_COMPLETED
↓
QUEUE
↓
SCORING
↓
REPORT_GENERATION
↓
QUALITY_CHECK
↓
READY
```

Cela évite de bloquer l'utilisateur.

------------------------------------------------------------------------

# 81. RETRY

En cas d'erreur temporaire :

``` text
RETRY
```

avec une limite.

Éviter les boucles infinies.

------------------------------------------------------------------------

# 82. IDEMPOTENCE

Les opérations importantes doivent pouvoir être relancées sans créer de
doublons.

Exemples :

-   génération du rapport ;
-   notification ;
-   création de fichier ;
-   paiement confirmé.

------------------------------------------------------------------------

# 83. DUPLICATION DE RAPPORT

Si l'utilisateur actualise la page pendant la génération, le système ne
doit pas générer trois rapports identiques.

Utiliser :

``` text
report_generation_job_id
```

ou un mécanisme d'idempotence équivalent.

------------------------------------------------------------------------

# 84. BACKUP

Prévoir une stratégie de sauvegarde pour :

-   données utilisateurs ;
-   données couples ;
-   questionnaires ;
-   résultats ;
-   rapports.

Les backups doivent être protégés.

------------------------------------------------------------------------

# 85. ENVIRONNEMENTS

Prévoir :

``` text
DEVELOPMENT
STAGING
PRODUCTION
```

Ne jamais tester des modifications dangereuses directement en
production.

------------------------------------------------------------------------

# 86. DONNÉES FICTIVES EN STAGING

Les exemples de développement doivent utiliser des données fictives.

Ne pas copier des données réelles dans l'environnement de test.

------------------------------------------------------------------------

# 87. TESTS

Le module doit avoir des tests automatisés pour :

### Création de couple

Vérifier qu'un couple est correctement créé.

### Invitation

Vérifier qu'une invitation ne peut être utilisée qu'une fois.

### Deuxième partenaire

Vérifier qu'un deuxième participant peut rejoindre.

### Troisième participant

Vérifier que l'association est refusée.

### Questionnaire

Vérifier la sauvegarde et la reprise.

### Scoring

Vérifier les résultats connus.

### Rapport

Vérifier la présence de toutes les sections.

### Accès

Vérifier qu'un participant ne voit pas les données d'un autre couple.

------------------------------------------------------------------------

# 88. TEST DU CAS « ACHETEUR = PARTICIPANT 2 »

Créer explicitement un test dans lequel :

``` text
Sarah = participant 1
Thomas = participant 2
Thomas = purchaser
```

Le système doit fonctionner exactement comme lorsque Sarah achète.

------------------------------------------------------------------------

# 89. TEST DU CAS « INVITATION »

Tester :

``` text
Sarah achète
↓
Sarah crée invitation
↓
Thomas rejoint
↓
Sarah questionnaire
↓
Thomas questionnaire
↓
analyse
↓
rapport
```

------------------------------------------------------------------------

# 90. TEST DU CAS « CODE UTILISÉ »

Tester :

``` text
Thomas rejoint
↓
code = USED
↓
Laura tente de rejoindre
↓
REFUSED
```

------------------------------------------------------------------------

# 91. TEST DU CAS « CODE EXPIRÉ »

Tester :

``` text
token expired
↓
join attempt
↓
REFUSED
```

------------------------------------------------------------------------

# 92. TEST DU CAS « SCORE 15 % »

Vérifier que le moteur produit :

``` text
score faible
+
analyse détaillée
+
priorités
+
actions
```

et jamais :

``` text
incompatibilité automatique
```

------------------------------------------------------------------------

# 93. TEST DU CAS « PREMIUM PLUS »

Vérifier :

``` text
Premium Plus
=
toutes les sections Essential
+
sections avancées
```

Le test doit échouer si une section Essentiel disparaît.

------------------------------------------------------------------------

# 94. TEST DE VERSIONNAGE

Créer un questionnaire v1 puis v2.

Vérifier qu'un ancien rapport continue de référencer :

``` text
questionnaire_version = v1
```

même après publication de v2.

------------------------------------------------------------------------

# 95. TEST DE BIBLIOTHÈQUE DE CONTENU

Modifier un contenu dans la bibliothèque.

Vérifier qu'un ancien rapport snapshot ne change pas.

------------------------------------------------------------------------

# 96. TEST DE SÉCURITÉ

Tester notamment :

-   accès à un autre couple ;
-   modification d'un couple_id ;
-   modification d'un report_id ;
-   réutilisation d'un token ;
-   téléchargement sans autorisation ;
-   accès sans authentification.

Toutes les tentatives doivent être bloquées.

------------------------------------------------------------------------

# 97. TEST DE CONFIDENTIALITÉ

Vérifier qu'un participant ne peut pas obtenir :

-   réponses brutes du partenaire ;
-   notes privées ;
-   informations internes ;
-   tokens ;
-   données techniques.

------------------------------------------------------------------------

# 98. TEST DE RÉSILIENCE

Tester :

-   perte de connexion ;
-   rafraîchissement ;
-   fermeture de navigateur ;
-   double clic ;
-   double paiement simulé ;
-   génération interrompue.

Le système doit conserver un état cohérent.

------------------------------------------------------------------------

# 99. OBSERVABILITÉ

Prévoir :

-   logs ;
-   métriques ;
-   alertes ;
-   monitoring des jobs ;
-   erreurs de paiement ;
-   erreurs de génération.

------------------------------------------------------------------------

# 100. ALERTES

Prévoir des alertes techniques pour :

-   taux d'échec élevé des rapports ;
-   paiements échoués ;
-   génération bloquée ;
-   erreurs de stockage ;
-   temps de traitement anormal ;
-   tentatives d'accès non autorisées.

------------------------------------------------------------------------

# 101. PERFORMANCE

Objectifs à définir après mesure, mais le système doit viser :

-   questionnaire fluide ;
-   sauvegarde quasi immédiate ;
-   dashboard rapide ;
-   génération de rapport asynchrone ;
-   téléchargement fiable.

------------------------------------------------------------------------

# 102. CACHE

Le cache peut être utilisé pour :

-   contenus statiques ;
-   bibliothèque publique ;
-   configuration non sensible.

Éviter de mettre en cache de manière non sécurisée :

-   réponses ;
-   rapports privés ;
-   données sensibles.

------------------------------------------------------------------------

# 103. BASE DE DONNÉES --- MODÈLE CONCEPTUEL

Tables ou collections principales :

``` text
users
couples
couple_participants
purchases
invitations
questionnaires
questions
responses
scoring_runs
scoring_results
reports
report_files
exercises
action_plans
notifications
audit_logs
```

Les noms exacts peuvent suivre les conventions techniques du projet.

------------------------------------------------------------------------

# 104. COUPLE_PARTICIPANTS

Cette entité permet de gérer proprement :

``` text
couple_id
user_id
role
joined_at
status
```

Le rôle doit rester neutre :

``` text
PARTICIPANT
PURCHASER
```

et non :

``` text
HOMME
FEMME
```

------------------------------------------------------------------------

# 105. PURCHASES

Une commande peut contenir :

``` text
purchase_id
user_id
product_id
plan
amount
currency
status
provider
provider_transaction_id
created_at
```

------------------------------------------------------------------------

# 106. INVITATIONS

Structure :

``` text
invitation_id
couple_id
token_hash
created_by
created_at
expires_at
used_at
status
```

Stocker de préférence une représentation sécurisée du token plutôt que
le token en clair lorsque l'architecture le permet.

------------------------------------------------------------------------

# 107. RESPONSES

Structure conceptuelle :

``` text
response_id
couple_id
participant_id
question_id
questionnaire_version
answer_value
created_at
updated_at
```

------------------------------------------------------------------------

# 108. SCORING_RUNS

``` text
scoring_run_id
couple_id
questionnaire_version
engine_version
started_at
completed_at
status
```

------------------------------------------------------------------------

# 109. REPORTS

``` text
report_id
couple_id
plan
report_engine_version
content_version
scoring_run_id
status
generated_at
published_at
```

------------------------------------------------------------------------

# 110. REPORT_FILES

``` text
file_id
report_id
file_type
storage_key
created_at
expires_at
```

------------------------------------------------------------------------

# 111. ACTION PLANS

``` text
action_plan_id
couple_id
plan
version
created_at
updated_at
```

Les actions peuvent être des entités enfants.

------------------------------------------------------------------------

# 112. EXERCISES

Les exercices doivent être liés à une bibliothèque de contenu.

``` text
exercise_id
content_key
version
status
```

Le couple peut ensuite avoir :

``` text
couple_exercise
status
started_at
completed_at
```

------------------------------------------------------------------------

# 113. NOTIFICATIONS

``` text
notification_id
user_id
type
channel
status
created_at
sent_at
```

------------------------------------------------------------------------

# 114. AUDIT LOG

``` text
audit_id
actor_id
action
resource_type
resource_id
timestamp
result
metadata
```

Ne pas y stocker de contenu sensible inutile.

------------------------------------------------------------------------

# 115. CONFIGURATION CENTRALISÉE

Les paramètres suivants doivent être configurables :

``` text
offer_prices
access_duration
invitation_duration
questionnaire_versions
scoring_versions
report_versions
content_versions
notification_rules
```

------------------------------------------------------------------------

# 116. PAS DE VALEURS MAGIQUES

Éviter :

``` text
if score > 75
if access_days == 30
if plan == "50000"
```

dans plusieurs fichiers.

Utiliser une configuration centralisée.

------------------------------------------------------------------------

# 117. FEATURE FLAGS

Prévoir si utile :

``` text
google_drive_export
premium_plus
advanced_scenarios
relationship_charter
new_questionnaire
new_report_engine
```

Cela facilite le déploiement progressif.

------------------------------------------------------------------------

# 118. DÉPLOIEMENT

Déployer les nouvelles versions progressivement.

Pour un changement important :

``` text
STAGING
↓
TEST
↓
VALIDATION
↓
PRODUCTION
```

------------------------------------------------------------------------

# 119. MIGRATIONS

Toute modification de structure de données doit être accompagnée d'une
migration.

Ne jamais modifier manuellement la production sans traçabilité.

------------------------------------------------------------------------

# 120. COMPATIBILITÉ

Une nouvelle version du moteur doit rester compatible avec les anciens
résultats lorsque cela est prévu.

Sinon, créer une nouvelle version clairement identifiée.

------------------------------------------------------------------------

# 121. RÈGLE DE MAINTENABILITÉ

Le développeur ne doit pas construire KELYA COUPLE comme un bloc
monolithique.

Séparer :

``` text
auth
payments
couples
invitations
questionnaires
scoring
reports
files
notifications
analytics
```

------------------------------------------------------------------------

# 122. API INTERNE CONCEPTUELLE

Prévoir des services équivalents à :

``` text
createCouple()
createInvitation()
joinCouple()
getCoupleStatus()
saveResponse()
completeQuestionnaire()
startScoring()
generateReport()
getResults()
getReport()
downloadReport()
getExercises()
completeExercise()
getActionPlan()
```

Les noms exacts peuvent suivre le framework utilisé.

------------------------------------------------------------------------

# 123. RÈGLE D'AUTORISATION API

Chaque endpoint doit vérifier :

``` text
AUTHENTICATED
+
AUTHORIZED
+
RESOURCE_EXISTS
+
RESOURCE_BELONGS_TO_USER
```

------------------------------------------------------------------------

# 124. RÈGLE DE VALIDATION

Toute donnée reçue du frontend doit être validée côté serveur.

Ne jamais faire confiance :

-   au plan envoyé ;
-   au prix envoyé ;
-   au couple_id envoyé ;
-   au participant_id envoyé ;
-   au statut envoyé ;
-   au report_id envoyé.

------------------------------------------------------------------------

# 125. PRIX

Le montant final doit être déterminé côté serveur à partir de l'offre
sélectionnée.

Le frontend ne doit pas pouvoir dire :

``` text
plan = PREMIUM_PLUS
price = 1 FCFA
```

------------------------------------------------------------------------

# 126. PLAN

Le plan accordé doit être issu de la commande confirmée.

Ne pas accepter simplement :

``` text
plan=PREMIUM_PLUS
```

envoyé depuis le navigateur.

------------------------------------------------------------------------

# 127. ACCÈS AU RAPPORT

L'accès doit dépendre de :

``` text
purchase.status
+
couple membership
+
report.status
+
access period
```

------------------------------------------------------------------------

# 128. RÈGLE DE FIN DE SERVICE

Lorsque l'accès expire :

``` text
interactive_access = false
```

mais le système doit conserver les règles de conservation des données.

------------------------------------------------------------------------

# 129. RÉACTIVATION

Si une réactivation est vendue plus tard, elle doit être traitée comme
une opération explicite.

Ne pas modifier manuellement :

``` text
access_expires_at
```

sans historique.

------------------------------------------------------------------------

# 130. HISTORIQUE D'ACCÈS

Conserver si nécessaire :

``` text
access_grants
access_revocations
access_extensions
```

Cela permet de comprendre pourquoi un utilisateur a encore accès.

------------------------------------------------------------------------

# 131. SUPPORT TECHNIQUE

Le support doit pouvoir rechercher un couple avec :

-   référence du couple ;
-   email ;
-   référence de commande.

Mais l'accès aux réponses sensibles doit rester limité.

------------------------------------------------------------------------

# 132. RÉFÉRENCE SUPPORT

Afficher au support :

``` text
Couple : KLY-CPL-8F42Q
Commande : KLY-ORD-1234
Rapport : KLY-RPT-7788
```

Ces références facilitent les échanges.

------------------------------------------------------------------------

# 133. ADMIN --- ACTIONS DANGEREUSES

Les actions suivantes doivent demander confirmation :

-   supprimer couple ;
-   modifier participant ;
-   annuler accès ;
-   régénérer rapport ;
-   supprimer données ;
-   révoquer invitation.

------------------------------------------------------------------------

# 134. DOUBLE VALIDATION

Pour les opérations critiques, prévoir si nécessaire :

``` text
confirmation
+
audit
```

et éventuellement une autorisation renforcée.

------------------------------------------------------------------------

# 135. RÉGÉNÉRATION DE RAPPORT

Une régénération doit créer une nouvelle version ou un nouveau snapshot.

Ne pas écraser silencieusement un rapport déjà publié.

------------------------------------------------------------------------

# 136. CORRECTION D'ERREUR

Si une erreur est détectée dans un rapport :

``` text
identify version
↓
correct content/engine
↓
regenerate
↓
publish new version
↓
preserve audit trail
```

------------------------------------------------------------------------

# 137. RÈGLE DE TRAÇABILITÉ

Pour chaque rapport, pouvoir répondre :

> Avec quelles réponses ?

> Avec quelle version du questionnaire ?

> Avec quelle version du scoring ?

> Avec quelle version du contenu ?

> Avec quelle offre ?

> À quelle date ?

------------------------------------------------------------------------

# 138. DONNÉES MINIMALES

Le système doit respecter le principe :

> ne collecter que ce qui est nécessaire au fonctionnement du service.

Cela réduit :

-   risque ;
-   coût ;
-   complexité ;
-   exposition.

------------------------------------------------------------------------

# 139. RÈGLE DE TEST DES DONNÉES

Les développeurs doivent utiliser des données fictives en développement.

Exemple :

``` text
Sarah Martin
sarah@example.test

Thomas Martin
thomas@example.test
```

Ne pas utiliser de véritables données clients.

------------------------------------------------------------------------

# 140. RÈGLE DE DÉBOGAGE

Le mode debug ne doit jamais exposer les réponses sensibles dans
l'interface utilisateur.

------------------------------------------------------------------------

# 141. RÈGLE DE MONITORING

Surveiller au minimum :

``` text
purchase_success_rate
invitation_join_rate
questionnaire_completion_rate
analysis_success_rate
report_generation_success_rate
download_success_rate
```

------------------------------------------------------------------------

# 142. FUNNEL TECHNIQUE

Le produit doit pouvoir mesurer :

``` text
LANDING
↓
OFFER
↓
CHECKOUT
↓
PURCHASE
↓
INVITE
↓
PARTNER_JOIN
↓
QUESTIONNAIRE_A
↓
QUESTIONNAIRE_B
↓
REPORT
↓
DOWNLOAD
```

------------------------------------------------------------------------

# 143. INDICATEUR CRITIQUE

Le taux :

``` text
PARTNER_JOIN / PURCHASE
```

est particulièrement important.

Si beaucoup de personnes achètent mais n'invitent pas leur partenaire,
l'expérience d'onboarding doit être améliorée.

------------------------------------------------------------------------

# 144. DEUXIÈME INDICATEUR CRITIQUE

Le taux :

``` text
BOTH_COMPLETED / PARTNER_JOIN
```

permet de mesurer les abandons pendant le questionnaire.

------------------------------------------------------------------------

# 145. TROISIÈME INDICATEUR CRITIQUE

Le taux :

``` text
REPORT_DOWNLOADED / REPORT_READY
```

permet de comprendre si le rapport est réellement utilisé.

------------------------------------------------------------------------

# 146. ARCHITECTURE DE RÉFÉRENCE

Vue globale :

``` text
                    KELYA
                      │
          ┌───────────┴───────────┐
          │                       │
       AUTH                    PAYMENTS
          │                       │
          └───────────┬───────────┘
                      │
                KELYA COUPLE
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     COUPLES      INVITATIONS   QUESTIONNAIRES
        │             │             │
        └─────────────┼─────────────┘
                      │
                 RESPONSES
                      │
                 SCORING ENGINE
                      │
                 MATCHING ENGINE
                      │
                 REPORT ENGINE
                      │
                QUALITY CHECK
                      │
                REPORT SNAPSHOT
                      │
            ┌─────────┴─────────┐
            │                   │
        WEB RESULTS        DOWNLOADS
```

------------------------------------------------------------------------

# 147. PRINCIPE D'EXTENSIBILITÉ

L'architecture doit pouvoir accueillir plus tard :

-   autres types de bilans ;
-   nouveaux questionnaires ;
-   nouvelles offres ;
-   nouveaux formats de rapports ;
-   nouveaux exercices ;
-   nouveaux professionnels partenaires.

Mais il ne faut pas surconstruire dès maintenant.

------------------------------------------------------------------------

# 148. CE QUI DOIT ÊTRE CONFIGURABLE

``` text
PRIX
DURÉE D'ACCÈS
DURÉE INVITATION
QUESTIONS
SCORING
CONTENU
RAPPORT
NOTIFICATIONS
```

------------------------------------------------------------------------

# 149. CE QUI DOIT RESTER CENTRALISÉ

Les règles critiques doivent avoir une source de vérité unique :

-   identité du couple ;
-   participant ;
-   paiement ;
-   droits ;
-   scoring ;
-   version du rapport.

------------------------------------------------------------------------

# 150. CE QUI NE DOIT PAS ÊTRE DUPLIQUÉ

Éviter de réécrire dans plusieurs endroits :

-   logique de prix ;
-   logique d'accès ;
-   règles de scoring ;
-   règles Premium Plus ;
-   règles d'expiration ;
-   droits utilisateur.

------------------------------------------------------------------------

# 151. CRITÈRES D'ACCEPTATION TECHNIQUES

Le module est considéré comme fonctionnel lorsque :

``` text
✓ un utilisateur peut acheter
✓ un couple est créé
✓ une invitation est créée
✓ un partenaire rejoint
✓ le code est limité à deux personnes
✓ chacun répond séparément
✓ les réponses sont sauvegardées
✓ les deux questionnaires sont validés
✓ le scoring est lancé
✓ le matching est calculé
✓ le rapport est généré
✓ les contrôles qualité passent
✓ le rapport est disponible
✓ les exercices sont accessibles
✓ les téléchargements fonctionnent
✓ Premium Plus contient tout Essentiel
✓ les droits d'accès sont respectés
✓ les données du partenaire restent protégées
✓ l'expiration fonctionne
✓ les logs existent
✓ les erreurs sont gérées
```

------------------------------------------------------------------------

# 152. CRITÈRES DE SÉCURITÉ

Avant production :

``` text
✓ tests d'autorisation
✓ tests d'isolation des couples
✓ tests de tokens
✓ tests de téléchargement
✓ tests de session
✓ tests de rate limiting
✓ tests d'injection
✓ tests de validation serveur
✓ tests de confidentialité
✓ tests de suppression
```

Les tests de sécurité doivent être réalisés dans l'environnement
approprié.

------------------------------------------------------------------------

# 153. RÈGLE FINALE

KELYA COUPLE doit être construit comme un **service de données sensibles
à forte personnalisation**, et non comme un simple formulaire avec un
résultat à la fin.

La qualité du produit dépend de la cohérence entre :

``` text
EXPÉRIENCE
+
DONNÉES
+
SCORING
+
MATCHING
+
RAPPORT
+
SÉCURITÉ
```

Si l'un de ces éléments est faible, la qualité globale du service
baisse.

------------------------------------------------------------------------

# 154. INSTRUCTIONS FINALES POUR CURSOR

Cursor doit considérer ce document comme la référence technique
fonctionnelle de KELYA COUPLE.

Il doit :

1.  intégrer KELYA COUPLE à l'architecture KELYA existante ;
2.  conserver la séparation entre utilisateurs et couples ;
3.  permettre à n'importe lequel des deux partenaires d'acheter ;
4.  limiter chaque bilan à deux participants ;
5.  utiliser un système sécurisé de lien et de code d'invitation ;
6.  empêcher toute troisième association ;
7.  versionner les questionnaires ;
8.  versionner le scoring ;
9.  versionner le contenu ;
10. versionner les rapports ;
11. sauvegarder les réponses ;
12. permettre la reprise du questionnaire ;
13. séparer les réponses individuelles ;
14. protéger les réponses du partenaire ;
15. vérifier toutes les autorisations côté serveur ;
16. ne jamais faire confiance aux paramètres envoyés par le frontend ;
17. déterminer les prix côté serveur ;
18. appliquer les droits selon la commande confirmée ;
19. faire de Premium Plus une extension cumulative d'Essentiel ;
20. générer les rapports de manière traçable ;
21. créer des snapshots des rapports ;
22. sécuriser les téléchargements ;
23. gérer l'expiration ;
24. conserver une politique de données distincte de la durée d'accès ;
25. prévoir les exports ;
26. prévoir les logs sans données sensibles inutiles ;
27. prévoir les tests automatisés ;
28. prévoir les tests de sécurité ;
29. prévoir les états d'erreur ;
30. prévoir les mécanismes de retry et d'idempotence ;
31. utiliser des données fictives en développement ;
32. séparer développement, staging et production ;
33. centraliser les paramètres configurables ;
34. éviter les valeurs magiques ;
35. maintenir une architecture modulaire ;
36. préserver la compatibilité avec les autres fonctionnalités KELYA ;
37. garantir qu'un rapport ancien reste reproductible ;
38. garantir qu'un utilisateur ne puisse accéder qu'aux données
    auxquelles il est autorisé ;
39. traiter les données relationnelles comme des données sensibles ;
40. privilégier une architecture simple, robuste et maintenable plutôt
    qu'une architecture inutilement complexe.

------------------------------------------------------------------------

# 155. DOCUMENTS ASSOCIÉS

``` text
01_NAMING_ET_POSITIONNEMENT_KELYA_COUPLE.md
02_ARCHITECTURE_PRODUIT_KELYA_COUPLE.md
03_PARCOURS_UTILISATEUR_KELYA_COUPLE.md
04_MOTEUR_MATCHING_ET_SCORING_KELYA_COUPLE.md
05_MOTEUR_GENERATION_RAPPORTS_KELYA_COUPLE.md
06_INTERFACE_ET_EXPERIENCE_KELYA_COUPLE.md
07_ARCHITECTURE_TECHNIQUE_DONNEES_SECURITE_KELYA_COUPLE.md
```

------------------------------------------------------------------------

# FIN DU DOCUMENT 07
