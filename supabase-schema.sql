-- L2S Infra - Supabase Database Schema
-- Run this in your Supabase project's SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Properties table
create table properties (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  title text not null,
  slug text unique not null,
  property_type text not null check (property_type in ('residential', 'commercial', 'farmhouse_land')),
  location text not null,
  city text not null,
  price text not null,
  area text not null,
  bedrooms text,
  description text not null,
  features text not null,
  status text default 'available' check (status in ('available', 'sold', 'under_negotiation')),
  developer text,
  image_url text not null,
  gallery_urls text[],
  video_url text,
  virtual_tour_url text,
  is_featured boolean default false,
  meta_title text,
  meta_description text
);

-- Blog posts table
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  author text not null default 'L2S Research',
  published_at timestamptz default now() not null,
  image_url text not null,
  is_published boolean default true,
  meta_title text,
  meta_description text,
  tags text[]
);

-- Leads table
create table leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  full_name text not null,
  email text not null,
  phone text not null,
  property_interest text not null,
  budget_range text not null,
  preferred_location text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'in_discussion', 'closed')),
  notes text,
  source text default 'website'
);

-- Testimonials table
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  quote text not null,
  client_name text not null,
  designation text not null,
  property_transacted text not null,
  is_active boolean default true,
  sort_order integer default 0
);

-- Site settings table (key-value store)
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text not null,
  updated_at timestamptz default now() not null
);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at before update on properties
  for each row execute procedure update_updated_at();

create trigger blog_posts_updated_at before update on blog_posts
  for each row execute procedure update_updated_at();

create trigger site_settings_updated_at before update on site_settings
  for each row execute procedure update_updated_at();

-- Row Level Security
alter table properties enable row level security;
alter table blog_posts enable row level security;
alter table leads enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;

-- Public read policies
create policy "Public can read available properties" on properties
  for select using (true);

create policy "Public can read published blog posts" on blog_posts
  for select using (is_published = true);

create policy "Public can read active testimonials" on testimonials
  for select using (is_active = true);

create policy "Public can read site settings" on site_settings
  for select using (true);

-- Public can insert leads (contact form)
create policy "Public can submit leads" on leads
  for insert with check (true);

-- Authenticated users (admin) can do everything
create policy "Admin full access properties" on properties
  for all using (auth.role() = 'authenticated');

create policy "Admin full access blog_posts" on blog_posts
  for all using (auth.role() = 'authenticated');

create policy "Admin full access leads" on leads
  for select using (auth.role() = 'authenticated');

create policy "Admin update leads" on leads
  for update using (auth.role() = 'authenticated');

create policy "Admin full access testimonials" on testimonials
  for all using (auth.role() = 'authenticated');

create policy "Admin full access site_settings" on site_settings
  for all using (auth.role() = 'authenticated');

-- Seed: Default site settings
insert into site_settings (key, value) values
  ('whatsapp_number', '919773740037'),
  ('contact_email', 'connect@l2sinfra.com'),
  ('contact_phone', '+91-9773740037'),
  ('office_address', 'Bani City Centre, Sector 63, Gurgaon, Haryana'),
  ('business_hours', 'Mon – Sat: 10:00 AM – 7:00 PM | Sunday: By Appointment'),
  ('ticker_text', '₹500Cr+ Transacted · 15+ Years Experience · 200+ Premium Properties · 98% Client Satisfaction');

-- Seed: Testimonials (anonymous, credible)
insert into testimonials (quote, client_name, designation, property_transacted, sort_order) values
  ('L2S Infra made our property acquisition in Gurgaon completely effortless. Their market knowledge is extraordinary — they identified an off-market opportunity at Golf Course Road before it was publicly listed. The team handled every step from negotiation to RERA verification with complete transparency. I would not trust any other advisory for luxury real estate.', 'A Senior Executive', 'Technology Industry, Gurgaon', 'Luxury Apartment, Golf Course Road', 1),
  ('As an NRI based in Dubai, purchasing property in India always felt complex. L2S Infra changed that entirely. Their dedicated NRI team arranged virtual property tours, handled the power of attorney process, and ensured complete FEMA compliance. I now hold two properties in Gurgaon managed through them. Their after-sales support is as strong as their acquisition advisory.', 'An NRI Client', 'Finance Professional, Dubai', 'Two Premium Apartments, Gurgaon', 2),
  ('We engaged L2S Infra to identify commercial real estate opportunities for our family office. Their research-backed micro-market analysis was exceptional — they presented opportunities in emerging corridors that yielded significant appreciation within 18 months. Their due diligence process gave us complete legal clarity before every transaction. Highly recommended for serious investors.', 'A Family Office Representative', 'Investment & Wealth Management', 'Commercial Portfolio, Gurgaon NCR', 3);

-- Seed: 3 SEO Blog Posts
insert into blog_posts (title, slug, excerpt, content, author, published_at, image_url, is_published, meta_title, meta_description, tags) values
(
  'Gurgaon Luxury Real Estate: Complete Market Report 2026',
  'gurgaon-luxury-real-estate-market-report-2026',
  'A comprehensive analysis of Gurgaon''s luxury property market in 2026. From Golf Course Road to Sector 63, discover price trends, top projects, and why Gurgaon remains India''s most dynamic premium real estate destination.',
  '<h2>Gurgaon''s Rise as India''s Premium Property Capital</h2>
<p>Gurgaon — officially known as Gurugram — has transformed from a satellite city into India''s most sought-after address for luxury real estate. In 2026, the city''s premium property market is witnessing unprecedented momentum, driven by a confluence of infrastructure expansion, multinational corporate density, and a discerning buyer base that expects nothing short of world-class living.</p>
<p>The Gurgaon luxury real estate market saw residential prices in prime micro-markets appreciate by 18–24% year-on-year in 2025, making it one of the highest-appreciating property corridors in Asia. This trajectory continues into 2026, supported by robust demand from HNI buyers, NRIs, and institutional investors.</p>

<h2>Key Micro-Markets to Watch in 2026</h2>

<h3>Golf Course Road — India''s Beverly Hills</h3>
<p>Golf Course Road remains Gurgaon''s crown jewel. With luxury projects from DLF, Trump Towers, and Emaar lining this corridor, prices range from ₹15,000 to ₹35,000 per square foot for premium apartments. The road''s proximity to the Rapid Metro, Cyber City, and high-street retail makes it the top choice for C-suite executives and HNIs.</p>
<p>Landmark projects like <strong>DLF The Arbour</strong> and <strong>Trump Towers Gurgaon</strong> have set benchmarks for ultra-luxury living, with 4 BHK penthouses commanding prices upward of ₹20 Cr.</p>

<h3>Sector 63 & Golf Course Extension Road — The New Premium Belt</h3>
<p>The Golf Course Extension Road corridor has matured into Gurgaon''s second premium address. Projects like <strong>Max Estate 361</strong>, <strong>Birla Arika</strong>, and <strong>Sobha Sector 63A</strong> are redefining luxury with expansive floor plates, private terraces, and resort-style amenities. Price appreciation here has outpaced Golf Course Road at 22% YoY, driven by newer inventory and broader land parcels.</p>

<h3>Sohna Road — The Emerging Luxury Corridor</h3>
<p>Sohna Road is evolving from a mid-segment market to a legitimate luxury destination. Projects like <strong>Signature Global Sarvam</strong> and <strong>Sobha Aranya – Karma Lakeland</strong> are drawing buyers seeking larger plot sizes and resort-like environments at more accessible price points. Land appreciation here has been 28% over two years — among the highest in the NCR.</p>

<h2>Price Trends: Gurgaon Luxury Segment 2022–2026</h2>
<p>Premium residential prices on Golf Course Road have moved from ₹12,000/sqft in 2022 to ₹22,000–₹28,000/sqft in 2026. Golf Course Extension Road has seen a parallel trajectory, rising from ₹8,500/sqft to ₹15,000–₹18,000/sqft. Commercial spaces in Cyber City and DLF Cyber Park command ₹18,000–₹25,000/sqft — among the highest Grade-A commercial rates in India outside Mumbai BKC.</p>

<h2>Top Luxury Projects Driving Gurgaon''s Market in 2026</h2>
<ul>
<li><strong>DLF The Arbour</strong> — Sector 63, ultra-luxury 4 BHK apartments, ₹7–10 Cr</li>
<li><strong>Trump Tower & Trump Residences</strong> — Sector 65, branded luxury, ₹10–25 Cr</li>
<li><strong>Max Estate 361</strong> — Sector 36A, premium residences, ₹5–8 Cr</li>
<li><strong>Birla Arika</strong> — Sector 31, Birla Estates'' flagship, ₹4–7 Cr</li>
<li><strong>Sobha Sector 63A</strong> — Sobha Ltd''s premium offering, ₹4–6 Cr</li>
<li><strong>Godrej Sector 53</strong> — Godrej Properties'' luxury development, ₹5–8 Cr</li>
<li><strong>Signature Global Sarvam</strong> — Sohna Road, premium mid-luxury, ₹2.5–4.5 Cr</li>
<li><strong>Sobha Aranya – Karma Lakeland</strong> — Plotted development, Sohna Road</li>
</ul>

<h2>Why Gurgaon Luxury Real Estate Outperforms</h2>
<p>Three structural factors ensure Gurgaon''s luxury market remains resilient and appreciating:</p>
<p><strong>Corporate Ecosystem:</strong> Over 250 Fortune 500 companies have offices in Gurgaon, creating constant demand from top management for premium residences. The city''s talent density is unmatched outside Mumbai in India.</p>
<p><strong>Infrastructure Investment:</strong> The Dwarka Expressway has operationalised, the Delhi-Mumbai Expressway corridor passes through Gurgaon, and the metro network expansion is ongoing. Each infrastructure milestone adds a premium layer to adjacent micro-markets.</p>
<p><strong>Developer Quality:</strong> Gurgaon attracts India''s most reputed developers — DLF, Godrej, Birla Estates, Sobha, and Trump-branded properties — ensuring delivery quality, RERA compliance, and long-term asset integrity.</p>

<h2>Investment Outlook: 2026 and Beyond</h2>
<p>For HNI investors, Gurgaon luxury residential property is delivering 15–20% annualised returns when combining rental yields (3–4% for premium properties) with capital appreciation. Commercial assets in Cyber City and Golf Course Road command 7–9% rental yields — among the highest in the country.</p>
<p>The upcoming Global City development near Dwarka Expressway, planned as a 1,000-acre integrated urban district, is expected to create a new premium cluster in western Gurgaon. Early land and plotted investments in this corridor carry significant upside.</p>

<h2>Conclusion</h2>
<p>Gurgaon''s luxury real estate market in 2026 is not simply performing well — it is redefining what premium urban living means in India. For discerning buyers and investors, the window to acquire the finest assets remains open, though the most coveted projects continue to close rapidly. Advisory-backed, off-market access remains the most reliable way to secure best-in-class Gurgaon real estate.</p>',
  'L2S Research',
  '2026-03-10T09:00:00Z',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=630&fit=crop',
  true,
  'Gurgaon Luxury Real Estate Market Report 2026 | L2S Infra',
  'Complete analysis of Gurgaon luxury property market 2026. Price trends, top projects like DLF Arbour, Trump Towers, Max Estate 361. Expert insights for HNI buyers and investors.',
  ARRAY['Gurgaon', 'Luxury Real Estate', 'Market Report', 'Investment', 'Golf Course Road']
),
(
  'Delhi NCR Luxury Real Estate: Investment Guide 2026',
  'delhi-ncr-luxury-real-estate-investment-guide-2026',
  'From Lutyens'' Delhi bungalows to Aerocity''s smart residences — a definitive guide to Delhi NCR''s luxury real estate landscape in 2026. Discover the micro-markets, price benchmarks, and investment strategies that define India''s capital region.',
  '<h2>Delhi NCR: A Market of Contrasts and Extraordinary Opportunity</h2>
<p>Delhi NCR''s luxury real estate market is unlike any other in India. It encompasses the historic exclusivity of Lutyens'' Delhi, the corporate dynamism of Noida''s premium sectors, the established luxury of South Delhi, and the emerging premium corridors of Aerocity and Dwarka Expressway. In 2026, this multi-layered market is delivering compelling opportunities across budget segments — from ₹5 Cr apartments to ₹500 Cr heritage estates.</p>
<p>The National Capital Region''s luxury residential market recorded over ₹28,000 Cr in transactions in 2025, a 31% increase over 2024. This momentum reflects genuine demand from Delhi''s concentration of political leadership, business dynasties, media personalities, and multinational executives.</p>

<h2>Micro-Markets: Delhi NCR''s Luxury Landscape</h2>

<h3>Lutyens'' Delhi — India''s Most Exclusive Address</h3>
<p>Lutyens'' Delhi remains India''s most prestigious residential address, full stop. The tree-lined avenues of Amrita Shergill Marg, Prithviraj Road, and Aurangzeb Road house India''s establishment — industrialists, politicians, and legacy families. Properties here are rarely listed publicly; transactions happen through introductions and advisory networks.</p>
<p>Bungalow prices in Lutyens'' Delhi range from ₹200 Cr to over ₹1,000 Cr. These are generational assets with unmatched historical significance, limited supply, and zero new construction possible due to heritage regulations.</p>

<h3>South Delhi — Old Money Meets Modern Luxury</h3>
<p>Vasant Vihar, Greater Kailash, Defence Colony, and Hauz Khas represent South Delhi''s luxury residential belt. Independent floors and builder floors command ₹10–40 Cr, while luxury apartment complexes in Vasant Kunj and Saket offer premium living at ₹3–8 Cr. South Delhi''s appeal is rooted in its social fabric, school catchment areas, and proximity to international diplomatic enclaves.</p>

<h3>Aerocity — The New Premium Address</h3>
<p>Aerocity is Delhi''s most exciting new luxury cluster. Located adjacent to Indira Gandhi International Airport, this planned urban district hosts India''s highest concentration of 5-star hotels and is now delivering premium residential projects targeting airport-connected HNIs, NRIs, and executives in constant transit. Smart apartments here range from ₹4–8 Cr with airport proximity, metro connectivity, and cutting-edge smart home technology as key differentiators.</p>

<h3>Noida Sector 150 & 94 — The Corporate Luxury Belt</h3>
<p>Noida has shed its satellite-city reputation. Sector 150, with its sports city concept and Formula-1 circuit proximity, has attracted projects from ATS, Godrej, and Prestige that command ₹5,000–₹9,000/sqft. Sector 94 near Noida Expressway hosts ultra-luxury developments with river-facing views and resort amenities.</p>

<h2>Price Benchmarks: Delhi NCR Luxury Segment 2026</h2>
<p>Understanding price per square foot across Delhi NCR''s key markets:</p>
<ul>
<li><strong>Lutyens'' Delhi:</strong> ₹80,000–₹2,00,000/sqft (land value basis)</li>
<li><strong>South Delhi (GK, Vasant Vihar):</strong> ₹25,000–₹50,000/sqft</li>
<li><strong>Aerocity:</strong> ₹15,000–₹22,000/sqft</li>
<li><strong>Noida Sector 150:</strong> ₹7,000–₹10,000/sqft</li>
<li><strong>Greater Noida West (premium):</strong> ₹5,000–₹7,500/sqft</li>
</ul>

<h2>Infrastructure Driving Delhi NCR''s Premium Market</h2>
<p>Three infrastructure projects are reshaping premium real estate values across Delhi NCR in 2026:</p>
<p><strong>Delhi-Meerut RRTS (Rapid Rail):</strong> The Regional Rapid Transit System connecting Delhi to Meerut in 60 minutes is operational on key stretches, creating a new premium residential corridor in Ghaziabad and Meerut for Delhi-employed professionals.</p>
<p><strong>Delhi Metro Phase 4:</strong> The expansion of Delhi Metro''s coverage is creating value uplift of 15–25% in previously underserved luxury pockets of Delhi and Noida.</p>
<p><strong>IGI Airport Terminal 2 Expansion:</strong> Aerocity''s land premium has expanded significantly with the airport''s growing international terminal capacity, reinforcing its status as Delhi''s most globally connected address.</p>

<h2>Commercial Real Estate: Delhi NCR Investment Thesis</h2>
<p>Delhi NCR''s commercial real estate, particularly Grade-A office space in Connaught Place, Aerocity, and Noida Expressway, is delivering 7–10% rental yields in 2026 — among the strongest in Asia for this asset class. With Delhi hosting a growing startup ecosystem alongside established MNC presence, office space demand remains structurally undersupplied in premium locations.</p>

<h2>Regulatory Environment: What Luxury Buyers Must Know</h2>
<p>RERA implementation in Delhi and NCR states has significantly improved buyer protection. All legitimate developers are RERA registered; advisory-backed due diligence should confirm this before any transaction. The Delhi government''s stamp duty rationalisation has reduced transaction costs for luxury properties, improving investment economics.</p>

<h2>Investment Strategy: Delhi NCR 2026</h2>
<p>For pure appreciation, Aerocity residential and emerging Noida sectors offer the strongest near-term capital growth trajectory. For yield-focused investment, Grade-A commercial in Connaught Place and Noida Expressway delivers reliable returns. For legacy/generational wealth preservation, Lutyens'' Delhi and South Delhi addresses remain India''s most reliable stores of value in real estate.</p>

<h2>Conclusion</h2>
<p>Delhi NCR''s luxury real estate market in 2026 rewards informed, advisory-backed investment. The breadth of the market — from heritage bungalows to smart apartments — means that every HNI profile finds a compelling opportunity. The key is identifying the right asset at the right stage, which requires both on-the-ground market intelligence and off-market access that only specialist advisories can provide.</p>',
  'L2S Advisory',
  '2026-03-05T09:00:00Z',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=630&fit=crop',
  true,
  'Delhi NCR Luxury Real Estate Investment Guide 2026 | L2S Infra',
  'Complete Delhi NCR luxury property investment guide 2026. Lutyens Delhi, Aerocity, Noida premium markets, price benchmarks and investment strategy for HNI buyers.',
  ARRAY['Delhi NCR', 'Luxury Real Estate', 'Investment Guide', 'Lutyens Delhi', 'Aerocity', 'Noida']
),
(
  'NRI Property Investment in India 2026: The Complete Legal & Financial Guide',
  'nri-property-investment-india-2026-guide',
  'Everything Non-Resident Indians need to know about investing in Indian real estate in 2026. FEMA regulations, tax implications, repatriation rules, top markets, and the complete advisory-backed process for seamless cross-border property acquisition.',
  '<h2>Why 2026 is the Right Time for NRI Property Investment in India</h2>
<p>India''s real estate market has never been more attractive for Non-Resident Indians. A combination of currency dynamics (the Indian Rupee''s depreciation makes Indian assets more affordable for USD/AED/GBP earners), robust price appreciation, and significantly improved regulatory clarity under RERA has made 2026 a compelling entry point for NRIs considering India property exposure.</p>
<p>NRI investment in Indian real estate reached ₹1.2 lakh crore in 2025, a 38% increase over 2024. Luxury residential — apartments, villas, and plotted developments above ₹3 Cr — accounted for over 45% of this investment, reflecting NRIs'' preference for premium assets that combine lifestyle value with investment returns.</p>

<h2>What Properties Can NRIs Buy in India?</h2>
<p>Under FEMA (Foreign Exchange Management Act) and RBI guidelines, NRIs can freely purchase:</p>
<ul>
<li>Residential properties (apartments, villas, independent houses)</li>
<li>Commercial properties (offices, retail, warehouses)</li>
<li>There is no limit on the number of properties an NRI can own in India</li>
</ul>
<p>NRIs <strong>cannot</strong> purchase agricultural land, farmland, or plantation properties without special RBI approval. This is a critical restriction to note — some developers market "farmhouse plots" that technically qualify as agricultural land. Advisory-backed legal due diligence is essential before any such acquisition.</p>

<h2>FEMA Compliance: What NRIs Must Follow</h2>
<p>All NRI property investments must comply with FEMA regulations. Key requirements:</p>
<p><strong>Payment Mode:</strong> Payments must be made in Indian Rupees through Normal Banking Channels (NBC) — from an NRE (Non-Resident External) or NRO (Non-Resident Ordinary) account, or via inward remittance from abroad. Cash payments are strictly prohibited and can invalidate the transaction.</p>
<p><strong>Loan Eligibility:</strong> NRIs can obtain home loans from Indian banks and NBFCs to purchase property. Loan amounts can be repatriated from NRE/FCNR accounts. Most major Indian banks — HDFC, SBI, ICICI — have dedicated NRI home loan desks with competitive rates.</p>
<p><strong>Documentation:</strong> Valid passport, PAN card (mandatory for transactions above ₹50 Lakhs), OCI/PIO card if applicable, proof of NRI status (employment visa or residence permit), and bank account details.</p>

<h2>Tax Implications for NRI Property Investors</h2>
<p>Understanding tax obligations is critical for NRI investors:</p>

<h3>TDS (Tax Deducted at Source)</h3>
<p>When an NRI sells property in India, the buyer must deduct TDS at 20% (for long-term capital gains) or 30% (for short-term gains) on the sale value. This is the most common tax complication NRIs face. A specialist advisory can help structure transactions to legally optimise TDS liability through capital gains exemption certificates.</p>

<h3>Capital Gains Tax</h3>
<p>Properties held for more than 2 years are taxed as Long-Term Capital Gains (LTCG) at 20% with indexation benefit. Properties sold within 2 years attract Short-Term Capital Gains (STCG) tax at applicable income tax slab rates. NRIs can avail Section 54 exemption by reinvesting LTCG proceeds into another residential property within specified timelines.</p>

<h3>Rental Income</h3>
<p>Rental income from Indian property is taxable in India. NRIs can deduct 30% of the net annual value as a standard deduction, plus municipal taxes and interest on home loans. India has Double Taxation Avoidance Agreements (DTAAs) with 90+ countries, which typically provide relief to NRIs from being taxed twice on the same income.</p>

<h2>Repatriation of Investment</h2>
<p>NRIs can repatriate up to USD 1 million per financial year from the sale of property in India, subject to:</p>
<ul>
<li>The property was purchased from NRE/FCNR account funds or inward remittance</li>
<li>All applicable taxes have been paid</li>
<li>A Chartered Accountant certificate (Form 15CB) and Form 15CA filed</li>
</ul>
<p>For properties purchased from NRO account funds, repatriation is limited to USD 1 million per year after applicable taxes. Proper documentation from point of purchase is essential to enable smooth repatriation years later.</p>

<h2>Power of Attorney: Managing Property from Abroad</h2>
<p>A General Power of Attorney (GPA) or Special Power of Attorney (SPA) is essential for NRIs who cannot be physically present for property transactions. The PoA must be:</p>
<ul>
<li>Notarised in the country of residence and apostilled</li>
<li>Stamped and registered in India upon arrival</li>
<li>Specific in its scope — overly broad PoAs can create legal complications</li>
</ul>
<p>L2S Infra''s NRI desk coordinates the complete PoA process, ensuring documentation is correctly prepared across jurisdictions and that the appointed representative acts within defined parameters.</p>

<h2>Best Markets for NRI Investment in 2026</h2>

<h3>Gurgaon (NCR) — Top NRI Choice</h3>
<p>Gurgaon is consistently the #1 destination for NRI luxury investment. The city''s corporate ecosystem, world-class infrastructure, and concentration of branded luxury projects (Trump Towers, DLF, Godrej) make it the most recognisable Indian luxury address globally. Golf Course Road and the Golf Course Extension corridor are particularly sought-after.</p>

<h3>Mumbai — Gateway City Premium</h3>
<p>Worli, Bandra, and Lower Parel command the highest absolute prices in India. For NRIs seeking a Mumbai asset, off-market access to Worli Sea Face and Bandra Bandstand penthouses represents the pinnacle of Indian luxury real estate. Rental yields of 2.5–3.5% are supplemented by 15–20% capital appreciation, making Mumbai a strong total-return market.</p>

<h3>Bangalore — Tech-Wealth Driven Luxury</h3>
<p>Bangalore''s luxury market is driven by tech wealth — NRIs from Silicon Valley and Singapore who have benefited from ESOP value often choose Bangalore for its familiarity and connectivity. Whitefield, Koramangala, and UB City remain premium addresses. The upcoming metro expansion is creating new appreciation corridors.</p>

<h2>The L2S Infra NRI Advisory Process</h2>
<p>Our dedicated NRI desk provides end-to-end support:</p>
<ol>
<li><strong>Virtual Consultation:</strong> Video call with our advisory team to understand your goals, timeline, and budget</li>
<li><strong>Curated Shortlist:</strong> We identify 3–5 properties matching your criteria, including off-market opportunities</li>
<li><strong>Virtual Property Tours:</strong> High-resolution video walkthroughs with our team on-site for real-time Q&A</li>
<li><strong>Legal Due Diligence:</strong> Title verification, RERA compliance check, encumbrance certificate review</li>
<li><strong>Transaction Management:</strong> Coordinate PoA, payment processing, registration</li>
<li><strong>Post-Purchase Support:</strong> Property management, rental placement, periodic valuation updates</li>
</ol>

<h2>Conclusion</h2>
<p>India''s luxury real estate market in 2026 offers NRIs a rare combination: high returns, lifestyle value, and the emotional connection of owning a home in the country of origin. The regulatory environment has never been cleaner, the advisory ecosystem never more professional. With the right guidance, NRI property investment in India is one of the most compelling wealth-creation strategies available to the global Indian community today.</p>',
  'L2S Advisory',
  '2026-02-28T09:00:00Z',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
  true,
  'NRI Property Investment India 2026: Complete Legal & Financial Guide | L2S Infra',
  'Complete NRI property investment guide India 2026. FEMA compliance, tax implications, repatriation rules, top markets Gurgaon Mumbai Bangalore. Expert advisory for Non-Resident Indians.',
  ARRAY['NRI Investment', 'FEMA', 'India Real Estate', 'NRI Guide', 'Property Tax', 'Repatriation']
);

-- Seed: 9 Property Listings (Real Gurgaon Projects)
insert into properties (title, slug, property_type, location, city, price, area, bedrooms, description, features, status, developer, image_url, is_featured, meta_title, meta_description) values
(
  'DLF The Arbour',
  'dlf-the-arbour-sector-63-gurgaon',
  'residential',
  'Sector 63, Golf Course Extension Road',
  'Gurgaon',
  '₹7 Cr – ₹10 Cr',
  '3,500 – 4,800 sq ft',
  '4 BHK',
  'DLF The Arbour is an ultra-luxury residential tower on Golf Course Extension Road, Sector 63, Gurgaon. Designed as a statement in modern luxury, The Arbour features expansive 4 BHK residences with floor-to-ceiling glazing, private terraces, and breathtaking views of the Aravalli range. Each residence is crafted with premium Italian marble flooring, modular kitchens, and a complete building management system. The project offers resort-calibre amenities including a rooftop infinity pool, private cinema, golf simulator, business lounge, and a curated spa — all within a landscaped, gated estate.',
  'Ultra-luxury 4 BHK residences, Private terraces, Aravalli views, Rooftop infinity pool, Golf simulator, Private cinema, Italian marble flooring, Smart home automation, 24/7 concierge',
  'available',
  'DLF',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  true,
  'DLF The Arbour Sector 63 Gurgaon | Luxury 4 BHK Apartments',
  'DLF The Arbour, Sector 63 Golf Course Extension Road, Gurgaon. Ultra-luxury 4 BHK apartments 3500-4800 sqft at ₹7-10 Cr. Rooftop pool, Aravalli views, DLF quality.'
),
(
  'Max Estate 361',
  'max-estate-361-sector-36a-gurgaon',
  'residential',
  'Sector 36A, Dwarka Expressway',
  'Gurgaon',
  '₹5 Cr – ₹8 Cr',
  '2,800 – 4,200 sq ft',
  '3 BHK / 4 BHK',
  'Max Estate 361 at Sector 36A, Dwarka Expressway, represents Max Estates'' flagship luxury residential offering in Gurgaon. Positioned in the heart of the fast-appreciating Dwarka Expressway corridor, this development brings together thoughtfully designed residences with a deep commitment to wellness, nature, and community. The project features sky gardens, a forest trail, and over 80% open green space — a rarity in Gurgaon''s urban landscape. With direct Dwarka Expressway connectivity and proximity to the upcoming Global City development, Max Estate 361 is a prime investment in Gurgaon''s western premium corridor.',
  '3 & 4 BHK luxury residences, Sky gardens & forest trail, 80%+ open green space, Wellness centre, Clubhouse & sports courts, Dwarka Expressway frontage, Smart home features, IGBC certified',
  'available',
  'Max Estates',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  true,
  'Max Estate 361 Sector 36A Gurgaon | Luxury 3 & 4 BHK Apartments',
  'Max Estate 361, Sector 36A Dwarka Expressway Gurgaon. Luxury 3 & 4 BHK residences 2800-4200 sqft at ₹5-8 Cr. Sky gardens, forest trail, wellness focus.'
),
(
  'Birla Arika',
  'birla-arika-sector-31-gurgaon',
  'residential',
  'Sector 31, Golf Course Road',
  'Gurgaon',
  '₹4 Cr – ₹7 Cr',
  '2,500 – 3,800 sq ft',
  '3 BHK / 4 BHK',
  'Birla Arika, developed by Birla Estates at Sector 31, Golf Course Road, is a premium luxury residential development that exemplifies the Birla Group''s legacy of quality and trust. Located in one of Gurgaon''s most established and well-connected neighbourhoods, Birla Arika offers 3 and 4 BHK residences designed with a focus on spaciousness, natural light, and enduring elegance. The development''s proximity to Golf Course Road ensures immediate access to Gurgaon''s finest commercial, retail, and hospitality destinations. Birla''s reputation for delivering on promises makes this a low-risk, high-quality investment for discerning buyers.',
  '3 & 4 BHK premium residences, Golf Course Road location, Birla Estates quality assurance, Clubhouse & swimming pool, Landscaped gardens, Vastu-compliant design, Premium fixtures & fittings, RERA registered',
  'available',
  'Birla Estates',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  true,
  'Birla Arika Sector 31 Golf Course Road Gurgaon | Luxury Apartments',
  'Birla Arika, Sector 31 Golf Course Road Gurgaon by Birla Estates. Premium 3 & 4 BHK residences 2500-3800 sqft at ₹4-7 Cr. Birla quality, prime location.'
),
(
  'Sobha Aranya – Karma Lakeland',
  'sobha-aranya-karma-lakeland-sohna-road-gurgaon',
  'residential',
  'Sohna Road, Sector 80',
  'Gurgaon',
  '₹3.5 Cr – ₹6 Cr',
  '2,200 – 4,000 sq ft',
  '3 BHK / 4 BHK',
  'Sobha Aranya – Karma Lakeland is a unique luxury residential development by Sobha Ltd on Sohna Road, combining the precision of Sobha''s self-built quality with an expansive, nature-centric campus. Spread across a sprawling estate, Karma Lakeland offers the rare combination of a lakeside setting within Gurgaon''s urban envelope. Residents enjoy the serenity of lake views, walking trails, and resort-style amenities while remaining connected to the city''s commercial hubs. For buyers seeking a departure from conventional luxury apartments toward an integrated lifestyle community, Sobha Aranya is an exceptional offering.',
  'Lake-facing residences, Self-built Sobha quality, Nature-integrated campus, Walking & cycling trails, Lakeside clubhouse, Resort amenities, Sohna Road connectivity, Sobha Ltd delivery assurance',
  'available',
  'Sobha Ltd',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
  false,
  'Sobha Aranya Karma Lakeland Sohna Road Gurgaon | Luxury Lake-Facing Residences',
  'Sobha Aranya Karma Lakeland, Sector 80 Sohna Road Gurgaon. Luxury 3 & 4 BHK lake-facing residences at ₹3.5-6 Cr. Sobha quality, nature campus, lakeside living.'
),
(
  'Signature Global Sarvam',
  'signature-global-sarvam-sector-71-gurgaon',
  'residential',
  'Sector 71, Sohna Road',
  'Gurgaon',
  '₹2.5 Cr – ₹4.5 Cr',
  '1,800 – 3,200 sq ft',
  '3 BHK / 4 BHK',
  'Signature Global Sarvam at Sector 71, Sohna Road, is Signature Global''s premium residential offering, bringing international design standards to one of Gurgaon''s fastest-growing corridors. The project features contemporary architecture, expansive residences with private utility balconies, and a full suite of premium amenities across a landscaped podium. Sector 71''s improving social infrastructure — schools, hospitals, and retail — combined with easy access to both NH-48 and Sohna Road makes Sarvam a compelling investment for buyers seeking premium value with strong appreciation potential.',
  '3 & 4 BHK premium residences, Podium-level amenities, Swimming pool & gym, Children''s play area, Multi-level parking, Sohna Road frontage, Close to schools & hospitals, RERA registered',
  'available',
  'Signature Global',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  false,
  'Signature Global Sarvam Sector 71 Sohna Road Gurgaon | Premium 3 & 4 BHK',
  'Signature Global Sarvam, Sector 71 Sohna Road Gurgaon. Premium 3 & 4 BHK residences 1800-3200 sqft at ₹2.5-4.5 Cr. International design, podium amenities.'
),
(
  'Trump Tower & Trump Residences',
  'trump-tower-trump-residences-sector-65-gurgaon',
  'residential',
  'Sector 65, Golf Course Extension Road',
  'Gurgaon',
  '₹10 Cr – ₹25 Cr',
  '3,800 – 7,500 sq ft',
  '4 BHK / 5 BHK Penthouse',
  'Trump Tower & Trump Residences at Sector 65, Golf Course Extension Road, is India''s most prestigious branded luxury residential address. Developed by Tribeca Developers in partnership with The Trump Organisation, these towers represent the apex of luxury living in Gurgaon — and arguably in India. Every residence features soaring ceiling heights, panoramic glazing, imported marble and stone, fully fitted kitchens with Gaggenau appliances, and access to the Gold Standard of amenities: a 25-metre lap pool, private cinema, wine lounge, business centre, and a dedicated concierge team. The Trump brand commands an international premium that few other addresses in India can match.',
  'Branded luxury residences, Trump-branded concierge services, Gaggenau kitchen appliances, Imported Italian marble, 25m lap pool, Private cinema & wine lounge, Business centre, Golf Course Extension Road address, Valet parking',
  'available',
  'Tribeca Developers (Trump Organisation)',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  true,
  'Trump Tower & Trump Residences Sector 65 Gurgaon | Ultra-Luxury Branded Apartments',
  'Trump Tower & Trump Residences, Sector 65 Golf Course Extension Road Gurgaon. Ultra-luxury 4 BHK & penthouses 3800-7500 sqft at ₹10-25 Cr. Tribeca Developers, Trump brand, Gold Standard amenities.'
),
(
  'Godrej Sector 53',
  'godrej-sector-53-golf-course-road-gurgaon',
  'residential',
  'Sector 53, Golf Course Road',
  'Gurgaon',
  '₹5 Cr – ₹8 Cr',
  '2,800 – 4,500 sq ft',
  '3 BHK / 4 BHK',
  'Godrej Sector 53 on Golf Course Road is Godrej Properties'' luxury residential offering in one of Gurgaon''s most coveted addresses. This development brings together Godrej''s 125-year legacy of trust with contemporary architectural sensibilities and premium finishes. Located on Golf Course Road — Gurgaon''s marquee address — the project offers unparalleled connectivity to the rapid metro, Cyber City, and premium retail. Residences are designed for maximum natural ventilation and light, with expansive balconies, high-quality hardware, and a building management system that ensures seamless living. Godrej''s delivery track record makes this a safe, prestigious investment.',
  'Godrej quality assurance, Golf Course Road prime location, 3 & 4 BHK luxury residences, Metro connectivity, Landscaped podium, Clubhouse & swimming pool, 24/7 security & concierge, IGBC certified',
  'available',
  'Godrej Properties',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  false,
  'Godrej Sector 53 Golf Course Road Gurgaon | Luxury 3 & 4 BHK Apartments',
  'Godrej Sector 53, Golf Course Road Gurgaon by Godrej Properties. Luxury 3 & 4 BHK residences 2800-4500 sqft at ₹5-8 Cr. Trusted Godrej quality, prime location.'
),
(
  'Sobha Sector 63A',
  'sobha-sector-63a-golf-course-extension-gurgaon',
  'residential',
  'Sector 63A, Golf Course Extension Road',
  'Gurgaon',
  '₹4 Cr – ₹6.5 Cr',
  '2,200 – 3,500 sq ft',
  '3 BHK / 4 BHK',
  'Sobha Sector 63A on Golf Course Extension Road is a testament to Sobha Ltd''s uncompromising construction standards and design philosophy. Sobha''s unique backward integration model — where they manufacture their own concrete, joinery, and interiors — ensures a level of quality consistency that is unmatched in Indian luxury real estate. Located in Sector 63A, this project benefits from the Golf Course Extension Road''s established social and commercial infrastructure while offering Sobha''s signature precision in delivery and finishing. For buyers who prioritise quality above all else, Sobha Sector 63A is the definitive choice.',
  'Sobha backward integration quality, 3 & 4 BHK premium residences, Golf Course Extension Road location, Precision construction standards, Clubhouse & pool, Landscaped grounds, Investment-grade quality, On-time delivery record',
  'available',
  'Sobha Ltd',
  'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&h=600&fit=crop',
  false,
  'Sobha Sector 63A Golf Course Extension Gurgaon | Premium 3 & 4 BHK Apartments',
  'Sobha Sector 63A, Golf Course Extension Road Gurgaon by Sobha Ltd. Premium 3 & 4 BHK residences 2200-3500 sqft at ₹4-6.5 Cr. Sobha quality, GCERP location.'
),
(
  'Ashiana Aaroham',
  'ashiana-aaroham-sector-99-gurgaon',
  'residential',
  'Sector 99, Dwarka Expressway',
  'Gurgaon',
  '₹1.8 Cr – ₹3.5 Cr',
  '1,400 – 2,800 sq ft',
  '2 BHK / 3 BHK',
  'Ashiana Aaroham at Sector 99, Dwarka Expressway, is Ashiana Housing''s flagship premium senior living and family residential community in Gurgaon. Designed for those who seek a purposeful, community-oriented lifestyle with all conveniences within reach, Aaroham combines thoughtfully designed residences with an unparalleled range of community amenities. For senior citizens, the development offers 24/7 emergency response, on-site medical facilities, and a robust community programme. For families, the quiet, green, well-maintained campus represents exceptional value on the rapidly appreciating Dwarka Expressway corridor.',
  '2 & 3 BHK family and senior-living residences, 24/7 emergency response system, On-site medical centre, Community hall & activity centre, Swimming pool & fitness, Dwarka Expressway location, Ashiana trusted brand, Well-managed campus',
  'available',
  'Ashiana Housing',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  false,
  'Ashiana Aaroham Sector 99 Dwarka Expressway Gurgaon | Premium Family & Senior Living',
  'Ashiana Aaroham, Sector 99 Dwarka Expressway Gurgaon by Ashiana Housing. Premium 2 & 3 BHK family & senior living at ₹1.8-3.5 Cr. Trusted brand, community living.'
);
