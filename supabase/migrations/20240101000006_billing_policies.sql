-- Billing write policies + safe activation helper

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert payments for own subscriptions"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = subscription_id
        AND subscriptions.user_id = auth.uid()
    )
  );

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
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT p.subscription_id INTO v_sub
  FROM public.payments p
  JOIN public.subscriptions s ON s.id = p.subscription_id
  WHERE p.id = p_payment_id
    AND p.status = 'pending'
    AND s.user_id = v_user;

  IF v_sub IS NULL THEN
    RAISE EXCEPTION 'Payment not found or not pending';
  END IF;

  -- Cancel other active subscriptions for this user
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

GRANT EXECUTE ON FUNCTION public.activate_pending_payment(uuid, text) TO authenticated;
