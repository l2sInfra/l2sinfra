-- SUPERSEDED BY 0003. Do not run this file. It assumes it runs before 0002
-- and fails if 0002 was applied first — see the header of 0003.
-- ============================================================================
-- 0001 — Authorization expresses ADMIN, not "has an account"
-- ============================================================================
--
-- WHY
-- Every privileged policy currently reads:
--
--     using (auth.role() = 'authenticated')
--
-- `authenticated` is true for ANY row in auth.users, not for the owner. The
-- anon key is public in the JS bundle by design, and the same key authorises
-- POST /auth/v1/signup. So if email signup is enabled — which is Supabase's
-- default — anyone can create an account and then read the entire `leads`
-- table: every enquirer's name, email, phone, budget and message. They can
-- also rewrite blog_posts and properties, and mark leads closed so they never
-- surface in the admin's "New" filter.
--
-- Disabling signup in the dashboard is necessary but is NOT sufficient on its
-- own: it leaves one dashboard toggle as the entire security boundary, with no
-- defence in depth. This migration makes the policies name actual admins.
--
-- ----------------------------------------------------------------------------
-- HOW TO APPLY — read this before running anything
-- ----------------------------------------------------------------------------
--
-- 1. Supabase Dashboard → Authentication → Providers → Email → turn OFF
--    "Enable signup". Do this FIRST.
--
-- 2. Run STEP 1 below on its own and confirm it returns your user id. If it
--    returns nothing, STOP — running the rest would lock you out of the admin
--    console entirely.
--
-- 3. Run the remainder.
--
-- 4. Verify (see the checks at the bottom).
--
-- Take a backup first. This changes who can read your customer data.
-- ============================================================================


-- ── STEP 1 — seed yourself as the admin BEFORE the policies start using it ──
-- Replace the address with the email you sign in to /admin with.

create table if not exists admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

insert into admin_users (user_id, email)
select id, email from auth.users
where email = 'connect@l2sinfra.com'
on conflict (user_id) do nothing;

-- Confirm this returns exactly one row before continuing.
select * from admin_users;


-- ── STEP 2 — the predicate the policies will use ────────────────────────────
-- SECURITY DEFINER so the lookup itself isn't subject to RLS on admin_users.
-- `set search_path` prevents search-path hijacking of a definer function.

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
create policy "admins read admin_users" on admin_users
  for select to authenticated using (is_admin());


-- ── STEP 3 — replace every "any logged-in user" policy ──────────────────────
-- `to authenticated` makes anon requests short-circuit before the predicate
-- is even evaluated.

drop policy if exists "Admin full access properties"    on properties;
drop policy if exists "Admin full access blog_posts"    on blog_posts;
drop policy if exists "Admin full access leads"         on leads;
drop policy if exists "Admin update leads"              on leads;
drop policy if exists "Admin full access testimonials"  on testimonials;
drop policy if exists "Admin full access site_settings" on site_settings;

create policy "admin_all_properties"   on properties    for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin_all_blog_posts"   on blog_posts    for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin_all_testimonials" on testimonials  for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin_all_settings"     on site_settings for all to authenticated using (is_admin()) with check (is_admin());

create policy "admin_read_leads"   on leads for select to authenticated using (is_admin());
create policy "admin_update_leads" on leads for update to authenticated using (is_admin()) with check (is_admin());

-- There was no DELETE policy on leads at all, so nobody — including the owner —
-- could erase a record through the API. That leaves no way to honour a deletion
-- request under India's DPDP Act 2023, or GDPR for NRI clients in the EU/UK.
create policy "admin_delete_leads" on leads for delete to authenticated using (is_admin());


-- ── STEP 4 — narrow the public lead insert ──────────────────────────────────
-- The old policy was `with check (true)`, letting an anonymous POST set EVERY
-- column — including the private `notes` field and `status`, so a real enquiry
-- could be injected pre-marked "closed" and never appear in the New filter.

drop policy if exists "Public can submit leads" on leads;

create policy "public_submit_leads" on leads
  for insert to anon
  with check (
    status = 'new'
    and source = 'website'
    and notes is null
    and length(full_name) between 2 and 100
    and length(email) between 5 and 255
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and length(phone) between 6 and 20
    and (message is null or length(message) <= 1000)
  );


-- ── STEP 5 — don't advertise inventory that isn't for sale ──────────────────
-- The policy was named "Public can read available properties" but was
-- `using (true)`, so sold and under-negotiation listings were publicly
-- queryable via the REST API even though the UI filters them out.

drop policy if exists "Public can read available properties" on properties;
create policy "public_read_available_properties" on properties
  for select to anon using (status = 'available');


-- ============================================================================
-- VERIFY — all four should hold
-- ============================================================================
-- 1. Signed out (anon key only):
--      GET /rest/v1/leads?select=*            -> []
--      PATCH /rest/v1/blog_posts?id=eq.<any>  -> 401/403, no row changed
--
-- 2. Signed in as a NON-admin (create a throwaway user via the dashboard):
--      GET /rest/v1/leads?select=*            -> []
--      POST /rest/v1/properties               -> denied
--    Delete the throwaway user afterwards.
--
-- 3. Signed in as you: the admin console behaves exactly as before.
--
-- 4. The public site still lists properties, posts and testimonials, and the
--    contact form still submits.
-- ============================================================================
