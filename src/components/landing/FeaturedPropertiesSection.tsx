import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Maximize, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Property, PropertyType } from "@/lib/database.types";

const typeLabel: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  farmhouse_land: "Farmhouse & Land",
};

export function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          // Fallback: show any available properties if none are featured
          supabase.from("properties").select("*").eq("status", "available").order("created_at", { ascending: false }).limit(6).then(({ data: fallback }) => {
            setProperties(fallback ?? []);
            setLoading(false);
          });
        } else {
          setProperties(data);
          setLoading(false);
        }
      });
  }, []);

  return (
    <section id="properties" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Featured Properties
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Curated <span className="text-gradient-gold">Premium Listings</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-secondary" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                  <div className="h-4 bg-secondary rounded w-full" />
                  <div className="h-8 bg-secondary rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop, i) => (
              <motion.article
                key={prop.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={prop.image_url}
                    alt={`${prop.title} - luxury property in ${prop.location}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {typeLabel[prop.property_type]}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin size={14} className="text-primary" />
                    {prop.location}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {prop.bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble size={14} /> {prop.bedrooms}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Maximize size={14} /> {prop.area}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2">{prop.features}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-xl font-bold text-primary">{prop.price}</p>
                    <Link
                      to={`/properties/${prop.slug}`}
                      className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-lg font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All Properties <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
