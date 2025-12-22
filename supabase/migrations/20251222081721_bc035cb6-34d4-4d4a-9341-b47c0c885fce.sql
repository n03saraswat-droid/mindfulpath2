-- Create bookmarks table for saving favorite resources
CREATE TABLE public.resource_bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resource_id text NOT NULL,
  resource_item_label text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Enable Row Level Security
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own bookmarks"
ON public.resource_bookmarks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
ON public.resource_bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.resource_bookmarks
FOR DELETE
USING (auth.uid() = user_id);