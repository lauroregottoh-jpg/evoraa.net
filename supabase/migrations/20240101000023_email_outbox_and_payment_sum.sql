-- Wave 2 scale: payment sum RPC + email outbox for Resend retries.

CREATE OR REPLACE FUNCTION public.sum_completed_payments()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(sum(amount), 0)::numeric
  FROM public.payments
  WHERE status = 'completed';
$$;

REVOKE ALL ON FUNCTION public.sum_completed_payments() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sum_completed_payments() TO service_role;
GRANT EXECUTE ON FUNCTION public.sum_completed_payments() TO authenticated;

CREATE TABLE IF NOT EXISTS public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  subject text NOT NULL,
  html text NOT NULL,
  reply_to text,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  send_after timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_outbox_pending_idx
  ON public.email_outbox (status, send_after)
  WHERE status = 'pending';

ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_read_email_outbox" ON public.email_outbox;
CREATE POLICY "admins_read_email_outbox"
  ON public.email_outbox
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
