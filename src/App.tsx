import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Suspense, lazy } from "react";

// The homepage ships eagerly — it's the landing route and must paint fast.
import Index from "./pages/Index";

// Everything else is split out. The admin console alone drags in the rich-text
// editor and charting libraries; bundling it with the public site pushed the
// homepage past the JS budget.
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const BlogListing = lazy(() => import("./pages/BlogListing"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PropertiesListing = lazy(() => import("./pages/PropertiesListing"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

/** Shown while a route chunk loads. Matches the pages' own pt-24 offset. */
function RouteFallback() {
  return (
    <div
      className="min-h-screen bg-background pt-24"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/insights" element={<BlogListing />} />
              <Route path="/insights/:slug" element={<BlogPost />} />
              <Route path="/properties" element={<PropertiesListing />} />
              <Route path="/properties/:slug" element={<PropertyDetail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
