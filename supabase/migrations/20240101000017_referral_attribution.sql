-- Attribution & codes d'invitation (soft launch croissance)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by_code TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_uidx
  ON public.profiles (referral_code)
  WHERE referral_code IS NOT NULL;
