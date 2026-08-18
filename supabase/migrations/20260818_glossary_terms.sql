-- Glossary catalog + suggestions (one table).
-- Paste into Supabase Dashboard → SQL Editor, then Run.
-- Later: seed published rows from lib/glossary-data.ts; admin UI updates status / copy / tags.

create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_definition text not null,
  categories text[] not null,
  tags text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'published', 'rejected', 'hidden')),
  source text not null default 'suggestion'
    check (source in ('suggestion', 'seed', 'admin')),
  submitted_by uuid references auth.users (id) on delete set null,
  submitter_name text,
  submitter_email text,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint glossary_terms_title_len check (char_length(btrim(title)) between 2 and 80),
  constraint glossary_terms_def_len check (char_length(btrim(short_definition)) between 20 and 500),
  constraint glossary_terms_categories_shape check (
    cardinality(categories) between 1 and 3
    and categories <@ array['Product', 'Design', 'Build', 'Quality']::text[]
  )
);

create index if not exists glossary_terms_status_idx on public.glossary_terms (status);
create index if not exists glossary_terms_submitted_by_idx on public.glossary_terms (submitted_by);

create or replace function public.glossary_terms_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.title := btrim(new.title);
  new.short_definition := btrim(new.short_definition);
  if tg_op = 'INSERT' then
    -- Public inserts are suggestions only; never trust client status / author.
    if auth.role() in ('anon', 'authenticated') then
      new.status := 'pending';
      new.source := 'suggestion';
      new.submitted_by := auth.uid();
      new.review_note := null;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists glossary_terms_before_write on public.glossary_terms;
create trigger glossary_terms_before_write
  before insert or update on public.glossary_terms
  for each row execute function public.glossary_terms_before_write();

alter table public.glossary_terms enable row level security;

drop policy if exists "Anyone can suggest a glossary term" on public.glossary_terms;
create policy "Signed-in users can suggest a glossary term"
  on public.glossary_terms
  for insert
  to authenticated
  with check (status = 'pending' and source = 'suggestion');

drop policy if exists "Published glossary terms are public" on public.glossary_terms;
create policy "Published glossary terms are public"
  on public.glossary_terms
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Users can read own glossary suggestions" on public.glossary_terms;
create policy "Users can read own glossary suggestions"
  on public.glossary_terms
  for select
  to authenticated
  using (submitted_by = auth.uid());

comment on table public.glossary_terms is
  'Published glossary entries (status=published) and community suggestions (pending/rejected). Admin UI later.';

grant select, insert on table public.glossary_terms to authenticated;
grant select on table public.glossary_terms to anon;
grant select, insert, update, delete on table public.glossary_terms to service_role;
