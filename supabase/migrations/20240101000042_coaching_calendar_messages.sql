-- Coaching calendar, canned messages, anonymity preference, session report stub

CREATE TABLE IF NOT EXISTS public.coach_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  weekday smallint CHECK (weekday BETWEEN 0 AND 6),
  starts_at timestamptz,
  ends_at timestamptz,
  start_time time,
  end_time time,
  timezone text NOT NULL DEFAULT 'Africa/Abidjan',
  is_recurring boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_availability_coach
  ON public.coach_availability (coach_id);

CREATE TABLE IF NOT EXISTS public.coaching_canned_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.coaching_bookings(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.coaching_sessions(id) ON DELETE SET NULL,
  from_role text NOT NULL CHECK (from_role IN ('client', 'coach')),
  from_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaching_canned_booking
  ON public.coaching_canned_messages (booking_id, created_at DESC);

ALTER TABLE public.coaching_bookings
  ADD COLUMN IF NOT EXISTS display_anonymous boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS split_plan jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS brief_subject text,
  ADD COLUMN IF NOT EXISTS brief_message text,
  ADD COLUMN IF NOT EXISTS brief_objectives jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.coaching_sessions
  ADD COLUMN IF NOT EXISTS report_json jsonb,
  ADD COLUMN IF NOT EXISTS end_questionnaire_done_client boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS end_questionnaire_done_coach boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_cleared_client boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_cleared_coach boolean NOT NULL DEFAULT false;

ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_canned_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avail_coach_all" ON public.coach_availability;
CREATE POLICY "avail_coach_all" ON public.coach_availability
  FOR ALL TO authenticated
  USING (
    coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
  )
  WITH CHECK (
    coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "avail_select_authenticated" ON public.coach_availability;
CREATE POLICY "avail_select_authenticated" ON public.coach_availability
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "canned_participants" ON public.coaching_canned_messages;
CREATE POLICY "canned_participants" ON public.coaching_canned_messages
  FOR ALL TO authenticated
  USING (
    from_user_id = auth.uid()
    OR booking_id IN (
      SELECT id FROM public.coaching_bookings
      WHERE user_id = auth.uid()
         OR coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
    )
  )
  WITH CHECK (from_user_id = auth.uid());
