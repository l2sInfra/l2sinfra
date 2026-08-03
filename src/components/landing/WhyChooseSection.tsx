import { motion } from "framer-motion";
import { Trophy, Lock, UserCheck, BarChart3 } from "lucide-react";

const advantages = [
  {
    icon: Trophy,
    title: "One market, in depth",
    description: "Gurgaon and Delhi only, since 2010. We turn down mandates outside NCR rather than learn a city on your money.",
  },
  {
    icon: Lock,
    title: "The inventory nobody advertises",
    description: "Resale units, unsold stock held back from launch, and pre-launch allocations — the parts of the market that never reach a portal.",
  },
  {
    icon: UserCheck,
    title: "One advisor, start to finish",
    description: "The person who reads your requirement is the person at the site visit and at registry. Nothing is handed to a call centre.",
  },
  {
    icon: BarChart3,
    title: "We show our working",
    description: "Every recommendation comes with the corridor data behind it — comparables, occupancy, delivery record — so you can check the reasoning, not just the conclusion.",
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
