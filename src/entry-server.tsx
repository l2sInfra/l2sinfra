import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./AppRoutes";

// Re-exported so the prerender script has one module to import.
export { ROUTE_META, propertyMeta, postMeta } from "./lib/route-meta";

/** Marker the Suspense fallback renders; used to detect an unresolved chunk. */
const FALLBACK_MARKER = "Loading…";

/**
 * Renders a route to HTML at build time.
 *
 * Two wrinkles worth knowing about:
 *
 * 1. Effects don't run during renderToString, so every Supabase-backed section
 *    renders its initial state — the loading skeleton. That is deliberate: it
 *    is exactly what the client renders on first mount, so hydration matches
 *    and there is no mismatch or flash.
 *
 * 2. Routes are React.lazy, and renderToString is synchronous, so the first
 *    pass can only ever emit the Suspense fallback: lazy() starts its import
 *    and throws a thenable that a sync renderer cannot await. Rendering
 *    repeatedly, yielding between passes, lets each chunk resolve — the first
 *    pass starts the import, later passes find it already resolved. Nested
 *    lazies need one pass each, hence the loop.
 */
export async function render(url: string): Promise<string> {
  let html = "";

  for (let pass = 0; pass < 6; pass++) {
    html = renderToString(
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>,
    );
    if (!html.includes(FALLBACK_MARKER)) return html;
    // Yield so the pending dynamic import can settle before the next pass.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return html;
}
