import { motion } from "framer-motion";
import { MessageSquare, ListFilter, Eye, FileSignature, KeyRound } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "The brief",
    description: "What you are trying to achieve and by when — buying or selling. If you are buying, the horizon decides which corridors are worth discussing at all. If you are selling, it decides the price we can realistically hold out for.",
  },
  {
    icon: ListFilter,
    title: "The shortlist, or the price",
    description: "Buyers get a written view on the corridors that fit and a shortlist drawn from it — including pre-launch allocations through our builder partnerships and resale stock that never reaches a portal. Sellers get a price backed by what comparable units in the sector actually fetched.",
  },
  {
    icon: Eye,
    title: "Viewings",
    description: "Buyers see the actual unit, not the show flat — which way it faces at four in the afternoon, what is planned on the adjoining plot, how the completed phases have aged. Sellers get qualified buyers brought to them, not a stream of tyre-kickers.",
  },
  {
    icon: FileSignature,
    title: "Diligence and negotiation",
    description: "Title chain, encumbrance, RERA filing history, approvals and occupation certificate — checked before any money moves. Then we run the negotiation: price, payment schedule, and the clauses that will matter on exit.",
  },
  {
    icon: KeyRound,
    title: "Registry and after",
    description: "Documentation through to registry on either side of the deal, snagging at handover, and a standing view on the asset afterwards — what it is worth, what it should rent for, and when it is better sold than held.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            How the work{" "}
            <span className="text-gradient-gold">actually goes</span>
          </h2>
        </motion.div>

        {/* Roadmap layout */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full" />

          {/* Connecting line - mobile */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-primary/30 via-primary to-primary/30 rounded-full" />

          {/* Desktop: horizontal roadmap */}
          <div className="hidden md:grid md:grid-cols-5 gap-8 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center relative"
              >
                {/* Node circle */}
                <div className="relative z-10 mx-auto mb-6">
                  <div className="w-[104px] h-[104px] rounded-full bg-primary/10 border-4 border-gold-ink flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                    <step.icon size={32} className="text-gold-ink" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical roadmap */}
          <div className="md:hidden space-y-10 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 relative"
              >
                {/* Node */}
                <div className="relative z-10 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-gold-ink flex items-center justify-center shadow-lg shadow-primary/20">
                    <step.icon size={24} className="text-gold-ink" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
