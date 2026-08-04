-- ============================================================================
-- 0007 — URGENT: seller enquiries are being rejected
-- ============================================================================
--
-- The /sell form cannot submit unless the visitor fills in Email — but the form
-- marks Email as optional, so anyone who skips it gets "We couldn't send that
-- just now" and the lead is lost.
--
-- Two separate constraints, both of which I introduced, disagree with the form:
--
--   leads.email is NOT NULL                    (from the original schema)
--   public_submit_leads requires
--     length(email) between 5 and 255          (from 0003)
--
-- The seller form deliberately requires only name, phone and corridor: a
-- seller has a property and a phone, and demanding an email before they will
-- talk to you is the friction the page exists to remove. So the database
-- should accept a lead without one; phone is the required channel.
--
-- Reproduced before writing this: an otherwise identical seller insert passes
-- with an email and fails with "" — error 42501, row-level security.
--
-- Run this now. It takes effect immediately; the code change that sends null
-- instead of "" ships with the next deploy, and this migration is what makes
-- that work.
-- ============================================================================


-- ── the column ──────────────────────────────────────────────────────────────
alter table leads alter column email drop not null;


-- ── the policy ──────────────────────────────────────────────────────────────
-- Absent is allowed; present must still be a real address.
drop policy if exists "public_submit_leads" on leads;

create policy "public_submit_leads" on leads
  for insert to anon
  with check (
    status = 'new'
    and source = 'website'
    and notes is null
    and enquiry_type in ('buy', 'sell')
    -- a buyer must state a budget; a seller must not be forced to invent one
    and (enquiry_type = 'sell' or budget_range is not null)
    -- a buyer form always collects an email; a seller may skip it
    and (enquiry_type = 'sell' or email is not null)
    and length(full_name) between 2 and 100
    and (email is null or (length(email) between 5 and 255
         and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'))
    and length(phone) between 6 and 20
    and (message is null or length(message) <= 2000)
    and (budget_range is null or length(budget_range) <= 50)
    and length(property_interest) between 2 and 120
    and (preferred_location is null or length(preferred_location) <= 120)
  );


-- ── remove the rows my diagnosis created ────────────────────────────────────
-- Finding the cause meant submitting real inserts against the live table.
-- These are those rows and nothing else — check the list before deleting.
select id, full_name, email, property_interest, created_at
from leads
where full_name in ('ZZTest', 'Test', 'Test Seller', 'Test Buyer')
order by created_at desc;

delete from leads
where full_name in ('ZZTest', 'Test', 'Test Seller', 'Test Buyer');


-- ============================================================================
-- VERIFY — then submit a real enquiry through /sell with the Email box empty.
-- ============================================================================
select enquiry_type, count(*) from leads group by 1;
-- ============================================================================
