# 06 --- INTERFACE, EXPÉRIENCE ET DESIGN SYSTEM

# KELYA COUPLE™

## Architecture UX/UI du service, onboarding, espace couple, résultats et expérience mobile

**Document maître pour concevoir l'expérience utilisateur de KELYA
COUPLE™ dans l'écosystème KELYA**

------------------------------------------------------------------------

# 1. OBJECTIF DU DOCUMENT

Ce document définit la manière dont KELYA COUPLE doit être présenté et
vécu dans l'interface.

KELYA COUPLE est un service distinct dans l'offre KELYA, mais il doit
rester visuellement et techniquement cohérent avec l'identité globale de
KELYA.

L'utilisateur doit comprendre immédiatement :

> **« Je suis toujours dans KELYA, mais je suis dans un espace dédié à
> mon bilan de couple. »**

Le service ne doit donc pas ressembler à une application étrangère
intégrée artificiellement.

Il doit être conçu comme :

> **une expérience KELYA spécialisée.**

------------------------------------------------------------------------

# 2. PRINCIPLE D'ARCHITECTURE

KELYA COUPLE possède :

-   sa propre page de présentation ;
-   sa propre page de vente ;
-   son propre tunnel d'achat ;
-   son propre onboarding ;
-   son propre espace de bilan ;
-   son propre espace de résultats ;
-   son propre rapport ;
-   ses propres exercices ;
-   ses propres ressources.

Mais l'ensemble doit respecter :

-   identité visuelle KELYA ;
-   typographie KELYA ;
-   couleurs KELYA ;
-   composants KELYA ;
-   principes d'accessibilité KELYA ;
-   navigation globale lorsque celle-ci est pertinente.

------------------------------------------------------------------------

# 3. NE PAS CRÉER UNE DEUXIÈME APPLICATION VISUELLE

Le service ne doit pas donner l'impression que l'utilisateur vient
d'être envoyé vers un autre logiciel.

Éviter :

-   nouveau logo totalement différent ;
-   nouvelle identité graphique ;
-   nouvelle logique de navigation ;
-   couleurs étrangères à KELYA ;
-   interface sans rapport avec le reste du produit.

Le bon principe est :

``` text
KELYA
│
└── KELYA COUPLE™
      │
      ├── Présentation
      ├── Achat
      ├── Onboarding
      ├── Bilan
      ├── Résultats
      └── Rapport
```

------------------------------------------------------------------------

# 4. ESPACE DÉDIÉ

Même si KELYA COUPLE utilise l'infrastructure de KELYA, l'espace de
travail doit être visuellement isolé.

Une fois le service lancé, l'utilisateur doit avoir l'impression
d'entrer dans :

> **son espace de bilan de couple.**

La navigation doit donc être simplifiée.

Éviter de montrer inutilement :

-   toutes les fonctionnalités KELYA ;
-   les programmes non liés ;
-   les notifications sans rapport ;
-   les autres espaces membres.

------------------------------------------------------------------------

# 5. POURQUOI CETTE ISOLATION EST IMPORTANTE

Le couple vient avec une intention précise.

Il doit pouvoir :

1.  comprendre ce qu'il doit faire ;
2.  voir où il en est ;
3.  inviter son partenaire ;
4.  compléter son questionnaire ;
5.  attendre le partenaire ;
6.  consulter les résultats ;
7.  télécharger son dossier.

Chaque étape doit être évidente.

------------------------------------------------------------------------

# 6. PAGE D'ENTRÉE KELYA COUPLE

La page doit expliquer en quelques secondes :

> **Comprendre votre compatibilité. Clarifier vos différences.
> Construire avec plus de conscience.**

Puis expliquer brièvement :

-   ce que mesure le bilan ;
-   pour qui il est conçu ;
-   comment les deux partenaires participent ;
-   ce qu'ils reçoivent ;
-   les deux niveaux d'offre.

------------------------------------------------------------------------

# 7. STRUCTURE DE LA PAGE DE PRÉSENTATION

``` text
Hero
↓
Promesse
↓
Comment ça fonctionne
↓
Ce que le bilan analyse
↓
Ce que vous recevez
↓
Différence entre les offres
↓
Pourquoi le score n'est pas un verdict
↓
Confidentialité
↓
Questions fréquentes
↓
Choix de l'offre
```

------------------------------------------------------------------------

# 8. HERO

Le hero doit être émotionnel sans être dramatique.

Exemple :

> **Et si vous preniez le temps de comprendre votre relation avant de
> simplement avancer ?**

Sous-titre :

> KELYA COUPLE vous aide à explorer vos convergences, vos différences,
> vos besoins et vos principaux sujets de travail à travers un bilan
> personnalisé réalisé à deux.

CTA :

> **Commencer mon bilan de couple**

Second CTA éventuel :

> **Découvrir les offres**

------------------------------------------------------------------------

# 9. PROMESSE

La promesse doit rester réaliste.

Éviter :

> « Découvrez si vous êtes faits l'un pour l'autre. »

Préférer :

> **« Découvrez comment vous fonctionnez ensemble, ce qui vous rapproche
> et les sujets qui méritent d'être clarifiés avant de construire la
> suite. »**

------------------------------------------------------------------------

# 10. MESSAGE CLÉ

Le site doit expliquer très tôt :

> **Le score n'est pas un verdict.**

Puis :

> Un couple peut obtenir un résultat faible tout en disposant de
> ressources importantes. Un résultat élevé ne garantit pas non plus une
> relation sans difficulté.

Puis :

> Le véritable intérêt du bilan se trouve dans l'analyse détaillée des
> dimensions qui composent votre résultat.

------------------------------------------------------------------------

# 11. COMMENT ÇA FONCTIONNE

Présenter quatre étapes.

### 01 --- Achetez le bilan

Une seule personne peut effectuer l'achat.

Il n'existe pas de notion de « premier partenaire obligatoire ».

### 02 --- Invitez votre partenaire

L'acheteur obtient :

-   un lien d'invitation ;
-   un code unique de couple.

### 03 --- Vous répondez chacun séparément

Les deux partenaires remplissent leur questionnaire de manière
individuelle.

### 04 --- Le système croise vos réponses

Une fois les deux questionnaires terminés, le moteur produit le bilan du
couple.

------------------------------------------------------------------------

# 12. CODE DE COUPLE

Le code est un identifiant temporaire de participation.

Exemple :

``` text
KLY-CPL-8F42Q
```

Le code doit :

-   être unique ;
-   ne permettre que deux participants ;
-   être associé à une commande ;
-   expirer selon les règles du produit ;
-   ne pas être réutilisable pour un troisième participant.

------------------------------------------------------------------------

# 13. LIEN D'INVITATION

L'acheteur doit pouvoir choisir :

> **Inviter par lien**

ou :

> **Partager mon code**

Le lien doit ouvrir directement une page d'entrée partenaire.

------------------------------------------------------------------------

# 14. MESSAGE D'INVITATION

Le système doit pouvoir générer un message prêt à copier.

Exemple :

> **Je viens de commencer notre bilan KELYA COUPLE. J'aimerais que tu
> répondes toi aussi au questionnaire afin que nous puissions recevoir
> notre analyse complète. Tu peux rejoindre notre bilan avec ce lien :
> \[LIEN\].**

Le message doit rester simple.

------------------------------------------------------------------------

# 15. PARTENAIRE INVITÉ

Le partenaire ne doit pas avoir besoin de connaître toute l'architecture
KELYA.

Il doit voir :

> **Vous avez été invité(e) à participer au bilan KELYA COUPLE de
> \[Prénom\].**

Puis :

> « Vos réponses seront analysées avec celles de votre partenaire afin
> de construire votre bilan commun. »

------------------------------------------------------------------------

# 16. CONFIDENTIALITÉ AVANT LE QUESTIONNAIRE

Avant de commencer, afficher clairement :

> **Vos réponses sont personnelles.**

Puis expliquer :

> Les réponses individuelles servent à construire l'analyse du couple.
> L'interface ne doit pas exposer inutilement les réponses brutes de
> l'autre partenaire.

Cette règle doit être traitée comme une règle produit, pas seulement
comme un texte marketing.

------------------------------------------------------------------------

# 17. ONBOARDING APRÈS ACHAT

L'onboarding est une partie essentielle de l'expérience.

Il doit commencer par une sensation de :

-   félicitation ;
-   progression ;
-   clarté ;
-   confiance ;
-   anticipation.

Ne pas ouvrir directement sur un formulaire froid.

------------------------------------------------------------------------

# 18. ÉCRAN DE FÉLICITATIONS

Exemple :

> **Félicitations, votre bilan est lancé.**

Puis :

> Vous venez de faire un choix important : prendre un temps pour mieux
> comprendre votre relation.

Puis :

> **Il reste quelques étapes avant de découvrir votre bilan.**

CTA :

> **Découvrir mon parcours**

------------------------------------------------------------------------

# 19. TIMELINE D'ONBOARDING

Afficher visuellement :

``` text
✓ Votre commande
↓
02 Inviter votre partenaire
↓
03 Répondre au questionnaire
↓
04 Attendre les deux réponses
↓
05 Analyse du couple
↓
06 Découvrir votre bilan
```

La progression doit être animée avec sobriété.

------------------------------------------------------------------------

# 20. MICRO-INTERACTIONS

Les animations peuvent accompagner :

-   validation d'une étape ;
-   invitation envoyée ;
-   partenaire rejoint ;
-   questionnaire terminé ;
-   analyse lancée ;
-   rapport disponible.

Les animations doivent rester élégantes.

Éviter les animations permanentes ou distrayantes.

------------------------------------------------------------------------

# 21. TABLEAU DE BORD PRINCIPAL

Le dashboard doit répondre immédiatement :

> **Où en sommes-nous ?**

Structure :

``` text
Bonjour [Prénom]
Votre bilan de couple

Progression : 60 %

✓ Achat
✓ Invitation
✓ Votre questionnaire
○ Questionnaire partenaire
○ Analyse
○ Rapport
```

------------------------------------------------------------------------

# 22. ÉTAT « EN ATTENTE DU PARTENAIRE »

Afficher :

> **Votre questionnaire est terminé.**

Puis :

> Votre bilan sera généré lorsque les deux questionnaires auront été
> complétés.

CTA :

> **Renvoyer l'invitation**

et :

> **Copier le lien**

------------------------------------------------------------------------

# 23. ÉTAT « PARTENAIRE REJOINT »

Afficher :

> **Votre partenaire a rejoint le bilan.**

Puis :

> Il ne reste plus qu'à terminer les questionnaires avant de lancer
> votre analyse.

Cela crée une sensation de progression.

------------------------------------------------------------------------

# 24. ÉTAT « VOTRE QUESTIONNAIRE »

Afficher :

> **Votre questionnaire**

avec :

-   nombre de questions ;
-   progression ;
-   temps estimé ;
-   bouton reprendre ;
-   statut.

Exemple :

> 32 / 60 questions

------------------------------------------------------------------------

# 25. SAUVEGARDE AUTOMATIQUE

Les réponses doivent être sauvegardées automatiquement.

Afficher discrètement :

> **Réponse enregistrée**

Ne pas interrompre l'expérience avec des fenêtres répétitives.

------------------------------------------------------------------------

# 26. REPRISE DU QUESTIONNAIRE

Si l'utilisateur quitte :

> **Vous pouvez reprendre là où vous vous êtes arrêté(e).**

Le système doit conserver la progression selon les règles de stockage
définies.

------------------------------------------------------------------------

# 27. ÉCRAN DE QUESTION

Chaque question doit être lisible sur mobile.

Structure :

``` text
Question 24 / 60

Lorsque nous sommes en désaccord...

[ Réponse 1 ]
[ Réponse 2 ]
[ Réponse 3 ]
[ Réponse 4 ]
[ Réponse 5 ]

← Retour       Continuer →
```

------------------------------------------------------------------------

# 28. PROGRESSION

Afficher :

-   numéro ;
-   pourcentage ;
-   barre de progression.

Éviter les barres qui donnent l'impression de ne jamais avancer.

------------------------------------------------------------------------

# 29. FIN DU QUESTIONNAIRE

Après la dernière question :

> **Votre partie est terminée.**

Puis :

> Merci d'avoir pris le temps de répondre avec sincérité.

Puis :

> Votre partenaire doit également terminer son questionnaire avant que
> nous puissions analyser votre dynamique à deux.

CTA :

> **Voir l'état de notre bilan**

------------------------------------------------------------------------

# 30. ATTENTE DE L'ANALYSE

Lorsque les deux questionnaires sont terminés :

> **Vos réponses sont prêtes.**

Puis une animation :

> **Nous construisons maintenant votre bilan personnalisé.**

Le système peut afficher plusieurs étapes :

``` text
Analyse des réponses
✓
Analyse des convergences
✓
Analyse des différences
✓
Identification des priorités
✓
Préparation du rapport
...
```

------------------------------------------------------------------------

# 31. ÉVITER LA FAUSSE IA

Ne pas afficher une animation interminable prétendant que l'IA «
réfléchit » pendant plusieurs minutes si le traitement est instantané.

L'expérience doit être honnête.

------------------------------------------------------------------------

# 32. RÉVÉLATION DU RAPPORT

La révélation doit être un moment important.

Exemple :

> **Votre bilan est prêt.**

Puis :

> Vous pouvez maintenant découvrir ce qui ressort de vos réponses, ce
> qui vous rapproche et les sujets que vous pouvez choisir de travailler
> ensemble.

CTA :

> **Découvrir mon bilan**

------------------------------------------------------------------------

# 33. PAGE DE RÉSULTATS

La page de résultats doit présenter d'abord une synthèse.

Ne pas afficher immédiatement 25 graphiques.

Ordre recommandé :

``` text
Score global
↓
Phrase d'interprétation
↓
3 grandes forces
↓
3 principales zones d'attention
↓
Résumé
↓
Accès au rapport complet
```

------------------------------------------------------------------------

# 34. SCORE GLOBAL DANS L'INTERFACE

Le score doit être accompagné de son interprétation.

Exemple :

> **72/100**
>
> **Une base favorable, avec quelques sujets importants à clarifier.**

Puis :

> Ce score ne résume pas votre relation. Consultez les dimensions
> détaillées pour comprendre ce qui le compose.

------------------------------------------------------------------------

# 35. GRAPHIQUE PRINCIPAL

Un graphique radar ou autre représentation peut présenter :

-   communication ;
-   conflits ;
-   finances ;
-   projet de vie ;
-   famille ;
-   autonomie ;
-   sécurité émotionnelle ;
-   engagement.

Mais le graphique ne doit jamais être seul.

------------------------------------------------------------------------

# 36. COMPARAISON DES PARTENAIRES

Le graphique peut présenter :

``` text
Vous
Partenaire
```

mais éviter les couleurs agressives.

Le but n'est pas de créer une compétition.

Le graphique doit représenter :

> deux perspectives.

------------------------------------------------------------------------

# 37. COULEURS

Utiliser les couleurs officielles de KELYA.

Le moteur de design doit récupérer les variables du design system KELYA
plutôt que coder des couleurs différentes directement dans KELYA COUPLE.

Prévoir :

``` text
--kelya-primary
--kelya-secondary
--kelya-background
--kelya-text
--kelya-muted
--kelya-success
--kelya-warning
--kelya-critical
```

Les valeurs exactes doivent provenir du design system KELYA existant.

------------------------------------------------------------------------

# 38. COULEUR DES ALERTES

Les alertes doivent être visuellement différenciées mais non anxiogènes.

Éviter :

-   rouge partout ;
-   alarmes ;
-   icônes dramatiques.

Une zone de vigilance doit ressembler à :

> **À regarder ensemble**

plutôt qu'à :

> **DANGER**

------------------------------------------------------------------------

# 39. CARTES DE RÉSULTATS

Les cartes peuvent présenter :

### Vos forces

> 3 domaines dans lesquels vous avez une forte convergence.

### Vos différences

> 3 domaines dans lesquels vos réponses divergent le plus.

### Vos priorités

> 3 sujets sur lesquels commencer à travailler.

------------------------------------------------------------------------

# 40. PAGE « NOS FORCES »

Chaque force doit ouvrir vers une analyse plus détaillée.

Exemple :

> **Projet de vie**
>
> Forte convergence

Puis :

> Vos réponses montrent une vision proche de votre avenir.

CTA :

> **Lire l'analyse**

------------------------------------------------------------------------

# 41. PAGE « NOS DIFFÉRENCES »

Exemple :

> **Finances**
>
> Différence importante

Puis :

> Vous semblez avoir des attentes différentes concernant...

CTA :

> **Comprendre cette différence**

------------------------------------------------------------------------

# 42. PAGE « NOS PRIORITÉS »

Cette page doit être orientée vers l'action.

Exemple :

> **1 --- Clarifier votre rapport à l'argent**

> Pourquoi cette priorité ?

> Ce que vous pouvez faire maintenant :

> **Commencer l'exercice**

------------------------------------------------------------------------

# 43. EXERCICES DANS L'INTERFACE

Chaque exercice doit avoir :

-   titre ;
-   objectif ;
-   durée ;
-   consignes ;
-   questions ;
-   zone de saisie éventuelle ;
-   bouton terminer ;
-   bouton télécharger.

------------------------------------------------------------------------

# 44. TÉLÉCHARGEMENT DES EXERCICES

Le bouton doit être :

> **Télécharger cet exercice**

Le fichier doit contenir l'exercice complet.

Les exercices doivent être imprimables.

------------------------------------------------------------------------

# 45. ESPACES D'ÉCRITURE NUMÉRIQUES

Lorsque pertinent, permettre :

> **Écrire ma réponse**

L'utilisateur peut répondre directement dans l'espace membre.

Prévoir également :

> **Télécharger la fiche**

pour ceux qui préfèrent écrire à la main.

------------------------------------------------------------------------

# 46. RAPPORT COMPLET

Le dashboard doit proposer :

> **Ouvrir mon rapport complet**

Puis :

> **Télécharger mon rapport**

Le rapport téléchargé doit être identique au contenu validé dans
l'espace membre.

------------------------------------------------------------------------

# 47. PRÉVISUALISATION

Avant téléchargement, permettre une prévisualisation.

Afficher :

-   couverture ;
-   quelques pages ;
-   nombre approximatif de pages ;
-   niveau d'offre ;
-   date de génération.

------------------------------------------------------------------------

# 48. PREMIUM PLUS DANS L'INTERFACE

Le Premium Plus ne doit pas avoir une interface entièrement différente.

Il doit reprendre la même architecture.

Mais certaines sections supplémentaires peuvent être identifiées :

> **Analyse approfondie**

> **Vos scénarios**

> **Votre protocole**

> **Votre charte relationnelle**

> **Votre plan de progression**

------------------------------------------------------------------------

# 49. IDENTIFICATION PREMIUM PLUS

Utiliser un badge élégant :

> **PREMIUM PLUS**

Le badge doit être discret mais visible.

Il ne doit pas donner l'impression que l'Essentiel est incomplet.

------------------------------------------------------------------------

# 50. ESSENTIEL

L'utilisateur Essentiel doit avoir accès à une expérience complète.

Il ne doit pas voir des dizaines de fonctionnalités verrouillées.

Éviter :

> « Ceci est disponible en Premium Plus »

à répétition.

Si une fonctionnalité n'est pas incluse, elle peut être mentionnée une
seule fois dans une zone appropriée.

------------------------------------------------------------------------

# 51. UPSELL APRÈS RÉSULTATS

Si un upgrade Premium Plus existe, il doit être présenté après que
l'utilisateur a reçu une partie substantielle de son expérience.

Exemple :

> **Vous souhaitez aller plus loin ?**

> Le Premium Plus ajoute une analyse approfondie, des protocoles
> personnalisés, des scénarios de conversation et un plan de progression
> étendu.

CTA :

> **Découvrir Premium Plus**

------------------------------------------------------------------------

# 52. NE PAS DÉVALORISER L'ESSENTIEL

Ne jamais écrire :

> « Avec l'Essentiel, vous n'avez que... »

Préférer :

> « L'Essentiel vous donne déjà une lecture complète de votre dynamique.
> Le Premium Plus ajoute une couche de travail plus approfondie pour les
> couples qui souhaitent aller plus loin. »

------------------------------------------------------------------------

# 53. ESPACE COUPLE

Le couple doit pouvoir voir :

``` text
Notre progression
Nos résultats
Nos forces
Nos différences
Nos priorités
Nos exercices
Notre plan d'action
Notre rapport
```

------------------------------------------------------------------------

# 54. DONNÉES INDIVIDUELLES

L'interface doit distinguer clairement :

> **Mon analyse individuelle**

et :

> **Notre analyse de couple**

Les réponses brutes de l'autre partenaire ne doivent pas être exposées
sans nécessité.

------------------------------------------------------------------------

# 55. PRINCIPLE DE CONFIDENTIALITÉ

Le couple doit recevoir un résultat commun sans que cela signifie :

> « Tout ce que mon partenaire a répondu est visible mot pour mot. »

Le rapport peut parler de tendances et de différences sans révéler des
réponses sensibles individuelles.

------------------------------------------------------------------------

# 56. NOTIFICATIONS

Les notifications doivent être limitées et utiles.

Exemples :

> Votre partenaire vient de rejoindre le bilan.

> Votre questionnaire est terminé.

> Votre bilan est prêt.

> Votre rapport est disponible.

Éviter les notifications inutiles.

------------------------------------------------------------------------

# 57. EMAILS

Prévoir au minimum :

### Après achat

Confirmation de commande et accès.

### Invitation partenaire

Lien ou code.

### Partenaire rejoint

Notification à l'acheteur.

### Questionnaire terminé

Confirmation.

### Rapport prêt

Lien vers l'espace de résultats.

### Rappel

Uniquement selon les règles définies et avec modération.

------------------------------------------------------------------------

# 58. MOBILE FIRST

Le service doit être conçu en priorité pour téléphone.

Pourquoi ?

Les utilisateurs peuvent :

-   recevoir l'invitation sur WhatsApp ;
-   ouvrir le lien sur mobile ;
-   répondre au questionnaire sur mobile ;
-   consulter le rapport sur mobile ;
-   télécharger les fiches sur mobile.

------------------------------------------------------------------------

# 59. RESPONSIVE

Tester au minimum :

-   petit smartphone ;
-   smartphone standard ;
-   grande tablette ;
-   desktop.

------------------------------------------------------------------------

# 60. NAVIGATION MOBILE

La navigation doit être très simple.

Exemple :

``` text
Accueil
Bilan
Résultats
Exercices
Rapport
```

Ne pas surcharger le menu.

------------------------------------------------------------------------

# 61. DESKTOP

Sur desktop, prévoir :

-   colonne principale ;
-   barre latérale légère ;
-   progression ;
-   navigation de section.

Mais ne pas transformer l'expérience en tableau de bord administratif.

------------------------------------------------------------------------

# 62. ACCESSIBILITÉ

Prévoir :

-   contraste suffisant ;
-   tailles de texte lisibles ;
-   boutons suffisamment grands ;
-   navigation clavier ;
-   labels explicites ;
-   alternatives textuelles pour les graphiques ;
-   messages d'erreur compréhensibles.

------------------------------------------------------------------------

# 63. ERREURS

Une erreur doit expliquer :

> ce qui s'est passé ;

> ce que l'utilisateur peut faire maintenant.

Éviter :

> Error 500.

Préférer :

> **Nous n'avons pas pu enregistrer cette réponse. Vérifiez votre
> connexion puis réessayez. Votre progression précédente est
> conservée.**

------------------------------------------------------------------------

# 64. CODE INVALIDE

Si le partenaire entre un mauvais code :

> **Ce code ne semble pas valide.**

Puis :

> Vérifiez les caractères ou utilisez le lien d'invitation reçu.

------------------------------------------------------------------------

# 65. CODE DÉJÀ UTILISÉ

Si le code contient déjà deux participants :

> **Ce bilan a déjà atteint son nombre maximum de participants.**

Puis :

> Si vous pensez qu'il s'agit d'une erreur, contactez le support.

------------------------------------------------------------------------

# 66. LIEN EXPIRÉ

Afficher :

> **Cette invitation n'est plus disponible.**

Puis :

> Demandez à la personne qui a créé le bilan de générer une nouvelle
> invitation si cela est prévu par les conditions du service.

------------------------------------------------------------------------

# 67. PARTENAIRE DÉJÀ ASSOCIÉ

Si un utilisateur tente de rejoindre un couple différent avec une
identité incompatible :

> demander une vérification avant toute modification.

Ne pas déplacer silencieusement un utilisateur d'un couple à un autre.

------------------------------------------------------------------------

# 68. ABANDON DE PARCOURS

Si l'utilisateur revient plusieurs jours plus tard :

> **Bon retour. Votre bilan vous attend.**

Puis :

> **Vous étiez à 60 % du questionnaire.**

CTA :

> **Reprendre**

------------------------------------------------------------------------

# 69. ÉTAT VIDE

Exemple :

> **Votre rapport n'est pas encore disponible.**

> Les deux questionnaires doivent être terminés avant de lancer
> l'analyse.

Puis :

> **Votre progression : 1 participant sur 2**

------------------------------------------------------------------------

# 70. ÉTAT DE SUCCÈS

Après une action :

> **C'est enregistré.**

ou :

> **Votre invitation a bien été envoyée.**

ou :

> **Votre exercice est terminé.**

Les confirmations doivent être courtes.

------------------------------------------------------------------------

# 71. EXPIRATION DE L'ESPACE

Le service doit respecter la règle commerciale décidée pour la
conservation de l'accès.

Le principe recommandé est :

> accès complet pendant une période définie après disponibilité du
> rapport ;

> possibilité de télécharger les documents ;

> conservation interne des données selon la politique de confidentialité
> et de conservation.

La durée exacte doit être paramétrable.

------------------------------------------------------------------------

# 72. EXPORT

L'utilisateur doit pouvoir télécharger :

-   rapport complet ;
-   exercices ;
-   fiches pratiques ;
-   plan d'action ;
-   charte relationnelle Premium Plus.

Prévoir éventuellement :

> **Télécharger tout mon dossier**

------------------------------------------------------------------------

# 73. EXPORT GOOGLE DRIVE

Si cette fonctionnalité est développée, elle doit être optionnelle.

Afficher :

> **Enregistrer dans Google Drive**

Le service ne doit pas dépendre de Google Drive pour fonctionner.

Le téléchargement local doit toujours rester disponible.

------------------------------------------------------------------------

# 74. ARCHIVAGE

Le système doit distinguer :

``` text
USER ACCESS
≠
DATA RETENTION
```

La fin de l'accès utilisateur ne signifie pas nécessairement suppression
immédiate des données internes.

La politique exacte doit être définie séparément.

------------------------------------------------------------------------

# 75. PAGE « MON RAPPORT »

Cette page doit afficher :

> **Votre rapport complet**

Puis :

-   date ;
-   version ;
-   offre ;
-   statut ;
-   téléchargement.

------------------------------------------------------------------------

# 76. PAGE « MES EXERCICES »

Afficher les exercices :

``` text
À faire
En cours
Terminés
```

Chaque exercice peut afficher :

-   titre ;
-   priorité liée ;
-   durée ;
-   statut.

------------------------------------------------------------------------

# 77. PAGE « NOTRE PLAN »

Afficher le plan sous forme de progression.

Exemple :

``` text
Semaine 1
✓ Conversation

Semaine 2
○ Exercice finances

Semaine 3
○ Révision de l'accord

Semaine 4
○ Bilan
```

------------------------------------------------------------------------

# 78. PAGE « NOTRE CHARTE » --- PREMIUM PLUS

La charte doit pouvoir être :

-   consultée ;
-   modifiée si le produit le permet ;
-   enregistrée ;
-   téléchargée.

Le couple doit pouvoir revenir dessus.

------------------------------------------------------------------------

# 79. PAGE « NOS SCÉNARIOS » --- PREMIUM PLUS

Chaque scénario doit avoir :

-   contexte ;
-   questions ;
-   espace de réponse ;
-   débrief ;
-   conclusion.

------------------------------------------------------------------------

# 80. PAGE « NOS PROTOCOLES » --- PREMIUM PLUS

Chaque protocole doit être présenté comme un parcours guidé.

Exemple :

``` text
Étape 1
Étape 2
Étape 3
Étape 4
Étape 5
```

L'utilisateur doit pouvoir savoir où il se trouve.

------------------------------------------------------------------------

# 81. DESIGN DES EXERCICES

Un exercice doit avoir une mise en page distincte.

Utiliser :

-   titre ;
-   objectif ;
-   durée ;
-   consignes ;
-   questions ;
-   espaces blancs ;
-   encadré « Notre décision » ;
-   encadré « Notre prochaine action ».

------------------------------------------------------------------------

# 82. DESIGN DES RECOMMANDATIONS

Les recommandations doivent utiliser des cartes légères.

Exemple :

> **À faire cette semaine**

Puis :

> Prenez 30 minutes pour discuter de...

Puis :

> **Pourquoi ?**

Puis :

> **Comment commencer ?**

------------------------------------------------------------------------

# 83. DESIGN DES CONCLUSIONS

Les conclusions doivent être visuellement identifiables.

Exemple :

> **À retenir**

Puis un paragraphe.

Cela aide le lecteur à mémoriser.

------------------------------------------------------------------------

# 84. IDENTITÉ ÉMOTIONNELLE

L'interface doit donner une impression de :

-   confiance ;
-   maturité ;
-   intimité ;
-   clarté ;
-   espoir ;
-   sérieux.

Éviter les clichés :

-   cœurs partout ;
-   couples qui s'embrassent partout ;
-   rose romantique systématique ;
-   langage adolescent.

KELYA COUPLE est un outil de compréhension relationnelle, pas une
application de rencontre.

------------------------------------------------------------------------

# 85. IMAGES

Les images doivent être utilisées avec parcimonie.

Privilégier :

-   compositions élégantes ;
-   textures ;
-   formes ;
-   illustrations cohérentes avec KELYA ;
-   scènes relationnelles naturelles.

Les images ne doivent pas remplacer le contenu.

------------------------------------------------------------------------

# 86. ICONOGRAPHIE

Les icônes doivent rester simples.

Exemples :

-   progression ;
-   conversation ;
-   équilibre ;
-   calendrier ;
-   téléchargement ;
-   exercice ;
-   rapport ;
-   sécurité.

Éviter une iconographie trop enfantine.

------------------------------------------------------------------------

# 87. TYPOGRAPHIE

Utiliser la typographie officielle de KELYA.

Si aucune règle spécifique n'existe dans le design system, définir :

-   police principale ;
-   police secondaire éventuelle ;
-   tailles H1 ;
-   H2 ;
-   H3 ;
-   corps ;
-   légendes ;
-   boutons.

Ne pas utiliser cinq polices différentes.

------------------------------------------------------------------------

# 88. ESPACEMENT

Le design doit respirer.

Prévoir un système cohérent :

``` text
XS
SM
MD
LG
XL
XXL
```

Les pages d'exercices doivent avoir davantage d'espace que les pages de
synthèse.

------------------------------------------------------------------------

# 89. BOUTONS

Les boutons principaux doivent utiliser des verbes.

Préférer :

> Commencer mon bilan

> Inviter mon partenaire

> Reprendre mon questionnaire

> Découvrir mes résultats

> Télécharger mon rapport

> Commencer l'exercice

Éviter :

> Cliquez ici

------------------------------------------------------------------------

# 90. CTA PRINCIPAL

Une seule action principale doit être dominante par écran.

Exemple :

> **Continuer**

sur une question.

Puis :

> **Découvrir mon bilan**

sur la page de révélation.

------------------------------------------------------------------------

# 91. PROGRESSION VISIBLE

L'utilisateur doit toujours savoir :

-   ce qu'il vient de faire ;
-   ce qu'il doit faire ;
-   ce qui vient ensuite.

Cette règle est fondamentale pour l'onboarding.

------------------------------------------------------------------------

# 92. RÈGLE DES TROIS QUESTIONS

Chaque écran important doit répondre rapidement à :

> **Où suis-je ?**

> **Qu'est-ce que je dois faire ?**

> **Qu'est-ce qui va se passer ensuite ?**

------------------------------------------------------------------------

# 93. ONBOARDING PARTENAIRE

Le partenaire invité doit avoir un onboarding plus court.

Il doit comprendre :

1.  qui l'a invité ;
2.  pourquoi ;
3.  combien de temps cela prend ;
4.  comment ses réponses sont utilisées ;
5.  ce qui se passera après.

------------------------------------------------------------------------

# 94. ONBOARDING ACHETEUR

L'acheteur doit recevoir davantage d'information.

Après paiement :

> Félicitations.

Puis :

> Votre prochaine étape est d'inviter votre partenaire.

Puis :

> Une fois que vous aurez tous les deux terminé, nous générerons votre
> bilan.

------------------------------------------------------------------------

# 95. ÉTAPE « INVITER »

L'écran doit proposer deux actions :

``` text
[ Inviter par lien ]

[ Copier mon code ]
```

Le lien doit être facilement partageable sur WhatsApp.

------------------------------------------------------------------------

# 96. ÉTAPE « ATTENDRE »

Ne pas donner l'impression que le système est bloqué.

Afficher :

> **Votre partie est terminée.**

> Nous attendons maintenant la participation de votre partenaire.

Puis éventuellement :

> Vous pouvez déjà consulter la présentation de votre parcours.

------------------------------------------------------------------------

# 97. ÉTAPE « ANALYSE »

Lorsque les deux parties sont terminées :

> **Tout est prêt.**

Puis :

> Nous allons maintenant croiser vos réponses et préparer votre bilan.

------------------------------------------------------------------------

# 98. ÉTAPE « RÉSULTATS »

Le premier écran doit être émotionnel mais sobre.

> **Voici ce que votre bilan révèle.**

Puis :

> **Commencez par votre synthèse.**

------------------------------------------------------------------------

# 99. RÈGLE DE RÉVÉLATION PROGRESSIVE

Ne pas afficher immédiatement toutes les informations.

Présenter progressivement :

``` text
Vue d'ensemble
↓
Forces
↓
Différences
↓
Priorités
↓
Analyse détaillée
↓
Actions
```

Cela facilite la compréhension.

------------------------------------------------------------------------

# 100. RAPPORT DANS L'APPLICATION

Le rapport peut être consulté sous forme de chapitres.

Exemple :

``` text
01 Votre synthèse
02 Vos forces
03 Vos convergences
04 Vos différences
05 Vos profils
06 Votre dynamique
07 Vos priorités
08 Vos actions
09 Vos ressources
10 Conclusion
```

------------------------------------------------------------------------

# 101. RAPPORT PREMIUM PLUS DANS L'APPLICATION

Ajouter :

``` text
11 Analyse approfondie
12 Scénarios
13 Protocoles
14 Charte
15 Plan 12 semaines
16 Fiches pratiques
```

Les numéros exacts peuvent évoluer selon la structure finale.

------------------------------------------------------------------------

# 102. RÈGLE DE COHÉRENCE ENTRE WEB ET RAPPORT

Le texte affiché dans l'espace membre et celui du document téléchargé
doivent provenir de la même source de données.

Éviter :

> dashboard = résultat A

> PDF = résultat B

------------------------------------------------------------------------

# 103. IDENTIFIANT DU COUPLE

Afficher un identifiant discret dans les paramètres ou les informations
du bilan.

Exemple :

> **Référence : KLY-CPL-8F42Q**

Ne pas le mettre en avant comme élément émotionnel.

------------------------------------------------------------------------

# 104. SUPPORT

Prévoir un accès simple :

> **Besoin d'aide ?**

Puis :

-   problème de code ;
-   problème d'accès ;
-   problème de paiement ;
-   questionnaire ;
-   rapport ;
-   téléchargement.

------------------------------------------------------------------------

# 105. FAQ

La page de présentation doit répondre notamment :

### Est-ce que nous devons répondre ensemble ?

Non. Chacun répond séparément.

### Qui peut acheter ?

L'un ou l'autre des partenaires.

### Comment mon partenaire rejoint-il ?

Avec le lien ou le code.

### Le score signifie-t-il que nous sommes faits l'un pour l'autre ?

Non.

### Que se passe-t-il si notre score est faible ?

Le rapport identifie les sujets de travail.

### Nos réponses individuelles sont-elles affichées ?

Les résultats doivent respecter les règles de confidentialité définies.

### Combien de temps avons-nous accès au rapport ?

Afficher la durée commerciale exacte configurée.

------------------------------------------------------------------------

# 106. PERFORMANCE

Le service doit être rapide.

Priorités :

-   chargement initial ;
-   ouverture du questionnaire ;
-   sauvegarde des réponses ;
-   affichage du dashboard ;
-   génération du rapport ;
-   téléchargement.

Les animations ne doivent pas ralentir l'utilisation.

------------------------------------------------------------------------

# 107. SÉCURITÉ UX

Toute donnée sensible doit être protégée.

Prévoir notamment :

-   session sécurisée ;
-   contrôle d'accès ;
-   vérification du couple ;
-   expiration des liens ;
-   gestion des droits ;
-   séparation des données individuelles et communes.

------------------------------------------------------------------------

# 108. RESPONSIVE DES RAPPORTS

Le rapport web doit être lisible sur mobile.

Mais le téléchargement doit conserver une mise en page adaptée à
l'impression.

------------------------------------------------------------------------

# 109. DESIGN DU CHECKOUT

Le checkout doit être simple.

Afficher :

> **KELYA COUPLE™**

> Offre choisie

> Ce que vous recevez

> Prix

> Paiement

Puis :

> **Après votre achat, vous pourrez immédiatement inviter votre
> partenaire.**

------------------------------------------------------------------------

# 110. RÉCAPITULATIF AVANT PAIEMENT

Afficher clairement :

### Essentiel

**30 000 FCFA**

### Premium Plus

**50 000 FCFA**

Si une réduction est affichée, elle doit être exacte et justifiée.

Ne jamais créer une fausse réduction permanente.

------------------------------------------------------------------------

# 111. APRÈS PAIEMENT

L'utilisateur ne doit pas être envoyé vers une page générique.

Il doit arriver directement dans :

> **Votre espace KELYA COUPLE**

avec l'étape suivante mise en évidence.

------------------------------------------------------------------------

# 112. RÈGLE DE CONTINUITÉ

Chaque écran doit reprendre le contexte.

Exemple :

> **Votre bilan --- Sarah & Thomas**

Plutôt que :

> Dashboard.

Cela renforce la sensation de service personnalisé.

------------------------------------------------------------------------

# 113. RÈGLE DE PERSONNALISATION

Utiliser les prénoms lorsqu'ils sont disponibles.

Mais ne pas les répéter dans chaque phrase.

Exemple :

> Bonjour Sarah.

Puis utiliser :

> vous ;

> votre couple ;

> votre bilan.

------------------------------------------------------------------------

# 114. RÈGLE DE SOBRIÉTÉ

Le design doit éviter la surcharge.

Une belle interface ne signifie pas :

-   plus d'animations ;
-   plus de couleurs ;
-   plus de cartes ;
-   plus de graphiques.

Elle signifie :

> **meilleure hiérarchie.**

------------------------------------------------------------------------

# 115. RÈGLE DE CONFIANCE

Les moments sensibles doivent être visuellement calmes.

Exemples :

-   résultats faibles ;
-   différences importantes ;
-   sujets de sécurité ;
-   orientation vers un professionnel.

Éviter les animations de célébration à ces moments.

------------------------------------------------------------------------

# 116. CÉLÉBRATION

Les animations positives peuvent être utilisées lorsque :

-   commande terminée ;
-   partenaire rejoint ;
-   questionnaire terminé ;
-   rapport disponible ;
-   exercice terminé.

Elles doivent rester élégantes.

------------------------------------------------------------------------

# 117. SYSTÈME DE PROGRESSION

La progression peut utiliser :

``` text
0 %
25 %
50 %
75 %
100 %
```

Mais le système doit aussi afficher les étapes qualitatives.

Exemple :

> **3 étapes sur 5 terminées**

------------------------------------------------------------------------

# 118. ÉCRAN D'ACCUEIL DU RAPPORT

Le premier écran du rapport peut afficher :

> **Votre bilan est prêt, Sarah & Thomas.**

Puis :

> **72/100 --- Une base favorable, avec quelques sujets importants à
> clarifier.**

Puis :

> **Commencer la lecture**

------------------------------------------------------------------------

# 119. RÈGLE DE NAVIGATION DANS LE RAPPORT

Permettre :

-   chapitre suivant ;
-   chapitre précédent ;
-   retour au sommaire ;
-   téléchargement.

Sur mobile, un bouton flottant ou une barre discrète peut faciliter la
navigation.

------------------------------------------------------------------------

# 120. RÈGLE DE LECTURE

Les longues sections doivent être divisées en sous-sections.

Mais ne pas transformer chaque paragraphe en une carte.

Le contenu doit rester lisible comme un document.

------------------------------------------------------------------------

# 121. RÈGLE DE CONTENU TÉLÉCHARGEABLE

Tout contenu destiné à être utilisé hors ligne doit être identifiable.

Exemples :

> **Télécharger la fiche**

> **Télécharger l'exercice**

> **Télécharger le plan d'action**

> **Télécharger le rapport complet**

------------------------------------------------------------------------

# 122. RÈGLE DU « TOUT TÉLÉCHARGER »

Prévoir un bouton :

> **Télécharger mon dossier**

qui génère ou regroupe :

-   rapport ;
-   exercices ;
-   fiches ;
-   plan ;
-   charte Premium Plus lorsque applicable.

------------------------------------------------------------------------

# 123. ÉTAT DE GÉNÉRATION DU DOSSIER

Afficher :

> **Préparation de votre dossier...**

Puis :

> **Votre dossier est prêt.**

Ne pas exposer de détails techniques.

------------------------------------------------------------------------

# 124. ERREUR DE GÉNÉRATION

Afficher :

> **Votre dossier n'a pas pu être préparé pour le moment.**

Puis :

> Vos résultats restent disponibles dans votre espace. Vous pouvez
> réessayer dans quelques instants.

CTA :

> **Réessayer**

------------------------------------------------------------------------

# 125. RÈGLE DE SUPPORT

Si le problème persiste :

> **Contacter le support**

avec référence du couple.

------------------------------------------------------------------------

# 126. DONNÉES ET SUPPRESSION

L'interface doit expliquer clairement :

-   durée d'accès ;
-   possibilité de téléchargement ;
-   politique de conservation ;
-   conditions de suppression.

Les règles juridiques définitives doivent être validées séparément.

------------------------------------------------------------------------

# 127. RÈGLE D'EXPIRATION

Lorsque l'accès approche de sa fin :

> **Votre accès au bilan se termine bientôt.**

Puis :

> Téléchargez vos documents si vous souhaitez les conserver hors de
> votre espace.

Ne pas attendre le dernier jour.

------------------------------------------------------------------------

# 128. RAPPEL AVANT EXPIRATION

Prévoir éventuellement :

``` text
J-14
J-3
J-1
```

selon la politique commerciale retenue.

Ces rappels doivent être paramétrables.

------------------------------------------------------------------------

# 129. FIN D'ACCÈS

Après expiration :

> **Votre accès interactif à ce bilan est terminé.**

Puis expliquer :

> Les modalités de conservation des données sont précisées dans la
> politique de confidentialité.

Ne pas afficher une page vide.

------------------------------------------------------------------------

# 130. DESIGN SYSTEM À PRODUIRE

Le développement doit réutiliser les composants KELYA existants lorsque
disponibles.

Sinon définir les composants suivants :

``` text
Button
Card
ProgressBar
ProgressStepper
Badge
Modal
Toast
Input
RadioOption
QuestionCard
ScoreCard
DimensionCard
ExerciseCard
RecommendationCard
Timeline
ReportChapter
DownloadButton
EmptyState
ErrorState
```

------------------------------------------------------------------------

# 131. COMPOSANT QUESTION

Le composant Question doit supporter :

-   texte ;
-   sous-texte ;
-   réponse unique ;
-   progression ;
-   validation ;
-   sauvegarde ;
-   retour ;
-   erreur.

------------------------------------------------------------------------

# 132. COMPOSANT SCORE

Le composant Score doit supporter :

-   score ;
-   libellé ;
-   interprétation ;
-   niveau ;
-   contexte.

Il ne doit pas afficher un chiffre seul.

------------------------------------------------------------------------

# 133. COMPOSANT DIMENSION

Structure :

``` text
Nom de la dimension
Score A
Score B
Convergence / différence
Interprétation
CTA
```

------------------------------------------------------------------------

# 134. COMPOSANT EXERCICE

Structure :

``` text
Titre
Objectif
Durée
Difficulté
Consignes
Questions
Zone de réponse
Téléchargement
Statut
```

------------------------------------------------------------------------

# 135. COMPOSANT PLAN D'ACTION

Structure :

``` text
Objectif
Action
Responsable
Date
Statut
Notes
```

------------------------------------------------------------------------

# 136. COMPOSANT RAPPORT

Structure :

``` text
Sommaire
Chapitre
Progression
Contenu
À retenir
Action
```

------------------------------------------------------------------------

# 137. RÈGLE POUR CURSOR --- ARCHITECTURE

Cursor doit séparer :

``` text
KELYA CORE
↓
KELYA COUPLE MODULE
↓
COUPLE DATA
↓
SCORING ENGINE
↓
REPORT ENGINE
↓
UI
```

Le module KELYA COUPLE ne doit pas casser les autres fonctionnalités
KELYA.

------------------------------------------------------------------------

# 138. ROUTES

Prévoir conceptuellement :

``` text
/couple
/couple/offers
/couple/checkout
/couple/onboarding
/couple/invite
/couple/join
/couple/questionnaire
/couple/waiting
/couple/results
/couple/report
/couple/exercises
/couple/action-plan
/couple/resources
/couple/premium-plus
```

Les routes exactes doivent respecter l'architecture existante de KELYA.

------------------------------------------------------------------------

# 139. ÉTATS PRODUIT

Prévoir explicitement :

``` text
NOT_PURCHASED
PURCHASED
INVITATION_PENDING
PARTNER_JOINED
QUESTIONNAIRE_A_IN_PROGRESS
QUESTIONNAIRE_B_IN_PROGRESS
BOTH_COMPLETED
ANALYSIS_RUNNING
RESULTS_READY
REPORT_READY
ACCESS_EXPIRING
ACCESS_EXPIRED
```

------------------------------------------------------------------------

# 140. RÈGLE DE TRANSITION

Chaque état doit avoir :

-   écran ;
-   action principale ;
-   action secondaire éventuelle ;
-   message ;
-   règles d'accès.

------------------------------------------------------------------------

# 141. ÉVÉNEMENTS ANALYTIQUES

Prévoir des événements anonymisés ou conformes aux règles de
confidentialité.

Exemples :

``` text
couple_landing_viewed
couple_offer_selected
couple_purchase_completed
couple_invitation_created
couple_invitation_opened
partner_joined
questionnaire_started
questionnaire_completed
analysis_started
analysis_completed
results_viewed
report_downloaded
exercise_started
exercise_completed
```

Ne pas collecter inutilement le contenu sensible des réponses dans les
analytics.

------------------------------------------------------------------------

# 142. INDICATEURS PRODUIT

Suivre notamment :

-   taux de paiement → invitation ;
-   invitation → partenaire rejoint ;
-   partenaire rejoint → questionnaire terminé ;
-   questionnaire terminé → rapport généré ;
-   rapport généré → rapport consulté ;
-   rapport consulté → téléchargement ;
-   exercices commencés ;
-   exercices terminés ;
-   utilisation Premium Plus.

------------------------------------------------------------------------

# 143. OBJECTIF UX PRINCIPAL

Le produit doit réduire les abandons entre :

``` text
ACHAT
→
INVITATION
→
PARTICIPATION DU PARTENAIRE
→
COMPLÉTION
→
RÉSULTATS
```

L'expérience d'invitation est donc aussi importante que le
questionnaire.

------------------------------------------------------------------------

# 144. RÈGLE DE FRiction

Chaque étape doit demander le minimum d'informations nécessaires.

Ne pas demander :

-   informations inutiles ;
-   profils complets ;
-   informations sensibles non nécessaires.

------------------------------------------------------------------------

# 145. RÈGLE DE CLARTÉ

Avant chaque action importante, expliquer :

> pourquoi cette information est demandée.

Exemple :

> **Nom de votre partenaire**
>
> Cela nous permet de personnaliser votre rapport.

------------------------------------------------------------------------

# 146. RÈGLE DE CONFIANCE AU PAIEMENT

Le checkout doit rappeler :

-   ce qui est inclus ;
-   le prix ;
-   ce qui se passe après ;
-   le fonctionnement à deux ;
-   les règles principales d'accès.

------------------------------------------------------------------------

# 147. RÈGLE DE FIN DE PARCOURS

Après le téléchargement du rapport :

> **Votre bilan est maintenant entre vos mains.**

Puis :

> Commencez par une seule priorité. Vous n'avez pas besoin de tout
> travailler en même temps.

CTA :

> **Commencer notre première action**

------------------------------------------------------------------------

# 148. EXPÉRIENCE POST-RAPPORT

Le service ne doit pas se terminer brutalement au téléchargement.

Le dashboard peut continuer à proposer :

-   exercices ;
-   plan d'action ;
-   suivi ;
-   charte ;
-   ressources.

Cela donne de la valeur à l'espace membre.

------------------------------------------------------------------------

# 149. RÈGLE DE NON-DÉPENDANCE

Le couple doit pouvoir conserver ses documents même après la fin de
l'accès interactif.

Le produit doit favoriser :

> téléchargement + conservation personnelle.

------------------------------------------------------------------------

# 150. PRINCIPLE FINAL

KELYA COUPLE doit donner l'impression :

> **d'entrer dans un espace intime, structuré et sérieux dédié à la
> compréhension de leur relation.**

L'utilisateur ne doit jamais se demander :

> « Où suis-je ? »

Il doit comprendre :

> **« Je suis dans KELYA, dans mon espace KELYA COUPLE, et voici
> exactement ce que je dois faire maintenant. »**

------------------------------------------------------------------------

# 151. INSTRUCTIONS FINALES POUR CURSOR

Cursor doit considérer ce document comme la référence UX/UI de KELYA
COUPLE.

Il doit :

1.  conserver l'identité KELYA ;
2.  créer un espace dédié sans créer une deuxième identité visuelle ;
3.  construire une expérience mobile-first ;
4.  concevoir un onboarding complet ;
5.  afficher clairement la progression ;
6.  permettre l'invitation par lien et par code ;
7.  limiter chaque code à deux participants ;
8.  protéger les données individuelles ;
9.  distinguer espace individuel et espace couple ;
10. afficher le score avec son interprétation ;
11. ne jamais transformer le résultat en verdict ;
12. proposer des graphiques accompagnés de texte ;
13. proposer des exercices entièrement utilisables ;
14. permettre le téléchargement des exercices ;
15. permettre le téléchargement du rapport ;
16. prévoir un téléchargement global du dossier ;
17. intégrer Premium Plus dans la même architecture ;
18. ne jamais dévaloriser l'Essentiel ;
19. prévoir tous les états produit ;
20. gérer les erreurs proprement ;
21. prévoir l'expiration de l'accès ;
22. maintenir la possibilité d'exporter les documents ;
23. respecter l'accessibilité ;
24. respecter les règles de sécurité ;
25. prévoir les événements analytics sans exposer les réponses sensibles
    ;
26. utiliser les composants KELYA existants lorsque disponibles ;
27. séparer les responsabilités entre UI, scoring et report engine ;
28. rendre les paramètres configurables ;
29. conserver une expérience cohérente entre espace membre et rapport
    téléchargé ;
30. privilégier toujours la clarté, la confiance, la sobriété et
    l'utilité.

------------------------------------------------------------------------

# 152. DOCUMENTS ASSOCIÉS

``` text
01_NAMING_ET_POSITIONNEMENT_KELYA_COUPLE.md
02_ARCHITECTURE_PRODUIT_KELYA_COUPLE.md
03_PARCOURS_UTILISATEUR_KELYA_COUPLE.md
04_MOTEUR_MATCHING_ET_SCORING_KELYA_COUPLE.md
05_MOTEUR_GENERATION_RAPPORTS_KELYA_COUPLE.md
06_INTERFACE_ET_EXPERIENCE_KELYA_COUPLE.md
```

------------------------------------------------------------------------

# FIN DU DOCUMENT 06
