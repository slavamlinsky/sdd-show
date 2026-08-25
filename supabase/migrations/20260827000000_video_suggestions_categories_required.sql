-- Require 1–4 topics on video_suggestions. Idempotent if 20260824/25 already
-- created the column with default '{}' and cardinality <= 4 only.

alter table public.video_suggestions
  alter column categories drop default;

alter table public.video_suggestions
  drop constraint if exists video_suggestions_categories_ok;

alter table public.video_suggestions
  add constraint video_suggestions_categories_ok check (
    cardinality(categories) between 1 and 4
    and categories <@ array['Product', 'Design', 'Build', 'Quality']::text[]
  );
