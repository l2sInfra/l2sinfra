import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { BlogPost as BlogPostType } from "@/lib/database.types";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data);
          document.title = `${data.meta_title || data.title} | L2S Infra`;
          // Update meta description
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute("content", data.meta_description || data.excerpt);
        }
        setLoading(false);
      });
  }, [slug]);

  if (notFound) return <Navigate to="/insights" replace />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        {loading ? (
          <div className="max-w-3xl mx-auto section-padding animate-pulse space-y-6">
            <div className="h-8 bg-secondary rounded w-3/4" />
            <div className="h-64 bg-secondary rounded-2xl" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-4 bg-secondary rounded" />)}
            </div>
          </div>
        ) : post ? (
          <>
            {/* Hero */}
            <div className="relative h-80 md:h-[480px] overflow-hidden">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* Article */}
            <article className="max-w-3xl mx-auto px-4 md:px-6 -mt-20 relative z-10 pb-16">
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/insights" className="hover:text-primary transition-colors">Insights</Link>
                  <span>/</span>
                  <span className="text-foreground line-clamp-1">{post.title}</span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-primary" />
                    {post.author}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-sm md:prose-base prose-invert max-w-none
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-li:text-muted-foreground
                    prose-strong:text-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA */}
                <div className="mt-12 p-6 bg-secondary rounded-xl border border-border">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    Ready to Explore Premium Properties?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Our advisory team is available for a private consultation. No obligation, complete confidentiality.
                  </p>
                  <Link to="/#contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors">
                    Schedule Private Consultation
                  </Link>
                </div>

                {/* Back */}
                <div className="mt-8">
                  <Link to="/insights" className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors">
                    <ArrowLeft size={14} /> Back to Insights
                  </Link>
                </div>
              </div>
            </article>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
