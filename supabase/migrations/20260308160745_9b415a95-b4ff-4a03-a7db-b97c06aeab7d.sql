
-- 1. Server-side XP award function
CREATE OR REPLACE FUNCTION public.award_xp(
  _event_type text,
  _description text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _xp integer;
  _new_total integer;
  _new_level integer;
  _existing record;
  _badge_id text;
  _result jsonb;
  _allowed_events jsonb := '{"mood_log": 10, "gratitude": 5, "course_lesson": 20, "course_complete": 50, "community_post": 10}'::jsonb;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT _allowed_events ? _event_type THEN
    RAISE EXCEPTION 'Invalid event type: %', _event_type;
  END IF;

  _xp := (_allowed_events ->> _event_type)::integer;

  INSERT INTO public.xp_events (user_id, xp_earned, event_type, description)
  VALUES (_user_id, _xp, _event_type, left(_description, 200));

  SELECT * INTO _existing FROM public.user_xp WHERE user_id = _user_id;

  IF _existing IS NOT NULL THEN
    _new_total := _existing.xp_total + _xp;
    _new_level := (_new_total / 100) + 1;
    UPDATE public.user_xp SET xp_total = _new_total, level = _new_level, updated_at = now() WHERE user_id = _user_id;
  ELSE
    _new_total := _xp;
    _new_level := (_xp / 100) + 1;
    INSERT INTO public.user_xp (user_id, xp_total, level) VALUES (_user_id, _new_total, _new_level);
  END IF;

  _result := jsonb_build_object('xp_earned', _xp, 'new_total', _new_total, 'new_level', _new_level, 'badges_unlocked', '[]'::jsonb);

  _badge_id := CASE _event_type
    WHEN 'mood_log' THEN 'first-mood'
    WHEN 'gratitude' THEN 'first-gratitude'
    WHEN 'course_lesson' THEN 'first-course'
    WHEN 'community_post' THEN 'community-post'
    ELSE NULL
  END;

  IF _badge_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = _user_id AND badge_id = _badge_id) THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (_user_id, _badge_id);
      _result := jsonb_set(_result, '{badges_unlocked}', (_result->'badges_unlocked') || to_jsonb(_badge_id));
    END IF;
  END IF;

  IF _new_total >= 100 AND NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = _user_id AND badge_id = 'xp-100') THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (_user_id, 'xp-100');
    _result := jsonb_set(_result, '{badges_unlocked}', (_result->'badges_unlocked') || '"xp-100"'::jsonb);
  END IF;
  IF _new_total >= 500 AND NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = _user_id AND badge_id = 'xp-500') THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (_user_id, 'xp-500');
    _result := jsonb_set(_result, '{badges_unlocked}', (_result->'badges_unlocked') || '"xp-500"'::jsonb);
  END IF;
  IF _new_total >= 1000 AND NOT EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = _user_id AND badge_id = 'xp-1000') THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (_user_id, 'xp-1000');
    _result := jsonb_set(_result, '{badges_unlocked}', (_result->'badges_unlocked') || '"xp-1000"'::jsonb);
  END IF;

  RETURN _result;
END;
$$;

-- 2. Server-side toggle like function
CREATE OR REPLACE FUNCTION public.toggle_post_like(_post_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _liked boolean;
  _new_count integer;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM public.post_likes WHERE post_id = _post_id AND user_id = _user_id) THEN
    DELETE FROM public.post_likes WHERE post_id = _post_id AND user_id = _user_id;
    _liked := false;
  ELSE
    INSERT INTO public.post_likes (post_id, user_id) VALUES (_post_id, _user_id);
    _liked := true;
  END IF;

  SELECT COUNT(*)::integer INTO _new_count FROM public.post_likes WHERE post_id = _post_id;
  UPDATE public.community_posts SET likes_count = _new_count WHERE id = _post_id;

  RETURN jsonb_build_object('liked', _liked, 'likes_count', _new_count);
END;
$$;

-- 3. Add CHECK constraint on likes_count
ALTER TABLE public.community_posts ADD CONSTRAINT likes_non_negative CHECK (likes_count >= 0);
