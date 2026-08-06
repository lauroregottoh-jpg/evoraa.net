-- Le Coffre Premium : ressources débloquées au choix par abonné Alliance

CREATE TABLE IF NOT EXISTS public.coffre_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS coffre_unlocks_user_id_idx
  ON public.coffre_unlocks (user_id);

ALTER TABLE public.coffre_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own coffre unlocks" ON public.coffre_unlocks;
CREATE POLICY "Users can view own coffre unlocks"
  ON public.coffre_unlocks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own coffre unlocks" ON public.coffre_unlocks;
CREATE POLICY "Users can insert own coffre unlocks"
  ON public.coffre_unlocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own coffre unlocks" ON public.coffre_unlocks;
CREATE POLICY "Users can delete own coffre unlocks"
  ON public.coffre_unlocks FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Moderators can view all coffre unlocks" ON public.coffre_unlocks;
CREATE POLICY "Moderators can view all coffre unlocks"
  ON public.coffre_unlocks FOR SELECT
  USING (public.is_moderator());
