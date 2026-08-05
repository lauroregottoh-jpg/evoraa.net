-- Admin audit trail (ops) — best-effort insert from service role / authenticated admin.

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx
  ON public.admin_audit_log (created_at DESC);

CREATE INDEX IF NOT EXISTS admin_audit_log_actor_idx
  ON public.admin_audit_log (actor_user_id);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Lecture : staff (admin/moderator) uniquement
DROP POLICY IF EXISTS admin_audit_log_staff_select ON public.admin_audit_log;
CREATE POLICY admin_audit_log_staff_select
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.role IN ('admin', 'moderator')
    )
  );

-- Pas d’INSERT direct client — service_role / SECURITY DEFINER helper côté app admin client
REVOKE INSERT, UPDATE, DELETE ON public.admin_audit_log FROM authenticated, anon;
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
