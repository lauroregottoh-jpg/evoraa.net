-- Scale readiness for ~7k users: auth email lookup, message inbox RPC, indexes.

-- 1) Direct auth.users email lookup (service_role only) — replaces listUsers pagination.
CREATE OR REPLACE FUNCTION public.get_auth_user_id_by_email(p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_email IS NULL OR length(trim(p_email)) < 3 THEN
    RETURN NULL;
  END IF;
  SELECT id INTO v_id
  FROM auth.users
  WHERE lower(email) = lower(trim(p_email))
  LIMIT 1;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_auth_user_id_by_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_auth_user_id_by_email(text) FROM anon;
REVOKE ALL ON FUNCTION public.get_auth_user_id_by_email(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_user_id_by_email(text) TO service_role;

-- 2) Conversation list extras in one round-trip (last message + unread).
CREATE OR REPLACE FUNCTION public.conversation_list_extras(
  p_user_id uuid,
  p_conversation_ids uuid[]
)
RETURNS TABLE (
  conversation_id uuid,
  last_message text,
  last_at timestamptz,
  unread_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ids AS (
    SELECT unnest(p_conversation_ids) AS conversation_id
  ),
  last_msg AS (
    SELECT DISTINCT ON (m.conversation_id)
      m.conversation_id,
      m.message AS last_message,
      m.created_at AS last_at
    FROM public.messages m
    INNER JOIN ids i ON i.conversation_id = m.conversation_id
    ORDER BY m.conversation_id, m.created_at DESC
  ),
  unread AS (
    SELECT
      m.conversation_id,
      count(*)::bigint AS unread_count
    FROM public.messages m
    INNER JOIN ids i ON i.conversation_id = m.conversation_id
    WHERE m.is_read = false
      AND m.sender_id <> p_user_id
    GROUP BY m.conversation_id
  )
  SELECT
    i.conversation_id,
    lm.last_message,
    lm.last_at,
    coalesce(u.unread_count, 0) AS unread_count
  FROM ids i
  LEFT JOIN last_msg lm ON lm.conversation_id = i.conversation_id
  LEFT JOIN unread u ON u.conversation_id = i.conversation_id;
$$;

REVOKE ALL ON FUNCTION public.conversation_list_extras(uuid, uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.conversation_list_extras(uuid, uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.conversation_list_extras(uuid, uuid[]) TO service_role;

-- 3) Indexes for matching, messaging, cron.
CREATE INDEX IF NOT EXISTS profiles_matching_pool_idx
  ON public.profiles (gender, completion_percentage DESC)
  WHERE deleted_at IS NULL
    AND (moderation_status IS DISTINCT FROM 'rejected'::public.moderation_status_enum);

CREATE INDEX IF NOT EXISTS profiles_created_at_idx
  ON public.profiles (created_at DESC);

CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
  ON public.messages (conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS messages_conversation_unread_idx
  ON public.messages (conversation_id, sender_id)
  WHERE is_read = false;

CREATE INDEX IF NOT EXISTS subscriptions_active_ends_idx
  ON public.subscriptions (status, ends_at)
  WHERE status = 'active';
