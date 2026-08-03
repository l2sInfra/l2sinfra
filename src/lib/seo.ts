/**
 * Per-route SEO metadata for a single-page app.
 *
 * `index.html` is served for every URL, so without this every route would
 * report the homepage's canonical, title and Open Graph tags — telling search
 * engines that /properties, /insights/<slug> and every property page are
 * duplicates of the homepage. `useSEO` rewrites those tags on navigation and
 * restores nothing on unmount: the next route sets its own.
 *
 * Note this runs client-side. Google renders JS and will pick it up, but
 * crawlers that don't execute JS (most social-preview bots) see only the
 * static tags in index.html. Prerendering is the durable fix — tracked
 * separately.
 */

/** The one canonical origin. Must match public/sitemap.xml exactly. */
export const SITE_ORIGIN = "https://www.l2sinfra.com";

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

export interface SEOOptions {
  /** Full <title>. Callers append "| L2S Infra" themselves where it reads better. */
  title: string;
  description?: string;
  /** Path beginning with "/", e.g. "/properties". Resolved against SITE_ORIGIN. */
  path: string;
  /** Absolute URL. Falls back to the site-wide share image. */
  image?: string;
  /** "website" (default) or "article" for blog posts. */
  type?: "website" | "article";
  /** Keep this page out of the index — admin, 404, anything thin. */
  noindex?: boolean;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Apply metadata for the current route. Call from a useEffect keyed on
 * whatever the content depends on (slug, loaded record, …).
 */
export function applySEO({ title, description, path, image, type = "website", noindex }: SEOOptions) {
  const url = `${SITE_ORIGIN}${path}`;
  const img = image || DEFAULT_OG_IMAGE;

  document.title = title;
  setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  setCanonical(url);

  if (description) {
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  }

  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta('meta[property="og:url"]', "property", "og:url", url);
  setMeta('meta[property="og:type"]', "property", "og:type", type);
  setMeta('meta[property="og:image"]', "property", "og:image", img);
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  setMeta('meta[name="twitter:image"]', "name", "twitter:image", img);
}
