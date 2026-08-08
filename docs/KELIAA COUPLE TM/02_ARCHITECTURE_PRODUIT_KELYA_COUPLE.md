# 02 --- ARCHITECTURE PRODUIT

# KELYA COUPLE™

## Bilan de Compatibilité & Dynamique du Couple

**Document maître de cadrage fonctionnel --- De l'achat à la
consultation du rapport**

------------------------------------------------------------------------

# 1. OBJECTIF DU DOCUMENT

Ce document définit le fonctionnement complet de KELYA COUPLE™ sur le
plan produit.

Il décrit ce qui doit se passer lorsqu'une personne découvre le service,
achète une offre, crée son espace, invite son partenaire, réalise son
questionnaire, attend la participation du second partenaire, puis accède
au bilan final.

Ce document ne définit pas encore en détail le calcul scientifique du
matching ni la rédaction du rapport. Ces éléments seront définis dans
les documents dédiés au moteur de scoring et au moteur de génération des
rapports.

L'objectif ici est de donner à l'équipe produit, au développeur et à
Cursor une vision claire de **l'architecture fonctionnelle complète**.

------------------------------------------------------------------------

# 2. PRINCIPE ARCHITECTURAL CENTRAL

KELYA COUPLE est un **service spécialisé de KELYA**.

Il ne faut donc pas créer une deuxième application indépendante.

L'architecture recommandée est :

> **UN ÉCOSYSTÈME KELYA + UN ESPACE PRODUIT KELYA COUPLE DÉDIÉ**

Techniquement, KELYA COUPLE doit pouvoir utiliser les mêmes fondations
que KELYA :

-   authentification ;
-   comptes utilisateurs ;
-   base de données ;
-   système de paiement ;
-   notifications ;
-   stockage ;
-   système de sécurité ;
-   design system ;
-   gestion des droits ;
-   infrastructure.

Mais l'utilisateur qui achète KELYA COUPLE doit vivre une expérience
**centrée sur KELYA COUPLE**, sans être noyé dans les autres
fonctionnalités de KELYA.

------------------------------------------------------------------------

# 3. MODÈLE GÉNÉRAL

Le produit suit ce schéma :

``` text
KELYA
  │
  └── KELYA COUPLE
        │
        ├── Page de présentation
        │
        ├── Page de vente
        │
        ├── Choix de l'offre
        │
        ├── Paiement
        │
        ├── Création / connexion au compte
        │
        ├── Création du couple
        │
        ├── Invitation du partenaire
        │
        ├── Questionnaire Participant A
        │
        ├── Questionnaire Participant B
        │
        ├── Vérification des deux questionnaires
        │
        ├── Matching
        │
        ├── Analyse
        │
        ├── Génération du rapport
        │
        ├── Révélation des résultats
        │
        ├── Consultation
        │
        ├── Téléchargement
        │
        └── Ressources / orientation
```

------------------------------------------------------------------------

# 4. LES DEUX OFFRES

KELYA COUPLE comporte deux produits commerciaux.

## 4.1 ESSENTIEL --- 30 000 FCFA

Le paiement de 30 000 FCFA couvre **un couple complet**, donc deux
participants.

Le paiement ne doit jamais être présenté comme :

> 30 000 FCFA par personne.

Il doit être présenté comme :

> **30 000 FCFA pour votre bilan de couple.**

L'achat crée une commande associée à deux emplacements :

``` text
Participant A
Participant B
```

------------------------------------------------------------------------

## 4.2 PREMIUM PLUS --- 50 000 FCFA

Le paiement de 50 000 FCFA couvre également les deux participants.

Le Premium Plus reprend l'intégralité du parcours Essentiel et ajoute
les éléments Premium Plus définis dans les documents de contenu.

Il ne doit jamais créer un deuxième couple ou un deuxième paiement pour
le partenaire.

------------------------------------------------------------------------

# 5. CRÉATION DU COMPTE

Le système doit distinguer deux situations.

## CAS A --- L'utilisateur possède déjà un compte KELYA

Il se connecte à son compte existant.

Le système reconnaît son identité.

Il n'a pas besoin de créer un deuxième compte.

Après paiement, KELYA active simplement son espace KELYA COUPLE.

------------------------------------------------------------------------

## CAS B --- L'utilisateur ne possède pas encore de compte KELYA

Il crée son compte dans le parcours d'achat.

Les informations minimales doivent être définies par le système KELYA,
mais peuvent comprendre :

-   prénom ;
-   nom ;
-   adresse email ;
-   mot de passe ou méthode d'authentification disponible ;
-   numéro de téléphone lorsque nécessaire ;
-   consentements requis.

Le compte devient ensuite un compte KELYA normal auquel est rattaché le
service KELYA COUPLE.

------------------------------------------------------------------------

# 6. NE PAS CRÉER UN « COMPTE COUPLE » À LA PLACE DES COMPTES INDIVIDUELS

Le couple n'est pas une seule identité.

Il est constitué de deux utilisateurs.

``` text
UTILISATEUR A
     │
     └── COUPLE ID
             │
UTILISATEUR B
```

Chaque participant possède donc :

-   son compte ;
-   son identité ;
-   son accès individuel ;
-   son questionnaire ;
-   son statut de progression.

Le Couple ID sert à les relier.

------------------------------------------------------------------------

# 7. CRÉATION DU COUPLE

Après paiement, le premier utilisateur arrive sur :

# **Créons votre espace couple**

Le système lui explique :

> Votre bilan se construit à partir de deux questionnaires individuels.
> Vous allez répondre de votre côté, puis inviter votre partenaire afin
> qu'il ou elle réalise son propre questionnaire.

Le bouton principal :

> **Créer mon couple**

------------------------------------------------------------------------

# 8. INFORMATIONS DU COUPLE

Lors de la création du couple, le système peut demander :

-   prénom du partenaire ;
-   nom du partenaire, si souhaité ;
-   adresse email du partenaire, si disponible ;
-   statut relationnel ;
-   éventuellement durée de relation ;
-   éventuellement mariage prévu ou déjà marié, selon les catégories
    retenues.

Le système ne doit pas demander des informations inutiles.

Chaque information doit avoir une utilité pour :

-   la personnalisation ;
-   la segmentation ;
-   le rapport ;
-   l'expérience utilisateur.

------------------------------------------------------------------------

# 9. STATUTS RELATIONNELS

Le système peut proposer une sélection comme :

-   En couple ;
-   Fiancés ;
-   Mariés ;
-   En préparation de mariage ;
-   Autre situation de couple.

Cette information peut servir à personnaliser certaines formulations du
rapport.

Elle ne doit pas modifier arbitrairement le score de compatibilité.

------------------------------------------------------------------------

# 10. GÉNÉRATION DU COUPLE ID

Après création, le système génère automatiquement un identifiant unique.

Exemple :

``` text
KLY-CPL-8F42Q
```

Le code doit être :

-   unique ;
-   suffisamment difficile à deviner ;
-   associé à une seule commande ;
-   associé à deux emplacements maximum ;
-   inutilisable pour une troisième personne.

L'utilisateur voit :

> **Votre code couple**

et :

> **Votre lien d'invitation**

------------------------------------------------------------------------

# 11. INVITATION DU PARTENAIRE

Deux méthodes doivent être disponibles.

## MÉTHODE 1 --- LIEN D'INVITATION

Le système génère un lien sécurisé.

L'utilisateur peut :

> Copier le lien

ou :

> Partager le lien

Le lien doit identifier le couple sans exposer de données sensibles dans
l'URL.

------------------------------------------------------------------------

## MÉTHODE 2 --- CODE COUPLE

L'utilisateur peut partager son code :

``` text
KLY-CPL-8F42Q
```

Le partenaire arrive sur KELYA COUPLE et choisit :

> **J'ai reçu un code couple**

Il entre le code.

------------------------------------------------------------------------

# 12. LE CODE NE PEUT ÊTRE UTILISÉ QUE DEUX FOIS

Le couple comporte exactement :

``` text
1. Participant A
2. Participant B
```

Lorsque le second participant est associé, le code passe au statut :

> **COMPLET**

Toute tentative ultérieure doit afficher :

> **Ce code couple a déjà été utilisé par les deux participants.**

Aucune troisième personne ne doit pouvoir rejoindre le dossier.

------------------------------------------------------------------------

# 13. CAS D'UNE ERREUR D'INVITATION

Si le premier utilisateur se trompe d'adresse email ou partage le
mauvais lien, le système doit permettre une action contrôlée :

> **Modifier l'invitation**

Cette modification ne doit pas créer un troisième emplacement.

Si le partenaire est déjà associé et a commencé son questionnaire, le
système doit appliquer des règles strictes de sécurité avant toute
modification.

------------------------------------------------------------------------

# 14. STATUT DU COUPLE

Le Couple ID doit avoir un statut.

Exemple :

``` text
CREATED
INVITATION_SENT
PARTNER_JOINED
PARTICIPANT_A_IN_PROGRESS
PARTICIPANT_B_IN_PROGRESS
WAITING_FOR_PARTNER
BOTH_COMPLETED
ANALYSIS_IN_PROGRESS
REPORT_READY
ARCHIVED
```

Ces statuts servent au moteur produit, au tableau de bord et aux
notifications.

------------------------------------------------------------------------

# 15. TABLEAU DE BORD APRÈS ACHAT

Le premier écran après achat doit être un véritable onboarding.

Il doit présenter :

# **Bienvenue dans KELYA COUPLE**

Puis :

> **Félicitations. Votre bilan est maintenant lancé.**

Ensuite :

> Vous allez avancer chacun de votre côté, puis KELYA croisera vos
> réponses pour construire votre bilan de couple.

------------------------------------------------------------------------

# 16. PROGRESSION VISUELLE

Le tableau de bord doit afficher une progression.

Exemple :

``` text
✓ Achat confirmé
✓ Votre espace créé
● Votre questionnaire
○ Questionnaire du partenaire
○ Analyse du couple
○ Votre rapport
```

La progression doit être visuelle, claire et agréable.

Elle peut utiliser des animations légères.

------------------------------------------------------------------------

# 17. CARTE « PROCHAINE ACTION »

Le tableau de bord doit toujours afficher une action prioritaire.

Exemple :

> **Votre prochaine étape**
>
> Complétez votre questionnaire individuel.
>
> Prenez le temps de répondre honnêtement. Il n'y a pas de bonne ou de
> mauvaise réponse.

Bouton :

> **Commencer mon questionnaire**

Lorsque le premier questionnaire est terminé :

> **Votre prochaine étape**
>
> Votre partie est terminée. Invitez maintenant votre partenaire.

------------------------------------------------------------------------

# 18. CARTE « PARTENAIRE »

L'utilisateur doit pouvoir voir le statut du partenaire sans voir ses
réponses.

Exemple :

> **Votre partenaire**
>
> Sarah a reçu l'invitation.
>
> Son questionnaire n'est pas encore terminé.

ou :

> **Votre partenaire**
>
> Sarah a terminé son questionnaire.
>
> Votre bilan est maintenant en préparation.

Aucune réponse individuelle ne doit être révélée.

------------------------------------------------------------------------

# 19. CONFIDENTIALITÉ ENTRE LES DEUX PARTICIPANTS

Le système doit protéger l'indépendance des réponses.

Participant A ne doit pas pouvoir consulter :

-   les réponses de B ;
-   les scores individuels de B ;
-   les commentaires de B ;
-   les réponses textuelles de B.

Participant B ne doit pas pouvoir consulter ceux de A.

Le couple reçoit ensuite une analyse croisée produite par le moteur.

------------------------------------------------------------------------

# 20. DÉMARRAGE DU QUESTIONNAIRE

Le questionnaire doit être introduit par un écran de préparation.

Exemple :

> **Avant de commencer**
>
> Ce questionnaire est conçu pour mieux comprendre votre manière de
> fonctionner dans la relation.
>
> Répondez selon ce qui vous ressemble réellement, et non selon ce que
> vous pensez être la réponse attendue.
>
> Prenez votre temps.
>
> **Votre partenaire ne verra pas directement vos réponses.**

Bouton :

> **Commencer**

------------------------------------------------------------------------

# 21. SAUVEGARDE AUTOMATIQUE

Le questionnaire doit sauvegarder automatiquement la progression.

Si l'utilisateur ferme la page, change d'appareil ou revient plus tard,
il doit pouvoir reprendre.

Exemple :

> **Vous êtes à 64 %.**
>
> Vous pouvez reprendre là où vous vous êtes arrêté.

Aucune réponse déjà enregistrée ne doit être perdue.

------------------------------------------------------------------------

# 22. PAUSE DU QUESTIONNAIRE

L'utilisateur doit pouvoir quitter temporairement le questionnaire.

Bouton :

> **Continuer plus tard**

Le système sauvegarde automatiquement.

Lorsqu'il revient :

> **Content de vous revoir. Votre questionnaire vous attend là où vous
> l'avez laissé.**

------------------------------------------------------------------------

# 23. FIN DU QUESTIONNAIRE INDIVIDUEL

Lorsque l'utilisateur termine :

> **Votre questionnaire est terminé.**

Puis :

> Vous venez de terminer votre partie du bilan. Votre partenaire doit
> maintenant compléter son propre questionnaire afin que KELYA puisse
> analyser votre dynamique à deux.

Le système peut afficher :

> **1 questionnaire sur 2 terminé**

------------------------------------------------------------------------

# 24. INVITATION APRÈS QUESTIONNAIRE

Si le partenaire n'a pas encore rejoint le couple, l'utilisateur doit
retrouver facilement :

> **Inviter mon partenaire**

avec :

-   lien ;
-   code ;
-   partage.

Le système peut proposer un message prérempli.

------------------------------------------------------------------------

# 25. ATTENTE DU SECOND PARTICIPANT

Lorsque le premier utilisateur a terminé mais que le second n'a pas
encore terminé :

> **Votre partie est terminée.**

> Votre bilan de couple sera généré lorsque les deux questionnaires
> seront complétés.

Puis une carte :

> **En attente de votre partenaire**

avec un bouton :

> **Renvoyer l'invitation**

Cette fonction doit être limitée pour éviter les abus de notification.

------------------------------------------------------------------------

# 26. NOTIFICATIONS

Le système peut envoyer des notifications liées au parcours.

Exemples :

### Invitation

> Vous avez été invité(e) à rejoindre un bilan KELYA COUPLE.

### Rappel

> Votre questionnaire KELYA COUPLE vous attend encore.

### Deuxième questionnaire terminé

> Les deux questionnaires sont maintenant terminés. Votre bilan est en
> préparation.

### Rapport prêt

> Votre bilan KELYA COUPLE est maintenant disponible.

Les notifications doivent rester sobres.

------------------------------------------------------------------------

# 27. DÉCLENCHEMENT DU MATCHING

Le matching ne commence que lorsque :

``` text
Participant A = COMPLETED
ET
Participant B = COMPLETED
```

Alors :

``` text
BOTH_COMPLETED
      ↓
VALIDATION DES DONNÉES
      ↓
MATCHING
      ↓
ANALYSE
      ↓
GÉNÉRATION DU RAPPORT
```

------------------------------------------------------------------------

# 28. VALIDATION AVANT ANALYSE

Avant de lancer l'analyse, le système doit vérifier :

-   que les deux utilisateurs appartiennent au même Couple ID ;
-   que les deux questionnaires sont complets ;
-   que les réponses obligatoires sont présentes ;
-   que l'offre est valide ;
-   que le paiement est confirmé ;
-   que le niveau d'offre est correctement identifié ;
-   qu'aucune donnée critique n'est manquante.

Si une anomalie est détectée, le rapport ne doit pas être généré avec
des données incomplètes.

------------------------------------------------------------------------

# 29. ANALYSE EN ARRIÈRE-PLAN

Pendant la génération :

> **Votre bilan est en préparation.**

Puis une animation légère peut montrer :

``` text
Vos réponses
     ↓
Lecture individuelle
     ↓
Comparaison
     ↓
Identification des convergences
     ↓
Identification des écarts
     ↓
Analyse des zones de vigilance
     ↓
Personnalisation
     ↓
Génération du rapport
```

L'animation doit être illustrative et non techniquement trompeuse.

------------------------------------------------------------------------

# 30. RAPPORT DISPONIBLE

Lorsque le rapport est prêt :

> **Votre bilan est prêt.**

Puis une présentation visuelle de l'expérience :

> **Deux regards. Une analyse. Une nouvelle façon de comprendre votre
> couple.**

Bouton :

> **Découvrir votre bilan**

------------------------------------------------------------------------

# 31. NIVEAU D'ACCÈS AU RAPPORT

Le système doit lire le niveau acheté :

``` text
plan = ESSENTIEL
```

ou :

``` text
plan = PREMIUM_PLUS
```

Le moteur de génération applique alors les règles correspondantes.

------------------------------------------------------------------------

# 32. RÈGLE CUMULATIVE DU PREMIUM PLUS

Le système doit respecter :

``` text
ESSENTIEL
=
VERSION 1

PREMIUM PLUS
=
VERSION 1
+
AJOUTS PREMIUM PLUS
```

Si le produit comporte une couche Premium intermédiaire dans la
nomenclature technique finale, elle doit également être cumulative.

Aucune version supérieure ne doit supprimer les éléments du niveau
inférieur.

------------------------------------------------------------------------

# 33. STRUCTURE DE L'ESPACE RÉSULTATS

L'espace de résultats peut être organisé en plusieurs zones.

### Vue d'ensemble

Score global + synthèse.

### Vos forces

Convergences importantes.

### Vos différences

Écarts significatifs.

### Vos zones de vigilance

Sujets nécessitant attention.

### Pour vous individuellement

Points de travail personnels.

### Pour votre couple

Sujets à travailler ensemble.

### Vos outils

Exercices et plans d'action.

### Vos ressources

Ressources adaptées.

### Votre rapport

Accès au dossier complet.

------------------------------------------------------------------------

# 34. LE SCORE GLOBAL

Le score global doit être présenté avec prudence.

Exemple :

> **72/100**
>
> **Une base relationnelle favorable, avec plusieurs sujets importants à
> clarifier.**

Le texte associé doit être généré dynamiquement selon les résultats.

Il ne doit jamais être une phrase identique pour tous les couples.

------------------------------------------------------------------------

# 35. VISUALISATION DES DIMENSIONS

Les résultats peuvent être représentés avec :

-   graphiques ;
-   jauges ;
-   barres ;
-   cartes ;
-   comparaisons A/B ;
-   zones de convergence.

Mais les visuels ne doivent pas transformer le couple en compétition.

Éviter :

> « Thomas 84 --- Sarah 52 »

sans explication.

Préférer :

> **Votre niveau de proximité sur cette dimension**

puis une interprétation.

------------------------------------------------------------------------

# 36. INDIVIDUEL VS COUPLE

L'architecture du résultat doit clairement distinguer :

### MON PROFIL

Ce qui concerne chaque personne.

### NOTRE DYNAMIQUE

Ce qui concerne l'interaction entre les deux.

### NOS PRIORITÉS

Ce que le couple devrait travailler.

Cette séparation est essentielle.

------------------------------------------------------------------------

# 37. EXERCICES

Les exercices doivent être accessibles depuis le rapport.

Ils peuvent être :

-   consultables en ligne ;
-   téléchargeables ;
-   imprimables.

Chaque exercice doit contenir :

-   un objectif ;
-   une explication ;
-   des consignes ;
-   les questions ;
-   un espace d'écriture ;
-   une conclusion ou un temps de retour.

Les exercices ne doivent pas être de simples titres.

------------------------------------------------------------------------

# 38. RESSOURCES

Les ressources doivent être personnalisées.

Le système peut proposer :

-   articles ;
-   guides ;
-   sessions ;
-   programmes KELYA ;
-   ressources externes qualifiées ;
-   professionnels compétents lorsque nécessaire.

Les recommandations doivent dépendre des résultats.

------------------------------------------------------------------------

# 39. ORIENTATION VERS UNE SESSION

Lorsque le résultat montre qu'un sujet mérite un accompagnement humain,
le système peut proposer :

> **Vous souhaitez travailler ce sujet avec un accompagnement
> personnalisé ?**

Puis présenter la ressource appropriée.

Il faut éviter une logique agressive de vente.

Le rapport doit d'abord aider.

La proposition commerciale vient ensuite.

------------------------------------------------------------------------

# 40. ORIENTATION VERS UN THÉRAPEUTE

Si une orientation vers un professionnel est pertinente :

> **Certaines difficultés peuvent être plus faciles à travailler avec un
> professionnel formé à l'accompagnement de couple.**

Puis :

> **Découvrir les ressources disponibles**

Le système ne doit pas poser de diagnostic clinique.

------------------------------------------------------------------------

# 41. TÉLÉCHARGEMENT DU DOSSIER

Le rapport doit pouvoir être téléchargé.

Le bouton doit être évident :

> **Télécharger mon rapport**

Selon le niveau d'offre, le système peut proposer :

-   rapport complet ;
-   exercices ;
-   plan d'action ;
-   ressources.

------------------------------------------------------------------------

# 42. ESPACE DE TÉLÉCHARGEMENT

Prévoir une section :

# **Mes documents**

avec :

``` text
Rapport de couple
Exercices
Plan d'action
Ressources
```

Chaque élément doit être clairement identifié.

------------------------------------------------------------------------

# 43. ACCÈS TEMPORAIRE

Le produit peut prévoir une durée d'accès à l'espace.

La durée exacte doit être définie selon les contraintes de stockage, de
sécurité et de stratégie commerciale.

Le principe recommandé est :

> **Le couple dispose d'une période suffisamment longue pour consulter
> et télécharger ses documents.**

Avant expiration :

> **Votre accès à cet espace arrive bientôt à son terme. Pensez à
> télécharger vos documents importants.**

Les données internes nécessaires au fonctionnement et à la conformité
peuvent être conservées selon les politiques de KELYA.

------------------------------------------------------------------------

# 44. ARCHIVAGE

Une fois la période d'accès terminée :

``` text
ACTIVE
↓
ACCESS_EXPIRED
↓
ARCHIVED
```

Le dossier peut devenir inaccessible à l'utilisateur tout en restant
conservé côté système selon les règles de conservation des données.

Aucune suppression automatique ne doit être implémentée sans politique
claire.

------------------------------------------------------------------------

# 45. RETOUR À KELYA

Un bouton doit permettre :

> **Retourner à KELYA**

L'utilisateur revient à son espace principal.

Cela confirme que KELYA COUPLE appartient bien à l'écosystème KELYA.

------------------------------------------------------------------------

# 46. NAVIGATION KELYA COUPLE

Navigation recommandée :

``` text
KELYA COUPLE
│
├── Accueil
├── Ma progression
├── Mon questionnaire
├── Mon partenaire
├── Notre analyse
├── Notre rapport
├── Nos exercices
├── Nos ressources
└── Mon espace KELYA
```

Tous les éléments ne doivent pas nécessairement être visibles dès le
début.

Les fonctionnalités peuvent apparaître progressivement selon l'état du
parcours.

------------------------------------------------------------------------

# 47. ÉTATS DU PARCOURS

## État 1 --- PAYÉ

L'utilisateur vient d'acheter.

### Écran principal

Bienvenue + félicitations + prochaine étape.

------------------------------------------------------------------------

## État 2 --- COUPLE CRÉÉ

Le Couple ID existe.

### Écran principal

Inviter le partenaire + commencer son questionnaire.

------------------------------------------------------------------------

## État 3 --- PARTENAIRE INVITÉ

Le premier participant a envoyé l'invitation.

### Écran principal

Progression + statut du partenaire.

------------------------------------------------------------------------

## État 4 --- PARTENAIRE REJOINT

Les deux comptes sont associés.

### Écran principal

Deux parcours individuels.

------------------------------------------------------------------------

## État 5 --- UN SEUL QUESTIONNAIRE TERMINÉ

### Écran principal

1/2 terminé + attente du partenaire.

------------------------------------------------------------------------

## État 6 --- DEUX QUESTIONNAIRES TERMINÉS

### Écran principal

Analyse en préparation.

------------------------------------------------------------------------

## État 7 --- RAPPORT PRÊT

### Écran principal

Découvrir le bilan.

------------------------------------------------------------------------

## État 8 --- RAPPORT CONSULTÉ

### Écran principal

Rapport + exercices + ressources + téléchargement.

------------------------------------------------------------------------

## État 9 --- ARCHIVÉ

### Écran principal

Accès limité ou expiré selon la politique.

------------------------------------------------------------------------

# 48. CAS PARTICULIER : L'ACHETEUR NE REMPLIT PAS LE TEST

Si l'acheteur ne commence pas son questionnaire, le tableau de bord doit
le ramener vers l'action :

> **Votre bilan est prêt à commencer.**

Ne pas afficher trop d'informations secondaires.

------------------------------------------------------------------------

# 49. CAS PARTICULIER : LE PARTENAIRE NE RÉPOND PAS

Le système peut permettre :

> **Renvoyer l'invitation**

mais il doit éviter les rappels excessifs.

Le premier utilisateur ne doit pas avoir l'impression que le système
exerce une pression sur son partenaire.

------------------------------------------------------------------------

# 50. CAS PARTICULIER : LE PARTENAIRE REFUSE

Le système doit permettre au partenaire de ne pas participer.

Aucune réponse ne doit être forcée.

Le premier utilisateur peut voir :

> **Votre partenaire n'a pas encore rejoint le bilan.**

Il ne doit pas recevoir les réponses ou résultats d'une seule personne
comme s'il s'agissait du bilan complet de couple.

------------------------------------------------------------------------

# 51. CAS PARTICULIER : QUESTIONNAIRE INCOMPLET

Si un utilisateur essaie de consulter le résultat alors qu'une partie
manque :

> **Votre bilan n'est pas encore disponible.**

> Pour analyser votre dynamique de couple, nous avons besoin des
> réponses des deux partenaires.

Bouton :

> **Voir ce qu'il reste à faire**

------------------------------------------------------------------------

# 52. CAS PARTICULIER : DOUBLE COMPTE

Le système doit empêcher un utilisateur de créer accidentellement deux
comptes pour le même service lorsque cela peut être détecté.

L'adresse email doit être associée au compte existant.

Le système peut proposer :

> **Vous avez déjà un compte KELYA. Connectez-vous pour continuer.**

------------------------------------------------------------------------

# 53. CAS PARTICULIER : PARTENAIRE DÉJÀ UTILISATEUR KELYA

Le partenaire clique sur le lien.

S'il est déjà connecté :

> **Vous avez été invité(e) à rejoindre un bilan KELYA COUPLE.**

S'il n'est pas connecté :

> Connexion KELYA.

Il doit ensuite être associé au Couple ID.

------------------------------------------------------------------------

# 54. CAS PARTICULIER : PARTENAIRE N'A PAS DE COMPTE

Le lien d'invitation doit lui permettre de :

1.  rejoindre ;
2.  créer son compte ;
3.  accepter l'invitation ;
4.  commencer son questionnaire.

Le processus doit rester fluide.

------------------------------------------------------------------------

# 55. PAIEMENT

Le paiement doit être rattaché au Couple ID ou à la commande qui précède
sa création.

La logique doit permettre de savoir :

-   qui a acheté ;
-   quelle offre ;
-   quand ;
-   statut du paiement ;
-   Couple ID associé ;
-   statut du second participant.

Le paiement doit être confirmé avant l'activation du parcours complet.

------------------------------------------------------------------------

# 56. REMBOURSEMENT / ANNULATION

Les règles commerciales doivent être définies séparément.

Le système doit cependant prévoir des statuts permettant de gérer :

``` text
PAID
REFUNDED
CANCELLED
EXPIRED
```

Une commande remboursée ne doit pas continuer à générer automatiquement
un rapport payant.

------------------------------------------------------------------------

# 57. SÉCURITÉ

Les données du couple doivent être protégées.

Les mécanismes essentiels comprennent :

-   authentification ;
-   autorisation par utilisateur ;
-   contrôle du Couple ID ;
-   protection des réponses individuelles ;
-   contrôle des accès au rapport ;
-   liens d'invitation sécurisés ;
-   expiration ou invalidation des invitations selon les règles ;
-   journalisation des actions sensibles ;
-   sauvegarde ;
-   politique de conservation.

------------------------------------------------------------------------

# 58. RÈGLE D'AUTORISATION

Le système doit toujours vérifier :

> **Cet utilisateur a-t-il réellement le droit d'accéder à cette donnée
> ?**

Il ne faut jamais considérer qu'un utilisateur peut accéder aux données
simplement parce qu'il connaît un Couple ID.

Le Couple ID sert à rejoindre le couple dans les conditions prévues.

Il ne doit pas devenir une clé permettant d'accéder à toutes les données
du dossier.

------------------------------------------------------------------------

# 59. DONNÉES INDIVIDUELLES ET DONNÉES DE COUPLE

Séparer logiquement :

``` text
USER DATA
│
├── profil A
└── profil B

COUPLE DATA
│
├── Couple ID
├── plan
├── statut
├── progression
└── rapport

QUESTIONNAIRE DATA
│
├── réponses A
└── réponses B
```

Cette séparation facilitera :

-   la sécurité ;
-   le calcul ;
-   le débogage ;
-   la maintenance ;
-   les évolutions futures.

------------------------------------------------------------------------

# 60. DONNÉES DU RAPPORT

Le rapport généré doit être associé au Couple ID.

Exemple :

``` text
Couple ID
    ↓
Assessment A
Assessment B
    ↓
Matching Result
    ↓
Report V1
Report Premium
Report Premium Plus
```

Les fichiers ou contenus générés doivent pouvoir être retrouvés sans
ambiguïté.

------------------------------------------------------------------------

# 61. MOTEUR DE RAPPORT

Le moteur de rapport ne doit pas être déclenché directement par le
bouton utilisateur sans validation.

Le système doit d'abord vérifier que les conditions sont réunies.

Puis :

``` text
VALIDATED
↓
SCORING
↓
MATCHING
↓
CONTENT SELECTION
↓
REPORT GENERATION
↓
QUALITY CHECK
↓
PUBLISH
```

------------------------------------------------------------------------

# 62. CONTRÔLE QUALITÉ

Avant de rendre le rapport visible, le système doit vérifier :

-   absence de sections vides ;
-   absence de données d'un autre couple ;
-   cohérence des noms ;
-   cohérence des pronoms ;
-   cohérence de l'offre ;
-   présence de la conclusion ;
-   présence des recommandations ;
-   présence des exercices requis ;
-   cohérence des scores ;
-   absence de formulations interdites.

Un rapport incomplet ne doit pas être publié.

------------------------------------------------------------------------

# 63. EXPÉRIENCE DE RÉVÉLATION

Lorsque le rapport est prêt, l'interface peut afficher une animation
légère.

Exemple :

``` text
Vos deux parcours
        ↓
     se rejoignent
        ↓
   Votre analyse
        ↓
   Votre rapport
```

Puis :

> **Votre bilan est prêt.**

Le bouton :

> **Découvrir votre bilan**

doit être le CTA principal.

------------------------------------------------------------------------

# 64. APRÈS LA PREMIÈRE LECTURE

Une fois le rapport ouvert, l'utilisateur doit pouvoir retrouver
facilement :

-   la synthèse ;
-   les forces ;
-   les différences ;
-   les priorités ;
-   les exercices ;
-   le plan d'action ;
-   les ressources ;
-   le téléchargement.

------------------------------------------------------------------------

# 65. RAPPORT PARTAGEABLE ?

Le partage du rapport doit être contrôlé.

Le système ne doit pas générer automatiquement un lien public.

Si une fonction de partage est ajoutée, elle doit être :

-   volontaire ;
-   sécurisée ;
-   limitée ;
-   révocable.

Par défaut, le rapport est privé.

------------------------------------------------------------------------

# 66. MOBILE

Le parcours doit être conçu d'abord pour mobile.

Le questionnaire doit être parfaitement utilisable avec un doigt.

Les résultats doivent être lisibles sans zoom.

Les tableaux doivent être transformés en cartes ou blocs responsives
lorsque nécessaire.

Les graphiques doivent rester compréhensibles.

Les exercices doivent rester confortables.

------------------------------------------------------------------------

# 67. DESKTOP

Sur ordinateur, l'interface peut utiliser davantage d'espace.

Le dashboard peut afficher simultanément :

-   progression ;
-   statut du partenaire ;
-   prochaine action ;
-   rapport ;
-   ressources.

Mais le design doit rester cohérent avec la version mobile.

------------------------------------------------------------------------

# 68. ONBOARDING VISUEL

L'onboarding doit pouvoir intégrer :

-   illustrations ;
-   micro-animations ;
-   icônes ;
-   progression ;
-   cartes ;
-   étapes ;
-   transitions.

Les animations ne doivent pas ralentir le parcours.

Elles doivent renforcer la sensation :

> **« Je suis accompagné(e) dans chaque étape. »**

------------------------------------------------------------------------

# 69. ÉVITER LA SURCHARGE

Même si KELYA COUPLE est un produit riche, l'utilisateur ne doit pas
voir toutes les fonctionnalités en même temps.

Le principe doit être :

> **Une étape principale à la fois.**

Le dashboard peut afficher les autres informations en second niveau.

------------------------------------------------------------------------

# 70. ARCHITECTURE FUTURE

L'architecture doit permettre ultérieurement d'ajouter :

-   nouveaux questionnaires ;
-   nouveaux profils ;
-   nouveaux types de couple ;
-   nouvelles offres ;
-   nouvelles langues ;
-   nouveaux rapports ;
-   nouveaux exercices ;
-   nouvelles ressources ;
-   accompagnements humains.

Il ne faut donc pas coder le produit de manière tellement spécifique à
EX-10 qu'il devient impossible d'ajouter EX-11, EX-12 ou de nouveaux
profils.

------------------------------------------------------------------------

# 71. SYSTÈME DE TEMPLATES

Les rapports doivent utiliser des templates.

Exemple :

``` text
REPORT_TEMPLATE
│
├── V1
├── PREMIUM
└── PREMIUM_PLUS
```

Le contenu doit être sélectionné dynamiquement.

Les données du couple viennent du moteur.

Le template apporte la structure.

------------------------------------------------------------------------

# 72. RÈGLE DE NON-DUPLICATION

Le système doit éviter de générer trois fois le même paragraphe dans :

-   synthèse ;
-   conclusion ;
-   recommandation ;
-   plan d'action.

La personnalisation doit être cohérente sans être répétitive.

------------------------------------------------------------------------

# 73. RÈGLE DE COHÉRENCE DES NOMS

Le système doit toujours utiliser les noms réels associés au Couple ID.

Exemple :

> Thomas et Sarah

et non :

> Jean et Sarah

ou :

> le participant A et le participant B

sauf lorsqu'un texte nécessite volontairement une formulation neutre.

------------------------------------------------------------------------

# 74. RÈGLE DE GENRE ET DE PRONOMS

Les formulations doivent respecter les informations disponibles.

Le système doit éviter les erreurs de genre ou de rôle.

Lorsque les informations sont insuffisantes, il doit utiliser une
formulation neutre plutôt que d'inventer.

------------------------------------------------------------------------

# 75. RÈGLE DE STATUT DU COUPLE

Le rapport peut adapter certaines formulations selon :

-   couple ;
-   fiancés ;
-   mariés.

Mais les résultats ne doivent pas être artificiellement modifiés.

Le statut relationnel influence le contexte, pas la vérité des réponses.

------------------------------------------------------------------------

# 76. RÈGLE DE CONFIDENTIALITÉ DU PARTENAIRE

Même lorsque les deux partenaires ont terminé :

> les réponses brutes restent protégées.

Le système doit présenter principalement les résultats interprétés.

Si certaines réponses textuelles doivent apparaître dans le rapport,
elles doivent être sélectionnées selon les règles du moteur et les
consentements prévus.

------------------------------------------------------------------------

# 77. SUIVI DE PROGRESSION

Le système doit conserver :

-   date de début ;
-   date de dernière activité ;
-   pourcentage de questionnaire ;
-   statut du partenaire ;
-   date de fin ;
-   date de génération du rapport ;
-   date de dernière consultation.

Ces données peuvent servir au dashboard et aux notifications.

------------------------------------------------------------------------

# 78. ANALYTICS PRODUIT

KELYA doit pouvoir mesurer sans exposer les données sensibles :

-   nombre de visiteurs ;
-   taux d'achat ;
-   taux de création de couple ;
-   taux d'invitation ;
-   taux de participation du partenaire ;
-   taux de complétion ;
-   temps moyen de complétion ;
-   taux de génération de rapport ;
-   téléchargement ;
-   utilisation des ressources ;
-   conversion vers une session ou une offre complémentaire.

Les analytics doivent respecter les règles de confidentialité
applicables.

------------------------------------------------------------------------

# 79. OBJECTIF DU FUNNEL

Le parcours doit minimiser les abandons entre :

``` text
Découverte
↓
Achat
↓
Création
↓
Invitation
↓
Questionnaire A
↓
Questionnaire B
↓
Rapport
```

Le principal risque produit est que le premier acheteur termine sa
partie mais que le partenaire ne complète jamais la sienne.

L'onboarding et les rappels doivent donc être conçus pour favoriser la
complétion sans pression.

------------------------------------------------------------------------

# 80. INDICATEUR CRITIQUE

Le KPI produit le plus important après le paiement est :

> **Pourcentage de couples dont les deux questionnaires sont
> complétés.**

Un achat qui ne mène pas à deux questionnaires complétés ne permet pas
de produire l'expérience centrale.

------------------------------------------------------------------------

# 81. INDICATEUR DE VALEUR

Un autre indicateur important :

> **Pourcentage de couples qui consultent réellement leur rapport.**

Puis :

> **Pourcentage de couples qui téléchargent au moins un document ou
> exercice.**

Et éventuellement :

> **Pourcentage de couples qui utilisent une ressource recommandée.**

------------------------------------------------------------------------

# 82. PRINCIPE DE CONVERSION VERS KELYA

Après le rapport, le système peut faire découvrir d'autres services
KELYA.

Mais la priorité reste :

> **faire vivre une bonne expérience KELYA COUPLE.**

Ne pas transformer la dernière page du rapport en catalogue commercial.

Une recommandation pertinente vaut mieux que dix offres affichées.

------------------------------------------------------------------------

# 83. FIN DE PARCOURS

Après lecture du rapport :

> **Vous avez maintenant une meilleure carte de votre dynamique de
> couple.**

Puis :

> **À vous de décider ce que vous voulez en faire.**

Le système peut ensuite proposer :

-   télécharger ;
-   commencer un exercice ;
-   découvrir une ressource ;
-   réserver une session ;
-   revenir plus tard.

------------------------------------------------------------------------

# 84. ARCHITECTURE RÉSUMÉE

``` text
                    KELYA
                      │
               KELYA COUPLE
                      │
             ┌────────┴────────┐
             │                 │
         ESSENTIEL       PREMIUM PLUS
         30 000 FCFA      50 000 FCFA
             │                 │
             └────────┬────────┘
                      ↓
                  PAIEMENT
                      ↓
                 COMPTE KELYA
                      ↓
                COUPLE ID
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
    PARTICIPANT A           PARTICIPANT B
          ↓                       ↓
    QUESTIONNAIRE            QUESTIONNAIRE
          │                       │
          └───────────┬───────────┘
                      ↓
                  VALIDATION
                      ↓
                   MATCHING
                      ↓
                   ANALYSE
                      ↓
               GÉNÉRATION
                      ↓
                CONTRÔLE
                      ↓
              RAPPORT PRÊT
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
      RAPPORT                  OUTILS
          ↓                       ↓
   TÉLÉCHARGEMENT           RESSOURCES
```

------------------------------------------------------------------------

# 85. DÉFINITION DU PRODUIT EN UNE PHRASE

> **KELYA COUPLE est un service spécialisé de KELYA qui permet à deux
> partenaires de réaliser séparément un bilan relationnel, puis de
> recevoir une analyse croisée personnalisée de leur dynamique de
> couple, accompagnée de recommandations et d'outils adaptés à leurs
> besoins.**

------------------------------------------------------------------------

# 86. INSTRUCTIONS FINALES POUR CURSOR

Ce document doit être considéré comme la référence fonctionnelle de
l'architecture KELYA COUPLE.

Cursor doit respecter les principes suivants :

1.  **KELYA COUPLE est intégré à KELYA, pas une application
    indépendante.**
2.  **Le service est commercialement séparé des offres Discovery,
    Premium et Alliance.**
3.  **Le paiement concerne deux participants.**
4.  **Le premier acheteur peut inviter son partenaire par lien ou par
    code.**
5.  **Un Couple ID ne peut contenir que deux participants.**
6.  **Chaque participant possède son propre compte et son propre
    questionnaire.**
7.  **Les réponses individuelles restent confidentielles.**
8.  **Le rapport de couple n'est généré qu'après complétion des deux
    questionnaires.**
9.  **Le tableau de bord doit toujours indiquer la prochaine action.**
10. **L'onboarding doit être chaleureux, visuel, progressif et
    premium.**
11. **L'interface doit reprendre l'identité visuelle KELYA.**
12. **L'expérience KELYA COUPLE doit rester focalisée sur le service
    acheté.**
13. **Les utilisateurs KELYA existants conservent leur compte KELYA.**
14. **Les nouveaux utilisateurs sont créés dans le même écosystème
    KELYA.**
15. **Le système doit être mobile-first.**
16. **Les rapports et exercices doivent être téléchargeables.**
17. **Le rapport doit être privé par défaut.**
18. **Les données doivent être séparées entre données individuelles et
    données de couple.**
19. **Le système doit pouvoir évoluer vers d'autres modèles de bilan.**
20. **Aucune logique ne doit considérer un score comme une condamnation
    du couple.**

------------------------------------------------------------------------

# 87. RELATION AVEC LES AUTRES DOCUMENTS

Ce document doit être lu avec les documents suivants :

``` text
01_NAMING_ET_POSITIONNEMENT_KELYA_COUPLE.md
        ↓
02_ARCHITECTURE_PRODUIT_KELYA_COUPLE.md
        ↓
03_PARCOURS_UTILISATEUR_KELYA_COUPLE.md
        ↓
04_MOTEUR_MATCHING_ET_SCORING.md
        ↓
05_MOTEUR_DE_GENERATION_DES_RAPPORTS.md
        ↓
06_INTERFACE_ET_EXPERIENCE_KELYA_COUPLE.md
```

Le présent document définit **le fonctionnement global du produit**.

Les documents suivants préciseront progressivement :

-   le parcours écran par écran ;
-   le calcul ;
-   la génération ;
-   l'expérience visuelle.

------------------------------------------------------------------------

# FIN DU DOCUMENT 02
