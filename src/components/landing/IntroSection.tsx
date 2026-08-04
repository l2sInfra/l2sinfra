import { m, useScroll, useTransform } from "framer-motion";
import { Shield, Award, Users } from "lucide-react";
import { useRef } from "react";

const trustIndicators = [
  { icon: Shield, label: "Buying & selling" },
  { icon: Award, label: "Premium builder partnerships" },
  { icon: Users, label: "Gurgaon & Delhi since 2010" },
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
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              About L2S Infra
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              One market.{" "}
              <span className="text-gradient-gold">Both sides of it.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                An agency that works in six cities knows six markets shallowly. We have
                worked in Gurgaon and Delhi since 2010, and nowhere else — which is why we
                can answer the questions that actually decide a transaction here.
              </p>
              <p>
                Which side of Golf Course Extension gets the metro alignment. Which sectors
                on Dwarka Expressway still have an occupancy problem. Which developer's last
                three deliveries slipped, and by how long. Which tower in a project faces the
                service road nobody mentions at the launch. None of that is in a brochure.
              </p>
              <p>
                We are partnered with the premium builders working these corridors, which
                gets our buyers pre-launch allocations and pricing that does not reach the
                portals. And we sell as hard as we buy: if you are exiting, we price the
                unit against what comparable flats in your sector actually fetched, and we
                run the negotiation rather than wait for an offer.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 mt-8">
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <item.icon size={18} className="text-gold-ink" />
                  {item.label}
                </div>
              ))}
            </div>
          </m.div>

          <m.div
            ref={imgRef}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <picture>
              <source type="image/avif" srcSet="/img/luxury-residential-800.avif" />
              <source type="image/webp" srcSet="/img/luxury-residential-800.webp" />
              <m.img
                src="/img/luxury-residential-800.jpg"
                alt="High-rise residential tower with landscaped grounds"
                width={800}
                height={800}
                className="w-full h-[550px] object-cover shadow-2xl"
                style={{ y: imgY }}
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-xl z-10">
              <p className="font-heading text-3xl font-bold text-gold-ink">Since 2010</p>
              <p className="text-secondary-foreground/70 text-sm">Buying &amp; selling in Gurgaon</p>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
