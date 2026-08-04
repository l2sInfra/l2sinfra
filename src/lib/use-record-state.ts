import { useEffect, useState } from "react";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * A single record by slug, with the three failure modes kept apart.
 *
 * Both detail pages previously did this:
 *
 *   useEffect(() => {
 *     supabase.from(...).eq("slug", slug).single().then(({data, error}) => {
 *       if (error || !data) setNotFound(true); else setProperty(data);
 *       setLoading(false);
 *     });
 *   }, [slug]);
 *
 * Three defects in that shape:
 *
 *  1. `loading` is never reset when the slug changes, so navigating A -> B
 *     renders A's title, price, images and CTAs under B's URL until B lands.
 *  2. No cancellation, so if A resolves after B it overwrites B permanently —
 *     including writing A's canonical and og:url onto B's page.
 *  3. `error || !data` collapses "no such row" into "the database is down". A
 *     Supabase incident therefore redirected every property page to the
 *     listing, which then reported zero results.
 *
 * PGRST116 is PostgREST's "no rows returned" for .single(); anything else is a
 * real failure and must not be shown as a 404.
 */
export type RecordState = "loading" | "error" | "missing" | "ready";

interface Result<T> {
  record: T | null;
  state: RecordState;
  retry: () => void;
}

/** See the note in use-query-state: a structural shape lets `any` through. */
type Fetcher<T> = () => PromiseLike<PostgrestSingleResponse<T>>;

export function useRecordState<T>(fetcher: Fetcher<T>, deps: unknown[]): Result<T> {
  const [record, setRecord] = useState<T | null>(null);
  const [state, setState] = useState<RecordState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Reset before the request, not after it — otherwise the previous record
    // stays on screen under the new URL.
    setState("loading");
    setRecord(null);

    fetcher().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        if (error.code === "PGRST116") {
          setState("missing");
          return;
        }
        console.error("Record fetch failed:", error);
        setState("error");
        return;
      }
      if (!data) {
        setState("missing");
        return;
      }
      setRecord(data);
      setState("ready");
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { record, state, retry: () => setAttempt((n) => n + 1) };
}
