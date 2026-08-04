-- ============================================================================
-- 0006 — Align the stored office address to the Google Business Profile
-- ============================================================================
--
-- The site, the structured data and the GBP disagreed in three ways:
--
--   spelling   "Bani City Centre"  vs  GBP "Banni City Center"
--   sector     "Sector 63"         vs  GBP "Sector-63A, Sector 63"
--   postcode   122001              vs  GBP 122101
--
-- 122001 is central Gurugram; the office is 122101. Local pack ranking depends
-- on the site, the GBP and third-party citations agreeing, and a near-match is
-- a failed match — so this uses the GBP string character for character.
--
-- The code constant and the JSON-LD are updated in the same commit; this row
-- overrides them at runtime, so all three have to move together.
--
-- Takes effect immediately, no deploy needed.
-- ============================================================================

select key, value from site_settings where key = 'office_address';

update site_settings
set value = 'Banni City Center, Sector-63A, Sector 63, Gurugram, Haryana 122101, India'
where key = 'office_address';

select key, value from site_settings where key = 'office_address';

-- ============================================================================
-- Worth checking separately: the HARERA certificate lists a different address
-- entirely — Shop No. 66, Upper Ground Floor, Vypar Kendra, Sushant Lok-1,
-- Gurugram 122009. Condition XI on that certificate voids the registration if
-- the agent's business address changes without notifying the Authority.
-- ============================================================================
