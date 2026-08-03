-- Security hardening (audit Aug 2026)
-- Apply in Supabase SQL editor / migration runner after review.

-- ---------------------------------------------------------------------------
-- 1) Lock role helpers (search_path) + prevent profile privilege escalation
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
      AND deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'moderator')
      AND deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Non-moderators cannot change privileged columns (PostgREST-safe).
  IF NOT public.is_moderator() THEN
    NEW.role := OLD.role;
    NEW.moderation_status := OLD.moderation_status;
    NEW.is_verified := OLD.is_verified;
    NEW.identity_verified := OLD.identity_verified;
    NEW.email_verified := OLD.email_verified;
    NEW.phone_verified := OLD.phone_verified;
    NEW.verified_at := OLD.verified_at;
    NEW.trust_score := OLD.trust_score;
    NEW.deleted_at := OLD.deleted_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2) Close free-Alliance bypass: revoke client RPC; service_role only
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.activate_pending_payment(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.activate_pending_payment(uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.activate_pending_payment(uuid, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.activate_pending_payment(uuid, text) TO service_role;

-- Users may only create pending/incomplete commercial rows (webhooks/admin activate).
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own pending subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND coalesce(status, 'pending') IN ('pending', 'incomplete')
  );

DROP POLICY IF EXISTS "Users can insert payments for own subscriptions" ON public.payments;
CREATE POLICY "Users can insert pending payments for own subscriptions"
  ON public.payments FOR INSERT
  WITH CHECK (
    coalesce(status, 'pending') = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = subscription_id
        AND subscriptions.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 3) Photos: owners cannot self-approve / change moderation status
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_photo_self_moderation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_moderator() THEN
    NEW.status := OLD.status;
    NEW.rejection_reason := OLD.rejection_reason;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_photo_self_moderation ON public.user_photos;
CREATE TRIGGER trg_prevent_photo_self_moderation
  BEFORE UPDATE ON public.user_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_photo_self_moderation();

DROP POLICY IF EXISTS "Users can update their own photos" ON public.user_photos;
CREATE POLICY "Users can update their own photos"
  ON public.user_photos FOR UPDATE
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_photos.profile_id
        AND profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_photos.profile_id
        AND profiles.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 4) Messages: allow read receipts; block content/sender tampering
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_message_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.sender_id IS DISTINCT FROM OLD.sender_id THEN
    RAISE EXCEPTION 'Cannot change message sender';
  END IF;
  IF NEW.message IS DISTINCT FROM OLD.message AND OLD.sender_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Only sender can edit message body';
  END IF;
  IF NEW.conversation_id IS DISTINCT FROM OLD.conversation_id THEN
    RAISE EXCEPTION 'Cannot move message across conversations';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_message_tampering ON public.messages;
CREATE TRIGGER trg_prevent_message_tampering
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_message_tampering();

-- ---------------------------------------------------------------------------
-- 5) Usage counters: monotonic counts (no client reset to bypass quotas)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_usage_counter_decrease()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.count < OLD.count THEN
    NEW.count := OLD.count;
  END IF;
  IF TG_OP = 'INSERT' AND NEW.count < 0 THEN
    NEW.count := 0;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_usage_counter_decrease ON public.usage_counters;
CREATE TRIGGER trg_prevent_usage_counter_decrease
  BEFORE INSERT OR UPDATE ON public.usage_counters
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_usage_counter_decrease();

-- ---------------------------------------------------------------------------
-- 6) Church recommendations: users cannot self-approve
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_church_reco_self_approve()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_moderator() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := coalesce(NEW.status, 'pending');
      IF NEW.status NOT IN ('pending', 'draft', 'submitted') THEN
        NEW.status := 'pending';
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      IF NEW.status IS DISTINCT FROM OLD.status
         AND NEW.status NOT IN ('pending', 'draft', 'submitted') THEN
        NEW.status := OLD.status;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_church_reco_self_approve ON public.church_recommendations;
CREATE TRIGGER trg_prevent_church_reco_self_approve
  BEFORE INSERT OR UPDATE ON public.church_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_church_reco_self_approve();

DROP POLICY IF EXISTS "Users manage own church recommendations" ON public.church_recommendations;
CREATE POLICY "Users manage own church recommendations"
  ON public.church_recommendations FOR ALL
  USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );
