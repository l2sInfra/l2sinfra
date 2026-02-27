import { motion } from "framer-motion";
import { Search, MapPin, Home, Building2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const trustItems = [
  "₹500Cr+ Transacted",
  "200+ Premium Properties",
  "15+ Years of Legacy",
  "50+ NRI Clients Served",
  "Tier-1 Developer Network",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Premium Indian cityscape at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gold-light text-sm font-semibold tracking-[0.3em] uppercase mb-6"
          >
            India's Premier Real Estate Advisory
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-accent-foreground mb-8"
          >
            Investing in
            <br />
            India's <span className="text-gradient-gold">Legacy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-accent-foreground/70 max-w-xl mb-12 font-light leading-relaxed"
          >
            Curating extraordinary real estate opportunities across India's most
            coveted addresses. From ultra-luxury residences to strategic commercial assets.
          </motion.p>

          {/* Quick Search - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="glass-dark rounded-2xl p-6 max-w-2xl"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <MapPin size={18} className="text-gold-light shrink-0" />
                <input
                  type="text"
                  placeholder="Location — Gurgaon, Delhi, Bangalore..."
                  className="bg-transparent text-accent-foreground placeholder:text-accent-foreground/40 text-sm w-full outline-none"
                />
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <Home size={18} className="text-gold-light shrink-0" />
                <select className="bg-transparent text-accent-foreground/70 text-sm outline-none appearance-none cursor-pointer">
                  <option value="">Property Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2 justify-center">
                <Search size={16} />
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Ticker */}
      <div className="absolute bottom-0 left-0 right-0 bg-accent/90 backdrop-blur-sm py-4 overflow-hidden">
        <div className="ticker-scroll flex gap-16 whitespace-nowrap">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span
              key={i}
              className="text-accent-foreground/60 text-sm font-medium tracking-wider flex items-center gap-3"
            >
              <Building2 size={14} className="text-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
