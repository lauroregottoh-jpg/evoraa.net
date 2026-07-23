-- Create custom types for ENUMs
CREATE TYPE photo_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE marital_status_enum AS ENUM ('single', 'divorced', 'widowed', 'annulled');
CREATE TYPE attendance_frequency_enum AS ENUM ('weekly', 'monthly', 'occasionally', 'rarely');
CREATE TYPE education_level_enum AS ENUM ('high_school', 'bachelors', 'masters', 'doctorate', 'other');

-- 1. EXTEND `profiles` TABLE
ALTER TABLE public.profiles 
  -- Personal Information
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS languages text[],
  ADD COLUMN IF NOT EXISTS profession text,
  ADD COLUMN IF NOT EXISTS education_level education_level_enum,
  
  -- Christian Life
  ADD COLUMN IF NOT EXISTS denomination text,
  ADD COLUMN IF NOT EXISTS church_attended text,
  ADD COLUMN IF NOT EXISTS attendance_frequency attendance_frequency_enum,
  ADD COLUMN IF NOT EXISTS conversion_year integer,
  ADD COLUMN IF NOT EXISTS faith_importance text,
  ADD COLUMN IF NOT EXISTS ministry_engagement text,
  ADD COLUMN IF NOT EXISTS testimony text,
  
  -- Relationship
  ADD COLUMN IF NOT EXISTS marital_status marital_status_enum,
  
  -- Personal Presentation (Arrays for easy tagging/filtering)
  ADD COLUMN IF NOT EXISTS interests text[],
  ADD COLUMN IF NOT EXISTS hobbies text[],
  ADD COLUMN IF NOT EXISTS passions text[],
  ADD COLUMN IF NOT EXISTS core_values text[],
  ADD COLUMN IF NOT EXISTS character_traits text[],
  
  -- Verification & Trust System
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS identity_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  
  -- Matching & Evolutivity (JSONB)
  ADD COLUMN IF NOT EXISTS psychometric_results jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS matching_indicators jsonb DEFAULT '{}'::jsonb,
  
  -- System & Config
  ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS completion_percentage integer DEFAULT 0,
  
  -- Audit & Traceability
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 2. CREATE `user_photos` TABLE (Moderation & Ordering)
CREATE TABLE IF NOT EXISTS public.user_photos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    photo_url text NOT NULL,
    is_primary boolean DEFAULT false,
    display_order integer DEFAULT 0,
    status photo_status_enum DEFAULT 'pending',
    rejection_reason text,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id),
    deleted_at timestamptz
);

-- Index for fast photo retrieval
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON public.user_photos(user_id);

-- Enable RLS on user_photos
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

-- Policies for user_photos
CREATE POLICY "Users can view approved photos of others"
    ON public.user_photos FOR SELECT
    USING (deleted_at IS NULL AND (status = 'approved' OR auth.uid() = user_id));

CREATE POLICY "Users can insert their own photos"
    ON public.user_photos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
    ON public.user_photos FOR UPDATE
    USING (deleted_at IS NULL AND auth.uid() = user_id);

CREATE POLICY "Users can soft delete their own photos"
    ON public.user_photos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (deleted_at IS NOT NULL);


-- 3. CREATE `user_preferences` TABLE (Fast Searching)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    age_min integer DEFAULT 18,
    age_max integer DEFAULT 99,
    max_distance integer,
    accepted_countries text[],
    important_criteria text[],
    vision_of_marriage text,
    desire_children text,
    life_project text,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id),
    deleted_at timestamptz
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences (Only owner can read/write)
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (deleted_at IS NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (deleted_at IS NULL AND auth.uid() = user_id);


-- 4. CREATE `user_gamification` TABLE (Badges & Trust)
CREATE TABLE IF NOT EXISTS public.user_gamification (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    trust_level integer DEFAULT 0,
    badges text[] DEFAULT '{}',
    rewards jsonb DEFAULT '{}'::jsonb,
    profile_quality_score integer DEFAULT 0,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id),
    deleted_at timestamptz
);

-- Enable RLS on user_gamification
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Policies for user_gamification
CREATE POLICY "Users can view gamification stats"
    ON public.user_gamification FOR SELECT
    USING (deleted_at IS NULL); -- Publicly viewable for badges display

CREATE POLICY "Users cannot directly update gamification"
    ON public.user_gamification FOR ALL
    USING (false); -- Only system/triggers/functions can modify this

-- INDEXES for Search & Matching Optimization
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_marital_status ON public.profiles(marital_status);
CREATE INDEX IF NOT EXISTS idx_profiles_denomination ON public.profiles(denomination);
CREATE INDEX IF NOT EXISTS idx_profiles_birth_date ON public.profiles(birth_date);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;

-- Function to handle timestamp updates on new tables
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_photos_modtime
    BEFORE UPDATE ON public.user_photos
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_preferences_modtime
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_gamification_modtime
    BEFORE UPDATE ON public.user_gamification
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
