-- P0 launch hardening: preferences RLS fix + Realtime messages

-- Fix user_preferences RLS (user_id is profiles.id, not auth.uid())
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;

CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (
    deleted_at IS NULL AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_preferences.user_id
        AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_preferences.user_id
        AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (
    deleted_at IS NULL AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_preferences.user_id
        AND profiles.user_id = auth.uid()
    )
  );

-- Enable Realtime for messaging (idempotent)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_object THEN NULL;
  END;
END $$;
