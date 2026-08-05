-- Allow anonymous public feedback tickets (signup help) via service role preferred;
-- also permit INSERT for anon when user_id is null (belt-and-suspenders if service role fails).

ALTER TABLE public.user_feedback
  ADD COLUMN IF NOT EXISTS screenshot_url text;

DROP POLICY IF EXISTS "anon_insert_feedback" ON public.user_feedback;
CREATE POLICY "anon_insert_feedback"
  ON public.user_feedback
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "users_insert_own_feedback" ON public.user_feedback;
CREATE POLICY "users_insert_own_feedback"
  ON public.user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

INSERT INTO storage.buckets (id, name, public)
VALUES ('support-screenshots', 'support-screenshots', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_support_screenshots" ON storage.objects;
CREATE POLICY "public_read_support_screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support-screenshots');
