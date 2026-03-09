import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import luxuryImg from "@/assets/luxury-residential.jpg";
import commercialImg from "@/assets/commercial.jpg";
import landsImg from "@/assets/lands-farmhouses.jpg";

const categories = [
  {
    title: "Ultra-Luxury Residential",
    description: "Handpicked residences in India's most prestigious addresses. Sky villas, penthouses, and bespoke homes.",
    image: luxuryImg,
    stats: "₹5Cr — ₹100Cr+",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Strategic Commercial",
    description: "Grade-A office spaces, retail flagships, and institutional-grade commercial assets.",
    image: commercialImg,
    stats: "8-12% Yield",
    span: "md:col-span-1",
  },
  {
    title: "Emerging Assets",
    description: "Pre-launch opportunities and high-growth corridor investments with exceptional ROI potential.",
    image: emergingImg,
    stats: "30%+ Appreciation",
    span: "md:col-span-1",
  },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Portfolio
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Curated for the
            <br />
            <span className="text-gradient-gold">Discerning Few</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer hover-lift ${cat.span}`}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-primary text-xs font-bold tracking-widest uppercase">
                  {cat.stats}
                </span>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-accent-foreground mt-2 mb-2">
                  {cat.title}
                </h3>
                <p className="text-accent-foreground/60 text-sm leading-relaxed max-w-md">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore <ArrowUpRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
