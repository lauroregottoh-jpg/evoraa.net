-- Coaching ops: transcript + notes admin for session review
ALTER TABLE public.coaching_sessions
  ADD COLUMN IF NOT EXISTS transcript_text text,
  ADD COLUMN IF NOT EXISTS transcript_status text
    DEFAULT 'none'
    CHECK (transcript_status IN ('none', 'pending', 'ready', 'failed')),
  ADD COLUMN IF NOT EXISTS admin_notes text;

COMMENT ON COLUMN public.coaching_sessions.transcript_text IS
  'Transcription / synthèse de séance pour relecture ops (consentement requis).';
