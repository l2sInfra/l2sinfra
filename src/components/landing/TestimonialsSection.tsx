import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "L2S Infra transformed our property search into an effortless experience. Their deep understanding of Mumbai's luxury market helped us find a spectacular sea-facing penthouse in Worli that exceeded our expectations. The team handled everything — from negotiation to documentation — with remarkable professionalism. Their off-market access gave us options we never would have discovered on our own.",
    name: "Rajesh Kapoor",
    designation: "CEO, Tech Ventures",
    property: "Luxury Penthouse, Worli Mumbai",
  },
  {
    quote:
      "As an NRI based in Singapore, investing in Indian real estate seemed daunting. L2S Infra's dedicated NRI desk made it seamless. They arranged virtual tours, handled all legal complexities including power of attorney, and ensured FEMA compliance. Their transparency and regular updates gave me complete confidence throughout the process. I've now invested in three properties through them.",
    name: "Priya Sharma",
    designation: "Managing Director, Global Finance",
    property: "Premium Villa, Golf Course Road Gurgaon",
  },
  {
    quote:
      "The investment consulting from L2S Infra has been invaluable for our family office. They identified emerging micro-markets in Bangalore before they became mainstream, resulting in significant appreciation for our portfolio. Their research-backed approach, combined with genuine care for client interests, sets them apart from every other advisory we've worked with.",
    name: "Vikram Mehta",
    designation: "Family Office Principal",
    property: "Commercial Portfolio, Bangalore",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Trusted by <span className="text-gradient-gold">India's Elite</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-8 hover-lift"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-heading font-bold text-card-foreground">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.designation}</p>
                <p className="text-primary text-xs font-semibold mt-1">{t.property}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
