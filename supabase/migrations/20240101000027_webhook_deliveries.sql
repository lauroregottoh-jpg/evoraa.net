-- D2: durable webhook delivery log (idempotency / dedup) — parity Evora WebhookLog
-- UNIQUE(provider, external_id, event_type); service_role writes; moderators read.

CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'default',
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT webhook_deliveries_provider_external_event_key
    UNIQUE (provider, external_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at
  ON public.webhook_deliveries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_payment_id
  ON public.webhook_deliveries (payment_id)
  WHERE payment_id IS NOT NULL;

ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Moderators can view webhook deliveries" ON public.webhook_deliveries;
CREATE POLICY "Moderators can view webhook deliveries"
  ON public.webhook_deliveries FOR SELECT
  USING (public.is_moderator());

-- Writes: service_role only (no INSERT/UPDATE policies for anon/authenticated)
