-- ============================================================================
-- 0003 — Reconciles 0001 and 0002 into the intended end state
-- ============================================================================
--
-- WHY THIS EXISTS
-- 0001 was written to run before 0002, but 0002 was applied first because the
-- seller form needed it. 0001 then failed: it drops the OLD policy name
-- ("Public can submit leads") and creates "public_submit_leads", which 0002
-- had already created. Supabase runs the editor script in a transaction, so
-- the whole of 0001 rolled back, leaving a partial state:
--
--   admin_users        created (it was run separately, so it survived)
--   is_admin()         missing
--   admin policies     still `auth.role() = 'authenticated'` — the security hole
--   leads insert       still `with check (true)` — unconstrained
--   enquiry_type       present
--
-- This script is fully idempotent: every statement is safe to run repeatedly
-- and against any of those partial states. It supersedes 0001 and the policy
-- half of 0002. Run this INSTEAD of re-running either.
--
-- BEFORE RUNNING
--   1. Authentication → Sign In / Providers → Email → disable new signups.
--   2. Confirm the next query returns exactly one row — yours.
--      Running on with zero rows revokes your own admin access.
-- ============================================================================


-- ── Confirm the admin row exists BEFORE anything depends on it ──────────────
-- If this returns no rows, STOP. Insert yourself first:
--   insert into admin_users (user_id, email)
--   select id, email from auth.users where email = 'you@example.com';
select * from admin_users;


-- ── The predicate every privileged policy will use ──────────────────────────
-- SECURITY DEFINER so the lookup isn't itself subject to RLS on admin_users.
-- set search_path prevents search-path hijacking of a definer function.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table admin_users enable row level security;
drop policy if exists "admins read admin_users" on admin_users;
create policy "admins read admin_users" on admin_users
  for select to authenticated using (is_admin());


-- ── Replace "any logged-in user" with "an actual admin" ─────────────────────
-- Both the original names and any partially-applied new ones are dropped, so
-- this runs cleanly whatever state the project is in.
drop policy if exists "Admin full access properties"    on properties;
drop policy if exists "Admin full access blog_posts"    on blog_posts;
drop policy if exists "Admin full access leads"         on leads;
drop policy if exists "Admin update leads"              on leads;
drop policy if exists "Admin full access testimonials"  on testimonials;
drop policy if exists "Admin full access site_settings" on site_settings;
drop policy if exists "admin_all_properties"   on properties;
drop policy if exists "admin_all_blog_posts"   on blog_posts;
drop policy if exists "admin_all_testimonials" on testimonials;
drop policy if exists "admin_all_settings"     on site_settings;
drop policy if exists "admin_read_leads"       on leads;
drop policy if exists "admin_update_leads"     on leads;
drop policy if exists "admin_delete_leads"     on leads;

create policy "admin_all_properties"   on properties    for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin_all_blog_posts"   on blog_posts    for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin_all_testimonials" on testimonials  for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin_all_settings"     on site_settings for all to authenticated using (is_admin()) with check (is_admin());

create policy "admin_read_leads"   on leads for select to authenticated using (is_admin());
create policy "admin_update_leads" on leads for update to authenticated using (is_admin()) with check (is_admin());
-- There was no DELETE policy on leads at all, so no erasure request could be
-- honoured under DPDP 2023 or GDPR.
create policy "admin_delete_leads" on leads for delete to authenticated using (is_admin());


-- ── The public lead insert, constrained ─────────────────────────────────────
-- Was `with check (true)`: an anonymous POST could set every column, including
-- the private notes field and status — so an enquiry could be injected
-- pre-marked "closed" and never appear in the New filter.
alter table leads alter column budget_range drop not null;
alter table leads
  add column if not exists enquiry_type text not null default 'buy'
  check (enquiry_type in ('buy', 'sell'));

drop policy if exists "Public can submit leads" on leads;
drop policy if exists "public_submit_leads"     on leads;

create policy "public_submit_leads" on leads
  for insert to anon
  with check (
    status = 'new'
    and source = 'website'
    and notes is null
    and enquiry_type in ('buy', 'sell')
    -- A buyer must state a budget; a seller must not be forced to invent one.
    and (enquiry_type = 'sell' or budget_range is not null)
    and length(full_name) between 2 and 100
    and length(email) between 5 and 255
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and length(phone) between 6 and 20
    and (message is null or length(message) <= 2000)
    and (budget_range is null or length(budget_range) <= 50)
    and length(property_interest) between 2 and 120
    and (preferred_location is null or length(preferred_location) <= 120)
  );


-- ── Don't advertise inventory that isn't for sale ───────────────────────────
-- The policy was named "Public can read available properties" but was
-- `using (true)`, so sold listings were publicly queryable via the REST API.
drop policy if exists "Public can read available properties" on properties;
drop policy if exists "public_read_available_properties"     on properties;
create policy "public_read_available_properties" on properties
  for select to anon using (status = 'available');


-- ============================================================================
-- VERIFY — run this after, and check every row
-- ============================================================================
select 'is_admin() exists'      as check, (select count(*)::text from pg_proc where proname='is_admin') as result
union all
select 'admins registered',      (select count(*)::text from admin_users)
union all
select 'leads policies',         (select string_agg(policyname, ', ' order by policyname) from pg_policies where tablename='leads')
union all
select 'properties policies',    (select string_agg(policyname, ', ' order by policyname) from pg_policies where tablename='properties')
union all
select 'budget_range nullable',  (select is_nullable from information_schema.columns where table_name='leads' and column_name='budget_range');

-- Expected:
--   is_admin() exists      1
--   admins registered      1
--   leads policies         admin_delete_leads, admin_read_leads, admin_update_leads, public_submit_leads
--   properties policies    admin_all_properties, public_read_available_properties
--   budget_range nullable  YES
--
-- Then, in the browser:
--   - /admin still loads and shows leads
--   - the public site still lists properties and posts
--   - the contact form still submits
-- ============================================================================
