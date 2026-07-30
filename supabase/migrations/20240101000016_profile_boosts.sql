-- Profile boosts (visibilité temporaire) — à appliquer quand le paiement Boost est branché.
-- Ne remplace pas Alliance : complément one-shot.

CREATE TABLE IF NOT EXISTS public.profile_boosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL,
  amount_xof INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status TEXT NOT NULL DEFAULT 'pending',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_boosts_user_id ON public.profile_boosts(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_boosts_ends_at ON public.profile_boosts(ends_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_boosts_status ON public.profile_boosts(status);

ALTER TABLE public.profile_boosts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own boosts" ON public.profile_boosts;
CREATE POLICY "Users can view own boosts"
  ON public.profile_boosts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Moderators can view boosts" ON public.profile_boosts;
CREATE POLICY "Moderators can view boosts"
  ON public.profile_boosts FOR SELECT
  USING (public.is_moderator());
