-- Two additional assessment pillars: couple vision + finances

INSERT INTO public.psychometric_tests (id, name, description, version, is_active)
VALUES
  ('a4444444-4444-4444-8444-444444444444', 'Vision du couple', 'Vie à deux, famille, rôles et priorités', '2.0', true),
  ('a5555555-5555-4555-8555-555555555555', 'Finances & projet', 'Transparence, budget, générosité et stewardship', '2.0', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  version = EXCLUDED.version,
  is_active = EXCLUDED.is_active;
