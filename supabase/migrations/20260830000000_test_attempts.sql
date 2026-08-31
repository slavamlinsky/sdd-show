-- Signed-in quiz attempts + public leaderboard (no emails).
-- Applied by `npx supabase db push` / the GitHub Action on merge to main.

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  test_slug text not null,
  display_name text not null,
  question_ids text[] not null,
  answers jsonb not null default '{}'::jsonb,
  correct_count int not null,
  total_count int not null,
  percent int not null,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  elapsed_ms int not null,
  created_at timestamptz not null default now(),
  constraint test_attempts_slug_len check (char_length(btrim(test_slug)) between 2 and 80),
  constraint test_attempts_name_len check (char_length(btrim(display_name)) between 1 and 80),
  constraint test_attempts_counts check (
    total_count > 0
    and correct_count between 0 and total_count
    and cardinality(question_ids) = total_count
  ),
  constraint test_attempts_percent check (percent between 0 and 100),
  constraint test_attempts_elapsed check (elapsed_ms >= 0),
  constraint test_attempts_window check (finished_at >= started_at),
  constraint test_attempts_sitting_unique unique (user_id, test_slug, started_at)
);

create index if not exists test_attempts_user_idx on public.test_attempts (user_id);
create index if not exists test_attempts_leaderboard_idx
  on public.test_attempts (test_slug, percent desc, elapsed_ms, finished_at);

create or replace function public.test_attempts_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_name text;
begin
  if auth.role() = 'authenticated' then
    new.user_id := auth.uid();
  end if;

  if new.user_id is null then
    raise exception 'test_attempts requires a user';
  end if;

  new.test_slug := btrim(new.test_slug);
  new.percent := round(100.0 * new.correct_count / new.total_count)::int;
  new.elapsed_ms := greatest(
    0,
    (extract(epoch from (new.finished_at - new.started_at)) * 1000)::int
  );

  select coalesce(
    nullif(btrim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(btrim(u.raw_user_meta_data->>'name'), ''),
    nullif(split_part(u.email, '@', 1), ''),
    'Player'
  )
  into meta_name
  from auth.users u
  where u.id = new.user_id;

  new.display_name := left(coalesce(meta_name, 'Player'), 80);

  return new;
end;
$$;

drop trigger if exists test_attempts_before_write on public.test_attempts;
create trigger test_attempts_before_write
  before insert or update on public.test_attempts
  for each row execute function public.test_attempts_before_write();

alter table public.test_attempts enable row level security;

drop policy if exists "Users insert own test attempts" on public.test_attempts;
create policy "Users insert own test attempts"
  on public.test_attempts
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users read own test attempts" on public.test_attempts;
create policy "Users read own test attempts"
  on public.test_attempts
  for select
  to authenticated
  using (user_id = auth.uid());

comment on table public.test_attempts is
  'Finished inner-test sittings for signed-in users. Leaderboard uses best row per user per slug.';

grant select, insert on table public.test_attempts to authenticated;
grant select, insert, update, delete on table public.test_attempts to service_role;

create or replace function public.test_leaderboard_rows(
  p_slug text default null,
  p_limit int default 10
)
returns table (
  rank bigint,
  user_id uuid,
  test_slug text,
  display_name text,
  percent int,
  elapsed_ms int,
  finished_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  with best as (
    select distinct on (ta.user_id, ta.test_slug)
      ta.user_id,
      ta.test_slug,
      ta.display_name,
      ta.percent,
      ta.elapsed_ms,
      ta.finished_at
    from public.test_attempts ta
    where p_slug is null or ta.test_slug = p_slug
    order by
      ta.user_id,
      ta.test_slug,
      ta.percent desc,
      ta.elapsed_ms asc,
      ta.finished_at asc
  ),
  ranked as (
    select
      row_number() over (
        partition by b.test_slug
        order by b.percent desc, b.elapsed_ms asc, b.finished_at asc
      ) as rank,
      b.user_id,
      b.test_slug,
      b.display_name,
      b.percent,
      b.elapsed_ms,
      b.finished_at
    from best b
  )
  select
    r.rank,
    r.user_id,
    r.test_slug,
    r.display_name,
    r.percent,
    r.elapsed_ms,
    r.finished_at
  from ranked r
  where r.rank <= greatest(1, least(coalesce(p_limit, 10), 50))
  order by r.test_slug, r.rank;
$$;

revoke all on function public.test_leaderboard_rows(text, int) from public;
grant execute on function public.test_leaderboard_rows(text, int) to anon;
grant execute on function public.test_leaderboard_rows(text, int) to authenticated;
grant execute on function public.test_leaderboard_rows(text, int) to service_role;

comment on function public.test_leaderboard_rows(text, int) is
  'Public best scores per user per test. No emails. Rank: percent, then elapsed, then earliest finish.';
