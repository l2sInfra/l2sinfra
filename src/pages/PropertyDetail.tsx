import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Property, PropertyType } from "@/lib/database.types";
import { MapPin, BedDouble, Maximize, ArrowLeft, Phone, MessageCircle, CheckCircle, Building2 } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const typeLabel: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  farmhouse_land: "Farmhouse & Land",
};

function getYouTubeEmbedUrl(url: string): string {
  try {
    // Handle youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    // Handle youtube.com/watch?v=VIDEO_ID
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

    // Already an embed URL or other format — use as-is
    return url;
  } catch {
    return url;
  }
}

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setProperty(data);
          document.title = `${data.meta_title || data.title} | L2S Infra`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute("content", data.meta_description || `${data.title} in ${data.location}. ${data.price}. ${data.area}. Contact L2S Infra for a private consultation.`);
        }
        setLoading(false);
      });
  }, [slug]);

  if (notFound) return <Navigate to="/properties" replace />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        {loading ? (
          <div className="max-w-6xl mx-auto section-padding animate-pulse space-y-6">
            <div className="h-80 bg-secondary rounded-2xl" />
            <div className="h-8 bg-secondary rounded w-1/2" />
            <div className="h-4 bg-secondary rounded w-1/3" />
          </div>
        ) : property ? (
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-primary">Properties</Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1">{property.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero image */}
                <div className="relative h-80 md:h-[480px] rounded-2xl overflow-hidden">
                  <img
                    src={property.image_url}
                    alt={`${property.title} - ${property.location}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                      {typeLabel[property.property_type]}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${property.status === "available" ? "bg-green-500/90 text-white" : property.status === "sold" ? "bg-red-500/90 text-white" : "bg-yellow-500/90 text-white"}`}>
                      {property.status === "under_negotiation" ? "Under Negotiation" : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Title & location */}
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} className="text-primary" />
                    <span>{property.location}, {property.city}</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="font-heading font-bold text-primary">{property.price}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Area</p>
                    <p className="font-semibold text-foreground text-sm">{property.area}</p>
                  </div>
                  {property.bedrooms && (
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Configuration</p>
                      <p className="font-semibold text-foreground text-sm">{property.bedrooms}</p>
                    </div>
                  )}
                  {property.developer && (
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Developer</p>
                      <p className="font-semibold text-foreground text-sm">{property.developer}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">About This Property</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Features */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">Key Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.split(",").map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        {f.trim()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video */}
                {property.video_url && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-4">Property Video</h2>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe src={getYouTubeEmbedUrl(property.video_url)} className="w-full h-full" allowFullScreen title={`${property.title} video`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Contact sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-1">Interested in this property?</h2>
                  <p className="text-muted-foreground text-sm mb-6">Speak with our advisory team for pricing, availability, and a private viewing.</p>

                  <a
                    href={`https://wa.me/919773740037?text=Hi, I'm interested in ${encodeURIComponent(property.title)} at ${encodeURIComponent(property.location)}. Please share more details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1ebe5d] transition-colors mb-3"
                  >
                    <MessageCircle size={16} /> WhatsApp Us
                  </a>

                  <a
                    href="tel:+919773740037"
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors mb-3"
                  >
                    <Phone size={16} /> Call +91-9773740037
                  </a>

                  <Link
                    to="/#contact"
                    className="w-full flex items-center justify-center gap-2 border border-border text-foreground py-3 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                  >
                    Schedule Consultation
                  </Link>

                  <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> RERA compliant transaction</div>
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> Legal due diligence included</div>
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> NRI advisory available</div>
                  </div>
                </div>

                {/* Developer info */}
                {property.developer && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={16} className="text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">Developer</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{property.developer}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10">
              <Link to="/properties" className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors">
                <ArrowLeft size={14} /> Back to All Properties
              </Link>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
