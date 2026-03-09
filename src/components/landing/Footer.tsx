import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-accent text-accent-foreground">
      <div className="max-w-7xl mx-auto section-padding pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <span className="font-heading text-3xl font-bold tracking-tight">
              L2S <span className="text-gradient-gold">Infra</span>
            </span>
            <p className="text-accent-foreground/50 mt-4 max-w-md leading-relaxed">
              India's premier real estate advisory, curating extraordinary 
              opportunities across the nation's most coveted addresses since 2010.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Portfolio", "Services", "Network", "Insights"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-accent-foreground/50 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-accent-foreground/50">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                DLF Cyber City, Sector 24, Gurgaon 122002
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                +91 22 4000 1234
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                hello@l2sestate.in
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-accent-foreground/30 text-sm">
            © 2026 L2S Estate. All rights reserved.
          </p>
          <div className="flex gap-6 text-accent-foreground/30 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
