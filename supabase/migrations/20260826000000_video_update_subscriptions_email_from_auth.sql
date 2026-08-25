-- Pin subscription email to auth.users so a client cannot store an arbitrary address.
-- Idempotent if 20260824000000 already included this function body.

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
  -- Always take the address from Auth; never trust a client-supplied email.
  select au.email
    into new.email
    from auth.users as au
    where au.id = new.user_id;
  return new;
end;
$$;
