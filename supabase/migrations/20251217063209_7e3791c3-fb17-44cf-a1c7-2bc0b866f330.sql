-- Create gratitude entries table
CREATE TABLE public.gratitude_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_text TEXT NOT NULL,
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;

-- Users can only see their own gratitude entries
CREATE POLICY "Users can view their own gratitude entries"
ON public.gratitude_entries
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own gratitude entries
CREATE POLICY "Users can insert their own gratitude entries"
ON public.gratitude_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own gratitude entries
CREATE POLICY "Users can delete their own gratitude entries"
ON public.gratitude_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_gratitude_entries_user_date ON public.gratitude_entries (user_id, logged_at DESC);