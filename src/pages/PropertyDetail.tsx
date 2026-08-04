import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Property, PropertyType } from "@/lib/database.types";
import { MapPin, BedDouble, Maximize, ArrowLeft, Phone, MessageCircle, CheckCircle, Building2 } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HARERA_REG_NO, PHONE_DISPLAY, PHONE_E164, whatsappLink } from "@/lib/site-contact";
import { applySEO } from "@/lib/seo";
import { propertyMeta } from "@/lib/route-meta";
import { useRecordState } from "@/lib/use-record-state";
import { SectionError } from "@/components/SectionState";

const typeLabel: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  farmhouse_land: "Farmhouse & Land",
};

/**
 * Returns an embed URL only for a recognised YouTube link. A validator that
 * falls through to trusting its input is worse than no validator: the previous
 * version returned the raw string, so `javascript:...` in video_url executed
 * in our origin.
 */
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Handle youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    // Handle youtube.com/watch?v=VIDEO_ID
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

    // Anything we don't recognise is not rendered.
    const embedMatch = url.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

    return null;
  } catch {
    return null;
  }
}

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { record: property, state, retry } = useRecordState<Property>(
    () => supabase.from("properties").select("*").eq("slug", slug!).single(),
    [slug],
  );

  useEffect(() => {
    if (property) applySEO(propertyMeta(property));
  }, [property]);

  const videoEmbedUrl = property?.video_url ? getYouTubeEmbedUrl(property.video_url) : null;

  // Only a genuinely absent listing redirects. A failed query renders an error
  // with a retry — sending someone to a listing page that will also be empty
  // tells them the catalogue is gone when the database is merely unreachable.
  if (state === "missing") return <Navigate to="/properties" replace />;

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen bg-background pt-24">
        {state === "error" ? (
          <div className="max-w-2xl mx-auto section-padding">
            <SectionError onRetry={retry} what="this listing" />
          </div>
        ) : state === "loading" ? (
          <div className="max-w-6xl mx-auto section-padding animate-pulse space-y-6">
            <div className="h-80 bg-muted rounded-2xl" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        ) : property ? (
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-gold-ink">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-gold-ink">Properties</Link>
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
                    <MapPin size={16} className="text-gold-ink" />
                    <span>{property.location}, {property.city}</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="font-heading font-bold text-gold-ink">{property.price}</p>
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
                        <CheckCircle size={14} className="text-gold-ink shrink-0" />
                        {f.trim()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video */}
                {videoEmbedUrl && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-4">Property Video</h2>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={videoEmbedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title={`${property.title} video`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Contact sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-1">Interested in this property?</h2>
                  <p className="text-muted-foreground text-sm mb-6">Speak to us about pricing, availability and a viewing.</p>

                  <a
                    href={whatsappLink(`Hi, I'm interested in ${property.title} at ${property.location}. Please share more details.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1ebe5d] transition-colors mb-3"
                  >
                    <MessageCircle size={16} /> WhatsApp Us
                  </a>

                  <a
                    href={`tel:${PHONE_E164}`}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors mb-3"
                  >
                    <Phone size={16} /> Call {PHONE_DISPLAY}
                  </a>

                  <Link
                    to={`/?property=${encodeURIComponent(property.title)}#contact`}
                    className="w-full flex items-center justify-center gap-2 border border-border text-foreground py-3 rounded-lg text-sm font-semibold hover:border-gold-ink hover:text-gold-ink transition-colors"
                  >
                    Schedule Consultation
                  </Link>

                  <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-gold-ink shrink-0" />
                      <span>
                        HARERA registered agent ·{" "}
                        <span className="text-foreground">{HARERA_REG_NO}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-ink shrink-0" /> Title and approvals checked before you commit</div>
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-ink shrink-0" /> NRI buyers supported</div>
                  </div>
                </div>

                {/* Developer info */}
                {property.developer && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={16} className="text-gold-ink" />
                      <h3 className="font-semibold text-foreground text-sm">Developer</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{property.developer}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10">
              <Link to="/properties" className="flex items-center gap-2 text-muted-foreground hover:text-gold-ink text-sm transition-colors">
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
