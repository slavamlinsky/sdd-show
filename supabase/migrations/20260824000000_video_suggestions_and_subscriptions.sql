-- Video suggestions (community intake) + video-library update subscriptions.
-- Applied by `npx supabase db push` / the GitHub Action on merge to main.

create table if not exists public.video_suggestions (
  id uuid primary key default gen_random_uuid(),
  youtube_url text not null,
  youtube_id text not null,
  why_it_matters text not null,
  categories text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  submitted_by uuid references auth.users (id) on delete set null,
  submitter_name text,
  submitter_email text,
  created_at timestamptz not null default now(),
  constraint video_suggestions_youtube_id_len check (char_length(youtube_id) = 11),
  constraint video_suggestions_why_len check (
    char_length(btrim(why_it_matters)) between 20 and 500
  ),
  constraint video_suggestions_categories_ok check (
    cardinality(categories) <= 4
    and categories <@ array['Product', 'Design', 'Build', 'Quality']::text[]
  )
);

create index if not exists video_suggestions_status_idx on public.video_suggestions (status);
create index if not exists video_suggestions_submitted_by_idx on public.video_suggestions (submitted_by);

create or replace function public.video_suggestions_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.why_it_matters := btrim(new.why_it_matters);
  new.youtube_url := btrim(new.youtube_url);
  if auth.role() in ('anon', 'authenticated') then
    new.status := 'pending';
    new.submitted_by := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists video_suggestions_before_insert on public.video_suggestions;
create trigger video_suggestions_before_insert
  before insert on public.video_suggestions
  for each row execute function public.video_suggestions_before_insert();

alter table public.video_suggestions enable row level security;

drop policy if exists "Signed-in users can suggest a video" on public.video_suggestions;
create policy "Signed-in users can suggest a video"
  on public.video_suggestions
  for insert
  to authenticated
  with check (status = 'pending');

drop policy if exists "Users can read own video suggestions" on public.video_suggestions;
create policy "Users can read own video suggestions"
  on public.video_suggestions
  for select
  to authenticated
  using (submitted_by = auth.uid());

comment on table public.video_suggestions is
  'Community YouTube suggestions. Listing stays in lib/videos-data.ts until curation publishes them.';

grant select, insert on table public.video_suggestions to authenticated;
grant select, insert, update, delete on table public.video_suggestions to service_role;

-- Signed-in users opt in to video-library update mail.

create table if not exists public.video_update_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  subscribed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.video_update_subscriptions_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  if auth.role() = 'authenticated' then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists video_update_subscriptions_before_write on public.video_update_subscriptions;
create trigger video_update_subscriptions_before_write
  before insert or update on public.video_update_subscriptions
  for each row execute function public.video_update_subscriptions_before_write();

alter table public.video_update_subscriptions enable row level security;

drop policy if exists "Users manage own video update subscription" on public.video_update_subscriptions;
create policy "Users manage own video update subscription"
  on public.video_update_subscriptions
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

comment on table public.video_update_subscriptions is
  'Opt-in flag for video library updates. Mailer later; UI toggles subscribed.';

grant select, insert, update, delete on table public.video_update_subscriptions to authenticated;
grant select, insert, update, delete on table public.video_update_subscriptions to service_role;
