-- Enable realtime for report_cards so admins see new cards instantly
ALTER TABLE public.report_cards REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.report_cards;

-- Enable realtime for ratings so admins see new ratings instantly
ALTER TABLE public.ratings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ratings;

-- Allow any signed-in user to view all ratings (feedback wall)
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.ratings;
CREATE POLICY "Authenticated users can view all ratings"
  ON public.ratings FOR SELECT
  TO authenticated
  USING (true);