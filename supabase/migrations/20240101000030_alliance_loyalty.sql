-- Programme Fidélité Alliance — comptes + journal des grants (idempotent par payment_ref)

CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  consecutive_months INTEGER NOT NULL DEFAULT 0,
  bonus_messages_balance INTEGER NOT NULL DEFAULT 0,
  profile_boosts_available INTEGER NOT NULL DEFAULT 0,
  vip_session_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  vip_session_reached_at TIMESTAMPTZ,
  fidelity_card_id TEXT NOT NULL DEFAULT 'welcome',
  last_grant_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_ref TEXT NOT NULL,
  months_credited INTEGER NOT NULL DEFAULT 1,
  consecutive_months_after INTEGER NOT NULL DEFAULT 0,
  bonus_messages INTEGER NOT NULL DEFAULT 0,
  boosts INTEGER NOT NULL DEFAULT 0,
  kind TEXT NOT NULL DEFAULT 'renewal',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT loyalty_grants_payment_ref_unique UNIQUE (payment_ref)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_grants_user ON public.loyalty_grants(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_accounts_card ON public.loyalty_accounts(fidelity_card_id);

ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_grants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own loyalty account" ON public.loyalty_accounts;
CREATE POLICY "Users read own loyalty account"
  ON public.loyalty_accounts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users read own loyalty grants" ON public.loyalty_grants;
CREATE POLICY "Users read own loyalty grants"
  ON public.loyalty_grants FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Moderators read loyalty accounts" ON public.loyalty_accounts;
CREATE POLICY "Moderators read loyalty accounts"
  ON public.loyalty_accounts FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Moderators read loyalty grants" ON public.loyalty_grants;
CREATE POLICY "Moderators read loyalty grants"
  ON public.loyalty_grants FOR SELECT
  USING (public.is_moderator());

-- Consommer 1 message bonus (Alliance uniquement côté app ; RPC atomique)
CREATE OR REPLACE FUNCTION public.consume_loyalty_bonus_message(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE public.loyalty_accounts
  SET
    bonus_messages_balance = bonus_messages_balance - 1,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND bonus_messages_balance > 0;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_loyalty_bonus_message(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_loyalty_bonus_message(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_loyalty_bonus_message(UUID) TO service_role;
