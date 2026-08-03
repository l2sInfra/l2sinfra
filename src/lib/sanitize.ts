import DOMPurify from "dompurify";

/**
 * Sanitise admin-authored HTML before it reaches the DOM.
 *
 * The rich-text editor constrains what an author can *type*; it is not a
 * sanitiser. `blog_posts.content` is a plain text column and PostgREST accepts
 * any string, so anyone able to write to the table — which, under the current
 * RLS policies, is any authenticated user — can store markup that the editor
 * would never produce.
 *
 * `<script>` inserted via innerHTML does not execute, but `<img onerror>`,
 * `<svg onload>` and `javascript:` URIs do. supabase-js keeps the session in
 * localStorage, so an unsanitised payload steals the owner's admin token the
 * moment they view their own post.
 *
 * Sanitise on render — that is the trust boundary. Sanitising only on write
 * protects nothing that was written another way.
 */
const ALLOWED_TAGS = [
  "p", "br", "hr",
  "h2", "h3", "h4",
  "strong", "em", "s", "u",
  "ul", "ol", "li",
  "blockquote",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "width", "height"];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Blocks javascript:, data: and vbscript: in href/src.
    ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):|^\/|^#/i,
    // h1 belongs to the page, not to the body copy — two h1s break the outline.
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input", "h1"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
  });
}
