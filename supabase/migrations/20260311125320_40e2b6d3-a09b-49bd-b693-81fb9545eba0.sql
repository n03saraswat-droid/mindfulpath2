ALTER TABLE public.community_posts
  ADD CONSTRAINT posts_title_length CHECK (char_length(title) <= 150),
  ADD CONSTRAINT posts_content_length CHECK (char_length(content) <= 5000);

ALTER TABLE public.community_comments
  ADD CONSTRAINT comments_content_length CHECK (char_length(content) <= 1000);