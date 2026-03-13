import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Property, PropertyType } from "@/lib/database.types";
import { MapPin, BedDouble, Maximize, ArrowRight, Search } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const typeLabel: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  farmhouse_land: "Farmhouse & Land",
};

const cities = ["All Cities", "Gurgaon", "Mumbai", "Delhi NCR", "Bangalore", "Pune", "Hyderabad", "Goa"];

export default function PropertiesListing() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Premium Property Listings | L2S Infra - Luxury Real Estate India";
    supabase
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProperties(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = properties.filter((p) => {
    const matchType = typeFilter === "all" || p.property_type === typeFilter;
    const matchCity = cityFilter === "All Cities" || p.city === cityFilter;
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchType && matchCity && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto section-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">Our Portfolio</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Premium <span className="text-gradient-gold">Property Listings</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Curated luxury residential, commercial, and land properties across India's most coveted addresses.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by project name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "residential", "commercial", "farmhouse_land"].map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${typeFilter === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                  {t === "all" ? "All Types" : typeLabel[t as PropertyType]}
                </button>
              ))}
            </div>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-muted-foreground text-sm mb-6">{filtered.length} {filtered.length === 1 ? "property" : "properties"} found</p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-secondary" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                    <div className="h-4 bg-secondary rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((prop) => (
                <article key={prop.id} className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={prop.image_url}
                      alt={`${prop.title} - ${prop.location}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {typeLabel[prop.property_type]}
                    </span>
                    {prop.is_featured && (
                      <span className="absolute top-4 right-4 bg-secondary/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-foreground">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-lg font-bold text-card-foreground mb-2">{prop.title}</h2>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                      <MapPin size={14} className="text-primary shrink-0" />
                      {prop.location}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {prop.bedrooms && (
                        <span className="flex items-center gap-1"><BedDouble size={14} /> {prop.bedrooms}</span>
                      )}
                      <span className="flex items-center gap-1"><Maximize size={14} /> {prop.area}</span>
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
                </article>
              ))}
              {filtered.length === 0 && (
                <div className="md:col-span-3 text-center py-16 text-muted-foreground">
                  No properties match your filters. <button onClick={() => { setTypeFilter("all"); setCityFilter("All Cities"); setSearch(""); }} className="text-primary hover:underline ml-1">Clear filters</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
