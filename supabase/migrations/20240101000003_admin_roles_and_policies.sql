-- ==========================================
-- EVORAA V1 - Administration, Roles & RLS
-- ==========================================

-- 1. Create Role Enum & Add to Profiles
CREATE TYPE app_role_enum AS ENUM ('admin', 'moderator', 'member');

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role app_role_enum DEFAULT 'member';

-- Index for fast role checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Helper Functions for Role Checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND (role = 'admin' OR role = 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view platform settings (e.g. for maintenance check or blur default)
CREATE POLICY "Platform settings viewable by authenticated users"
  ON public.platform_settings FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can update platform settings
CREATE POLICY "Admins can update platform settings"
  ON public.platform_settings FOR ALL
  USING (public.is_admin());

-- Insert initial default platform settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('maintenance_mode', 'false'::jsonb, 'Activer ou désactiver l''accès global au sanctuaire'),
  ('min_compatibility_threshold', '85'::jsonb, 'Score minimal de résonance pour proposer un profil dans le sanctuaire'),
  ('default_photo_blur', 'true'::jsonb, 'Flouter par défaut toutes les photos (Respect V1)')
ON CONFLICT (key) DO NOTHING;

-- 4. Full RLS Policies for Moderation Team (Admin & Moderator)

-- Profiles: Admins/Moderators can view and update all profiles (for verification, suspension, etc.)
CREATE POLICY "Moderators can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Moderators can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_moderator());

-- Photos: Moderators can view all photos (including pending) and update their status (approve/reject)
CREATE POLICY "Moderators can view all photos"
  ON public.user_photos FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Moderators can update all photos"
  ON public.user_photos FOR UPDATE
  USING (public.is_moderator());

-- Reports: Moderators can view and update all reports
CREATE POLICY "Moderators can view all reports"
  ON public.reports FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Moderators can update all reports"
  ON public.reports FOR UPDATE
  USING (public.is_moderator());

-- Matches & Conversations: Moderators can audit if required for safety resolution
CREATE POLICY "Moderators can audit matches"
  ON public.matches FOR SELECT
  USING (public.is_moderator());

CREATE POLICY "Moderators can audit messages"
  ON public.messages FOR SELECT
  USING (public.is_moderator());
