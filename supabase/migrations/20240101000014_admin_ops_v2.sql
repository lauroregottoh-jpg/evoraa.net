-- Admin ops V2: foi / pasteur, confiance, sanctions, recommandations Église

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pastor_name TEXT,
  ADD COLUMN IF NOT EXISTS pastor_contact TEXT,
  ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS warning_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sanction_status TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS sanction_until TIMESTAMPTZ;

UPDATE public.profiles
SET trust_score = 50
WHERE trust_score IS NULL;

UPDATE public.profiles
SET warning_count = 0
WHERE warning_count IS NULL;

UPDATE public.profiles
SET sanction_status = 'none'
WHERE sanction_status IS NULL;

CREATE TABLE IF NOT EXISTS public.church_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommender_name TEXT NOT NULL,
  recommender_role TEXT,
  church_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

CREATE INDEX IF NOT EXISTS idx_church_reco_profile ON public.church_recommendations(profile_id);
CREATE INDEX IF NOT EXISTS idx_church_reco_status ON public.church_recommendations(status);

CREATE TABLE IF NOT EXISTS public.moderation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_id UUID,
  kind TEXT NOT NULL,
  reason TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mod_events_profile ON public.moderation_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_mod_events_kind ON public.moderation_events(kind);

ALTER TABLE public.church_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own church recommendations" ON public.church_recommendations;
CREATE POLICY "Users manage own church recommendations"
  ON public.church_recommendations FOR ALL
  USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Moderators manage church recommendations" ON public.church_recommendations;
CREATE POLICY "Moderators manage church recommendations"
  ON public.church_recommendations FOR ALL
  USING (public.is_moderator())
  WITH CHECK (public.is_moderator());

DROP POLICY IF EXISTS "Moderators manage moderation events" ON public.moderation_events;
CREATE POLICY "Moderators manage moderation events"
  ON public.moderation_events FOR ALL
  USING (public.is_moderator())
  WITH CHECK (public.is_moderator());

INSERT INTO public.platform_settings (key, value, description)
VALUES
  (
    'photo_rules',
    '{
      "enabled": true,
      "minBytes": 15000,
      "maxBytes": 8388608,
      "rejectNamePatterns": ["nude","nsfw","xxx","sexy","lingerie"],
      "allowedMimeHints": ["image/jpeg","image/png","image/webp"],
      "autoApproveClean": false,
      "msgApprove": "Photo conforme — visage clair, tenue digne.",
      "msgReject": "Photo refusée : non conforme aux règles KELIAA (tenue, cadrage ou contenu).",
      "msgRetry": "Merci d''envoyer une nouvelle photo : visage visible, fond simple, tenue digne."
    }'::jsonb,
    'Règles de validation automatique des photos'
  ),
  (
    'sanction_rules',
    '{
      "enabled": true,
      "warn1Label": "Avertissement 1",
      "warn2Label": "Avertissement 2",
      "suspendDays": 7,
      "autoBlockAfterWarns": 3,
      "bannedWords": ["putain","salope","sexe gratuit","envoie nudes","nudes","escort"],
      "trustPenaltyWarn": 10,
      "trustBonusVerify": 15,
      "trustBonusReco": 20
    }'::jsonb,
    'Processus signalements / avertissements / suspensions'
  ),
  (
    'eva_config',
    '{
      "systemPrompt": "Tu es EVA, conseillère spirituelle KELIAA. Ton style est doux, biblique, pratique, sans jugement. Tu aides au discernement amoureux chrétien.",
      "tone": "doux et biblique",
      "forbiddenTopics": ["politique partisane","investissement crypto","contenu sexuel explicite"],
      "knowledgeNotes": "Prioriser prière, pureté, famille, communication, finances comme intendance.",
      "analyzeConversations": false,
      "dailyReportEnabled": true
    }'::jsonb,
    'Consignes et base de connaissances Coach EVA'
  ),
  (
    'youtube_config',
    '{
      "enabled": false,
      "channelId": "",
      "apiKeyConfigured": false,
      "defaultPlaylistId": ""
    }'::jsonb,
    'Intégration YouTube Académie'
  ),
  (
    'integrations',
    '{
      "stripeNotes": "Stripe non branché en V1 — CinetPay / démo actifs.",
      "cinetpay": true,
      "resend": true,
      "openaiNotes": "Vision photo / LLM EVA = option V2 (clé API).",
      "webhookUrl": ""
    }'::jsonb,
    'Connecteurs externes (notes + flags)'
  )
ON CONFLICT (key) DO NOTHING;
