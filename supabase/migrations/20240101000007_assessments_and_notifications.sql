-- Assessments + notifications write policies + seed bank

ALTER TABLE public.test_questions
  ADD COLUMN IF NOT EXISTS dimension text,
  ADD COLUMN IF NOT EXISTS weight numeric DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_reverse_scored boolean DEFAULT false;

CREATE POLICY "Users can insert their own test results"
  ON public.test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results"
  ON public.test_results FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Unique pair for results upsert convenience
CREATE UNIQUE INDEX IF NOT EXISTS idx_test_results_user_test
  ON public.test_results (user_id, test_id);

INSERT INTO public.psychometric_tests (id, name, description, version, is_active)
VALUES
  ('a1111111-1111-4111-8111-111111111111', 'Personnalité', 'Communication, stabilité, ouverture, fiabilité', '1.0', true),
  ('a2222222-2222-4222-8222-222222222222', 'Compatibilité spirituelle', 'Foi, pratiques, vision du mariage', '1.0', true),
  ('a3333333-3333-4333-8333-333333333333', 'Compatibilité relationnelle', 'Dialogue, conflits, partenariat', '1.0', true)
ON CONFLICT (id) DO NOTHING;

-- Personality questions
INSERT INTO public.test_questions (id, test_id, question, order_index, dimension) VALUES
('00000000-0000-4000-8000-000100000001', 'a1111111-1111-4111-8111-111111111111', 'J''exprime mes pensées avec clarté et ouverture.', 1, 'communication'),
('00000000-0000-4000-8000-000100000002', 'a1111111-1111-4111-8111-111111111111', 'J''écoute activement avant de répondre.', 2, 'communication'),
('00000000-0000-4000-8000-000100000003', 'a1111111-1111-4111-8111-111111111111', 'Je reste respectueux(se) pendant les désaccords.', 3, 'communication'),
('00000000-0000-4000-8000-000100000004', 'a1111111-1111-4111-8111-111111111111', 'Je reste calme sous pression.', 4, 'emotional_stability'),
('00000000-0000-4000-8000-000100000005', 'a1111111-1111-4111-8111-111111111111', 'Je gère mes émotions sans blesser les autres.', 5, 'emotional_stability'),
('00000000-0000-4000-8000-000100000006', 'a1111111-1111-4111-8111-111111111111', 'Je me relève rapidement après une déception.', 6, 'emotional_stability'),
('00000000-0000-4000-8000-000100000007', 'a1111111-1111-4111-8111-111111111111', 'Je m''adapte facilement au changement.', 7, 'openness'),
('00000000-0000-4000-8000-000100000008', 'a1111111-1111-4111-8111-111111111111', 'J''apprécie les points de vue différents du mien.', 8, 'openness'),
('00000000-0000-4000-8000-000100000009', 'a1111111-1111-4111-8111-111111111111', 'J''aime apprendre de nouvelles façons de faire.', 9, 'openness'),
('00000000-0000-4000-8000-000100000010', 'a1111111-1111-4111-8111-111111111111', 'On peut compter sur moi pour tenir mes engagements.', 10, 'responsibility'),
('00000000-0000-4000-8000-000100000011', 'a1111111-1111-4111-8111-111111111111', 'Je planifie avant de prendre des décisions importantes.', 11, 'responsibility'),
('00000000-0000-4000-8000-000100000012', 'a1111111-1111-4111-8111-111111111111', 'Je termine généralement ce que j''ai commencé.', 12, 'responsibility')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.test_questions (id, test_id, question, order_index, dimension) VALUES
('00000000-0000-4000-8000-000200000001', 'a2222222-2222-4222-8222-222222222222', 'Ma foi influence mes décisions quotidiennes.', 1, 'faith_importance'),
('00000000-0000-4000-8000-000200000002', 'a2222222-2222-4222-8222-222222222222', 'Je désire que Dieu soit au centre de mon futur mariage.', 2, 'faith_importance'),
('00000000-0000-4000-8000-000200000003', 'a2222222-2222-4222-8222-222222222222', 'La compatibilité spirituelle est essentielle pour choisir un conjoint.', 3, 'faith_importance'),
('00000000-0000-4000-8000-000200000004', 'a2222222-2222-4222-8222-222222222222', 'La prière fait partie régulièrement de ma vie.', 4, 'practices'),
('00000000-0000-4000-8000-000200000005', 'a2222222-2222-4222-8222-222222222222', 'La lecture de la Bible est une habitude importante pour moi.', 5, 'practices'),
('00000000-0000-4000-8000-000200000006', 'a2222222-2222-4222-8222-222222222222', 'Je valorise la prière à deux en couple.', 6, 'practices'),
('00000000-0000-4000-8000-000200000007', 'a2222222-2222-4222-8222-222222222222', 'Je crois que le mariage est une alliance pour la vie.', 7, 'marriage_vision'),
('00000000-0000-4000-8000-000200000008', 'a2222222-2222-4222-8222-222222222222', 'Je souhaite résoudre les conflits selon des principes bibliques.', 8, 'marriage_vision'),
('00000000-0000-4000-8000-000200000009', 'a2222222-2222-4222-8222-222222222222', 'Je suis engagé(e) activement dans une église locale.', 9, 'community'),
('00000000-0000-4000-8000-000200000010', 'a2222222-2222-4222-8222-222222222222', 'Servir les autres est une part importante de la vie chrétienne.', 10, 'community')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.test_questions (id, test_id, question, order_index, dimension) VALUES
('00000000-0000-4000-8000-000300000001', 'a3333333-3333-4333-8333-333333333333', 'J''exprime mes besoins avec respect.', 1, 'communication'),
('00000000-0000-4000-8000-000300000002', 'a3333333-3333-4333-8333-333333333333', 'J''écoute attentivement avant de répondre.', 2, 'communication'),
('00000000-0000-4000-8000-000300000003', 'a3333333-3333-4333-8333-333333333333', 'Je suis à l''aise pour aborder des sujets difficiles.', 3, 'communication'),
('00000000-0000-4000-8000-000300000004', 'a3333333-3333-4333-8333-333333333333', 'Je cherche des solutions plutôt que de « gagner » l''argument.', 4, 'conflict'),
('00000000-0000-4000-8000-000300000005', 'a3333333-3333-4333-8333-333333333333', 'Je m''excuse quand je réalise que j''ai tort.', 5, 'conflict'),
('00000000-0000-4000-8000-000300000006', 'a3333333-3333-4333-8333-333333333333', 'Je reste respectueux(se) même en désaccord.', 6, 'conflict'),
('00000000-0000-4000-8000-000300000007', 'a3333333-3333-4333-8333-333333333333', 'J''exprime facilement soin et affection.', 7, 'emotional'),
('00000000-0000-4000-8000-000300000008', 'a3333333-3333-4333-8333-333333333333', 'Je suis à l''aise pour parler de mes émotions.', 8, 'emotional'),
('00000000-0000-4000-8000-000300000009', 'a3333333-3333-4333-8333-333333333333', 'J''encourage une communication émotionnelle ouverte.', 9, 'emotional'),
('00000000-0000-4000-8000-000300000010', 'a3333333-3333-4333-8333-333333333333', 'Les décisions importantes doivent être prises ensemble.', 10, 'partnership'),
('00000000-0000-4000-8000-000300000011', 'a3333333-3333-4333-8333-333333333333', 'Je valorise le soutien mutuel au quotidien.', 11, 'partnership'),
('00000000-0000-4000-8000-000300000012', 'a3333333-3333-4333-8333-333333333333', 'Je suis prêt(e) à des sacrifices personnels pour la réussite du couple.', 12, 'partnership')
ON CONFLICT (id) DO NOTHING;
