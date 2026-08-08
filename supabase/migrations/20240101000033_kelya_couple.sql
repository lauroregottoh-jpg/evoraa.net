-- KELYA COUPLE™ — module bilan de couple (1 achat = 1 couple = 2 participants max)

CREATE TABLE IF NOT EXISTS public.couple_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaser_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  offer_id TEXT NOT NULL CHECK (offer_id IN ('couple_essential', 'couple_premium_plus')),
  amount_xof INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  offer_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS couple_purchases_purchaser_idx
  ON public.couple_purchases (purchaser_user_id);
CREATE INDEX IF NOT EXISTS couple_purchases_payment_idx
  ON public.couple_purchases (payment_id);

CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code TEXT NOT NULL UNIQUE,
  purchase_id UUID NOT NULL REFERENCES public.couple_purchases(id) ON DELETE CASCADE,
  purchaser_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id TEXT NOT NULL CHECK (offer_id IN ('couple_essential', 'couple_premium_plus')),
  status TEXT NOT NULL DEFAULT 'CREATED'
    CHECK (status IN (
      'CREATED',
      'INVITATION_PENDING',
      'PARTNER_JOINED',
      'QUESTIONNAIRES_IN_PROGRESS',
      'BOTH_COMPLETED',
      'ANALYSIS_RUNNING',
      'RESULTS_READY',
      'REPORT_READY',
      'ACCESS_EXPIRING',
      'ACCESS_EXPIRED',
      'CANCELLED'
    )),
  relationship_status TEXT,
  offer_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  access_expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS couples_purchaser_idx ON public.couples (purchaser_user_id);
CREATE INDEX IF NOT EXISTS couples_status_idx ON public.couples (status);
CREATE INDEX IF NOT EXISTS couples_public_code_idx ON public.couples (public_code);

CREATE TABLE IF NOT EXISTS public.couple_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seat INTEGER NOT NULL CHECK (seat IN (1, 2)),
  display_name TEXT,
  questionnaire_status TEXT NOT NULL DEFAULT 'NOT_STARTED'
    CHECK (questionnaire_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (couple_id, seat),
  UNIQUE (couple_id, user_id)
);

CREATE INDEX IF NOT EXISTS couple_participants_user_idx
  ON public.couple_participants (user_id);
CREATE INDEX IF NOT EXISTS couple_participants_couple_idx
  ON public.couple_participants (couple_id);

CREATE TABLE IF NOT EXISTS public.couple_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS couple_invitations_active_code_idx
  ON public.couple_invitations (invite_code)
  WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS couple_invitations_couple_idx
  ON public.couple_invitations (couple_id);

CREATE TABLE IF NOT EXISTS public.couple_questionnaire_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.couple_participants(id) ON DELETE CASCADE,
  questionnaire_version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS'
    CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (couple_id, participant_id)
);

CREATE TABLE IF NOT EXISTS public.couple_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.couple_questionnaire_sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.couple_participants(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value BETWEEN 1 AND 5),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, question_id)
);

CREATE INDEX IF NOT EXISTS couple_answers_participant_idx
  ON public.couple_answers (participant_id);

CREATE TABLE IF NOT EXISTS public.couple_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL UNIQUE REFERENCES public.couples(id) ON DELETE CASCADE,
  scoring_version TEXT NOT NULL,
  global_score NUMERIC(5,2) NOT NULL,
  dimension_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  convergences JSONB NOT NULL DEFAULT '[]'::jsonb,
  divergences JSONB NOT NULL DEFAULT '[]'::jsonb,
  vigilance_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  priorities JSONB NOT NULL DEFAULT '[]'::jsonb,
  safety_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.couple_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  offer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'GENERATING', 'READY', 'FAILED')),
  questionnaire_version TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  content_version TEXT NOT NULL,
  report_version TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  qa_passed BOOLEAN NOT NULL DEFAULT FALSE,
  qa_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  generation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (couple_id, report_version)
);

CREATE INDEX IF NOT EXISTS couple_reports_couple_idx ON public.couple_reports (couple_id);

CREATE TABLE IF NOT EXISTS public.couple_access (
  couple_id UUID PRIMARY KEY REFERENCES public.couples(id) ON DELETE CASCADE,
  interactive_access BOOLEAN NOT NULL DEFAULT TRUE,
  access_expires_at TIMESTAMPTZ,
  download_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.couple_funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS couple_funnel_events_event_idx
  ON public.couple_funnel_events (event, created_at DESC);

-- Helpers (dollar quotes without internal semicolons — safer for statement splitters)
CREATE OR REPLACE FUNCTION public.is_couple_member(p_couple_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT EXISTS (
    SELECT 1 FROM public.couple_participants cp
    WHERE cp.couple_id = p_couple_id AND cp.user_id = auth.uid()
  )
$fn$;

CREATE OR REPLACE FUNCTION public.couple_participant_count(p_couple_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT COUNT(*)::INTEGER FROM public.couple_participants WHERE couple_id = p_couple_id
$fn$;

-- RLS
ALTER TABLE public.couple_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_questionnaire_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_funnel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Purchaser views own couple purchases" ON public.couple_purchases;
CREATE POLICY "Purchaser views own couple purchases"
  ON public.couple_purchases FOR SELECT
  USING (auth.uid() = purchaser_user_id OR public.is_moderator());

DROP POLICY IF EXISTS "Members view own couples" ON public.couples;
CREATE POLICY "Members view own couples"
  ON public.couples FOR SELECT
  USING (
    public.is_couple_member(id)
    OR auth.uid() = purchaser_user_id
    OR public.is_moderator()
  );

DROP POLICY IF EXISTS "Members view couple participants" ON public.couple_participants;
CREATE POLICY "Members view couple participants"
  ON public.couple_participants FOR SELECT
  USING (public.is_couple_member(couple_id) OR public.is_moderator());

DROP POLICY IF EXISTS "Members view own couple invitations" ON public.couple_invitations;
CREATE POLICY "Members view own couple invitations"
  ON public.couple_invitations FOR SELECT
  USING (public.is_couple_member(couple_id) OR public.is_moderator());

DROP POLICY IF EXISTS "Participant views own questionnaire session" ON public.couple_questionnaire_sessions;
CREATE POLICY "Participant views own questionnaire session"
  ON public.couple_questionnaire_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.couple_participants cp
      WHERE cp.id = participant_id AND cp.user_id = auth.uid()
    )
    OR public.is_moderator()
  );

-- Answers: ONLY own answers (never partner raw answers via RLS)
DROP POLICY IF EXISTS "Participant views own answers only" ON public.couple_answers;
CREATE POLICY "Participant views own answers only"
  ON public.couple_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.couple_participants cp
      WHERE cp.id = participant_id AND cp.user_id = auth.uid()
    )
    OR public.is_moderator()
  );

DROP POLICY IF EXISTS "Participant upserts own answers" ON public.couple_answers;
CREATE POLICY "Participant upserts own answers"
  ON public.couple_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.couple_participants cp
      WHERE cp.id = participant_id AND cp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Participant updates own answers" ON public.couple_answers;
CREATE POLICY "Participant updates own answers"
  ON public.couple_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.couple_participants cp
      WHERE cp.id = participant_id AND cp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members view couple scores" ON public.couple_scores;
CREATE POLICY "Members view couple scores"
  ON public.couple_scores FOR SELECT
  USING (public.is_couple_member(couple_id) OR public.is_moderator());

DROP POLICY IF EXISTS "Members view couple reports" ON public.couple_reports;
CREATE POLICY "Members view couple reports"
  ON public.couple_reports FOR SELECT
  USING (
    (public.is_couple_member(couple_id) AND status = 'READY')
    OR public.is_moderator()
  );

DROP POLICY IF EXISTS "Members view couple access" ON public.couple_access;
CREATE POLICY "Members view couple access"
  ON public.couple_access FOR SELECT
  USING (public.is_couple_member(couple_id) OR public.is_moderator());

DROP POLICY IF EXISTS "Users insert own funnel events" ON public.couple_funnel_events;
CREATE POLICY "Users insert own funnel events"
  ON public.couple_funnel_events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Moderators view funnel events" ON public.couple_funnel_events;
CREATE POLICY "Moderators view funnel events"
  ON public.couple_funnel_events FOR SELECT
  USING (public.is_moderator());
