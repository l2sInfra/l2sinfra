import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Award, Users } from "lucide-react";
import { useRef } from "react";
import luxuryImg from "@/assets/luxury-residential.jpg";

const trustIndicators = [
  { icon: Shield, label: "RERA Compliant" },
  { icon: Award, label: "Award-Winning Advisory" },
  { icon: Users, label: "500+ HNI Clients" },
];

export function IntroSection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              About L2S Infra
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Redefining Luxury{" "}
              <span className="text-gradient-gold">Real Estate</span> in India
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                L2S Infra stands as India's most trusted luxury real estate advisory, serving high-net-worth individuals and NRIs with an unparalleled understanding of the premium property market. With over 15 years of dedicated expertise, we have curated a portfolio exceeding ₹500 crores across Mumbai, Delhi NCR, Bangalore, and other premier destinations.
              </p>
              <p>
                Our mission is to transform real estate investment from a complex transaction into a seamless, rewarding experience. Every client receives personalized attention from our seasoned advisors who leverage deep market intelligence, exclusive developer relationships, and comprehensive due diligence to identify opportunities that align with both lifestyle aspirations and investment objectives.
              </p>
              <p>
                What sets us apart is our commitment to discretion, transparency, and results. From the initial consultation to post-purchase management, we provide a white-glove service that has earned us the trust of India's most discerning property buyers.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 mt-8">
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <item.icon size={18} className="text-primary" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <motion.img
              src={luxuryImg}
              alt="Luxury residential property showcasing modern architecture and elegant interiors"
              className="w-full h-[550px] object-cover shadow-2xl"
              style={{ y: imgY }}
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-xl z-10">
              <p className="font-heading text-3xl font-bold text-primary">₹500Cr+</p>
              <p className="text-secondary-foreground/70 text-sm">Properties Transacted</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
