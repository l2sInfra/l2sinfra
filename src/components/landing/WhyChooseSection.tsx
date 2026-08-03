import { m } from "framer-motion";
import { Trophy, Lock, UserCheck, BarChart3 } from "lucide-react";

const advantages = [
  {
    icon: Trophy,
    title: "One market, in depth",
    description: "Gurgaon and Delhi since 2010, and nowhere else. We turn down mandates outside NCR rather than learn a city on your money.",
  },
  {
    icon: Lock,
    title: "Premium builder partnerships",
    description: "Direct relationships with the developers building these corridors — pre-launch allocations, held-back inventory and pricing that never reaches a portal.",
  },
  {
    icon: UserCheck,
    title: "We work both sides",
    description: "Buying and selling. When you exit, the same sector knowledge that found you the unit is what prices and negotiates it.",
  },
  {
    icon: BarChart3,
    title: "We show our working",
    description: "Every recommendation comes with the data behind it — comparables, occupancy, delivery record — so you can check the reasoning, not just the conclusion.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Why L2S Infra
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            The L2S Infra <span className="text-gradient-gold">Advantage</span>
          </h2>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, i) => (
            <m.div
              key={adv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <adv.icon size={30} className="text-gold-ink" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{adv.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{adv.description}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
