import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Fail fast in the browser: a half-configured app that renders and then can't
 * load anything is worse than one that says so.
 *
 * Not during prerendering, though. `renderToString` never runs effects, so no
 * query is ever issued at build time — the module only needs to import
 * cleanly. Throwing there would make a missing variable break the build with a
 * stack trace instead of surfacing where it actually matters.
 */
const isBrowser = typeof window !== "undefined";

if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local",
  );
}

/**
 * NOT typed with <Database> — and that is a known gap, not an oversight.
 *
 * src/lib/database.types.ts is hand-written and is not compatible with
 * supabase-js 2.99: applying the generic makes every Insert resolve to `never`
 * and produces 16 compile errors across the forms and the admin console. The
 * fix is to generate the file properly —
 *
 *     supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 *
 * — which needs project credentials. Until then queries return `any`, so a
 * typo'd column or table name will not be caught at compile time.
 */
export const supabase = createClient(
  supabaseUrl ?? "https://prerender.invalid",
  supabaseAnonKey ?? "prerender-placeholder",
);
