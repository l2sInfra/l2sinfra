import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/database.types";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Market Insights & Real Estate Research | L2S Infra";
    supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).then(({ data }) => {
      setPosts(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">Insights</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              Market Insights & <span className="text-gradient-gold">Expertise</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Research-backed analysis of India's luxury real estate markets. Stay informed on price trends, investment opportunities, and regulatory developments.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-secondary" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group bg-card rounded-2xl overflow-hidden border border-border hover-lift">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {post.author}
                      </span>
                    </div>
                    <h2 className="font-heading text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/insights/${post.slug}`}
                      className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
