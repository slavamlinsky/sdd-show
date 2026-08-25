-- If 20260824000000 already ran with a single `category` column, move to `categories text[]`.
-- Fresh installs that used the updated 20260824000000 file skip this block.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'video_suggestions'
      and column_name = 'category'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'video_suggestions'
      and column_name = 'categories'
  ) then
    alter table public.video_suggestions
      add column categories text[] not null default '{}';

    update public.video_suggestions
    set categories = array[category]
    where category is not null;

    alter table public.video_suggestions
      drop constraint if exists video_suggestions_category_ok;

    alter table public.video_suggestions
      drop column category;

    alter table public.video_suggestions
      add constraint video_suggestions_categories_ok check (
        cardinality(categories) <= 4
        and categories <@ array['Product', 'Design', 'Build', 'Quality']::text[]
      );
  end if;
end $$;
