import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Award, Users } from "lucide-react";
import { useRef } from "react";
import luxuryImg from "@/assets/luxury-residential.jpg";

const trustIndicators = [
  { icon: Shield, label: "One market, not twelve" },
  { icon: Award, label: "Published corridor research" },
  { icon: Users, label: "Residential · Commercial · Land" },
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
              We cover one market.{" "}
              <span className="text-gradient-gold">That is the point.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                An advisory that sells in six cities knows six markets shallowly. We have
                worked in Gurgaon and Delhi since 2010, and nowhere else. That is a smaller
                business and a better one, because the questions that decide a Gurgaon
                purchase are local ones.
              </p>
              <p>
                Which side of Golf Course Extension gets the metro alignment. Which sectors
                on Dwarka Expressway still have an occupancy problem. Which developer's last
                three deliveries slipped, and by how long. Which tower in a project faces the
                service road nobody mentions at the launch. None of that is in a brochure.
              </p>
              <p>
                So we do the unglamorous part. We read the title chain, check the RERA
                filing and the approval status, look at what comparable units in the same
                sector actually resold for, and tell you when the answer is that you should
                not buy. Then we publish the corridor research we used, so you can argue
                with it.
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
              alt="Premium residential tower in Gurgaon with landscaped grounds"
              className="w-full h-[550px] object-cover shadow-2xl"
              style={{ y: imgY }}
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-xl z-10">
              <p className="font-heading text-3xl font-bold text-primary">Since 2010</p>
              <p className="text-secondary-foreground/70 text-sm">Advising in Gurgaon &amp; Delhi</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
