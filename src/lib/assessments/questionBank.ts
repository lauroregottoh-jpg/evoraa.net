export type AssessmentSlug =
  | "personality"
  | "spiritual"
  | "relationship"
  | "couple_life"
  | "finances"

export type QuestionOption = {
  id: string
  label: string
  value: number
}

export type BankQuestion = {
  key: string
  dimension: string
  text: string
  type: "scenario" | "likert"
  options?: QuestionOption[]
  reverse?: boolean
}

export const ASSESSMENT_ORDER: AssessmentSlug[] = [
  "personality",
  "spiritual",
  "relationship",
  "couple_life",
  "finances",
]

const conflictOpts: QuestionOption[] = [
  { id: "withdraw", label: "Je me ferme et j'évite d'en parler pendant un moment", value: 2 },
  { id: "express", label: "J'exprime calmement ce que je ressens", value: 5 },
  { id: "loud", label: "Je hausse le ton pour être entendu(e)", value: 2 },
  { id: "pause", label: "Je demande une pause et je reviens plus tard", value: 4 },
  { id: "listen", label: "J'écoute d'abord pour comprendre son point de vue", value: 5 },
]

export const ASSESSMENTS: Record<
  AssessmentSlug,
  { name: string; description: string; questions: BankQuestion[] }
> = {
  personality: {
    name: "Personnalité & stress",
    description:
      "Pression, critique, habitudes, fiabilité, blessures et rythme de vie — pour un profil psychologique précis.",
    questions: [
      {
        key: "p01",
        dimension: "emotional_stability",
        type: "scenario",
        text: "Après une journée très difficile, votre partenaire vous demande de discuter d'un sujet sensible. Vous…",
        options: [
          { id: "a", label: "Demandez à reporter à demain pour ne pas réagir à chaud", value: 4 },
          { id: "b", label: "Acceptez mais restez silencieux(se) la plupart du temps", value: 2 },
          { id: "c", label: "Écoutez et partagez honnêtement, même si c'est fatiguant", value: 5 },
          { id: "d", label: "Changez de sujet pour éviter la tension", value: 1 },
        ],
      },
      {
        key: "p02",
        dimension: "communication",
        type: "scenario",
        text: "Quelqu'un vous critique injustement devant d'autres personnes. Votre réaction naturelle :",
        options: [
          { id: "a", label: "Répondre sur le moment pour me défendre", value: 3 },
          { id: "b", label: "Rester calme et en parler en privé plus tard", value: 5 },
          { id: "c", label: "M'excuser pour apaiser la situation", value: 2 },
          { id: "d", label: "Me fermer et ruminer intérieurement", value: 2 },
        ],
      },
      {
        key: "p03",
        dimension: "openness",
        type: "scenario",
        text: "Votre futur conjoint a une habitude de vie différente de la vôtre. Vous…",
        options: [
          { id: "a", label: "Souhaitez qu'il/elle s'adapte surtout à vous", value: 2 },
          { id: "b", label: "Cherchez un équilibre avec des règles claires", value: 5 },
          { id: "c", label: "Acceptez tout sans rien dire pour éviter les conflits", value: 3 },
          { id: "d", label: "Voyez cela comme une opportunité d'apprendre l'un de l'autre", value: 4 },
        ],
      },
      {
        key: "p04",
        dimension: "responsibility",
        type: "scenario",
        text: "Vous avez promis quelque chose d'important mais un imprévu surgit. Vous…",
        options: [
          { id: "a", label: "Prévenez tôt et proposez une alternative", value: 5 },
          { id: "b", label: "Reportez sans expliquer", value: 2 },
          { id: "c", label: "Tenez parole même au prix d'un grand sacrifice", value: 4 },
          { id: "d", label: "Annulez en espérant que ce ne soit pas grave", value: 1 },
        ],
      },
      {
        key: "p05",
        dimension: "emotional_stability",
        type: "scenario",
        text: "Face à une déception amoureuse passée, aujourd'hui vous…",
        options: [
          { id: "a", label: "Portez encore beaucoup de méfiance", value: 2 },
          { id: "b", label: "Avez fait un travail de guérison et avancez avec prudence", value: 5 },
          { id: "c", label: "Évitez d'en parler pour ne pas effrayer l'autre", value: 3 },
          { id: "d", label: "En parlez ouvertement pour des bases saines", value: 4 },
        ],
      },
      {
        key: "p06",
        dimension: "communication",
        type: "scenario",
        text: "Quand vous n'êtes pas d'accord sur un choix important :",
        options: [
          { id: "a", label: "Imposez votre avis si vous êtes sûr(e)", value: 2 },
          { id: "b", label: "Cherchez une décision commune même si c'est long", value: 5 },
          { id: "c", label: "Laissez l'autre décider pour garder la paix", value: 3 },
          { id: "d", label: "Reportez indéfiniment la discussion", value: 1 },
        ],
      },
      {
        key: "p07",
        dimension: "emotional_stability",
        type: "scenario",
        text: "Quand vous êtes stressé(e) ou anxieux(se), vous avez tendance à…",
        options: [
          { id: "a", label: "En parler tôt à la personne de confiance", value: 5 },
          { id: "b", label: "Vous isoler jusqu'à ce que ça passe", value: 2 },
          { id: "c", label: "Devenir irritable sans toujours l'expliquer", value: 2 },
          { id: "d", label: "Prier / marcher / écrire avant d'en parler", value: 4 },
        ],
      },
      {
        key: "p08",
        dimension: "openness",
        type: "scenario",
        text: "Changer de ville ou de pays pour le projet de couple :",
        options: [
          { id: "a", label: "Possible si le projet est clair et partagé", value: 5 },
          { id: "b", label: "Difficile — je suis très attaché(e) à mon environnement", value: 2 },
          { id: "c", label: "Oui facilement — je m'adapte vite", value: 4 },
          { id: "d", label: "Seulement si c'est temporaire au début", value: 3 },
        ],
      },
      {
        key: "p09",
        dimension: "responsibility",
        type: "scenario",
        text: "Dans la gestion du temps (retards, rendez-vous, engagements) :",
        options: [
          { id: "a", label: "Très ponctuel(le) et organisé(e)", value: 5 },
          { id: "b", label: "Flexible — le relationnel prime sur l'horloge", value: 3 },
          { id: "c", label: "Souvent en retard, mais je préviens", value: 2 },
          { id: "d", label: "J'essaie de m'améliorer avec des rappels", value: 4 },
        ],
      },
      {
        key: "p10",
        dimension: "communication",
        type: "scenario",
        text: "Recevoir un feedback difficile de votre partenaire :",
        options: [
          { id: "a", label: "J'écoute, je clarifie, puis je réponds", value: 5 },
          { id: "b", label: "Je me sens attaqué(e) facilement", value: 2 },
          { id: "c", label: "Je demande du temps avant de répondre", value: 4 },
          { id: "d", label: "Je minimise pour éviter d'en faire un sujet", value: 2 },
        ],
      },
    ],
  },
  spiritual: {
    name: "Foi & valeurs",
    description:
      "Place de Dieu, prière, service d'église et discernement dans le quotidien du couple.",
    questions: [
      {
        key: "s01",
        dimension: "faith_importance",
        type: "scenario",
        text: "Dans votre futur mariage, la foi devrait surtout…",
        options: [
          { id: "a", label: "Rester une conviction personnelle, sans trop en parler", value: 2 },
          { id: "b", label: "Être au centre : prière, Parole et direction commune", value: 5 },
          { id: "c", label: "Se manifester surtout le dimanche", value: 3 },
          { id: "d", label: "Guider les grandes décisions (mariage, travail, enfants)", value: 5 },
        ],
      },
      {
        key: "s02",
        dimension: "practices",
        type: "scenario",
        text: "Votre rythme de prière personnelle aujourd'hui :",
        options: [
          { id: "a", label: "Régulier — c'est un pilier de ma journée", value: 5 },
          { id: "b", label: "Variable selon les saisons de vie", value: 3 },
          { id: "c", label: "Occasionnel — je souhaite vraiment progresser", value: 3 },
          { id: "d", label: "Rare — la foi est surtout une identité culturelle", value: 1 },
        ],
      },
      {
        key: "s03",
        dimension: "marriage_vision",
        type: "scenario",
        text: "Pour vous, le mariage chrétien est avant tout…",
        options: [
          { id: "a", label: "Une alliance devant Dieu pour la vie", value: 5 },
          { id: "b", label: "Un projet qu'on ajuste si ça ne marche plus", value: 2 },
          { id: "c", label: "Une belle célébration et une étape sociale", value: 1 },
          { id: "d", label: "Un terrain pour grandir et se sanctifier ensemble", value: 5 },
        ],
      },
      {
        key: "s04",
        dimension: "community",
        type: "scenario",
        text: "Le service dans l'église (chorale, jeunesse, accueil, enseignement…) dans la vie d'un couple :",
        options: [
          {
            id: "a",
            label: "Essentiel — on sert ensemble ou on soutient le service de l'autre",
            value: 5,
          },
          {
            id: "b",
            label: "Important, mais le foyer et le couple passent d'abord",
            value: 4,
          },
          {
            id: "c",
            label: "Chacun sert de son côté, sans trop se concerter",
            value: 3,
          },
          {
            id: "d",
            label: "Le service d'église ne doit pas trop empiéter sur la vie privée",
            value: 2,
          },
        ],
      },
      {
        key: "s05",
        dimension: "practices",
        type: "scenario",
        text: "Prier à deux dans le couple, pour vous c'est…",
        options: [
          { id: "a", label: "Naturel et régulier dès le début de la relation", value: 5 },
          { id: "b", label: "Souhaité — on y va progressivement", value: 4 },
          { id: "c", label: "Gênant — je préfère prier seul(e)", value: 2 },
          { id: "d", label: "Pas nécessaire si chacun prie de son côté", value: 2 },
        ],
      },
      {
        key: "s06",
        dimension: "community",
        type: "scenario",
        text: "Si votre conjoint(e) est très engagé(e) à l'église et que vous, vous êtes plus en retrait :",
        options: [
          {
            id: "a",
            label: "On en parle et on cherche un rythme commun réaliste",
            value: 5,
          },
          {
            id: "b",
            label: "Je l'encourage, même si je ne m'implique pas autant",
            value: 4,
          },
          {
            id: "c",
            label: "Ça me gêne — je préfère qu'on réduise le service",
            value: 2,
          },
          {
            id: "d",
            label: "Chacun son rythme, on n'en discute pas vraiment",
            value: 2,
          },
        ],
      },
      {
        key: "s07",
        dimension: "faith_importance",
        type: "scenario",
        text: "Si votre conjoint(e) vivait en tension claire avec vos convictions de foi :",
        options: [
          { id: "a", label: "Je discute en cherchant la vérité biblique et le conseil", value: 5 },
          { id: "b", label: "Je fais des compromis pour préserver la relation", value: 2 },
          { id: "c", label: "Je m'éloigne si les valeurs fondamentales divergent", value: 4 },
          { id: "d", label: "J'évite le sujet pour garder la paix", value: 1 },
        ],
      },
      {
        key: "s08",
        dimension: "practices",
        type: "scenario",
        text: "La lecture de la Bible / méditation de la Parole dans votre semaine :",
        options: [
          { id: "a", label: "Régulière — presque chaque jour", value: 5 },
          { id: "b", label: "Quelques fois par semaine", value: 4 },
          { id: "c", label: "Surtout le dimanche ou en groupe", value: 3 },
          { id: "d", label: "Rare — je m'appuie surtout sur les prédications", value: 2 },
        ],
      },
      {
        key: "s09",
        dimension: "community",
        type: "scenario",
        text: "Fréquenter la même église / communauté que votre conjoint(e) :",
        options: [
          { id: "a", label: "Important — je préfère avancer dans la même assemblée", value: 5 },
          { id: "b", label: "Souhaitable, mais pas obligatoire au début", value: 4 },
          { id: "c", label: "Chacun peut garder sa communauté", value: 2 },
          { id: "d", label: "On décidera ensemble selon où Dieu nous conduit", value: 4 },
        ],
      },
      {
        key: "s10",
        dimension: "marriage_vision",
        type: "scenario",
        text: "Le rôle du pasteur / conseil pastoral dans le discernement de couple :",
        options: [
          { id: "a", label: "Je le souhaite avant un engagement sérieux", value: 5 },
          { id: "b", label: "Utile, mais optionnel", value: 3 },
          { id: "c", label: "Seulement en cas de crise", value: 2 },
          { id: "d", label: "Important pour le mariage et le suivi après", value: 4 },
        ],
      },
    ],
  },
  relationship: {
    name: "Conflits & dialogue",
    description:
      "Tensions, silence, réconciliation, jalousie, besoins affectifs — comment vous fonctionnez vraiment à deux.",
    questions: [
      {
        key: "r01",
        dimension: "conflict",
        type: "scenario",
        text: "En cas de conflit avec votre partenaire, vous avez tendance à…",
        options: conflictOpts,
      },
      {
        key: "r02",
        dimension: "conflict",
        type: "scenario",
        text: "Votre partenaire vous blesse avec des mots. Vous…",
        options: [
          { id: "a", label: "Répondez sur le même ton", value: 1 },
          { id: "b", label: "Dites ce que vous ressentez et proposez une pause", value: 5 },
          { id: "c", label: "Vous taisez et vous éloignez", value: 2 },
          { id: "d", label: "Demandez pardon même sans tort", value: 3 },
        ],
      },
      {
        key: "r03",
        dimension: "communication",
        type: "scenario",
        text: "Un sujet difficile (passé, jalousie, famille) à aborder :",
        options: [
          { id: "a", label: "Je prépare le moment et j'aborde avec honnêteté", value: 5 },
          { id: "b", label: "J'attends que l'autre en parle", value: 3 },
          { id: "c", label: "Je préfère ne pas en parler", value: 1 },
          { id: "d", label: "J'en parle indirectement (messages)", value: 2 },
        ],
      },
      {
        key: "r04",
        dimension: "conflict",
        type: "scenario",
        text: "Après une dispute, pour retrouver la paix vous…",
        options: [
          { id: "a", label: "Faites le premier pas", value: 5 },
          { id: "b", label: "Attendez les excuses de l'autre", value: 2 },
          { id: "c", label: "Faites comme si de rien n'était", value: 2 },
          { id: "d", label: "Parlez-en pour comprendre la racine", value: 5 },
        ],
      },
      {
        key: "r05",
        dimension: "emotional",
        type: "scenario",
        text: "Exprimer vos besoins affectifs :",
        options: [
          { id: "a", label: "Naturel — clarté et douceur", value: 5 },
          { id: "b", label: "Difficile — j'espère qu'on devine", value: 2 },
          { id: "c", label: "Surtout quand je suis frustré(e)", value: 2 },
          { id: "d", label: "Par les actes, sans en parler", value: 3 },
        ],
      },
      {
        key: "r06",
        dimension: "partnership",
        type: "scenario",
        text: "Une décision importante vous concerne tous les deux :",
        options: [
          { id: "a", label: "On décide ensemble", value: 5 },
          { id: "b", label: "Celui/celle qui s'y connaît décide", value: 3 },
          { id: "c", label: "Je décide seul(e) pour aller vite", value: 1 },
          { id: "d", label: "On consulte des proches de confiance", value: 4 },
        ],
      },
      {
        key: "r07",
        dimension: "emotional",
        type: "scenario",
        text: "Face à la jalousie (réseaux, amis, collègues) :",
        options: [
          { id: "a", label: "J'en parle calmement et on pose des règles claires", value: 5 },
          { id: "b", label: "Je garde pour moi et j'observe", value: 2 },
          { id: "c", label: "Je contrôle beaucoup (messages, sorties)", value: 1 },
          { id: "d", label: "Je fais confiance tant qu'il n'y a pas de signal clair", value: 4 },
        ],
      },
      {
        key: "r08",
        dimension: "conflict",
        type: "scenario",
        text: "Combien de temps pouvez-vous rester fâché(e) / en silence après un conflit ?",
        options: [
          { id: "a", label: "Quelques heures — je cherche vite la paix", value: 5 },
          { id: "b", label: "Un ou deux jours", value: 3 },
          { id: "c", label: "Plusieurs jours si je me sens blessé(e)", value: 2 },
          { id: "d", label: "Je préfère résoudre le jour même, même tard", value: 5 },
        ],
      },
      {
        key: "r09",
        dimension: "communication",
        type: "scenario",
        text: "Quand l'autre ne répond pas comme vous l'attendiez :",
        options: [
          { id: "a", label: "Je reformule et je vérifie ce qu'il/elle a compris", value: 5 },
          { id: "b", label: "Je me braque — « tu ne m'écoutes jamais »", value: 1 },
          { id: "c", label: "Je laisse tomber pour éviter le conflit", value: 2 },
          { id: "d", label: "Je prends un moment puis je reviens dessus", value: 4 },
        ],
      },
      {
        key: "r10",
        dimension: "partnership",
        type: "scenario",
        text: "Soutenir l'autre dans une période difficile (travail, deuil, échec) :",
        options: [
          { id: "a", label: "Présence, écoute, et aide concrète", value: 5 },
          { id: "b", label: "Je donne des conseils rapidement pour « réparer »", value: 3 },
          { id: "c", label: "Je prends de la distance car je me sens impuissant(e)", value: 2 },
          { id: "d", label: "Je prie et j'accompagne selon ce dont l'autre a besoin", value: 5 },
        ],
      },
    ],
  },
  couple_life: {
    name: "Vision du couple",
    description:
      "Vie à deux, familles, limites physiques, sexualité & pureté, enfants et quotidien — pour un profil clair, sans jugement.",
    questions: [
      {
        key: "c01",
        dimension: "vision",
        type: "scenario",
        text: "Pour vous, une vie de couple qui fonctionne au quotidien, c'est surtout…",
        options: [
          {
            id: "a",
            label: "Du temps de qualité régulier, même avec des agendas chargés",
            value: 5,
          },
          {
            id: "b",
            label: "Beaucoup d'indépendance — chacun sa vie, on se retrouve",
            value: 2,
          },
          {
            id: "c",
            label: "Une vie très ouverte (amis, église, famille, sorties)",
            value: 3,
          },
          {
            id: "d",
            label: "Un foyer calme et structuré, centré sur le foyer",
            value: 4,
          },
        ],
      },
      {
        key: "c02",
        dimension: "family",
        type: "scenario",
        text: "Dans votre vision, qui doit surtout décider du projet de couple (engagement, mariage, orientations) ?",
        options: [
          {
            id: "a",
            label: "Le couple décide ensemble, en tenant compte des conseils de la famille",
            value: 4,
          },
          {
            id: "b",
            label: "La famille (parents / aînés) a le dernier mot — c'est important pour moi",
            value: 2,
          },
          {
            id: "c",
            label: "Le couple décide, et la famille est informée avec respect",
            value: 5,
          },
          {
            id: "d",
            label: "On décide avec la famille dans une vraie discussion commune",
            value: 3,
          },
        ],
      },
      {
        key: "c03",
        dimension: "family",
        type: "scenario",
        text: "Vivre avec la famille élargie (parents, beaux-parents) après le mariage :",
        options: [
          {
            id: "a",
            label: "Oui, c'est naturel / souhaitable dans mon contexte",
            value: 2,
          },
          {
            id: "b",
            label: "Possible temporairement, avec un plan pour un foyer autonome",
            value: 4,
          },
          {
            id: "c",
            label: "Je préfère clairement un foyer autonome dès le départ",
            value: 5,
          },
          {
            id: "d",
            label: "Ça dépend des moyens, de la culture et de la saison de vie",
            value: 3,
          },
        ],
      },
      {
        key: "c04",
        dimension: "family",
        type: "scenario",
        text: "L'implication quotidienne de la famille dans la vie du couple (visites, conseils, organisation) :",
        options: [
          {
            id: "a",
            label: "Forte — la famille fait partie du quotidien du couple",
            value: 2,
          },
          {
            id: "b",
            label: "Modérée — présence régulière, avec des limites claires",
            value: 4,
          },
          {
            id: "c",
            label: "Légère — on se voit, mais le couple a son espace",
            value: 5,
          },
          {
            id: "d",
            label: "Très variable selon les besoins (maladie, enfants, urgences)",
            value: 3,
          },
        ],
      },
      {
        key: "c05",
        dimension: "family",
        type: "scenario",
        text: "Si votre famille (ou celle de l'autre) a une opinion forte sur votre relation :",
        options: [
          {
            id: "a",
            label: "On écoute sérieusement — leur avis pèse beaucoup",
            value: 2,
          },
          {
            id: "b",
            label: "On écoute, on prie / on réfléchit à deux, puis on tranche",
            value: 5,
          },
          {
            id: "c",
            label: "On en discute avec un pasteur ou un aîné mature",
            value: 4,
          },
          {
            id: "d",
            label: "On privilégie d'abord ce que le couple ressent",
            value: 3,
          },
        ],
      },
      {
        key: "c06",
        dimension: "intimacy",
        type: "scenario",
        text: "Concernant les relations sexuelles avant le mariage :",
        options: [
          {
            id: "a",
            label: "Je souhaite attendre le mariage (abstinence) — c'est mon engagement",
            value: 5,
          },
          {
            id: "b",
            label: "Je vise l'abstinence, même si c'est un combat parfois",
            value: 4,
          },
          {
            id: "c",
            label: "Ça dépend du niveau d'engagement (fiancés, promesse claire…)",
            value: 2,
          },
          {
            id: "d",
            label: "Ce n'est pas un critère central pour moi",
            value: 1,
          },
        ],
      },
      {
        key: "c07",
        dimension: "intimacy",
        type: "scenario",
        text: "Les limites physiques avant le mariage (baisers, câlins, nuit chez l'autre, etc.) :",
        options: [
          {
            id: "a",
            label: "Limites strictes — on évite ce qui peut allumer le désir",
            value: 5,
          },
          {
            id: "b",
            label: "Quelques marques d'affection, avec des règles claires à deux",
            value: 4,
          },
          {
            id: "c",
            label: "Assez souple — on avance selon le niveau de confiance",
            value: 2,
          },
          {
            id: "d",
            label: "Je n'ai pas encore de cadre précis — à discuter sérieusement",
            value: 3,
          },
        ],
      },
      {
        key: "c08",
        dimension: "intimacy",
        type: "scenario",
        text: "Être avec quelqu'un qui a déjà eu une vie sexuelle avant de se marier :",
        options: [
          {
            id: "a",
            label: "Possible si transparence, repentance et guérison",
            value: 4,
          },
          {
            id: "b",
            label: "Difficile pour moi — je préfère quelqu'un sans passé sexuel",
            value: 2,
          },
          {
            id: "c",
            label: "Ce n'est pas un obstacle si l'honnêteté est là",
            value: 5,
          },
          {
            id: "d",
            label: "C'est un critère bloquant pour moi",
            value: 1,
          },
        ],
      },
      {
        key: "c09",
        dimension: "intimacy",
        type: "scenario",
        text: "Parler ouvertement de sexualité, de limites et d'attentes avant le mariage :",
        options: [
          {
            id: "a",
            label: "Oui — avec respect, clarté et au bon moment",
            value: 5,
          },
          {
            id: "b",
            label: "Plutôt avec l'aide d'un pasteur / conseiller",
            value: 4,
          },
          {
            id: "c",
            label: "Gênant — on verra après le mariage",
            value: 2,
          },
          {
            id: "d",
            label: "Je préfère avancer progressivement sur ce sujet",
            value: 3,
          },
        ],
      },
      {
        key: "c10",
        dimension: "family",
        type: "scenario",
        text: "Concernant les enfants dans le mariage :",
        options: [
          { id: "a", label: "Désir clair — on en parle tôt dans la relation", value: 5 },
          { id: "b", label: "Ouvert — on verra selon la situation", value: 3 },
          { id: "c", label: "Je ne souhaite pas d'enfants", value: 2 },
          {
            id: "d",
            label: "Essentiel — je m'engage seulement si ce projet est partagé",
            value: 4,
          },
        ],
      },
      {
        key: "c11",
        dimension: "roles",
        type: "scenario",
        text: "Les rôles dans le foyer (tâches, organisation, décisions du quotidien) :",
        options: [
          { id: "a", label: "Répartition selon nos forces et disponibilités", value: 5 },
          { id: "b", label: "Rôles traditionnels clairement définis", value: 2 },
          { id: "c", label: "Flexible — celui/celle qui peut le fait", value: 3 },
          { id: "d", label: "On discute et on ajuste régulièrement", value: 4 },
        ],
      },
      {
        key: "c12",
        dimension: "vision",
        type: "scenario",
        text: "Vivre à distance (travail, études, diaspora) au début du couple / mariage :",
        options: [
          { id: "a", label: "Acceptable temporairement, avec un plan clair", value: 4 },
          { id: "b", label: "Difficile — je privilégie la proximité", value: 5 },
          { id: "c", label: "Possible si la confiance et la communication sont fortes", value: 3 },
          { id: "d", label: "Peu envisageable pour moi sur la durée", value: 2 },
        ],
      },
    ],
  },
  finances: {
    name: "Finances & projet",
    description:
      "Argent, dettes, dîme, budget, famille élargie, épargne — pour matcher des visions matérielles compatibles.",
    questions: [
      {
        key: "f01",
        dimension: "transparency",
        type: "scenario",
        text: "Avant le mariage, parler d'argent et de dettes :",
        options: [
          { id: "a", label: "Indispensable — transparence totale", value: 5 },
          { id: "b", label: "Une fois engagés officiellement", value: 3 },
          { id: "c", label: "Privé — chacun son côté", value: 1 },
          { id: "d", label: "Progressivement selon la confiance", value: 4 },
        ],
      },
      {
        key: "f02",
        dimension: "stewardship",
        type: "scenario",
        text: "La dîme et la générosité dans le couple :",
        options: [
          { id: "a", label: "Priorité commune — on décide ensemble", value: 5 },
          { id: "b", label: "Chacun selon sa conscience", value: 3 },
          { id: "c", label: "Quand on peut, sans régularité", value: 3 },
          { id: "d", label: "Pas un sujet central", value: 1 },
        ],
      },
      {
        key: "f03",
        dimension: "management",
        type: "scenario",
        text: "Gérer le budget du foyer, l'idéal c'est…",
        options: [
          { id: "a", label: "Compte commun + enveloppe personnelle", value: 5 },
          { id: "b", label: "Tout en commun, sans secrets", value: 4 },
          { id: "c", label: "Comptes séparés — chacun sa part", value: 3 },
          { id: "d", label: "L'un gère tout", value: 2 },
        ],
      },
      {
        key: "f04",
        dimension: "planning",
        type: "scenario",
        text: "Un achat important (voiture, logement, voyage) :",
        options: [
          { id: "a", label: "On planifie et épargne ensemble", value: 5 },
          { id: "b", label: "Crédit si urgent", value: 2 },
          { id: "c", label: "Celui qui gagne le plus décide", value: 2 },
          { id: "d", label: "On fixe un plafond commun", value: 5 },
        ],
      },
      {
        key: "f05",
        dimension: "transparency",
        type: "scenario",
        text: "Si votre conjoint dépensait sans vous en parler :",
        options: [
          { id: "a", label: "J'en parle calmement pour rétablir la confiance", value: 5 },
          { id: "b", label: "Je m'énerve et exige des comptes", value: 2 },
          { id: "c", label: "Je ferme les yeux", value: 1 },
          { id: "d", label: "Je remets en question la relation", value: 3 },
        ],
      },
      {
        key: "f06",
        dimension: "stewardship",
        type: "scenario",
        text: "Soutenir financièrement sa famille une fois marié(e) :",
        options: [
          { id: "a", label: "On discute et fixe des limites ensemble", value: 5 },
          { id: "b", label: "Obligation non négociable", value: 2 },
          { id: "c", label: "Chacun aide sa famille", value: 3 },
          { id: "d", label: "On priorise d'abord notre foyer", value: 4 },
        ],
      },
      {
        key: "f07",
        dimension: "planning",
        type: "scenario",
        text: "Face à un mois difficile (salaire en retard, imprévu) :",
        options: [
          { id: "a", label: "On revoit le budget ensemble et on coupe le superflu", value: 5 },
          { id: "b", label: "On emprunte rapidement à la famille / amis", value: 3 },
          { id: "c", label: "Chacun se débrouille de son côté", value: 2 },
          { id: "d", label: "On prie, on planifie, et on cherche des solutions concrètes", value: 5 },
        ],
      },
      {
        key: "f08",
        dimension: "management",
        type: "scenario",
        text: "Épargne et projets long terme (maison, enfants, retraite) :",
        options: [
          { id: "a", label: "Objectifs écrits et suivis à deux", value: 5 },
          { id: "b", label: "On épargne quand il reste de l'argent", value: 3 },
          { id: "c", label: "Peu d'épargne — on vit au jour le jour", value: 2 },
          { id: "d", label: "Un des deux gère l'épargne, l'autre fait confiance", value: 3 },
        ],
      },
      {
        key: "f09",
        dimension: "transparency",
        type: "scenario",
        text: "Différence de revenus importante dans le couple :",
        options: [
          { id: "a", label: "Normal — on mutualise selon un accord clair", value: 5 },
          { id: "b", label: "Gênant — je préfère des revenus proches", value: 2 },
          { id: "c", label: "OK si celui qui gagne plus ne domine pas les décisions", value: 4 },
          { id: "d", label: "Chacun garde son niveau de vie personnel", value: 2 },
        ],
      },
      {
        key: "f10",
        dimension: "stewardship",
        type: "scenario",
        text: "Le style de vie matériel que vous visez à deux :",
        options: [
          { id: "a", label: "Simple et discipliné — contentement", value: 5 },
          { id: "b", label: "Confortable — on investit dans la qualité de vie", value: 3 },
          { id: "c", label: "Ambitieux — on vise la réussite matérielle visible", value: 2 },
          { id: "d", label: "Équilibré — générosité + sécurité + quelques plaisirs", value: 4 },
        ],
      },
    ],
  },
}

export const LIKERT_LABELS = [
  "Pas du tout d'accord",
  "Pas d'accord",
  "Neutre",
  "D'accord",
  "Tout à fait d'accord",
] as const

export function getOptionLabel(
  question: BankQuestion,
  answerValue: number,
  optionId?: string
): string {
  if (question.type === "scenario" && question.options) {
    if (optionId) {
      const byId = question.options.find((o) => o.id === optionId)
      if (byId) return byId.label
    }
    const opt = question.options.find((o) => o.value === answerValue)
    if (opt) return opt.label
    const byIndex = question.options[answerValue - 1]
    return byIndex?.label ?? `Option ${answerValue}`
  }
  return LIKERT_LABELS[answerValue - 1] ?? `Réponse ${answerValue}`
}

export function normalizeScore(raw: number, questionCount: number): number {
  const min = questionCount * 1
  const max = questionCount * 5
  if (max === min) return 0
  return Math.round(((raw - min) / (max - min)) * 100)
}

export function scoreAnswers(
  questions: BankQuestion[],
  answers: Record<string, number>
): { raw: number; normalized: number; dimensions: Record<string, number> } {
  let raw = 0
  const dimRaw: Record<string, { sum: number; count: number }> = {}

  for (const q of questions) {
    let value = answers[q.key]
    if (!value || value < 1 || value > 5) value = 3
    if (q.type === "likert" && q.reverse) value = 6 - value
    raw += value
    if (!dimRaw[q.dimension]) dimRaw[q.dimension] = { sum: 0, count: 0 }
    dimRaw[q.dimension].sum += value
    dimRaw[q.dimension].count += 1
  }

  const dimensions: Record<string, number> = {}
  for (const [dim, data] of Object.entries(dimRaw)) {
    dimensions[dim] = normalizeScore(data.sum, data.count)
  }

  return {
    raw,
    normalized: normalizeScore(raw, questions.length),
    dimensions,
  }
}
