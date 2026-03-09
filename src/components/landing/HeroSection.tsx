import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

const stats = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+ Cr", label: "Portfolio Value" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury Indian cityscape with premium high-rise properties at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/40 to-secondary/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-6"
          >
            Luxury Real Estate Advisory
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-secondary-foreground mb-6"
          >
            India's Premier Luxury
            <br />
            Real Estate <span className="text-gradient-gold">Advisory</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-secondary-foreground/70 max-w-xl mb-10 font-light leading-relaxed"
          >
            Curating exceptional properties for discerning clients across Mumbai, Delhi, Bangalore &amp; beyond.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-8 mb-10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-secondary-foreground/60 text-xs mt-1 tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors text-center"
            >
              Schedule Private Consultation
            </a>
            <a
              href="#properties"
              className="border-2 border-secondary-foreground/40 text-secondary-foreground px-8 py-4 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors text-center"
            >
              Explore Premium Listings
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
