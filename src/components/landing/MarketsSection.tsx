import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const markets = [
  {
    city: "Golf Course Road",
    neighborhoods: "Sectors 42–56, DLF Phases I–V",
    description:
      "Gurgaon's established address, and the one with the longest resale record. Supply is close to finished, which is what supports pricing here — but a unit's floor, tower and view drive a wide spread within the same project. Worth paying for. Worth checking carefully.",
  },
  {
    city: "Golf Course Extension Road",
    neighborhoods: "Sectors 58–67, SPR junction",
    description:
      "Where most new luxury launches now sit. The corridor is not uniform: proximity to the SPR interchange and to committed metro alignment separates sectors that will hold value from sectors currently priced as though they already have the infrastructure.",
  },
  {
    city: "Dwarka Expressway",
    neighborhoods: "Sectors 99–113, New Gurgaon",
    description:
      "Now operational, which removed the main risk the corridor was discounted for. The question has shifted from whether it opens to which sectors reach real occupancy first — an unoccupied tower is a rental yield of nothing, whatever the sticker price says.",
  },
  {
    city: "Sohna Road & South Gurgaon",
    neighborhoods: "Sectors 68–80, Sohna, Karma Lakeland",
    description:
      "Lower entry prices, longer horizons, and the widest quality gap between developers of any Gurgaon corridor. This is where the developer's delivery record matters more than the specification sheet. Also where most of the low-density and farmhouse stock sits.",
  },
  {
    city: "Delhi",
    neighborhoods: "South Delhi, Lutyens, Aerocity",
    description:
      "A different market entirely: supply-constrained, transacted privately, and priced on land rather than built-up area. Few listings, long searches, and title work that genuinely needs doing. We take Delhi mandates selectively.",
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
            Five corridors. Five{" "}
            <span className="text-gradient-gold">different arguments.</span>
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto mt-4">
            Gurgaon is not one market. What drives value on Golf Course Road has
            almost nothing to do with what drives it on Dwarka Expressway.
          </p>
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
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <Link to="/properties" className="text-primary hover:text-gold-light transition-colors">
                  Buying here? See what's available
                </Link>
                <Link to="/sell" className="text-primary hover:text-gold-light transition-colors">
                  Selling here? Get the comparables
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
