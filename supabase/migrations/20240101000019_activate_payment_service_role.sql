-- Fix activate_pending_payment for service_role calls (demo/billing after 018 REVOKE).
-- When auth.uid() is null (service_role), resolve owner from the payment row.
-- EXECUTE remains service_role-only (no grant to authenticated).

CREATE OR REPLACE FUNCTION public.activate_pending_payment(
  p_payment_id uuid,
  p_transaction_ref text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_sub uuid;
BEGIN
  SELECT p.subscription_id, s.user_id
    INTO v_sub, v_user
  FROM public.payments p
  JOIN public.subscriptions s ON s.id = p.subscription_id
  WHERE p.id = p_payment_id
    AND p.status = 'pending'
    AND (auth.uid() IS NULL OR s.user_id = auth.uid());

  IF v_sub IS NULL OR v_user IS NULL THEN
    RAISE EXCEPTION 'Payment not found or not pending';
  END IF;

  -- Only service_role (or DB owner) should reach here without auth.uid();
  -- authenticated EXECUTE was revoked in 018.
  IF auth.uid() IS NOT NULL AND auth.uid() IS DISTINCT FROM v_user THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  UPDATE public.subscriptions
  SET status = 'cancelled'
  WHERE user_id = v_user
    AND id <> v_sub
    AND status = 'active';

  UPDATE public.payments
  SET
    status = 'completed',
    transaction_reference = COALESCE(p_transaction_ref, transaction_reference),
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('activated_at', now()::text)
  WHERE id = p_payment_id;

  UPDATE public.subscriptions
  SET
    status = 'active',
    starts_at = now(),
    ends_at = now() + interval '30 days'
  WHERE id = v_sub
    AND user_id = v_user;
END;
$$;

REVOKE ALL ON FUNCTION public.activate_pending_payment(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.activate_pending_payment(uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.activate_pending_payment(uuid, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.activate_pending_payment(uuid, text) TO service_role;
