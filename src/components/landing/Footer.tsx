import { MapPin, Phone, Mail } from "lucide-react";

const quickLinks = ["Services", "Properties", "Markets", "Insights", "Contact"];
const serviceLinks = [
  "Luxury Residential",
  "Commercial Real Estate",
  "Investment Consulting",
  "NRI Services",
  "Portfolio Management",
  "Due Diligence",
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto section-padding pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-heading text-3xl font-bold tracking-tight">
              L2S <span className="text-gradient-gold">Infra</span>
            </span>
            <p className="text-secondary-foreground/50 mt-4 max-w-xs leading-relaxed text-sm">
              India's premier luxury real estate advisory, curating extraordinary
              opportunities across the nation's most coveted addresses since 2010.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-secondary-foreground/50 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#services"
                    className="text-secondary-foreground/50 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-secondary-foreground/50">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                Bani City Centre, Sector 63, Gurgaon, Haryana
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:+919205505600" className="hover:text-primary transition-colors">+91-9205505600</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:connect@l2sinfra.com" className="hover:text-primary transition-colors">connect@l2sinfra.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/30 text-sm">
            © 2026 L2S Infra. All rights reserved. | RERA Registered
          </p>
          <div className="flex gap-6 text-secondary-foreground/30 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
