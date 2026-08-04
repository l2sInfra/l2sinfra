-- ============================================================================
-- 0005 — URGENT: site_settings still holds the OLD phone number
-- ============================================================================
--
-- The live site is displaying +91-9773740037 — the number replaced back at the
-- start of this work. site_settings was seeded in March and never updated, and
-- the public surfaces now read from it, so stale database values override the
-- corrected constants in src/lib/site-contact.ts.
--
-- Making the settings panel functional is what exposed this: before, the panel
-- wrote values nothing read, so the old rows were harmless. Now they win.
--
-- Run this in the SQL Editor. It takes effect immediately — no deploy needed,
-- because the values are read at runtime.
-- ============================================================================

-- What is stored right now:
select key, value from site_settings order by key;

update site_settings set value = '919818242500'
  where key = 'whatsapp_number';

update site_settings set value = '+91-9818242500'
  where key = 'contact_phone';

update site_settings set value = 'Bani City Centre, Sector 63, Gurgaon, Haryana, India'
  where key = 'office_address';

-- The component rendered the Sunday clause a second time on its own; that
-- duplicate line is removed in code, so keep it in the value here.
update site_settings set value = 'Mon – Sat: 10:00 AM – 7:00 PM | Sunday: By Appointment'
  where key = 'business_hours';

update site_settings set value = 'Gurgaon & Delhi · Buying & selling · In this market since 2010'
  where key = 'ticker_text';

-- Verify — contact_phone and whatsapp_number must both read 9818242500:
select key, value from site_settings order by key;

-- ============================================================================
-- Then hard-refresh the site (Cmd+Shift+R) and confirm the Contact section
-- shows +91-9818242500 for both Phone and WhatsApp.
-- ============================================================================
