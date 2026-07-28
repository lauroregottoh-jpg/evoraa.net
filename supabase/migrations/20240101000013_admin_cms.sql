-- CMS admin: textes app, pubs, auto-modération, overrides académie

INSERT INTO public.platform_settings (key, value, description)
VALUES
  (
    'app_texts',
    '{
      "banner_photo_title": "Votre profil sans photo passe inaperçu",
      "banner_photo_body": "Ajoutez une photo pour apparaître dans les suggestions.",
      "banner_alliance_title": "Passez Alliance",
      "banner_alliance_body": "Plus de conversations, visiteurs et favoris.",
      "home_greeting_prefix": "Bonjour",
      "selection_title": "La sélection KELIAA",
      "selection_subtitle": "Des profils choisis pour vous"
    }'::jsonb,
    'Textes éditables de l''application (bannières, titres)'
  ),
  (
    'ads',
    '[]'::jsonb,
    'Publicités / bannières sponsorisées (slots dashboard, discover)'
  ),
  (
    'auto_moderation',
    '{
      "enabled": false,
      "minCompletion": 70,
      "requirePhoto": true,
      "requireVerifiedEmail": false,
      "autoApprovePhotosIfPrimary": false
    }'::jsonb,
    'Règles d''auto-acceptation des profils (discernement automatique)'
  ),
  (
    'academy_overrides',
    '{}'::jsonb,
    'Surcharges éditoriales Académie (titres, sous-titres, vidéos, exercices)'
  )
ON CONFLICT (key) DO NOTHING;

DROP POLICY IF EXISTS "Moderators can view profile views" ON public.profile_views;
CREATE POLICY "Moderators can view profile views"
  ON public.profile_views FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Moderators can view favorites" ON public.profile_favorites;
CREATE POLICY "Moderators can view favorites"
  ON public.profile_favorites FOR SELECT
  USING (public.is_moderator());
