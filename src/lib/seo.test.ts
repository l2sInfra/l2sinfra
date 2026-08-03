import { describe, it, expect, beforeEach } from "vitest";
import { applySEO, SITE_ORIGIN, DEFAULT_OG_IMAGE, DEFAULT_DESCRIPTION } from "./seo";

const canonical = () =>
  document.head.querySelector('link[rel="canonical"]')?.getAttribute("href");
const meta = (sel: string) =>
  document.head.querySelector(sel)?.getAttribute("content");

describe("applySEO", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("points the canonical at the www origin, matching the sitemap", () => {
    applySEO({ title: "Properties", path: "/properties" });
    expect(canonical()).toBe("https://www.l2sinfra.com/properties");
    expect(SITE_ORIGIN).toBe("https://www.l2sinfra.com");
  });

  it("sets title, description and Open Graph tags together", () => {
    applySEO({
      title: "DLF The Arbour | L2S Infra",
      description: "A four-bedroom residence on Golf Course Extension Road.",
      path: "/properties/dlf-the-arbour-sector-63-gurgaon",
      image: "https://cdn.example.com/arbour.jpg",
    });

    expect(document.title).toBe("DLF The Arbour | L2S Infra");
    expect(meta('meta[name="description"]')).toContain("Golf Course Extension");
    expect(meta('meta[property="og:title"]')).toBe("DLF The Arbour | L2S Infra");
    expect(meta('meta[property="og:url"]')).toBe(
      "https://www.l2sinfra.com/properties/dlf-the-arbour-sector-63-gurgaon",
    );
    expect(meta('meta[property="og:image"]')).toBe("https://cdn.example.com/arbour.jpg");
    expect(meta('meta[name="twitter:image"]')).toBe("https://cdn.example.com/arbour.jpg");
  });

  it("falls back to the site share image when the page has none", () => {
    applySEO({ title: "Insights", path: "/insights" });
    expect(meta('meta[property="og:image"]')).toBe(DEFAULT_OG_IMAGE);
    expect(DEFAULT_OG_IMAGE).toBe("https://www.l2sinfra.com/og-image.jpg");
  });

  it("marks a page noindex when asked, and indexable otherwise", () => {
    applySEO({ title: "Admin", path: "/admin", noindex: true });
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");

    applySEO({ title: "Home", path: "/" });
    expect(meta('meta[name="robots"]')).toBe("index, follow");
  });

  it("replaces the previous route's tags instead of appending duplicates", () => {
    applySEO({ title: "Insights", description: "First", path: "/insights" });
    applySEO({ title: "Properties", description: "Second", path: "/properties" });

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[property="og:url"]')).toHaveLength(1);
    expect(canonical()).toBe("https://www.l2sinfra.com/properties");
    expect(meta('meta[name="description"]')).toBe("Second");
  });

  it("does not leak a description from the previous route", () => {
    // The realistic condition: index.html ships a populated head.
    document.head.innerHTML =
      '<meta name="description" content="Homepage marketing copy">' +
      '<link rel="canonical" href="https://www.l2sinfra.com/">';

    applySEO({ title: "An article", description: "Article specific", path: "/insights/a" });
    expect(meta('meta[name="description"]')).toBe("Article specific");

    // A route with no description of its own must not inherit the last one.
    applySEO({ title: "Admin", path: "/admin", noindex: true });
    expect(meta('meta[name="description"]')).toBe(DEFAULT_DESCRIPTION);
    expect(meta('meta[property="og:description"]')).toBe(DEFAULT_DESCRIPTION);
  });

  it("treats an empty-string description as absent", () => {
    applySEO({ title: "First", description: "Real copy", path: "/a" });
    applySEO({ title: "Second", description: "   ", path: "/b" });
    expect(meta('meta[name="description"]')).toBe(DEFAULT_DESCRIPTION);
  });

  it("sets article type for blog posts and website by default", () => {
    applySEO({ title: "A post", path: "/insights/x", type: "article" });
    expect(meta('meta[property="og:type"]')).toBe("article");

    applySEO({ title: "Home", path: "/" });
    expect(meta('meta[property="og:type"]')).toBe("website");
  });
});
