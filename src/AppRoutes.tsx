import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";

// The homepage ships eagerly — it's the landing route and must paint fast.
import Index from "./pages/Index";

// Everything else is split out. The admin console alone drags in the rich-text
// editor and charting libraries; bundling it with the public site pushed the
// homepage past the JS budget.
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const BlogListing = lazy(() => import("./pages/BlogListing"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PropertiesListing = lazy(() => import("./pages/PropertiesListing"));
const Sell = lazy(() => import("./pages/Sell"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Shown while a route chunk loads. Matches the pages' own pt-24 offset. */
function RouteFallback() {
  return (
    <div className="min-h-screen bg-background pt-24" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * React Router sets the hash but never scrolls to it, so every "/#services"
 * link from a non-home route dropped the visitor at the top of the homepage.
 * The offset clears the fixed navbar.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so the target route has committed.
    const id = requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}

/**
 * Everything inside the router. Kept separate from App so the prerenderer can
 * mount the same tree under a StaticRouter — the HTML a crawler receives and
 * the DOM the client hydrates are then produced by identical code.
 */
export function AppRoutes() {
  return (
    // reducedMotion="user" makes framer-motion honour the OS setting; it does
    // not by default, and this site runs five parallax rigs and ~40 animations.
    <MotionConfig reducedMotion="user">
      {/* LazyMotion + `m` instead of `motion`: the full motion component
          statically pulls in layout-projection and drag machinery — ~33 kB raw
          of code this site never touches, since nothing uses drag, layout or
          layoutId. `strict` makes a stray `motion.*` throw rather than silently
          reintroducing the whole bundle. */}
      <LazyMotion features={domAnimation} strict>
      <Sonner />
      <ScrollToHash />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/insights" element={<BlogListing />} />
            <Route path="/insights/:slug" element={<BlogPost />} />
            <Route path="/properties" element={<PropertiesListing />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Admin. AuthProvider lives here rather than at the root so the
                public site doesn't fire a getSession() call and open an auth
                state subscription for a visitor who will never log in. */}
            <Route
              path="/admin/*"
              element={
                <AuthProvider>
                  <Routes>
                    <Route path="login" element={<AdminLogin />} />
                    {/* Outside ProtectedRoute: the recovery link establishes a
                        session, but the user must land here either way. */}
                    <Route path="reset-password" element={<AdminResetPassword />} />
                    <Route
                      path="*"
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </AuthProvider>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      </LazyMotion>
    </MotionConfig>
  );
}
