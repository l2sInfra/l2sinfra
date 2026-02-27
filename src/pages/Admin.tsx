import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FileText,
  HelpCircle,
  Settings,
  ArrowLeft,
  Menu,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Hero Content", icon: Image, key: "hero" },
  { label: "Blog Engine", icon: FileText, key: "blogs" },
  { label: "FAQ Manager", icon: HelpCircle, key: "faqs" },
  { label: "Global Settings", icon: Settings, key: "settings" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-accent text-accent-foreground flex flex-col transition-all duration-300 shrink-0`}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {sidebarOpen && (
            <span className="font-heading text-lg font-bold">
              Admin <span className="text-gradient-gold">Panel</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-accent-foreground/50 hover:text-accent-foreground transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-accent-foreground/50 hover:text-accent-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-2 text-accent-foreground/50 hover:text-primary text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          {activeTab === "dashboard" && <DashboardPanel />}
          {activeTab === "hero" && <HeroPanel />}
          {activeTab === "blogs" && <BlogsPanel />}
          {activeTab === "faqs" && <FAQsPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}

function DashboardPanel() {
  const stats = [
    { label: "Total Properties", value: "200+" },
    { label: "Active Leads", value: "47" },
    { label: "Blog Posts", value: "12" },
    { label: "Monthly Views", value: "15.2K" },
  ];
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">{s.label}</p>
            <p className="font-heading text-3xl font-bold text-foreground mt-2">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-card border border-border rounded-xl p-8">
        <p className="text-muted-foreground text-center">
          Enable <strong className="text-primary">Lovable Cloud</strong> to unlock full CMS functionality — 
          database-backed content management, authentication, and more.
        </p>
      </div>
    </div>
  );
}

function HeroPanel() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Hero Content Manager</h1>
      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Headline</label>
          <input
            type="text"
            defaultValue="Investing in India's Legacy"
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Subheadline</label>
          <textarea
            defaultValue="Curating extraordinary real estate opportunities across India's most coveted addresses."
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:ring-2 focus:ring-primary outline-none resize-none h-24"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Background Image</label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
            Drag & drop or click to upload (requires Cloud)
          </div>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function BlogsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Blog Engine</h1>
        <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold">
          + New Post
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
        Enable Lovable Cloud to create, edit, and publish blog posts with a rich-text editor.
      </div>
    </div>
  );
}

function FAQsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">FAQ Manager</h1>
        <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold">
          + Add FAQ
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
        Enable Lovable Cloud to manage FAQs dynamically from the database.
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Global Settings</h1>
      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Trust Ticker Text</label>
          <input
            type="text"
            defaultValue="₹500Cr+ Transacted"
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Contact Email</label>
          <input
            type="email"
            defaultValue="hello@aetherestate.in"
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 text-sm border border-border focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors">
          Update Settings
        </button>
      </div>
    </div>
  );
}
