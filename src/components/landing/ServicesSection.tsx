import { motion } from "framer-motion";
import { Home, Building2, TrendingUp, Globe, Briefcase, FileCheck } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Buying a Home",
    description:
      "Apartments, builder floors and low-density homes across Gurgaon's five corridors and South Delhi. Our builder partnerships open pre-launch allocations and pricing that never reaches a portal — and we shortlist against what comparable units in the sector actually resold for.",
  },
  {
    icon: Briefcase,
    title: "Selling & Resale",
    description:
      "We price your unit against real transacted comparables in your sector, not the optimistic number down the corridor. Photography, listing, qualified viewings and the negotiation itself — run by us, so you are not fielding calls from fifteen brokers.",
  },
  {
    icon: Building2,
    title: "Commercial & Office",
    description:
      "Grade-A office and retail in Cyber City, Golf Course Road and Udyog Vihar, to buy, sell or lease. Commercial trades on the tenant and the lease covenant, not the lobby — so that is what we look at first.",
  },
  {
    icon: Globe,
    title: "NRI Services",
    description:
      "Buying or selling Gurgaon from abroad, without a relative doing you a favour. Video walkthroughs of the actual unit, FEMA and repatriation handled before you commit, power-of-attorney set up properly, and someone at the site reporting to you.",
  },
  {
    icon: TrendingUp,
    title: "Investment & Portfolio",
    description:
      "The corridor case written down: committed infrastructure against announced, occupancy in nearby completed towers, comparable resale spreads and the honest downside. For existing owners, which holdings to keep, which to exit, and when.",
  },
  {
    icon: FileCheck,
    title: "Due Diligence & Paperwork",
    description:
      "Title chain, encumbrance, RERA registration and filing history, approvals and occupation certificate, and the developer's real delivery record — done before money moves. Then documentation through to registry, on either side of the deal.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Services
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            What we actually{" "}
            <span className="text-gradient-gold">Solutions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-card rounded-2xl p-8 hover-lift border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svc.icon size={28} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-card-foreground mb-3">
                {svc.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                {svc.description}
              </p>
              <a href="#contact" className="text-primary text-sm font-semibold hover:text-gold-dark transition-colors">
                Learn More →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
