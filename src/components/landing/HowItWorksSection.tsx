import { motion } from "framer-motion";
import { MessageSquare, ListFilter, Eye, FileSignature, KeyRound } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Discovery Consultation",
    description: "We begin with a confidential consultation to understand your lifestyle preferences, investment goals, budget, and preferred locations to create a personalized search strategy.",
  },
  {
    icon: ListFilter,
    title: "Curated Shortlisting",
    description: "Our advisors leverage market intelligence and exclusive developer networks to shortlist properties that precisely match your criteria, including off-market opportunities.",
  },
  {
    icon: Eye,
    title: "Property Viewings",
    description: "Experience guided property tours with our experts who provide insights on construction quality, neighborhood dynamics, appreciation potential, and lifestyle aspects.",
  },
  {
    icon: FileSignature,
    title: "Negotiation & Documentation",
    description: "We negotiate the best terms on your behalf and manage all legal documentation, ensuring RERA compliance, clear titles, and secure transaction processes.",
  },
  {
    icon: KeyRound,
    title: "Seamless Handover",
    description: "From final inspection to key handover, we oversee every detail. Post-purchase, we assist with interiors, rental management, and ongoing portfolio monitoring.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Your Journey to{" "}
            <span className="text-gradient-gold">Luxury Living</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <step.icon size={24} className="text-primary" />
              </div>
              <span className="text-primary/40 font-heading text-sm font-bold">Step {i + 1}</span>
              <h3 className="font-heading text-lg font-bold mt-1 mb-2">{step.title}</h3>
              <p className="text-secondary-foreground/60 text-xs leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
