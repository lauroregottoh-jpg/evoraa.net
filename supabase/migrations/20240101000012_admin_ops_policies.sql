-- Admin backoffice: audit conversations + billing visibility + settings

DROP POLICY IF EXISTS "Moderators can audit conversations" ON public.conversations;
CREATE POLICY "Moderators can audit conversations"
  ON public.conversations FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Moderators can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Moderators can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Moderators can view all payments" ON public.payments;
CREATE POLICY "Moderators can view all payments"
  ON public.payments FOR SELECT
  USING (public.is_moderator());

INSERT INTO public.platform_settings (key, value, description)
VALUES
  ('require_charter', 'true'::jsonb, 'Exiger la signature de la charte avant accès complet'),
  ('soft_launch_notes', '"Invitez H+F, approuvez les photos vite, testez Alliance en démo."'::jsonb, 'Notes ops soft launch')
ON CONFLICT (key) DO NOTHING;
