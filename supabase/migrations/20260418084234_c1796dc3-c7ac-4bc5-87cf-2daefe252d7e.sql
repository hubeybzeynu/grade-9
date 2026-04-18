-- Students directory (read-only from app; populated by admin)
CREATE TABLE IF NOT EXISTS public.students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students are publicly readable"
  ON public.students FOR SELECT
  USING (true);

-- Report cards
CREATE TABLE IF NOT EXISTS public.report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT,
  sex TEXT,
  age INTEGER,
  kebele TEXT,
  house_no TEXT,
  teacher_name TEXT,
  school_year TEXT,
  grade TEXT,
  subjects JSONB NOT NULL DEFAULT '{}'::jsonb,
  conduct JSONB NOT NULL DEFAULT '{}'::jsonb,
  days_present JSONB NOT NULL DEFAULT '{}'::jsonb,
  days_absent JSONB NOT NULL DEFAULT '{}'::jsonb,
  times_tardy JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_academic_days JSONB NOT NULL DEFAULT '{}'::jsonb,
  rank JSONB NOT NULL DEFAULT '{}'::jsonb,
  remarks TEXT,
  promoted_to TEXT,
  detained_in_grade TEXT,
  card_password TEXT,
  total_students INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Report cards are publicly readable"
  ON public.report_cards FOR SELECT
  USING (true);

-- Ratings/feedback
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a rating"
  ON public.ratings FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Users can view their own ratings"
  ON public.ratings FOR SELECT
  USING (auth.uid() = user_id);