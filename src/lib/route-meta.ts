import type { SEOOptions } from "./seo";

/**
 * Metadata for every static route, in one place.
 *
 * The prerenderer and the running app both read this, so the HTML served to a
 * crawler and the tags the client sets after hydration cannot drift apart.
 * Dynamic routes (/properties/:slug, /insights/:slug) build their metadata
 * from the database row — see propertyMeta / postMeta below.
 */
export const ROUTE_META: Record<string, SEOOptions> = {
  "/": {
    title: "L2S Infra — Luxury Real Estate Agency in Gurgaon & Delhi NCR",
    description:
      "Luxury real estate agency in Gurgaon and Delhi NCR. L2S Infra helps buyers and sellers with premium residential, commercial and farmhouse property on Golf Course Road, Golf Course Extension, Dwarka Expressway and Sohna Road. Partnered with premium builders.",
    path: "/",
  },
  "/properties": {
    title: "Premium Property Listings | L2S Infra - Luxury Real Estate India",
    description:
      "Luxury residential, commercial and farmhouse property for sale in Gurgaon and Delhi NCR — Golf Course Road, Golf Course Extension, Dwarka Expressway, Sohna Road and New Gurgaon. Buy or sell with L2S Infra.",
    path: "/properties",
  },
  "/sell": {
    title: "Sell Your Property in Gurgaon & Delhi | L2S Infra",
    description:
      "Selling a flat, floor or plot in Gurgaon or Delhi? We price against what comparable units in your sector actually transacted for, then run the sale through to registry. Free sector comparables, no obligation.",
    path: "/sell",
  },
  "/insights": {
    title: "Market Insights & Real Estate Research | L2S Infra",
    description:
      "Research-led commentary on the Gurgaon and Delhi NCR luxury property market — corridor-by-corridor pricing, new launches and NRI guidance from the L2S Infra team.",
    path: "/insights",
  },
  "/privacy-policy": {
    title: "Privacy Policy | L2S Infra",
    description:
      "How L2S Infra collects, uses, stores and deletes the personal information you share with us.",
    path: "/privacy-policy",
  },
  "/terms-of-service": {
    title: "Terms of Service | L2S Infra",
    description: "The terms governing use of the L2S Infra website and services.",
    path: "/terms-of-service",
  },
  "/disclaimer": {
    title: "Disclaimer | L2S Infra",
    description:
      "Important disclosures about property information, pricing and advisory content published by L2S Infra.",
    path: "/disclaimer",
  },
};

interface PropertyLike {
  slug: string;
  title: string;
  location: string;
  price: string;
  area: string;
  image_url: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

export function propertyMeta(p: PropertyLike): SEOOptions {
  return {
    title: `${p.meta_title || p.title} | L2S Infra`,
    description:
      p.meta_description ||
      `${p.title} in ${p.location}. ${p.price}. ${p.area}. Contact L2S Infra for a private consultation.`,
    path: `/properties/${p.slug}`,
    image: p.image_url,
  };
}

interface PostLike {
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

export function postMeta(b: PostLike): SEOOptions {
  return {
    title: `${b.meta_title || b.title} | L2S Infra`,
    description: b.meta_description || b.excerpt,
    path: `/insights/${b.slug}`,
    image: b.image_url,
    type: "article",
  };
}
