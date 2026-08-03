-- ============================================================================
-- 0002 — Sellers can submit an enquiry
-- ============================================================================
--
-- WHY
-- `leads.budget_range` is NOT NULL. The table was modelled for buyers, so a
-- seller — who has a property, not a budget — could not submit at all without
-- someone inventing a value. And "is this a buyer or a seller?" was not
-- representable, so seller enquiries could not be filtered or counted.
--
-- Expand-only: nothing is dropped, nothing is renamed, existing rows keep
-- working. Safe to run while the current site is live.
--
-- ORDER MATTERS: run this BEFORE deploying the /sell page. Until it runs, a
-- seller submission fails on the NOT NULL constraint — visibly, since the form
-- now surfaces errors rather than reporting a false success, but it fails.
--
-- Assumes 0001_admin_authorization.sql has already been applied.
-- ============================================================================


-- ── Buyers have a budget; sellers have a property ───────────────────────────
alter table leads alter column budget_range drop not null;


-- ── Which side of the deal this enquiry is ──────────────────────────────────
alter table leads
  add column if not exists enquiry_type text not null default 'buy'
  check (enquiry_type in ('buy', 'sell'));

-- Everything captured before today came through a buyer-shaped form.
update leads set enquiry_type = 'buy' where enquiry_type is null;

create index if not exists leads_enquiry_type_idx on leads (enquiry_type, created_at desc);


-- ── The public insert policy has to allow the new column ────────────────────
-- Recreated rather than altered: Postgres has no ALTER POLICY for WITH CHECK.
drop policy if exists "public_submit_leads" on leads;

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


-- ============================================================================
-- VERIFY
-- ============================================================================
-- 1. A seller insert with no budget_range succeeds:
--      insert into leads (full_name, email, phone, property_interest,
--                         enquiry_type, status, source)
--      values ('Test Seller','t@example.com','9999999999',
--              'Selling — Golf Course Road','sell','new','website');
--
-- 2. A buyer insert with no budget_range is rejected by the policy.
--
-- 3. Existing rows all read enquiry_type = 'buy':
--      select enquiry_type, count(*) from leads group by 1;
--
-- 4. Delete the test row afterwards.
-- ============================================================================
