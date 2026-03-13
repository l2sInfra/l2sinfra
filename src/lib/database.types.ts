export type PropertyType = "residential" | "commercial" | "farmhouse_land";
export type PropertyStatus = "available" | "sold" | "under_negotiation";
export type LeadStatus = "new" | "contacted" | "in_discussion" | "closed";

export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  property_type: PropertyType;
  location: string;
  city: string;
  price: string;
  area: string;
  bedrooms?: string | null;
  description: string;
  features: string;
  status: PropertyStatus;
  developer?: string | null;
  image_url: string;
  gallery_urls?: string[] | null;
  video_url?: string | null;
  virtual_tour_url?: string | null;
  is_featured: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image_url: string;
  is_published: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string[] | null;
}

export interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  property_interest: string;
  budget_range: string;
  preferred_location?: string | null;
  message?: string | null;
  status: LeadStatus;
  notes?: string | null;
  source?: string | null;
}

export interface Testimonial {
  id: string;
  created_at: string;
  quote: string;
  client_name: string;
  designation: string;
  property_transacted: string;
  is_active: boolean;
  sort_order: number;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: Property;
        Insert: Omit<Property, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Property, "id" | "created_at">>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BlogPost, "id" | "created_at">>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at">;
        Update: Partial<Omit<Lead, "id" | "created_at">>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, "id" | "created_at">;
        Update: Partial<Omit<Testimonial, "id" | "created_at">>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, "id" | "updated_at">;
        Update: Partial<Omit<SiteSetting, "id">>;
      };
    };
  };
}
