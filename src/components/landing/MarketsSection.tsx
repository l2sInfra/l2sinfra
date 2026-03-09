import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const markets = [
  {
    city: "Mumbai",
    neighborhoods: "Worli, Bandra, Lower Parel, BKC, Juhu",
    description:
      "India's financial capital offers unmatched luxury living with sea-facing penthouses, heritage apartments, and world-class commercial spaces in South Mumbai and the Western suburbs.",
  },
  {
    city: "Delhi NCR",
    neighborhoods: "Lutyens, Golf Course Road, Aerocity, Noida",
    description:
      "From Lutyens' heritage bungalows to Gurgaon's ultra-modern sky villas, Delhi NCR presents diverse premium opportunities across residential, commercial, and institutional segments.",
  },
  {
    city: "Bangalore",
    neighborhoods: "Whitefield, UB City, Koramangala, Hebbal",
    description:
      "India's tech capital combines modern luxury with excellent appreciation potential. Premium apartments near tech corridors and villa communities offer outstanding lifestyle and investment value.",
  },
  {
    city: "Pune",
    neighborhoods: "Koregaon Park, Kalyani Nagar, Boat Club Road",
    description:
      "An emerging luxury market with strong fundamentals. Premium villas and apartments in East Pune's established neighborhoods offer excellent value compared to Mumbai's price points.",
  },
  {
    city: "Hyderabad",
    neighborhoods: "Jubilee Hills, Banjara Hills, Gachibowli, HITEC City",
    description:
      "Hyderabad's luxury segment is experiencing rapid growth, driven by the tech boom. Premium gated communities and commercial spaces offer compelling appreciation and rental yields.",
  },
];

export function MarketsSection() {
  return (
    <section id="markets" className="section-padding bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Markets
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Presence Across India's{" "}
            <span className="text-gradient-gold">Premier Destinations</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market, i) => (
            <motion.div
              key={market.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group border border-secondary-foreground/10 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-primary" />
                <h3 className="font-heading text-2xl font-bold">{market.city}</h3>
              </div>
              <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                {market.neighborhoods}
              </p>
              <p className="text-secondary-foreground/60 text-sm leading-relaxed">
                {market.description}
              </p>
              <a href="#contact" className="inline-block mt-4 text-primary text-sm font-semibold hover:text-gold-light transition-colors">
                Explore Properties →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
