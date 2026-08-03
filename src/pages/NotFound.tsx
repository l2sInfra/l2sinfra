import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { applySEO } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // The SPA rewrite serves index.html (HTTP 200) for unknown URLs, so noindex
    // is what keeps these out of the index — see docs/SEO-NOTES.md.
    applySEO({
      title: "Page not found | L2S Infra",
      description: "The page you were looking for isn't here.",
      path: location.pathname,
      noindex: true,
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-gold-ink underline hover:text-gold-ink/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
