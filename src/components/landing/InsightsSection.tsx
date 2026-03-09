import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";

const articles = [
  {
    title: "Mumbai Luxury Real Estate: Market Report 2026",
    excerpt:
      "An in-depth analysis of Mumbai's luxury residential market, covering price trends in Worli, Bandra, and Lower Parel. Explore how infrastructure developments like the coastal road are reshaping premium property valuations.",
    date: "March 5, 2026",
    author: "L2S Research",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=350&fit=crop",
  },
  {
    title: "NRI Investment Guide: Navigating Indian Real Estate in 2026",
    excerpt:
      "Everything NRIs need to know about investing in Indian property — from FEMA regulations and tax implications to the most promising markets. A comprehensive guide covering legal frameworks and optimal strategies.",
    date: "February 20, 2026",
    author: "L2S Advisory",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=350&fit=crop",
  },
  {
    title: "Bangalore's Emerging Luxury Corridors: Where to Invest Next",
    excerpt:
      "Discover Bangalore's next premium micro-markets beyond Whitefield and Koramangala. Our research identifies high-growth corridors driven by tech expansion, metro connectivity, and luxury developer interest.",
    date: "February 10, 2026",
    author: "L2S Research",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=350&fit=crop",
  },
];

export function InsightsSection() {
  return (
    <section id="insights" className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Insights
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Market Insights &{" "}
            <span className="text-gradient-gold">Expertise</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} /> {article.author}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <a href="#" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
