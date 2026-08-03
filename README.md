# L2S Infra — website

Marketing site and admin console for L2S Infra, a luxury real estate agency
operating in Gurgaon and Delhi NCR. Live at **https://www.l2sinfra.com**.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + shadcn/ui (Radix primitives)
- **React Router** (client-side routing, SPA)
- **Supabase** — Postgres, auth, storage; schema in `supabase-schema.sql`
- **Vercel** — hosting; `vercel.json` rewrites all paths to `index.html`

## Local development

Requires Node 20+.

```sh
npm install
npm run dev        # http://localhost:8080
```

Other scripts:

```sh
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run test       # vitest
```

### Environment

Supabase credentials are read from Vite env vars. Create `.env.local`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Project layout

```
index.html                   static <head> — SEO defaults, JSON-LD, fonts, GA4
public/                      favicons, og-image, robots.txt, sitemap.xml
src/lib/site-contact.ts      phone / WhatsApp / email — ONE source of truth
src/lib/seo.ts               per-route title, canonical + Open Graph tags
src/components/landing/      homepage sections
src/pages/                   routed pages, incl. the /admin console
supabase/functions/          edge functions (lead notification email)
```

## Things worth knowing before you edit

**Contact details live in one file.** Phone, WhatsApp and email come from
`src/lib/site-contact.ts`. Change them there — never hardcode a number in a
component. The one copy that can't import it is the JSON-LD block in
`index.html`; keep it in sync by hand.

**Every route must set its own SEO tags.** This is a single-page app, so every
URL is served the same `index.html`. Without an `applySEO()` call, a page reports
the *homepage's* canonical and Open Graph tags, and search engines treat it as a
duplicate. Any new route needs an `applySEO({ title, description, path })` in an
effect. Admin and error pages pass `noindex: true`.

**Canonical domain is `https://www.l2sinfra.com`** (with `www`). It is set in
`SITE_ORIGIN` in `src/lib/seo.ts`, in `index.html`, and in `public/sitemap.xml` —
these three must agree exactly, and non-www must 301 to www at the DNS/host
level.

**`public/sitemap.xml` is maintained by hand.** Property and insight URLs are
listed literally, so publishing or unpublishing content in the admin console
does not update it. Update it when content changes.

**SEO limits.** Because rendering is client-side, crawlers that don't execute
JavaScript — which includes most social-preview bots — see only the static tags
in `index.html`. Unknown URLs also return HTTP 200 rather than 404 (the SPA
rewrite), so 404s are handled with a `noindex` tag instead of a status code.
Prerendering would fix both and is the recommended next step.
