-- Vérif post-migration D2 / 00027 — coller dans SQL Editor Supabase.
-- Attendu : 1 ligne table + indexes / policy présents.

-- 1) Table existe ?
SELECT
  to_regclass('public.webhook_deliveries') AS table_regclass;

-- 2) Colonnes + contrainte UNIQUE
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'webhook_deliveries'
ORDER BY ordinal_position;

SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid = 'public.webhook_deliveries'::regclass
  AND contype IN ('u', 'p');

-- 3) RLS activée + policy staff
SELECT c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'webhook_deliveries';

SELECT polname, cmd::text, qual::text
FROM pg_policy
WHERE polrelid = 'public.webhook_deliveries'::regclass;

-- 4) Index
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'webhook_deliveries';

-- 5) Smoke insert/delete service_role (optionnel — lance en tant que postgres/service)
-- Laisse commenté si tu préfères ne rien écrire :
-- INSERT INTO public.webhook_deliveries (provider, external_id, event_type)
-- VALUES ('bictorys', 'verify-00027', 'completed')
-- ON CONFLICT DO NOTHING;
-- SELECT * FROM public.webhook_deliveries WHERE external_id = 'verify-00027';
-- DELETE FROM public.webhook_deliveries WHERE external_id = 'verify-00027';
