-- Durée des liens de paiement admin : permanent ou temporaire (expiration).

ALTER TABLE public.admin_payment_links
  DROP CONSTRAINT IF EXISTS admin_payment_links_status_check;

ALTER TABLE public.admin_payment_links
  ADD CONSTRAINT admin_payment_links_status_check
  CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'expired'));

ALTER TABLE public.admin_payment_links
  ADD COLUMN IF NOT EXISTS duration_type TEXT NOT NULL DEFAULT 'permanent'
    CHECK (duration_type IN ('permanent', 'temporary')),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_admin_payment_links_expires_at
  ON public.admin_payment_links (expires_at)
  WHERE expires_at IS NOT NULL;
