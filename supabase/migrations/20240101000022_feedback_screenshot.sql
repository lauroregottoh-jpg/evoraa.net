-- Feedback signup help: optional screenshot URL + public bucket for anonymous uploads (via service role).

ALTER TABLE public.user_feedback
  ADD COLUMN IF NOT EXISTS screenshot_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('support-screenshots', 'support-screenshots', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_support_screenshots" ON storage.objects;
CREATE POLICY "public_read_support_screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support-screenshots');
