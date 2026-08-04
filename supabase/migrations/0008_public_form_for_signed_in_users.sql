-- ============================================================================
-- 0008 — The public forms fail for anyone signed in to /admin
-- ============================================================================
--
-- Symptom: /sell (and /#contact) return 403 / 42501 in the browser, while the
-- identical payload posted with the anon key succeeds every time. Verified:
-- all seven corridor values pass via curl and fail in the tab.
--
-- Cause: supabase-js keeps the session in localStorage and attaches it to
-- every request from that origin. Once you have signed in to /admin, the
-- public form posts as role `authenticated`, not `anon`. The insert policy
-- from 0003 reads `for insert to anon`, and there is no INSERT policy for
-- authenticated at all — the admin policies cover SELECT, UPDATE and DELETE
-- only. So the row is refused.
--
-- It fails for the owner testing their own site, and for any visitor who
-- happens to hold a session. It cannot be reproduced in a private window,
-- which is what made it look intermittent.
--
-- Fix: the same rules, applied to both roles. The WITH CHECK body is
-- unchanged, so a signed-in user gains nothing beyond what a visitor can
-- already do — every constraint on status, source, notes and field lengths
-- still holds.
-- ============================================================================

drop policy if exists "public_submit_leads" on leads;

create policy "public_submit_leads" on leads
  for insert
  to anon, authenticated          -- the whole point of this migration
  with check (
    status = 'new'
    and source = 'website'
    and notes is null
    and enquiry_type in ('buy', 'sell')
    and (enquiry_type = 'sell' or budget_range is not null)
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
-- Reproducing an RLS failure means triggering it against the live table.
-- Review this list, then delete.
select id, full_name, email, property_interest, created_at
from leads
where full_name in ('ZZTest', 'ZZProbe', 'Test', 'Test Seller', 'Test Buyer')
order by created_at desc;

delete from leads
where full_name in ('ZZTest', 'ZZProbe', 'Test', 'Test Seller', 'Test Buyer');


-- ============================================================================
-- VERIFY
--   1. Signed in to /admin, submit /sell — it should now succeed.
--   2. In a private window, submit /sell — should also succeed.
--   3. Leave Email blank on /sell — should succeed (needs 0007 applied too).
--   4. select enquiry_type, count(*) from leads group by 1;
-- ============================================================================
