import { useEffect, useState } from "react";

/**
 * Single source of truth for L2S Infra's public contact details.
 *
 * Every public surface (footer, contact section, WhatsApp button, property
 * pages, policy pages) imports from here. To change the number, edit it ONCE
 * below — do not hardcode it in a component again.
 *
 * Keep in sync with the JSON-LD `telephone` in index.html, which is static
 * markup and cannot import this module.
 */

/** Digits only, with country code, no `+` — the format wa.me expects. */
export const WHATSAPP_NUMBER = "919818242500";

/** E.164, for `tel:` links. */
export const PHONE_E164 = "+919818242500";

/** How the number is shown to a reader. */
export const PHONE_DISPLAY = "+91-9818242500";

export const CONTACT_EMAIL = "connect@l2sinfra.com";

export const OFFICE_ADDRESS = "Bani City Centre, Sector 63, Gurgaon, Haryana, India";

export const BUSINESS_HOURS = "Mon – Sat: 10:00 AM – 7:00 PM";

/** Build a wa.me link, optionally with a prefilled message. */
export function whatsappLink(message?: string, number: string = WHATSAPP_NUMBER): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Live contact details, overridden from the admin console.
 *
 * The Settings panel writes these to `site_settings`, but nothing public ever
 * read that table — so changing the WhatsApp number there reported success and
 * changed nothing on the site, permanently. The constants above are the
 * fallback, so first paint is correct and a failed or slow read degrades to the
 * committed values rather than to blanks.
 */
export interface SiteContact {
  whatsapp: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  address: string;
  hours: string;
}

const DEFAULTS: SiteContact = {
  whatsapp: WHATSAPP_NUMBER,
  phoneDisplay: PHONE_DISPLAY,
  phoneE164: PHONE_E164,
  email: CONTACT_EMAIL,
  address: OFFICE_ADDRESS,
  hours: BUSINESS_HOURS,
};

/** One in-flight request shared by every consumer, cached for the session. */
let cached: Promise<SiteContact> | null = null;

function loadSiteContact(): Promise<SiteContact> {
  if (cached) return cached;
  cached = import("./supabase")
    .then(({ supabase }) =>
      supabase.from("site_settings").select("key, value"),
    )
    .then(({ data, error }) => {
      if (error || !data) return DEFAULTS;
      const map = Object.fromEntries(
        (data as { key: string; value: string }[]).map((r) => [r.key, r.value]),
      );
      const display = map.contact_phone?.trim() || DEFAULTS.phoneDisplay;
      return {
        whatsapp: map.whatsapp_number?.trim() || DEFAULTS.whatsapp,
        phoneDisplay: display,
        // tel: needs E.164 — derive it so the two can't drift apart.
        phoneE164: `+${display.replace(/[^0-9]/g, "")}`,
        email: map.contact_email?.trim() || DEFAULTS.email,
        address: map.office_address?.trim() || DEFAULTS.address,
        hours: map.business_hours?.trim() || DEFAULTS.hours,
      };
    })
    .catch(() => DEFAULTS);
  return cached;
}

export function useSiteContact(): SiteContact {
  const [contact, setContact] = useState<SiteContact>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    loadSiteContact().then((c) => {
      if (!cancelled) setContact(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return contact;
}
