import { motion } from "framer-motion";
import { Home, Building2, TrendingUp, Globe, Briefcase, FileCheck } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Advisory",
    description:
      "Apartments, builder floors and low-density homes across Gurgaon's five corridors and South Delhi. We shortlist against resale evidence in the same sector rather than the launch brochure, and we tell you which towers within a project to avoid.",
  },
  {
    icon: Building2,
    title: "Commercial & Office",
    description:
      "Grade-A office and retail in Cyber City, Golf Course Road and Udyog Vihar. Commercial is bought on the tenant, not the lobby — so we look at the lease covenant, the escalation clause and the exit market before the specification.",
  },
  {
    icon: TrendingUp,
    title: "Investment Analysis",
    description:
      "The corridor case, written down. Committed infrastructure against announced infrastructure, absorption and occupancy in nearby completed towers, comparable resale spreads, and the honest downside. If the numbers argue against buying, that is what the note will say.",
  },
  {
    icon: Globe,
    title: "NRI Advisory",
    description:
      "Buying Gurgaon from abroad, without a relative doing you a favour. Video walkthroughs of the actual unit, FEMA and repatriation questions answered before you commit, power-of-attorney set up properly, and someone at the site who reports to you.",
  },
  {
    icon: Briefcase,
    title: "Portfolio Review",
    description:
      "For owners of several NCR assets. Current valuations against the sector, which holdings are carrying the portfolio and which are dead money, rental performance versus achievable, and when a unit is better sold than held.",
  },
  {
    icon: FileCheck,
    title: "Due Diligence",
    description:
      "Title chain, encumbrance, RERA registration and its filing history, approval and occupation certificate status, and the developer's actual delivery record on their last completed projects. Done before you pay a booking amount, not after.",
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
