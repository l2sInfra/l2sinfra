-- ============================================================================
-- 0004 — Correct the M3M Urbana record
-- ============================================================================
--
-- The developer field already reads "M3M", which is what confirms the brand.
-- The slug, title and meta_title said "M2M", so the page was competing for a
-- name nobody searches — every other M3M property in the table uses an "m3m-"
-- slug. The location also had "Golf COurse".
--
-- The slug change orphans /properties/m2m-urbana. vercel.json carries a 308
-- from the old path to the new one, so anything already linking to or indexed
-- at the old URL follows through in a single hop.
--
-- Run in the SQL Editor. Idempotent — safe to run twice.
-- ============================================================================

-- Before:
select slug, title, meta_title, developer, location
from properties
where slug in ('m2m-urbana', 'm3m-urbana');

update properties
set slug       = 'm3m-urbana',
    title      = 'M3M Urbana',
    meta_title = 'M3M Urbana, Sector 68 Gurgaon | L2S Infra',
    location   = replace(location, 'COurse', 'Course')
where slug = 'm2m-urbana';

-- After — expect one row, all four fields corrected:
select slug, title, meta_title, developer, location
from properties
where slug = 'm3m-urbana';

-- ============================================================================
-- Then redeploy so the prerender picks up the new slug and the sitemap
-- lists /properties/m3m-urbana instead of the old path.
-- ============================================================================
