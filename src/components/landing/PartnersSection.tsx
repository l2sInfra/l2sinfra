import { motion } from "framer-motion";

const partners = [
  { name: "DLF", abbr: "DLF" },
  { name: "Lodha", abbr: "LDH" },
  { name: "Godrej Properties", abbr: "GOD" },
  { name: "Sobha Limited", abbr: "SOB" },
  { name: "Birla Estates", abbr: "BRL" },
  { name: "Adani Realty", abbr: "ADN" },
  { name: "Trump Towers", abbr: "TRM" },
  { name: "Emaar India", abbr: "EMR" },
];

export function PartnersSection() {
  return (
    <section id="network" className="section-padding bg-accent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Network
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-accent-foreground">
            Trusted by <span className="text-gradient-gold">India's Finest</span>
          </h2>
          <p className="text-accent-foreground/50 mt-6 max-w-2xl mx-auto text-lg">
            Direct partnerships with Tier-1 developers ensuring you get priority access, 
            the best pricing, and unmatched after-sales support.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border border-accent-foreground/10 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-accent-foreground/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <span className="font-heading text-xl font-bold text-accent-foreground/40 group-hover:text-primary transition-colors">
                  {partner.abbr}
                </span>
              </div>
              <span className="text-accent-foreground/60 text-sm font-medium text-center">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
