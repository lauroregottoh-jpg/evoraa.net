-- Conversations: members of a match can create the conversation row
CREATE POLICY "Users can create conversations for their matches"
  ON public.conversations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE matches.id = match_id
        AND (matches.user_one = auth.uid() OR matches.user_two = auth.uid())
    )
  );

-- Messages: mark as read
CREATE POLICY "Users can update messages in their conversations"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      JOIN public.matches ON conversations.match_id = matches.id
      WHERE conversations.id = conversation_id
        AND (matches.user_one = auth.uid() OR matches.user_two = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      JOIN public.matches ON conversations.match_id = matches.id
      WHERE conversations.id = conversation_id
        AND (matches.user_one = auth.uid() OR matches.user_two = auth.uid())
    )
  );
