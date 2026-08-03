import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Half the business, and before this it was one service card and one FAQ.
 * Someone who came to sell had no route through the homepage at all — every
 * CTA, every Markets link and every option in the contact form assumed they
 * were buying.
 */
export function SellerSection() {
  return (
    <section id="selling" className="section-padding bg-cream">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Selling
          </p>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground leading-tight mb-6 max-w-2xl">
            The number your neighbour quotes you is not evidence.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Most Gurgaon flats are listed at the price of the most optimistic
                unit in the tower, sit for months, and sell at a discount to what
                they were always worth.
              </p>
              <p>
                We price yours against what comparable units in your sector
                actually transacted for, then run the sale — photography,
                listing, qualified viewings, negotiation and documentation
                through to registry. One point of contact, so you are not
                fielding calls from fifteen brokers.
              </p>
            </div>

            <div className="bg-muted border border-border rounded-xl p-6">
              <p className="font-heading text-lg font-bold text-foreground mb-2">
                Start with the number
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Tell us where the property is and we'll send you what comparable
                units in that sector actually sold for. No fee, no obligation.
              </p>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
              >
                Get my sector comparables <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
