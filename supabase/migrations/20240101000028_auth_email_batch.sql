-- D9: batch email lookup for cron (avoid N× getUserById)
-- service_role only

CREATE OR REPLACE FUNCTION public.get_auth_users_email_batch(p_ids uuid[])
RETURNS TABLE (
  user_id uuid,
  email text,
  raw_first_name text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT
    u.id AS user_id,
    u.email::text AS email,
    COALESCE(
      u.raw_user_meta_data->>'first_name',
      u.raw_user_meta_data->>'given_name',
      ''
    )::text AS raw_first_name
  FROM auth.users u
  WHERE u.id = ANY (p_ids);
$$;

REVOKE ALL ON FUNCTION public.get_auth_users_email_batch(uuid[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_auth_users_email_batch(uuid[]) FROM anon;
REVOKE ALL ON FUNCTION public.get_auth_users_email_batch(uuid[]) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_users_email_batch(uuid[]) TO service_role;
