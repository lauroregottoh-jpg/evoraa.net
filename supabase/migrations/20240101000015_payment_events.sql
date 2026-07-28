-- Journal d'audit des paiements (Bictorys, CinetPay, démo)

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  provider TEXT,
  event_type TEXT NOT NULL,
  status TEXT,
  message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_payment_id ON public.payment_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON public.payment_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_events_provider ON public.payment_events(provider);

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Moderators can view payment events" ON public.payment_events;
CREATE POLICY "Moderators can view payment events"
  ON public.payment_events FOR SELECT
  USING (public.is_moderator());
