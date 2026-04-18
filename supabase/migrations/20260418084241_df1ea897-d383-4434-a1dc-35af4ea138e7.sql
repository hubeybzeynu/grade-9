DROP POLICY IF EXISTS "Anyone can submit a rating" ON public.ratings;
CREATE POLICY "Authenticated users can submit ratings"
  ON public.ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);