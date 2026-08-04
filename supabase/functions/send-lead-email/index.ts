import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Notifies the office of a new website enquiry.
 *
 * Threat notes, because this endpoint is effectively public — Supabase's
 * verify_jwt is satisfied by the anon key, which ships in the browser bundle:
 *
 *  - Every interpolated value is HTML-escaped. Unescaped, an attacker could
 *    put `<a href="https://evil/">View in Admin Panel</a>` in the message and
 *    deliver a phishing link DKIM-signed by l2sinfra.com, from
 *    connect@l2sinfra.com, into connect@l2sinfra.com. That email passes every
 *    authenticity check a recipient can perform.
 *  - The body is validated and length-capped, so a 10 MB "name" is rejected.
 *  - Requests are rate-limited per IP to bound both Resend spend and inbox
 *    flooding. The limiter is in-memory, so it is per-instance and resets on
 *    cold start — a speed bump, not a wall. A durable counter (Upstash, or a
 *    Postgres table) is the real fix.
 *  - CORS is restricted to the production origins.
 *  - Provider responses are never echoed back to the caller; they leak message
 *    ids and internal error detail.
 */

const ALLOWED_ORIGINS = [
  "https://www.l2sinfra.com",
  "https://l2sinfra.com",
];

const OFFICE_INBOX = "connect@l2sinfra.com";

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

/** Escapes the five characters that matter in an HTML body. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Field {
  key: string;
  label: string;
  required: boolean;
  max: number;
}

const FIELDS: Field[] = [
  { key: "full_name", label: "Name", required: true, max: 100 },
  { key: "email", label: "Email", required: true, max: 255 },
  { key: "phone", label: "Phone", required: true, max: 20 },
  { key: "property_interest", label: "Property Interest", required: true, max: 100 },
  { key: "budget_range", label: "Budget", required: true, max: 50 },
  { key: "preferred_location", label: "Preferred Location", required: false, max: 100 },
  { key: "message", label: "Message", required: false, max: 1000 },
];

function validate(body: Record<string, unknown>): { ok: true; values: Record<string, string> } | { ok: false } {
  const values: Record<string, string> = {};
  for (const f of FIELDS) {
    const raw = body[f.key];
    if (raw !== undefined && typeof raw !== "string") return { ok: false };
    const value = (raw as string | undefined)?.trim() ?? "";
    if (f.required && value.length === 0) return { ok: false };
    if (value.length > f.max) return { ok: false };
    values[f.key] = value;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) return { ok: false };
  return { ok: true, values };
}

// Per-instance sliding window. Bounds abuse; does not eliminate it.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude ceiling on memory growth
  return recent.length > RATE_LIMIT.max;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Honeypot: a hidden field only a bot fills in. Accept and discard, so the
    // bot sees success and doesn't retry.
    if (typeof (body as Record<string, unknown>).company === "string" &&
        (body as Record<string, unknown>).company !== "") {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const parsed = validate(body as Record<string, unknown>);
    if (!parsed.ok) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const v = parsed.values;

    const rows = FIELDS.map(
      (f) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">${esc(f.label)}</td>` +
        `<td style="padding:8px;border:1px solid #ddd">${esc(v[f.key] || "Not specified")}</td></tr>`,
    ).join("");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: `L2S Infra Website <${OFFICE_INBOX}>`,
        to: [OFFICE_INBOX],
        reply_to: v.email,
        // Subject is not attacker-controlled: the name goes in the body only.
        subject: "New enquiry from the L2S Infra website",
        html: `
          <h2>New enquiry from the L2S Infra website</h2>
          <table style="border-collapse:collapse;width:100%">${rows}</table>
          <p style="margin-top:16px">
            <a href="https://www.l2sinfra.com/admin" style="background:#8a6420;color:white;padding:10px 20px;text-decoration:none;border-radius:6px">Open the admin console</a>
          </p>
          <p style="color:#647487;font-size:12px;margin-top:16px">
            Sent automatically from the website contact form. The enquiry is already saved in the CRM.
          </p>
        `,
      }),
    });

    if (!res.ok) {
      // Log for the operator; do not hand provider internals to the caller.
      console.error("Resend rejected the send:", res.status, await res.text());
      return new Response(JSON.stringify({ error: "Could not send notification" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-lead-email failed:", err);
    return new Response(JSON.stringify({ error: "Could not send notification" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
