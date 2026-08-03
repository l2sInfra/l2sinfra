import { useEffect, useState } from "react";
import type { PostgrestResponse } from "@supabase/supabase-js";

/**
 * Four states, not two.
 *
 * Every data surface here was written as `loading ? skeleton : content`, and
 * every query discarded its `error` field — so a failed request set `data` to
 * null, `?? []` turned that into an empty array, and an outage rendered as
 * "0 properties found". A confident false statement about the business.
 *
 * Returning a discriminated state makes rendering a failure as "empty"
 * unrepresentable rather than something to remember at nine call sites.
 */
export type QueryState = "loading" | "error" | "empty" | "ready";

interface Result<T> {
  rows: T[];
  state: QueryState;
  /** Re-runs the query. Wire this to the retry button in the error state. */
  retry: () => void;
}

/**
 * PostgrestResponse rather than a hand-written shape: a structural `{ data,
 * error }` is satisfied by the `any` an unknown table name produces, so a
 * typo'd table inside the callback type-checked even with the Database generic
 * applied. This signature makes the callback's result a constrained position.
 */
type Fetcher<T> = () => PromiseLike<PostgrestResponse<T>>;

export function useQueryState<T>(fetcher: Fetcher<T>, deps: unknown[] = []): Result<T> {
  const [rows, setRows] = useState<T[]>([]);
  const [state, setState] = useState<QueryState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState("loading");

    fetcher().then(({ data, error }) => {
      // Guards against a slow response landing after the inputs changed or the
      // component unmounted — otherwise a stale result overwrites a fresh one.
      if (cancelled) return;
      if (error) {
        console.error("Query failed:", error);
        setState("error");
        return;
      }
      setRows(data ?? []);
      setState(data && data.length > 0 ? "ready" : "empty");
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { rows, state, retry: () => setAttempt((n) => n + 1) };
}
