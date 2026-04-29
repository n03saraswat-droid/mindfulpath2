CREATE TABLE public.recommendation_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  item_key text NOT NULL,
  item_section text NOT NULL,
  item_label text,
  rating smallint NOT NULL CHECK (rating IN (-1, 1)),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_key)
);

ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback" ON public.recommendation_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feedback" ON public.recommendation_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feedback" ON public.recommendation_feedback FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own feedback" ON public.recommendation_feedback FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_recommendation_feedback_updated_at
BEFORE UPDATE ON public.recommendation_feedback
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_recommendation_feedback_user ON public.recommendation_feedback(user_id);