# KELIAA — Back-office

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026

## Rôles

### Administrateur

Accès complet : membres, rôles, contenus, paramètres, paiements, intégrations et modération.

### Modérateur

Accès aux données et actions nécessaires à la modération, sans gestion des paramètres réservés à l’administrateur complet.

Toutes les autorisations sont revérifiées côté serveur.

## Navigation

1. Dashboard
2. Analytique
3. Membres
4. Profils
5. Modération
6. Alliance et paiements
7. Matching et conversations
8. Académie
9. Coach EVA
10. Contenu et marketing
11. Paramètres

## Dashboard

- Membres.
- Abonnements actifs.
- Signalements ouverts.
- Photos en attente.
- Revenus confirmés.
- Activité récente.
- Profils en attente et renouvellements proches.

## Analytique

- Inscriptions.
- Villes et pays.
- Âges et dénominations.
- Ratio femmes/hommes.
- Matching et conversations.
- Conversion vers Alliance.
- Rétention.
- Score de confiance moyen.
- Membres sanctionnés et recommandations en attente.

## Membres

- Recherche et filtres.
- Statistiques géographiques.
- Fiche détaillée.
- Création de compte membre.
- Vérification.
- Attribution du rôle.
- Attribution ou extension Alliance.

## Profils

- File de profils en attente.
- Acceptation/refus.
- Prévisualisation et exécution de l’auto-modération.
- Recommandations pastorales.
- Score de confiance et sanctions.

## Modération

- Photos en attente.
- Règles de validation photo.
- Signalements.
- Avertissement, suspension et blocage.
- Historique des événements.
- Scan des conversations selon les termes interdits.

L’analyse automatisée est explicable et fondée sur des règles configurables. Elle ne remplace pas la décision humaine.

## Alliance et paiements

- Abonnements.
- Paiements.
- Revenus.
- Échéances.
- Provider actif et mode démo.
- Bictorys/CinetPay configurés.
- Journal `payment_events`.
- Probe de clé Bictorys.
- Charge sandbox Bictorys.

## Matching et conversations

- Matchs récents.
- Scores.
- Conversations récentes.
- Indicateurs de santé.
- Audit ciblé des contenus signalés.

## Académie

- Titres et résumés des modules.
- Leçons, sous-titres, exercices, durée et points clés.
- URLs vidéo.
- Configuration YouTube.

## Coach EVA

- Prompt système.
- Ton.
- Sujets interdits.
- Base de connaissances.
- Analyse des conversations désactivable.
- Rapport quotidien configurable.

## Contenu et marketing

- Textes du dashboard.
- Titres et sous-titres.
- Bannières.
- Publicités : dashboard, découverte, messages ou global.
- Activation, lien, image et CTA.

## Paramètres et connecteurs

- Règles d’auto-modération.
- Règles photo.
- Règles de sanctions.
- Maintenance et charte.
- Stripe futur, Bictorys, CinetPay, Resend, OpenAI et YouTube.

## Audit

Les événements sensibles doivent conserver :

- auteur ;
- type d’action ;
- cible ;
- motif ;
- résultat ;
- horodatage.

Les paiements possèdent un journal dédié. Les actions de modération utilisent `moderation_events`.

## Sécurité

- Authentification obligatoire.
- `profiles.role` vérifié côté serveur.
- RLS Supabase.
- Service role uniquement pour les opérations serveur autorisées.
- Aucun secret affiché dans le navigateur.
- Les modérateurs ne peuvent pas modifier les réglages réservés aux administrateurs complets.
