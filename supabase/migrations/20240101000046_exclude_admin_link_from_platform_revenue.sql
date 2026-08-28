-- Encaissements indépendants (coaching, hors plateforme) : ne pas les compter dans les revenus Alliance.

CREATE OR REPLACE FUNCTION public.sum_completed_payments()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(sum(amount), 0)::numeric
  FROM public.payments
  WHERE status = 'completed'
    AND coalesce(metadata->>'product', '') <> 'admin_link';
$$;

CREATE OR REPLACE FUNCTION public.sum_independent_payments()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(sum(amount), 0)::numeric
  FROM public.payments
  WHERE status = 'completed'
    AND metadata->>'product' = 'admin_link';
$$;

REVOKE ALL ON FUNCTION public.sum_independent_payments() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sum_independent_payments() TO service_role;
GRANT EXECUTE ON FUNCTION public.sum_independent_payments() TO authenticated;
