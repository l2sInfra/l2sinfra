import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { BlogPost as BlogPostType } from "@/lib/database.types";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { applySEO } from "@/lib/seo";
import { postMeta } from "@/lib/route-meta";
import { useRecordState } from "@/lib/use-record-state";
import { SectionError } from "@/components/SectionState";
import { sanitizeHtml } from "@/lib/sanitize";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { record: post, state, retry } = useRecordState<BlogPostType>(
    () =>
      supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single(),
    [slug],
  );

  useEffect(() => {
    if (post) applySEO(postMeta(post));
  }, [post]);

  // Only an absent or unpublished post redirects; a failed query shows an error.
  if (state === "missing") return <Navigate to="/insights" replace />;

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen bg-background pt-24">
        {state === "error" ? (
          <div className="max-w-2xl mx-auto section-padding">
            <SectionError onRetry={retry} what="this article" />
          </div>
        ) : state === "loading" ? (
          <div className="max-w-3xl mx-auto section-padding animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-4 bg-muted rounded" />)}
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
                  <Link to="/" className="hover:text-gold-ink transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/insights" className="hover:text-gold-ink transition-colors">Insights</Link>
                  <span>/</span>
                  <span className="text-foreground line-clamp-1">{post.title}</span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gold-ink" />
                    {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-gold-ink" />
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
                      <span key={tag} className="flex items-center gap-1 text-xs bg-primary/10 text-gold-ink px-3 py-1 rounded-full">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-sm md:prose-base max-w-none
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-li:text-muted-foreground
                    prose-strong:text-foreground
                    prose-a:text-gold-ink prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                />

                {/* CTA */}
                <div className="mt-12 p-6 bg-secondary rounded-xl border border-border">
                  <h3 className="font-heading text-lg font-bold text-secondary-foreground mb-2">
                    Ready to Explore Premium Properties?
                  </h3>
                  <p className="text-secondary-foreground/80 text-sm mb-4">
                    We are available for a private consultation. No obligation, complete confidentiality.
                  </p>
                  <Link to="/#contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors">
                    Schedule Private Consultation
                  </Link>
                </div>

                {/* Back */}
                <div className="mt-8">
                  <Link to="/insights" className="flex items-center gap-2 text-muted-foreground hover:text-gold-ink text-sm transition-colors">
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
