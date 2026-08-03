# 04_Database_Schema.md
# Architecture de la Base de Données KELLIA

Ce document référence l'intégralité de la structure de données de l'application KELLIA, optimisée pour l'évolutivité, la sécurité (RLS) et la performance des algorithmes de matching.

## 1. Vue d'Ensemble
La base de données est construite sur PostgreSQL via Supabase. Elle utilise fortement les types `JSONB` et les `Array` pour garantir une évolutivité sans migrations lourdes pour les petits attributs, tout en gardant des colonnes strictes pour les index de recherche (âge, pays, statut matrimonial).

## 2. Structure des Tables Principales

### Types ENUM (Référentiels Stricts)
- `photo_status_enum`: 'pending', 'approved', 'rejected'
- `marital_status_enum`: 'single', 'divorced', 'widowed', 'annulled'
- `attendance_frequency_enum`: 'weekly', 'monthly', 'occasionally', 'rarely'
- `education_level_enum`: 'high_school', 'bachelors', 'masters', 'doctorate', 'other'

### Champs d'Audit et Soft Delete (Traçabilité)
Toutes les tables intègrent un système de traçabilité et de suppression logique :
- `created_at`, `updated_at` (Timestamptz)
- `created_by`, `updated_by` (UUID)
- `deleted_at` (Timestamptz) - Utilisé pour le Soft Delete. Les requêtes filtrent `WHERE deleted_at IS NULL`.

### `profiles` (Table Centrale)
Contient l'identité fondamentale et les caractéristiques de l'utilisateur.
- **Identité** : `id` (PK, ref: auth.users), `first_name`, `last_name`, `birth_date`, `gender`, `country`, `city`.
- **Vie Chrétienne** : `denomination`, `church_attended`, `attendance_frequency` (ENUM), `conversion_year`, `faith_importance`, `ministry_engagement`, `testimony`.
- **Profil Social** : `profession`, `education_level` (ENUM), `languages` (Array), `marital_status` (ENUM).
- **Personnalité** : `bio`, `interests`, `hobbies`, `passions`, `core_values`, `character_traits` (Arrays).
- **Sécurité & Confiance** : `is_verified`, `identity_verified`, `email_verified`, `phone_verified`, `verified_at` (Timestamptz).
- **Matching (Évolutivité JSONB)** : `psychometric_results` (JSONB), `matching_indicators` (JSONB).
- **Système** : `completion_percentage`, `privacy_settings` (JSONB), champs d'audit.

### `user_photos` (Médias & Modération)
Gère l'upload, l'ordre et la modération des photos.
- `id` (UUID PK), `user_id` (UUID, FK -> profiles)
- `photo_url` (Text)
- `is_primary` (Boolean) - Indique l'avatar principal.
- `display_order` (Integer) - Pour réorganiser le carrousel.
- **Modération** : `status` (`photo_status_enum`), `rejection_reason` (Text).
- Champs d'audit (`created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`).

### `user_preferences` (Critères de Matching)
Isolée pour des requêtes de recherche ultra-rapides.
- `user_id` (UUID, PK, FK -> profiles)
- `age_min`, `age_max` (Integer)
- `max_distance` (Integer)
- `accepted_countries` (Text Array)
- `important_criteria` (Text Array)
- `vision_of_marriage` (Text), `desire_children` (Text), `life_project` (Text)
- Champs d'audit.

### `user_gamification` (Engagement & Qualité)
Gère les récompenses et la confiance pour inciter à la complétion.
- `user_id` (UUID, PK, FK -> profiles)
- `trust_level` (Integer) - Calculé selon les vérifications.
- `badges` (Text Array) - Ex: "Profil Premium", "Témoignage Inspirant".
- `rewards` (JSONB)
- `profile_quality_score` (Integer)
- Champs d'audit.

## 3. Sécurité (Row Level Security - RLS)
- Les profils publics (champs basiques) sont lisibles par tous les utilisateurs authentifiés.
- Les champs sensibles (`privacy_settings`, `user_preferences`) ne sont lisibles que par le propriétaire.
- Les photos en statut `pending` ou `rejected` ne sont lisibles que par le propriétaire et les modérateurs (rôle spécifique ou admin).

## 4. Stratégie de Complétion (Application Layer)
Le pourcentage de complétion est géré en TypeScript pour une pondération modulable :
- Photo principale : 20%
- Informations essentielles (Date de naissance, Nom, Pays) : 20%
- Témoignage : 15%
- Préférences de recherche : 15%
- Photos supplémentaires : 5% par photo (max 15%)
- Autres champs : 15%
