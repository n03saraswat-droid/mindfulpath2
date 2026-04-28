-- 1. User preferences captured during onboarding
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  -- Wellness goals: array of slugs e.g. ['reduce_anxiety','better_sleep','manage_anger','build_gratitude','boost_focus','self_compassion']
  goals TEXT[] NOT NULL DEFAULT '{}',
  -- Interests / practices: ['meditation','journaling','breathwork','shlokas','courses','community','audio','gratitude']
  interests TEXT[] NOT NULL DEFAULT '{}',
  -- Baseline
  stress_level SMALLINT NOT NULL DEFAULT 3 CHECK (stress_level BETWEEN 1 AND 5),
  typical_mood TEXT NOT NULL DEFAULT 'okay',
  biggest_challenge TEXT,
  -- Availability & preferences
  daily_minutes SMALLINT NOT NULL DEFAULT 10 CHECK (daily_minutes BETWEEN 1 AND 120),
  preferred_formats TEXT[] NOT NULL DEFAULT '{}', -- ['audio','video','text']
  preferred_time_of_day TEXT, -- 'morning' | 'afternoon' | 'evening' | 'anytime'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT biggest_challenge_len CHECK (biggest_challenge IS NULL OR char_length(biggest_challenge) <= 500)
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Cached AI-generated recommendations
CREATE TABLE public.user_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  -- Structured JSON: { suggestedFeatures:[], contentPicks:[], dailyPlan:{morning,afternoon,evening}, insights:string }
  payload JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON public.user_recommendations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON public.user_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON public.user_recommendations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recommendations" ON public.user_recommendations
  FOR DELETE USING (auth.uid() = user_id);