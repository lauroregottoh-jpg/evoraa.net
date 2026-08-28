-- Liens de paiement admin (montant libre, usage externe)
CREATE TABLE IF NOT EXISTS public.admin_payment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  amount DECIMAL NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'XOF',
  label TEXT,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_payment_links_slug ON public.admin_payment_links(slug);
CREATE INDEX IF NOT EXISTS idx_admin_payment_links_created_by ON public.admin_payment_links(created_by);
CREATE INDEX IF NOT EXISTS idx_admin_payment_links_status ON public.admin_payment_links(status);

ALTER TABLE public.admin_payment_links ENABLE ROW LEVEL SECURITY;

-- Lecture publique limitée via service role / server actions uniquement
CREATE POLICY "Service role full access admin_payment_links"
  ON public.admin_payment_links
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view admin_payment_links"
  ON public.admin_payment_links
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );
