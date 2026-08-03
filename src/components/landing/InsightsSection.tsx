import { m } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/database.types";
import { useQueryState } from "@/lib/use-query-state";
import { SectionError, SectionEmpty } from "@/components/SectionState";

export function InsightsSection() {
  const { rows: articles, state, retry } = useQueryState<BlogPost>(() =>
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3),
  );

  return (
    <section id="insights" className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Insights
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Market Insights &{" "}
            <span className="text-gradient-gold">Expertise</span>
          </h2>
        </m.div>

        {state === "error" ? (
          <SectionError onRetry={retry} what="our latest insights" />
        ) : state === "empty" ? (
          <SectionEmpty>
            Our corridor notes go to clients first. Tell us which corridor you're
            looking at and we'll send you the current one.
          </SectionEmpty>
        ) : state === "loading" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <m.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(article.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} /> {article.author}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-card-foreground mb-2 group-hover:text-gold-ink transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link
                    to={`/insights/${article.slug}`}
                    className="text-gold-ink text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </m.article>
            ))}
          </div>
        )}

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 border border-gold-ink text-gold-ink px-8 py-3 rounded-lg font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All Insights <ArrowRight size={16} />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
