-- D8 — Reserrer SELECT profils (privacy) sans casser matching.
-- Membres authentifiés voient le pool non supprimé / non rejeté.
-- Soi-même + modérateurs restent couverts (policies OR).

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Profiles viewable for matching pool"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_moderator()
    OR (
      auth.role() = 'authenticated'
      AND deleted_at IS NULL
      AND (
        moderation_status IS NULL
        OR moderation_status IS DISTINCT FROM 'rejected'::public.moderation_status_enum
      )
    )
  );
