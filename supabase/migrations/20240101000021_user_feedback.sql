-- User feedback: signup issues, complaints, suggestions (admin inbox).

CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text,
  email text,
  category text NOT NULL DEFAULT 'suggestion',
  message text NOT NULL,
  page_path text,
  status text NOT NULL DEFAULT 'new',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_feedback_status_idx
  ON public.user_feedback (status, created_at DESC);

CREATE INDEX IF NOT EXISTS user_feedback_category_idx
  ON public.user_feedback (category, created_at DESC);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_insert_own_feedback" ON public.user_feedback;
CREATE POLICY "users_insert_own_feedback"
  ON public.user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "users_read_own_feedback" ON public.user_feedback;
CREATE POLICY "users_read_own_feedback"
  ON public.user_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "admins_update_feedback" ON public.user_feedback;
CREATE POLICY "admins_update_feedback"
  ON public.user_feedback
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
