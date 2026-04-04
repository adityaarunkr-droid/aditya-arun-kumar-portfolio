-- =============================================================================
-- Portfolio visitor counter — run this in Supabase: SQL Editor → New query → Run
-- =============================================================================
-- What this does:
-- 1) Creates a single-row table holding total visits and "new browser" uniques.
-- 2) Lets anyone READ the row (so your site can show the count with the anon key).
-- 3) Blocks direct writes from the browser; only a SECURITY DEFINER function can
--    increment, so counts stay consistent and controlled.
-- =============================================================================

create table if not exists public.site_stats (
  id int primary key default 1,
  total_visits bigint not null default 0,
  unique_visitors bigint not null default 0,
  constraint site_stats_singleton check (id = 1)
);

insert into public.site_stats (id, total_visits, unique_visitors)
values (1, 0, 0)
on conflict (id) do nothing;

alter table public.site_stats enable row level security;

-- Public read (safe: only one aggregate row, no PII)
drop policy if exists "site_stats_select_public" on public.site_stats;
create policy "site_stats_select_public"
  on public.site_stats
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies for anon → they cannot tamper with the row directly

-- Atomically increment totals. Called from the frontend only when the browser decides
-- the user has not been counted recently (see visitTracking.ts).
-- p_count_as_unique: true on this browser's first-ever recorded visit (localStorage flag).
create or replace function public.record_visit(p_count_as_unique boolean default false)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  t bigint;
  u bigint;
begin
  update public.site_stats
  set
    total_visits = total_visits + 1,
    unique_visitors = unique_visitors + case when p_count_as_unique then 1 else 0 end
  where id = 1
  returning total_visits, unique_visitors into t, u;

  return json_build_object('total_visits', t, 'unique_visitors', u);
end;
$$;

-- Allow the browser (anon key) to call this function only — not to update the table.
revoke all on function public.record_visit(boolean) from public;
grant execute on function public.record_visit(boolean) to anon, authenticated;
