# KELLIA — Plan dashboards + stratégie pricing

> **Statut :** validé Free + Alliance — Phase 0–2 en cours d'exécution  
> **Dernière mise à jour :** 25 juillet 2026  
> **Décision pricing :** Free (Découverte) + Alliance (5 000 FCFA, `premium_plus`). Pas de 2 500 public.

Quand ce plan est validé, dire dans le chat : **« Proceed — exécute le plan »** (Phase 0 → 1 en priorité).

---

## 0. Comment utiliser ce document

1. Lire la **stratégie pricing** (§1) et trancher les décisions ouvertes (§6).
2. Valider l’architecture **dashboard membre + admin** (§2–3).
3. Lancer l’implémentation par phases (§5) en disant **Proceed**.

Fichiers liés :
- Quotas actuels : `src/lib/billing/plans.ts`
- Dashboard actuel : `src/app/dashboard/page.tsx`
- Admin actuel : `src/app/admin/page.tsx` + `src/components/admin/AdminConsole.tsx`

---

## 1. Analyse pricing & meilleures pratiques

### 1.1 Intention business (votre brief)

| Intention | Traduction produit |
|-----------|-------------------|
| Le vrai niveau cible = **5 000 FCFA** | Premium+ = offre **héro** (celle qu’on met en avant) |
| 2 500 = **temporaire** | Offre de **lancement** (quota 100–200 + communication claire), puis suppression |
| Plus tard **10 000** | Tier « Alliance / Coaching » au-dessus de 5 000 |
| Free pour goûter (H + F, 1er mois) | Découverte réelle, **pas** un plan confortable pour rester |
| Payants non frustrés | Ils ont clairement plus que Free — mais pas « tout illimité » sauf le tier cible |
| Renouvellement | Goût → valeur ressentie → envie de rester |

### 1.2 Diagnostic des quotas actuels (`plans.ts`)

| | Découverte (0) | Premium (2 500) | Premium+ (5 000) |
|--|----------------|-----------------|------------------|
| Suggestions / jour | 3 | 10 | 20 |
| Conversations / mois | 5 | 15 | ∞ |
| Messages / conversation | 5 | 70 | ∞ |

**Ce qui marche déjà (bonne pratique) :**
- Free est **goûtable mais serré** (5 convos × 5 messages = exploration, pas une vie relationnelle complète).
- L’écart Free → payant est visible.

**Ce qui pose problème pour votre stratégie :**
1. **Premium 2 500 est trop proche de Premium+** en perception (« 15 convos + 70 msg » vs « illimité ») — beaucoup resteront à 2 500 et n’iront jamais à 5 000.
2. Premium+ « illimité » trop tôt peut **cannibaliser** le futur 10 000 (plus rien à vendre au-dessus).
3. Aucune **date de fin / quota de lancement** sur le 2 500 dans le code.
4. Pas de **premier mois offert** formalisé (trial / coupon / grant).
5. Doc vs code : « 70 msg / mois » vs **70 / conversation** — à aligner (recommandation : **garder / conversation**, c’est plus clair et plus monétisable).

### 1.2bis Concurrent niche — Farata Pointe (rencontres musulmanes)

Source : page tarifs Farata (copiée par le fondateur KELLIA). Positionnement proche : **app de rencontre confessionnelle**, Free pour commencer / Premium pour accélérer.

#### Ce qu’ils vendent (lecture produit)

| | Gratuit (0 · pour toujours) | Premium lancement **5 900** (barré 9 900) / mois |
|--|----------------------------|--------------------------------------------------|
| Profil | Complet + 3 photos | Jusqu’à 10 photos HD |
| Demandes de contact | **5 / jour** | **Illimitées** |
| Coach IA | **3 questions / jour** | **Illimité** |
| Messagerie | Répondre aux messages reçus | 100 % illimitée + vocaux |
| Preuve sociale | ❌ | Qui m’a mis en favori · qui a visité · qui est en ligne |
| Différenciateurs | Ice breaker basique · Académie · support email | Flash message · score IA détaillé · filtres avancés · boosts · badge vérifié · support prio |

**Slogan :** « Gratuit pour commencer. Premium pour accélérer. »

#### L’idée derrière (stratégie)

1. **Free forever, pas un trial mensuel.** Ils laissent les gens s’installer — mais le Free est un **couloir étroit** : assez pour exister, pas pour gagner.
2. **Deux leviers de frustration utiles (quotidiens) :**
   - *Demandes de contact / jour* (volume d’initiatives)
   - *Questions coach IA / jour* (habitude + dépendance douce à l’assistant)
3. **Paywall sur la curiosité sociale** (très puissant en dating) : favoris, visites, « qui est en ligne ». Ce n’est pas du matching — c’est de l’**ego + FOMO**. Ça convertit fort.
4. **Un seul plan payant** sur la page (pas 3 colonnes). Ancrage : 9 900 barré → 5 900 lancement. Simple à comprendre, simple à choisir.
5. **Illimité côté Premium** sur les frictions Free (contacts + coach + messages) = sensation « j’ai enfin les clés ».
6. **Niche assumée** : filtres madhhab / hijra, coach nommé (« Cheikh Moussa »), Académie du mariage — la foi n’est pas un badge, c’est le produit.

#### Ce qu’ils font bien (à retenir pour KELLIA)

| Pratique Farata | Application KELLIA |
|-----------------|-------------------|
| Free utile mais plafonné **par jour** | Preférer des plafonds **journaliers** (suggestions, initiatives, EVA) en plus des plafonds mensuels |
| Coach IA nommé + quota Free | EVA locale plafonnée (ex. 3/jour Free) plutôt que seulement 20/mois |
| Paywall « qui m’a vu / favorisé » | Feature roadmap forte pour conversion (même sans LLM) |
| **Un** Premium mis en avant + prix barré | Simplifier la page Tarifs : Alliance 5 000 (ou 5 900) en héros ; 2 500 = encart « lancement limité » |
| « Répondre aux messages » en Free | Important : Free peut **répondre** (dignité) mais **initier** est limité |
| Académie / contenus | Blog + ressources déjà là → packager comme « valeur Free » |

#### Ce qu’il ne faut pas copier tel quel

| Farata | Risque pour KELLIA |
|--------|-------------------|
| Prix 5 900 / ancrage 9 900 | OK comme **référence** ; notre cible historique est 5 000 — on peut monter à **5 900** au lancement si le marché le porte |
| Illimité total dès le 1er payant | OK s’il n’y a **qu’un** tier payant ; moins OK si on veut garder un 10 000 au-dessus |
| Vocaux / Flash / Boosts | Bien, mais **P1/P2** — soft launch n’a pas besoin de tout |
| « Pour toujours » Free très généreux en contenus | OK ; attention à ne pas ouvrir trop de contacts Free |

#### Impact sur notre plan (révision)

Après Farata, la recommandation évolue :

1. **Page Tarifs plus simple :** Free + **un** plan payant héros (Alliance ~5 000–5 900), et le 2 500 en **bandeau / encart** « Offre de lancement · N places », pas comme 3e colonne égale.
2. **Free = « répondre oui, initier non (beaucoup) »** : garder la dignité (répondre aux messages reçus) ; limiter les **nouvelles** conversations / demandes.
3. **Ajouter des paywalls « curiosité »** au backlog dashboard : visiteurs du profil, favoris reçus, (plus tard) « en ligne ».
4. **EVA : quota journalier** (ex. 3/j Free) aligné Farata, plus clair psychologiquement qu’un stock mensuel opaque.
5. **Prix barré** sur Alliance : ex. ~~7 500~~ ou ~~9 900~~ → **5 000 / 5 900** lancement (comme Farata).
6. Le **10 000** reste l’étage coaching / illimité + priorité humaine — pas besoin d’illimité absolu dès 5 000 si on adopte le modèle « un Premium fort ».

**Grille révisée (post-Farata) — proposition :**

| Plan | Prix | Quotas / accès clés |
|------|------|---------------------|
| **Découverte** | 0 · pour toujours | Profil + 3 photos · **3** suggestions/j · **3** nouvelles conversations/j (ou 5/j façon Farata) · répondre illimité aux messages reçus · EVA **3 Q/j** · Ice breakers basiques · Journal / ressources · **pas** de visiteurs/favoris |
| **Essentiel Lancement** | **2 500** · 100–200 places | Encadré « lancement » · uplift modéré (pas le confort total) |
| **Alliance** *(héros)* | **5 000** (ou **5 900** style Farata) · ~~ancrage~~ | Initiatives larges ou illimitées · EVA haute · visiteurs + favoris · 10 photos · badge · priorité soft · score compatibilité détaillé |
| **Souverain** *(bientôt)* | **10 000** | Illimité + boosts + coaching humain |

## 1.2ter Avis stratégique — 1 Premium (Farata) vs 2 500 + 5 000

> Clarification : Farata sert d’**inspiration** (friction Free, FOMO, page simple), **pas** d’un modèle à recopier. KELLIA se différencie par le matching à **3 piliers** (personnalité · foi/valeurs · relationnel) — beaucoup plus poussé qu’un simple listing + coach IA.

### La vraie question

Ce n’est pas « Farata a raison / on a tort ». C’est :

> **Est-ce qu’un étage à 2 500 aide le lancement, ou est-ce qu’il vole la conversion vers 5 000 ?**

Vous l’avez déjà observé : **les gens tendent à rester à 2 500**. C’est classique. Le plan du milieu devient le « assez bien », et le plan cible (5 000) reste un « peut-être plus tard » qui n’arrive jamais.

### Comparaison honnête

| | **1 seul Premium** (style Farata) | **2 500 + 5 000** (votre grille actuelle) |
|--|-----------------------------------|-------------------------------------------|
| Clarté | Excellente : Free vs Payant | Moyenne : 3 choix = hésitation |
| Conversion | Forte vers *le* payant | Fuite vers le bas (2 500) |
| Revenu / user | Plus élevé si le prix unique est ~5–6k | Plus bas si la majorité reste à 2 500 |
| Lancement | Prix barré suffit comme « offre » | 2 500 = offre, mais devient un foyer |
| Place pour 10 000 | Oui, plus tard au-dessus | Oui, mais 2 500 encombre déjà |
| Risque | Prix unique trop haut → moins d’essais | Prix bas trop confortable → stagnation |

### Mon avis (recommandation nette)

**Préférez un modèle proche de Farata pour le *payant* : un seul Premium fort ≈ 5 000–5 900**, avec Free inspiré Farata (répondre oui, initier limité, EVA/j limitée).

**Le 2 500 : ne le gardez pas comme plan permanent.**  
Deux options propres :

1. **Recommandée — Soft launch :** pas de colonne 2 500. Uniquement Free + Alliance (5 000 ou 5 900, prix barré). Offre de lancement = **réduction temporaire** (ex. 5 900 → 4 900 les 200 premiers), pas un 2ᵉ produit.
2. **Si vous tenez au 2 500 :** uniquement **100–200 places**, quotas **volontairement plus bas** que aujourd’hui, disparition annoncée. Sinon il mangera le 5 000.

Pourquoi ça colle à KELLIA mieux qu’à un copier-coller Farata :
- Votre valeur n’est pas « plus de likes » : c’est **tests + matching 3 piliers**. Le Premium doit débloquer *l’usage sérieux* de ce matching (plus de suggestions, conversations, détail de compatibilité, priorisation) — pas seulement des gadgets FOMO.
- Les features Farata (visiteurs, favoris) sont d’excellents **accélérateurs de conversion**, à ajouter en P1, sans remplacer votre cœur produit.

### Synthèse en une phrase

**Inspirez-vous de Farata pour la simplicité Free→Premium et les frictions utiles ; ne construisez pas un confort permanent à 2 500 si votre vrai niveau est 5 000.**

Dossier local d’inspiration UI (non copier-coller) : `INSPIRATION FARATA/` (images + process inscription).

### 1.3 Principes (best practices dating / freemium sérieux)

1. **Free = preuve de sérieux, pas un abri.** Assez pour créer un profil, faire 1–2 tests, ouvrir 2–3 échanges — pas assez pour « vivre » sur l’app.
2. **Le tier du milieu (2 500) ne doit pas être le confortable.** Sinon personne ne monte à 5 000.
3. **Le tier cible (5 000) doit être le « vrai usage »** : assez de matches + messages pour un discernement réel sans anxiété quotidienne.
4. **Frustration utile, pas humiliation.** Message clair : « Vous avez utilisé votre quota Free — continuez en Premium+ » + rappel de ce qu’ils ont déjà accompli.
5. **Ancrage prix :** montrer 10 000 (bientôt) / 5 000 (recommandé) / 2 500 (lancement limité) pour que 5 000 paraisse raisonnable.
6. **Grandfathering :** ceux qui ont pris 2 500 au lancement gardent le prix jusqu’à non-renouvellement, ou migration douce avec avantage.

### 1.4 Architecture pricing recommandée (lancement → 12 mois)

#### Phase Lancement (maintenant → ~3 mois ou 200 places)

| Plan | Prix | Rôle | Quotas recommandés |
|------|------|------|--------------------|
| **Découverte** | 0 FCFA | Goût 30 jours (H+F) | 3 sugg/j · **3** convos/mois · **5** msg/convo · EVA locale 20 Q/mois · pas de badge |
| **Essentiel Lancement** | **2 500** | Offre limitée **100–200 premiers** | 8 sugg/j · **8** convos/mois · **40** msg/convo · badge |
| **Alliance (cible)** | **5 000** | **Offre recommandée** (badge Popular) | 15 sugg/j · **25** convos/mois · **100** msg/convo · priorité soft · EVA étendue |
| **Souverain** (annonce « bientôt ») | **10 000** | Ancrage + futur coaching | Illimité convos/msg · prioritaire fort · coaching 1× / mois (plus tard) |

**Pourquoi baisser un peu le 2 500 vs aujourd’hui (10→8 sugg, 15→8 convos, 70→40 msg) :**  
Aujourd’hui le 2 500 est trop généreux → les gens s’y installent. Pour un **lancement temporaire**, il doit rester **agréable** mais clairement **en dessous** du 5 000.

**Pourquoi ne pas mettre le 5 000 en « illimité » tout de suite :**  
Gardez de la marge pour le 10 000. « 25 convos + 100 msg/convo » suffit largement pour un mois de discernement sérieux **sans** donner l’impression d’avoir tout.

#### Phase Post-lancement (après quota 100–200 OU date butoir)

1. **Fermer les nouvelles souscriptions** au 2 500 (communication 14j avant).
2. Les abonnés 2 500 actifs : **grandfather** au renouvellement au même prix **une fois**, puis migration vers 5 000 avec −20 % le 1er mois (option soft).
3. Mettre **5 000** comme seul plan payant standard.
4. Ouvrir **10 000** quand le coaching / priorité humaine est prête.

#### Premier mois gratuit (H + F)

Deux options propres :

| Option | Mécanique | Avantage |
|--------|-----------|----------|
| **A. Trial Découverte enrichie 30j** | À l’inscription : quotas Free **légèrement** boostés 30j (ex. 5 convos / 8 msg), puis retour Free strict | Simple, pas de paiement |
| **B. Essai Alliance 7–14j** | Accès quotas type 5 000 pendant X jours, puis paywall | Meilleure conversion vers 5 000 |

**Recommandation :** **A pour le très soft launch** (moins de risque support), puis **B** dès que le produit matching/messages est fluide.  
Clarifier : « 1er mois pour découvrir » ≠ « Premium gratuit 30j » sauf si vous choisissez B.

#### 100–200 premiers à 2 500

Mécanique proposée :
- Compteur `launch_premium_slots_remaining` (admin / env).
- Checkout 2 500 possible **uniquement** si slots > 0.
- Page Tarifs : « Offre de lancement — plus que N places ».
- Après 0 : bouton 2 500 grisé + message « Offre terminée — découvrez Alliance 5 000 ».

### 1.5 Matrice « assez mais pas trop » (ressenti utilisateur)

| Situation | Free | 2 500 lancement | 5 000 cible |
|-----------|------|-----------------|-------------|
| Créer profil + 1 test | ✅ | ✅ | ✅ |
| Voir des suggestions chaque jour | ✅ limité | ✅ confort | ✅ large |
| Tenir 2–3 dialogues sérieux | ⚠️ vite bloqué | ✅ | ✅ |
| Discerner plusieurs pistes en parallèle | ❌ | ⚠️ | ✅ |
| Sentiment « j’ai payé pour rien » | — | Non (vrai uplift) | Non (vrai confort) |
| Sentiment « je n’ai plus besoin de monter » | — | **À éviter** (d’où quotas plus bas) | OK (c’est le but) |

### 1.6 Communication (éthique + conversion)

- Toujours afficher : **« Offre de lancement, places limitées »** à côté du 2 500.
- Ne jamais laisser croire que 2 500 est le plan définitif.
- J-7 avant fin d’abo : rappel + comparaison claire Free vs 5 000 (pas seulement « renouvelez »).
- Quand on retire le 2 500 : email + bannière dashboard 14 jours avant.

---

## 2. Dashboard membre — architecture (rappel validable)

### Shell
Sidebar : Accueil · Compatibilités · Messages · Questionnaires · Abonnement · Profil · Aide.

### Accueil
- Salut + plan + jours restants + CTA renew (si ≤ 7j)
- Cartes : messages non lus · matches · **quotas du mois**
- Next step bloquant (profil / test / photo / paywall)
- Activité récente + conseil du jour (EVA locale)
- Lien « poser une question » (20 Q/mois Free)

### EVA / IA
- **V1 soft launch : sans LLM** (coût API = 0)
- Free : 20 questions/mois (FAQ + parcours)
- 5 000 : quota plus haut
- LLM éventuel = V2, derrière 5 000 / 10 000, plafonné

### Abonnement J-7
- Cron : notification + email + bannière dashboard
- Renouvellement manuel (déjà la philosophie CinetPay)

---

## 3. Dashboard admin — architecture (rappel)

Modules : Vue d’ensemble · Utilisateurs · Conversations (ops) · Modération · Finance · Rétention · Slots lancement 2 500 · Paramètres.

KPIs rétention : inscriptions, % profils complets, % tests, conversion Free→5k, renouvellements vs expirations, churn 30j.

---

## 4. Techniques à implémenter avec le pricing

1. `usage_counters` (jour / mois) — suggestions, convos, questions EVA  
2. Flag / table `launch_offers` (slots 2 500)  
3. `trial_ends_at` ou grant premier mois  
4. Cron expire + notify J-7  
5. UI Tarifs : Popular = **5 000** ; 2 500 = badge « Lancement »  
6. Admin : compteur places restantes + kill switch 2 500  

---

## 5. Phases d’exécution (Proceed)

### Phase 0 — Fondations
- [x] Layout membre + nav  
- [x] Entitlements + usage snapshot  
- [x] Quotas visibles sur `/dashboard`  
- [x] Page `/billing` (état + renew)

### Phase 1 — Dashboard membre
- [x] Accueil complet  
- [x] Next-step Free  
- [x] EVA locale + lien Aide  
- [x] Design élégant KELLIA (inspiré Farata, non copié)

### Phase 2 — Pricing Free + Alliance
- [x] Grille publique Free + Alliance uniquement  
- [x] Popular = Alliance 5 000 (ancrage 7 500)  
- [x] `premium` 2 500 non public (legacy code)  
- [ ] Slots 100–200 (non requis si pas de 2 500 public)  
- [ ] Premier mois boosté (option A — à faire ensuite)

### Phase 3 — J-7 + emails
- [ ] Cron + notifications + Resend  

### Phase 4 — Admin solide
- [x] Enrichir AdminConsole (KPI, rétention, abonnements, user detail)  
- [x] Finance + rétention (Alliance / legacy / conversion)  
- [ ] Slots lancement (non prioritaire sans 2 500 public)  

### Phase 5 — Soft launch tests
- [ ] Comptes Free / 2 500 / 5 000  
- [ ] Scénarios quota / renew / report  

---

## 6. Décisions à valider (cochez / répondez)

| # | Question | Proposition | Votre choix |
|---|----------|-------------|-------------|
| 1 | EVA V1 sans LLM ? | Oui | |
| 2 | 70 msg = / conversation ? | Oui | |
| 3 | Quotas 2 500 un peu moins généreux ? | Oui (8 / 8 / 40) | |
| 4 | 5 000 **sans** illimité total au lancement ? | Oui (25 / 100) — illimité réservé au futur 10k | |
| 5 | Places lancement 2 500 | **200** | 100 / 200 / autre |
| 6 | Premier mois | **Option A** (Free boosté 30j) | A / B |
| 7 | Grandfather 2 500 à la fermeture | 1 renouvellement au même prix puis migration | |
| 8 | Ordre d’exécution | Phase 0+1 puis 2 (pricing) puis admin | |
| 9 | S’inspirer Farata : Free forever + répondre illimité + initier limité ? | **Oui** | |
| 10 | Prix Alliance | **5 000** ou **5 900** (style Farata) | |
| 11 | Paywall visiteurs / favoris (soft launch ou P1) | **P1** juste après dashboards | |
| 12 | EVA Free | **3 questions / jour** (Farata) | |

---

## 7. Verdict pricing (synthèse)

Votre intuition est **juste** : le but n’est pas de garder les gens en gratuit, ni de les installer durablement à 2 500.  
Le 2 500 doit être un **goût payant de lancement**, le **5 000** le domicile, le **10 000** l’étage supérieur plus tard.

Aujourd’hui le 2 500 est un peu **trop confortable** par rapport au 5 000 « illimité » — ça freine la montée.  
Recaler les quotas + communication « places limitées » + Free qui fait goûter sans installer = meilleure pratique pour votre objectif.

---

## Proceed

Quand vous êtes prêt(e) :

```text
Proceed — exécute le plan (Phases 0 et 1 d'abord)
```

Ou, si le pricing doit être figé en même temps :

```text
Proceed — Phases 0, 1 et 2 (dashboards + nouveaux quotas + slots 2500)
```
