-- Allow members to create/update their own match suggestions
CREATE POLICY "Users can insert matches as user_one"
  ON public.matches FOR INSERT
  WITH CHECK (auth.uid() = user_one);

CREATE POLICY "Users can update their matches"
  ON public.matches FOR UPDATE
  USING (auth.uid() = user_one OR auth.uid() = user_two)
  WITH CHECK (auth.uid() = user_one OR auth.uid() = user_two);
