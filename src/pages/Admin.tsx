import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, FileText, Users, Star, Settings,
  ArrowLeft, Menu, LogOut, Plus, Pencil, Trash2, Eye, EyeOff,
  CheckCircle, Clock, MessageSquare, X, Save, Upload, ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { Property, BlogPost, Lead, Testimonial } from "@/lib/database.types";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Properties", icon: Building2, key: "properties" },
  { label: "Blog Posts", icon: FileText, key: "blogs" },
  { label: "Leads / CRM", icon: Users, key: "leads" },
  { label: "Testimonials", icon: Star, key: "testimonials" },
  { label: "Settings", icon: Settings, key: "settings" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-card border-r border-border flex flex-col transition-all duration-300 shrink-0 fixed h-full z-10`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          {sidebarOpen && (
            <span className="font-heading text-lg font-bold">
              L2S <span className="text-gradient-gold">Admin</span>
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors ml-auto">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {sidebarOpen && user && (
            <p className="text-xs text-muted-foreground truncate px-3">{user.email}</p>
          )}
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors px-3 py-2 rounded-lg hover:bg-secondary">
            <ArrowLeft size={16} className="shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 text-muted-foreground hover:text-red-400 text-sm transition-colors px-3 py-2 rounded-lg hover:bg-secondary">
            <LogOut size={16} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}>
        <div className="p-8 max-w-6xl">
          {activeTab === "dashboard" && <DashboardPanel />}
          {activeTab === "properties" && <PropertiesPanel />}
          {activeTab === "blogs" && <BlogsPanel />}
          {activeTab === "leads" && <LeadsPanel />}
          {activeTab === "testimonials" && <TestimonialsPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function DashboardPanel() {
  const [counts, setCounts] = useState({ properties: 0, leads: 0, blogs: 0, newLeads: 0 });

  useEffect(() => {
    const load = async () => {
      const [p, l, b, nl] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setCounts({ properties: p.count ?? 0, leads: l.count ?? 0, blogs: b.count ?? 0, newLeads: nl.count ?? 0 });
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Properties", value: counts.properties, icon: Building2 },
          { label: "Total Leads", value: counts.leads, icon: Users },
          { label: "New Leads", value: counts.newLeads, icon: MessageSquare },
          { label: "Blog Posts", value: counts.blogs, icon: FileText },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted-foreground text-sm">{s.label}</p>
              <s.icon size={18} className="text-primary" />
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-heading text-lg font-semibold mb-2">Quick Actions</h2>
        <p className="text-muted-foreground text-sm">Use the sidebar to manage Properties, Blog Posts, Leads, Testimonials, and Site Settings.</p>
      </div>
    </div>
  );
}

// ── Properties Panel ──────────────────────────────────────────────────────────
function PropertiesPanel() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Property> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    setProperties(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.location || !editing.price || !editing.area || !editing.description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!editing.slug) {
      editing.slug = editing.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    if (isNew) {
      const { error } = await supabase.from("properties").insert(editing as Property);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from("properties").update(editing).eq("id", editing.id!);
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Property saved!");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    await supabase.from("properties").delete().eq("id", id);
    toast.success("Property deleted.");
    load();
  };

  if (editing) {
    return <PropertyForm property={editing} onChange={setEditing} onSave={save} onCancel={() => setEditing(null)} isNew={isNew} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Properties</h1>
        <button onClick={() => { setIsNew(true); setEditing({ property_type: "residential", status: "available", is_featured: false, image_url: "" }); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <img src={p.image_url} alt={p.title} className="w-16 h-16 rounded-lg object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=64&h=64&fit=crop"; }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                  {p.is_featured && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "available" ? "bg-green-500/20 text-green-400" : p.status === "sold" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>{p.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{p.location} · {p.price} · {p.property_type}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { setIsNew(false); setEditing(p); }} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors"><Pencil size={16} /></button>
                <button onClick={() => remove(p.id)} className="p-2 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-secondary transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No properties yet. Add your first one.</div>
          )}
        </div>
      )}
    </div>
  );
}

function PropertyForm({ property, onChange, onSave, onCancel, isNew }: {
  property: Partial<Property>;
  onChange: (p: Partial<Property>) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const f = (field: keyof Property, value: unknown) => onChange({ ...property, [field]: value });
  const inp = "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onCancel} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"><X size={20} /></button>
        <h1 className="font-heading text-2xl font-bold text-foreground">{isNew ? "Add Property" : "Edit Property"}</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <input className={inp} value={property.title ?? ""} onChange={(e) => f("title", e.target.value)} placeholder="DLF The Arbour" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Property Type *</label>
            <select className={inp} value={property.property_type ?? "residential"} onChange={(e) => f("property_type", e.target.value)}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="farmhouse_land">Farmhouse / Land</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
            <input className={inp} value={property.location ?? ""} onChange={(e) => f("location", e.target.value)} placeholder="Sector 63, Golf Course Extension Road" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City *</label>
            <select className={inp} value={property.city ?? ""} onChange={(e) => f("city", e.target.value)}>
              <option value="">Select city</option>
              {["Gurgaon", "Mumbai", "Delhi NCR", "Bangalore", "Pune", "Hyderabad", "Goa"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Price *</label>
            <input className={inp} value={property.price ?? ""} onChange={(e) => f("price", e.target.value)} placeholder="₹7 Cr – ₹10 Cr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Area *</label>
            <input className={inp} value={property.area ?? ""} onChange={(e) => f("area", e.target.value)} placeholder="3,500 – 4,800 sq ft" />
          </div>
          {property.property_type === "residential" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
              <input className={inp} value={property.bedrooms ?? ""} onChange={(e) => f("bedrooms", e.target.value)} placeholder="4 BHK" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Developer</label>
            <input className={inp} value={property.developer ?? ""} onChange={(e) => f("developer", e.target.value)} placeholder="DLF" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select className={inp} value={property.status ?? "available"} onChange={(e) => f("status", e.target.value)}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="under_negotiation">Under Negotiation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Image URL *</label>
          <input className={inp} value={property.image_url ?? ""} onChange={(e) => f("image_url", e.target.value)} placeholder="https://images.unsplash.com/..." />
          {property.image_url && (
            <img src={property.image_url} alt="preview" className="mt-2 h-32 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Key Features</label>
          <input className={inp} value={property.features ?? ""} onChange={(e) => f("features", e.target.value)} placeholder="Aravalli views, Rooftop pool, Smart home..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
          <textarea className={`${inp} resize-none`} rows={5} value={property.description ?? ""} onChange={(e) => f("description", e.target.value)} placeholder="Full property description..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Video URL (optional)</label>
            <input className={inp} value={property.video_url ?? ""} onChange={(e) => f("video_url", e.target.value)} placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Virtual Tour URL (optional)</label>
            <input className={inp} value={property.virtual_tour_url ?? ""} onChange={(e) => f("virtual_tour_url", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" checked={property.is_featured ?? false} onChange={(e) => f("is_featured", e.target.checked)} className="accent-primary w-4 h-4" />
          <label htmlFor="featured" className="text-sm text-foreground">Show as Featured Property on homepage</label>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">SEO (optional)</p>
          <div className="space-y-3">
            <input className={inp} value={property.meta_title ?? ""} onChange={(e) => f("meta_title", e.target.value)} placeholder="SEO Page Title (max 60 chars)" />
            <input className={inp} value={property.meta_description ?? ""} onChange={(e) => f("meta_description", e.target.value)} placeholder="SEO Meta Description (max 155 chars)" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors">
            <Save size={16} /> Save Property
          </button>
          <button onClick={onCancel} className="px-6 py-3 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Blog Panel ────────────────────────────────────────────────────────────────
function BlogsPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.content || !editing.excerpt) {
      toast.error("Title, excerpt, and content are required.");
      return;
    }
    if (!editing.slug) {
      editing.slug = editing.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (!editing.published_at) editing.published_at = new Date().toISOString();
    if (!editing.author) editing.author = "L2S Research";
    if (editing.is_published === undefined) editing.is_published = true;

    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(editing as BlogPost);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from("blog_posts").update(editing).eq("id", editing.id!);
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Blog post saved!");
    setEditing(null);
    load();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ is_published: !post.is_published }).eq("id", post.id);
    toast.success(post.is_published ? "Post unpublished." : "Post published!");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Post deleted.");
    load();
  };

  if (editing) return <BlogForm post={editing} onChange={setEditing} onSave={save} onCancel={() => setEditing(null)} isNew={isNew} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Blog Posts</h1>
        <button onClick={() => { setIsNew(true); setEditing({ is_published: true, author: "L2S Research", image_url: "" }); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold">
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <img src={p.image_url} alt={p.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{p.author} · {new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(p)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors" title={p.is_published ? "Unpublish" : "Publish"}>
                  {p.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => { setIsNew(false); setEditing(p); }} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary transition-colors"><Pencil size={16} /></button>
                <button onClick={() => remove(p.id)} className="p-2 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-secondary transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-center py-12 text-muted-foreground">No posts yet.</div>}
        </div>
      )}
    </div>
  );
}

function BlogForm({ post, onChange, onSave, onCancel, isNew }: {
  post: Partial<BlogPost>;
  onChange: (p: Partial<BlogPost>) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const f = (field: keyof BlogPost, value: unknown) => onChange({ ...post, [field]: value });
  const inp = "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onCancel} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"><X size={20} /></button>
        <h1 className="font-heading text-2xl font-bold text-foreground">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Post Title *</label>
          <input className={inp} value={post.title ?? ""} onChange={(e) => f("title", e.target.value)} placeholder="Gurgaon Luxury Real Estate: Market Report 2026" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Author</label>
            <input className={inp} value={post.author ?? ""} onChange={(e) => f("author", e.target.value)} placeholder="L2S Research" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Publish Date</label>
            <input type="date" className={inp} value={post.published_at ? post.published_at.slice(0, 10) : ""} onChange={(e) => f("published_at", new Date(e.target.value).toISOString())} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cover Image URL *</label>
          <input className={inp} value={post.image_url ?? ""} onChange={(e) => f("image_url", e.target.value)} placeholder="https://images.unsplash.com/..." />
          {post.image_url && (
            <img src={post.image_url} alt="preview" className="mt-2 h-32 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Excerpt * (shown on homepage & blog listing)</label>
          <textarea className={`${inp} resize-none`} rows={3} value={post.excerpt ?? ""} onChange={(e) => f("excerpt", e.target.value)} placeholder="A brief summary of the article (2-3 sentences)..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Content *</label>
          <RichTextEditor
            content={post.content ?? ""}
            onChange={(html) => f("content", html)}
            placeholder="Write your full article here. You can paste from Google Docs or Claude..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={post.is_published ?? true} onChange={(e) => f("is_published", e.target.checked)} className="accent-primary w-4 h-4" />
          <label htmlFor="published" className="text-sm text-foreground">Published (visible on website)</label>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">SEO (optional but recommended)</p>
          <div className="space-y-3">
            <input className={inp} value={post.meta_title ?? ""} onChange={(e) => f("meta_title", e.target.value)} placeholder="SEO Page Title (max 60 chars)" />
            <input className={inp} value={post.meta_description ?? ""} onChange={(e) => f("meta_description", e.target.value)} placeholder="SEO Meta Description (max 155 chars)" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors">
            <Save size={16} /> Save Post
          </button>
          <button onClick={onCancel} className="px-6 py-3 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Leads Panel ───────────────────────────────────────────────────────────────
function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setLeads(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: string, status: Lead["status"]) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    toast.success("Status updated.");
    load();
  };

  const statusColor = (s: Lead["status"]) => ({
    new: "bg-blue-500/20 text-blue-400",
    contacted: "bg-yellow-500/20 text-yellow-400",
    in_discussion: "bg-purple-500/20 text-purple-400",
    closed: "bg-green-500/20 text-green-400",
  }[s]);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Leads / CRM</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "new", "contacted", "in_discussion", "closed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{lead.full_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(lead.status)}`}>
                      {lead.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.email} · {lead.phone} · {new Date(lead.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={lead.status}
                    onChange={(e) => { e.stopPropagation(); updateStatus(lead.id, e.target.value as Lead["status"]); }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_discussion">In Discussion</option>
                    <option value="closed">Closed</option>
                  </select>
                  <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expanded === lead.id ? "rotate-180" : ""}`} />
                </div>
              </div>
              {expanded === lead.id && (
                <div className="px-4 pb-4 border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Interest:</span> <span className="text-foreground ml-2">{lead.property_interest}</span></div>
                  <div><span className="text-muted-foreground">Budget:</span> <span className="text-foreground ml-2">{lead.budget_range}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> <span className="text-foreground ml-2">{lead.preferred_location || "Not specified"}</span></div>
                  <div><span className="text-muted-foreground">Source:</span> <span className="text-foreground ml-2">{lead.source || "Website"}</span></div>
                  {lead.message && (
                    <div className="md:col-span-2"><span className="text-muted-foreground">Message:</span> <span className="text-foreground ml-2">{lead.message}</span></div>
                  )}
                </div>
              )}
            </div>
          ))}
          {leads.length === 0 && <div className="text-center py-12 text-muted-foreground">No leads found.</div>}
        </div>
      )}
    </div>
  );
}

// ── Testimonials Panel ────────────────────────────────────────────────────────
function TestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setTestimonials(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.quote || !editing?.client_name) { toast.error("Quote and name required."); return; }
    if (isNew) {
      await supabase.from("testimonials").insert({ ...editing, is_active: true, sort_order: testimonials.length } as Testimonial);
    } else {
      await supabase.from("testimonials").update(editing).eq("id", editing.id!);
    }
    toast.success("Testimonial saved!");
    setEditing(null);
    load();
  };

  const toggle = async (t: Testimonial) => {
    await supabase.from("testimonials").update({ is_active: !t.is_active }).eq("id", t.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  const inp = "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const f = (field: keyof Testimonial, value: unknown) => setEditing(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Testimonials</h1>
        <button onClick={() => { setIsNew(true); setEditing({ is_active: true }); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {editing && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{isNew ? "Add Testimonial" : "Edit Testimonial"}</h2>
            <button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button>
          </div>
          <textarea className={`${inp} resize-none`} rows={4} value={editing.quote ?? ""} onChange={(e) => f("quote", e.target.value)} placeholder="Client quote..." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className={inp} value={editing.client_name ?? ""} onChange={(e) => f("client_name", e.target.value)} placeholder="Client name" />
            <input className={inp} value={editing.designation ?? ""} onChange={(e) => f("designation", e.target.value)} placeholder="Designation / Company" />
            <input className={inp} value={editing.property_transacted ?? ""} onChange={(e) => f("property_transacted", e.target.value)} placeholder="Property transacted" />
          </div>
          <button onClick={save} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold">
            <Save size={16} /> Save
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className={`bg-card border rounded-xl p-4 ${t.is_active ? "border-border" : "border-border opacity-50"}`}>
              <p className="text-sm text-muted-foreground italic mb-3">"{t.quote.slice(0, 120)}..."</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.client_name}</p>
                  <p className="text-xs text-muted-foreground">{t.designation} · {t.property_transacted}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggle(t)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary" title={t.is_active ? "Hide" : "Show"}>
                    {t.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => { setIsNew(false); setEditing(t); }} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-secondary"><Pencil size={16} /></button>
                  <button onClick={() => remove(t.id)} className="p-2 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-secondary"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Settings Panel ────────────────────────────────────────────────────────────
function SettingsPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    }
    setSaving(false);
    toast.success("Settings saved!");
  };

  const inp = "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Site Settings</h1>
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        {[
          { key: "whatsapp_number", label: "WhatsApp Number (with country code, no +)", placeholder: "919773740037" },
          { key: "contact_phone", label: "Display Phone Number", placeholder: "+91-9773740037" },
          { key: "contact_email", label: "Contact Email", placeholder: "connect@l2sinfra.com" },
          { key: "office_address", label: "Office Address", placeholder: "Bani City Centre, Sector 63, Gurgaon" },
          { key: "business_hours", label: "Business Hours", placeholder: "Mon – Sat: 10:00 AM – 7:00 PM" },
          { key: "ticker_text", label: "Trust Ticker Text", placeholder: "₹500Cr+ Transacted · 15+ Years..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
            <input className={inp} value={settings[key] ?? ""} onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder} />
          </div>
        ))}
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
