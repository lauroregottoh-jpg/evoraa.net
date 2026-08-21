-- Vocaux messagerie : fichier privé + retranscription ops (pas de visio).
-- Le corps `message` reste NOT NULL (aperçu liste : « Vocal · 0:28 »).

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'text'
    CHECK (kind IN ('text', 'voice')),
  ADD COLUMN IF NOT EXISTS audio_path text,
  ADD COLUMN IF NOT EXISTS audio_duration_ms integer,
  ADD COLUMN IF NOT EXISTS audio_mime text,
  ADD COLUMN IF NOT EXISTS transcript_text text,
  ADD COLUMN IF NOT EXISTS transcript_status text NOT NULL DEFAULT 'none'
    CHECK (transcript_status IN ('none', 'pending', 'ready', 'failed'));

COMMENT ON COLUMN public.messages.kind IS
  'text | voice — vocaux Alliance stockés hors du fil public.';
COMMENT ON COLUMN public.messages.transcript_text IS
  'Retranscription ops uniquement (modération). Non affichée au destinataire.';
COMMENT ON COLUMN public.messages.audio_path IS
  'Chemin bucket privé voice-notes : {conversation_id}/{message_id}.ext';

CREATE INDEX IF NOT EXISTS messages_kind_created_idx
  ON public.messages (kind, created_at DESC)
  WHERE kind = 'voice';

INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-notes', 'voice-notes', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Lecture : participants de la conversation (dossier = conversation_id).
DROP POLICY IF EXISTS "voice_notes_participants_select" ON storage.objects;
CREATE POLICY "voice_notes_participants_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'voice-notes'
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      JOIN public.matches m ON m.id = c.match_id
      WHERE c.id::text = (storage.foldername(name))[1]
        AND (m.user_one = auth.uid() OR m.user_two = auth.uid())
    )
  );

-- Upload / delete : service_role uniquement (actions serveur).
DROP POLICY IF EXISTS "voice_notes_no_client_insert" ON storage.objects;
DROP POLICY IF EXISTS "voice_notes_no_client_update" ON storage.objects;
DROP POLICY IF EXISTS "voice_notes_no_client_delete" ON storage.objects;
