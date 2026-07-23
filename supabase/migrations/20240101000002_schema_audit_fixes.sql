-- 1. Create Enums for precise status tracking
CREATE TYPE onboarding_status_enum AS ENUM ('step1_account', 'step2_profile', 'step3_tests', 'pending_review', 'active', 'banned');
CREATE TYPE moderation_status_enum AS ENUM ('pending', 'approved', 'rejected');

-- 2. Update `profiles` table with new statuses
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS onboarding_status onboarding_status_enum DEFAULT 'step1_account',
  ADD COLUMN IF NOT EXISTS moderation_status moderation_status_enum DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS moderation_rejection_reason TEXT;

-- 3. Drop duplicate `profile_photos` table
DROP TABLE IF EXISTS public.profile_photos CASCADE;

-- 4. Fix `user_photos` table
-- Rename the confusing user_id column to profile_id
ALTER TABLE public.user_photos RENAME COLUMN user_id TO profile_id;

-- Rename the associated index
ALTER INDEX IF EXISTS idx_user_photos_user_id RENAME TO idx_user_photos_profile_id;

-- 5. Fix broken RLS policies on `user_photos`
-- The previous policies checked `auth.uid() = user_id`, but `user_id` was actually `profiles(id)` which is a UUID, not auth.uid().
-- We must drop the old policies first.
DROP POLICY IF EXISTS "Users can view approved photos of others" ON public.user_photos;
DROP POLICY IF EXISTS "Users can insert their own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can soft delete their own photos" ON public.user_photos;

-- Recreate correct policies using `profiles.user_id`
CREATE POLICY "Users can view approved photos of others"
    ON public.user_photos FOR SELECT
    USING (deleted_at IS NULL AND (status = 'approved' OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_photos.profile_id AND profiles.user_id = auth.uid()
    )));

CREATE POLICY "Users can insert their own photos"
    ON public.user_photos FOR INSERT
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_photos.profile_id AND profiles.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own photos"
    ON public.user_photos FOR UPDATE
    USING (deleted_at IS NULL AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_photos.profile_id AND profiles.user_id = auth.uid()
    ));

CREATE POLICY "Users can soft delete their own photos"
    ON public.user_photos FOR UPDATE
    USING (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_photos.profile_id AND profiles.user_id = auth.uid()
    ))
    WITH CHECK (deleted_at IS NOT NULL);
