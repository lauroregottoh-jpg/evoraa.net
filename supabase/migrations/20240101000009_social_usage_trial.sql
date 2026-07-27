-- Profile views, favorites, usage counters, first-month trial boost

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  viewer_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (viewer_profile_id, viewed_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_views_viewed
  ON public.profile_views (viewed_profile_id, viewed_at DESC);

CREATE TABLE IF NOT EXISTS public.profile_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (owner_profile_id, target_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_favorites_target
  ON public.profile_favorites (target_profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.usage_counters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  counter_key TEXT NOT NULL,
  period_key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, counter_key, period_key)
);

CREATE INDEX IF NOT EXISTS idx_usage_counters_lookup
  ON public.usage_counters (user_id, counter_key, period_key);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- profile_views
CREATE POLICY "Users can record profile views"
  ON public.profile_views FOR INSERT
  WITH CHECK (
    viewer_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    AND viewer_profile_id != viewed_profile_id
  );

CREATE POLICY "Users can see who viewed their profile"
  ON public.profile_views FOR SELECT
  USING (
    viewed_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR viewer_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- profile_favorites
CREATE POLICY "Users manage own favorites"
  ON public.profile_favorites FOR ALL
  USING (owner_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (owner_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users see favorites on their profile"
  ON public.profile_favorites FOR SELECT
  USING (
    target_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR owner_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- usage_counters
CREATE POLICY "Users read own usage counters"
  ON public.usage_counters FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users upsert own usage counters"
  ON public.usage_counters FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own usage counters"
  ON public.usage_counters FOR UPDATE
  USING (user_id = auth.uid());
