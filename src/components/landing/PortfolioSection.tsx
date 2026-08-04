import { m, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const categories = [
  {
    title: "Residential",
    description: "Apartments, builder floors and low-density homes across Gurgaon's corridors and South Delhi — shortlisted against resale evidence in the same sector.",
    image: "luxury-residential",
    stats: "Gurgaon · Delhi",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Commercial",
    description: "Grade-A office and retail in Cyber City, Golf Course Road and Udyog Vihar. Judged on the tenant and the lease, not the lobby.",
    image: "commercial",
    stats: "Leased & vacant",
    span: "md:col-span-1",
  },
  {
    title: "Land & Farmhouses",
    description: "Plots and farmhouses in South Gurgaon and along Sohna Road, where the developer's delivery record matters more than the specification.",
    image: "lands-farmhouses",
    stats: "South Gurgaon · Sohna",
    span: "md:col-span-1",
  },
];

function ParallaxCard({ cat, index }: { cat: typeof categories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer hover-lift ${cat.span}`}
    >
      {/* alt="" on purpose: the heading immediately below names the category,
          so describing it again just makes a screen reader say it twice. */}
      <picture>
        <source type="image/avif" srcSet={`/img/${cat.image}-800.avif`} />
        <source type="image/webp" srcSet={`/img/${cat.image}-800.webp`} />
        <m.img
          src={`/img/${cat.image}-800.jpg`}
          alt=""
          width={800}
          height={800}
          className="absolute inset-0 w-[110%] h-[120%] object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ y: imgY }}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <span className="text-gold-ink text-xs font-bold tracking-widest uppercase">
          {cat.stats}
        </span>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-accent-foreground mt-2 mb-2">
          {cat.title}
        </h3>
        <p className="text-accent-foreground/60 text-sm leading-relaxed max-w-md">
          {cat.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-gold-ink text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Explore <ArrowUpRight size={16} />
        </div>
      </div>
    </m.div>
  );
}

export function PortfolioSection() {
  return (
    <section id="portfolio" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Portfolio
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Curated for the
            <br />
            <span className="text-gradient-gold">Discerning Few</span>
          </h2>
        </m.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {categories.map((cat, i) => (
            <ParallaxCard key={cat.title} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
