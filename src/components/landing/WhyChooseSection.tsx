import { motion } from "framer-motion";
import { Trophy, Lock, UserCheck, BarChart3 } from "lucide-react";

const advantages = [
  {
    icon: Trophy,
    title: "Market Expertise",
    description: "15+ years of dedicated luxury real estate experience across India's top metros with deep market knowledge.",
  },
  {
    icon: Lock,
    title: "Exclusive Access",
    description: "Off-market properties and pre-launch opportunities through our direct Tier-1 developer partnerships.",
  },
  {
    icon: UserCheck,
    title: "Personalized Service",
    description: "White-glove, end-to-end service from discovery to handover — every detail managed for you.",
  },
  {
    icon: BarChart3,
    title: "Proven Track Record",
    description: "₹500+ Cr in transactions completed with 98% client satisfaction and repeat business rate.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Why L2S Infra
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            The L2S Infra <span className="text-gradient-gold">Advantage</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <adv.icon size={30} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{adv.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{adv.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
