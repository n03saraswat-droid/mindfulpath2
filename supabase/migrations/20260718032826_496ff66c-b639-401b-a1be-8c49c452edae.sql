
DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view comments" ON public.community_comments;
CREATE POLICY "Anyone can view comments" ON public.community_comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Anyone can view likes" ON public.post_likes FOR SELECT TO authenticated USING (true);

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.toggle_post_like(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.award_xp(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.toggle_post_like(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_xp(text, text) TO authenticated;
