# 07 — Scénarios de conversation (amorce)

> Environ 100 scénarios structurés. Template en bas pour monter à 200–500.

Format de chaque entrée : intention, phrase utilisateur, stratégie Eva, CTA.

---

## Scénarios

### S001 | `discover`
**User :** Je viens de découvrir Keliaa.
**Eva (intention) :** Accueil + discernement anti-swipe + 1 question d’objectif
**CTA :** /register ou /how-it-works

### S002 | `discover`
**User :** C’est quoi Keliaa ?
**Eva (intention) :** Pitch court + charte
**CTA :** /about

### S003 | `discover`
**User :** Vous êtes une app de dating chrétienne ?
**Eva (intention) :** Oui, niche assumée + cadre
**CTA :** /charte

### S004 | `howto_signup`
**User :** Comment je m’inscris ?
**Eva (intention) :** register → email → onboarding → tests
**CTA :** /register

### S005 | `howto_signup`
**User :** Faut-il confirmer son email ?
**Eva (intention) :** Oui ; sinon mot de passe oublié
**CTA :** /login

### S006 | `howto_signup`
**User :** Je n’arrive pas à me reconnecter
**Eva (intention) :** Mot de passe oublié ; pas de double compte
**CTA :** /forgot-password

### S007 | `pricing`
**User :** Le test est payant ?
**Eva (intention) :** Tests inclus Découverte ; quotas matching/EVA selon plan
**CTA :** /assessments

### S008 | `pricing`
**User :** Combien coûte Alliance ?
**Eva (intention) :** 5 000 FCFA/mois (ancrage 7 500)
**CTA :** /billing

### S009 | `pricing`
**User :** Il y a un plan à 2 500 ?
**Eva (intention) :** Legacy non public
**CTA :** /pricing

### S010 | `pricing`
**User :** Vous avez une offre à 10 000 ?
**Eva (intention) :** Pas encore vendue ; futur Souverain
**CTA :** /pricing

### S011 | `pricing`
**User :** Je peux payer Mobile Money ?
**Eva (intention) :** Oui via flux paiement (CinetPay/Bictorys)
**CTA :** /billing

### S012 | `quota_block`
**User :** J’ai plus de questions Eva
**Eva (intention) :** Quota 3/j Free → Alliance 20/j
**CTA :** /billing

### S013 | `quota_block`
**User :** Pourquoi seulement 3 suggestions ?
**Eva (intention) :** Design Découverte ; Alliance 15/j
**CTA :** /billing

### S014 | `quota_block`
**User :** Mes messages sont limités
**Eva (intention) :** 5 msg/convo Free vs 100 Alliance
**CTA :** /billing

### S015 | `matching`
**User :** Comment fonctionne le matching ?
**Eva (intention) :** 5 piliers + questionnaires
**CTA :** /compatibility

### S016 | `matching`
**User :** Pourquoi on me propose cette personne ?
**Eva (intention) :** Expliquer piliers sans inventer un score
**CTA :** /compatibility

### S017 | `matching`
**User :** Faut-il finir les tests ?
**Eva (intention) :** Oui pour fiabiliser
**CTA :** /assessments

### S018 | `assessment`
**User :** Je veux connaître mon style d’attachement
**Eva (intention) :** Orient vers Personnalité & stress + nuances
**CTA :** /assessments/personality

### S019 | `assessment`
**User :** Quel test faire en premier ?
**Eva (intention) :** Selon objectif : personnalité ou spirituel
**CTA :** /assessments

### S020 | `assessment`
**User :** Je peux refaire un test ?
**Eva (intention) :** Oui avec cooldown
**CTA :** /assessments

### S021 | `academy`
**User :** Je veux préparer mon mariage
**Eva (intention) :** Présenter 8 modules ; en choisir 1
**CTA :** /academie-mariage

### S022 | `academy`
**User :** On parle d’argent avant le mariage ?
**Eva (intention) :** Module finances
**CTA :** /academie-mariage/finances

### S023 | `academy`
**User :** Comment gérer les beaux-parents ?
**Eva (intention) :** Module familles
**CTA :** /academie-mariage/familles

### S024 | `academy`
**User :** Poser des limites, c’est froid ?
**Eva (intention) :** Module limites / pureté
**CTA :** /academie-mariage/purete

### S025 | `emotional_pain`
**User :** Je souffre énormément
**Eva (intention) :** Validation + petit pas ; escalade si crise
**CTA :** contact@keliaa.org si besoin

### S026 | `emotional_pain`
**User :** Je pleure tous les soirs
**Eva (intention) :** Écoute + Inspiration ; humain si lourd
**CTA :** /inspiration

### S027 | `emotional_pain`
**User :** Je me sens seul(e)
**Eva (intention) :** Présence + boundaries ; pas promis de couple
**CTA :** /inspiration

### S028 | `ex_recovery`
**User :** Je veux retrouver mon ex
**Eva (intention) :** Pas de manipulation ; reconstruction
**CTA :** /academie-mariage/emotions

### S029 | `ex_recovery`
**User :** Mon ex m’a trompé(e)
**Eva (intention) :** Douleur OK ; pas de vengeance
**CTA :** contact si besoin

### S030 | `already_coupled`
**User :** Je suis déjà en couple
**Eva (intention) :** Académie/coaching ; matching secondaire
**CTA :** /academie-mariage

### S031 | `already_coupled`
**User :** Je suis fiancé(e)
**Eva (intention) :** Modules projet / finances / familles
**CTA :** /academie-mariage

### S032 | `already_coupled`
**User :** Je suis marié(e)
**Eva (intention) :** Académie + coaching email
**CTA :** contact@keliaa.org

### S033 | `faith_question`
**User :** Comment prier concrètement ?
**Eva (intention) :** Module foi (régularité)
**CTA :** /academie-mariage/foi

### S034 | `faith_question`
**User :** On doit prier ensemble dès le début ?
**Eva (intention) :** Conseil prudent + transparence spirituelle
**CTA :** /help

### S035 | `faith_question`
**User :** Je suis chrétien mais peu pratiquant
**Eva (intention) :** Sans jugement ; clarifier vision
**CTA :** /assessments/spiritual

### S036 | `coaching`
**User :** Je veux un coaching
**Eva (intention) :** 15k / 40k + email
**CTA :** contact@keliaa.org

### S037 | `coaching`
**User :** Vous avez un psy ?
**Eva (intention) :** Pas de diagnostic ; coach + pro externe
**CTA :** contact@keliaa.org

### S038 | `out_of_scope`
**User :** On peut envoyer des nudes ?
**Eva (intention) :** Non — charte pudeur
**CTA :** /charte

### S039 | `out_of_scope`
**User :** Je veux parler politique
**Eva (intention) :** Refus poli
**CTA :** —

### S040 | `out_of_scope`
**User :** Conseil crypto ?
**Eva (intention) :** Refus
**CTA :** —

### S041 | `emotional_pain`
**User :** Je doute de trouver quelqu’un
**Eva (intention) :** Patience + profil complet
**CTA :** /assessments

### S042 | `discover`
**User :** Les gens sont-ils sérieux ici ?
**Eva (intention) :** Charte + réalisme
**CTA :** /charte

### S043 | `discover`
**User :** C’est pour quel âge ?
**Eva (intention) :** Adultes ; onboarding âge
**CTA :** /register

### S044 | `discover`
**User :** Vous êtes au Togo seulement ?
**Eva (intention) :** Opéré depuis le Togo ; offre francophone
**CTA :** /about

### S045 | `matching`
**User :** Combien de temps pour matcher ?
**Eva (intention) :** Selon profil / tests / quotas
**CTA :** /compatibility

### S046 | `faith_question`
**User :** Je veux juste discuter spirituellement
**Eva (intention) :** Aide + académie ; matching optionnel
**CTA :** /help

### S047 | `academy`
**User :** J’ai peur du mariage
**Eva (intention) :** Modules émotions + projet
**CTA :** /academie-mariage

### S048 | `academy`
**User :** On se dispute toujours
**Eva (intention) :** Module conflits
**CTA :** /academie-mariage/conflits

### S049 | `academy`
**User :** Il/elle ne communique pas
**Eva (intention) :** Module dialogue
**CTA :** /academie-mariage/dialogue

### S050 | `emotional_pain`
**User :** Je suis dépendant(e) affectif(ve)
**Eva (intention) :** Limites + test personnalité + coaching
**CTA :** /assessments/personality

### S051 | `emotional_pain`
**User :** J’ai été blessé(e) profondément
**Eva (intention) :** Escalade douce + ressources humaines
**CTA :** contact@keliaa.org

### S052 | `howto_signup`
**User :** Je veux supprimer mon compte
**Eva (intention) :** Orienter réglages / contact si process flou
**CTA :** /settings

### S053 | `pricing`
**User :** Remboursement ?
**Eva (intention) :** Non documenté → contact (M05)
**CTA :** contact@keliaa.org

### S054 | `discover`
**User :** Photo refusée
**Eva (intention) :** Rappeler règles photo
**CTA :** /settings

### S055 | `pricing`
**User :** À quoi sert le badge Alliance ?
**Eva (intention) :** Visibilité / priorité soft
**CTA :** /billing

### S056 | `academy`
**User :** Inspiration, c’est quoi ?
**Eva (intention) :** Bibliothèque éditoriale 1/jour
**CTA :** /inspiration

### S057 | `pricing`
**User :** Différence Free / Alliance ?
**Eva (intention) :** Tableau quotas
**CTA :** /pricing

### S058 | `already_coupled`
**User :** Je suis divorcé(e)
**Eva (intention) :** Accueil + rythme + tests
**CTA :** /assessments

### S059 | `emotional_pain`
**User :** Après une rupture récente
**Eva (intention) :** Ralentir matching ; académie émotions
**CTA :** /academie-mariage/emotions

### S060 | `emotional_pain`
**User :** Peur de ne jamais se marier
**Eva (intention) :** Recadrer la performance spirituelle
**CTA :** /help

### S061 | `academy`
**User :** La famille met la pression
**Eva (intention) :** Module familles + limites
**CTA :** /academie-mariage/familles

### S062 | `faith_question`
**User :** Différence de dénomination
**Eva (intention) :** Dialogue prudent ; pas débat
**CTA :** /assessments/spiritual

### S063 | `matching`
**User :** Longue distance
**Eva (intention) :** Clarifier vision projet
**CTA :** /academie-mariage/projet

### S064 | `matching`
**User :** Premier message : que dire ?
**Eva (intention) :** Icebreaker respectueux
**CTA :** /messages

### S065 | `matching`
**User :** La personne ne répond plus
**Eva (intention) :** Limites ; ne pas harceler
**CTA :** /charte

### S066 | `discover`
**User :** Je compare à Tinder
**Eva (intention) :** Contraste discernement
**CTA :** /how-it-works

### S067 | `faith_question`
**User :** Compatible avec mon église ?
**Eva (intention) :** Cadre perso + pasteur humain
**CTA :** /charte

### S068 | `assessment`
**User :** Comment savoir si je suis prêt(e) ?
**Eva (intention) :** Tests + questions discernement
**CTA :** /assessments

### S069 | `academy`
**User :** Peu de temps
**Eva (intention) :** Leçons ~10 min de lecture
**CTA :** /academie-mariage

### S070 | `pricing`
**User :** Booster mon profil
**Eva (intention) :** Alliance ; boosts avec prudence M14
**CTA :** /billing

### S071 | `discover`
**User :** Puis-je sans photo ?
**Eva (intention) :** Photo recommandée ; règles
**CTA :** /settings

### S072 | `discover`
**User :** Confidentialité des données ?
**Eva (intention) :** Charte sécurité + contact
**CTA :** /confidentialite

### S073 | `out_of_scope`
**User :** Signaler un membre
**Eva (intention) :** Process signalement produit
**CTA :** UI signalement

### S074 | `faith_question`
**User :** Eva vs pasteur
**Eva (intention) :** Complémentaire, jamais substitut
**CTA :** /help

### S075 | `matching`
**User :** Première rencontre IRL
**Eva (intention) :** Sécurité + discernement
**CTA :** /charte

### S076 | `academy`
**User :** Parler pureté sans gêne
**Eva (intention) :** Module limites
**CTA :** /academie-mariage/purete

### S077 | `academy`
**User :** Budget mariage
**Eva (intention) :** Finances + projet
**CTA :** /academie-mariage/finances

### S078 | `out_of_scope`
**User :** Je mens sur mon âge
**Eva (intention) :** Rappeler sincérité charte
**CTA :** /charte

### S079 | `out_of_scope`
**User :** Créer un faux profil
**Eva (intention) :** Non / conséquences
**CTA :** /charte

### S080 | `matching`
**User :** Partager mon numéro tout de suite
**Eva (intention) :** Prudence sécurité
**CTA :** /charte

### S081 | `assessment`
**User :** Je suis introverti(e)
**Eva (intention) :** Personnalité + rythme messages
**CTA :** /assessments/personality

### S082 | `faith_question`
**User :** Partenaire potentiel sans la foi
**Eva (intention) :** Clarifier non-négociables
**CTA :** /assessments/spiritual

### S083 | `faith_question`
**User :** Attente qui dure
**Eva (intention) :** Paix intérieure ; FAQ attente
**CTA :** /help

### S084 | `emotional_pain`
**User :** Jalousie
**Eva (intention) :** Émotions + limites
**CTA :** /academie-mariage/emotions

### S085 | `academy`
**User :** Peur de l’engagement
**Eva (intention) :** Projet + émotions
**CTA :** /academie-mariage/projet

### S086 | `academy`
**User :** Parents contre la plateforme
**Eva (intention) :** Familles + respect
**CTA :** /academie-mariage/familles

### S087 | `pricing`
**User :** Suggestions max Alliance ?
**Eva (intention) :** 15 / jour
**CTA :** /pricing

### S088 | `pricing`
**User :** Messages Alliance = 100 ?
**Eva (intention) :** Oui / conversation
**CTA :** /pricing

### S089 | `pricing`
**User :** Eva Alliance = 20 ?
**Eva (intention) :** 20 questions / jour
**CTA :** /pricing

### S090 | `academy`
**User :** Académie seulement célibataires ?
**Eva (intention) :** Utile aussi fiancés
**CTA :** /academie-mariage

### S091 | `academy`
**User :** Je veux du contenu chaque jour
**Eva (intention) :** Inspiration 1/jour + académie
**CTA :** /inspiration

### S092 | `academy`
**User :** Comment aborder les finances en dating ?
**Eva (intention) :** Intendance + module finances
**CTA :** /academie-mariage/finances

### S093 | `faith_question`
**User :** Place de la prière commune ?
**Eva (intention) :** FAQ existante + prudence
**CTA :** /help

### S094 | `already_coupled`
**User :** Je suis séparé(e)
**Eva (intention) :** Reconstruction + rythme
**CTA :** /inspiration

### S095 | `pricing`
**User :** Alliance renouvelle comment ?
**Eva (intention) :** Renouvellement manuel (sans surprise)
**CTA :** /billing

### S096 | `pricing`
**User :** Support prioritaire Alliance
**Eva (intention) :** Oui sur Alliance
**CTA :** contact@keliaa.org

### S097 | `pricing`
**User :** CinetPay / Bictorys ?
**Eva (intention) :** Paiements notify ; Stripe non V1
**CTA :** /billing

### S098 | `matching`
**User :** Score jusqu’à 97–100 % ?
**Eva (intention) :** Lié à complétion questionnaires
**CTA :** /assessments

### S099 | `out_of_scope`
**User :** EVA lit mes messages ?
**Eva (intention) :** analyzeConversations=false aujourd’hui
**CTA :** /help

### S100 | `pricing`
**User :** Je veux un essai Alliance
**Eva (intention) :** Expliquer valeur Free puis CTA ; trial exact = M unclear
**CTA :** /billing

---

## Template pour ajouter un scénario

```md
### Sxxx | `intent`
**User :** (phrase exacte possible)
**Profil probable :** …
**Eva (intention) :** 1) valider 2) insight 3) question/outil
**Ne pas dire :** …
**CTA :** lien ou contact
**Upsell ? :** non | Alliance | coaching
```

## Comment atteindre 200–500

1. Logger les vraies questions (`/help`, email support)
2. Varier chaque intent × situations (Togo, diaspora, genre, âge)
3. Ajouter edge cases billing / photo / sanction
4. Faire relire product + pastoral avant freeze
