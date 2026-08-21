-- Matching sur la demande + invitations tests + crédits messages (20 jours).

CREATE TABLE IF NOT EXISTS public.message_credit_lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  remaining INTEGER NOT NULL CHECK (remaining >= 0),
  source TEXT NOT NULL CHECK (
    source IN ('test_complete', 'invite_sent', 'invite_accepted')
  ),
  source_key TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT message_credit_lots_idempotent UNIQUE (user_id, source, source_key)
);

CREATE INDEX IF NOT EXISTS message_credit_lots_consume_idx
  ON public.message_credit_lots (user_id, expires_at)
  WHERE remaining > 0;

CREATE TABLE IF NOT EXISTS public.assessment_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT assessment_invites_unique UNIQUE (inviter_id, invitee_id, test_slug),
  CONSTRAINT assessment_invites_not_self CHECK (inviter_id <> invitee_id)
);

CREATE INDEX IF NOT EXISTS assessment_invites_invitee_idx
  ON public.assessment_invites (invitee_id, status, created_at DESC);

ALTER TABLE public.message_credit_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own message credits" ON public.message_credit_lots;
CREATE POLICY "Users read own message credits"
  ON public.message_credit_lots FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users read own assessment invites" ON public.assessment_invites;
CREATE POLICY "Users read own assessment invites"
  ON public.assessment_invites FOR SELECT
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

DROP POLICY IF EXISTS "Users insert own assessment invites" ON public.assessment_invites;
CREATE POLICY "Users insert own assessment invites"
  ON public.assessment_invites FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Moderators read message credits" ON public.message_credit_lots;
CREATE POLICY "Moderators read message credits"
  ON public.message_credit_lots FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Moderators read assessment invites" ON public.assessment_invites;
CREATE POLICY "Moderators read assessment invites"
  ON public.assessment_invites FOR SELECT
  USING (public.is_moderator());
