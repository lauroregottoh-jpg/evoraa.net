-- Coaching domain: coaches, credits ledger, bookings, sessions, ratings
-- V1 native rooms (WebRTC later) - no Zoom links.

CREATE TABLE IF NOT EXISTS public.coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  gender text CHECK (gender IN ('female', 'male', 'other', 'unspecified')),
  photo_url text,
  short_bio text,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{fr}',
  coach_code text NOT NULL UNIQUE,
  accepts_sessions boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaches_code ON public.coaches (coach_code);
CREATE INDEX IF NOT EXISTS idx_coaches_status ON public.coaches (status, accepts_sessions);

CREATE TABLE IF NOT EXISTS public.coaching_credits_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta_credits integer NOT NULL,
  reason text NOT NULL,
  ref_payment_id uuid,
  ref_session_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaching_credits_user
  ON public.coaching_credits_ledger (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.coaching_coach_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  linked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, coach_id)
);

CREATE TABLE IF NOT EXISTS public.coaching_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE RESTRICT,
  credits_reserved integer NOT NULL DEFAULT 1,
  scheduled_start timestamptz,
  status text NOT NULL DEFAULT 'REQUESTED'
    CHECK (status IN (
      'REQUESTED', 'SCHEDULED', 'CANCELLED', 'NO_SHOW_CLIENT', 'NO_SHOW_COACH', 'COMPLETED'
    )),
  gender_preference text CHECK (gender_preference IN ('female', 'male', 'none')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaching_bookings_user
  ON public.coaching_bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_coach
  ON public.coaching_bookings (coach_id, scheduled_start);

CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.coaching_bookings(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'WAITING'
    CHECK (status IN (
      'WAITING', 'PREP', 'CONNECTING', 'ACTIVE', 'GRACE_PERIOD',
      'COMPLETED', 'CANCELLED', 'NO_SHOW_CLIENT', 'NO_SHOW_COACH', 'FAILED'
    )),
  -- Commercial 30 min displayed, server budget 40 min (2400 s)
  allocated_seconds integer NOT NULL DEFAULT 2400,
  prep_seconds integer NOT NULL DEFAULT 300,
  displayed_minutes integer NOT NULL DEFAULT 30,
  client_joined_at timestamptz,
  coach_joined_at timestamptz,
  prep_started_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  end_reason text,
  client_display_mode text NOT NULL DEFAULT 'profile'
    CHECK (client_display_mode IN ('profile', 'pseudonym', 'anonymous')),
  client_display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user
  ON public.coaching_sessions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach
  ON public.coaching_sessions (coach_id, status);

CREATE TABLE IF NOT EXISTS public.coaching_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.coaching_sessions(id) ON DELETE CASCADE,
  rater_role text NOT NULL CHECK (rater_role IN ('client', 'coach')),
  rater_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score BETWEEN 1 AND 5),
  answers jsonb DEFAULT '{}'::jsonb,
  free_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, rater_role)
);

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_coach_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_ratings ENABLE ROW LEVEL SECURITY;

-- Coaches: public read of active coaches, owners manage self
DROP POLICY IF EXISTS "coaches_select_active" ON public.coaches;
CREATE POLICY "coaches_select_active" ON public.coaches
  FOR SELECT TO authenticated
  USING (status = 'active' OR user_id = auth.uid());

DROP POLICY IF EXISTS "coaches_update_own" ON public.coaches;
CREATE POLICY "coaches_update_own" ON public.coaches
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "credits_select_own" ON public.coaching_credits_ledger;
CREATE POLICY "credits_select_own" ON public.coaching_credits_ledger
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "links_own" ON public.coaching_coach_links;
CREATE POLICY "links_own" ON public.coaching_coach_links
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "bookings_own_or_coach" ON public.coaching_bookings;
CREATE POLICY "bookings_own_or_coach" ON public.coaching_bookings
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid()
    OR coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
  )
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "sessions_own_or_coach" ON public.coaching_sessions;
CREATE POLICY "sessions_own_or_coach" ON public.coaching_sessions
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid()
    OR coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid()
    OR coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "ratings_own" ON public.coaching_ratings;
CREATE POLICY "ratings_own" ON public.coaching_ratings
  FOR ALL TO authenticated
  USING (rater_user_id = auth.uid())
  WITH CHECK (rater_user_id = auth.uid());

-- Rename legacy demo code LG -> KE if present
UPDATE public.coaches
SET coach_code = 'KE-4827'
WHERE coach_code = 'LG-4827';

-- Seed demo coach code (ops can rotate)
INSERT INTO public.coaches (display_name, gender, short_bio, coach_code, specialties)
VALUES (
  'Coach KELIAA Démo',
  'unspecified',
  'Compte démo pour tests de liaison code coach.',
  'KE-4827',
  ARRAY['couple', 'communication']
)
ON CONFLICT (coach_code) DO NOTHING;
