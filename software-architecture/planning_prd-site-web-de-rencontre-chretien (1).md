# PRD — KELIAA

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026
**Statut :** aligné sur le produit actuellement implémenté

## 1. Vision

KELIAA est une plateforme web de rencontres chrétiennes sérieuses destinée à l’Afrique francophone, à l’UEMOA et à la diaspora. Elle aide les célibataires à construire une relation orientée vers le mariage grâce à cinq piliers de discernement, une compatibilité expliquée, une modération active et un accompagnement spirituel.

### Principes produit

- Pas de swipe compulsif.
- La foi est centrale, sans ton moralisateur.
- La compatibilité est expliquée.
- Les profils et interactions sont protégés.
- L’utilisateur décide toujours ; EVA accompagne sans décider à sa place.
- Mobile-first et utilisable sur connexion 3G.

## 2. Utilisateurs

### Membre

Adulte chrétien célibataire vivant en Afrique francophone ou dans la diaspora, recherchant une relation sérieuse en vue du mariage.

### Administrateur

Gère les membres, profils, contenus, paiements, règles, analytics et intégrations.

### Modérateur

Accès limité aux opérations de modération : profils, photos, signalements, recommandations, conversations et sanctions.

## 3. Offres commerciales

### Découverte — gratuit

- Profil et questionnaires.
- 3 suggestions par jour.
- 5 nouvelles conversations par mois.
- 5 messages envoyés par conversation.
- EVA : 3 questions par jour.
- Journal, ressources et Bouclier de bienveillance.

### Alliance — 5 000 FCFA / 30 jours

- 15 suggestions par jour.
- 25 nouvelles conversations par mois.
- 100 messages par conversation.
- EVA : 20 questions par jour.
- Score détaillé.
- Badge Alliance.
- Priorité douce dans les suggestions.
- Support prioritaire.
- Renouvellement manuel.

### Essentiel (legacy)

Ancien plan interne à 2 500 FCFA, conservé uniquement pour compatibilité avec d’anciens abonnements. Il n’est pas affiché aux nouveaux utilisateurs.

## 4. Les cinq piliers KELIAA

1. Personnalité et stress
2. Foi et vie spirituelle
3. Relation et communication
4. Vie de couple
5. Finances et projet de foyer

Les réponses produisent un profil de discernement et alimentent la compatibilité. Elles sont modifiables après 60 jours.

## 5. Parcours visiteur

| Route | Objectif |
|---|---|
| `/` | Présenter la promesse et convertir vers l’inscription |
| `/how-it-works` | Expliquer le fonctionnement et les cinq piliers |
| `/pricing` | Comparer Découverte et Alliance |
| `/about` | Présenter la mission |
| `/blog`, `/blog/[slug]` | Contenu éditorial |
| `/contact` | Contacter l’équipe |
| `/community-network` | Réseau communautaire |
| `/spiritual-resources` | Ressources spirituelles |
| `/pastoral-endorsement` | Présenter la recommandation pastorale |
| `/moderation`, `/charte` | Sécurité et règles |
| `/confidentialite`, `/cgu`, `/mentions-legales` | Informations légales |
| `/register`, `/login` | Créer un compte ou se connecter |
| `/forgot-password`, `/reset-password` | Récupérer l’accès |

## 6. Parcours membre

### Onboarding

- Création du compte.
- Informations essentielles : identité, pays, ville, foi, église et pasteur.
- Préférences et valeurs.
- Photos.
- Progression vers les questionnaires.
- Écran de transition et statut de modération.

### Accueil `/dashboard`

- Salutation et progression.
- Rappels de profil, photo, tests et abonnement.
- Sélection de compatibilités.
- Textes administrables.
- Emplacements publicitaires/sponsorisés administrables.

### Découvrir `/compatibility`

- Suggestions ordonnées par compatibilité.
- Fiche détaillée `/compatibility/[id]`.
- Score global et explications.
- Actions sociales et démarrage de conversation selon les droits.

### Messages `/messages`

- Liste des conversations et salon `/messages/[id]`.
- Limites selon l’offre.
- Temps réel lorsque disponible.
- Signalement.
- Bouclier de bienveillance et médiation EVA sans génération automatique des messages personnels.

### Tests `/assessments`

- Hub des cinq piliers.
- Questionnaire `/assessments/[slug]`.
- Progression, résultats et axes de croissance.
- Nouveau passage après 60 jours.

### Académie `/academie-mariage`

- Modules et leçons.
- Contenu éditable depuis le back-office.
- Titres, résumés, points clés, ressources, exercices, durée et vidéo.
- Intégration YouTube configurable.

### Profil `/profile`

- Informations personnelles et spirituelles.
- Photos et préférences.
- Recommandation d’église/pasteur.
- État de vérification.

### Alliance `/billing`

- Offre actuelle, quotas et échéance.
- Passage à Alliance ou renouvellement.
- Choix Mobile Money/carte lorsque Bictorys est actif.
- Aucun renouvellement automatique en V1.

### Autres espaces

- `/notifications` : alertes.
- `/settings` : préférences, confidentialité et compte.
- `/help` : aide.

## 7. Coach EVA

EVA est une conseillère spirituelle et relationnelle intégrée :

- ton doux, biblique, pratique et sans jugement ;
- quotas selon l’offre ;
- explications et encouragements ;
- axes de progression ;
- médiation et protection des conversations ;
- configuration admin du ton, des sujets interdits et de la base de connaissances.

EVA ne doit pas :

- promettre un résultat amoureux ;
- remplacer un pasteur, un psychologue ou un professionnel de santé ;
- décider si une personne doit être choisie ;
- rédiger automatiquement les messages intimes à la place du membre.

## 8. Modération et confiance

- Validation des profils.
- Modération des photos.
- Règles automatiques basées sur la complétion, la présence d’une photo et les critères configurés.
- Vérification humaine possible à tout moment.
- Signalements et historique d’événements.
- Avertissements, suspensions temporaires et blocages.
- Score de confiance.
- Recommandations pastorales avec validation admin.
- Détection configurable de termes interdits dans les conversations.

L’« IA d’acceptation » actuelle est principalement un moteur de règles explicables, pas un LLM autonome.

## 9. Back-office

### Dashboard et analytique

- Membres, abonnements, revenus, signalements et photos en attente.
- Inscriptions, rétention, matching, conversations et activité.
- Répartition ville, pays, âge et dénomination.
- Taux de conversion et indicateurs de confiance.

### Membres et profils

- Recherche, filtres et fiche détaillée.
- Création d’un membre.
- Rôle admin/modérateur.
- Vérification et statut de modération.
- Attribution/extension Alliance.
- Sanctions et recommandations pastorales.

### Contenu

- Textes de l’application.
- Publicités et emplacements.
- Académie et vidéos.
- Configuration EVA.
- Notes et connecteurs externes.

### Paiements

- Paiements et abonnements récents.
- Journal d’audit.
- Statuts des providers.
- Vérification de clé Bictorys.
- Création d’une charge sandbox.

## 10. Paiements

### Providers

1. **Bictorys** : provider prioritaire.
2. **CinetPay** : provider complémentaire.
3. **Stripe** : futur, non actif.

### Moyens

- Mobile Money en UEMOA.
- Carte bancaire pour la diaspora ou sur choix utilisateur.
- Bictorys préselectionne automatiquement le mode selon le pays, avec possibilité de le modifier.

### Flux

1. Le membre choisit Alliance.
2. Une souscription et un paiement `pending` sont créés.
3. Une charge est créée chez le provider.
4. Le membre est redirigé vers la page hébergée.
5. Le provider envoie un webhook signé.
6. Le serveur met à jour le paiement.
7. L’abonnement est activé pour 30 jours.
8. L’événement est enregistré dans le journal d’audit.

Le statut reçu du navigateur n’est jamais une preuve de paiement.

## 11. CMS et paramètres

La table `platform_settings` porte notamment :

- textes applicatifs ;
- publicités ;
- règles d’auto-modération ;
- surcharges Académie ;
- règles photos ;
- règles de sanctions ;
- configuration EVA ;
- configuration YouTube ;
- intégrations.

## 12. Architecture technique

- Next.js 16 App Router.
- React 19 et TypeScript.
- Tailwind CSS 4.
- Supabase Auth, Postgres, RLS et Realtime.
- Server Actions pour les opérations métier.
- Webhooks serveur pour les paiements.
- GSAP, Lenis et React Three Fiber pour certaines expériences marketing.
- Déploiement Vercel.

## 13. Exigences non fonctionnelles

- Autorisation serveur systématique.
- RLS sur les données Supabase.
- Service role uniquement côté serveur.
- Webhooks signés et traitements idempotents.
- Audit des événements de paiement.
- WCAG AA.
- Responsive mobile/desktop.
- Performance acceptable sur 3G.
- Aucun secret exposé au client.

## 14. Indicateurs

- Taux de complétion du profil.
- Taux de complétion des cinq piliers.
- Profils approuvés/refusés.
- Suggestions, matchs et conversations.
- Conversion Découverte vers Alliance.
- Abonnements actifs, expirés et renouvellements.
- Revenus confirmés.
- Signalements et délais de résolution.
- Utilisation EVA et Académie.

## 15. Hors périmètre actuel

- Application native iOS/Android.
- Appels audio/vidéo intégrés.
- Renouvellement bancaire automatique.
- Stripe actif.
- IA autonome décidant des acceptations ou relations.
- Marketplace multi-coachs complète.
- Internationalisation complète hors français.

## 16. Critères de cohérence documentaire

Toute évolution des offres, piliers, routes, providers ou libellés doit mettre à jour :

- ce PRD ;
- le Design Brief ;
- `08_Design_System.md` si l’identité visuelle change ;
- `10_Payments_Subscriptions.md` si le paiement change ;
- `11_Admin_Backoffice.md` si l’admin change ;
- `16_Implementation_Roadmap.md` si le statut ou les priorités changent.
