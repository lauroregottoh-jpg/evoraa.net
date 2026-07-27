-- Bank v2 : seed FK rows for new pillars + reset old Likert results
-- (UI questions live in TypeScript; DB rows exist so test_answers FK succeeds.)

UPDATE public.psychometric_tests
SET
  name = 'Personnalité & stress',
  description = 'Pression, critique, habitudes, fiabilité — profil scénarios v2',
  version = '2.0',
  is_active = true
WHERE id = 'a1111111-1111-4111-8111-111111111111';

UPDATE public.psychometric_tests
SET
  name = 'Compatibilité spirituelle',
  description = 'Foi, pratiques, vision — profil scénarios v2',
  version = '2.0',
  is_active = true
WHERE id = 'a2222222-2222-4222-8222-222222222222';

UPDATE public.psychometric_tests
SET
  name = 'Compatibilité relationnelle',
  description = 'Dialogue, conflits, partenariat — profil scénarios v2',
  version = '2.0',
  is_active = true
WHERE id = 'a3333333-3333-4333-8333-333333333333';

UPDATE public.psychometric_tests
SET
  name = 'Vision du couple',
  description = 'Vie à deux, familles, limites, enfants — scénarios v2',
  version = '2.0',
  is_active = true
WHERE id = 'a4444444-4444-4444-8444-444444444444';

UPDATE public.psychometric_tests
SET
  name = 'Finances & projet',
  description = 'Argent, dîme, budget, projet — scénarios v2',
  version = '2.0',
  is_active = true
WHERE id = 'a5555555-5555-4555-8555-555555555555';

-- Vision du couple (12)
INSERT INTO public.test_questions (id, test_id, question, order_index, dimension) VALUES
('00000000-0000-4000-8000-000400000001', 'a4444444-4444-4444-8444-444444444444', 'Vie de couple au quotidien', 1, 'vision'),
('00000000-0000-4000-8000-000400000002', 'a4444444-4444-4444-8444-444444444444', 'Familles et foyer', 2, 'family'),
('00000000-0000-4000-8000-000400000003', 'a4444444-4444-4444-8444-444444444444', 'Limites physiques', 3, 'intimacy'),
('00000000-0000-4000-8000-000400000004', 'a4444444-4444-4444-8444-444444444444', 'Abstinence et engagement', 4, 'intimacy'),
('00000000-0000-4000-8000-000400000005', 'a4444444-4444-4444-8444-444444444444', 'Passé et transparence', 5, 'intimacy'),
('00000000-0000-4000-8000-000400000006', 'a4444444-4444-4444-8444-444444444444', 'Enfants et timing', 6, 'family'),
('00000000-0000-4000-8000-000400000007', 'a4444444-4444-4444-8444-444444444444', 'Rôles au foyer', 7, 'roles'),
('00000000-0000-4000-8000-000400000008', 'a4444444-4444-4444-8444-444444444444', 'Temps à deux', 8, 'vision'),
('00000000-0000-4000-8000-000400000009', 'a4444444-4444-4444-8444-444444444444', 'Décisions importantes', 9, 'roles'),
('00000000-0000-4000-8000-000400000010', 'a4444444-4444-4444-8444-444444444444', 'Beaux-parents', 10, 'family'),
('00000000-0000-4000-8000-000400000011', 'a4444444-4444-4444-8444-444444444444', 'Sexualité après mariage', 11, 'intimacy'),
('00000000-0000-4000-8000-000400000012', 'a4444444-4444-4444-8444-444444444444', 'Quotidien partagé', 12, 'vision')
ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, dimension = EXCLUDED.dimension;

-- Finances (10)
INSERT INTO public.test_questions (id, test_id, question, order_index, dimension) VALUES
('00000000-0000-4000-8000-000500000001', 'a5555555-5555-4555-8555-555555555555', 'Transparence financière', 1, 'transparency'),
('00000000-0000-4000-8000-000500000002', 'a5555555-5555-4555-8555-555555555555', 'Dettes', 2, 'transparency'),
('00000000-0000-4000-8000-000500000003', 'a5555555-5555-4555-8555-555555555555', 'Dîme et offrandes', 3, 'stewardship'),
('00000000-0000-4000-8000-000500000004', 'a5555555-5555-4555-8555-555555555555', 'Budget à deux', 4, 'management'),
('00000000-0000-4000-8000-000500000005', 'a5555555-5555-4555-8555-555555555555', 'Aide à la famille', 5, 'stewardship'),
('00000000-0000-4000-8000-000500000006', 'a5555555-5555-4555-8555-555555555555', 'Épargne', 6, 'planning'),
('00000000-0000-4000-8000-000500000007', 'a5555555-5555-4555-8555-555555555555', 'Achats importants', 7, 'management'),
('00000000-0000-4000-8000-000500000008', 'a5555555-5555-4555-8555-555555555555', 'Revenus inégaux', 8, 'transparency'),
('00000000-0000-4000-8000-000500000009', 'a5555555-5555-4555-8555-555555555555', 'Projet logement', 9, 'planning'),
('00000000-0000-4000-8000-000500000010', 'a5555555-5555-4555-8555-555555555555', 'Priorités d''argent', 10, 'stewardship')
ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, dimension = EXCLUDED.dimension;

-- Soft-launch : invalider les anciens résultats Likert pour forcer les scénarios v2
DELETE FROM public.test_answers;
DELETE FROM public.test_results;

UPDATE public.profiles
SET
  psychometric_results = jsonb_build_object(
    'bank_version', 2,
    'pillars_completed', 0,
    'updated_at', now()
  ),
  onboarding_status = CASE
    WHEN onboarding_status IN ('active', 'step3_tests') THEN 'step3_tests'
    ELSE onboarding_status
  END,
  completion_percentage = CASE
    WHEN completion_percentage > 70 THEN 70
    ELSE completion_percentage
  END,
  updated_at = now()
WHERE true;
