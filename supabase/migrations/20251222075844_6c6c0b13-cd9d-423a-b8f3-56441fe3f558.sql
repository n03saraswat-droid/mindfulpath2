-- Add UPDATE policy to course_progress table for defense in depth
CREATE POLICY "Users can update their own progress"
ON public.course_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);