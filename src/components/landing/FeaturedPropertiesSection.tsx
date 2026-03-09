import { motion } from "framer-motion";
import { MapPin, BedDouble, Maximize, Eye } from "lucide-react";

const properties = [
  {
    title: "Luxury Penthouse, Worli Mumbai",
    type: "Ultra-Luxury Residential",
    location: "Worli, Mumbai",
    beds: "4 BHK",
    area: "3,800 sq ft",
    price: "₹35 Cr",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    features: "Sea-facing, private pool, panoramic city views",
  },
  {
    title: "Heritage Villa, Lutyens Delhi",
    type: "Heritage Property",
    location: "Lutyens' Delhi",
    beds: "5 BHK",
    area: "8,000 sq ft",
    price: "Price on Request",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    features: "Colonial architecture, landscaped gardens, prime location",
  },
  {
    title: "Modern Apartment, UB City Bangalore",
    type: "Premium Residential",
    location: "UB City, Bangalore",
    beds: "3 BHK",
    area: "2,800 sq ft",
    price: "₹8.5 Cr",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    features: "Smart home, club facilities, tech corridor proximity",
  },
  {
    title: "Premium Office Space, BKC Mumbai",
    type: "Commercial",
    location: "BKC, Mumbai",
    beds: "",
    area: "5,000 sq ft",
    price: "₹12 Cr",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    features: "Grade-A, LEED certified, premium business address",
  },
  {
    title: "Luxury Villa, North Goa",
    type: "Luxury Villa",
    location: "North Goa",
    beds: "4 BHK",
    area: "4,500 sq ft",
    price: "₹15 Cr",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
    features: "Beachfront, infinity pool, tropical gardens",
  },
  {
    title: "Smart Apartment, Aerocity Delhi",
    type: "Premium Residential",
    location: "Aerocity, Delhi",
    beds: "3 BHK",
    area: "2,400 sq ft",
    price: "₹6.8 Cr",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    features: "Airport proximity, smart automation, luxury amenities",
  },
];

export function FeaturedPropertiesSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={prop.image}
                  alt={`${prop.title} - luxury property in ${prop.location}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {prop.type}
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
                  {prop.beds && (
                    <span className="flex items-center gap-1">
                      <BedDouble size={14} /> {prop.beds}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Maximize size={14} /> {prop.area}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs mb-4">{prop.features}</p>
                <div className="flex items-center justify-between">
                  <p className="font-heading text-xl font-bold text-primary">{prop.price}</p>
                  <a
                    href="#contact"
                    className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <Eye size={14} /> View Details
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
