-- Vérif D9 / 00028 — batch emails cron
SELECT proname, prosecdef
FROM pg_proc
WHERE proname = 'get_auth_users_email_batch';

-- Smoke (remplace par un vrai uuid membre si tu veux tester le retour) :
-- SELECT * FROM public.get_auth_users_email_batch(ARRAY[]::uuid[]);
