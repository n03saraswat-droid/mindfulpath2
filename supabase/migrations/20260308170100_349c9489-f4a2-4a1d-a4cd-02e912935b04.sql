
-- ============================================================
-- 1. Fix ALL RLS policies: drop RESTRICTIVE, recreate as PERMISSIVE
-- ============================================================

-- community_comments
DROP POLICY IF EXISTS "Anyone can view comments" ON public.community_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.community_comments;
DROP POLICY IF EXISTS "Users can insert own comments" ON public.community_comments;
CREATE POLICY "Anyone can view comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users can delete own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- community_posts
DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);

-- course_progress
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
CREATE POLICY "Users can delete their own progress" ON public.course_progress FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.course_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own progress" ON public.course_progress FOR SELECT USING (auth.uid() = user_id);

-- gratitude_entries
DROP POLICY IF EXISTS "Users can delete their own gratitude entries" ON public.gratitude_entries;
DROP POLICY IF EXISTS "Users can insert their own gratitude entries" ON public.gratitude_entries;
DROP POLICY IF EXISTS "Users can update their own gratitude entries" ON public.gratitude_entries;
DROP POLICY IF EXISTS "Users can view their own gratitude entries" ON public.gratitude_entries;
CREATE POLICY "Users can delete their own gratitude entries" ON public.gratitude_entries FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own gratitude entries" ON public.gratitude_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gratitude entries" ON public.gratitude_entries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own gratitude entries" ON public.gratitude_entries FOR SELECT USING (auth.uid() = user_id);

-- mood_entries
DROP POLICY IF EXISTS "Users can delete their own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can insert their own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can update their own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can view their own mood entries" ON public.mood_entries;
CREATE POLICY "Users can delete their own mood entries" ON public.mood_entries FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mood entries" ON public.mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood entries" ON public.mood_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries FOR SELECT USING (auth.uid() = user_id);

-- post_likes
DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can insert own likes" ON public.post_likes;
CREATE POLICY "Anyone can view likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can delete own likes" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own likes" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- resource_bookmarks
DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.resource_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.resource_bookmarks;
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Users can create their own bookmarks" ON public.resource_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.resource_bookmarks FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own bookmarks" ON public.resource_bookmarks FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 2. Remove direct user write access to XP/badge/event tables
--    (all writes go through SECURITY DEFINER functions)
-- ============================================================

-- user_xp: remove INSERT and UPDATE, keep SELECT
DROP POLICY IF EXISTS "Users can insert own xp" ON public.user_xp;
DROP POLICY IF EXISTS "Users can update own xp" ON public.user_xp;
DROP POLICY IF EXISTS "Users can view own xp" ON public.user_xp;
CREATE POLICY "Users can view own xp" ON public.user_xp FOR SELECT USING (auth.uid() = user_id);

-- user_badges: remove INSERT, keep SELECT
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

-- xp_events: remove INSERT, keep SELECT
DROP POLICY IF EXISTS "Users can insert own xp events" ON public.xp_events;
DROP POLICY IF EXISTS "Users can view own xp events" ON public.xp_events;
CREATE POLICY "Users can view own xp events" ON public.xp_events FOR SELECT USING (auth.uid() = user_id);
