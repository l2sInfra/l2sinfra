import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContact } from "@/lib/site-contact";

const quickLinks = [
  { label: "Services", href: "/#services" },
  { label: "Properties", href: "/properties" },
  { label: "Markets", href: "/#markets" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/#contact" },
];

// Must match the cards in ServicesSection — they sit on the same page.
const serviceLinks = [
  "Buying a Home",
  "Selling & Resale",
  "Commercial & Office",
  "NRI Services",
  "Investment & Portfolio",
  "Due Diligence & Paperwork",
];

export function Footer() {
  const contact = useSiteContact();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto section-padding pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-heading text-3xl font-bold tracking-tight">
              L2S <span className="text-gradient-gold">Infra</span>
            </span>
            <p className="text-secondary-foreground/70 mt-4 max-w-xs leading-relaxed text-sm">
              A luxury real estate agency for Gurgaon and Delhi — buying, selling
              and partnered with the premium builders. In one market since 2010.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/#services"
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-secondary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                {contact.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <a href={`tel:${contact.phoneE164}`} className="hover:text-primary transition-colors">{contact.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/70 text-sm">
            © {new Date().getFullYear()} L2S Infra. All rights reserved.
          </p>
          <div className="flex gap-6 text-secondary-foreground/70 text-sm">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
