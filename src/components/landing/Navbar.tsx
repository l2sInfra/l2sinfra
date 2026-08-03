import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// Root-relative, not bare fragments. "#services" on /properties/some-slug
// resolves against that URL and matches nothing, so the whole nav was dead on
// every route except the homepage. Properties and Insights are real pages.
const navItems = [
  { label: "Services", to: "/#services" },
  { label: "Properties", to: "/properties" },
  { label: "Sell", to: "/sell" },
  { label: "Markets", to: "/#markets" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <m.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-md py-3"
          : "bg-secondary/80 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-heading text-2xl font-bold tracking-tight ${scrolled ? "text-foreground" : "text-secondary-foreground"}`}>
            L2S <span className="text-gradient-gold">Infra</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-gold-ink"
                  : "text-secondary-foreground/80 hover:text-secondary-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/#contact"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors duration-300"
          >
            Get in Touch
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2.5 -m-2.5 ${scrolled ? "text-foreground" : "text-secondary-foreground"}`}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id="mobile-nav"
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground font-medium py-2 min-h-[44px] flex items-center"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/#contact"
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold text-center"
              >
                Get in Touch
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
