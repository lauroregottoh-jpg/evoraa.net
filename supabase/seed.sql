-- ==========================================
-- EVORAA V1 - SEED DATA FOR LOCAL & DEMO
-- ==========================================

-- 1. Insert well-known auth.users (if running inside complete Supabase local environment)
-- Note: When running `supabase db reset`, auth.users can be seeded safely.
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@evoraa.net', '$2a$10$wE9q.XG.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Admin","last_name":"Evoraa"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'laure.regottoh@evoraa.net', '$2a$10$wE9q.XG.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Laure","last_name":"Regottoh"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'alexandre.dumas@evoraa.net', '$2a$10$wE9q.XG.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Alexandre","last_name":"Dumas"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'thomas.bernard@evoraa.net', '$2a$10$wE9q.XG.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Thomas","last_name":"Bernard"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'suspect.spam@evoraa.net', '$2a$10$wE9q.XG.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G.4G', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Suspect","last_name":"Spam"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 2. Update/Upsert Profiles with Roles, Completion & Christian details
INSERT INTO public.profiles (
  id, user_id, first_name, last_name, gender, birth_date, country, city, 
  denomination, profession, education_level, marital_status, testimony, 
  is_verified, identity_verified, email_verified, completion_percentage, role, moderation_status,
  onboarding_status, attendance_frequency, matching_indicators
)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 
    'Équipe', 'Modération EVA', 'M', '1988-05-15', 'France', 'Paris', 
    'Protestant Évangélique', 'Responsable Éthique', 'masters', 'single', 
    'Veiller sur la paix et la sincérité du sanctuaire Evoraa.', 
    true, true, true, 100, 'admin', 'approved',
    'active', 'weekly', '{}'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 
    'Laure', 'Regottoh', 'F', '1996-03-21', 'France', 'Lyon', 
    'Protestant Évangélique', 'Architecte d''intérieur', 'bachelors', 'single', 
    'J''ai découvert une foi personnelle durant mes études universitaires. Aujourd''hui, elle est le pilier d''amour et de paix qui guide chacun de mes choix personnels et professionnels.', 
    true, true, true, 100, 'member', 'approved',
    'active', 'weekly',
    '{"spiritual_practice":"regulier","marriage_vision":"Un engagement sacré fondé sur la prière commune et le soutien mutuel","family_project":"Désir d accueillir des enfants et un foyer hospitalier","communication_style":"dialogue_doux","age_declared":30}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 
    'Alexandre', 'Dumas', 'M', '1993-08-14', 'France', 'Lyon', 
    'Protestant Évangélique', 'Ingénieur Environnement', 'masters', 'single', 
    'Passionné par la création de Dieu et l''engagement associatif, je cherche à construire un foyer fondé sur l''hospitalité, la prière et la joie quotidienne.', 
    true, true, true, 94, 'member', 'approved',
    'active', 'weekly',
    '{"spiritual_practice":"regulier","marriage_vision":"Un engagement sacré, partenariat fondé sur la prière commune","family_project":"Accueillir des enfants et bâtir un foyer hospitalier","communication_style":"dialogue_doux","age_declared":32}'::jsonb
  ),
  (
    '44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', 
    'Thomas', 'Bernard', 'M', '1995-11-02', 'France', 'Grenoble', 
    'Baptiste', 'Enseignant', 'masters', 'single', 
    'L''enseignement et le service dans mon église locale sont au cœur de ma vie spirituelle. J''aspire à rencontrer une partenaire de prière authentique.', 
    true, true, true, 89, 'member', 'approved',
    'active', 'monthly',
    '{"spiritual_practice":"cheminement","marriage_vision":"Alliance de soutien et de prière authentique","family_project":"Foyer éducatif et serviable","communication_style":"ecoute_active","age_declared":30}'::jsonb
  ),
  (
    '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000005', 
    'Marc', 'Inconnu', 'M', '1991-01-01', 'France', 'Marseille', 
    'Autre', 'Consultant', 'bachelors', 'single', 
    'Recherche contact rapide whatsapp pour opportunité.', 
    false, false, true, 45, 'member', 'pending',
    'step2_profile', 'rarely', '{}'::jsonb
  )
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  testimony = EXCLUDED.testimony,
  completion_percentage = EXCLUDED.completion_percentage,
  moderation_status = EXCLUDED.moderation_status,
  onboarding_status = EXCLUDED.onboarding_status,
  attendance_frequency = EXCLUDED.attendance_frequency,
  matching_indicators = EXCLUDED.matching_indicators;

-- 3. Insert User Photos (Pending review & Approved)
INSERT INTO public.user_photos (id, user_id, photo_url, is_primary, status)
VALUES 
  ('aa111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop', true, 'approved'),
  ('bb222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop', true, 'approved'),
  ('cc333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop', true, 'approved'),
  ('dd444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop', true, 'pending')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Demo Safety Reports for Admin Queue
INSERT INTO public.reports (id, reporter_id, reported_user_id, reason, status)
VALUES 
  (
    'ff111111-1111-1111-1111-111111111111', 
    '00000000-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000005', 
    'Demande immédiate de numéro WhatsApp et propos familiers contraires à la Charte d''Evoraa.', 
    'pending'
  )
ON CONFLICT (id) DO NOTHING;
