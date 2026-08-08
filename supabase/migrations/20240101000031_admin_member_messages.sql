-- Messagerie ops → membres (privé / général / rappels) + templates

CREATE TABLE IF NOT EXISTS public.admin_message_templates (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'private'
    CHECK (scope IN ('private', 'broadcast', 'reminder')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_member_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope TEXT NOT NULL
    CHECK (scope IN ('private', 'broadcast', 'reminder')),
  template_id TEXT REFERENCES public.admin_message_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_member_message_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.admin_member_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES public.notifications(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_member_messages_created
  ON public.admin_member_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_member_msg_recipients_user
  ON public.admin_member_message_recipients(user_id, created_at DESC);

ALTER TABLE public.admin_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_member_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_member_message_recipients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Moderators read admin message templates" ON public.admin_message_templates;
CREATE POLICY "Moderators read admin message templates"
  ON public.admin_message_templates FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Moderators read admin member messages" ON public.admin_member_messages;
CREATE POLICY "Moderators read admin member messages"
  ON public.admin_member_messages FOR SELECT
  USING (public.is_moderator());

DROP POLICY IF EXISTS "Users read own admin message receipts" ON public.admin_member_message_recipients;
CREATE POLICY "Users read own admin message receipts"
  ON public.admin_member_message_recipients FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Moderators read admin message receipts" ON public.admin_member_message_recipients;
CREATE POLICY "Moderators read admin message receipts"
  ON public.admin_member_message_recipients FOR SELECT
  USING (public.is_moderator());

INSERT INTO public.admin_message_templates (id, label, scope, title, body, sort_order)
VALUES
  (
    'welcome_private',
    'Bienvenue personnalisé',
    'private',
    'Bienvenue sur KELIAA',
    'Bonjour {{prenom}},\n\nNous sommes heureux de vous accueillir. Complétez votre profil et les questionnaires pour activer le Matching.\n\nL’équipe KELIAA',
    10
  ),
  (
    'complete_profile',
    'Compléter le profil',
    'private',
    'Finalisez votre profil',
    'Bonjour {{prenom}},\n\nPour avancer sur KELIAA, merci de finaliser votre profil (photo, infos essentielles, questionnaires).\n\nL’équipe KELIAA',
    20
  ),
  (
    'need_photo',
    'Photo requise',
    'private',
    'Ajoutez votre photo',
    'Bonjour {{prenom}},\n\nUne photo claire de vous est indispensable pour valider votre profil et apparaître auprès des membres.\n\nL’équipe KELIAA',
    30
  ),
  (
    'need_tests',
    'Rappel questionnaires',
    'reminder',
    'Vos questionnaires vous attendent',
    'Bonjour {{prenom}},\n\nLes 5 questionnaires de compatibilité sont la clé du Matching KELIAA™. Prenez quelques minutes pour les compléter.\n\nL’équipe KELIAA',
    40
  ),
  (
    'alliance_invite',
    'Invitation Alliance',
    'reminder',
    'Passez Alliance pour aller plus loin',
    'Bonjour {{prenom}},\n\nAvec Alliance : Rapport Personnalisé, Coffre Premium, Matching enrichi et Programme Fidélité.\n\nDécouvrez l’offre sur /premium.\n\nL’équipe KELIAA',
    50
  ),
  (
    'renewal_reminder',
    'Rappel renouvellement',
    'reminder',
    'Votre Alliance arrive à échéance',
    'Bonjour {{prenom}},\n\nVotre abonnement Alliance arrive bientôt à échéance. Renouvelez pour conserver vos avantages et votre progression fidélité.\n\nL’équipe KELIAA',
    60
  ),
  (
    'broadcast_community',
    'Annonce Communauté',
    'broadcast',
    'Nouveauté : Communauté KELIAA',
    'Bonjour {{prenom}},\n\nLa Communauté KELIAA est ouverte : découvrez les membres, likez avec intention. Un like mutuel débloque la conversation.\n\nL’équipe KELIAA',
    70
  ),
  (
    'broadcast_general',
    'Message général',
    'broadcast',
    'Message de l’équipe KELIAA',
    'Bonjour {{prenom}},\n\n{{message}}\n\nL’équipe KELIAA',
    80
  ),
  (
    'approved',
    'Profil validé',
    'private',
    'Votre profil est validé',
    'Bonjour {{prenom}},\n\nBonne nouvelle : votre profil a été validé. Bienvenue pleinement dans la communauté KELIAA.\n\nL’équipe KELIAA',
    90
  )
ON CONFLICT (id) DO NOTHING;
