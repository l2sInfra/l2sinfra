import { motion } from "framer-motion";
import { Home, Building2, TrendingUp, Globe, Briefcase, FileCheck } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Luxury Residential Advisory",
    description:
      "Discover ultra-premium residences across India's most prestigious addresses. From sky villas and penthouses in Mumbai to heritage properties in Lutyens Delhi, we curate homes that match your lifestyle. Our advisors provide exclusive access to pre-launch opportunities and off-market listings.",
  },
  {
    icon: Building2,
    title: "Premium Commercial Real Estate",
    description:
      "Strategic commercial investments in Grade-A office spaces, retail flagships, and institutional-grade assets. We identify high-yield commercial properties in established business districts like BKC Mumbai, Cyber City Gurgaon, and Whitefield Bangalore with proven rental appreciation trajectories.",
  },
  {
    icon: TrendingUp,
    title: "Investment Consulting",
    description:
      "Data-driven investment strategies tailored for maximum returns. Our research team analyzes market trends, infrastructure developments, and regulatory changes to identify emerging high-growth corridors. We help you build a diversified real estate portfolio aligned with your financial goals.",
  },
  {
    icon: Globe,
    title: "NRI Property Services",
    description:
      "Comprehensive support for Non-Resident Indians looking to invest in Indian real estate. From virtual property tours and FEMA compliance to power-of-attorney assistance and seamless cross-border transactions, we handle every complexity so you can invest with confidence from anywhere.",
  },
  {
    icon: Briefcase,
    title: "Portfolio Management",
    description:
      "End-to-end portfolio management for multi-property investors. We monitor market valuations, manage rental yields, coordinate with property managers, and advise on optimal exit strategies. Our technology-driven approach ensures complete transparency and maximum return on your investments.",
  },
  {
    icon: FileCheck,
    title: "Due Diligence & Legal",
    description:
      "Rigorous due diligence covering title verification, RERA compliance, builder credibility, and legal documentation. Our legal team reviews every transaction to protect your interests, ensuring clear titles, proper approvals, and watertight agreements before any commitment is made.",
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
            Comprehensive Luxury Real Estate{" "}
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
