# Design Brief — KELLIA

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026
**Statut :** source de vérité design produit

## 1. Le projet

KELLIA est une plateforme web de rencontres chrétiennes sérieuses pour l’Afrique francophone, l’UEMOA et la diaspora. L’expérience aide les célibataires à discerner une relation durable grâce à cinq piliers de compatibilité, à un cadre de confiance et à un accompagnement spirituel.

KELLIA n’est pas une application de swipe. Le produit privilégie la profondeur, la compatibilité expliquée, la sécurité, la progression personnelle et la construction d’un projet de mariage.

## 2. Public et contraintes

- Célibataires chrétiens adultes en Afrique francophone et dans la diaspora.
- Usage majoritairement mobile, souvent sur connexion 3G et appareil d’entrée de gamme.
- Français comme langue principale.
- Paiement accessible par Mobile Money en UEMOA et carte pour la diaspora.
- Interface responsive web/PWA, sans application native obligatoire.
- Ton digne, chaleureux, rassurant, biblique et non moralisateur.

## 3. Positionnement

La promesse de KELLIA repose sur :

1. **Le discernement** : cinq questionnaires structurés au lieu d’un choix superficiel.
2. **La compatibilité expliquée** : scores et axes compréhensibles.
3. **La confiance** : profils et photos modérés, signalements et sanctions.
4. **L’accompagnement** : Coach EVA, axes de progression et Académie du mariage.
5. **L’alliance** : une offre payante simple, manuelle et sans reconduction surprise.

## 4. Marque et vocabulaire officiel

| Élément | Nom officiel |
|---|---|
| Marque | **KELLIA** |
| Offre gratuite | **Découverte** |
| Offre payante publique | **Alliance** |
| Ancien plan interne | **Essentiel (legacy)**, non commercialisé |
| Assistant | **Coach EVA** ou **EVA** |
| Espace pédagogique | **Académie du mariage** |
| Suggestions | **Découvrir** / **Compatibilités** |
| Questionnaires | **5 piliers KELLIA** / **Questionnaires de discernement** |
| Protection conversationnelle | **Bouclier de bienveillance** |

Ne plus employer l’ancienne graphie de la marque sans le second « A », ni « Evoraa », « Eden.net », « Premium » ou « Premium+ » dans l’interface publique, sauf mention technique ou historique explicitement marquée.

## 5. Les cinq piliers

Les questionnaires actifs sont :

1. Personnalité et stress
2. Foi et vie spirituelle
3. Relation et communication
4. Vie de couple
5. Finances et projet de foyer

L’utilisateur peut mettre ses réponses à jour après un délai de 60 jours. La communication produit doit parler de **cinq piliers**, même si certaines pages marketing historiques mentionnent encore trois piliers.

## 6. Architecture de l’expérience

### Visiteur

- Accueil
- Fonctionnement
- Tarifs
- À propos
- Blog et articles
- Contact
- Ressources spirituelles
- Réseau communautaire
- Recommandation pastorale
- Charte, modération, confidentialité, CGU et mentions légales
- Connexion, inscription et récupération de mot de passe

### Membre

- **Accueil** : progression, rappels, sélection de profils, contenus et annonces sponsorisées.
- **Découvrir** : suggestions et détails de compatibilité.
- **Messages** : conversations, signalement et Bouclier de bienveillance.
- **Tests** : cinq questionnaires, résultats et axes de croissance.
- **Académie** : modules, leçons, exercices, ressources et vidéos.
- **Alliance** : abonnement, quotas, renouvellement et paiement.
- **Alertes** : notifications.
- **Profil** : identité, foi, photos, préférences et recommandation d’église/pasteur.
- **Paramètres** : préférences, confidentialité et compte.
- **Aide** : support et explications.

### Administration

Navigation officielle :

- Dashboard
- Analytique
- Membres
- Profils
- Modération
- Alliance et paiements
- Matching et conversations
- Académie
- Coach EVA
- Contenu et marketing
- Paramètres

Le back-office permet notamment : création de membres, validation des profils, modération des photos, recommandations pastorales, signalements, avertissements/suspensions/blocages, analytics, édition des textes, publicités, règles automatiques, contenu Académie, configuration EVA/YouTube et audit des paiements.

## 7. Paiements

- Provider prioritaire : **Bictorys**.
- Provider complémentaire : **CinetPay**.
- Moyens : Mobile Money et carte.
- Préselection Bictorys : Mobile Money pour l’UEMOA, carte pour la diaspora, avec choix manuel.
- Renouvellement Alliance : manuel, période de 30 jours.
- L’admin dispose d’un journal d’audit et d’outils sandbox Bictorys.
- Stripe reste une intégration future, non active dans le parcours public.

## 8. Direction visuelle

KELLIA doit évoquer un espace sacré moderne : chaleureux, éditorial, premium et humain.

### Palette active

- Pierre chaude / fond : `#F3EFE8`
- Texte profond : `#1C1412`
- Bordeaux : `#5C1F28`
- Ivoire : `#F8F4EE`
- Sable secondaire : `#E8E0D4`
- Or patiné : `#B8954A`
- Bordure : `#D9D0C4`
- Erreur : `#9F1239`

### Typographies actives

- Titres : **Cormorant Garamond**
- Interface et texte : **DM Sans**

### Formes et composants

- Rayons sobres : 4 à 8 px en règle générale.
- Ombres chaudes et diffuses.
- Cartes éditoriales, badges, champs, modales, barres de progression et skeletons cohérents.
- Lucide React pour les icônes.
- Navigation publique cinématographique ; espace membre fonctionnel et compact.
- Bottom navigation mobile centrée sur Accueil, Découvrir, Messages et Tests.

### Motion

- Transitions discrètes et utiles.
- GSAP/Lenis réservés aux expériences marketing et aux micro-interactions pertinentes.
- Respect de `prefers-reduced-motion`.
- Les animations ne doivent jamais gêner l’usage sur mobile ou connexion lente.

## 9. Photographie

- Représentation authentique de l’Afrique francophone et de la diaspora.
- Lumière naturelle, scènes dignes et crédibles.
- Tenues sobres, absence de poses suggestives et de clichés Tinder.
- Les sujets n’ont pas besoin de regarder l’objectif.
- Éviter les banques d’images trop génériques et les couples artificiellement souriants.
- Optimiser les images et conserver une zone calme pour le texte.

## 10. Ce qu’il faut éviter

- Gradients violet/rose génériques et glow omniprésent.
- Sparkles décoratifs sur tous les CTA.
- Interface interchangeable avec une application de rencontre laïque.
- Multiplication des CTA et pop-ups agressifs.
- Promesses spirituelles absolues ou culpabilisantes.
- Gamification addictive, urgence artificielle ou swipe infini.
- IA qui choisit à la place de l’utilisateur ou génère ses messages personnels.

## 11. Accessibilité et performance

- WCAG AA minimum.
- Navigation clavier et focus visibles.
- Libellés et messages d’erreur explicites.
- Mobile-first, zones tactiles confortables.
- Chargement progressif, images optimisées et états vide/chargement/erreur/succès.
- Fonctionnement acceptable sur 3G.

## 12. Gouvernance

Avant de créer ou renommer un écran :

1. Vérifier ce document.
2. Vérifier les routes et composants réellement présents dans `src/app` et `src/components`.
3. Vérifier `src/lib/billing/plans.ts` pour les offres.
4. Vérifier `src/lib/assessments/questionBank.ts` pour les piliers.
5. Vérifier `src/app/globals.css` et `src/app/layout.tsx` pour les tokens et polices.

En cas de contradiction, le code actif fait foi à court terme, puis ce document doit être corrigé dans le même changement.
