import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

// Plain facts, not counters. The figures that used to animate here — years,
// portfolio value, a satisfaction percentage — were not sourced from anything.
const facts = [
  { value: "Gurgaon & Delhi", label: "Where we work" },
  { value: "Buying & selling", label: "Both sides of the deal" },
  { value: "Since 2010", label: "In this market" },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src={heroBg}
          alt="Gurgaon skyline of premium high-rise residential towers at golden hour"
          className="w-full h-[120%] object-cover"
          loading="eager"
          decoding="async"
          // React 18 doesn't recognise camelCase fetchPriority; the lowercase
          // DOM attribute is what the browser reads.
          {...{ fetchpriority: "high" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/40 to-secondary/80" />
      </motion.div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-6"
          >
            Real Estate Agency · Gurgaon &amp; Delhi NCR
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-secondary-foreground mb-6"
          >
            Buy well in Gurgaon.
            <br />
            Sell for what it&rsquo;s <span className="text-gradient-gold">actually worth.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-secondary-foreground/70 max-w-xl mb-10 font-light leading-relaxed"
          >
            A full-service agency for Gurgaon and Delhi, partnered with the premium
            builders — and on your side of the table whichever side you are on.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-8 mb-10"
          >
            {facts.map((fact) => (
              <div key={fact.label}>
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
                  {fact.value}
                </p>
                <p className="text-secondary-foreground/60 text-xs mt-1 tracking-wider uppercase">{fact.label}</p>
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
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors text-center"
            >
              Schedule a consultation
            </a>
            <a
              href="#properties"
              className="border-2 border-secondary-foreground/40 text-secondary-foreground px-8 py-4 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors text-center"
            >
              See current listings
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
