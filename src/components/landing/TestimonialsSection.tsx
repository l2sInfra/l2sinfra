import { m } from "framer-motion";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/lib/database.types";
import { useQueryState } from "@/lib/use-query-state";
import { SectionError, SectionEmpty } from "@/components/SectionState";

export function TestimonialsSection() {
  const { rows: testimonials, state, retry } = useQueryState<Testimonial>(() =>
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .limit(3),
  );

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            What our <span className="text-gradient-gold">clients say</span>
          </h2>
        </m.div>

        {state === "error" ? (
          <SectionError onRetry={retry} what="our client references" />
        ) : state === "empty" ? (
          <SectionEmpty>
            We're re-collecting these with our clients' permission, with the
            transaction attached. In the meantime, ask us for two references in
            your sector and we'll connect you directly.
          </SectionEmpty>
        ) : state === "loading" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-8 animate-pulse space-y-4">
                <div className="flex gap-1">{[1,2,3,4,5].map((j) => <div key={j} className="w-4 h-4 bg-muted rounded" />)}</div>
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <m.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card border border-border rounded-2xl p-8 hover-lift"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-gold-ink text-gold-ink" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-heading font-bold text-card-foreground">{t.client_name}</p>
                  <p className="text-muted-foreground text-xs">{t.designation}</p>
                  <p className="text-gold-ink text-xs font-semibold mt-1">{t.property_transacted}</p>
                </div>
              </m.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
