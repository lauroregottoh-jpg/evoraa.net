# KELLIA — Implementation Roadmap

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026

## Légende

- **Implémenté** : présent dans l’application.
- **À valider** : présent, mais nécessite configuration ou recette réelle.
- **À renforcer** : base présente, qualité ou couverture à compléter.
- **Futur** : non prioritaire actuellement.

## 1. Fondations — Implémenté

- Next.js 16, React 19 et TypeScript.
- Tailwind CSS 4.
- Supabase Auth/Postgres/RLS.
- Déploiement Vercel.
- Variables d’environnement.
- Design system KELLIA.

## 2. Authentification — Implémenté

- Inscription et connexion.
- Déconnexion.
- Mot de passe oublié/réinitialisé.
- Sessions Supabase.
- Protection des espaces membre et admin.

## 3. Profil et onboarding — Implémenté / À renforcer

- Identité et informations chrétiennes.
- Pays, ville, église et pasteur.
- Préférences.
- Photos.
- Progression.
- Recommandation pastorale.
- À renforcer : recette complète des reprises d’onboarding et des erreurs réseau.

## 4. Cinq piliers — Implémenté

- Personnalité et stress.
- Foi et vie spirituelle.
- Relation et communication.
- Vie de couple.
- Finances et projet de foyer.
- Résultats et axes de croissance.
- Délai de reprise de 60 jours.

## 5. Matching — Implémenté / À renforcer

- Suggestions quotidiennes.
- Score et détail.
- Filtres et historique.
- Compatibilités.
- À renforcer : tests de non-régression sur la pondération et les limites.

## 6. Messagerie et confiance — Implémenté / À renforcer

- Conversations et messages.
- Temps réel.
- Quotas.
- Signalements.
- Bouclier de bienveillance.
- Médiation EVA.
- À renforcer : scénarios E2E de sanctions, signalements et reprise réseau.

## 7. Coach EVA — Implémenté / À valider

- Conseils spirituels et relationnels.
- Quotas Découverte/Alliance.
- Configuration admin.
- Sujets interdits et base de connaissances.
- À valider : provider IA éventuel et garde-fous en production.

## 8. Académie du mariage — Implémenté

- Huit modules.
- Leçons, ressources, exercices et vidéos.
- Surcharges CMS.
- Configuration YouTube.

## 9. Offres et quotas — Implémenté

- Découverte.
- Alliance.
- Essentiel legacy non public.
- Quotas suggestions, conversations, messages et EVA.
- Renouvellement manuel.

## 10. Paiements — Implémenté / À valider

- Bictorys prioritaire.
- CinetPay complémentaire.
- Mobile Money et carte.
- Préselection par pays.
- Webhooks.
- Audit `payment_events`.
- Sandbox admin.
- À valider : migration `20240101000015_payment_events.sql`, clés réelles et test bout en bout sandbox puis production.

## 11. Notifications — Implémenté / À renforcer

- Centre de notifications.
- Rappels d’expiration.
- Cron.
- Resend optionnel.
- À renforcer : matrice complète des notifications et tests de délivrabilité.

## 12. Back-office — Implémenté / À renforcer

- Dashboard et analytics.
- Membres et profils.
- Modération et sanctions.
- Recommandations pastorales.
- Matching et conversations.
- Alliance et paiements.
- Académie, EVA et contenus.
- Publicités et paramètres.
- À renforcer : audit transversal immuable de toutes les actions admin.

## 13. CMS — Implémenté

- Textes applicatifs.
- Publicités.
- Règles automatiques.
- Académie.
- EVA, YouTube et intégrations.

## 14. Qualité avant lancement — Priorité actuelle

1. Appliquer et vérifier toutes les migrations Supabase.
2. Recette onboarding sur mobile réel.
3. Recette complète des cinq piliers.
4. Recette matching et quotas des deux offres.
5. Recette conversations en temps réel.
6. Test sandbox puis production Bictorys.
7. Test CinetPay de secours.
8. Test webhooks doublés et événements retardés.
9. Audit RLS, rôles admin/modérateur et secrets.
10. Tests E2E des parcours critiques.
11. Accessibilité WCAG AA.
12. Performance mobile 3G.
13. Vérification des textes légaux et consentements.

## 15. Après stabilisation

- Amélioration des analytics.
- Automatisation marketing prudente.
- Modération photo avancée.
- Aide EVA enrichie avec garde-fous.
- Stripe si besoin diaspora.
- Codes promotionnels.
- Offre annuelle après validation du marché.

## 16. Futur

- Application native.
- Audio/vidéo intégré.
- Multi-langue.
- Marketplace de coachs.
- Renouvellement automatique.

## Critères de lancement

KELLIA peut être considérée prête lorsque :

- un membre s’inscrit et termine son profil ;
- il complète les cinq piliers ;
- il reçoit des compatibilités expliquées ;
- il converse dans les limites de son offre ;
- il peut payer Alliance par Mobile Money ou carte ;
- le webhook active réellement les 30 jours ;
- l’admin peut modérer, gérer le contenu et auditer le paiement ;
- les parcours critiques sont testés sur mobile et desktop.
