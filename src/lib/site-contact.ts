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

/** Build a wa.me link, optionally with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
