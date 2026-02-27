import { motion } from "framer-motion";
import { Handshake, PieChart, Globe } from "lucide-react";

const services = [
  {
    icon: Handshake,
    title: "End-to-End Handholding",
    description:
      "From property discovery to registration, we manage every detail so you don't have to. Legal, financial, and logistical — all handled.",
  },
  {
    icon: PieChart,
    title: "Portfolio Advisory",
    description:
      "Strategic asset allocation across residential, commercial, and land. Data-driven insights to maximize your real estate portfolio returns.",
  },
  {
    icon: Globe,
    title: "NRI Desk",
    description:
      "Dedicated support for Non-Resident Indians. Virtual site tours, power-of-attorney assistance, and seamless cross-border transactions.",
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
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground">
            White-Glove <span className="text-gradient-gold">Service</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group bg-card rounded-2xl p-10 hover-lift border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors duration-300">
                <svc.icon size={28} className="text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-card-foreground mb-4">
                {svc.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {svc.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
