# Programme Fidélité Alliance — Spécification officielle

> **Statut :** document de référence — **à valider avant toute implémentation / déploiement**.  
> **Version :** 1.0 (officielle) — remplace toutes les propositions antérieures de bonus fidélité.  
> **Date :** 2026-08-07  
> **Produit :** KELIAA · formule Alliance (`premium_plus`)

---

## 0. Objectif

Créer un programme de fidélité **simple, automatique et durable** pour :

- encourager les renouvellements Alliance ;
- améliorer la rétention ;
- récompenser sans dévaloriser l’offre (quota de base 100 messages / conversation reste le cœur du plan).

Ce document est la **référence unique**. Toute implémentation doit s’y conformer.

---

## 1. Principes non négociables

1. **Automatique** — déclenché uniquement après **confirmation effective** d’un paiement (Mobile Money / carte).
2. **Pas de double attribution** — un même renouvellement / cycle de facturation ne crédite qu’une fois.
3. **Messages bonus cumulables** — acquis définitivement sur le compte ; **jamais supprimés**.
4. **Consommation** — les bonus ne sont utilisés **qu’après** épuisement du quota standard Alliance.
5. **Downgrade Découverte** — les bonus restent en solde mais **inactifs** ; ils redeviennent utilisables dès réactivation Alliance.
6. **Interruption d’abonnement** — le **compteur de mois consécutifs** repart à zéro au prochain cycle Alliance ; le **solde bonus déjà gagné** est conservé.
7. **Journalisation** — chaque attribution / ajustement admin est auditable.
8. **Design** — charte KELIAA (or `#B8954A`, bordeaux `#5C1F28`, crème `#F8F4EE`), composants et animations existants.

---

## 2. Barème de récompenses (version officielle)

### 2.1 Chaque mois consécutif

| Mois consécutif | Messages bonus | Boost Profil 24 h | Session VIP |
|-----------------|----------------|-------------------|-------------|
| 1 | +15 | — | — |
| 2 | +15 | — | — |
| **3** | **+30** | **1×** | — |
| 4 | +15 | — | — |
| 5 | +15 | — | — |
| **6** | **+30** | **1×** | — |
| 7 | +15 | — | — |
| 8 | +15 | — | — |
| **9** | **+30** | **1×** | — |
| 10 | +15 | — | — |
| 11 | +15 | — | — |
| **12** | **+30** | **1×** | **Invitation Session VIP Alliance** |

**Règle palier 3 mois :** tous les 3 mois consécutifs (`mois % 3 === 0`), au lieu de +15 → **+30 messages + 1 Boost 24 h**.

**Après 12 mois consécutifs :** récompenses du 12ᵉ mois + invitation **Session VIP Alliance** (coaching collectif / atelier / masterclass / visio privée — format décidé par l’équipe, pas de coaching 1:1 obligatoire).

### 2.2 Formules multi-mois (achat anticipé)

Si le membre paie une offre pack :

| Durée achetée | Crédit immédiat cohérent |
|---------------|--------------------------|
| 1 mois | +15 (mois 1) |
| 3 mois | +45 messages (équivalent 15+15+30) + 1 Boost 24 h (palier 3) |
| 6 mois | +90 messages (équivalent des 6 mois) + 2 Boosts 24 h (paliers 3 et 6) |

> Détail d’implémentation : créditer **mois par mois** dans le journal (6 lignes) ou **une ligne pack** avec `months_credited = N` — préférer **une ligne pack** + mise à jour du compteur `consecutive_months += N` pour éviter les doubles.

---

## 3. Compteurs utilisateur

Afficher clairement (profil, Alliance, quota messages) :

| Compteur | Rôle |
|----------|------|
| **Messages standards** | Quota Alliance du plan (ex. 100 / conversation ou règle actuelle `entitlements`) |
| **Messages fidélité** | Solde bonus cumulé (ex. `+30`) — consommé **en dernier** |
| **Boosts profil** | Nombre de Boosts 24 h disponibles |
| **Mois consécutifs** | Entier ≥ 0 |
| **Éligibilité VIP 12 mois** | booléen + date d’atteinte |

### 3.1 Ordre de consommation des messages

1. Consommer le quota **standard** Alliance.  
2. Si épuisé **et** membre Alliance actif → consommer **messages fidélité**.  
3. Si Découverte → bonus **non utilisables** (solde conservé).

---

## 4. Attribution automatique (après paiement confirmé)

Pipeline :

1. Webhook / confirmation paiement (Moneroo, Bictorys, etc.).
2. Vérifier `payment_id` / `invoice_id` **jamais déjà crédité** (`loyalty_grants.payment_ref` UNIQUE).
3. Déterminer si le renouvellement est **consécutif** (écart raisonnable depuis `ends_at` précédent, ex. ≤ 3–7 jours de grâce).
4. Si non consécutif → `consecutive_months = 1` (nouveau cycle) ; **ne pas** effacer `bonus_messages_balance`.
5. Si consécutif → `consecutive_months += months_purchased`.
6. Calculer bonus + boosts selon le barème.
7. Créditer solde ; journaliser ; optionnellement déclencher UI récompense (`?loyalty=1`).

### 4.1 Animations post-paiement

1. Badge Alliance.  
2. Pluie d’étoiles dorées (léger).  
3. Carte :

- Cas standard : « Merci pour votre fidélité ! +15 messages bonus »  
- Cas palier 3/6/9/12 : « Nouveau palier — +30 messages + Boost 24 h »  
- Cas 12 mois : mention Session VIP  

Bouton **Continuer**.

---

## 5. Affichages produit

### 5.1 Page Alliance (`/premium` ou espace Alliance)

Section **Programme Fidélité Alliance** :

> Votre fidélité est récompensée. Chaque renouvellement vous offre des avantages supplémentaires pour poursuivre vos échanges et préparer votre projet de mariage avec sérénité.

- Progression : `Mois X sur 12` + barre  
- Prochaine récompense (messages / boost)  
- Bouton **En savoir plus** → modal règles  

### 5.2 Page Tarifs (`/pricing`)

Carte sous les offres :

**Vos avantages fidélité**

- +15 messages après chaque renouvellement mensuel  
- Paliers tous les 3 mois : +30 + Boost 24 h  
- Jusqu’à invitation Session VIP à 12 mois  
- Attribution automatique, sans code promo  
- Bonus conservés même en Découverte (inactifs jusqu’à retour Alliance)

### 5.3 Profil / quotas messages

Deux compteurs visibles : standards + fidélité.

---

## 6. Downgrade / réactivation

| Événement | Compteur mois | Solde bonus | Boosts non utilisés |
|-----------|---------------|-------------|---------------------|
| Expire → Découverte | figé (réinit au prochain cycle) | **conservé, inactif** | **conservés, inactifs** |
| Réactive Alliance | si interruption → repart à 1 | **réactivé immédiatement** | **réactivés** |

**Aucun bonus gagné n’est jamais supprimé** (sauf ajustement admin exceptionnel journalisé).

---

## 7. Administration (console ops)

Prévoir :

- mois consécutifs ;  
- historique des grants ;  
- solde messages bonus ;  
- boosts disponibles ;  
- éligibilité Session VIP 12 mois ;  
- ajustement manuel (+/−) avec motif ;  
- réinitialisation du **streak** uniquement (pas du solde) en cas d’interruption détectée.

---

## 8. Modèle de données (proposition)

```text
loyalty_accounts
  user_id PK
  consecutive_months int default 0
  bonus_messages_balance int default 0
  profile_boosts_available int default 0
  vip_session_eligible bool default false
  vip_session_reached_at timestamptz null
  updated_at

loyalty_grants
  id
  user_id
  payment_ref text UNIQUE NOT NULL
  months_credited int
  bonus_messages int
  boosts int
  kind: 'renewal' | 'pack' | 'admin_adjust' | 'milestone_3' | 'milestone_12'
  meta jsonb
  created_at
```

Intégration facturation : brancher après handlers de succès paiement existants (ne pas créditer sur `pending`).

---

## 9. Texte « Pourquoi récompensons-nous votre fidélité ? »

> Construire une relation sérieuse demande du temps.  
> Nous souhaitons remercier les membres qui s’engagent durablement dans cette démarche en leur offrant davantage de liberté pour poursuivre leurs échanges.

---

## 10. Hors scope de ce document (ne pas confondre)

- Quotas Découverte / Alliance de base (déjà dans `plans` / `entitlements`).  
- Communauté likes mutuels.  
- Contenu marketing hors Alliance / Tarifs / post-paiement.

---

## 11. Checklist avant déploiement

- [ ] Validation produit / business de ce document  
- [ ] Migration SQL + RLS  
- [ ] Branchement webhooks paiement (idempotence `payment_ref`)  
- [ ] UI Alliance + Tarifs + animation succès  
- [ ] Consommation messages : standard puis bonus  
- [ ] Écran admin  
- [ ] Tests : 1er mois, palier 3, interruption, réactivation, double webhook  
- [ ] Déploiement prod **uniquement après** validation explicite

---

## 12. Décision

**Ce fichier = version officielle.**  
Implémentation et déploiement **uniquement après accord** sur ce document.
