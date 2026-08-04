/**
 * Build-time prerender.
 *
 * Without this, every URL is served the same empty `index.html`. Crawlers that
 * don't execute JavaScript — which is most social-preview bots, and Google's
 * first indexing pass — saw the homepage's title, description and canonical on
 * every property and insight page, i.e. the whole site looked like duplicates
 * of the homepage. The LCP image was also invisible to the preload scanner
 * until ~600 kB of JS had parsed and run.
 *
 * Run after `vite build` and `vite build --ssr`. For each route it renders the
 * real component tree to HTML, rewrites the <head> for that route, and writes
 * dist/<route>/index.html. Vercel's filesystem handler serves those before the
 * SPA rewrite, so a crawler gets real HTML and a visitor still gets the SPA.
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY at build time to
 * enumerate property and insight slugs. Without them it prerenders the static
 * routes and warns — a partial prerender is better than a failed build.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SERVER_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");

const SITE_ORIGIN = "https://www.l2sinfra.com";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace a tag matched by `pattern`, or append to <head> if absent. */
function upsert(html, pattern, replacement) {
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace("</head>", `    ${replacement}\n  </head>`);
}

function applyHead(html, meta) {
  const url = `${SITE_ORIGIN}${meta.path}`;
  const image = meta.image || DEFAULT_OG_IMAGE;
  const type = meta.type || "website";
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow";

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  out = upsert(out, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}">`);
  out = upsert(out, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots}">`);
  out = upsert(out, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}">`);
  out = upsert(out, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(meta.title)}">`);
  out = upsert(out, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(meta.description)}">`);
  out = upsert(out, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}">`);
  out = upsert(out, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(image)}">`);
  out = upsert(out, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}">`);
  out = upsert(out, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(meta.title)}">`);
  out = upsert(out, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(meta.description)}">`);
  out = upsert(out, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(image)}">`);
  return out;
}

/**
 * Environment variables pasted into a dashboard pick up stray characters —
 * a trailing space, wrapping quotes, a missing scheme. Any of those makes
 * `fetch` throw "Failed to parse URL", which is exactly how this failed on
 * Vercel: the value was present, but 70 property and insight pages silently
 * fell back to the SPA shell while the build still reported success.
 *
 * Normalising here is the right place for it — the value comes from outside
 * the program, so the program should not assume it is clean.
 */
function normalizeOrigin(raw) {
  let v = String(raw).trim().replace(/^['"]+|['"]+$/g, "").replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  return v;
}

async function fetchDynamicRoutes(routeMeta) {
  const url = process.env.VITE_SUPABASE_URL && normalizeOrigin(process.env.VITE_SUPABASE_URL);
  const key = process.env.VITE_SUPABASE_ANON_KEY?.trim().replace(/^['"]+|['"]+$/g, "");
  if (!url || !key) {
    console.warn(
      "  ! VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — skipping property\n" +
        "    and insight pages. Those URLs will fall back to the SPA shell.",
    );
    return [];
  }

  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const routes = [];

  try {
    const res = await fetch(
      `${url}/rest/v1/properties?select=slug,title,location,price,area,image_url,meta_title,meta_description&status=eq.available`,
      { headers },
    );
    if (res.ok) {
      for (const p of await res.json()) routes.push(routeMeta.propertyMeta(p));
    } else {
      console.warn(`  ! properties query returned ${res.status}`);
    }
  } catch (err) {
    console.warn("  ! properties query failed:", err.message);
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug,title,excerpt,image_url,meta_title,meta_description&is_published=eq.true`,
      { headers },
    );
    if (res.ok) {
      for (const b of await res.json()) routes.push(routeMeta.postMeta(b));
    } else {
      console.warn(`  ! blog_posts query returned ${res.status}`);
    }
  } catch (err) {
    console.warn("  ! blog_posts query failed:", err.message);
  }

  return routes;
}

async function main() {
  if (!existsSync(SERVER_ENTRY)) {
    console.error(`Server bundle missing at ${SERVER_ENTRY}. Run "vite build --ssr" first.`);
    process.exit(1);
  }

  const template = await readFile(path.join(DIST, "index.html"), "utf-8");
  const { render, ROUTE_META, propertyMeta, postMeta } = await import(SERVER_ENTRY);

  const routes = Object.values(ROUTE_META);
  routes.push(...(await fetchDynamicRoutes({ propertyMeta, postMeta })));

  let written = 0;
  for (const meta of routes) {
    let html;
    try {
      html = applyHead(template, meta);
      const appHtml = await render(meta.path);
      html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    } catch (err) {
      console.error(`  ✗ ${meta.path} — ${err.message}`);
      continue;
    }

    // Written in both shapes on purpose. Static hosts disagree about how a
    // extensionless path resolves: some look for "<route>.html", others for
    // "<route>/index.html". Serving only one form meant /properties fell
    // through to the SPA shell while /properties/ worked — which builds
    // cleanly and fails in production. vercel.json pins cleanUrls so exactly
    // one of these is the canonical URL and the rest 308 to it.
    if (meta.path === "/") {
      await writeFile(path.join(DIST, "index.html"), html, "utf-8");
    } else {
      const dir = path.join(DIST, meta.path);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "index.html"), html, "utf-8");

      const flat = path.join(DIST, `${meta.path}.html`);
      await mkdir(path.dirname(flat), { recursive: true });
      await writeFile(flat, html, "utf-8");
    }
    console.log(`  ✓ ${meta.path}`);
    written++;
  }

  await writeSitemap(routes);
  console.log(`\nPrerendered ${written} route${written === 1 ? "" : "s"}.`);

  // A build that quietly ships 7 pages instead of 77 looks identical to a
  // healthy one. Say so loudly.
  const dynamic = routes.length - Object.keys(ROUTE_META).length;
  if (dynamic <= 0) {
    console.warn(
      "\n  !! No property or insight pages were prerendered. Those URLs will\n" +
      "     fall back to the SPA shell and will not carry their own metadata.\n" +
      "     Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in the build env.",
    );
  } else {
    console.log(`  (${dynamic} of them from the database)`);
  }
}

/**
 * The sitemap was maintained by hand while the content lives in a CMS, so it
 * listed nine property slugs that could be deleted at any time and never
 * learned about new ones. Generating it here keeps it to exactly the URLs that
 * were prerendered.
 */
async function writeSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${r.path === "/" ? "/" : r.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n  </url>`,
    )
    .join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  await writeFile(path.join(DIST, "sitemap.xml"), xml, "utf-8");
  console.log(`  ✓ sitemap.xml (${routes.length} urls)`);
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
