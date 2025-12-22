-- Add UPDATE policy to gratitude_entries table
CREATE POLICY "Users can update their own gratitude entries"
ON public.gratitude_entries
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add database constraints for input validation (defense in depth)
ALTER TABLE public.gratitude_entries
ADD CONSTRAINT gratitude_entry_text_length CHECK (char_length(entry_text) <= 500);

ALTER TABLE public.mood_entries
ADD CONSTRAINT mood_note_length CHECK (note IS NULL OR char_length(note) <= 500);